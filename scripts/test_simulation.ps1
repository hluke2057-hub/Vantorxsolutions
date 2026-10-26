# scripts/test_simulation.ps1
$ErrorActionPreference = "Stop"

$htmlSource = Join-Path $PSScriptRoot "..\website\cold-call-quest\index.html"
$content = [System.IO.File]::ReadAllText((Resolve-Path $htmlSource).Path, [System.Text.Encoding]::UTF8)

# Test Runner Script to append right before </body>
$testScript = @'
<div id="testResultsBox" style="padding:20px;background:#000;color:#fff;font-family:monospace">
  <h2>AUTOMATED TEST RESULTS</h2>
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
    const inputEl = document.getElementById('playerCustomInput');
    const defeatModal = document.getElementById('defeatModal');
    const defeatTitle = document.getElementById('defeatTitle');

    // TEST 1: Fatal Rude Insult -> Instant Hangup
    inputEl.value = "Shut up you fucking idiot, buy my product";
    submitRebuttal();
    assert("Fatal Rude causes input disabled", inputEl.disabled === true);
    assert("Fatal Rude opens defeatModal", defeatModal.classList.contains('open'));
    assert("Defeat Title shows hostility reason", defeatTitle.textContent.indexOf('DISRESPECT') !== -1);

    // TEST 2: Redial -> Restores HP, closes modal, re-enables input
    redialAfterDefeat();
    assert("Redial restores player HP", player.hp === player.maxHp);
    assert("Redial re-enables input", inputEl.disabled === false);
    assert("Redial closes defeatModal", !defeatModal.classList.contains('open'));

    // TEST 3: Fatal Corporate Spam -> Instant Hangup
    inputEl.value = "We provide cutting edge digital synergies and an omnichannel marketing funnel deck";
    submitRebuttal();
    assert("Corporate Spam causes input disabled", inputEl.disabled === true);
    assert("Corporate Spam opens defeatModal", defeatModal.classList.contains('open'));
    assert("Defeat Title shows telemarketer spam", defeatTitle.textContent.indexOf('SPAM') !== -1);

    // TEST 4: Fatal Absurd Price -> Instant Hangup
    redialAfterDefeat();
    inputEl.value = "Ava costs 10,000 a month for commercial contractors";
    submitRebuttal();
    assert("Absurd Pricing causes input disabled", inputEl.disabled === true);
    assert("Defeat Title shows pricing trap", defeatTitle.textContent.indexOf('PRICING') !== -1);

    // TEST 5: Dodging Direct Question (Dodge twice causes hangup)
    redialAfterDefeat();
    inputEl.value = "Hey Rick, I know you're busy in Tampa -- you got 30 seconds before you hang up?";
    submitRebuttal();
    assert("Turn 1 Opener advances to permission_granted", matchMemory.stage === 'permission_granted');

    inputEl.value = "Ava answers in one ring, books directly into your calendar, and texts your cell phone immediately.";
    submitRebuttal();
    assert("Turn 2 Mechanism advances to price", matchMemory.stage === 'price' && matchMemory.lastBossQuestion === 'how_much_does_it_cost');

    // Dodge 1: Boss warns, input still active
    inputEl.value = "Well Rick, let me ask you what you think about AI technology?";
    submitRebuttal();
    assert("Dodge 1 keeps call active", inputEl.disabled === false);
    assert("Dodge count is 1", matchMemory.dodgedCount === 1);

    // Dodge 2: Boss hangs up!
    inputEl.value = "I just think technology is very fascinating for roofers.";
    submitRebuttal();
    assert("Dodge 2 terminates call", inputEl.disabled === true);
    assert("Defeat Title shows evasive/dodged", defeatTitle.textContent.indexOf('EVASIVE') !== -1 || defeatTitle.textContent.indexOf('DODGED') !== -1);

    // TEST 6: Dead Air / Hesitation twice in a row
    redialAfterDefeat();
    inputEl.value = "uh";
    submitRebuttal();
    assert("Hesitation 1 keeps call active", inputEl.disabled === false);
    inputEl.value = "um";
    submitRebuttal();
    assert("Hesitation 2 terminates call", inputEl.disabled === true);
    assert("Defeat Title shows dead air", defeatTitle.textContent.indexOf('DEAD AIR') !== -1);

    // TEST 7: 7-Stage Perfect Pitch Sequence advances to Victory
    redialAfterDefeat();
    inputEl.value = "Hey Rick, you got 20 seconds before you hang up on me?";
    submitRebuttal();
    assert("Turn 1 Opener grants permission", matchMemory.stage === 'permission_granted');
    inputEl.value = "Where do your emergency calls go when you are on a roof? Straight to voicemail, right?";
    submitRebuttal();
    assert("Turn 2 Leak Hook advances to pain", matchMemory.stage === 'pain');
    inputEl.value = "Ava answers inbound calls on the first ring, qualifies the shingle job, and texts your phone.";
    submitRebuttal();
    inputEl.value = "It is a flat 300 a month with zero setup fee and zero contract. One shingle repair pays for the entire year.";
    submitRebuttal();
    inputEl.value = "Dial our live Florida demo line right now on (561) 813-8602 from your truck and hear how natural Ava sounds.";
    submitRebuttal();
    inputEl.value = "We hook it up via Carrier *71 conditional call forwarding so your company number stays with your provider.";
    submitRebuttal();
    inputEl.value = "Let's do a quick 10-minute walkthrough tomorrow afternoon at 4:30 PM.";
    submitRebuttal();
    assert("Full pitch reaches Victory stage", matchMemory.stage === 'victory');

    // TEST 8: Health Regain (Tactical Breather)
    player.hp = 50;
    player.breatherCooldown = 0;
    executeTakeABreather();
    assert("Take A Breather recovers HP (+30 standard, +45 on Sun/Wed mutator)", player.hp === 80 || player.hp === 95);
    assert("Take A Breather sets 2-turn cooldown", player.breatherCooldown === 2);

    // TEST 9: Boss Execute Threshold & Finisher Overkill
    selectBoss(0);
    bossHp = 30; // 30% HP <= 35% threshold
    updateHUD();
    const bossCardEl = document.querySelector('.active-boss-hud');
    assert("Execute threshold class applied to boss card", bossCardEl && bossCardEl.classList.contains('execute-threshold'));

    inputEl.value = "Let's do a 10-minute walkthrough tomorrow at 4:30 PM.";
    const evalResFinisher = evaluateTurn(inputEl.value);
    assert("Finisher triggers overkill bonus (+50 DMG)", evalResFinisher.damage >= 50 && evalResFinisher.feedback.indexOf('EXECUTE') !== -1);

    // TEST 10: Mystery Loot Chest Modal & Relic Rewards
    handleBossDefeat();
    const lootModal = document.getElementById('lootModal');
    assert("Boss defeat opens mystery loot modal", lootModal && lootModal.classList.contains('open'));

    crackLootChest(true);
    // After cracking, pending rewards apply
    assert("Player has earned gold from loot", player.gold > 0);
    assert("Player has unlocked at least 1 contractor relic", player.unlockedRelics && player.unlockedRelics.length > 0);

    // TEST 11: Armory Relics Grid Rendering
    renderArmory();
    const relicsGrid = document.getElementById('relicsGrid');
    assert("Armory relics grid rendered 6 trade relics", relicsGrid && relicsGrid.children.length === 6);
    assert("Unlocked relic shows active status", relicsGrid.innerHTML.indexOf('Permanent Passive Active') !== -1);

    // TEST 12: Fire Streak & Multiplier in Top HUD
    player.streak = 4;
    updateHUD();
    const streakHeaderEl = document.getElementById('streakHeader');
    assert("Streak header has streak-on-fire class", streakHeaderEl && streakHeaderEl.classList.contains('streak-on-fire'));
    assert("Streak header displays loot multiplier", streakHeaderEl && streakHeaderEl.textContent.indexOf('Loot') !== -1);

  } catch(e) {
    assert("Execution Error: " + e.message, false);
  }

  const passed = tests.filter(t => t.pass).length;
  const total = tests.length;
  const out = document.getElementById('testOutput');
  out.innerHTML = `<h3>TESTS_RESULT: ${passed}/${total} PASSED</h3>` +
    tests.map(t => `<div class="test-item" data-pass="${t.pass}">${t.pass ? 'PASS' : 'FAIL'}: ${t.name}</div>`).join('');
})();
</script>
</body>
'@

