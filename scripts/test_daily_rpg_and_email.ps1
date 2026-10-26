# scripts/test_daily_rpg_and_email.ps1
$ErrorActionPreference = "Stop"

$questHtmlPath = Join-Path $PSScriptRoot "..\website\cold-call-quest\index.html"
$indexHtmlPath = Join-Path $PSScriptRoot "..\website\index.html"
$emailJsPath = Join-Path $PSScriptRoot "..\website\api\_lib\email.js"

$questHtml = [System.IO.File]::ReadAllText((Resolve-Path $questHtmlPath).Path, [System.Text.Encoding]::UTF8)
$indexHtml = [System.IO.File]::ReadAllText((Resolve-Path $indexHtmlPath).Path, [System.Text.Encoding]::UTF8)
$emailJs = [System.IO.File]::ReadAllText((Resolve-Path $emailJsPath).Path, [System.Text.Encoding]::UTF8)

# Construct automated headless test runner script
$sb = [System.Text.StringBuilder]::new()
[void]$sb.AppendLine('<div id="questDailyTestBox" style="padding:20px;background:#000;color:#fff;font-family:monospace">')
[void]$sb.AppendLine('  <h2>AUTOMATED DAILY RPG & EMAIL DELIVERABILITY TEST RESULTS</h2>')
[void]$sb.AppendLine('  <pre id="questDailyTestOutput">RUNNING...</pre>')
[void]$sb.AppendLine('</div>')
[void]$sb.AppendLine('<script>')
[void]$sb.AppendLine('setTimeout(function() {')
[void]$sb.AppendLine('  const tests = [];')
[void]$sb.AppendLine('  function assert(name, condition) {')
[void]$sb.AppendLine('    tests.push({ name: name, pass: !!condition });')
[void]$sb.AppendLine('    console.log((condition ? "[PASS] " : "[FAIL] ") + name);')
[void]$sb.AppendLine('  }')
[void]$sb.AppendLine('  try {')
[void]$sb.AppendLine('    assert("DAILY_MUTATORS array contains all 7 days of the week", Array.isArray(window.DAILY_MUTATORS) && window.DAILY_MUTATORS.length === 7);')
[void]$sb.AppendLine('    assert("getDailyBountyBossIndex function exists", typeof window.getDailyBountyBossIndex === "function");')
[void]$sb.AppendLine('    const bountyIdx = window.getDailyBountyBossIndex();')
[void]$sb.AppendLine('    assert("getDailyBountyBossIndex returns valid boss index (0-7)", bountyIdx >= 0 && bountyIdx < 8);')
[void]$sb.AppendLine('    const todayMutator = window.getTodayMutator();')
[void]$sb.AppendLine('    assert("getTodayMutator returns valid tactical mutator", todayMutator && typeof todayMutator.name === "string");')
[void]$sb.AppendLine('    const banner = document.getElementById("dailyRpgBanner");')
[void]$sb.AppendLine('    assert("Daily RPG banner element is rendered in DOM", !!banner);')
[void]$sb.AppendLine('    const bountyNameEl = document.getElementById("bountyBossName");')
[void]$sb.AppendLine('    assert("Bounty boss name element is present", !!bountyNameEl && bountyNameEl.textContent.length > 0);')
[void]$sb.AppendLine('    const mutatorTitleEl = document.getElementById("mutatorTitle");')
[void]$sb.AppendLine('    assert("Mutator title element is present", !!mutatorTitleEl && mutatorTitleEl.textContent === todayMutator.name);')
[void]$sb.AppendLine('    const monMutator = window.DAILY_MUTATORS[1];')
[void]$sb.AppendLine('    const baseDamage = 36;')
[void]$sb.AppendLine('    const boostedDmg = monMutator.apply(baseDamage, { hasLeakHook: true });')
[void]$sb.AppendLine('    assert("Monday mutator boosts leak hook strike by +25%", boostedDmg === Math.round(baseDamage * 1.25));')
[void]$sb.AppendLine('    const tueMutator = window.DAILY_MUTATORS[2];')
[void]$sb.AppendLine('    const crmBoosted = tueMutator.apply(40, { hasCrmMention: true });')
[void]$sb.AppendLine('    assert("Tuesday mutator boosts CRM strike by +30%", crmBoosted === Math.round(40 * 1.30));')
[void]$sb.AppendLine('    selectBoss(bountyIdx);')
[void]$sb.AppendLine('    const initialDealsClosed = window.dailyState.dealsClosedToday || 0;')
[void]$sb.AppendLine('    handleBossDefeat({ contractorReply: "Deal closed kid, send Ava over." });')
[void]$sb.AppendLine('    assert("Defeating bounty boss flags bountyDefeatedToday as true", window.dailyState.bountyDefeatedToday === true);')
[void]$sb.AppendLine('    assert("Defeating boss increments dailyState.dealsClosedToday", window.dailyState.dealsClosedToday === initialDealsClosed + 1);')
[void]$sb.AppendLine('    const logEl = document.getElementById("combatLog");')
[void]$sb.AppendLine('    assert("Combat log announces 2X Daily Bounty claimed", logEl.innerHTML.indexOf("2X XP") !== -1 || logEl.innerHTML.indexOf("DAILY CONTRACTOR BOUNTY") !== -1);')
[void]$sb.AppendLine('    window.dailyState.dealsClosedToday = 3;')
[void]$sb.AppendLine('    window.dailyState.bonusClaimed = false;')
[void]$sb.AppendLine('    window.updateDailyUI();')
[void]$sb.AppendLine('    const claimBtn = document.getElementById("claimDailyBonusBtn");')
[void]$sb.AppendLine('    assert("Claim bonus button becomes enabled when quota >= 3", claimBtn && !claimBtn.disabled);')
[void]$sb.AppendLine('    assert("Claim button has ready class for animation", claimBtn && claimBtn.classList.contains("ready"));')
[void]$sb.AppendLine('    const xpBefore = player.xp;')
[void]$sb.AppendLine('    const goldBefore = player.gold;')
[void]$sb.AppendLine('    window.claimDailyBonus();')
[void]$sb.AppendLine('    assert("Claiming daily bonus awards +150 XP", player.xp === xpBefore + 150);')
[void]$sb.AppendLine('    assert("Claiming daily bonus awards +100 GP", player.gold === goldBefore + 100);')
[void]$sb.AppendLine('    assert("dailyState.bonusClaimed is true after claiming", window.dailyState.bonusClaimed === true);')
[void]$sb.AppendLine('    assert("Claim button is disabled after claiming", claimBtn && claimBtn.disabled);')
[void]$sb.AppendLine('    const bountyCard = document.querySelector(".boss-card-btn.bounty-target");')
[void]$sb.AppendLine('    assert("Todays bounty boss has bounty-target CSS class in sidebar", !!bountyCard);')
[void]$sb.AppendLine('    assert("Bounty chip is displayed on featured boss card", bountyCard && bountyCard.innerHTML.indexOf("2X BOUNTY") !== -1);')
[void]$sb.AppendLine('  } catch(e) {')
[void]$sb.AppendLine('    assert("Daily RPG Test Exception: " + e.message, false);')
[void]$sb.AppendLine('  }')
[void]$sb.AppendLine('  const output = document.getElementById("questDailyTestOutput");')
[void]$sb.AppendLine('  output.textContent = JSON.stringify(tests, null, 2);')
[void]$sb.AppendLine('}, 350);')
[void]$sb.AppendLine('</script>')
$testScript = $sb.ToString()

