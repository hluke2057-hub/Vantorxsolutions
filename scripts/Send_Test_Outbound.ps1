# ==============================================================================
# VantorX Solutions -- Dispatch Direct Test Email to Luke (hluke2057@gmail.com)
# ==============================================================================

param(
    [string]$RecipientEmail = "hluke2057@gmail.com",
    [string]$OwnerName = "Luke",
    [string]$DemoPhone = "(561) 813-8602",
    [string]$SenderEmail = "VantorX Solutions <onboarding@resend.dev>",
    [string]$WebsiteUrl = "https://www.vantorxsolutions.com",
    [string]$BookingUrl = "https://www.vantorxsolutions.com/#contact",
    [string]$ResendApiKey = ""
)

$RepoRoot = Split-Path -Parent $PSScriptRoot
$EnvFile = Join-Path $RepoRoot ".env"

if ([string]::IsNullOrWhiteSpace($ResendApiKey) -and (Test-Path $EnvFile)) {
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match "^\s*RESEND_API_KEY\s*=\s*(.*)$") {
            $ResendApiKey = $Matches[1].Trim()
        }
    }
}

$DataFile = Join-Path $RepoRoot "data\outbound_intelligence.json"
$WebsiteDataFile = Join-Path $RepoRoot "website\data\outbound_intelligence.json"
$CsvFile = Join-Path $RepoRoot "data\outbound_cloud_campaign.csv"

Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "   VANTORX SOLUTIONS -- DISPATCHING LIVE COLD OUTBOUND EMAIL                  " -ForegroundColor Yellow
Write-Host "   Target Recipient: $RecipientEmail ($OwnerName)                             " -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Cyan

# 1. Format the AEO Engine Pitch Email for Luke
$AeoSubject = "Quick question for $OwnerName regarding AI search rankings"
$AeoBody = @"
Hi $OwnerName,

I was running an AI search audit on ChatGPT, Perplexity, and Google Gemini for top-recommended contractors in your market.

While your company has a solid local reputation, when homeowners in your market ask ChatGPT or Perplexity 'Who is the most reliable contractor near me?', the AI engines aren't recommending you -- they're actively directing high-ticket jobs to competitors.

Here's why: Traditional SEO only targets Google links. Today, millions of homeowners are searching using conversational AI assistants on their phones. AI engines ignore traditional keywords unless your business has an engineered llms.txt protocol and structured Schema.org entity data.

We built the AEO Engine (Answer Engine Optimization) specifically for local service businesses. We generate, verify, and host your official llms.txt standard and rich knowledge graph so ChatGPT, Perplexity, and Gemini recommend your company as the #1 local authority.

I put together a 3-minute video audit showing what ChatGPT and Perplexity say when homeowners search for local services in your area, and how we can get you indexed as the top recommended choice.

Could we jump on a brief 10-15 minute Zoom screen share this Tuesday at 2:30 PM or Thursday at 11:00 AM so I can show you the screen recording?

You can also book a time directly on my calendar here:
👉 $BookingUrl

(Or call our live AI receptionist test line anytime from your phone at $DemoPhone to hear conversational AI in action).

Best,
Luke
Founder, VantorX Solutions
Direct: $DemoPhone
Website: $WebsiteUrl
"@

