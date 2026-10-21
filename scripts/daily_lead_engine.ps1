# PowerShell script: Automated Daily Lead Engine for VantorX Solutions
# Can be run daily via Windows Task Scheduler, GitHub Actions cron, or manual trigger
param(
    [switch]$GenerateNewBatch,
    [string]$TargetState = ""
)

$ErrorActionPreference = "Stop"

$jsonPath = Join-Path $PSScriptRoot "../data/normalized_lead_targets.json"
$leadsRaw = [System.IO.File]::ReadAllText($jsonPath, [System.Text.Encoding]::UTF8)
$leads = $leadsRaw | ConvertFrom-Json

$today = Get-Date
$dayOfYear = $today.DayOfYear
$activeBatch = (($dayOfYear - 1) % 10) + 1

Write-Host "=========================================================="
Write-Host "VANTORX AUTOMATED DAILY LEAD ROTATION ENGINE"
Write-Host "Date: $($today.ToString('yyyy-MM-dd'))"
Write-Host "Active Daily Batch: Batch #$activeBatch (25 Target Leads)"
Write-Host "Total Nationwide Leads Available: $($leads.Count)"
Write-Host "=========================================================="

# Display Today's 25 Leads Summary
$todaysLeads = $leads | Where-Object { $_.batch -eq $activeBatch }
Write-Host "Todays 25 Target Queue:"
$i = 1
foreach ($l in $todaysLeads) {
    Write-Host "[$i] $($l.company) - $($l.city) - $($l.phone) - Leak: `$$($l.annualLoss)/yr"
    $i++
}

$totalLeakToday = ($todaysLeads | Measure-Object -Property annualLoss -Sum).Sum
$avgSavingsToday = [Math]::Round(($todaysLeads | Measure-Object -Property netSavings -Average).Average)
Write-Host ""
Write-Host "Todays Batch Financial Potential:"
Write-Host "  Total Revenue Leaks Diagnosed: `$$totalLeakToday / year"
Write-Host "  Average Net Savings per Client: `$$avgSavingsToday / year"

if ($GenerateNewBatch) {
    Write-Host "Running On-Demand Nationwide Lead Generator..."
    & powershell -ExecutionPolicy Bypass -File "$PSScriptRoot/build_nationwide_dataset.ps1"
    & powershell -ExecutionPolicy Bypass -File "$PSScriptRoot/build_full_arena.ps1"
    Write-Host "Refreshed and rebuilt web cockpit with fresh targets."
}
