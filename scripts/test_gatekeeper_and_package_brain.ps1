# scripts/test_gatekeeper_and_package_brain.ps1
$ErrorActionPreference = "Stop"

$questHtml = Join-Path $PSScriptRoot "..\website\cold-call-quest\index.html"
$content = [System.IO.File]::ReadAllText((Resolve-Path $questHtml).Path, [System.Text.Encoding]::UTF8)

# Inject automated headless test runner
$testScript = @'
<div id="gkPackageTestBox" style="padding:20px;background:#000;color:#fff;font-family:monospace">
  <h2>AUTOMATED GATEKEEPER & MULTI-PRODUCT PACKAGE REALISM TEST RESULTS</h2>
  <pre id="gkTestOutput">RUNNING...</pre>
</div>
<script>
setTimeout(function() {
  const tests = [];
  function assert(name, condition) {
    tests.push({ name: name, pass: !!condition });
    console.log((condition ? '[PASS] ' : '[FAIL] ') + name);
  }

  try {
    const inputEl = document.getElementById('playerCustomInput');
    const logEl = document.getElementById('combatLog');

    // ============================================================
    // TEST SUITE: REALISTIC GATEKEEPER, PRICING & MULTI-PRODUCT FLOW
    // ============================================================
    selectBoss(1); // Karen "The Iron Gatekeeper"
    assert("Boss 1 is Karen", currentBoss.key === 'gatekeeper');
    assert("Karen starts with 220 HP", currentBoss.maxHp === 220 && bossHp === 220);

    // TURN 1: Gatekeeper Pivot regarding after-hours emergency dispatch
    inputEl.value = "Reason I called was regarding your emergency dispatch after 5 PM and on weekends when calls slip through.";
    const evalT1 = evaluateTurn(inputEl.value);
    assert("Turn 1 Gatekeeper bypass earns Grade S", evalT1.grade === 'S');
    assert("Turn 1 feedback targets gatekeeper bypass", evalT1.feedback.indexOf('GATEKEEPER BYPASS') !== -1);
    submitRebuttal();
    assert("Turn 1 moves Karen to pain stage", matchMemory.stage === 'pain');
    assert("Karen is not defeated on turn 1", bossHp > 100);
    assert("Input remains active on turn 1", inputEl.disabled === false);

    // TURN 2: Mechanism with $8,000 Leak Math (Luke's actual pitch)
    inputEl.value = "So basically what it is is it's called Ava, and it's a 24/7 AI receptionist. So when nobody's able to answer the phone, it's gonna save you guys over $8000 on emergency jobs late at night. Because typically what happens is they'll go to the next guy on Google and you'll end up losing out on that client.";
    const evalT2 = evaluateTurn(inputEl.value);
    assert("Turn 2 earns Grade S", evalT2.grade === 'S');
    assert("Turn 2 feedback is MECHANISM & LEAK MATH (not false pricing/demo quote)", evalT2.feedback.indexOf('MECHANISM & LEAK MATH') !== -1);
    assert("Turn 2 feedback does NOT falsely claim demo line was given", evalT2.feedback.indexOf('813-8602') === -1);
    submitRebuttal();
    assert("Turn 2 advances to price stage", matchMemory.stage === 'price');
    assert("Karen asks for monthly rate", evalT2.contractorReply.indexOf('monthly rate') !== -1 || evalT2.contractorReply.indexOf('charge') !== -1);
    assert("Karen is not defeated on turn 2", bossHp > 50);
    assert("Input remains active on turn 2", inputEl.disabled === false);

    // TURN 3: Pricing with "and we also have packages" (Luke's actual turn)
    inputEl.value = "the monthly rate is going to be 397 just for the ai responist and we also have packages";
    const evalT3 = evaluateTurn(inputEl.value);
    assert("Turn 3 recognizes pricing answer", evalT3.grade === 'S');
    assert("Turn 3 feedback recognizes PACKAGE expansion", evalT3.feedback.indexOf('PACKAGE & PROOF EXPANSION') !== -1);
    assert("Turn 3 feedback does NOT falsely claim demo line was given", evalT3.feedback.indexOf('813-8602') === -1);
    assert("Karen acknowledges $397 and asks about website/CRM packages", evalT3.contractorReply.indexOf('package') !== -1 || evalT3.contractorReply.indexOf('website') !== -1);
    assert("Karen asks for test line number to hear Ava", evalT3.contractorReply.indexOf('test') !== -1 || evalT3.contractorReply.indexOf('number') !== -1);
    submitRebuttal();
    assert("CRUCIAL: Karen does NOT prematurely trigger victory on turn 3 while asking a question!", matchMemory.stage !== 'victory');
    assert("Input is NOT disabled on turn 3", inputEl.disabled === false);

    // TURN 4: Explain website package & provide live demo line (561) 813-8602
    inputEl.value = "Our package bundle includes a high-converting website with LeadFlow CRM, and you can test Ava right now by dialing (561) 813-8602 from your phone.";
    const evalT4 = evaluateTurn(inputEl.value);
    assert("Turn 4 recognizes demo number and package", evalT4.grade === 'S');
    assert("Karen dials (561) 813-8602 and acknowledges live response", evalT4.contractorReply.indexOf('813-8602') !== -1 || evalT4.contractorReply.indexOf('dialing') !== -1 || evalT4.contractorReply.indexOf('answered') !== -1);
    assert("Karen proposes walkthrough with Gary tomorrow at 4:30 PM", evalT4.contractorReply.indexOf('4:30 PM') !== -1 || evalT4.contractorReply.indexOf('walkthrough') !== -1);
    submitRebuttal();
    assert("Call is now in close stage awaiting meeting confirmation", matchMemory.stage === 'close' && matchMemory.lastBossQuestion === 'meeting_time_close');
    assert("Input remains active to allow user to confirm walkthrough", inputEl.disabled === false);

    // TURN 5: Confirm Walkthrough tomorrow at 4:30 PM -> VICTORY!
    inputEl.value = "Tomorrow at 4:30 PM works perfect, let's do a 10-minute walkthrough.";
    const evalT5 = evaluateTurn(inputEl.value);
    assert("Turn 5 close proposal earns Grade S", evalT5.grade === 'S');
    submitRebuttal();
    assert("Victory is properly achieved upon walkthrough confirmation", matchMemory.stage === 'victory');
    assert("Karen confirms Gary on calendar for 4:30 PM tomorrow", logEl.innerHTML.indexOf('4:30 PM') !== -1 && logEl.innerHTML.indexOf('gary@orlandopremiac.com') !== -1);
    assert("Victory chat preservation banner is active", document.getElementById('victoryChatBanner') !== null);

    // TEST SUITE: Boss On The Ropes Guard (bossHp <= 0 clamped to 1 if stage !== 'victory')
    selectBoss(0); // Rick
    bossHp = 10;
    inputEl.value = "Where do your emergency calls go when you're up on a roof?";
    submitRebuttal(); // Deals ~36 DMG, which would reduce 10 HP to -26 HP
    assert("Rick HP clamped to 1 when stage is not victory", bossHp === 1);
    assert("Rick is not defeated before close", matchMemory.stage !== 'victory');
    assert("Input remains active when boss is on the ropes", inputEl.disabled === false);

    const passed = tests.filter(t => t.pass).length;
    const total = tests.length;
    let out = `<h3>GATEKEEPER_PACKAGE_TESTS_RESULT: ${passed}/${total} PASSED</h3>\n`;
    tests.forEach(t => {
      out += `<div class="test-item" data-pass="${t.pass}">${t.pass ? 'PASS' : 'FAIL'}: ${t.name}</div>\n`;
    });
    document.getElementById('gkTestOutput').innerHTML = out;
    window.__TESTS_DONE__ = true;
    window.__TESTS_PASSED__ = (passed === total);
  } catch(err) {
    console.error('Test runner exception:', err);
    document.getElementById('gkTestOutput').innerHTML = `<h3>ERROR: ${err.message} | STACK: ${err.stack}</h3>`;
    window.__TESTS_DONE__ = true;
    window.__TESTS_PASSED__ = false;
  }
}, 500);
</script>
'@

