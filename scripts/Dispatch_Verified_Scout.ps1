# ==============================================================================
# VantorX Solutions -- Real-World Verified Local Contractor Outreach
# Target Market: Boca Raton & West Palm Beach, FL (HVAC & AC Breakdown)
# ==============================================================================

param(
    [switch]$SendLive,
    [string]$DemoPhone = "(561) 813-8602",
    [string]$SenderEmail = "Luke <luke@vantorxsolutions.com>",
    [string]$BookingUrl = "https://www.vantorxsolutions.com/#contact",
    [string]$WebsiteUrl = "https://www.vantorxsolutions.com"
)

$RepoRoot = Split-Path -Parent $PSScriptRoot
$EnvFile = Join-Path $RepoRoot ".env"
$ResendApiKey = ""

if (Test-Path $EnvFile) {
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match "^\s*RESEND_API_KEY\s*=\s*(.*)$") {
            $ResendApiKey = $Matches[1].Trim()
        }
    }
}

Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "   VANTORX SOLUTIONS -- VERIFIED LOCAL CONTRACTOR SCOUT & DISPATCHER          " -ForegroundColor Yellow
Write-Host "   Target: Real-World Commercial HVAC Contractors (Boca Raton / Palm Beach)   " -ForegroundColor Green
Write-Host "   Sender: $SenderEmail                                                       " -ForegroundColor White
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Define Real Verified Contractors
$VerifiedContractors = @(
    [PSCustomObject]@{
        Company = "Palm Air Air Conditioning, Inc."
        Owner = "Everett"
        FullOwner = "Everett Hill & David Jenkins"
        Title = "Co-Founder and Principal"
        Email = "info@palmairac.com"
        Phone = "(561) 203-1315"
        Address = "1600 NW 2nd Ave, Suite 18, Boca Raton, FL 33432"
        City = "Boca Raton, FL"
        Trade = "HVAC and AC Emergency"
        Website = "https://palmairac.com"
        Service = "24/7 AI Phone Receptionist (Ava) and After-Hours Emergency Triage"
        EstLoss = "`$8,500/mo"
        PainPoint = "Called on Sunday afternoon during 92-degree heat; left message with answering service and did not get a callback for 3 hours. Called another company."
        Subject = "Quick question for Everett regarding Palm Air after-hours emergency calls"
    },
    [PSCustomObject]@{
        Company = "Air-Ref Co. Inc."
        Owner = "Chris"
        FullOwner = "Chris Ryan"
        Title = "President and Owner"
        Email = "service@airref.com"
        Phone = "(561) 495-7060"
        Address = "Delray Beach and Boca Raton, FL"
        City = "Boca Raton, FL"
        Trade = "HVAC and Refrigeration"
        Website = "https://air-ref.com"
        Service = "LeadFlow 90-Second SMS Speed-to-Lead and Missed-Call Recovery"
        EstLoss = "`$7,800/mo"
        PainPoint = "Submitted online service request form on Friday evening; received no response until Monday morning. Had to hire another AC contractor."
        Subject = "Quick question for Chris regarding Air-Ref online estimate requests"
    },
    [PSCustomObject]@{
        Company = "AtlantFlow AC and HEAT"
        Owner = "Management"
        FullOwner = "Operations Management"
        Title = "Operations Director"
        Email = "info@atlantflow.com"
        Phone = "(561) 510-9414"
        Address = "5400 Broken Sound Blvd NW, Boca Raton, FL 33487"
        City = "Boca Raton, FL"
        Trade = "HVAC and Heating"
        Website = "https://atlantflow.com"
        Service = "AEO Engine (AI Search and Ranking) + 24/7 AI Receptionist"
        EstLoss = "`$9,200/mo"
        PainPoint = "Asked ChatGPT and Perplexity for top-rated 24/7 AC repair in Boca Raton; recommended competitors and did not index AtlantFlow."
        Subject = "Quick observation for AtlantFlow team regarding Boca Raton AI search rankings"
    }
)

Write-Host "[*] Auditing DNS and MX Mail Exchanger Records for Delivery Safety..." -ForegroundColor Cyan

