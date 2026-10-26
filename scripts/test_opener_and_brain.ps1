# scripts/test_opener_and_brain.ps1
$ErrorActionPreference = "Stop"

$htmlSource = Join-Path $PSScriptRoot "..\website\cold-call-quest\index.html"
$content = [System.IO.File]::ReadAllText((Resolve-Path $htmlSource).Path, [System.Text.Encoding]::UTF8)

# Headless Chrome script injection
$testScript = @'
<div id="openerTestResultsBox" style="padding:20px;background:#000;color:#fff;font-family:monospace">
  <h2>AUTOMATED OPENER & BRAIN 6.0 TEST RESULTS</h2>
  <div id="openerTestOutput">RUNNING...</div>
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
    const logEl = document.getElementById('combatLog');

    // TEST 1: Boss 0 (Rick) initialization starts with Luke delivering opener
    selectBoss(0);
    const logEntries = logEl.querySelectorAll('.log-entry');
    assert("Chat starts with at least 3 initial log entries", logEntries.length >= 3);
    assert("First speaker is Luke", logEntries[1].textContent.indexOf('Luke:') !== -1);
    assert("Luke opener contains 'is this the owner?'", logEntries[1].textContent.indexOf('is this the owner?') !== -1);
    assert("Rick responds to opener", logEntries[2].textContent.indexOf('Rick') !== -1 && logEntries[2].textContent.indexOf('own the outfit') !== -1);

    // TEST 2: Karen (Gatekeeper Boss 1) starts with Luke opener and Karen gatekeeper status
    selectBoss(1);
    const logEntriesK = logEl.querySelectorAll('.log-entry');
    assert("Gatekeeper chat has Luke opener", logEntriesK[1].textContent.indexOf('is this the owner?') !== -1);
    assert("Karen affirms dispatch role", logEntriesK[2].textContent.indexOf('Karen at dispatch') !== -1);

    // TEST 3: Gatekeeper clever pivot moves Karen to pain
    inputEl.value = "Hey Karen, is Gary around or is he out on a job site right now?";
    submitRebuttal();
    assert("Gatekeeper site check advances to pain", matchMemory.stage === 'pain');

    // TEST 4: Email objection pivot handled with intelligence
    selectBoss(2); // Mike
    inputEl.value = "Happy to shoot an email, but so I don't send 10 pages of garbage, do you lose more calls during the day or after hours?";
    submitRebuttal();
    assert("Email pivot advances to pain", matchMemory.stage === 'pain');

    // TEST 5: Answering service comparison directly anchors price stage
    selectBoss(3); // Dave
    inputEl.value = "Answering services usually charge 1400 a month and take 15 minutes to relay a scribbled note, whereas Ava answers in one ring.";
    submitRebuttal();
    assert("Answering service compare advances to price stage", matchMemory.stage === 'price');

    // TEST 6: Bilingual Spanish feature recognized for Miami/Commercial titans
    selectBoss(7); // Vito
    inputEl.value = "Ava detects Spanish or English instantly and handles bilingual Spanish intake seamlessly.";
    submitRebuttal();
    assert("Bilingual feature recognized with price stage", matchMemory.stage === 'price');

    // TEST 7: Asking 'Is this the owner?' directly in chat is recognized
    selectBoss(0);
    inputEl.value = "Hey, is this the owner?";
    submitRebuttal();
    assert("Owner verification prompt handled without hangup", inputEl.disabled === false);

    const passed = tests.filter(t => t.pass).length;
    const total = tests.length;
    document.getElementById('openerTestOutput').innerHTML = `<h3>OPENER_TESTS_RESULT: ${passed}/${total} PASSED</h3>` +
      tests.map(t => `<div>[${t.pass ? 'PASS' : 'FAIL'}] ${t.name}</div>`).join('');
    window.__OPENER_TESTS_DONE__ = true;
    window.__OPENER_TESTS_PASSED__ = (passed === total);
  } catch(err) {
    console.error('Test runner exception:', err);
    document.getElementById('openerTestOutput').innerHTML = `<h3>ERROR: ${err.message}</h3>`;
    window.__OPENER_TESTS_DONE__ = true;
    window.__OPENER_TESTS_PASSED__ = false;
  }
})();
</script>
'@

$injected = $content.Replace("</body>", "$testScript`n</body>")
$tmpFile = Join-Path $PSScriptRoot "..\website\cold-call-quest\test_runner_opener.html"
$utf8Bom = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllText($tmpFile, $injected, $utf8Bom)

$edgeExe = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgeExe)) {
    $edgeExe = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$fileUri = "file:///" + $tmpFile.Replace('\', '/')
$domOutput = & $edgeExe --headless=new --disable-gpu --dump-dom $fileUri | Out-String

# Clean temp files
Remove-Item $tmpFile -ErrorAction SilentlyContinue

Write-Host "=========================================================="
Write-Host "AUTOMATED HEADLESS BROWSER OPENER & BRAIN RESULTS"
Write-Host "=========================================================="
if ($domOutput -match '<h3>OPENER_TESTS_RESULT: (\d+)/(\d+) PASSED</h3>') {
    $passed = $matches[1]
    $total = $matches[2]
    Write-Host "  $($matches[0])"
    
    $domOutput | Select-String -Pattern '\[(PASS|FAIL)\] [^<]+' -AllMatches | ForEach-Object {
        $_.Matches | ForEach-Object { Write-Host "    $($_.Value)" }
    }
    
    if ($passed -eq $total) {
        Write-Host "`n100% OF OPENER & BRAIN 6.0 SIMULATION TESTS PASSED!`n" -ForegroundColor Green
        exit 0
    } else {
        Write-Host "`nSOME OPENER TESTS FAILED!`n" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Could not retrieve test results from headless DOM."
    Write-Host ($domOutput.Substring(0, [Math]::Min(500, $domOutput.Length)))
    exit 1
}
