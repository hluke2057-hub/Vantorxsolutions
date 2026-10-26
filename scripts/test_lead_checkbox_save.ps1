# scripts/test_lead_checkbox_save.ps1
$ErrorActionPreference = "Stop"

$arenaHtml = Join-Path $PSScriptRoot "..\website\cold-call-arena\index.html"
$content = [System.IO.File]::ReadAllText((Resolve-Path $arenaHtml).Path, [System.Text.Encoding]::UTF8)
$content = $content.Replace("<head>", "<head><script>try{localStorage.setItem('vantorx_active_user_id_v2', 'luke');}catch(e){}</script>")

# Inject automated headless test runner
$testScript = @'
<div id="leadTestResultsBox" style="padding:20px;background:#000;color:#fff;font-family:monospace">
  <h2>AUTOMATED LEAD CHECKBOX & PERSISTENCE TEST RESULTS</h2>
  <div id="leadTestOutput">RUNNING...</div>
</div>
<script>
setTimeout(function() {
  const tests = [];
  function assert(name, condition) {
    tests.push({ name: name, pass: !!condition });
    console.log((condition ? '[PASS] ' : '[FAIL] ') + name);
  }

  try {
    // Ensure logged in as Luke to bypass gate and have valid profile
    if (window.bypassToFounder) window.bypassToFounder();
    else if (window.quickSwitchCaller) window.quickSwitchCaller('luke');

    // Dynamically identify the first rendered lead
    const firstCb = document.querySelector('.call-checkbox');
    const testLeadId = firstCb ? firstCb.dataset.id : 'pb_001';

    // Ensure clean state for test lead
    let saved = JSON.parse(localStorage.getItem('vantorx_lead_calls_v1') || '{}');
    delete saved[testLeadId];
    localStorage.setItem('vantorx_lead_calls_v1', JSON.stringify(saved));
    CALL_RECORDS[testLeadId] = { called: false };
    renderLeadsTable();

    // 1. Initial State
    const rowBefore = document.getElementById('leadRow_' + testLeadId);
    const cbBefore = document.querySelector(`.call-checkbox[data-id="${testLeadId}"]`);
    assert("Test lead row rendered", !!rowBefore);
    assert("Test lead checkbox initially unchecked", cbBefore && !cbBefore.checked);
    assert("Row does NOT have lead-row-called class initially", !rowBefore.classList.contains('lead-row-called'));

    // 2. Click / Change checkbox to TRUE (Checking off lead)
    cbBefore.checked = true;
    cbBefore.dispatchEvent(new Event('change', { bubbles: true }));

    // 3. Verify Memory & State
    assert("CALL_RECORDS updated to called:true", CALL_RECORDS[testLeadId] && CALL_RECORDS[testLeadId].called === true);
    assert("CALL_RECORDS has active caller name", !!CALL_RECORDS[testLeadId].caller);
    assert("CALL_RECORDS has timestamp", !!CALL_RECORDS[testLeadId].timestamp);

    // 4. Verify localStorage Persistence immediately
    const storageRaw = localStorage.getItem('vantorx_lead_calls_v1');
    assert("localStorage vantorx_lead_calls_v1 exists", !!storageRaw);
    const parsedStorage = JSON.parse(storageRaw);
    assert("localStorage has testLeadId called:true", parsedStorage[testLeadId] && parsedStorage[testLeadId].called === true);

    // 5. Verify Table Re-render
    const rowAfter = document.getElementById('leadRow_' + testLeadId);
    const cbAfter = document.querySelector(`.call-checkbox[data-id="${testLeadId}"]`);
    assert("Re-rendered checkbox is checked", cbAfter && cbAfter.checked);
    assert("Re-rendered row has lead-row-called class", rowAfter && rowAfter.classList.contains('lead-row-called'));

    // 6. Verify User Daily Dials incremented
    const activeU = getActiveUser();
    assert("Active user daily dials incremented", (activeU.dailyDials || 0) >= 1);
    const userProfilesStorage = JSON.parse(localStorage.getItem('vantorx_user_profiles_v2') || '{}');
    const uInStorage = userProfilesStorage[activeU.id] || userProfilesStorage['luke'];
    assert("localStorage user profile daily dials saved", uInStorage && uInStorage.dailyDials >= 1);

    // 7. Verify Unchecking lead restores uncalled state and saves
    cbAfter.checked = false;
    cbAfter.dispatchEvent(new Event('change', { bubbles: true }));
    assert("CALL_RECORDS updated to called:false", CALL_RECORDS[testLeadId] && CALL_RECORDS[testLeadId].called === false);
    const parsedStorage2 = JSON.parse(localStorage.getItem('vantorx_lead_calls_v1'));
    assert("localStorage saved uncheck state (called:false)", parsedStorage2[testLeadId] && parsedStorage2[testLeadId].called === false);

    // 8. Verify Modal Save (Outcome + Notes) Persists
    openCallLogModal(testLeadId);
    selectCallLogOutcome('Success');
    const notesEl = document.getElementById('callLogModalNotes');
    if (notesEl) notesEl.value = 'Booked 4:30 PM walkthrough with owner';
    saveCallLogFromModal();

    const parsedStorage3 = JSON.parse(localStorage.getItem('vantorx_lead_calls_v1'));
    assert("Modal save persisted outcome: Success", parsedStorage3[testLeadId] && parsedStorage3[testLeadId].outcome === 'Success');
    assert("Modal save persisted notes", parsedStorage3[testLeadId] && parsedStorage3[testLeadId].notes === 'Booked 4:30 PM walkthrough with owner');
    assert("Modal save persisted called: true", parsedStorage3[testLeadId] && parsedStorage3[testLeadId].called === true);

    const rowModal = document.getElementById('leadRow_' + testLeadId);
    assert("Row displays Success badge", rowModal && rowModal.innerHTML.includes('Success'));

  } catch(err) {
    assert("Execution Error: " + err.message, false);
  }

  const passed = tests.filter(t => t.pass).length;
  const total = tests.length;
  const out = document.getElementById('leadTestOutput');
  out.innerHTML = `<h3>LEAD_CHECK_TESTS_RESULT: ${passed}/${total} PASSED</h3>` +
    tests.map(t => `<div class="test-item" data-pass="${t.pass}">${t.pass ? 'PASS' : 'FAIL'}: ${t.name}</div>`).join('');
}, 200);
</script>
'@

