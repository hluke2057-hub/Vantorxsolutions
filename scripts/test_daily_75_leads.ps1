# scripts/test_daily_75_leads.ps1
# Comprehensive end-to-end verification for the 75-leads-a-day rotation engine and 750 polished leads dataset.

$ErrorActionPreference = "Stop"

$workspaceRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$jsonPath = Join-Path $workspaceRoot "data/normalized_lead_targets.json"
$arenaHtmlPath = Join-Path $workspaceRoot "website/cold-call-arena/index.html"
$dailyEnginePath = Join-Path $workspaceRoot "scripts/daily_lead_engine.ps1"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "TEST SUITE: 75-LEADS-A-DAY ENGINE & 750 POLISHED DATASET" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$passed = 0
$failed = 0

function Assert-Test([string]$name, [bool]$condition, [string]$detail = "") {
    if ($condition) {
        Write-Host "  [PASS] $name" -ForegroundColor Green
        $script:passed++
    } else {
        Write-Host "  [FAIL] $name - $detail" -ForegroundColor Red
        $script:failed++
    }
}

# ----------------------------------------------------
# 1. Verify data/normalized_lead_targets.json
# ----------------------------------------------------
Write-Host "`n--- 1. Testing data/normalized_lead_targets.json ---" -ForegroundColor Yellow
Assert-Test "normalized_lead_targets.json exists" (Test-Path $jsonPath)

$jsonRaw = [System.IO.File]::ReadAllText($jsonPath, [System.Text.Encoding]::UTF8)
$leads = $jsonRaw | ConvertFrom-Json

Assert-Test "Total leads count equals 750" ($leads.Count -eq 750) "Found $($leads.Count)"

$batchGroups = $leads | Group-Object batch
Assert-Test "Dataset has exactly 10 batches" ($batchGroups.Count -eq 10) "Found $($batchGroups.Count)"

$allBatches75 = $true
foreach ($bg in $batchGroups) {
    if ($bg.Count -ne 75) {
        $allBatches75 = $false
        Write-Host "    Batch $($bg.Name) has $($bg.Count) leads (expected 75)" -ForegroundColor Red
    }
}
Assert-Test "All 10 batches contain exactly 75 leads each" $allBatches75

# Check uniqueness of phone numbers
$phoneGroups = @($leads | Group-Object phone | Where-Object { $_.Count -gt 1 })
Assert-Test "Zero duplicate phone numbers among 750 leads" ($phoneGroups.Count -eq 0) "Found $($phoneGroups.Count) duplicates"

# Check for dummy numbers (555, 000, 123-4567)
$dummyPhones = @($leads | Where-Object { $_.phone -match '555-\d{4}|\(000\)|123-4567|000-0000' })
Assert-Test "Zero fake 555 or dummy phone numbers" ($dummyPhones.Count -eq 0) "Found $($dummyPhones.Count)"

# Check financial fields accuracy
$financeErrors = 0
foreach ($l in $leads) {
    if ($l.annualLoss -ne ($l.monthlyLoss * 12)) { $financeErrors++ }
    $expectedSavings = [Math]::Max(0, $l.annualLoss - 8364)
    if ($l.netSavings -ne $expectedSavings) { $financeErrors++ }
    if ([string]::IsNullOrWhiteSpace($l.company) -or [string]::IsNullOrWhiteSpace($l.owner) -or [string]::IsNullOrWhiteSpace($l.phone) -or [string]::IsNullOrWhiteSpace($l.city)) {
        $financeErrors++
    }
}
Assert-Test "All 750 leads have valid fields and accurate financial calculations" ($financeErrors -eq 0) "Errors: $financeErrors"

# ----------------------------------------------------
# 2. Verify scripts/daily_lead_engine.ps1 Output
# ----------------------------------------------------
Write-Host "`n--- 2. Testing scripts/daily_lead_engine.ps1 ---" -ForegroundColor Yellow
Assert-Test "daily_lead_engine.ps1 exists" (Test-Path $dailyEnginePath)

$engineOutput = & powershell -ExecutionPolicy Bypass -File $dailyEnginePath
$engineOutputStr = $engineOutput -join "`n"

