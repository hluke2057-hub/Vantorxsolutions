# scripts/test_crm_victory_voice.ps1
$ErrorActionPreference = "Stop"

$questHtml = Join-Path $PSScriptRoot "..\website\cold-call-quest\index.html"
$content = [System.IO.File]::ReadAllText((Resolve-Path $questHtml).Path, [System.Text.Encoding]::UTF8)

# Inject automated headless test runner
$testScript = @'
<div id="questCrmVoiceTestBox" style="padding:20px;background:#000;color:#fff;font-family:monospace">
  <h2>AUTOMATED CRM, VICTORY 2-MIN CHAT, & CONTINUOUS VOICE TEST RESULTS</h2>
  <pre id="questTestOutput">RUNNING...</pre>
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
    const micBtn = document.getElementById('micBtn');
    const micLabel = document.getElementById('micLabel');

    // ============================================================
    // TEST SUITE 1: CRM & LEADFLOW SCRIPT INTEGRATION
    // ============================================================
    selectBoss(0); // Rick
    const crmRebuttal = "LeadFlow is our contractor CRM. It plugs into Jobber or ServiceTitan, auto-texts missed calls in 90 seconds, and tracks your pipeline for $197/mo.";
    const evalCrm = evaluateTurn(crmRebuttal);
    assert("CRM & LeadFlow rebuttal earns Grade S", evalCrm.grade === 'S');
    assert("CRM rebuttal deals high damage (>=40 DMG)", evalCrm.damage >= 40);
    assert("Feedback recognizes CRM synergy and dispatch integration", evalCrm.feedback.indexOf('CRM SYNERGY') !== -1);
    assert("Contractor response acknowledges CRM / dispatch pipeline", evalCrm.contractorReply.indexOf('dispatch') !== -1 || evalCrm.contractorReply.indexOf('LeadFlow') !== -1 || evalCrm.contractorReply.indexOf('CRM') !== -1 || evalCrm.contractorReply.indexOf('bids') !== -1);

    // Test quick strike 'crm'
    inputEl.value = '';
    executeQuickStrike('crm');
    assert("Quick strike 'crm' populates LeadFlow contractor CRM script", inputEl.value === '' && logEl.textContent.indexOf('LeadFlow is our contractor CRM') !== -1);

    // ============================================================
    // TEST SUITE 2: BOSS DEFEAT & 2-MINUTE CHAT PRESERVATION
    // ============================================================
    selectBoss(0);
    // Simulate boss defeat
    handleBossDefeat({ contractorReply: "Alright Luke, you got me. Send the calendar link to my office email." });
    
    // 1. Contractor final reply is visible in the log
    const lastLogBoss = logEl.querySelector('.log-boss:last-of-type');
    assert("Contractor concession reply is appended to chat log", logEl.innerHTML.indexOf('Alright Luke, you got me. Send the calendar link') !== -1);
    
    // 2. Victory chat banner is rendered
    const victoryBanner = document.getElementById('victoryChatBanner');
    assert("Victory chat preservation banner is rendered", !!victoryBanner);
    assert("Banner shows 2:00 auto-clear indicator", victoryBanner && victoryBanner.innerHTML.indexOf('2:00') !== -1);
    assert("Banner contains 'Start Next Boss Now' button", victoryBanner && victoryBanner.querySelector('.btn-advance-now') !== null);

    // 3. Victory timer is initialized to 120 seconds (2 minutes)
    assert("Victory timer initialized to 120 seconds", typeof getVictoryTimerSeconds === 'function' && getVictoryTimerSeconds() === 120);

    // 4. Attack input is disabled during review
    assert("Input dock is disabled to prevent typing during chat review", inputEl.disabled === true);

    // 5. Claiming loot does NOT wipe the chat
    const lootModal = document.getElementById('lootModal');
    assert("Loot modal opened on defeat", lootModal && lootModal.classList.contains('open'));
    claimLootAndAdvance();
    assert("Claiming loot closes loot modal", lootModal && !lootModal.classList.contains('open'));
    assert("Claiming loot PRESERVES the chat log (not cleared)", logEl.innerHTML.indexOf('Alright Luke, you got me') !== -1);
    assert("Victory countdown banner remains active after claiming loot", document.getElementById('victoryChatBanner') !== null);

    // 6. Manual advance button starts next boss and clears banner
    advanceToNextBossNow();
    assert("advanceToNextBossNow clears victory banner", document.getElementById('victoryChatBanner') === null);
    assert("advanceToNextBossNow advances to next boss (Karen/Boss 1)", currentBoss.key === 'gatekeeper');
    assert("Input re-enabled for next boss", inputEl.disabled === false);

    // ============================================================
    // TEST SUITE 3: CONTINUOUS VOICE / MIC BUTTON
    // ============================================================
    // Mock SpeechRecognition for headless environment
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      window.SpeechRecognition = function() {
        this.continuous = false;
        this.interimResults = false;
        this.lang = 'en-US';
        this.start = function() { if (this.onstart) this.onstart(); };
        this.stop = function() { if (this.onend) this.onend(); };
        this.abort = function() { if (this.onend) this.onend(); };
      };
    }

    // 1. Initial State: Voice OFF
    assert("Initial voice state isListening is false", getIsListening() === false);
    assert("Mic button initially does not have listening class", !micBtn.classList.contains('listening'));

    // 2. Click Voice Button ON -> Stays ON
    toggleSpeechRecognition();
    assert("Clicking mic button turns voice ON (isListening is true)", getIsListening() === true);
    assert("Mic button has listening class", micBtn.classList.contains('listening'));
    assert("Mic button label shows 'Listening (Click to Stop)'", micLabel.textContent.indexOf('Listening') !== -1);

    // 3. Submitting a rebuttal while mic is active does NOT turn it off
    inputEl.value = "Hey Karen, is Gary around or is he out on a job site right now?";
    submitRebuttal();
    assert("Submitting rebuttal keeps mic voice ON (continuous mode)", getIsListening() === true);
    assert("Mic button retains listening class across turns", micBtn.classList.contains('listening'));

    // 4. Clicking Voice Button OFF explicitly turns it off
    toggleSpeechRecognition();
    assert("Clicking mic button a second time turns voice OFF", getIsListening() === false);
    assert("Mic button listening class removed", !micBtn.classList.contains('listening'));
    assert("Mic button label restored to 'Speak'", micLabel.textContent === 'Speak');

  } catch(err) {
    assert("Execution Error: " + err.message, false);
  }

  const passed = tests.filter(t => t.pass).length;
  const total = tests.length;
  const out = document.getElementById('questTestOutput');
  out.innerHTML = `<h3>CRM_VOICE_VICTORY_TESTS_RESULT: ${passed}/${total} PASSED</h3>` +
    tests.map(t => `<div class="test-item" data-pass="${t.pass}">${t.pass ? 'PASS' : 'FAIL'}: ${t.name}</div>`).join('');
}, 250);
</script>
'@

