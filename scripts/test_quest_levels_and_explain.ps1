# scripts/test_quest_levels_and_explain.ps1
$ErrorActionPreference = "Stop"

$htmlSource = Join-Path $PSScriptRoot "..\website\cold-call-quest\index.html"
$content = [System.IO.File]::ReadAllText((Resolve-Path $htmlSource).Path, [System.Text.Encoding]::UTF8)

# Test Runner Script to append right before </body>
$testScript = @'
<div id="testLevelsExplainResultsBox" style="padding:20px;background:#000;color:#fff;font-family:monospace">
  <h2>AUTOMATED 15-BOSS LEVELS, PRODUCT EXPLAIN & NO-SELECTION TEST RESULTS</h2>
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
    // ============================================================
    // TEST 1: 15-Boss Gauntlet Roster & Product Coverage
    // ============================================================
    assert("BOSSES array has exactly 15 bosses", Array.isArray(window.BOSSES) && window.BOSSES.length === 15);
    
    // Check Boss 10: Elena Cruz (Websites)
    const elena = window.BOSSES[10];
    assert("Boss 10 is Elena Cruz (Custom Pools, 360 HP)", elena.key === 'elena' && elena.hp === 360 && elena.badges.includes('Website Focus'));
    
    // Check Boss 11: Travis Vance (Websites - EXPLAIN)
    const travis = window.BOSSES[11];
    assert("Boss 11 is Travis Vance (Commercial Glass, 420 HP, EXPLAIN: Website)", travis.key === 'travis' && travis.hp === 420 && travis.badges.includes('EXPLAIN: Website'));

    // Check Boss 12: Mitch Callahan (LeadFlow CRM)
    const mitch = window.BOSSES[12];
    assert("Boss 12 is Mitch Callahan (Luxury Remodel, 480 HP, LeadFlow CRM)", mitch.key === 'mitch' && mitch.hp === 480 && mitch.badges.includes('LeadFlow CRM'));

    // Check Boss 13: Wayne Miller (LeadFlow CRM - EXPLAIN)
    const wayne = window.BOSSES[13];
    assert("Boss 13 is Wayne Miller (Industrial Metal, 520 HP, EXPLAIN: LeadFlow)", wayne.key === 'wayne' && wayne.hp === 520 && wayne.badges.includes('EXPLAIN: LeadFlow'));

    // Check Boss 14: Victor Vance (Ava AI - EXPLAIN)
    const victor = window.BOSSES[14];
    assert("Boss 14 is Victor Vance (Industrial Chiller, 600 HP, EXPLAIN: Ava AI)", victor.key === 'victor' && victor.hp === 600 && victor.badges.includes('EXPLAIN: Ava AI'));

    // ============================================================
    // TEST 2: Removal of Selected Responses (On-The-Spot Recall Directive)
    // ============================================================
    const tacticalDock = document.getElementById('tacticalDock');
    assert("Tactical Dock exists in DOM", !!tacticalDock);
    
    // Check that pre-written multiple choice response buttons do NOT exist
    const selectedResponses = Array.from(tacticalDock.querySelectorAll('.strike-card:not(.heal-action)'));
    assert("No pre-written selected response buttons rendered in tactical dock", selectedResponses.length === 0);
    
    // Check that script directive card is rendered
    const directiveCard = document.getElementById('scriptDirectiveCard');
    const directiveTag = document.getElementById('scriptDirectiveTag');
    const directiveText = document.getElementById('scriptDirectiveText');
    assert("Script directive card exists", !!directiveCard && !!directiveTag && !!directiveText);
    assert("Directive tag indicates on-the-spot sales", directiveTag.textContent.indexOf('ON-THE-SPOT SALES') !== -1);
    
    // Breather button still exists for stamina
    const breatherBtn = document.getElementById('breatherBtn');
    assert("Breather button preserved for tactical stamina", !!breatherBtn);

    // ============================================================
    // TEST 3: Product Explanation Showdown - Website (Travis Vance)
    // ============================================================
    selectBoss(11); // Travis
    assert("Current boss is Travis Vance", currentBoss.key === 'travis');
    
    // Turn 1: Permission opener
    const inputEl = document.getElementById('playerCustomInput');
    const evalTravisOpener = evaluateTurn("Hey Travis, I know you're hoisting 400-lb curtain wall glass — you got 20 seconds before you hang up?");
    assert("Travis grants 20 seconds", evalTravisOpener.contractorReply.indexOf('20 seconds') !== -1 || evalTravisOpener.contractorReply.indexOf('glass') !== -1);

    // Turn 2: Revenue leak hook on slow websites & lost commercial bids
    const evalTravisHook = evaluateTurn("Where do commercial storefront builders go when your website takes 8 seconds to load on their phone? Straight to your competitor, right?");
    assert("Travis demands explanation of why contractor website beats free Wix", evalTravisHook.contractorReply.indexOf('Wix') !== -1 || evalTravisHook.contractorReply.indexOf('Squarespace') !== -1 || evalTravisHook.contractorReply.indexOf('Explain') !== -1);
    assert("Stage transitions to explain", matchMemory.stage === 'explain');
    assert("Last boss question is explain_website", matchMemory.lastBossQuestion === 'explain_website');

    // Test Dodge: Rep dodges explanation
    const evalTravisDodge = evaluateTurn("Let's meet tomorrow at 4:30 PM.");
    assert("Dodging explanation flags isDodgingQuestion", evalTravisDodge.isDodging || evalTravisDodge.feedback.indexOf('DODGING') !== -1 || evalTravisDodge.grade === 'D');
    assert("Travis complains about dodging", evalTravisDodge.contractorReply.indexOf('Wix') !== -1 || evalTravisDodge.contractorReply.indexOf('Explain') !== -1);

    // Turn 3: Deliver full website explanation
    const evalTravisExplain = evaluateTurn("Free Wix sites take 8 seconds to load, which causes high-ticket commercial builders to bounce. Our custom contractor websites load in sub-second speeds, have an instant quote calculator, before and after portfolio proof, and local Google ranking architecture so you capture leads in 3 seconds.");
    assert("Website explanation earns Grade S", evalTravisExplain.grade === 'S');
    assert("Website explanation deals high damage (>=50 DMG)", evalTravisExplain.damage >= 50);
    assert("Feedback recognizes masterful website explanation", evalTravisExplain.feedback.indexOf('MASTERFUL WEBSITE EXPLANATION') !== -1);
    assert("Travis admits free Wix is losing him deals and asks for walkthrough", evalTravisExplain.contractorReply.indexOf('bounce rate') !== -1 || evalTravisExplain.contractorReply.indexOf('Wix') !== -1 || evalTravisExplain.contractorReply.indexOf('walkthrough') !== -1);

    // ============================================================
    // TEST 4: Product Explanation Showdown - LeadFlow CRM (Wayne Miller)
    // ============================================================
    selectBoss(13); // Wayne Miller
    assert("Current boss is Wayne Miller", currentBoss.key === 'wayne');

    // Turn 1: Permission opener
    const evalWayneOpener = evaluateTurn("Hey Wayne, I know you're running a CNC sheet metal folder — you got 20 seconds before you hang up?");
    assert("Wayne grants 20 seconds", evalWayneOpener.contractorReply.indexOf('20 seconds') !== -1 || evalWayneOpener.contractorReply.indexOf('folder') !== -1 || evalWayneOpener.contractorReply.indexOf('metal') !== -1);

    // Turn 2: Revenue leak hook on open bids
    const evalWayneHook = evaluateTurn("How much money is sitting on your whiteboard in unclosed commercial roofing bids right now that went cold?");
    assert("Wayne demands step-by-step breakdown of LeadFlow CRM", evalWayneHook.contractorReply.indexOf('CRM') !== -1 || evalWayneHook.contractorReply.indexOf('LeadFlow') !== -1 || evalWayneHook.contractorReply.indexOf('Explain') !== -1 || evalWayneHook.contractorReply.indexOf('machine') !== -1);
    assert("Wayne last boss question is explain_leadflow", matchMemory.lastBossQuestion === 'explain_leadflow');

    // Turn 3: Deliver full LeadFlow explanation
    const evalWayneExplain = evaluateTurn("LeadFlow triggers an automated SMS text-back in 90 seconds on any missed call, runs an automated 5-touch estimate follow-up sequence on every open bid, and runs database reactivation on your past customers so dead quotes convert into signed contracts for $197/mo.");
    assert("LeadFlow explanation earns Grade S", evalWayneExplain.grade === 'S');
    assert("LeadFlow explanation deals >=52 DMG", evalWayneExplain.damage >= 52);
    assert("Feedback recognizes masterful LeadFlow explanation", evalWayneExplain.feedback.indexOf('MASTERFUL LEADFLOW EXPLANATION') !== -1);
    assert("Wayne acknowledges 90s text-back and 5-touch follow-up", evalWayneExplain.contractorReply.indexOf('5-touch') !== -1 || evalWayneExplain.contractorReply.indexOf('90-second') !== -1 || evalWayneExplain.contractorReply.indexOf('walkthrough') !== -1);

    // ============================================================
    // TEST 5: Product Explanation Showdown - Ava AI (Victor Vance)
    // ============================================================
    selectBoss(14); // Victor Vance
    assert("Current boss is Victor Vance", currentBoss.key === 'victor');
    assert("Victor is 600 HP Apex Raid Boss", currentBoss.maxHp === 600);

    // Turn 1: Permission opener
    const evalVictorOpener = evaluateTurn("Hey Victor, I know you service 500-ton centrifugal hospital chillers — you got 20 seconds before you hang up?");
    assert("Victor grants 20 seconds", evalVictorOpener.contractorReply.indexOf('20 seconds') !== -1 || evalVictorOpener.contractorReply.indexOf('chiller') !== -1);

    // Turn 2: Revenue leak hook on after-hours answering service
    const evalVictorHook = evaluateTurn("Where do your emergency hospital chiller calls go after 5 PM? To an answering service that misspells compressor models and takes 20 minutes to relay?");
    assert("Victor demands technical breakdown of Ava call handling", evalVictorHook.contractorReply.indexOf('answering service') !== -1 || evalVictorHook.contractorReply.indexOf('workflow') !== -1 || evalVictorHook.contractorReply.indexOf('Explain') !== -1);
    assert("Victor last boss question is explain_ava", matchMemory.lastBossQuestion === 'explain_ava');

    // Turn 3: Deliver full Ava technical explanation
    const evalVictorExplain = evaluateTurn("Ava answers on ring 1 24/7, asks emergency qualification questions regarding compressor tonnage and error codes, immediately texts the on-call technician's cell phone with full audio and transcript, and connects via Carrier *71 conditional call forwarding so you never port your hospital lines.");
    assert("Ava explanation earns Grade S", evalVictorExplain.grade === 'S');
    assert("Ava explanation deals >=55 DMG", evalVictorExplain.damage >= 55);
    assert("Feedback recognizes masterful Ava architecture explanation", evalVictorExplain.feedback.indexOf('MASTERFUL AVA ARCHITECTURE EXPLANATION') !== -1);
    assert("Victor acknowledges 1-ring pickup and Carrier *71", evalVictorExplain.contractorReply.indexOf('1-ring') !== -1 || evalVictorExplain.contractorReply.indexOf('Carrier *71') !== -1 || evalVictorExplain.contractorReply.indexOf('walkthrough') !== -1);

    // ============================================================
    // TEST 6: New Armor, Weapons, and Progression (Levels 11-15)
    // ============================================================
    assert("WEAPONS array expanded to at least 9 weapons", window.WEAPONS.length >= 9);
    const warhammer = window.WEAPONS.find(w => w.id === 'warhammer');
    const claymore = window.WEAPONS.find(w => w.id === 'claymore');
    const scepter = window.WEAPONS.find(w => w.id === 'scepter');
    assert("Warhammer exists (Level 12, +130% DMG)", !!warhammer && warhammer.lvl === 12 && warhammer.dmgBonus === 130);
    assert("Claymore exists (Level 14, +155% DMG)", !!claymore && claymore.lvl === 14 && claymore.dmgBonus === 155);
    assert("Scepter exists (Level 15, +185% DMG)", !!scepter && scepter.lvl === 15 && scepter.dmgBonus === 185);

    assert("ARMORS array expanded to at least 9 armors", window.ARMORS.length >= 9);
    const exoskeleton = window.ARMORS.find(a => a.id === 'exoskeleton');
    const carapace = window.ARMORS.find(a => a.id === 'carapace');
    const sovereign = window.ARMORS.find(a => a.id === 'sovereign');
    assert("Exoskeleton exists (Level 12, 280 HP, 60% Absorb)", !!exoskeleton && exoskeleton.lvl === 12 && exoskeleton.maxHp === 280 && exoskeleton.dmgReduct === 60);
    assert("Carapace exists (Level 14, 320 HP, 65% Absorb)", !!carapace && carapace.lvl === 14 && carapace.maxHp === 320);
    assert("Sovereign Plate exists (Level 15, 380 HP, 70% Absorb)", !!sovereign && sovereign.lvl === 15 && sovereign.maxHp === 380 && sovereign.dmgReduct === 70);

    assert("RANKS array expanded to Level 15", window.RANKS.length === 15);
    assert("Rank 15 is Apex Sovereign Dealmaker", window.RANKS[14].title === 'Apex Sovereign Dealmaker' && window.RANKS[14].lvl === 15);

    // Level up simulation to Level 15
    player.lvl = 14;
    player.xp = 15000;
    player.nextLvlXp = 10000;
    checkLevelUp();
    assert("Player can level up to Level 15", player.lvl === 15);
    assert("Player unlocked Level 15 weapon scepter", player.unlockedWeapons.includes('scepter'));
    assert("Player unlocked Level 15 armor sovereign", player.unlockedArmors.includes('sovereign'));

    // Equip and test weapon perk
    equipWeapon('warhammer');
    assert("Equipped weapon is warhammer", player.equippedWeapon === 'warhammer');
    equipArmor('sovereign');
    assert("Equipped armor is sovereign", player.equippedArmor === 'sovereign');

    // Armory modal renders all 9 weapons and 9 armors
    renderArmory();
    const wGrid = document.getElementById('weaponsGrid');
    const aGrid = document.getElementById('armorGrid');
    assert("Armory renders 9 weapons", wGrid && wGrid.children.length === 9);
    assert("Armory renders 9 armors", aGrid && aGrid.children.length === 9);

    // Dossier shows 15-boss denominator
    renderDossier();
    const dossierCleared = document.getElementById('dossierBossesCleared');
    assert("Dossier shows 15-boss denominator", dossierCleared && dossierCleared.textContent.indexOf('/ 15') !== -1);

  } catch(e) {
    assert("Test Execution Exception: " + e.message, false);
  }

  const passed = tests.filter(t => t.pass).length;
  const total = tests.length;
  const out = document.getElementById('testOutput');
  out.innerHTML = `<h3>LEVELS_EXPLAIN_TESTS_RESULT: ${passed}/${total} PASSED</h3>` +
    tests.map(t => `<div class="test-item" data-pass="${t.pass}">${t.pass ? 'PASS' : 'FAIL'}: ${t.name}</div>`).join('');
})();
</script>
'@

$tempFile = Join-Path $PSScriptRoot "temp_harness_levels_explain.html"
$harness = $content.Replace("</body>", "$testScript`n</body>")
[System.IO.File]::WriteAllText($tempFile, $harness, [System.Text.Encoding]::UTF8)

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
  $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$dumpFile = Join-Path $PSScriptRoot "temp_dump_levels_explain.html"
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

$itemMatches = [regex]::Matches($dump, '<div class="test-item" data-pass="(true|false)">(PASS|FAIL): (.*?)</div>')
if ($itemMatches.Count -gt 0) {
  Write-Host "==========================================================" -ForegroundColor Cyan
  Write-Host "AUTOMATED 15-BOSS LEVELS, PRODUCT EXPLAIN & NO-SELECTION RESULTS" -ForegroundColor Yellow
  Write-Host "==========================================================" -ForegroundColor Cyan

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
    Write-Host "ALL 15-BOSS LEVELS, PRODUCT EXPLAIN & NO-SELECTION TESTS PASSED SUCCESSFULLY!" -ForegroundColor Green
  }
} else {
  Write-Error "Could not find test output in dumped DOM!"
  exit 1
}
