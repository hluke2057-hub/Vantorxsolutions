# scripts/test_live_api.ps1
$ErrorActionPreference = "Continue"

Write-Host "--- Testing GET /api/lead-calls ---"
try {
    $res = Invoke-RestMethod -Uri "https://www.vantorxsolutions.com/api/lead-calls" -Method GET -TimeoutSec 10
    Write-Host "GET Success:"
    $res | ConvertTo-Json -Depth 4
} catch {
    Write-Host "GET Error: $($_.Exception.Message)"
}

Write-Host "`n--- Testing POST /api/lead-calls/lead-call-sync ---"
$payload = @{
    leadId = "fl_se_002"
    caller = "Carter McCauliss"
    call = @{
        called = $true
        caller = "Carter McCauliss"
        outcome = "Success"
        timestamp = "02:30 PM"
        notes = "Live test call from Carter"
    }
} | ConvertTo-Json

try {
    $postRes = Invoke-RestMethod -Uri "https://www.vantorxsolutions.com/api/lead-calls/lead-call-sync" -Method POST -Body $payload -ContentType "application/json" -TimeoutSec 10
    Write-Host "POST Success:"
    $postRes | ConvertTo-Json -Depth 4
} catch {
    Write-Host "POST Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host "Response Body: $($reader.ReadToEnd())"
    }
}

Write-Host "`n--- Testing GET again to see if fl_se_002 persisted ---"
try {
    $res2 = Invoke-RestMethod -Uri "https://www.vantorxsolutions.com/api/lead-calls" -Method GET -TimeoutSec 10
    Write-Host "GET After POST:"
    $res2 | ConvertTo-Json -Depth 4
} catch {
    Write-Host "GET Error: $($_.Exception.Message)"
}