Assert-Test "Engine logs active batch of 75 target leads" ($engineOutputStr -match 'Active Daily Batch: Batch #\d+ \(75 Target Leads\)')
Assert-Test "Engine logs 750 nationwide leads available" ($engineOutputStr -match 'Total Nationwide Leads Available: 750')
Assert-Test "Engine logs Todays 75 Target Queue" ($engineOutputStr -match 'Todays 75 Target Queue:')
Assert-Test "Engine prints 75 leads in the queue" (($engineOutputStr -split "`n" | Where-Object { $_ -match '^\[\d+\]' }).Count -eq 75)

# ----------------------------------------------------
# 3. Verify website/cold-call-arena/index.html Static Content
# ----------------------------------------------------
Write-Host "`n--- 3. Testing website/cold-call-arena/index.html Static Content ---" -ForegroundColor Yellow
$htmlContent = [System.IO.File]::ReadAllText($arenaHtmlPath, [System.Text.Encoding]::UTF8)

Assert-Test "HTML title includes 750+ Nationwide Leads" ($htmlContent.Contains("750+ Nationwide Leads"))
Assert-Test "Queue tab includes (+75/Day)" ($htmlContent.Contains("100-Lead Dial Queue (+75/Day)"))
Assert-Test "Heading includes (+75 ADDED DAILY)" ($htmlContent.Contains("ACTIVE COLD CALL QUEUE: 100 TARGETS (+75 ADDED DAILY)"))
Assert-Test "Subtitle includes +75 fresh leads added every 24h" ($htmlContent.Contains("+75 fresh leads added every 24h"))
Assert-Test "Add 75 Leads button present" ($htmlContent -match 'id="btnAdd75Leads"[^>]*>.*Add \+75 Leads Now')
Assert-Test "Batch dropdown has Today's +75 Fresh Additions" ($htmlContent.Contains("Today's +75 Fresh Additions Only"))
Assert-Test "Batch dropdown has All 750 Nationwide Leads" ($htmlContent.Contains("All 750 Nationwide Leads"))
Assert-Test "Auto daily additions uses 75 factor" ($htmlContent.Contains("autoDailyAdditions = daysSinceLaunch * 75;"))
Assert-Test "Today's fresh range starts at limit - 75" ($htmlContent.Contains("start = Math.max(0, limit - 75);"))
Assert-Test "Manual additions adds 75" ($htmlContent.Contains("manualAdditions += 75;"))
Assert-Test "No mojibake characters in arena HTML" (-not ($htmlContent -match '[\uFFFD]'))

# ----------------------------------------------------
# 4. Headless Edge Browser DOM & Logic Verification
# ----------------------------------------------------
Write-Host "`n--- 4. Headless Edge Browser Test ---" -ForegroundColor Yellow
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

