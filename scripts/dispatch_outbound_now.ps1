# PowerShell Script: 1-Click Live Outbound Dispatcher
# Dispatches real verified contractor emails physically via Resend API
# Usage:
#   .\scripts\dispatch_outbound_now.ps1               # Sends next 5 pending leads live
#   .\scripts\dispatch_outbound_now.ps1 -BatchSize 10 # Sends next 10 pending leads live
#   .\scripts\dispatch_outbound_now.ps1 -DryRun       # Previews emails without sending

[CmdletBinding()]
param(
    [int]$BatchSize = 5,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$queueFile = Join-Path $repoRoot "data/verified_targets_queue.json"
$webQueueFile = Join-Path $repoRoot "website/data/verified_targets_queue.json"
$intelFile = Join-Path $repoRoot "data/outbound_intelligence.json"
$webIntelFile = Join-Path $repoRoot "website/data/outbound_intelligence.json"
$csvFile = Join-Path $repoRoot "data/outbound_cloud_campaign.csv"
$envFile = Join-Path $repoRoot ".env"

# 1. Resolve Environment & Resend API Key
$resendKey = $env:RESEND_API_KEY
$senderEmail = if ($env:SENDER_EMAIL) { $env:SENDER_EMAIL } else { "luke@vantorxsolutions.com" }
$demoPhone = if ($env:DEMO_PHONE) { $env:DEMO_PHONE } else { "(561) 813-8602" }
$websiteUrl = "https://www.vantorxsolutions.com"

if (-not $resendKey -and (Test-Path $envFile)) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*RESEND_API_KEY\s*=\s*(.+)$') { $resendKey = $matches[1].Trim() }
        if ($_ -match '^\s*SENDER_EMAIL\s*=\s*(.+)$') { $senderEmail = $matches[1].Trim() }
        if ($_ -match '^\s*DEMO_PHONE\s*=\s*(.+)$') { $demoPhone = $matches[1].Trim() }
    }
}

if (-not $resendKey) {
    Write-Host "⚠️  RESEND_API_KEY not found in environment or .env. Please configure RESEND_API_KEY." -ForegroundColor Yellow
}

Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "   VANTORX SOLUTIONS -- 1-CLICK PHYSICAL OUTBOUND DISPATCHER                  " -ForegroundColor Cyan
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host ("Sender:         Luke <" + $senderEmail + ">") -ForegroundColor White
Write-Host ("Demo Line:      " + $demoPhone) -ForegroundColor White
$modeStr = if ($DryRun) { "DRY RUN (Preview Only)" } else { "LIVE RESEND DISPATCH" }
$modeColor = if ($DryRun) { "Yellow" } else { "Green" }
Write-Host ("Mode:           " + $modeStr) -ForegroundColor $modeColor
Write-Host ("Batch Size:     " + $BatchSize) -ForegroundColor White
Write-Host ""

# 2. Load Queue
if (-not (Test-Path $queueFile)) {
    throw "Queue file not found: $queueFile"
}

$queue = Get-Content $queueFile -Raw | ConvertFrom-Json
$pending = @($queue | Where-Object { $_.status -eq 'pending' } | Sort-Object -Property touch -Descending)

Write-Host ("Total Queue:    " + $queue.Count + " verified contractors") -ForegroundColor Gray
Write-Host ("Pending Ready:  " + $pending.Count + " uncontacted contractors") -ForegroundColor Yellow

if ($pending.Count -eq 0) {
    Write-Host "⚠️  No pending targets found. Running sync to auto-replenish queue..." -ForegroundColor Yellow
    & (Join-Path $PSScriptRoot "sync_verified_queue.ps1")
    $queue = Get-Content $queueFile -Raw | ConvertFrom-Json
    $pending = @($queue | Where-Object { $_.status -eq 'pending' })
    Write-Host ("Replenished Pending Ready: " + $pending.Count) -ForegroundColor Green
}

if ($pending.Count -eq 0) {
    Write-Host "All targets contacted and queue is up to date." -ForegroundColor Green
    return
}

# 3. Take Batch
$countToTake = [Math]::Min($BatchSize, $pending.Count)
$batch = $pending[0..($countToTake - 1)]
$dispatched = [System.Collections.Generic.List[PSObject]]::new()

