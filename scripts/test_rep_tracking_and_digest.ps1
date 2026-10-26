# scripts/test_rep_tracking_and_digest.ps1
$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$auditJsPath = Join-Path $repoRoot "website/api/audit.js"
$arenaHtmlPath = Join-Path $repoRoot "website/cold-call-arena/index.html"
$questHtmlPath = Join-Path $repoRoot "website/cold-call-quest/index.html"
$rosterPath = Join-Path $repoRoot "data/rep_roster.json"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "AUTOMATED REP TRACKING & FOUNDER TELEMETRY TEST SUITE" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$tests = @()
function Assert-True([string]$name, [bool]$condition) {
    $script:tests += [PSCustomObject]@{ Name = $name; Pass = $condition }
    if ($condition) {
        Write-Host "  [PASS] $name" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] $name" -ForegroundColor Red
    }
}

# TEST 1: Roster JSON file exists and contains initial seed profiles
Assert-True "rep_roster.json exists in data directory" (Test-Path $rosterPath)
$rosterContent = Get-Content $rosterPath -Raw -Encoding UTF8 | ConvertFrom-Json
Assert-True "rep_roster contains at least 2 default profiles" ($rosterContent.Count -ge 2)
$founder = $rosterContent | Where-Object { $_.id -eq "founder_luke" }
Assert-True "Founder Luke exists in rep roster" ($founder -ne $null)
Assert-True "Founder has course and game stats" ($founder.course -ne $null -and $founder.game -ne $null)

# TEST 2: audit.js syntax and endpoints definition
$auditCode = Get-Content $auditJsPath -Raw -Encoding UTF8
Assert-True "audit.js contains handleRepSync" ($auditCode.Contains("handleRepSync"))
Assert-True "audit.js contains handleRepDigest" ($auditCode.Contains("handleRepDigest"))
Assert-True "audit.js targets luke@vantorxsolutions.com and hluke2057@gmail.com" ($auditCode.Contains("luke@vantorxsolutions.com") -and $auditCode.Contains("hluke2057@gmail.com"))
Assert-True "audit.js supports rep-roster, rep-sync, and rep-digest actions" ($auditCode.Contains("rep-roster") -and $auditCode.Contains("rep-sync") -and $auditCode.Contains("rep-digest"))

# TEST 3: vercel.json contains /api/reps routing rewrites
$vercelJson = Get-Content (Join-Path $repoRoot "website/vercel.json") -Raw -Encoding UTF8
Assert-True "vercel.json has /api/reps rewrite" ($vercelJson.Contains('"/api/reps"'))
Assert-True "vercel.json has /api/reps/:action rewrite" ($vercelJson.Contains('"/api/reps/:action"'))

# TEST 4: cold-call-arena account creation modal has email input & cloud sync
$arenaHtml = Get-Content $arenaHtmlPath -Raw -Encoding UTF8
Assert-True "cold-call-arena has newRepEmail input" ($arenaHtml.Contains('id="newRepEmail"'))
Assert-True "cold-call-arena has syncRepToCloud function" ($arenaHtml.Contains("function syncRepToCloud"))
Assert-True "cold-call-arena calls syncRepToCloud on account creation" ($arenaHtml.Contains("account_created"))

# TEST 5: cold-call-quest has repModal, switch button, and cloud sync hooks
$questHtml = Get-Content $questHtmlPath -Raw -Encoding UTF8
Assert-True "cold-call-quest has repModal" ($questHtml.Contains('id="repModal"'))
Assert-True "cold-call-quest has Switch / Add Rep button" ($questHtml.Contains("openRepModal()"))
Assert-True "cold-call-quest has Email Progress Digest button" ($questHtml.Contains("triggerFounderDigest()"))
Assert-True "cold-call-quest has syncQuestToCloud function" ($questHtml.Contains("function syncQuestToCloud"))
Assert-True "cold-call-quest triggers cloud sync on boss defeat" ($questHtml.Contains("syncQuestToCloud('boss_defeated'"))

# TEST 6: Headless Edge Simulation on cold-call-quest rep registration & switcher
$edgeExe = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgeExe)) {
    $edgeExe = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$testScript = @'
<script>
window.__testResults = [];
function testAssert(name, cond) {
  window.__testResults.push({ name: name, pass: !!cond });
  console.log((cond ? '[PASS] ' : '[FAIL] ') + name);
}

try {
  // Test modal open
  openRepModal();
  const repModal = document.getElementById('repModal');
  testAssert("repModal has open class when opened", repModal && repModal.classList.contains('open'));

  // Test rep list rendered
  const questRepList = document.getElementById('questRepList');
  testAssert("questRepList rendered profiles", questRepList && questRepList.children.length >= 1);

  // Test new rep creation in Cold Call Quest
  document.getElementById('questNewRepName').value = "Marcus Stone";
  document.getElementById('questNewRepEmail').value = "marcus.closer@gmail.com";
  document.getElementById('questNewRepRole').value = "Outbound Closer";
  createNewQuestRep();

  const nameHeader = document.getElementById('playerNameHeader');
  testAssert("Player bar updated to Marcus Stone", nameHeader && nameHeader.textContent.includes('Marcus Stone'));

  const savedProfiles = JSON.parse(localStorage.getItem('vantorx_user_profiles_v2') || '{}');
  const foundMarcus = Object.values(savedProfiles).find(p => p.name === 'Marcus Stone');
  testAssert("Marcus Stone stored in localStorage user profiles", !!foundMarcus);
  testAssert("Marcus has email stored", foundMarcus && foundMarcus.email === 'marcus.closer@gmail.com');

  closeRepModal();
  testAssert("repModal closed after switching", !repModal.classList.contains('open'));
} catch(err) {
  testAssert("Exception in rep test harness: " + err.message, false);
}

document.body.setAttribute('data-test-done', 'true');
document.body.setAttribute('data-test-summary', JSON.stringify(window.__testResults));
</script>
'@

$harnessHtml = $questHtml.Replace("</body>", $testScript + "</body>")
$harnessPath = Join-Path $PSScriptRoot "test_rep_harness.html"
[System.IO.File]::WriteAllText($harnessPath, $harnessHtml, (New-Object System.Text.UTF8Encoding($true)))

$harnessUri = "file:///" + $harnessPath.Replace("\", "/")
$domOutput = & $edgeExe --headless=new --disable-gpu --virtual-time-budget=4000 --dump-dom $harnessUri | Out-String
Remove-Item $harnessPath -Force -ErrorAction SilentlyContinue

if ($domOutput -match 'data-test-summary="([^"]+)"') {
    $encoded = $matches[1].Replace("&quot;", '"')
    $browserTests = $encoded | ConvertFrom-Json
    foreach ($bt in $browserTests) {
        Assert-True $bt.name $bt.pass
    }
} else {
    Assert-True "Headless browser executed rep test harness" $false
}

$passed = ($tests | Where-Object { $_.Pass }).Count
$total = $tests.Count
Write-Host ""
Write-Host "Result: $passed/$total Tests Passed" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Red" })

if ($passed -ne $total) {
    exit 1
}
Write-Host "ALL SALES REP TRACKING & TELEMETRY TESTS PASSED!" -ForegroundColor Green
