# scripts/test_quest_upgrades.ps1
$ErrorActionPreference = "Stop"

$htmlSource = Join-Path $PSScriptRoot "..\website\cold-call-quest\index.html"
$content = [System.IO.File]::ReadAllText((Resolve-Path $htmlSource).Path, [System.Text.Encoding]::UTF8)

# Test Runner Script to append right before </body>
$testScript = @'
<div id="testUpgradesResultsBox" style="padding:20px;background:#000;color:#fff;font-family:monospace">
  <h2>AUTOMATED QUEST 5.0 UPGRADES TEST RESULTS</h2>
  <div id="testOutput">RUNNING...</div>
</div>
<script>
(function() {
  const tests = [];
  function assert(name, condition) {
    tests.push({ name: name, pass: !!condition });
    console.log((condition ? '[PASS] ' : '[FAIL] ') + name);
  }

  try {
    // TEST 1: Bosses Gauntlet Roster
    assert("BOSSES array expanded to at least 10 bosses", Array.isArray(window.BOSSES) && window.BOSSES.length >= 10);
    assert("Boss 8 is Marco The Asphalt King (450 HP)", window.BOSSES[8].key === 'marco' && window.BOSSES[8].hp === 450);
    assert("Boss 9 is Rex The PE Buyer Sterling (550 HP)", window.BOSSES[9].key === 'rex' && window.BOSSES[9].hp === 550);

    // TEST 2: Select Boss 8 (Marco) and test commercial paving opener & dialogue
    selectBoss(8);
    assert("Current boss is Marco", currentBoss.key === 'marco');
    assert("Marco maxHp is 450", currentBoss.maxHp === 450);

    const inputEl = document.getElementById('playerCustomInput');
    inputEl.value = "Hey Marco, I know you're busy running a 15-ton roller — you got 20 seconds before you hang up?";
    const evalMarcoOpener = evaluateTurn(inputEl.value);
    assert("Marco grants 20 seconds for asphalt job site", evalMarcoOpener.contractorReply.indexOf('roller') !== -1 || evalMarcoOpener.contractorReply.indexOf('asphalt') !== -1 || evalMarcoOpener.contractorReply.indexOf('20 seconds') !== -1);
    submitRebuttal();
    assert("Marco advances to permission_granted", matchMemory.stage === 'permission_granted');

    // TEST 3: Select Boss 9 (Rex) and test institutional PE dialogue
    selectBoss(9);
    assert("Current boss is Rex", currentBoss.key === 'rex');
    assert("Rex maxHp is 550", currentBoss.maxHp === 550);
    inputEl.value = "Where do after-hours calls go across your 40 locations right now? Straight to offshore answering services that drop 12% of calls and depress EBITDA?";
    const evalRexPain = evaluateTurn(inputEl.value);
    assert("Rex acknowledges EBITDA and 40 locations pain", evalRexPain.contractorReply.indexOf('EBITDA') !== -1 || evalRexPain.contractorReply.indexOf('40') !== -1 || evalRexPain.contractorReply.indexOf('bottleneck') !== -1 || evalRexPain.contractorReply.indexOf('revenue') !== -1);

    // TEST 4: Tactical Combat Belt UI Elements
    const beltContainer = document.querySelector('.combat-belt-container');
    assert("Tactical Combat Belt container is rendered in DOM", !!beltContainer);
    const espressoBtn = document.getElementById('beltEspressoBtn');
    const flashbangBtn = document.getElementById('beltFlashbangBtn');
    const shieldBtn = document.getElementById('beltShieldBtn');
    assert("Espresso, Flashbang, and Shield buttons exist", !!espressoBtn && !!flashbangBtn && !!shieldBtn);

    // TEST 5: Tactical Item 1 - Espresso Thermos (+35 HP, clears hesitation, focused tone)
    player.hp = 40;
    player.consumables.espresso = 2;
    matchMemory.consecutiveHesitation = 2;
    useCombatItem('espresso');
    assert("Espresso consumed 1 charge (now 1)", player.consumables.espresso === 1);
    assert("Espresso restored +35 HP (now 75)", player.hp === 75);
    assert("Espresso cleared hesitation count", matchMemory.consecutiveHesitation === 0);
    assert("Espresso activated focusedToneActive", player.focusedToneActive === true);

    // Focused tone deals +20% damage on next rebuttal
    inputEl.value = "LeadFlow is our contractor CRM that auto-texts missed calls in 90 seconds.";
    const evalFocused = evaluateTurn(inputEl.value);
    assert("Focused tone applied +20% damage bonus", evalFocused.feedback.indexOf('Focused Tone') !== -1);
    assert("Focused tone consumed after turn", player.focusedToneActive === false);

    // TEST 6: Tactical Item 2 - Demo Flashbang (40 DMG, unlocks Demo, stuns boss)
    selectBoss(0);
    player.consumables.flashbang = 2;
    const initialBossHp = bossHp;
    useCombatItem('flashbang');
    assert("Flashbang consumed 1 charge (now 1)", player.consumables.flashbang === 1);
    assert("Flashbang dealt 40 DMG to boss", bossHp === initialBossHp - 40);
    assert("Flashbang unlocked Demo Proof stage", matchMemory.demoUnlocked === true);
    assert("Flashbang stunned boss for 1 turn", matchMemory.bossStunnedTurns === 1);

    // Turn evaluation while boss is stunned results in 0 counterattack damage
    inputEl.value = "Ava is 397 a month flat with zero contracts.";
    const evalStunned = evaluateTurn(inputEl.value);
    assert("Stunned boss counterattack deals 0 counterDmg", evalStunned.counterDmg === 0);
    assert("Feedback notes contractor stunned by demo", evalStunned.feedback.indexOf('Stunned') !== -1);

    // TEST 7: Tactical Item 3 - Zero-Downtime Shield (100% Counter DMG Deflection)
    player.consumables.shield = 2;
    useCombatItem('shield');
    assert("Shield consumed 1 charge (now 1)", player.consumables.shield === 1);
    assert("Shield activated shieldActive", player.shieldActive === true);

    inputEl.value = "Tell me about your roofing company.";
    const evalShielded = evaluateTurn(inputEl.value);
    assert("Shield deflects 100% of counter damage (0 counterDmg)", evalShielded.counterDmg === 0);
    assert("Feedback notes Zero-Downtime Shield deflected attack", evalShielded.feedback.indexOf('Zero-Downtime Shield') !== -1);

    // TEST 8: Consumables Shop Purchase in Armory
    player.gold = 300;
    player.consumables.espresso = 1;
    buyConsumable('espresso', 50, 2);
    assert("Purchasing espresso cost 50 GP (gold is now 250)", player.gold === 250);
    assert("Purchasing espresso increased count by +2 (now 3)", player.consumables.espresso === 3);

    // TEST 9: Closer Dossier Modal & Combat Telemetry
    const dossierModal = document.getElementById('dossierModal');
    assert("Dossier modal element exists in DOM", !!dossierModal);
    openDossierModal();
    assert("openDossierModal opens modal with 'open' class", dossierModal.classList.contains('open'));

    const winRateEl = document.getElementById('dossierWinRate');
    const clearedEl = document.getElementById('dossierBossesCleared');
    assert("Dossier displays win rate", winRateEl && winRateEl.textContent.indexOf('%') !== -1);
    assert("Dossier displays bosses cleared denominator", clearedEl && clearedEl.textContent.indexOf('/') !== -1);

    const ribbonsList = document.getElementById('dossierRibbonsList');
    assert("Dossier renders closer battlefield ribbons", ribbonsList && ribbonsList.children.length >= 5);

    closeDossierModal();
    assert("closeDossierModal closes modal", !dossierModal.classList.contains('open'));

  } catch(e) {
    assert("Quest Upgrades Test Exception: " + e.message, false);
  }

  const passed = tests.filter(t => t.pass).length;
  const total = tests.length;
  const out = document.getElementById('testOutput');
  out.innerHTML = `<h3>UPGRADES_TESTS_RESULT: ${passed}/${total} PASSED</h3>` +
    tests.map(t => `<div class="test-item" data-pass="${t.pass}">${t.pass ? 'PASS' : 'FAIL'}: ${t.name}</div>`).join('');
})();
</script>
'@

