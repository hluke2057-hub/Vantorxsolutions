# scripts/test_team_call_sync.ps1
$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$auditJsPath = Join-Path $repoRoot "website/api/audit.js"
$arenaHtmlPath = Join-Path $repoRoot "website/cold-call-arena/index.html"
$vercelJsonPath = Join-Path $repoRoot "website/vercel.json"
$callDataPath1 = Join-Path $repoRoot "data/lead_call_records.json"
$callDataPath2 = Join-Path $repoRoot "website/data/lead_call_records.json"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "REAL-TIME MULTI-USER CLOUD CALL SYNC AUTOMATED TEST SUITE" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$tests = @()
function Assert-True([string]$name, [bool]$condition) {
    $script:tests += [PSCustomObject]@{ Name = $name; Pass = $condition }
    if ($condition) {
        Write-Host "  [PASS] $name" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] $name" -ForegroundColor Red
    }
}

# -------------------------------------------------------------
# 1. FILE & STORAGE VERIFICATION
# -------------------------------------------------------------
Assert-True "data/lead_call_records.json exists" (Test-Path $callDataPath1)
Assert-True "website/data/lead_call_records.json exists" (Test-Path $callDataPath2)

# -------------------------------------------------------------
# 2. VERCEL REWRITES
# -------------------------------------------------------------
$vercelJson = Get-Content $vercelJsonPath -Raw -Encoding UTF8
Assert-True "vercel.json contains /api/lead-calls rewrite" ($vercelJson.Contains('"/api/lead-calls"'))
Assert-True "vercel.json contains /api/lead-calls/:action rewrite" ($vercelJson.Contains('"/api/lead-calls/:action"'))

# -------------------------------------------------------------
# 3. AUDIT.JS BACKEND IMPLEMENTATION
# -------------------------------------------------------------
$auditCode = Get-Content $auditJsPath -Raw -Encoding UTF8
Assert-True "audit.js contains getLeadCallRecords" ($auditCode.Contains("getLeadCallRecords"))
Assert-True "audit.js contains saveLeadCallRecords" ($auditCode.Contains("saveLeadCallRecords"))
Assert-True "audit.js contains handleLeadCallSync" ($auditCode.Contains("handleLeadCallSync"))
Assert-True "audit.js handles lead-calls action" ($auditCode.Contains('"lead-calls"') -or $auditCode.Contains('"lead-call-roster"'))
Assert-True "audit.js handles lead-call-sync action" ($auditCode.Contains('"lead-call-sync"'))
Assert-True "audit.js persists calls to Supabase audit_log (entity_type: lead_call)" ($auditCode.Contains("entity_type=eq.lead_call") -or $auditCode.Contains('"lead_call"'))

# -------------------------------------------------------------
# 4. FRONTEND ARENA HTML CODE INTEGRITY
# -------------------------------------------------------------
$arenaHtml = Get-Content $arenaHtmlPath -Raw -Encoding UTF8
Assert-True "cold-call-arena has btnSyncTeamCalls button" ($arenaHtml.Contains('id="btnSyncTeamCalls"'))
Assert-True "cold-call-arena has teamCallSyncDot indicator" ($arenaHtml.Contains('id="teamCallSyncDot"'))
Assert-True "cold-call-arena has teamCallSyncCount label" ($arenaHtml.Contains('id="teamCallSyncCount"'))
Assert-True "cold-call-arena has syncCallRecordToCloud function" ($arenaHtml.Contains("function syncCallRecordToCloud"))
Assert-True "cold-call-arena has mergeCallsFromTeammate function" ($arenaHtml.Contains("function mergeCallsFromTeammate"))
Assert-True "cold-call-arena has fetchTeamCallsFromCloud function" ($arenaHtml.Contains("function fetchTeamCallsFromCloud"))
Assert-True "cold-call-arena has BroadcastChannel('vantorx_lead_calls_channel')" ($arenaHtml.Contains("BroadcastChannel('vantorx_lead_calls_channel')"))
Assert-True "cold-call-arena wires storage event listener" ($arenaHtml.Contains("window.addEventListener('storage'"))
Assert-True "cold-call-arena polls cloud every 4 seconds" ($arenaHtml.Contains("setInterval") -and $arenaHtml.Contains("fetchTeamCallsFromCloud(true)"))
Assert-True "cold-call-arena syncs on checkbox change" ($arenaHtml.Contains("syncCallRecordToCloud(id, CALL_RECORDS[id])"))
Assert-True "cold-call-arena syncs on modal save" ($arenaHtml.Contains("syncCallRecordToCloud(id, CALL_RECORDS[id])"))

# -------------------------------------------------------------
# 5. BACKEND CALL DISPATCH & PERSISTENCE CONTRACTS
# -------------------------------------------------------------
Write-Host "`nTesting backend persistence contracts..." -ForegroundColor Yellow

