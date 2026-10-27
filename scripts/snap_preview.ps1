# scripts/snap_preview.ps1
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outImg = "C:\Users\hungr\.gemini\antigravity\brain\b805e771-e1c1-4976-afc1-cd59dd49eae0\preview_hub_fixed.png"

$proc = Start-Process -FilePath $edgePath -ArgumentList @(
    "--headless",
    "--disable-gpu",
    "--window-size=1440,1100",
    "--screenshot=$outImg",
    "http://localhost:8088/"
) -PassThru -Wait

if (Test-Path $outImg) {
    Write-Host "Screenshot captured successfully: $outImg" -ForegroundColor Green
    $item = Get-Item $outImg
    Write-Host "File size: $($item.Length) bytes"
} else {
    Write-Host "Failed to capture screenshot." -ForegroundColor Red
}
