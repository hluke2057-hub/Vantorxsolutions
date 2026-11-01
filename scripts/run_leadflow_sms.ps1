<#
.SYNOPSIS
  VantorX Solutions - LeadFlow Automated SMS Outreach Runner (Native PowerShell)
#>

param(
    [int]$BatchSize = 10,
    [switch]$Live
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$AuditsFile = Join-Path $RepoRoot "data\mystery_shopper_audits.json"
$SmsQueueFile = Join-Path $RepoRoot "data\leadflow_sms_queue.json"
$WebSmsQueueFile = Join-Path $RepoRoot "website\data\leadflow_sms_queue.json"
$EnvFile = Join-Path $RepoRoot ".env"

$TwilioSid = $env:TWILIO_ACCOUNT_SID
$TwilioToken = $env:TWILIO_AUTH_TOKEN
$TwilioPhone = $env:TWILIO_PHONE_NUMBER

if (Test-Path $EnvFile) {
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match "^\s*TWILIO_ACCOUNT_SID\s*=\s*(.*)$") { $TwilioSid = $Matches[1].Trim() }
        if ($_ -match "^\s*TWILIO_AUTH_TOKEN\s*=\s*(.*)$") { $TwilioToken = $Matches[1].Trim() }
        if ($_ -match "^\s*TWILIO_PHONE_NUMBER\s*=\s*(.*)$") { $TwilioPhone = $Matches[1].Trim() }
    }
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  VANTORX SOLUTIONS -- LEADFLOW AUTOMATED SMS OUTREACH     " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$isLive = [bool]($TwilioSid -and $TwilioToken -and $TwilioPhone -and $Live)
if ($isLive) {
    Write-Host "[MODE] TWILIO LIVE OUTREACH ACTIVE ($TwilioPhone)" -ForegroundColor Green
} else {
    Write-Host "[MODE] SAFE VERIFIED SIMULATION MODE" -ForegroundColor Yellow
    Write-Host "       (Configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env to enable physical carrier dispatch)" -ForegroundColor DarkGray
}

if (-not (Test-Path $AuditsFile)) {
    Write-Host "[!] Audits file not found: $AuditsFile" -ForegroundColor Red
    exit 1
}

$rawAudits = Get-Content $AuditsFile -Raw -Encoding utf8
if ($rawAudits[0] -eq [char]0xFEFF) { $rawAudits = $rawAudits.Substring(1) }
$audits = $rawAudits | ConvertFrom-Json

$existingQueue = @()
if (Test-Path $SmsQueueFile) {
    try {
        $rawQueue = Get-Content $SmsQueueFile -Raw -Encoding utf8
        if ($rawQueue[0] -eq [char]0xFEFF) { $rawQueue = $rawQueue.Substring(1) }
        $existingQueue = $rawQueue | ConvertFrom-Json
    } catch {}
}

$sentLeadIds = @{}
foreach ($item in $existingQueue) {
    if ($item.leadId) { $sentLeadIds[$item.leadId] = $true }
}

$eligibleAudits = $audits | Where-Object { -not $sentLeadIds.ContainsKey($_.leadId) -and $_.phone }
Write-Host "[+] Eligible Contractor Owners Ready: $($eligibleAudits.Count)" -ForegroundColor Cyan
Write-Host "[+] Dispatching Next Batch:           $([Math]::Min($BatchSize, $eligibleAudits.Count))`n" -ForegroundColor White

$batch = $eligibleAudits | Select-Object -First $BatchSize
$newlyDispatched = [System.Collections.Generic.List[PSObject]]::new()
$updatedQueue = [System.Collections.Generic.List[PSObject]]::new()

foreach ($item in $existingQueue) {
    $updatedQueue.Add($item)
}

$counter = 1
foreach ($target in $batch) {
    $digits = $target.phone -replace '\D', ''
    $e164 = $null
    if ($digits.Length -eq 10) { $e164 = "+1$digits" }
    elseif ($digits.Length -eq 11 -and $digits.StartsWith("1")) { $e164 = "+$digits" }

    if (-not $e164) {
        Write-Host "[-] Skipping $($target.company): Invalid phone format ($($target.phone))" -ForegroundColor Red
        continue
    }

    $msg = $target.smsPitch
    Write-Host "[$counter/$($batch.Count)] To: $($target.company) ($($target.owner)) - $e164" -ForegroundColor White
    Write-Host "   Message: `"$msg`"" -ForegroundColor Gray

    $smsId = $null
    $provider = "simulation_staged"
    $status = "staged_simulation"

    if ($isLive) {
        try {
            $uri = "https://api.twilio.com/2010-04-01/Accounts/$TwilioSid/Messages.json"
            $pair = "$($TwilioSid):$($TwilioToken)"
            $bytes = [System.Text.Encoding]::ASCII.GetBytes($pair)
            $base64 = [Convert]::ToBase64String($bytes)

            $bodyParams = @{
                To = $e164
                From = $TwilioPhone
                Body = $msg
            }
            $resp = Invoke-RestMethod -Uri $uri -Method Post -Headers @{ Authorization = "Basic $base64" } -Body $bodyParams
            $smsId = $resp.sid
            $provider = "twilio_live"
            $status = "delivered"
            Write-Host "   [+] DISPATCHED VIA TWILIO! SID: $smsId`n" -ForegroundColor Green
        } catch {
            Write-Host "   [!] Twilio delivery error: $($_.Exception.Message)`n" -ForegroundColor Red
            continue
        }
    } else {
        $smsId = "sim_sms_" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds() + "_" + $counter
        Write-Host "   [+] STAGED (Simulation Mode) ID: $smsId`n" -ForegroundColor Yellow
    }

    $record = [PSCustomObject]@{
        id = $smsId
        leadId = $target.leadId
        company = $target.company
        owner = $target.owner
        phone = $target.phone
        e164Phone = $e164
        city = $target.city
        trade = $target.trade
        message = $msg
        provider = $provider
        status = $status
        monthlyBleed = $target.monthlyBleed
        dispatchedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    }

    $updatedQueue.Add($record)
    $newlyDispatched.Add($record)
    $counter++
}

$jsonOut = $updatedQueue | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText($SmsQueueFile, $jsonOut, (New-Object System.Text.UTF8Encoding($false)))
[System.IO.File]::WriteAllText($WebSmsQueueFile, $jsonOut, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "[+] Total SMS Logged in Queue: $($updatedQueue.Count)" -ForegroundColor Green
Write-Host "[+] Newly Dispatched in Batch: $($newlyDispatched.Count)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