$harnessContent = $content.Replace("</body>", $testScript)
$harnessPath = Join-Path $PSScriptRoot "test_sim_harness.html"
[System.IO.File]::WriteAllText($harnessPath, $harnessContent, (New-Object System.Text.UTF8Encoding($true)))

$edgeExe = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgeExe)) {
    $edgeExe = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$harnessUri = "file:///" + $harnessPath.Replace("\", "/")
$domOutput = & $edgeExe --headless=new --disable-gpu --dump-dom $harnessUri | Out-String

Remove-Item $harnessPath -Force -ErrorAction SilentlyContinue

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "AUTOMATED HEADLESS BROWSER SIMULATION RESULTS" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if ($domOutput -match '<h3>TESTS_RESULT: (\d+)/(\d+) PASSED</h3>') {
    $summary = $matches[0]
    $passedCount = [int]$matches[1]
    $totalCount = [int]$matches[2]
    Write-Host "  $summary" -ForegroundColor $(if ($passedCount -eq $totalCount) { "Green" } else { "Red" })
    
    # Print details
    $regex = [regex]'<div class="test-item" data-pass="(true|false)">(PASS|FAIL): ([^<]+)</div>'
    $allMatches = $regex.Matches($domOutput)
    foreach ($m in $allMatches) {
        $status = $m.Groups[2].Value
        $name = $m.Groups[3].Value
        if ($status -eq "PASS") {
            Write-Host "    [PASS] $name" -ForegroundColor Green
        } else {
            Write-Host "    [FAIL] $name" -ForegroundColor Red
        }
    }
    
    if ($passedCount -eq $totalCount -and $totalCount -gt 0) {
        Write-Host ""
        Write-Host "100% OF HEADLESS BROWSER SIMULATION TESTS PASSED!" -ForegroundColor Green
        exit 0
    } else {
        exit 1
    }
} else {
    Write-Host "Failed to parse test results from DOM output:" -ForegroundColor Red
    Write-Host $domOutput
    exit 1
}