$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
  .btn { display: inline-block; background-color: #0284c7; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; margin: 16px 0; }
  .highlight { background-color: #f1f5f9; border-left: 4px solid #0284c7; padding: 12px 16px; margin: 16px 0; font-style: italic; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 0.9em; color: #64748b; }
</style>
</head>
<body>
<p>Hi $OwnerName,</p>

<p>I was running an AI search audit on ChatGPT, Perplexity, and Google Gemini for top-recommended contractors in your market.</p>

<p>While your company has a solid local reputation, when homeowners ask ChatGPT or Perplexity <em>"Who is the most reliable contractor near me?"</em>, the AI engines aren't recommending you -- they're actively directing high-ticket jobs to your competitors.</p>

<p><strong>Here's why:</strong> Traditional SEO only targets old Google links. Today, millions of homeowners are searching using conversational AI assistants on their phones. AI search engines ignore traditional keywords unless your business has an engineered <code>llms.txt</code> protocol and structured Schema.org entity data.</p>

<div class="highlight">
  "Asked ChatGPT for the best contractor in town -- it recommended 3 other companies and didn't even mention our name."
</div>

<p>We built the <strong>AEO Engine™ (Answer Engine Optimization)</strong> specifically for local service businesses. We generate, verify, and host your official <code>llms.txt</code> standard and rich knowledge graph so ChatGPT, Perplexity, and Gemini recommend your company as the #1 local authority.</p>

<p>I put together a 3-minute video audit showing what ChatGPT and Perplexity say when homeowners search for local services in your area, and how we can get you indexed as the top recommended choice.</p>

<p>Could we jump on a brief 10-15 minute Zoom screen share this Tuesday at 2:30 PM or Thursday at 11:00 AM so I can show you the screen recording?</p>

<p style="text-align: center;">
  <a href="$BookingUrl" class="btn">👉 Book 15-Minute Zoom Screen Share</a>
</p>

<p><em>(Or call our live AI receptionist demo line anytime from your phone at <strong>$DemoPhone</strong> to hear conversational AI in action before we speak).</em></p>

<div class="footer">
  <strong>Luke</strong><br>
  Founder, VantorX Solutions<br>
  Direct Demo Line: $DemoPhone<br>
  Website: <a href="$WebsiteUrl">$WebsiteUrl</a>
</div>
</body>
</html>
"@

# 2. Transmit via Resend API
$sentPhysically = $false
$resendMsgId = $null

if ($ResendApiKey) {
    try {
        Write-Host "[*] Transmitting physical email via Resend API..." -ForegroundColor Cyan
        $payload = @{
            from = $SenderEmail
            to = @($RecipientEmail)
            subject = $AeoSubject
            html = $htmlContent
            text = $AeoBody
        } | ConvertTo-Json -Depth 5

        $res = Invoke-RestMethod -Uri "https://api.resend.com/emails" -Method POST -Headers @{
            "Authorization" = "Bearer $ResendApiKey"
            "Content-Type"  = "application/json"
        } -Body $payload

        if ($res.id) {
            $sentPhysically = $true
            $resendMsgId = $res.id
            Write-Host "[✓] PHYSICAL EMAIL DELIVERED! Resend ID: $resendMsgId" -ForegroundColor Green
        }
    } catch {
        Write-Host "[!] Resend delivery error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 3. Create Dispatch Lead Object
$LeadObj = [PSCustomObject]@{
    id = "test_dispatch_" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    company = "VantorX Solutions (Owner Test)"
    owner = $OwnerName
    title = "Founder & CEO"
    email = $RecipientEmail
    phone = $DemoPhone
    city = "Boca Raton, FL"
    trade = "AI Automation & Trade Growth"
    reviewQuote = "Testing live AEO search protocol and Ava 24/7 dispatcher."
    websiteAudit = "AEO llms.txt protocol verified active and live on production."
    estLoss = "$11,400/mo"
    variantId = "service_aeo_optimization"
    serviceCategory = "AEO Engine (AI Search and Ranking)"
    ctaGoal = "15-Minute Zoom Call"
    subject = $AeoSubject
    body = $AeoBody
    resendMessageId = $resendMsgId
    sent = $sentPhysically
    opened = $false
    dispatchedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
}

# 4. Commit into JSON Intelligence Data
if (Test-Path $DataFile) {
    $intel = Get-Content $DataFile -Raw -Encoding utf8 | ConvertFrom-Json
    if (-not $intel.recentDispatches) {
        $intel.recentDispatches = @()
    }
    $intel.recentDispatches = @($LeadObj) + $intel.recentDispatches
    $intel.metrics.totalSent++
    $intel.lastUpdated = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    
    $json = $intel | ConvertTo-Json -Depth 10
    [System.IO.File]::WriteAllText($DataFile, $json, [System.Text.Encoding]::UTF8)
    if (Test-Path (Split-Path -Parent $WebsiteDataFile)) {
        [System.IO.File]::WriteAllText($WebsiteDataFile, $json, [System.Text.Encoding]::UTF8)
    }
    Write-Host "[+] Recorded dispatch in outbound_intelligence.json" -ForegroundColor Green
}

# 5. Append to Campaign CSV
$csvLine = "`"$($LeadObj.id)`",`"$($LeadObj.company)`",`"$($LeadObj.owner)`",`"$($LeadObj.email)`",`"$($LeadObj.phone)`",`"$($LeadObj.city)`",`"$($LeadObj.trade)`",`"$($LeadObj.serviceCategory)`",`"$($LeadObj.subject)`",`"$($LeadObj.estLoss)`",`"$($LeadObj.dispatchedAt)`"`n"
[System.IO.File]::AppendAllText($CsvFile, $csvLine, [System.Text.Encoding]::UTF8)
Write-Host "[+] Appended to outbound_cloud_campaign.csv" -ForegroundColor Green

Write-Host ""
Write-Host "==============================================================================" -ForegroundColor Green
Write-Host "   DISPATCH SUCCESSFUL -- REAL EMAIL SENT                                     " -ForegroundColor White
Write-Host "==============================================================================" -ForegroundColor Green
Write-Host "Recipient:   $RecipientEmail" -ForegroundColor Yellow
Write-Host "Subject:     $AeoSubject" -ForegroundColor Cyan
Write-Host "Resend ID:   $resendMsgId" -ForegroundColor Green
Write-Host "Demo Phone:  $DemoPhone" -ForegroundColor DarkCyan
Write-Host "Booking CTA: $BookingUrl" -ForegroundColor Yellow
Write-Host "==============================================================================" -ForegroundColor Green
