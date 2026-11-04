# scripts/run_elevenlabs_onboard.ps1
$ErrorActionPreference = "Stop"

$nodeDir = "C:\Users\hungr\.nodejs"
if (Test-Path $nodeDir) {
    $env:PATH = "$nodeDir;$env:PATH"
}

Write-Host "Node version: $(node --version)" -ForegroundColor Cyan
Write-Host "NPX version: $(npx --version)" -ForegroundColor Cyan

Write-Host "Executing ElevenLabs CLI: npx -y @elevenlabs/cli@latest onboard connect --wait --env-path .env.local" -ForegroundColor Yellow
npx -y @elevenlabs/cli@latest onboard connect --wait --env-path .env.local