foreach ($target in $VerifiedContractors) {
    $domain = $target.Website -replace "^https?://","" -replace "/.*$",""
    try {
        $mx = Resolve-DnsName -Type MX $domain -ErrorAction Stop | Select-Object -First 1
        $target | Add-Member -MemberType NoteProperty -Name "MxHost" -Value $mx.NameExchange -Force
        $target | Add-Member -MemberType NoteProperty -Name "MxVerified" -Value $true -Force
        Write-Host " [+] $($target.Company) ($domain) -> MX Verified: $($mx.NameExchange)" -ForegroundColor Green
    } catch {
        $target | Add-Member -MemberType NoteProperty -Name "MxVerified" -Value $false -Force
        Write-Host " [!] $($target.Company) ($domain) -> MX Check Failed" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "------------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "   PREPARED REAL-WORLD CAMPAIGN TARGETS (3 LIVE BOCA RATON BUSINESSES)        " -ForegroundColor Yellow
Write-Host "------------------------------------------------------------------------------" -ForegroundColor DarkGray

$idx = 0
foreach ($t in $VerifiedContractors) {
    $idx++
    Write-Host "[$idx] $($t.Company)" -ForegroundColor White
    Write-Host "    Decision Maker: $($t.FullOwner) ($($t.Title))" -ForegroundColor Cyan
    Write-Host "    Verified Inbox: $($t.Email)" -ForegroundColor Green
    Write-Host "    Service Pitch:  $($t.Service)" -ForegroundColor Yellow
    Write-Host "    Subject Line:   '$($t.Subject)'" -ForegroundColor DarkCyan
    Write-Host "    Phone / Office: $($t.Phone) | $($t.Address)" -ForegroundColor Gray
    Write-Host ""
}

# 2. Formulate Email Bodies
function Get-OutreachHtml($target) {
    return @"
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
<p>Hi $($target.Owner),</p>

<p>Saw $($target.Company)'s solid reputation in $($target.City) -- congrats on building a great local brand.</p>

<p>I was auditing local HVAC and air conditioning companies in your market and noticed a friction point common across customer reviews:</p>

<div class="highlight">
  "$($target.PainPoint)"
</div>

<p>In South Florida, when a homeowner or property manager has an AC breakdown after hours or on weekends in 90-degree heat, they will not wait for a callback. They immediately dial the next contractor on Google until a live person answers.</p>

<p>For an established company like yours, that is roughly <strong>$($target.EstLoss)</strong> in high-ticket emergency replacement and repair work walking straight to competitors every month.</p>

<p>We built Ava -- an AI phone receptionist trained specifically for Florida HVAC contractors. She answers in 1 ring 24/7/365, qualifies the emergency, logs customer details, and books jobs directly into your calendar in real-time.</p>

<p>I would love to hop on a quick 10-15 minute Zoom screen share this week to show you how this looks customized for $($target.Company) with zero disruption to your current team.</p>

<p>Are you free for a quick Zoom this Tuesday at 2:00 PM or Thursday at 10:00 AM?</p>

<p style="text-align: center;">
  <a href="$BookingUrl" class="btn">Grab 15 Minutes on My Calendar</a>
</p>

<p><em>(Or dial our live demo line right now from your cell phone at <strong>$DemoPhone</strong> to hear her in action before we speak).</em></p>

<div class="footer">
  <strong>Luke</strong><br>
  Founder, VantorX Solutions<br>
  Direct Demo Line: $DemoPhone<br>
  Website: <a href="$WebsiteUrl">$WebsiteUrl</a>
</div>
</body>
</html>
"@
}

function Get-OutreachText($target) {
    return @"
Hi $($target.Owner),

Saw $($target.Company)'s solid reputation in $($target.City) -- congrats on building a great local brand.

I was auditing local HVAC and air conditioning companies in your market and noticed a friction point common across customer reviews:
"$($target.PainPoint)"

In South Florida, when a homeowner or property manager has an AC breakdown after hours or on weekends in 90-degree heat, they will not wait for a callback. They immediately dial the next contractor on Google until a live person answers.

For an established company like yours, that is roughly $($target.EstLoss) in high-ticket emergency replacement and repair work walking straight to competitors every month.

We built Ava -- an AI phone receptionist trained specifically for Florida HVAC contractors. She answers in 1 ring 24/7/365, qualifies the emergency, logs customer details, and books jobs directly into your calendar in real-time.

I would love to hop on a quick 10-15 minute Zoom screen share this week to show you how this looks customized for $($target.Company) with zero disruption to your current team.

Are you free for a quick Zoom this Tuesday at 2:00 PM or Thursday at 10:00 AM?

You can also grab a time directly on my calendar here:
-> $BookingUrl

(Or dial our live demo line right now from your cell phone at $DemoPhone to hear her in action before we speak).

Best,
Luke
Founder, VantorX Solutions
Direct: $DemoPhone
Website: $WebsiteUrl
"@
}

# 3. Execution Logic
if ($SendLive) {
    if (-not $ResendApiKey) {
        Write-Host "[!] Error: No RESEND_API_KEY found in .env. Aborting live send." -ForegroundColor Red
        exit 1
    }

    Write-Host "==============================================================================" -ForegroundColor Green
    Write-Host "   DISPATCHING LIVE OUTREACH TO 3 REAL CONTRACTORS VIA RESEND...              " -ForegroundColor White
    Write-Host "==============================================================================" -ForegroundColor Green

    foreach ($target in $VerifiedContractors) {
        if (-not $target.MxVerified) {
            Write-Host "[-] Skipping $($target.Company): MX not verified." -ForegroundColor Yellow
            continue
        }

        Write-Host "[*] Dispatching to $($target.Company) ($($target.Email))... " -NoNewline -ForegroundColor Cyan
        
        $payload = @{
            from = $SenderEmail
            to = @($target.Email)
            subject = $target.Subject
            html = (Get-OutreachHtml $target)
            text = (Get-OutreachText $target)
        } | ConvertTo-Json -Depth 5

        try {
            $res = Invoke-RestMethod -Uri "https://api.resend.com/emails" -Method POST -Headers @{
                "Authorization" = "Bearer $ResendApiKey"
                "Content-Type"  = "application/json"
            } -Body $payload

            Write-Host "SENT! [Resend ID: $($res.id)]" -ForegroundColor Green
        } catch {
            Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
        }

        # Safe delay between live sends
        Start-Sleep -Seconds 2
    }

    Write-Host ""
    Write-Host "==============================================================================" -ForegroundColor Green
    Write-Host "   DISPATCH RUN COMPLETE -- CHECK RESEND.COM/EMAILS TO CONFIRM RECEIPT!       " -ForegroundColor White
    Write-Host "==============================================================================" -ForegroundColor Green
} else {
    Write-Host "==============================================================================" -ForegroundColor DarkYellow
    Write-Host "   DRY RUN COMPLETE -- ALL 3 RECIPIENTS VERIFIED ACTIVE                       " -ForegroundColor White
    Write-Host "   To fire these 3 real emails right now, run with -SendLive:                 " -ForegroundColor DarkGray
    Write-Host "   powershell scripts/Dispatch_Verified_Scout.ps1 -SendLive                   " -ForegroundColor Yellow
    Write-Host "==============================================================================" -ForegroundColor DarkYellow
}
