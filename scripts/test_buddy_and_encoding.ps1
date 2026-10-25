$files = @(
    "website\cold-call-quest\index.html",
    "website\cold-call-arena\index.html",
    "website\index.html"
)

$hasErrors = $false
foreach ($f in $files) {
    if (Test-Path $f) {
        $raw = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
        # Mojibake signature regex: check for corrupted double-byte patterns
        $m1 = [regex]::Matches($raw, "\u00f0\u0178|\u00e2\u0161|\u00c2\u00b7|\u00e2\u0153")
        Write-Host "$f mojibake matches: $($m1.Count)"
        if ($m1.Count -gt 0) {
            $hasErrors = $true
        }
    } else {
        Write-Host "File missing: $f"
        $hasErrors = $true
    }
}

# Check buddy 2 and auto pass in Cold Call Arena
$arenaContent = [System.IO.File]::ReadAllText("website\cold-call-arena\index.html", [System.Text.Encoding]::UTF8)
$indexContent = [System.IO.File]::ReadAllText("website\index.html", [System.Text.Encoding]::UTF8)

$arenaChecks = @(
    @{ Name = "grantCoursePass function exists"; Pattern = "function grantCoursePass\(u\)" },
    @{ Name = "DEFAULT_PROFILES buddy has level 5"; Pattern = "level:\s*5" },
    @{ Name = "DEFAULT_PROFILES buddy has autoPassed"; Pattern = "autoPassed:\s*true" },
    @{ Name = "grantCoursePass buddy call on load"; Pattern = "grantCoursePass\(USER_PROFILES\.buddy\)" },
    @{ Name = "autoPassActiveUser window function"; Pattern = "window\.autoPassActiveUser\s*=" },
    @{ Name = "Quick switch Buddy 2 button"; Pattern = "quickSwitchCaller\('buddy'\)" },
    @{ Name = "Auto-pass checkbox in account modal"; Pattern = "id=`"newRepAutoPass`"" },
    @{ Name = "Auto-pass pill button in caller bar"; Pattern = "id=`"quickPillAutoPass`"" }
)

$indexChecks = @(
    @{ Name = "LeadFlow CRM in pricing grid"; Pattern = 'LeadFlow CRM &amp; Pipeline' },
    @{ Name = 'LeadFlow standalone $197/mo card'; Pattern = 'A La Carte: LeadFlow CRM \(\$197/mo\)' }
)

Write-Host "`nVerifying Auto-Pass & Account Persistence in Cold Call Arena:"
foreach ($c in $arenaChecks) {
    $matched = [regex]::IsMatch($arenaContent, $c.Pattern)
    if ($matched) {
        Write-Host "  [PASS] $($c.Name)"
    } else {
        Write-Host "  [FAIL] $($c.Name)"
        $hasErrors = $true
    }
}

Write-Host "`nVerifying LeadFlow CRM on Homepage:"
foreach ($c in $indexChecks) {
    $matched = [regex]::IsMatch($indexContent, $c.Pattern)
    if ($matched) {
        Write-Host "  [PASS] $($c.Name)"
    } else {
        Write-Host "  [FAIL] $($c.Name)"
        $hasErrors = $true
    }
}

if ($hasErrors) {
    Write-Host "`nSOME CHECKS FAILED!"
    exit 1
} else {
    Write-Host "`nALL ENCODING AND AUTO-PASS CHECKS PASSED (100%)!"
    exit 0
}
