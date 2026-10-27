# scripts/snap_fullpage.ps1
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outImg = "C:\Users\hungr\.gemini\antigravity\brain\b805e771-e1c1-4976-afc1-cd59dd49eae0\preview_fullpage.png"

$proc = Start-Process -FilePath $edgePath -ArgumentList @(
    "--headless",
    "--disable-gpu",
    "--window-size=1440,3000",
    "--screenshot=$outImg",
    "http://localhost:8088/"
) -PassThru -Wait

if (Test-Path $outImg) {
    Write-Host "Full page screenshot captured: $outImg" -ForegroundColor Green
}
