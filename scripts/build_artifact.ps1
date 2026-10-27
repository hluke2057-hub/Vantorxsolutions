# scripts/build_artifact.ps1
$mockHtmlPath = "C:\Users\hungr\.gemini\antigravity\scratch\Vantorxsolutions\website\motion-mock\index.html"
$artifactPath = "C:\Users\hungr\.gemini\antigravity\brain\b805e771-e1c1-4976-afc1-cd59dd49eae0\vantorx_advanced_website_demo.html"

$dashB64 = [System.IO.File]::ReadAllText("C:\Users\hungr\.gemini\antigravity\scratch\Vantorxsolutions\website\motion-mock\assets\dash_b64.txt", [System.Text.Encoding]::UTF8).Trim()
$avaB64 = [System.IO.File]::ReadAllText("C:\Users\hungr\.gemini\antigravity\scratch\Vantorxsolutions\website\motion-mock\assets\ava_b64.txt", [System.Text.Encoding]::UTF8).Trim()

$html = [System.IO.File]::ReadAllText($mockHtmlPath, [System.Text.Encoding]::UTF8)

# Inject Base64 fallback script definition for standalone offline viewing
if (-not $html.Contains("window.DASH_B64 =")) {
    $scriptInject = @"
<script>
window.DASH_B64 = 'data:image/jpeg;base64,$dashB64';
window.AVA_B64 = 'data:image/jpeg;base64,$avaB64';
</script>
"@
    $html = $html.Replace("</head>", "$scriptInject`n</head>")
}

[System.IO.File]::WriteAllText($artifactPath, $html, [System.Text.Encoding]::UTF8)
Write-Host "Artifact generated at $artifactPath with clean UTF-8 and embedded Base64 fallbacks." -ForegroundColor Green