# Run Headless Chrome Test
$tempHtmlPath = Join-Path $PSScriptRoot "temp_daily_test.html"
$injectedHtml = $questHtml.Replace("</body>", "$testScript</body>")
[System.IO.File]::WriteAllText($tempHtmlPath, $injectedHtml, [System.Text.Encoding]::UTF8)

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
  $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$dumpFile = Join-Path $PSScriptRoot "temp_dump_daily.html"
$fileUri = (Resolve-Path $tempHtmlPath).Path

$p = Start-Process -FilePath $edgePath -ArgumentList @(
  "--headless",
  "--disable-gpu",
  "--dump-dom",
  "--virtual-time-budget=8000",
  $fileUri
) -NoNewWindow -PassThru -RedirectStandardOutput $dumpFile

$p.WaitForExit(10000)
Start-Sleep -Milliseconds 600
$dump = [System.IO.File]::ReadAllText($dumpFile, [System.Text.Encoding]::UTF8)

Remove-Item -Path $tempHtmlPath -Force -ErrorAction SilentlyContinue
Remove-Item -Path $dumpFile -Force -ErrorAction SilentlyContinue

$jsonMatch = [regex]::Match($dump, '(?s)<pre id="questDailyTestOutput">(.*?)</pre>')
if ($jsonMatch.Success) {
  $rawJson = $jsonMatch.Groups[1].Value.Trim()
  $testResults = $rawJson | ConvertFrom-Json
  
  Write-Host "==========================================================" -ForegroundColor Cyan
  Write-Host "  COLD CALL QUEST DAILY RPG AUTOMATED TEST RESULTS        " -ForegroundColor Yellow
  Write-Host "==========================================================" -ForegroundColor Cyan
  
  $passedCount = 0
  foreach ($t in $testResults) {
    if ($t.pass) {
      Write-Host "  [PASS] $($t.name)" -ForegroundColor Green
      $passedCount++
    } else {
      Write-Host "  [FAIL] $($t.name)" -ForegroundColor Red
    }
  }
  
  Write-Host "`nResult: $passedCount/$($testResults.Count) Tests Passed" -ForegroundColor Cyan
  if ($passedCount -ne $testResults.Count) {
    throw "Some Daily RPG tests failed!"
  }
} else {
  throw "Failed to extract test results from Chrome output!"
}

