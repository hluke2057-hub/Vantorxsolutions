<#
.SYNOPSIS
  Automated Test Suite for Mystery Shopper Engine & LeadFlow SMS Outreach
#>

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  TEST SUITE: MYSTERY SHOPPER & LEADFLOW SMS ENGINES      " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$passCount = 0
$failCount = 0

function Assert-Test([string]$name, [bool]$condition) {
    if ($condition) {
        Write-Host "  [PASS] $name" -ForegroundColor Green
        $script:passCount++
    } else {
        Write-Host "  [FAIL] $name" -ForegroundColor Red
        $script:failCount++
    }
}

# 1. Mystery Shopper Files & Structure
$auditsFile = Join-Path $RepoRoot "data\mystery_shopper_audits.json"
$webAuditsFile = Join-Path $RepoRoot "website\data\mystery_shopper_audits.json"

Assert-Test "data/mystery_shopper_audits.json exists" (Test-Path $auditsFile)
Assert-Test "website/data/mystery_shopper_audits.json exists" (Test-Path $webAuditsFile)

$audits = Get-Content $auditsFile -Raw -Encoding utf8 | ConvertFrom-Json
Assert-Test "Mystery Shopper contains >= 50 contractor audits" ($audits.Count -ge 50)

$firstAudit = $audits[0]
Assert-Test "Audit has leadId" ([bool]$firstAudit.leadId)
Assert-Test "Audit has company name" ([bool]$firstAudit.company)
Assert-Test "Audit has ringCount >= 5" ($firstAudit.ringCount -ge 5)
Assert-Test "Audit has monthlyBleed >= 3000" ($firstAudit.monthlyBleed -ge 3000)
Assert-Test "Audit has customized emailPitch" ([bool]$firstAudit.emailPitch.subject -and $firstAudit.emailPitch.body.Contains("mystery shopper"))
Assert-Test "Audit has customized smsPitch" ([bool]$firstAudit.smsPitch.Contains("Rang") -and $firstAudit.smsPitch.Contains("(561) 813-8602"))

# 2. LeadFlow SMS Queue & E.164 Formatting
$smsQueueFile = Join-Path $RepoRoot "data\leadflow_sms_queue.json"
$webSmsQueueFile = Join-Path $RepoRoot "website\data\leadflow_sms_queue.json"

Assert-Test "data/leadflow_sms_queue.json exists" (Test-Path $smsQueueFile)
Assert-Test "website/data/leadflow_sms_queue.json exists" (Test-Path $webSmsQueueFile)

$smsQueue = Get-Content $smsQueueFile -Raw -Encoding utf8 | ConvertFrom-Json
Assert-Test "LeadFlow SMS queue contains logged messages" ($smsQueue.Count -ge 1)

$firstSms = $smsQueue[0]
Assert-Test "SMS has valid E.164 phone (+1XXXXXXXXXX)" ($firstSms.e164Phone -match '^\+1\d{10}$')
Assert-Test "SMS message body contains proof link" ($firstSms.message.Contains("https://www.vantorxsolutions.com/audit/?id="))
Assert-Test "SMS message body contains Ava demo line" ($firstSms.message.Contains("(561) 813-8602"))
Assert-Test "SMS record has valid provider status" ($firstSms.provider -eq "simulation_staged" -or $firstSms.provider -eq "twilio_live")

# 3. Daily Briefing HTML Integration
$briefingScript = Join-Path $RepoRoot "scripts\generate_daily_briefing.ps1"
powershell -ExecutionPolicy Bypass -File $briefingScript | Out-Null

$latestReport = Join-Path $RepoRoot "reports\daily_briefing_latest.html"
Assert-Test "reports/daily_briefing_latest.html was generated" (Test-Path $latestReport)

$reportHtml = Get-Content $latestReport -Raw -Encoding utf8
Assert-Test "Briefing contains Section 5 (Mystery Shopper Proof-of-Leak Intel)" ($reportHtml.Contains("5. Mystery Shopper Proof-of-Leak Intel"))
Assert-Test "Briefing contains Section 6 (LeadFlow 90-Second SMS Outreach)" ($reportHtml.Contains("6. LeadFlow 90-Second SMS Outreach"))
Assert-Test "Briefing displays total bleed metrics" ($reportHtml.Contains("Monthly Bleed Found"))
Assert-Test "Briefing displays SMS queue status" ($reportHtml.Contains("SMS in Queue"))

# 4. Cloud Outbound Autopilot Telemetry
$cloudEngine = Join-Path $RepoRoot "scripts\cloud_outbound_engine.js"
$cloudContent = Get-Content $cloudEngine -Raw -Encoding utf8
Assert-Test "cloud_outbound_engine.js reports Mystery Shopper status" ($cloudContent.Contains("Mystery Shopper Proofs:"))
Assert-Test "cloud_outbound_engine.js reports LeadFlow SMS status" ($cloudContent.Contains("LeadFlow SMS Engine:"))

# 5. Headless Edge DOM Check for Audit Page Mystery Shopper Card
$edgePaths = @(
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "${env:ProgramFiles}\Microsoft\Edge\Application\msedge.exe",
  "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe"
)
$edgePath = $edgePaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($edgePath) {
    Write-Host "`nRunning Headless Edge DOM Verification on audit/?id=bw_043&shopper=1..." -ForegroundColor Cyan
    $auditHtmlPath = Join-Path $RepoRoot "website\audit\index.html"
    $auditContent = Get-Content $auditHtmlPath -Raw -Encoding utf8
    
    $injected = $auditContent.Replace("<script>", "<script>`nwindow.__SEARCH_PARAMS = '?id=bw_043&shopper=1';`n")
    $tmpRunner = Join-Path $RepoRoot "website\audit\test_runner_audit.html"
    [System.IO.File]::WriteAllText($tmpRunner, $injected, (New-Object System.Text.UTF8Encoding($false)))

    $fileUri = "file:///" + ($tmpRunner -replace '\\', '/')
    $dumpStr = & $edgePath --headless=new --disable-gpu --dump-dom $fileUri | Out-String

    Assert-Test "Audit page renders shopperProofCard on ?shopper=1" ($dumpStr.Contains('id="shopperProofCard"'))
    Assert-Test "Audit page displays CONFIRMED LEAK badge" ($dumpStr.Contains('CONFIRMED LEAK'))
    Assert-Test "Audit page displays Rings to Answer" ($dumpStr.Contains('Rings to Answer'))

    Remove-Item $tmpRunner -ErrorAction SilentlyContinue
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "TEST RESULTS SUMMARY: $passCount / $($passCount + $failCount) PASSED" -ForegroundColor $(if ($failCount -eq 0) { "Green" } else { "Red" })
Write-Host "==========================================================" -ForegroundColor Cyan

if ($failCount -gt 0) { exit 1 }
