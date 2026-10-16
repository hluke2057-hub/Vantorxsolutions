# VantorX Solutions — Autonomous Outbound Sales Engine (Native PowerShell Runner)
# Generates personalized cold audit emails and exports them directly to your Desktop.

$DemoPhone = "(561) 813-8602"
$SenderEmail = "luke@vantorxsolutions.com"
$Website = "https://www.vantorxsolutions.com"
$DesktopCsv = "C:\Users\hungr\OneDrive\Desktop\OUTBOUND_LEADS_CAMPAIGN.csv"

$Prospects = @(
    [PSCustomObject]@{
        Company = "Gold Coast Emergency Roofing"
        Owner = "Mark"
        Email = "mark@goldcoastroofingdemo.com"
        Phone = "(561) 555-0182"
        City = "West Palm Beach, FL"
        Trade = "Roofing"
        Problem = "Weekend calls go to standard voicemail. Missing emergency tarping quotes after storms."
        EstLoss = "$7,800/mo"
    },
    [PSCustomObject]@{
        Company = "Palm Beach Cooling & Air"
        Owner = "Steve"
        Email = "steve@palmbeachcoolingdemo.com"
        Phone = "(561) 555-0914"
        City = "Boca Raton, FL"
        Trade = "HVAC"
        Problem = "Office closes at 5:00 PM. No after-hours dispatch for residential AC breakdowns."
        EstLoss = "$6,500/mo"
    },
    [PSCustomObject]@{
        Company = "Atlantic Emergency Plumbing"
        Owner = "Dave"
        Email = "dave@atlanticplumbingdemo.com"
        Phone = "(561) 555-0347"
        City = "Delray Beach, FL"
        Trade = "Plumbing"
        Problem = "Overnight burst-pipe calls ring 6 times before dropping. High customer friction."
        EstLoss = "$8,900/mo"
    },
    [PSCustomObject]@{
        Company = "Apex Storm & Tile Roofing"
        Owner = "Carlos"
        Email = "carlos@apexstormroofdemo.com"
        Phone = "(305) 555-0211"
        City = "Miami, FL"
        Trade = "Roofing"
        Problem = "Phone lines stay busy on rainy days. Homeowners hang up and dial competitors."
        EstLoss = "$9,200/mo"
    },
    [PSCustomObject]@{
        Company = "Sunstate 24/7 HVAC Pros"
        Owner = "Michael"
        Email = "michael@sunstatehvacdemo.com"
        Phone = "(813) 555-0489"
        City = "Tampa, FL"
        Trade = "HVAC"
        Problem = "Static website form with 24hr lag. Zero instant calendar scheduling for urgent jobs."
        EstLoss = "$5,400/mo"
    },
    [PSCustomObject]@{
        Company = "Orlando Precision Drain Cleaning"
        Owner = "Jason"
        Email = "jason@orlandodraindemo.com"
        Phone = "(407) 555-0812"
        City = "Orlando, FL"
        Trade = "Plumbing"
        Problem = "Calls go to unmonitored voicemail during lunch rushes and off-hours."
        EstLoss = "$6,100/mo"
    }
)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   VANTORX AUTONOMOUS CLAUDE OUTBOUND ENGINE (PHASE 7)      " -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Live Demo Line : $DemoPhone" -ForegroundColor Yellow
Write-Host "Sender Email   : $SenderEmail" -ForegroundColor Yellow
Write-Host "Audited Leads  : $($Prospects.Count)`n" -ForegroundColor White

$ExportRows = @()

foreach ($lead in $Prospects) {
    $Subject = "Quick question regarding $($lead.Company)'s after-hours calls"
    $Body = @"
Hi $($lead.Owner),

I was looking at $($lead.Company) in $($lead.City) and noticed something that's likely costing you high-ticket jobs:
$($lead.Problem)

In the $($lead.Trade.ToLower()) business, when someone has an urgent issue, they call the next company on Google if nobody answers within 3 rings. For a company your size, that's roughly $($lead.EstLoss) walking out the door every month.

We built Ava — a 24/7 AI phone receptionist trained specifically for $($lead.Trade.ToLower()) contractors. She:
• Answers in 1 ring 24/7/365 (never sick, never misses a call).
• Qualifies the emergency and books jobs directly into your calendar.
• Instantly sends a priority text alert to your tech for urgent jobs.

You can test her right now from your cell phone:
👉 Dial our live demo line: $DemoPhone

Hang up and call it for 15 seconds to hear how human and responsive she sounds. If you'd like to put her on your lines this week, plans are just $299/mo with zero contracts. Reply to this email or visit $Website to get started.

Best,
Luke
Founder, VantorX Solutions
$SenderEmail
$Website
"@

    Write-Host "[Audited] $($lead.Company) ($($lead.Trade) - $($lead.City))" -ForegroundColor Cyan
    Write-Host "  Owner: $($lead.Owner) | Est. Loss: $($lead.EstLoss)" -ForegroundColor Gray
    Write-Host "  Subject: '$Subject'`n" -ForegroundColor DarkGray

    $ExportRows += [PSCustomObject]@{
        Company = $lead.Company
        FirstName = $lead.Owner
        Email = $lead.Email
        Phone = $lead.Phone
        City = $lead.City
        Trade = $lead.Trade
        Problem = $lead.Problem
        EstMonthlyLoss = $lead.EstLoss
        EmailSubject = $Subject
        EmailBody = $Body
    }
}

$ExportRows | Export-Csv -Path $DesktopCsv -NoTypeInformation -Encoding utf8
Write-Host "SUCCESS: Generated $($ExportRows.Count) personalized audit campaigns!" -ForegroundColor Green
Write-Host "Exported directly to your Desktop: $DesktopCsv" -ForegroundColor Yellow
