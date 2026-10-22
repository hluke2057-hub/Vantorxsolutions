$content = [System.IO.File]::ReadAllText("$PSScriptRoot\build_full_arena.ps1", [System.Text.Encoding]::UTF8)
$pattern = '(?:\u00C3|\u00E2\u20AC|\uFFFD|\u00F0\u0178)'
$matches = [regex]::Matches($content, $pattern)
Write-Host "Total mojibake matches in build_full_arena.ps1: $($matches.Count)"
