$leads = Get-Content "$PSScriptRoot\..\data\normalized_lead_targets.json" | ConvertFrom-Json
Write-Host "Total leads: $($leads.Count)"
$states = $leads | Group-Object state
foreach ($s in $states) {
    $batches = ($s.Group.batch | Select-Object -Unique) -join ', '
    Write-Host "$($s.Name): $($s.Count) leads (Batches: $batches)"
}
Write-Host "`nProducts in First 100 leads:"
$first100 = $leads[0..99]
$first100 | Group-Object product | ForEach-Object { Write-Host "  $($_.Name): $($_.Count)" }

Write-Host "`nProducts in All 250 leads:"
$leads | Group-Object product | ForEach-Object { Write-Host "  $($_.Name): $($_.Count)" }