$injected = $content -replace '</body>', "$testScript`n</body>"
$tmpHarness = Join-Path $PSScriptRoot "..\website\cold-call-quest\test_runner_gk_package.html"
[System.IO.File]::WriteAllText($tmpHarness, $injected, [System.Text.Encoding]::UTF8)

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
  $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$dumpFile = Join-Path $PSScriptRoot "..\website\cold-call-quest\test_runner_gk_dump.html"
if (Test-Path $dumpFile) { Remove-Item $dumpFile -Force }

$fileUri = (Resolve-Path $tmpHarness).Path

try {
  $p = Start-Process -FilePath $edgePath -ArgumentList @(
    "--headless",
    "--disable-gpu",
    "--dump-dom",
    "--virtual-time-budget=8000",
    $fileUri
  ) -NoNewWindow -PassThru -RedirectStandardOutput $dumpFile

  $p.WaitForExit(10000)
  Start-Sleep -Milliseconds 300

  if (Test-Path $dumpFile) {
    $dom = [System.IO.File]::ReadAllText($dumpFile, [System.Text.Encoding]::UTF8)
    if ($dom -match '(?s)<pre id="gkTestOutput">(.*?)</pre>') {
      $rawResults = $matches[1]
      Write-Host "=========================================================="
      Write-Host "AUTOMATED GATEKEEPER & MULTI-PRODUCT PACKAGE REALISM TEST"
      Write-Host "=========================================================="
      if ($rawResults -match '<h3>(.*?)</h3>') {
        Write-Host "  $($matches[0])"
      }
      $testItems = [regex]::Matches($rawResults, '(?s)<div class="test-item" data-pass="([^"]+)">([^<]+)</div>')
      $failCount = 0
      foreach ($item in $testItems) {
        $pVal = $item.Groups[1].Value
        $txt = $item.Groups[2].Value.Trim()
        if ($pVal -eq 'true') {
          Write-Host "    [PASS] $txt" -ForegroundColor Green
        } else {
          Write-Host "    [FAIL] $txt" -ForegroundColor Red
          $failCount++
        }
      }

      if ($failCount -gt 0) {
        throw "$failCount test(s) failed in Gatekeeper & Package Realism Suite."
      } else {
        Write-Host "`n100% OF GATEKEEPER & MULTI-PRODUCT PACKAGE TESTS PASSED!`n" -ForegroundColor Cyan
      }
    } else {
      throw "Test output pre element not found in DOM dump."
    }
  } else {
    throw "Dump file not generated."
  }
} finally {
  if (Test-Path $tmpHarness) { Remove-Item $tmpHarness -Force }
  if (Test-Path $dumpFile) { Remove-Item $dumpFile -Force }
}
