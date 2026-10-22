param([string]$Path = "$PSScriptRoot\..\website\cold-call-arena\index.html")
$fullPath = (Resolve-Path $Path).Path
$html = [System.IO.File]::ReadAllText($fullPath, [System.Text.Encoding]::UTF8)
$pattern = '(?:\u00C3|\u00E2\u20AC|\uFFFD|\u00F0\u0178)'
$matches = [regex]::Matches($html, $pattern)
Write-Host "File tested: $fullPath"
Write-Host "Total mojibake matches: $($matches.Count)"
if ($matches.Count -gt 0) {
    for ($i=0; $i -lt [Math]::Min(10, $matches.Count); $i++) {
        $idx = $matches[$i].Index
        $start = [Math]::Max(0, $idx - 10)
        $len = [Math]::Min($html.Length - $start, 35)
        Write-Host "Match $($i+1): $($html.Substring($start, $len))"
    }
}
