$files = Get-ChildItem data, website\data -Filter *.json -Recurse
foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        if ($content.StartsWith([char]0xFEFF)) { $content = $content.Substring(1) }
        $null = $content | ConvertFrom-Json
        Write-Host "VALID: $($file.Name)" -ForegroundColor Green
    } catch {
        Write-Host "INVALID JSON: $($file.Name) - $($_.Exception.Message)" -ForegroundColor Red
    }
}

