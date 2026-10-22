param([string]$FilePath)
$fullPath = (Resolve-Path $FilePath).Path
$bytes = [System.IO.File]::ReadAllBytes($fullPath)
if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Write-Host "File already has UTF-8 BOM: $FilePath"
    exit 0
}
$text = [System.IO.File]::ReadAllText($fullPath, [System.Text.Encoding]::UTF8)
$utf8Bom = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllText($fullPath, $text, $utf8Bom)
Write-Host "Successfully saved with UTF-8 BOM: $FilePath"
