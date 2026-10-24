# scripts/test_crm_suite.ps1
$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$crmAppHtml = Join-Path $repoRoot "website/leadflow/leadflow-app.html"
$content = [System.IO.File]::ReadAllText((Resolve-Path $crmAppHtml).Path, [System.Text.Encoding]::UTF8)

$testScript = @'
<div id="testResultsBox" style="padding:20px;background:#000;color:#fff;font-family:monospace">
  <h2>AUTOMATED CRM TEST RESULTS</h2>
  <div id="testOutput">RUNNING...</div>
</div>
<script>
setTimeout(function() {
  const tests = [];
  function assert(name, condition) {
    tests.push({ name: name, pass: !!condition });
    console.log((condition ? '[PASS] ' : '[FAIL] ') + name);
  }

  try {
    // TEST 1: App Boot & Live Workspace
    const appEl = document.querySelector('.app');
    const gateEl = document.querySelector('.lf-gate-overlay');
    assert("App shell loaded without blocking gate", appEl && !gateEl);

    // TEST 2: Executive Dashboard & Metrics
    const pageTitle = document.querySelector('.page-title');
    assert("Dashboard page title rendered", pageTitle && pageTitle.textContent.includes('Executive Command Center'));

    const metricCards = document.querySelectorAll('.metric-card');
    assert("Metric cards rendered at least 6 metrics", metricCards.length >= 6);

    const pipelineValEl = document.querySelector('.metric-value');
    assert("Active Pipeline Value metric displays dollar figure", pipelineValEl && pipelineValEl.textContent.includes('$'));

    // TEST 3: Topbar Test Ava Call Trigger
    const testAvaBtn = document.querySelector('#topbarTestAvaBtn');
    assert("Topbar has Test Ava Call button", !!testAvaBtn);

    const initialLeadCount = getState().leads.length;
    testAvaBtn.click();
    const afterCallLeadCount = getState().leads.length;
    assert("Test Ava Call added a new emergency trade lead", afterCallLeadCount === initialLeadCount + 1);

    const latestLead = getState().leads[0];
    assert("New lead has Ava 24/7 source & call recording", latestLead.source.includes('Ava') && !!latestLead.callRecording);

    // TEST 4: Pipeline Page & Kanban Board
    LeadFlow.navigate('pipeline');
    const kanban = document.querySelector('#kanban');
    assert("Kanban board rendered", !!kanban);

    const cols = document.querySelectorAll('.kanban-col');
    assert("Kanban has 5 stage columns", cols.length === 5);

    const firstColHead = document.querySelector('.kanban-col-head');
    assert("Column header displays stage revenue subtotal", firstColHead && firstColHead.innerHTML.includes('$'));

    const leadCards = document.querySelectorAll('.lead-card');
    assert("Lead cards rendered in kanban", leadCards.length > 0);

    const cardBadge = document.querySelector('.lead-card .badge');
    assert("Lead card displays deal value or Ava call badge", !!cardBadge);

    // TEST 5: Lead Profile View
    LeadFlow.openLead(latestLead.id);
    const profileName = document.querySelector('.profile-name');
    assert("Profile opened for latest lead", profileName && profileName.textContent.includes(latestLead.firstName));

    const audioPlayer = document.querySelector('audio');
    assert("Audio player rendered for Ava recording", !!audioPlayer);

    const transcriptDetails = document.querySelector('details');
    assert("Full transcript expandable details rendered", !!transcriptDetails);

    const smsThread = document.querySelector('#smsThread');
    assert("Two-Way SMS thread rendered", !!smsThread);

    const battlecardBtns = document.querySelectorAll('.quick-tpl-btn');
    assert("4 Contractor Quick Battlecards rendered", battlecardBtns.length === 4);

    // Test Battlecard Click -> Fills Textarea
    const speedBattlecard = document.querySelector('[data-tpl="speed"]');
    speedBattlecard.click();
    const smsInput = document.querySelector('#smsInput');
    assert("Battlecard filled SMS textarea", smsInput && smsInput.value.includes('Luke with VantorX'));

    // Test Sending SMS
    const sendBtn = document.querySelector('#sendSmsBtn');
    sendBtn.click();
    assert("SMS sent and appended to lead messages", latestLead.messages.some(m => m.sender === 'user'));

    // TEST 6: Follow-Up Queue Page
    LeadFlow.navigate('queue');
    const queueTitle = document.querySelector('.page-title');
    assert("Follow-up queue loaded", queueTitle && queueTitle.textContent.includes('Follow-Up'));

    // TEST 7: Automations Page
    LeadFlow.navigate('automations');
    const autoList = document.querySelector('#autoList');
    assert("Automations sequence builder rendered", autoList && autoList.children.length > 0);

  } catch (err) {
    assert("Execution Error: " + err.message, false);
  }

  const passed = tests.filter(t => t.pass).length;
  const total = tests.length;
  const out = document.getElementById('testOutput');
  out.innerHTML = `<h3>CRM_TESTS_RESULT: ` + passed + `/` + total + ` PASSED</h3>` +
    tests.map(t => `<div class="test-item" data-pass="` + t.pass + `">` + (t.pass ? 'PASS' : 'FAIL') + `: ` + t.name + `</div>`).join('');
}, 300);
</script>
'@

$harnessContent = $content.Replace("</body>", $testScript + "</body>")
$harnessPath = Join-Path $PSScriptRoot "test_crm_harness.html"
[System.IO.File]::WriteAllText($harnessPath, $harnessContent, (New-Object System.Text.UTF8Encoding($true)))

$edgeExe = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgeExe)) {
    $edgeExe = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$harnessUri = "file:///" + $harnessPath.Replace("\", "/")
$domOutput = & $edgeExe --headless=new --disable-gpu --virtual-time-budget=4000 --dump-dom $harnessUri | Out-String

Remove-Item $harnessPath -Force -ErrorAction SilentlyContinue

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "AUTOMATED HEADLESS BROWSER CRM TEST SUITE" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if ($domOutput -match '<h3>CRM_TESTS_RESULT: (\d+)/(\d+) PASSED</h3>') {
    $summary = $matches[0]
    $passedCount = [int]$matches[1]
    $totalCount = [int]$matches[2]
    Write-Host "  $summary" -ForegroundColor $(if ($passedCount -eq $totalCount) { "Green" } else { "Red" })
    
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
        Write-Host "`nALL CRM VERIFICATION TESTS PASSED (100%)!" -ForegroundColor Green
        exit 0
    } else {
        exit 1
    }
} else {
    Write-Host "Failed to parse CRM results from DOM output:" -ForegroundColor Red
    Write-Host $domOutput.Substring(0, [math]::Min(1500, $domOutput.Length))
    exit 1
}