$harness = $content.Replace("</body>", "$testScript`n</body>")
$tmpHarness = Join-Path $PSScriptRoot "..\website\cold-call-quest\test_runner_crm_voice.html"
[System.IO.File]::WriteAllText($tmpHarness, $harness, [System.Text.Encoding]::UTF8)

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
  $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$dumpFile = Join-Path $PSScriptRoot "..\website\cold-call-quest\test_runner_dump.html"
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
    if ($dom -match '(?s)<pre id="questTestOutput">(.*?)</pre>') {
      $rawResults = $matches[1]
      Write-Host "=========================================================="
      Write-Host "AUTOMATED CRM, VICTORY 2-MIN CHAT, & CONTINUOUS VOICE TEST"
      Write-Host "=========================================================="
      if ($rawResults -match '<h3>(.*?)</h3>') {
        Write-Host "  $($matches[0])"
      }
      $testItems = [regex]::Matches($rawResults, '(?s)<div class="test-item" data-pass="([^"]+)">([^<]+)</div>')
      $failCount = 0
      foreach ($item in $testItems) {
        $status = $item.Groups[1].Value
        $name = $item.Groups[2].Value
        if ($status -eq 'true') {
          Write-Host "    [PASS] $name" -ForegroundColor Green
        } else {
          Write-Host "    [FAIL] $name" -ForegroundColor Red
          $failCount++
        }
      }
      if ($failCount -gt 0) {
        Write-Error "SOME TESTS FAILED!"
        exit 1
      } else {
        Write-Host "`n100% OF CRM, VICTORY 2-MIN CHAT, & CONTINUOUS VOICE TESTS PASSED!" -ForegroundColor Green
        exit 0
      }
    } else {
      Write-Error "Test output div not found in Edge DOM dump."
      exit 1
    }
  } else {
    Write-Error "Dump file not generated."
    exit 1
  }
} finally {
  if (Test-Path $tmpHarness) { Remove-Item -Force $tmpHarness }
  if (Test-Path $dumpFile) { Remove-Item -Force $dumpFile }
}