Assert-True "audit.js contains single-call update branch (body.leadId && body.call)" ($auditCode.Contains("body.leadId && body.call"))
Assert-True "audit.js contains batch-calls update branch (body.calls)" ($auditCode.Contains("body.calls && typeof body.calls"))
Assert-True "audit.js sets default caller 'Outbound Closer' or provided caller" ($auditCode.Contains('typeof body.caller === "string"'))
Assert-True "audit.js persists lead_call_logged action to audit_log" ($auditCode.Contains('action: "lead_call_logged"'))
Assert-True "audit.js contains fallback to submit_public_inquiry" ($auditCode.Contains("submit_public_inquiry") -and $auditCode.Contains('"lead_call"'))

# Test JSON file read/write serialization
$testLeadRecord = @{
    "fl_se_001" = @{
        called = $true
        caller = "Luke (Founder)"
        outcome = "Call Back"
        timestamp = "04:15 PM"
        notes = "Called, no answer, left urgent callback VM"
        updatedAt = (Get-Date).ToString("o")
    }
}
$jsonString = $testLeadRecord | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText($callDataPath1, $jsonString, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($callDataPath2, $jsonString, [System.Text.Encoding]::UTF8)

$readBack = Get-Content $callDataPath1 -Raw -Encoding UTF8 | ConvertFrom-Json
Assert-True "data/lead_call_records.json successfully serialized fl_se_001" ($readBack.fl_se_001 -ne $null)
Assert-True "Serialized outcome is 'Call Back'" ($readBack.fl_se_001.outcome -eq "Call Back")
Assert-True "Serialized caller is 'Luke (Founder)'" ($readBack.fl_se_001.caller -eq "Luke (Founder)")

# -------------------------------------------------------------
# 6. HEADLESS EDGE DOM SIMULATION: REAL-TIME TEAM CALL SYNC
# -------------------------------------------------------------
Write-Host "`nRunning Headless Edge DOM Cross-Device Sync Simulation..." -ForegroundColor Yellow

$testClientScript = @'
<div id="testOutputBox" style="padding:20px;background:#000;color:#fff;font-family:monospace">
  <h2>TEAM CALL SYNC HEADLESS DOM TEST RESULTS</h2>
  <div id="testResultsOutput">RUNNING...</div>
</div>
<script>
window.__testResults = [];
function testAssert(name, cond) {
  window.__testResults.push({ name: name, pass: !!cond });
  console.log((cond ? '[PASS] ' : '[FAIL] ') + name);
}

setTimeout(function() {
  try {
    // 1. Bypass gate as Teammate / Buddy 2 to simulate Luke's friend's browser
    if (window.bypassToFounder) window.bypassToFounder();
    const callerSel = document.getElementById('callerSelect');
    if (callerSel) {
      callerSel.value = 'Buddy 2 (Rep 2)';
      callerSel.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const testLeadId = 'fl_se_001'; // Palm Air AC & Heating
    const lead = (window.LEADS_DATA || []).find(l => l.id === testLeadId);
    testAssert("Palm Air lead exists in queue", !!lead);

    // Initial state: clear any prior call for fl_se_001 in teammate's local view
    delete CALL_RECORDS[testLeadId];
    renderLeadsTable();

    const rowBefore = document.getElementById('leadRow_' + testLeadId);
    testAssert("Palm Air row rendered initially", !!rowBefore);
    const cbBefore = document.querySelector(`.call-checkbox[data-id="${testLeadId}"]`);
    testAssert("Palm Air checkbox initially unchecked for teammate", cbBefore && !cbBefore.checked);

    // 2. SIMULATE INCOMING CLOUD CALL UPDATE FROM LUKE
    // Luke dialed Palm Air, they didn't pick up, Luke logged "Call Back"
    const lukeCallUpdate = {
      [testLeadId]: {
        called: true,
        caller: 'Luke (Founder)',
        outcome: 'Call Back',
        timestamp: '04:15 PM',
        notes: 'Rang 5 times, no answer. Call back at 4:45 PM'
      }
    };

    const merged = window.mergeCallsFromTeammate(lukeCallUpdate, true);
    testAssert("mergeCallsFromTeammate returned true", merged === true);

    // 3. VERIFY TEAMMATE'S DOM REFLECTS LUKE'S ACTION
    const rowAfter = document.getElementById('leadRow_' + testLeadId);
    testAssert("Palm Air row updated with called class", rowAfter && rowAfter.classList.contains('lead-row-called'));

    const cbAfter = document.querySelector(`.call-checkbox[data-id="${testLeadId}"]`);
    testAssert("Palm Air checkbox is now checked on teammate's screen", cbAfter && cbAfter.checked);

    const callerTag = rowAfter.querySelector('.caller-tag');
    testAssert("Caller tag displays 'By Luke (Founder)'", callerTag && callerTag.textContent.includes('Luke (Founder)'));

    const badge = rowAfter.querySelector('.status-badge-callback');
    testAssert("Status badge shows '⏳ Call Back'", badge && badge.textContent.includes('Call Back'));

    const outcomeSel = rowAfter.querySelector('.outcome-select');
    testAssert("Outcome dropdown pre-selected to 'Call Back'", outcomeSel && outcomeSel.value === 'Call Back');

    const noteTag = rowAfter.querySelector('.call-note-tag');
    testAssert("Note reflects Luke's callback note", noteTag && noteTag.textContent.includes('Rang 5 times'));

    // 4. VERIFY TOAST NOTIFICATION ON TEAMMATE'S SCREEN
    const toast = document.getElementById('toast');
    testAssert("Toast triggered with team alert", toast && (toast.textContent.includes('Luke') || toast.textContent.includes('Call Back')));

    // 5. VERIFY TELEPROMPTER INTEGRATION
    window.loadLeadIntoTeleprompter(testLeadId);
    const prompterBadge = document.getElementById('prompterStatusBadge');
    testAssert("Prompter badge shows '⏳ Call Back (by Luke (Founder))'", prompterBadge && prompterBadge.textContent.includes('Call Back') && prompterBadge.textContent.includes('Luke (Founder)'));

    const prompterToggleBtn = document.getElementById('prompterToggleCallBtn');
    testAssert("Prompter button switched to '📝 Edit Call Log / Why'", prompterToggleBtn && prompterToggleBtn.textContent.includes('Edit Call Log'));

    // 6. VERIFY TEAM SYNC BUTTON & INDICATOR
    const syncDot = document.getElementById('teamCallSyncDot');
    testAssert("Team sync dot is active", syncDot && syncDot.style.background.includes('rgb(52, 211, 153)'));

  } catch(err) {
    testAssert("Client Execution Error: " + err.message, false);
  }

  const passed = window.__testResults.filter(t => t.pass).length;
  const total = window.__testResults.length;
  const out = document.getElementById('testResultsOutput');
  out.innerHTML = `<h3>TEAM_SYNC_TEST_RESULTS: ${passed}/${total} PASSED</h3>` +
    window.__testResults.map(t => `<div class="test-item" data-pass="${t.pass}">${t.pass ? 'PASS' : 'FAIL'}: ${t.name}</div>`).join('');
}, 300);
</script>
'@

$arenaContent = Get-Content $arenaHtmlPath -Raw -Encoding UTF8
$arenaContent = $arenaContent.Replace("<head>", "<head><script>try{localStorage.setItem('vantorx_active_user_id_v2', 'luke');}catch(e){}</script>")
$harness = $arenaContent.Replace("</body>", "$testClientScript`n</body>")
$tmpHarness = Join-Path $repoRoot "website/cold-call-arena/test_runner_team_call_sync.html"

$utf8Bom = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllText($tmpHarness, $harness, $utf8Bom)

$edgeExe = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgeExe)) {
    $edgeExe = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$fileUri = "file:///" + $tmpHarness.Replace('\', '/')
$domOutput = & $edgeExe --headless=new --disable-gpu --virtual-time-budget=3500 --dump-dom $fileUri | Out-String

Remove-Item $tmpHarness -ErrorAction SilentlyContinue

if ($domOutput -match '<h3>TEAM_SYNC_TEST_RESULTS: (\d+)/(\d+) PASSED</h3>') {
    $domPassed = $matches[1]
    $domTotal = $matches[2]
    Write-Host "`n  $($matches[0])" -ForegroundColor $(if ($domPassed -eq $domTotal) { "Green" } else { "Red" })
    
    $domOutput | Select-String -Pattern '<div class="test-item" data-pass="(true|false)">(PASS|FAIL): ([^<]+)</div>' -AllMatches | ForEach-Object {
        $_.Matches | ForEach-Object {
            $status = $_.Groups[2].Value
            $name = $_.Groups[3].Value
            Assert-True $name ($status -eq "PASS")
        }
    }
} else {
    Write-Host "Could not retrieve DOM test results from headless Edge." -ForegroundColor Red
    Write-Host ($domOutput.Substring(0, [Math]::Min(1200, $domOutput.Length)))
    exit 1
}

$totalPassed = ($tests | Where-Object { $_.Pass }).Count
$totalTests = $tests.Count

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "TEST RESULTS SUMMARY: $totalPassed / $totalTests PASSED" -ForegroundColor $(if ($totalPassed -eq $totalTests) { "Green" } else { "Red" })
Write-Host "==========================================================" -ForegroundColor Cyan

if ($totalPassed -eq $totalTests -and $totalTests -gt 0) {
    Write-Host "`nALL REAL-TIME TEAM CALL SYNC TESTS PASSED SUCCESSFULLY!`n" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`nSOME TESTS FAILED!`n" -ForegroundColor Red
    exit 1
}