if (-not (Test-Path $edgePath)) {
    Write-Host "Edge binary not found at standard path, skipping headless test" -ForegroundColor Yellow
} else {
    $preAuthScript = @'
<script>
  try {
    localStorage.clear();
    localStorage.setItem('vantorx_active_user_id_v2', 'luke');
    localStorage.setItem('vantorx_user_profile_luke', JSON.stringify({
      id: 'luke',
      name: 'Luke (Founder)',
      email: 'luke@vantorx.com',
      role: 'founder',
      passcode: '0414',
      created: '2026-10-21T00:00:00.000Z'
    }));
  } catch(e) {}
</script>
'@

    $testScript = @'
<div id="lead75TestOutput" style="display:none"></div>
<script>
window.addEventListener('load', function() {
  setTimeout(function() {
    const tests = [];
    function assert(name, pass) { tests.push({ name: name, pass: !!pass }); }

    try {
      // 1. LEADS_DATA length is 750
      assert("LEADS_DATA length is 750", window.LEADS_DATA && window.LEADS_DATA.length === 750);

      // 2. All 10 batches have exactly 75 leads in DOM JS
      const batchCounts = {};
      window.LEADS_DATA.forEach(l => { batchCounts[l.batch] = (batchCounts[l.batch] || 0) + 1; });
      let all10Batches75 = true;
      for (let b = 1; b <= 10; b++) {
        if (batchCounts[b] !== 75) all10Batches75 = false;
      }
      assert("All 10 batches have exactly 75 leads in DOM JS", all10Batches75);

      // 3. Check getActiveQueueLimit starts >= 100
      const activeLimit = window.getActiveQueueLimit ? window.getActiveQueueLimit() : 0;
      assert("getActiveQueueLimit is >= 100", activeLimit >= 100);

      // 4. Check getTodayFreshRange returns range of 75
      const freshRange = window.getTodayFreshRange ? window.getTodayFreshRange() : { start: 0, end: 0 };
      const freshCount = freshRange.end - freshRange.start;
      assert("getTodayFreshRange spans 75 leads", freshCount === 75);

      // 5. Test Add 75 Leads Button Click
      const initialLimit = window.getActiveQueueLimit();
      const btnAdd = document.getElementById('btnAdd75Leads') || document.getElementById('btnAdd25Leads');
      if (btnAdd) {
        btnAdd.click();
        const newLimit = window.getActiveQueueLimit();
        assert("btnAdd75Leads increases queue by 75", newLimit === initialLimit + 75);
      } else {
        assert("btnAdd75Leads increases queue by 75", false);
      }

      // 6. Test Batch Switch to todayFresh
      const batchSel = document.getElementById('batchSelect');
      batchSel.value = 'todayFresh';
      batchSel.dispatchEvent(new Event('change'));
      const quotaTotalEl = document.getElementById('quotaTotal');
      assert("Today fresh filter quotaTotal is 75", quotaTotalEl && quotaTotalEl.textContent === '75');

      // 7. Test Batch Switch to Batch 1
      batchSel.value = '1';
      batchSel.dispatchEvent(new Event('change'));
      assert("Batch 1 filter quotaTotal is 75", quotaTotalEl && quotaTotalEl.textContent === '75');

      // 8. Test Checkbox call log and persistence
      const testLead = window.LEADS_DATA[0];
      const firstCheckbox = document.querySelector('.call-checkbox[data-id="' + testLead.id + '"]');
      if (firstCheckbox) {
        firstCheckbox.checked = true;
        firstCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
        const savedRecords = JSON.parse(localStorage.getItem('vantorx_lead_calls_v1') || '{}');
        assert("Lead checkbox save persists to localStorage", !!savedRecords[testLead.id]?.called);
      } else {
        assert("Lead checkbox save persists to localStorage", false);
      }

    } catch(err) {
      assert("Test runner error: " + err.message, false);
    }

    const passed = tests.filter(t => t.pass).length;
    const total = tests.length;
    const out = document.getElementById('lead75TestOutput');
    out.innerHTML = `<h3>LEAD_75_TESTS_RESULT: ${passed}/${total} PASSED</h3>` +
      tests.map(t => `<div class="test-item" data-pass="${t.pass}">${t.pass ? 'PASS' : 'FAIL'}: ${t.name}</div>`).join('');
  }, 300);
});
</script>
'@

    $content = [System.IO.File]::ReadAllText($arenaHtmlPath, [System.Text.Encoding]::UTF8)
    $harness = $content.Replace("<head>", "<head>`n$preAuthScript")
    $harness = $harness.Replace("</body>", "$testScript`n</body>")
    $tmpHarness = Join-Path $workspaceRoot "website/cold-call-arena/test_runner_75_leads.html"
    $utf8Bom = New-Object System.Text.UTF8Encoding($true)
    [System.IO.File]::WriteAllText($tmpHarness, $harness, $utf8Bom)

    $fileUri = "file:///" + $tmpHarness.Replace('\', '/')
    $domOutput = & $edgePath --headless=new --disable-gpu --virtual-time-budget=4000 --dump-dom $fileUri | Out-String

    Remove-Item $tmpHarness -ErrorAction SilentlyContinue

    if ($domOutput -match '<h3>LEAD_75_TESTS_RESULT: (\d+)/(\d+) PASSED</h3>') {
        $pCount = $matches[1]
        $tCount = $matches[2]
        Write-Host "  Headless DOM Result: $pCount / $tCount PASSED" -ForegroundColor $(if ($pCount -eq $tCount) { "Green" } else { "Red" })
        
        $domOutput | Select-String -Pattern '<div class="test-item" data-pass="(true|false)">(PASS|FAIL): ([^<]+)</div>' -AllMatches | ForEach-Object {
            $_.Matches | ForEach-Object {
                $status = $_.Groups[2].Value
                $name = $_.Groups[3].Value
                Assert-Test $name ($status -eq "PASS")
            }
        }
    } else {
        Assert-Test "Headless Edge test runner executed and returned results" $false "Could not find LEAD_75_TESTS_RESULT in DOM"
    }
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "FINAL RESULTS: $passed PASSED, $failed FAILED" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "==========================================================" -ForegroundColor Cyan

if ($failed -gt 0) {
    exit 1
} else {
    exit 0
}
