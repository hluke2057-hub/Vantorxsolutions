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

# 1. Buddy 2 retains Level 5 & auto-pass
$buddyChecks = @(
    @{ Name = "grantCoursePass function exists"; Pattern = "function grantCoursePass\(u\)"; Expected = $true },
    @{ Name = "DEFAULT_PROFILES buddy has level 5"; Pattern = "level:\s*5"; Expected = $true },
    @{ Name = "DEFAULT_PROFILES buddy has autoPassed"; Pattern = "autoPassed:\s*true"; Expected = $true },
    @{ Name = "grantCoursePass buddy call on load"; Pattern = "grantCoursePass\(USER_PROFILES\.buddy\)"; Expected = $true },
    @{ Name = "Quick switch Buddy 2 button"; Pattern = "quickSwitchCaller\('buddy'\)"; Expected = $true }
)

# 2. Public auto-pass course controls REMOVED (Only Buddy 2 has it)
$autoPassRemovalChecks = @(
    @{ Name = "Auto-pass pill button removed from caller bar"; Pattern = 'id="quickPillAutoPass"'; Expected = $false },
    @{ Name = "Auto-pass button removed from Academy header"; Pattern = '🎓 Auto-Pass Course \(Level 5'; Expected = $false },
    @{ Name = "Auto-pass checkbox removed from create account modal"; Pattern = 'id="newRepAutoPass"'; Expected = $false }
)

# 3. Universal Prompts & Scripts (Good for EVERY company)
$universalPromptChecks = @(
    @{ Name = "10+ trucks removed from Arena"; Pattern = '10\+\s*trucks'; Expected = $false },
    @{ Name = "Universal Capacity Hook in place"; Pattern = 'When you''re running a business in <span class="dyn-city">\[City\]</span>,\s*your bottleneck usually isn''t getting leads'; Expected = $true },
    @{ Name = "Universal Gatekeeper Praise in place"; Pattern = 'running the front office and keeping the business moving while he''s out on jobs'; Expected = $true },
    @{ Name = "Universal Firsthand Test Line in place"; Pattern = 'so he can test it firsthand for 20 seconds'; Expected = $true }
)

$indexChecks = @(
    @{ Name = "LeadFlow CRM in pricing grid"; Pattern = 'LeadFlow CRM &amp; Pipeline'; Expected = $true },
    @{ Name = 'LeadFlow standalone $197/mo card'; Pattern = 'A La Carte: LeadFlow CRM \(\$197/mo\)'; Expected = $true }
)

Write-Host "`nVerifying Buddy 2 Auto-Pass:"
foreach ($c in $buddyChecks) {
    $matched = [regex]::IsMatch($arenaContent, $c.Pattern)
    if ($matched -eq $c.Expected) {
        Write-Host "  [PASS] $($c.Name)"
    } else {
        Write-Host "  [FAIL] $($c.Name) (Matched: $matched, Expected: $($c.Expected))"
        $hasErrors = $true
    }
}

Write-Host "`nVerifying Public Auto-Pass Controls Removed (Only Buddy 2 Has It):"
foreach ($c in $autoPassRemovalChecks) {
    $matched = [regex]::IsMatch($arenaContent, $c.Pattern)
    if ($matched -eq $c.Expected) {
        Write-Host "  [PASS] $($c.Name)"
    } else {
        Write-Host "  [FAIL] $($c.Name) (Matched: $matched, Expected: $($c.Expected))"
        $hasErrors = $true
    }
}

Write-Host "`nVerifying Universal Prompts for EVERY Company:"
foreach ($c in $universalPromptChecks) {
    $matched = [regex]::IsMatch($arenaContent, $c.Pattern)
    if ($matched -eq $c.Expected) {
        Write-Host "  [PASS] $($c.Name)"
    } else {
        Write-Host "  [FAIL] $($c.Name) (Matched: $matched, Expected: $($c.Expected))"
        $hasErrors = $true
    }
}

Write-Host "`nVerifying LeadFlow CRM on Homepage:"
foreach ($c in $indexChecks) {
    $matched = [regex]::IsMatch($indexContent, $c.Pattern)
    if ($matched -eq $c.Expected) {
        Write-Host "  [PASS] $($c.Name)"
    } else {
        Write-Host "  [FAIL] $($c.Name) (Matched: $matched, Expected: $($c.Expected))"
        $hasErrors = $true
    }
}

if ($hasErrors) {
    Write-Host "`nSOME CHECKS FAILED!"
    exit 1
} else {
    Write-Host "`nALL ENCODING, AUTO-PASS, AND UNIVERSAL PROMPT CHECKS PASSED (100%)!"
    exit 0
}
