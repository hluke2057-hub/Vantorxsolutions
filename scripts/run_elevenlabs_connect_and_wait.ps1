# scripts/run_elevenlabs_connect_and_wait.ps1
$ErrorActionPreference = "Continue"

$nodeDir = "C:\Users\hungr\.nodejs"
$env:PATH = "$nodeDir;$env:PATH"

Write-Host "--- STEP 1: STARTING CONNECT ---"
$connectJson = & npx -y @elevenlabs/cli@latest onboard connect --env-path .env.local
Write-Host $connectJson

# Save the connect output immediately
$connectJson | Out-File -FilePath "scripts/last_connect_output.json" -Encoding utf8

# Try to automatically launch the default browser with the auth URL if found
try {
    $parsed = $connectJson | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($parsed.say -match "(https://elevenlabs\.io[^\s]+)") {
        $authUrl = $matches[1]
        Write-Host "Opening browser tab: $authUrl"
        Start-Process $authUrl -ErrorAction SilentlyContinue
    }
} catch {
    Write-Host "Browser launcher non-blocking skip"
}

Write-Host "--- STEP 2: LOOPING CONNECT --WAIT UNTIL APPROVED ---"
$iteration = 0
while ($true) {
    $iteration++
    Write-Host "[Wait Loop Iteration $iteration] Polling connect --wait..."
    $waitOut = & npx -y @elevenlabs/cli@latest onboard connect --wait --env-path .env.local
    Write-Host $waitOut
    $waitOut | Out-File -FilePath "scripts/last_wait_output.json" -Encoding utf8

    if ($waitOut -and ($waitOut -notmatch '"next"\s*:\s*"wait"')) {
        Write-Host "--- COMPLETED: Loop finished with new state! ---"
        break
    }
    Start-Sleep -Seconds 2
}
