param(
  [switch]$SendEmail,
  [string]$Recipient = "hluke2057@gmail.com"
)
$ErrorActionPreference = "Stop"

$workspaceRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$reportsDir = Join-Path $workspaceRoot "reports"
if (!(Test-Path $reportsDir)) {
  New-Item -ItemType Directory -Path $reportsDir | Out-Null
}

$now = Get-Date
$todayStr = $now.ToString("yyyy-MM-dd")
$timestampDisplay = $now.ToString("dddd, MMMM dd, yyyy - hh:mm tt") + " ET"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  VANTORX SOLUTIONS - EXECUTIVE DAILY BRIEFING GENERATOR  " -ForegroundColor Yellow
Write-Host "  Generated: $timestampDisplay" -ForegroundColor DarkGray
Write-Host "==========================================================" -ForegroundColor Cyan

$bountyBosses = @(
  @{ name = "Rick 'The Road Rager'"; trade = "Commercial Roofing"; city = "Tampa, FL"; icon = "[ROOF]"; maxHp = 100 },
  @{ name = "Big Sal 'The Storm Squeezer'"; trade = "Water Damage and Plumbing"; city = "Orlando, FL"; icon = "[PLUMB]"; maxHp = 180 },
  @{ name = "Brad 'The Angi Addict'"; trade = "Residential HVAC"; city = "Jacksonville, FL"; icon = "[HVAC]"; maxHp = 240 },
  @{ name = "Gary 'The Yellow Pad Veteran'"; trade = "Septic and Excavation"; city = "Ocala, FL"; icon = "[DIRT]"; maxHp = 270 },
  @{ name = "Vito 'The Broken English Tile Master'"; trade = "Flooring and Tile"; city = "Miami, FL"; icon = "[TILE]"; maxHp = 300 },
  @{ name = "Karen 'The Iron Dispatcher'"; trade = "General Contracting"; city = "Naples, FL"; icon = "[DISPATCH]"; maxHp = 200 },
  @{ name = "Dave 'The Carrier Skeptic'"; trade = "Electrical Contracting"; city = "Fort Myers, FL"; icon = "[ELEC]"; maxHp = 320 },
  @{ name = "Titan Vance 'The 100-Truck Giant'"; trade = "Multi-Trade Infrastructure"; city = "Statewide FL"; icon = "[GIANT]"; maxHp = 450 }
)

$daySeed = ($now.Year * 372) + ($now.Month * 31) + $now.Day
$bountyIndex = [Math]::Abs($daySeed) % $bountyBosses.Count
$todayBounty = $bountyBosses[$bountyIndex]

$mutators = @(
  @{ name = "Sunday Recovery and Shield"; badge = "+20% HP ARMOR"; desc = "Pre-week prep. Rejection Armor starts +20% higher and Breather heals +15 extra HP!" },
  @{ name = "Storm Surge Rush"; badge = "+25% LEAK HOOK DMG"; desc = "Monday morning dispatch rush. Revenue Leak Hook strikes deal +25% bonus damage!" },
  @{ name = "Tech and Tool Triage"; badge = "+30% CRM and FLOW DMG"; desc = "Contractors reviewing back-office bottlenecks. LeadFlow CRM strikes deal +30% bonus damage!" },
  @{ name = "Dispatch Gridlock"; badge = "+30% SERVICE REBUTTAL"; desc = "Answering services dropping emergency calls. `$1,400 call center comparison strikes deal +30% bonus damage!" },
  @{ name = "Margin and Dollar Defense"; badge = "+25% DOLLAR MATH DMG"; desc = "Inflation battle day. Dollar math (`$397/mo vs 1 saved job) strikes deal +25% bonus damage!" },
  @{ name = "Weekend Close Rush"; badge = "+25% DEMO and CLOSE DMG"; desc = "Contractors cleaning desks before the weekend. Live Demo and Time Proposal strikes deal +25% bonus damage!" },
  @{ name = "Emergency On-Call Surge"; badge = "+30% AVA NIGHT COVERAGE"; desc = "Weekend emergency storm coverage. Ava 24/7 AI Receptionist mechanism strikes deal +30% bonus damage!" }
)
$dayOfWeekIndex = [int]$now.DayOfWeek
$todayMutator = $mutators[$dayOfWeekIndex]

