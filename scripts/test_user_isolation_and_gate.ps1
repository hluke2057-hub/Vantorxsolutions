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
Write-Host "AUTOMATED CLOSER SIGN-IN GATE & PROFILE ISOLATION TEST"
Write-Host "=========================================================="

$testScript = @'
<script>
window.__testResults = [];
function testAssert(name, cond) {
  window.__testResults.push({ name: name, pass: !!cond });
  console.log((cond ? '[PASS] ' : '[FAIL] ') + name);
}

try {
  // Clear any existing session to simulate a brand-new user visiting on their device
  localStorage.clear();

  // Test 1: Fresh Visit Gate Check
  updateUserUI();
  const gateModal = document.getElementById('signInGateModal');
  testAssert("Fresh visitor gets sign-in gate modal", gateModal && gateModal.classList.contains('active'));

  const headerNameBefore = document.getElementById('headerUserName');
  testAssert("Header does NOT say Luke Founder for fresh visitor", headerNameBefore && !headerNameBefore.textContent.includes('Luke (Founder)'));

  // Test 2: Closer Roman Signs Up
  document.getElementById('gateNameInput').value = "Roman Vance";
  document.getElementById('gateEmailInput').value = "roman@gmail.com";
  document.getElementById('gateRoleSelect').value = "Outbound Closer";
  handleSignInGateSubmit({ preventDefault: () => {} });

  testAssert("Gate modal closes after closer signs in", !gateModal.classList.contains('active'));

  const headerNameAfter = document.getElementById('headerUserName');
  testAssert("Header says Roman Vance instead of Luke Founder", headerNameAfter && headerNameAfter.textContent.includes('Roman Vance'));

  const callerBarCurrent = document.getElementById('callerBarCurrent');
  testAssert("Caller bar highlights Roman Vance", callerBarCurrent && callerBarCurrent.textContent.includes('Roman Vance'));

  const pillLuke = document.getElementById('quickPillLuke');
  const pillBuddy = document.getElementById('quickPillBuddy');
  testAssert("quickPillLuke is HIDDEN for closer Roman", pillLuke && pillLuke.style.display === 'none');
  testAssert("quickPillBuddy is HIDDEN for closer Roman (only Luke can see Buddy 2)", pillBuddy && pillBuddy.style.display === 'none');

  const pillSelf = document.getElementById('quickPillSelf');
  testAssert("quickPillSelf is VISIBLE and displays Roman Vance", pillSelf && pillSelf.style.display !== 'none' && pillSelf.textContent.includes('Roman Vance'));

  const fbContainer = document.getElementById('founderBypassContainer');
  testAssert("Founder God Mode bypass container is HIDDEN from Roman", fbContainer && fbContainer.style.display === 'none');

  const btnEmailDigest = document.getElementById('btnCallerEmailDigest');
  testAssert("Email Digest button is HIDDEN from Roman", btnEmailDigest && btnEmailDigest.style.display === 'none');

  // Test 3: Account Modal Isolation for Roman
  renderAccountProfileList();
  const accountList = document.getElementById('accountProfileList');
  testAssert("Account list contains Roman's profile", accountList && accountList.textContent.includes('Roman Vance'));
  testAssert("Account list does NOT contain Buddy 2 for Roman", accountList && !accountList.textContent.includes('Buddy 2'));
  testAssert("Account list does NOT contain Luke Founder for Roman", accountList && !accountList.textContent.includes('Luke (Founder)'));

  // Test 4: Access Restriction - Roman cannot switch to Luke or Buddy
  quickSwitchCaller('luke');
  testAssert("Unauthorized quickSwitchCaller('luke') rejected; active user remains Roman", getActiveUser().name === 'Roman Vance');
  quickSwitchCaller('buddy');
  testAssert("Unauthorized quickSwitchCaller('buddy') rejected; active user remains Roman", getActiveUser().name === 'Roman Vance');

  // Test 5: Log Out
  logoutCloser();
  testAssert("Log out clears active user and re-opens sign-in gate", gateModal.classList.contains('active') && getActiveUser().id === 'guest');

  // Test 6: Founder Luke Sign In
  promptFounderLogin = function() {}; // mock prompt
  localStorage.setItem('vantorx_active_user_id_v2', 'luke');
  updateUserUI();

  const hNameFounder = document.getElementById('headerUserName');
  testAssert("Luke gets Luke (Founder) in header", hNameFounder && hNameFounder.textContent.includes('Luke (Founder)'));

  testAssert("Luke CAN see quickPillLuke", pillLuke && pillLuke.style.display !== 'none');
  testAssert("Luke CAN see quickPillBuddy (Buddy 2)", pillBuddy && pillBuddy.style.display !== 'none');
  testAssert("Luke CAN see Founder God Mode bypass", fbContainer && fbContainer.style.display !== 'none');
  testAssert("Luke CAN see Email Digest button", btnEmailDigest && btnEmailDigest.style.display !== 'none');

  renderAccountProfileList();
  testAssert("Luke's roster view includes Roman Vance", accountList.textContent.includes('Roman Vance'));
  testAssert("Luke's roster view includes Carter McCauliss", accountList.textContent.includes('Carter McCauliss'));

} catch(err) {
  testAssert("Exception in isolation test: " + err.message, false);
}

document.body.setAttribute('data-test-done', 'true');
document.body.setAttribute('data-test-summary', JSON.stringify(window.__testResults));
</script>
'@

$harnessHtml = $arenaHtml.Replace("</body>", $testScript + "</body>")
$harnessPath = Join-Path $PSScriptRoot "test_isolation_harness.html"
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
    Assert-True "Headless browser executed isolation test harness" $false
}

$passed = ($tests | Where-Object { $_.Pass }).Count
$total = $tests.Count
Write-Host ""
Write-Host "Result: $passed/$total Tests Passed" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Red" })

if ($passed -ne $total) {
    exit 1
}
Write-Host "ALL CLOSER SIGN-IN GATE & PROFILE ISOLATION TESTS PASSED!" -ForegroundColor Green