$harness = $content.Replace("</body>", "$testScript`n</body>")
$tempFile = Join-Path $PSScriptRoot "temp_test_quest_upgrades.html"
[System.IO.File]::WriteAllText($tempFile, $harness, [System.Text.Encoding]::UTF8)

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
  $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$dumpFile = Join-Path $PSScriptRoot "temp_dump_quest_upgrades.html"
$fileUri = (Resolve-Path $tempFile).Path

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
Remove-Item -Path $tempFile -Force -ErrorAction SilentlyContinue
Remove-Item -Path $dumpFile -Force -ErrorAction SilentlyContinue

$match = [regex]::Match($dump, '(?s)<div id="testOutput">(.*?)</div>\s*</div>')
if ($match.Success) {
  $inner = $match.Groups[1].Value
  Write-Host "==========================================================" -ForegroundColor Cyan
  Write-Host "AUTOMATED QUEST 5.0 UPGRADES TEST SUITE RESULTS" -ForegroundColor Yellow
  Write-Host "==========================================================" -ForegroundColor Cyan

  $itemMatches = [regex]::Matches($inner, '<div class="test-item" data-pass="(true|false)">(PASS|FAIL): (.*?)</div>')
  $passed = 0
  $failed = 0
  foreach ($im in $itemMatches) {
    $pass = $im.Groups[1].Value -eq 'true'
    $name = $im.Groups[3].Value
    if ($pass) {
      Write-Host "  [PASS] $name" -ForegroundColor Green
      $passed++
    } else {
      Write-Host "  [FAIL] $name" -ForegroundColor Red
      $failed++
    }
  }

  Write-Host "`nResult: $passed/$($passed + $failed) Tests Passed" -ForegroundColor Cyan
  if ($failed -gt 0) {
    Write-Error "$failed tests failed!"
    exit 1
  } else {
    Write-Host "ALL QUEST 5.0 UPGRADES TESTS PASSED SUCCESSFULLY!" -ForegroundColor Green
  }
} else {
  Write-Error "Could not find test output in dumped DOM!"
  exit 1
}