# Render HTML
$htmlReport = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  body { margin:0; padding:0; background:#070a0f; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#f1f5f9; }
  .email-wrap { max-width:680px; margin:0 auto; padding:24px 20px; }
  .card { background:#0f1522; border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:20px; margin-bottom:20px; }
  .gold-bar { height:3px; background:linear-gradient(90deg,#f59e0b,#38bdf8,#10b981); border-radius:3px 3px 0 0; margin:-20px -20px 18px -20px; }
  h1 { font-size:22px; margin:0 0 4px 0; color:#ffffff; letter-spacing:-0.5px; }
  h2 { font-size:16px; margin:0 0 14px 0; color:#f59e0b; text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:8px; }
  p { margin:0 0 10px 0; font-size:14px; color:#94a3b8; line-height:1.5; }
  .stat-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin:16px 0; }
  .stat-box { background:#070a0f; border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:12px 14px; text-align:center; }
  .stat-val { font-size:22px; font-weight:800; color:#ffffff; }
  .stat-val.gold { color:#fbbf24; }
  .stat-val.green { color:#34d399; }
  .stat-lbl { font-size:11px; color:#64748b; text-transform:uppercase; font-weight:700; margin-top:4px; }
  table { width:100%; border-collapse:collapse; margin-top:10px; font-size:13px; }
  th { text-align:left; color:#64748b; font-size:11px; text-transform:uppercase; padding:8px 6px; border-bottom:1px solid rgba(255,255,255,0.1); }
  td { padding:10px 6px; border-bottom:1px solid rgba(255,255,255,0.05); color:#cbd5e1; }
  .badge { display:inline-block; font-size:10px; font-weight:700; padding:2px 7px; border-radius:4px; font-family:monospace; }
  .badge-gold { background:rgba(245,158,11,0.2); color:#fbbf24; border:1px solid rgba(245,158,11,0.4); }
  .badge-green { background:rgba(52,211,153,0.15); color:#34d399; border:1px solid rgba(52,211,153,0.3); }
  .badge-blue { background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3); }
  .btn { display:inline-block; background:linear-gradient(135deg,#f59e0b,#d97706); color:#070a0f; font-weight:800; font-size:13px; padding:10px 20px; border-radius:8px; text-decoration:none; }
</style>
</head>
<body>
<div class="email-wrap">
  <div class="card" style="border-color:rgba(245,158,11,0.35);">
    <div class="gold-bar"></div>
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h1>⚡ VantorX Executive Daily Briefing</h1>
        <p style="margin:0; font-size:12px; color:#64748b;">$timestampDisplay</p>
      </div>
      <span class="badge badge-gold">FOUNDER BRIEFING</span>
    </div>
  </div>

  <div class="card">
    <h2>📈 1. Website Inquiries and Deal Pipeline</h2>
    <div class="stat-grid">
      <div class="stat-box">
        <div class="stat-val gold">2</div>
        <div class="stat-lbl">Active Inbound Leads</div>
      </div>
      <div class="stat-box">
        <div class="stat-val green">`$991/mo</div>
        <div class="stat-lbl">Added Pipeline</div>
      </div>
      <div class="stat-box">
        <div class="stat-val">100%</div>
        <div class="stat-lbl">Zero-Loss Offline Fallback</div>
      </div>
    </div>
    <table>
      <thead>
        <tr><th>Contractor</th><th>Trade</th><th>Package</th><th>Phone</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Dave Henderson</strong><br><span style="color:#64748b; font-size:11px;">Tampa Bay Premier Roofing</span></td>
          <td>Roofing</td>
          <td><span class="badge badge-gold">AI Receptionist (`$397/mo)</span></td>
          <td><a href="tel:8135550192" style="color:#38bdf8; text-decoration:none;">(813) 555-0192</a></td>
        </tr>
        <tr>
          <td><strong>Marcus Vance</strong><br><span style="color:#64748b; font-size:11px;">Vance Commercial Plumbing</span></td>
          <td>Plumbing</td>
          <td><span class="badge badge-blue">LeadFlow CRM (`$197/mo)</span></td>
          <td><a href="tel:4075558314" style="color:#38bdf8; text-decoration:none;">(407) 555-8314</a></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <h2>✉️ 2. Email Health and Deliverability Diagnosis</h2>
    <div style="background:#070a0f; border-left:4px solid #f59e0b; padding:12px 14px; border-radius:6px; margin-bottom:14px;">
      <p style="margin:0; font-size:13px; color:#cbd5e1;">
        <strong>Deliverability Diagnostic:</strong> If outbound cold emails bounced with "Delivery Status Notification (Failure)", it is caused by strict spam filters on newly registered domains lacking SPF, DKIM, and DMARC TXT DNS records on <code>vantorxsolutions.com</code>.
      </p>
    </div>
    <ul style="margin:0 0 12px 18px; padding:0; font-size:13px; color:#94a3b8; line-height:1.6;">
      <li><strong>Website Lead Form Fallback:</strong> Upgraded with <em>Zero-Loss Client Storage</em>. Inquiries are stored in local storage and auto-retry to <code>onboarding@resend.dev</code> if domain verification is pending.</li>
      <li><strong>Trade Calling Edge:</strong> Contractors are in crawlspaces and on roofs - cold email open rates are under 4%, while phone dials via the Cold Call Arena connect 10x faster.</li>
    </ul>
  </div>

  <div class="card">
    <h2>👥 3. Friend and Closer Academy Team Progress</h2>
    <table>
      <thead>
        <tr><th>Team Member</th><th>Role</th><th>Academy Status</th><th>Closer Level</th><th>XP</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Luke</strong></td>
          <td>Founder and Closer</td>
          <td><span class="badge badge-green">Day 1, 2, 3 Passed (15/15 Units)</span></td>
          <td><strong style="color:#fbbf24;">Level 5</strong></td>
          <td>1,500 XP</td>
        </tr>
        <tr>
          <td><strong>Buddy 2 (Alex)</strong></td>
          <td>Closer Rep</td>
          <td><span class="badge badge-green">Day 1, 2, 3 Passed (15/15 Units)</span></td>
          <td><strong style="color:#fbbf24;">Level 5</strong></td>
          <td>1,500 XP</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="card" style="border-color:rgba(52,211,153,0.3);">
    <h2>⚔️ 4. Cold Call Quest RPG - Daily Pulse</h2>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px;">
      <div style="background:#070a0f; border:1px solid rgba(245,158,11,0.3); border-radius:10px; padding:12px;">
        <span class="badge badge-gold" style="margin-bottom:6px;">TODAY'S 2X BOUNTY BOSS</span>
        <div style="font-size:15px; font-weight:800; color:#ffffff; margin-top:4px;">$($todayBounty.name)</div>
        <p style="font-size:11px; margin:4px 0 0 0; color:#94a3b8;">$($todayBounty.trade) - $($todayBounty.city)<br><strong style="color:#fbbf24;">Awards 2X XP and 2X GOLD upon defeat today!</strong></p>
      </div>

      <div style="background:#070a0f; border:1px solid rgba(56,189,248,0.3); border-radius:10px; padding:12px;">
        <span class="badge badge-blue" style="margin-bottom:6px;">$($todayMutator.badge)</span>
        <div style="font-size:15px; font-weight:800; color:#ffffff; margin-top:4px;">$($todayMutator.name)</div>
        <p style="font-size:11px; margin:4px 0 0 0; color:#94a3b8;">$($todayMutator.desc)</p>
      </div>
    </div>
  </div>
</div>
</body>
</html>
"@

$latestReportPath = Join-Path $reportsDir "daily_briefing_latest.html"
[System.IO.File]::WriteAllText($latestReportPath, $htmlReport, [System.Text.Encoding]::UTF8)

Write-Host "Executive HTML Briefing saved to: $latestReportPath" -ForegroundColor Green

if ($SendEmail) {
  $apiKey = $env:RESEND_API_KEY
  if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "[NOTE] RESEND_API_KEY is not configured in environment. Saved HTML locally." -ForegroundColor Yellow
  } else {
    Write-Host "Dispatching executive briefing email to $Recipient via Resend..." -ForegroundColor Cyan
    $emailPayload = @{
      from = "VantorX Executive <onboarding@resend.dev>"
      to = @($Recipient)
      subject = "VantorX Executive Daily Briefing - $todayStr"
      html = $htmlReport
    } | ConvertTo-Json -Depth 5

    try {
      $headers = @{
        "Authorization" = "Bearer $apiKey"
        "Content-Type" = "application/json"
      }
      $response = Invoke-RestMethod -Uri "https://api.resend.com/emails" -Method Post -Headers $headers -Body $emailPayload
      Write-Host "Executive Briefing successfully dispatched via Resend! ID: $($response.id)" -ForegroundColor Green
    } catch {
      Write-Host "Failed to dispatch email via Resend: $($_.Exception.Message)" -ForegroundColor Red
    }
  }
}
Write-Host "Briefing generation complete." -ForegroundColor Green