function Get-EmailPayload {
    param($target)
    $touch = if ($target.touch) { $target.touch } else { 1 }
    $service = if ($target.service) { $target.service } else { "AEO Engine & 24/7 Voice AI" }

    if ($touch -eq 2) {
        $baseSubject = if ($target.subject) { $target.subject } else { "Quick question for " + $target.owner + " regarding " + $target.company }
        if (-not ($baseSubject -match '^Re:\s*')) {
            $subject = "Re: " + $baseSubject
        } else {
            $subject = $baseSubject
        }
        $body = @"
Hi $($target.owner),

Following up on my note from earlier this week -- I know you're busy running field crews at $($target.company).

I wanted to leave you our direct demo line: $demoPhone.

If you call it from your cell phone right now, you can experience Ava (our AI phone receptionist) firsthand. She speaks naturally, triages urgent $($target.trade) emergencies, and books directly into your calendar without putting callers on hold.

Would you be open to a quick 10-minute Zoom screen share this week to see how we've set this up for other trade contractors?

Best,
Luke
Founder, VantorX Solutions
Direct: $demoPhone
Website: $websiteUrl
"@
        return @{ Subject = $subject; Body = $body }
    }

    if ($touch -eq 3) {
        $subject = "Final note regarding " + $target.company + " call capture"
        $body = @"
Hi $($target.owner),

I haven't heard back, so I assume you're either completely satisfied with your current call capture setup or simply swamped in the field right now.

Before I close out your audit file for $($target.city), I wanted to share the live pricing and technical architecture we use for trade contractors:
-> $websiteUrl#pricing

If you ever want to plug the $($target.estLoss) leak from missed calls or test our AI receptionist, you can always test Ava 24/7 at $demoPhone or grab 15 minutes on my calendar.

Wishing you and the crew at $($target.company) a great season.

Best,
Luke
Founder, VantorX Solutions
Direct: $demoPhone
Website: $websiteUrl
"@
        return @{ Subject = $subject; Body = $body }
    }

    # Touch 1
    if ($service -match 'AI Receptionist|Ava') {
        $subject = if ($target.subject) { $target.subject } else { "Quick question for $($target.owner) regarding $($target.company) after-hours emergency calls" }
        $body = @"
Hi $($target.owner),

Saw your solid reputation in $($target.city) -- congrats on building a trusted local brand.

I was auditing local $($target.trade) providers in $($target.city) and noticed that after 5:00 PM and on weekends, customer calls either hit an answering service or go straight to voicemail.

In emergency $($target.trade), homeowners needing immediate help almost never wait for a callback -- they hang up and call the next competitor who answers. We calculated that missing just 2-3 emergency calls a week costs the average local contractor roughly $($target.estLoss) in lost jobs.

We built Ava, an AI phone receptionist designed specifically for trade contractors:
1. Answers in 1 ring, 24/7/365, with natural human conversation
2. Triages true emergencies vs. general inquiries
3. Books appointments directly into your Google / Outlook calendar
4. Sends priority SMS alerts directly to your on-call crew

Could we jump on a brief 10-15 minute Zoom screen share this week so I can show you how Ava handles a live emergency call test?

You can also test Ava live right now from your cell phone at $demoPhone.

Best,
Luke
Founder, VantorX Solutions
Direct: $demoPhone
Website: $websiteUrl
"@
        return @{ Subject = $subject; Body = $body }
    }

    if ($service -match 'Speed-to-Lead|Missed-Call') {
        $subject = if ($target.subject) { $target.subject } else { "Quick question for $($target.owner) regarding $($target.company) estimate requests" }
        $body = @"
Hi $($target.owner),

Quick question regarding $($target.company)'s customer response speed:

When homeowners in $($target.city) fill out an online estimate request or call while your field crew is tied up on an active job, what is your average follow-up time?

Harvard Business Review research shows that contractors who respond to leads within 90 seconds are 700% more likely to close the job compared to waiting just 30 minutes. In $($target.trade), speed is everything.

We deploy LeadFlow specifically for local trade contractors:
- Automatically sends an instant, personalized two-way SMS within 3 seconds whenever a daytime call is missed
- Follows up with online estimate requests in under 90 seconds
- Rescues up to $($target.estLoss) in lost revenue before homeowners call a competitor

Could we hop on a quick 10-15 minute Zoom call this Tuesday or Thursday so I can show you our live missed-call speed test?

Best,
Luke
Founder, VantorX Solutions
Direct: $demoPhone
Website: $websiteUrl
"@
        return @{ Subject = $subject; Body = $body }
    }

    # Default: AEO
    $subject = if ($target.subject) { $target.subject } else { "Quick question for $($target.owner) regarding $($target.company) AI search rankings" }
    $body = @"
Hi $($target.owner),

I was running an AI search audit on ChatGPT, Perplexity, and Google Gemini for top-recommended $($target.trade) contractors in $($target.city).

While $($target.company) has great local reviews, when homeowners ask ChatGPT or Perplexity 'Who is the best $($target.trade) contractor near me?', the AI search engines aren't recommending you -- they are directing high-ticket jobs to competitors.

Here is why: Traditional SEO only targets old Google links. Today, millions of homeowners search using AI assistants on their phones. AI engines ignore traditional keywords unless your company has an engineered llms.txt protocol and structured Schema knowledge graph.

We built the AEO Engine (Answer Engine Optimization) specifically for trade contractors to get you ranked as the #1 recommended answer across ChatGPT, Perplexity, Claude, and Gemini.

Could we jump on a brief 10-15 minute Zoom screen share this week so I can show you what ChatGPT says when local homeowners search for $($target.trade) in $($target.city)?

You can also check out our official AI protocols here:
-> $websiteUrl#pricing

Best,
Luke
Founder, VantorX Solutions
Direct: $demoPhone
Website: $websiteUrl
"@
    return @{ Subject = $subject; Body = $body }
}

