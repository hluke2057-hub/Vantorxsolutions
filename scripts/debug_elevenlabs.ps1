$p = Get-Process -Id 14748 -ErrorAction SilentlyContinue
if ($p) {
    Write-Host "Process 14748 is ACTIVE and RUNNING! ($($p.ProcessName))"
} else {
    Write-Host "Process 14748 is NOT running."
}