$harness = $content.Replace("</body>", "$testScript`n</body>")
$tmpHarness = Join-Path $PSScriptRoot "..\website\cold-call-arena\test_runner_lead_check.html"
$utf8Bom = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllText($tmpHarness, $harness, $utf8Bom)

$edgeExe = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgeExe)) {
    $edgeExe = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$fileUri = "file:///" + $tmpHarness.Replace('\', '/')
$domOutput = & $edgeExe --headless=new --disable-gpu --virtual-time-budget=3000 --dump-dom $fileUri | Out-String

Remove-Item $tmpHarness -ErrorAction SilentlyContinue

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "AUTOMATED HEADLESS LEAD CHECKBOX & PERSISTENCE TEST" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if ($domOutput -match '<h3>LEAD_CHECK_TESTS_RESULT: (\d+)/(\d+) PASSED</h3>') {
    $passed = $matches[1]
    $total = $matches[2]
    Write-Host "  $($matches[0])" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Red" })
    
    $domOutput | Select-String -Pattern '<div class="test-item" data-pass="(true|false)">(PASS|FAIL): ([^<]+)</div>' -AllMatches | ForEach-Object {
        $_.Matches | ForEach-Object {
            $status = $_.Groups[2].Value
            $name = $_.Groups[3].Value
            Write-Host "    [$status] $name" -ForegroundColor $(if ($status -eq "PASS") { "Green" } else { "Red" })
        }
    }
    
    if ($passed -eq $total -and [int]$total -gt 0) {
        Write-Host "`n100% OF LEAD CHECKBOX & PERSISTENCE TESTS PASSED!`n" -ForegroundColor Green
        exit 0
    } else {
        Write-Host "`nSOME TESTS FAILED!`n" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Could not retrieve test results from headless DOM." -ForegroundColor Red
    Write-Host ($domOutput.Substring(0, [Math]::Min(1000, $domOutput.Length)))
    exit 1
}