for ($i = 0; $i -lt $batch.Count; $i++) {
    $item = $batch[$i]
    $emailData = Get-EmailPayload $item
    $item.subject = $emailData.Subject

    Write-Host ("[$($i+1)/$countToTake] Pitching $($item.company) ($($item.owner)) -- Touch $(if ($item.touch) { $item.touch } else { 1 })") -ForegroundColor Cyan
    Write-Host ("   Trade / City: " + $item.trade + " in " + $item.city) -ForegroundColor Gray
    Write-Host ("   Direct Phone: " + $item.phone) -ForegroundColor White
    Write-Host ("   Email:        " + $item.email) -ForegroundColor White
    Write-Host ("   Subject:      `"" + $item.subject + "`"") -ForegroundColor Gray

    $resendId = $null
    if ($DryRun) {
        $resendId = "dry_run_$(Get-Random)"
        Write-Host "   [DRY RUN] Would send via Resend API." -ForegroundColor Yellow
    } else {
        try {
            $headers = @{
                "Authorization" = "Bearer $resendKey"
                "Content-Type"  = "application/json"
            }
            $payloadObj = @{
                from    = "Luke <$senderEmail>"
                to      = @($item.email)
                subject = $item.subject
                text    = $emailData.Body
            }
            $jsonPayload = $payloadObj | ConvertTo-Json -Depth 3

            $response = Invoke-RestMethod -Uri "https://api.resend.com/emails" -Method Post -Headers $headers -Body $jsonPayload
            if ($response.id) {
                $resendId = $response.id
                Write-Host ("   ✅ DISPATCHED via Resend! Delivery ID: " + $resendId) -ForegroundColor Green
            } else {
                Write-Host "   ⚠️  Resend returned no ID." -ForegroundColor Red
            }
        } catch {
            Write-Host ("   ⚠️  Resend dispatch failed: " + $_.Exception.Message) -ForegroundColor Red
        }
    }

    if ($resendId) {
        $item.status = "sent"
        $item.resendMessageId = $resendId
        $item.sentAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    }

    $dispatched.Add($item)
    Write-Host ""
}

# 4. Save Queue Files
if (-not $DryRun) {
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    $updatedJson = $queue | ConvertTo-Json -Depth 5
    [System.IO.File]::WriteAllText($queueFile, $updatedJson, $utf8NoBom)
    [System.IO.File]::WriteAllText($webQueueFile, $updatedJson, $utf8NoBom)

    # 5. Append to CSV
    $csvRow = ""
    if (-not (Test-Path $csvFile)) {
        $csvRow += "ID,Company,Owner,Email,Phone,City,Trade,ServicePitched,Touch,Subject,EstimatedLoss,ResendMessageId,DispatchedAt`n"
    }
    foreach ($d in $dispatched) {
        if ($d.status -eq 'sent') {
            $csvRow += "`"$($d.id)`",`"$($d.company)`",`"$($d.owner)`",`"$($d.email)`",`"$($d.phone)`",`"$($d.city)`",`"$($d.trade)`",`"$($d.service)`",`"$(if ($d.touch) { $d.touch } else { 1 })`",`"$($d.subject)`",`"$($d.estLoss)`",`"$($d.resendMessageId)`",`"$($d.sentAt)`"`n"
        }
    }
    [System.IO.File]::AppendAllText($csvFile, $csvRow, $utf8NoBom)
}

Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host ("   DISPATCH COMPLETED: " + ($dispatched | Where-Object { $_.status -eq 'sent' }).Count + " Emails Processed Successfully.") -ForegroundColor Green
Write-Host ("   Remaining Pending in Queue: " + ($queue | Where-Object { $_.status -eq 'pending' }).Count) -ForegroundColor Yellow
Write-Host "==============================================================================" -ForegroundColor Cyan
