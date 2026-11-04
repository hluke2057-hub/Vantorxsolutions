# scripts/setup_node_portable.ps1
$nodeDir = "C:\Users\hungr\.nodejs"
$zipPath = Join-Path $env:TEMP "node-v20.18.0.zip"
$tempExtract = Join-Path $env:TEMP "node_temp_extract"

if (-not (Test-Path "$nodeDir\node.exe")) {
    Write-Host "Downloading standalone Node.js portable (v20.18.0 LTS)..." -ForegroundColor Cyan
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13
    $url = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip"
    Invoke-WebRequest -Uri $url -OutFile $zipPath -UseBasicParsing

    Write-Host "Extracting to $nodeDir..." -ForegroundColor Cyan
    if (Test-Path $tempExtract) { Remove-Item -Recurse -Force $tempExtract }
    Expand-Archive -Path $zipPath -DestinationPath $tempExtract -Force

    if (-not (Test-Path $nodeDir)) { New-Item -ItemType Directory -Path $nodeDir -Force | Out-Null }
    Copy-Item -Path "$tempExtract\node-v20.18.0-win-x64\*" -Destination $nodeDir -Recurse -Force

    Remove-Item -Recurse -Force $tempExtract, $zipPath -ErrorAction SilentlyContinue
}

Write-Host "✅ Node.js portable is installed and ready at $nodeDir" -ForegroundColor Green
$env:PATH = "$nodeDir;$env:PATH"
[Environment]::SetEnvironmentVariable("PATH", "$nodeDir;" + [Environment]::GetEnvironmentVariable("PATH", "User"), "User")

Write-Host "Verifying:"
& "$nodeDir\node.exe" --version
& "$nodeDir\npx.cmd" --version
