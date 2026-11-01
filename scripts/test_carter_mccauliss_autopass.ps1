param()

$edgePaths = @(
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
)
$edgeExe = $null
foreach ($p in $edgePaths) {
    if (Test-Path $p) { $edgeExe = $p; break }
}
if (!$edgeExe) {
    Write-Error "Microsoft Edge not found"
    exit 1
}

$arenaPath = Join-Path $PSScriptRoot "..\website\cold-call-arena\index.html"
$arenaHtml = [System.IO.File]::ReadAllText($arenaPath, [System.Text.Encoding]::UTF8)

$questPath = Join-Path $PSScriptRoot "..\website\cold-call-quest\index.html"
$questHtml = [System.IO.File]::ReadAllText($questPath, [System.Text.Encoding]::UTF8)

$tests = [System.Collections.Generic.List[PSObject]]::new()
function Assert-True($name, $cond) {
    $tests.Add([PSCustomObject]@{ Name = $name; Pass = [bool]$cond })
    if ($cond) {
        Write-Host "  [PASS] $name" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] $name" -ForegroundColor Red
    }
}

Write-Host "=========================================================="
Write-Host "AUTOMATED CARTER MCCAULISS AUTO-PASS & 1-CLICK LOGIN TEST"
Write-Host "=========================================================="

# Test Arena
$arenaTestScript = @'
<script>
window.__testResults = [];
function testAssert(name, cond) {
  window.__testResults.push({ name: name, pass: !!cond });
  console.log((cond ? '[PASS] ' : '[FAIL] ') + name);
}

try {
  localStorage.clear();
  updateUserUI();

  // Test 1: Button exists in gate modal
  const carterGateBtn = document.getElementById('btnGateLoginCarter');
  testAssert("1-click Carter Login button exists in Arena Sign-In Gate", !!carterGateBtn);

  // Test 2: Click Carter login button
  if (carterGateBtn) carterGateBtn.click();
  const curUser = getActiveUser();
  testAssert("Active user is Carter McCauliss after 1-click login", curUser && curUser.id === 'carter_mccauliss' && curUser.name === 'Carter McCauliss');
  testAssert("Carter is Level 5 Certified", curUser && curUser.level === 5);
  testAssert("Carter has 1850 XP", curUser && curUser.xp === 1850);
  testAssert("Carter autoPassed is true", curUser && curUser.autoPassed === true);
  testAssert("Carter founderBypass is true", curUser && curUser.founderBypass === true);
  testAssert("Carter completedUnits has 15 units", curUser && curUser.completedUnits && curUser.completedUnits.length === 15);
  testAssert("Carter daysPassed has 3 days", curUser && curUser.daysPassed && curUser.daysPassed.length === 3);
  testAssert("Carter bossesDefeated is 8", curUser && curUser.bossesDefeated === 8);

  // Test 3: Sign-In Gate Modal is CLOSED
  const gateModal = document.getElementById('signInGateModal');
  testAssert("Sign-in gate modal is closed for Carter", gateModal && !gateModal.classList.contains('active'));

  // Test 4: Quick Pill in Caller Bar
  const pillCarter = document.getElementById('quickPillCarter');
  testAssert("Carter quick pill is VISIBLE and ACTIVE", pillCarter && pillCarter.style.display !== 'none' && pillCarter.classList.contains('active'));

  // Test 5: Lead table is UNLOCKED
  const lockedGate = document.getElementById('leadsLockedGate');
  testAssert("Leads table locked gate is HIDDEN for Carter", lockedGate && lockedGate.style.display === 'none');

  // Test 6: Form login with "carter" routes to Carter McCauliss
  localStorage.clear();
  document.getElementById('gateNameInput').value = "carter";
  document.getElementById('gateEmailInput').value = "cartermccauliss@gmail.com";
  handleSignInGateSubmit({ preventDefault: () => {} });
  const formUser = getActiveUser();
  testAssert("Entering 'carter' into sign-in form activates Carter McCauliss Level 5 Auto-Pass", formUser && formUser.id === 'carter_mccauliss' && formUser.level === 5 && formUser.autoPassed);

} catch(err) {
  testAssert("Exception in Arena Carter test: " + err.message, false);
}

document.body.setAttribute('data-test-done', 'true');
document.body.setAttribute('data-test-summary', JSON.stringify(window.__testResults));
</script>
'@

