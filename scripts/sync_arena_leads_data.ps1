# scripts/sync_arena_leads_data.ps1
# Accurately updates LEADS_DATA in website/cold-call-arena/index.html directly from data/normalized_lead_targets.json
# Preserves all surrounding code, team sync, 1-week intake pause, and event listeners.

$ErrorActionPreference = "Stop"

$arenaPath = Join-Path $PSScriptRoot "../website/cold-call-arena/index.html"
$jsonPath = Join-Path $PSScriptRoot "../data/normalized_lead_targets.json"

Write-Host "Loading $jsonPath..." -ForegroundColor Cyan
$rawJson = [System.IO.File]::ReadAllText($jsonPath, [System.Text.Encoding]::UTF8)
$leads = $rawJson | ConvertFrom-Json

Write-Host "Found $($leads.Count) leads in normalized_lead_targets.json." -ForegroundColor Green

$sb = [System.Text.StringBuilder]::new()
$sb.AppendLine("  const LEADS_DATA = [") | Out-Null
for ($i = 0; $i -lt $leads.Count; $i++) {
    $l = $leads[$i]
    $lineJson = $l | ConvertTo-Json -Compress
    $sb.Append("    ") | Out-Null
    $sb.Append($lineJson) | Out-Null
    if ($i -lt $leads.Count - 1) {
        $sb.AppendLine(",") | Out-Null
    } else {
        $sb.AppendLine() | Out-Null
    }
}
$sb.Append("  ];") | Out-Null
$newArrayJs = $sb.ToString()

Write-Host "Reading $arenaPath..." -ForegroundColor Cyan
$html = [System.IO.File]::ReadAllText($arenaPath, [System.Text.Encoding]::UTF8)
$htmlNormalized = $html -replace "`r`n", "`n"

$leadsPattern = '(?s)  const LEADS_DATA = \[.*?\];\n\n  // Sound Engine'
if (-not ($htmlNormalized -match $leadsPattern)) {
    throw "Could not match exact LEADS_DATA block leading to '// Sound Engine' in $arenaPath"
}

$replacement = ($newArrayJs -replace "`r`n", "`n") + "`n`n  // Sound Engine"
$htmlUpdated = [System.Text.RegularExpressions.Regex]::Replace($htmlNormalized, $leadsPattern, [System.Text.RegularExpressions.MatchEvaluator]{ return $replacement })

# Convert back to CRLF
$finalHtml = $htmlUpdated -replace "`n", "`r`n"
[System.IO.File]::WriteAllText($arenaPath, $finalHtml, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "Successfully synced $($leads.Count) leads into $arenaPath!" -ForegroundColor Green