# ============================================================
# TEST SUITE 6: ZERO-LOSS CLIENT STORAGE IN WEBSITE INDEX.HTML
# ============================================================
Write-Host "`nTesting Website Lead Form Zero-Loss Fallback in index.html..." -ForegroundColor Yellow
$hasLocalStorage = $indexHtml.IndexOf("vantorx_lead_inquiries") -ne -1
$hasImmediateSave = $indexHtml.IndexOf("saved.unshift(leadData)") -ne -1
$hasOfflineFallback = $indexHtml.IndexOf("Luke will be in touch shortly") -ne -1

if ($hasLocalStorage -and $hasImmediateSave -and $hasOfflineFallback) {
  Write-Host "  [PASS] index.html saves inquiries to vantorx_lead_inquiries synchronously" -ForegroundColor Green
  Write-Host "  [PASS] index.html displays reassuring confirmation without scaring prospects on offline/API error" -ForegroundColor Green
} else {
  throw "Website index.html zero-loss fallback test failed!"
}

# ============================================================
# TEST SUITE 7: EMAIL SENDER DOMAIN RESEND FALLBACK
# ============================================================
Write-Host "`nTesting Resend Email Domain Fallback in email.js..." -ForegroundColor Yellow
$hasDomainFallback = $emailJs.Contains("onboarding@resend.dev")
$hasDomainCheck = $emailJs.Contains("errMsg.includes(`"domain`")")

if ($hasDomainFallback -and $hasDomainCheck) {
  Write-Host "  [PASS] email.js contains automatic fallback to onboarding@resend.dev when domain is unverified" -ForegroundColor Green
} else {
  throw "email.js domain fallback test failed!"
}

Write-Host "`nALL DAILY RPG & EMAIL DELIVERABILITY TESTS PASSED WITH 100% SUCCESS!" -ForegroundColor Green
