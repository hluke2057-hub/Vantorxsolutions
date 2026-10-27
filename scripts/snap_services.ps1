# scripts/snap_services.ps1
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outImg = "C:\Users\hungr\.gemini\antigravity\brain\b805e771-e1c1-4976-afc1-cd59dd49eae0\preview_services_hub.png"

$proc = Start-Process -FilePath $edgePath -ArgumentList @(
    "--headless",
    "--disable-gpu",
    "--window-size=1440,1400",
    "--screenshot=$outImg",
    "http://localhost:8088/#services"
) -PassThru -Wait

if (Test-Path $outImg) {
    Write-Host "Screenshot captured: $outImg" -ForegroundColor Green
}