$harnessHtml = $arenaHtml.Replace("</body>", $arenaTestScript + "</body>")
$harnessPath = Join-Path $PSScriptRoot "test_carter_arena_harness.html"
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
    Assert-True "Headless browser executed Arena Carter test harness" $false
}

# Test Quest
$questTestScript = @'
<script>
window.__testResults = [];
function testAssert(name, cond) {
  window.__testResults.push({ name: name, pass: !!cond });
  console.log((cond ? '[PASS] ' : '[FAIL] ') + name);
}

try {
  localStorage.clear();

  // Test 1: Button exists in Quest gate modal
  const carterQuestBtn = document.getElementById('btnQuestLoginCarter');
  testAssert("1-click Carter Login button exists in Cold Call Quest Gate", !!carterQuestBtn);

  // Test 2: Click Carter login button in Quest
  if (carterQuestBtn) carterQuestBtn.click();
  const questUid = localStorage.getItem('vantorx_active_user_id_v2');
  const questProfiles = JSON.parse(localStorage.getItem('vantorx_user_profiles_v2') || '{}');
  const qCarter = questProfiles[questUid];

  testAssert("Active Quest user is carter_mccauliss", questUid === 'carter_mccauliss');
  testAssert("Quest Carter is Level 5", qCarter && qCarter.level === 5);
  testAssert("Quest Carter has 1850 XP", qCarter && qCarter.xp === 1850);
  testAssert("Quest Carter has 8 bossesDefeated", qCarter && qCarter.bossesDefeated === 8);
  testAssert("Quest Carter autoPassed is true", qCarter && qCarter.autoPassed === true);
  testAssert("Quest Carter streak is 5", qCarter && qCarter.streak === 5);

  const questModal = document.getElementById('questSignInModal');
  testAssert("Quest sign-in modal is closed for Carter", questModal && !questModal.classList.contains('open'));

  // Test 3: Form login with "carter" in Quest
  localStorage.clear();
  document.getElementById('questGateNameInput').value = "Carter McCauliss";
  document.getElementById('questGateEmailInput').value = "carter@gmail.com";
  window.handleQuestSignInGateSubmit({ preventDefault: () => {} });
  const formUid = localStorage.getItem('vantorx_active_user_id_v2');
  const formProfiles = JSON.parse(localStorage.getItem('vantorx_user_profiles_v2') || '{}');
  testAssert("Quest Form input for Carter activates carter_mccauliss Level 5 Auto-Pass", formUid === 'carter_mccauliss' && formProfiles.carter_mccauliss.level === 5 && formProfiles.carter_mccauliss.bossesDefeated === 8);

} catch(err) {
  testAssert("Exception in Quest Carter test: " + err.message, false);
}

document.body.setAttribute('data-test-done', 'true');
document.body.setAttribute('data-test-summary', JSON.stringify(window.__testResults));
</script>
'@

$questHarnessHtml = $questHtml.Replace("</body>", $questTestScript + "</body>")
$questHarnessPath = Join-Path $PSScriptRoot "test_carter_quest_harness.html"
[System.IO.File]::WriteAllText($questHarnessPath, $questHarnessHtml, (New-Object System.Text.UTF8Encoding($true)))
$questHarnessUri = "file:///" + $questHarnessPath.Replace("\", "/")
$domOutput2 = & $edgeExe --headless=new --disable-gpu --virtual-time-budget=4000 --dump-dom $questHarnessUri | Out-String
Remove-Item $questHarnessPath -Force -ErrorAction SilentlyContinue

if ($domOutput2 -match 'data-test-summary="([^"]+)"') {
    $encoded2 = $matches[1].Replace("&quot;", '"')
    $browserTests2 = $encoded2 | ConvertFrom-Json
    foreach ($bt in $browserTests2) {
        Assert-True $bt.name $bt.pass
    }
} else {
    Assert-True "Headless browser executed Quest Carter test harness" $false
}

$passed = ($tests | Where-Object { $_.Pass }).Count
$total = $tests.Count
Write-Host ""
Write-Host "Result: $passed/$total Tests Passed" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Red" })

if ($passed -ne $total) {
    exit 1
}
Write-Host "ALL CARTER MCCAULISS AUTO-PASS TESTS PASSED!" -ForegroundColor Green
