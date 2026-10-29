# scripts/test_700_leads_and_descriptions.ps1
# Comprehensive test suite verifying:
# 1. 1-week daily intake pause at exactly 700 leads
# 2. Complete product/package descriptions across table and teleprompter
# 3. Exact after-hours money loss calculations and dynamic sales script injection

$ErrorActionPreference = "Stop"

$workspaceRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$arenaHtmlPath = Join-Path $workspaceRoot "website/cold-call-arena/index.html"
$dailyEnginePath = Join-Path $workspaceRoot "scripts/daily_lead_engine.ps1"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "TEST SUITE: 700 LEADS PAUSE, DESCRIPTIONS & EXACT AFTER-HOURS LOSS" -ForegroundColor Cyan
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
# 1. Static HTML & Script Verification
# ----------------------------------------------------
Write-Host "`n--- 1. Testing Static HTML & Logic ---" -ForegroundColor Yellow
$htmlContent = [System.IO.File]::ReadAllText($arenaHtmlPath, [System.Text.Encoding]::UTF8)

Assert-Test "Arena HTML contains PAUSE_START_DATE" ($htmlContent.Contains("PAUSE_START_DATE = new Date('2026-10-29T00:00:00')"))
Assert-Test "Arena HTML contains PAUSE_END_DATE" ($htmlContent.Contains("PAUSE_END_DATE = new Date('2026-11-05T23:59:59')"))
Assert-Test "Arena HTML contains isIntakePaused definition" ($htmlContent.Contains("isIntakePaused = (now >= PAUSE_START_DATE && now <= PAUSE_END_DATE)"))
Assert-Test "Arena HTML contains 1-week pause batch heading" ($htmlContent.Contains("PAUSED FOR 1 WEEK · 700 STACKED LEADS READY"))
Assert-Test "Arena HTML contains 1-week pause dropdown label" ($htmlContent.Contains("1-Wk Pause Active"))
Assert-Test "Arena HTML contains getExactAfterHoursLossDetails" ($htmlContent.Contains("function getExactAfterHoursLossDetails(lead)"))
Assert-Test "Arena HTML contains pkgDescription schema in getLeadOfferStrategy" ($htmlContent.Contains("pkgDescription = '24/7 Ava Voice AI Receptionist"))
Assert-Test "Arena HTML contains activeLeadPkgDescText element" ($htmlContent.Contains('id="activeLeadPkgDescText"'))
Assert-Test "Arena HTML contains activeLeadFallbackDescText element" ($htmlContent.Contains('id="activeLeadFallbackDescText"'))
Assert-Test "Arena HTML contains dyn-exact-ticket placeholder in Ava script" ($htmlContent.Contains('class="dyn-exact-ticket"'))
Assert-Test "Arena HTML contains dyn-exact-breakdown placeholder in prompter" ($htmlContent.Contains('class="dyn-exact-breakdown"'))

# ----------------------------------------------------
# 2. Verify scripts/daily_lead_engine.ps1 Output
# ----------------------------------------------------
Write-Host "`n--- 2. Testing scripts/daily_lead_engine.ps1 Output ---" -ForegroundColor Yellow
$engineOutput = & powershell -ExecutionPolicy Bypass -File $dailyEnginePath
$engineOutputStr = $engineOutput -join "`n"

Assert-Test "Daily engine announces 1-week intake pause active" ($engineOutputStr.Contains("1-WEEK INTAKE PAUSE ACTIVE (Oct 29 - Nov 5, 2026)"))
Assert-Test "Daily engine announces queue locked at 700 stacked leads" ($engineOutputStr.Contains("Active Queue locked at 700 stacked leads"))

# ----------------------------------------------------
# 3. Headless Edge Browser DOM & Runtime Verification
# ----------------------------------------------------
Write-Host "`n--- 3. Headless Edge Browser Test ---" -ForegroundColor Yellow
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
<div id="test700Output" style="display:none"></div>
<script>
window.addEventListener('load', function() {
  setTimeout(function() {
    const tests = [];
    function assert(name, pass, detail) { tests.push({ name: name, pass: !!pass, detail: detail || '' }); }

    try {
      // 1. Queue Limit is locked at exactly 700
      const activeLimit = window.getActiveQueueLimit ? window.getActiveQueueLimit() : 0;
      assert("Active queue limit is exactly 700 during pause", activeLimit === 700, "Got " + activeLimit);

      // 2. isIntakePaused flag is true
      assert("window.isIntakePaused is true on Oct 29 2026", window.isIntakePaused === true);

      // 3. Batch Heading shows 1-week pause message
      const headingEl = document.getElementById('batchHeadingText');
      assert("Batch heading contains PAUSED FOR 1 WEEK message", headingEl && headingEl.textContent.includes('PAUSED FOR 1 WEEK · 700 STACKED LEADS READY'), headingEl ? headingEl.textContent : 'missing');

      // 4. Batch Dropdown label includes 1-Wk Pause Active
      const batchSel = document.getElementById('batchSelect');
      const optActive = batchSel ? batchSel.querySelector('option[value="activeQueue"]') : null;
      assert("Batch dropdown indicates 700 Leads and 1-Wk Pause Active", optActive && optActive.textContent.includes('700 Leads · 1-Wk Pause Active'), optActive ? optActive.textContent : 'missing');

      // 5. Test getLeadOfferStrategy returns full package and fallback descriptions
      const testLead1 = window.LEADS_DATA[0]; // Palm Air ($102,000/yr, HVAC, product: ava)
      const strat1 = window.getLeadOfferStrategy(testLead1);
      assert("strat1 has Accelerate pkgDescription explaining Ava, SMS, and website", strat1.pkgDescription && strat1.pkgDescription.includes('24/7 Ava Voice AI Receptionist') && strat1.pkgDescription.includes('90s LeadFlow SMS'));
      assert("strat1 has Ava fallbackDescription explaining 24/7 voice receptionist", strat1.fallbackDescription && strat1.fallbackDescription.includes('Human-sounding 24/7 Voice AI receptionist'));

      // 6. Test Scale Enterprise Package description
      const enterpriseLead = window.LEADS_DATA.find(l => l.annualLoss >= 115000);
      const stratEnterprise = window.getLeadOfferStrategy(enterpriseLead);
      assert("stratEnterprise recommends Scale Enterprise Tier", stratEnterprise.pkgKey === 'scale');
      assert("stratEnterprise has Scale pkgDescription explaining multi-line and CRM", stratEnterprise.pkgDescription.includes('Multi-line & multi-location Ava Voice AI') && stratEnterprise.pkgDescription.includes('ServiceTitan'));

      // 7. Test getExactAfterHoursLossDetails calculation
      const exactLoss1 = window.getExactAfterHoursLossDetails(testLead1);
      assert("exactLoss1 computes exact annualLoss", exactLoss1.annual === 102000);
      assert("exactLoss1 computes exact monthlyLoss", exactLoss1.monthly === 8500);
      assert("exactLoss1 computes weekly loss (~$1,963/wk)", exactLoss1.weeklyStr === '~$1,963/wk');
      assert("exactLoss1 computes weekend loss (~$1,276 every weekend)", exactLoss1.weekendStr.includes('1,276'));
      assert("exactLoss1 includes HVAC emergency replacement breakdown", exactLoss1.unitDesc.includes('emergency AC replacement'));

      // 8. Test table rendering contains exact leak breakdown and full product descriptions
      const firstRow = document.querySelector('#leadTableBody tr');
      assert("First table row contains exact annual loss", firstRow && firstRow.textContent.includes('$102,000/yr'));
      assert("First table row contains exact monthly loss", firstRow && firstRow.textContent.includes('$8,500/mo'));
      assert("First table row contains What it is package description", firstRow && firstRow.querySelector('.lead-pkg-desc') && firstRow.querySelector('.lead-pkg-desc').textContent.includes('24/7 Ava Voice AI'));
      assert("First table row contains Downsell fallback description", firstRow && firstRow.querySelector('.lead-fallback-desc') && firstRow.querySelector('.lead-fallback-desc').textContent.includes('Human-sounding'));

      // 9. Load Lead into Teleprompter and verify prompter strategy card
      window.loadLeadIntoTeleprompter(testLead1.id);

      const prompterLoss = document.getElementById('activeLeadLoss');
      assert("Prompter banner displays exact annual and monthly loss", prompterLoss && prompterLoss.textContent.includes('-$102,000/yr') && prompterLoss.textContent.includes('$8,500/mo'));

      const prompterBreakdown = document.getElementById('activeLeadLeakBreakdown');
      assert("Prompter banner displays exact weekend after-hours bleed", prompterBreakdown && prompterBreakdown.textContent.includes('Exact after-hours bleed: ~$1,276 every weekend'));

      const prompterHook = document.getElementById('activeLeadLeakQuote');
      assert("Prompter opening hook quotes exact $102,000/yr and $8,500/mo numbers", prompterHook && prompterHook.textContent.includes('$102,000 a year') && prompterHook.textContent.includes('$8,500 every month'));

      const prompterPkgDesc = document.getElementById('activeLeadPkgDescText');
      assert("Prompter strategy card shows full Accelerate package description", prompterPkgDesc && prompterPkgDesc.textContent.includes('24/7 Ava Voice AI Receptionist'));

      const prompterFallbackDesc = document.getElementById('activeLeadFallbackDescText');
      assert("Prompter strategy card shows full Ava fallback product description", prompterFallbackDesc && prompterFallbackDesc.textContent.includes('Human-sounding 24/7 Voice AI receptionist'));

      // 10. Verify dynamic prompter script placeholders populated with exact numbers
      const dynTickets = document.querySelectorAll('.dyn-exact-ticket');
      let ticketFilled = false;
      dynTickets.forEach(el => { if (el.textContent.includes('8,500')) ticketFilled = true; });
      assert("Prompter script .dyn-exact-ticket populated with contractor exact ticket ($8,500)", ticketFilled);

      const dynLosses = document.querySelectorAll('.dyn-loss');
      let lossFilled = false;
      dynLosses.forEach(el => { if (el.textContent.includes('102,000')) lossFilled = true; });
      assert("Prompter script .dyn-loss populated with contractor exact annual loss ($102,000)", lossFilled);

      // 11. Test Reset / Clear Lead restores default placeholders
      const clearBtn = document.getElementById('clearActiveLeadBtn');
      if (clearBtn) clearBtn.click();
      const clearedLoss = document.getElementById('activeLeadLoss');
      assert("Clearing active lead resets banner loss cleanly", clearedLoss && clearedLoss.textContent.includes('-$96,000 / year'));

    } catch(err) {
      assert("Test runner error: " + err.message, false, err.stack);
    }

    const p = tests.filter(t => t.pass).length;
    const tot = tests.length;
    const out = document.getElementById('test700Output');
    out.innerHTML = `<h3>TEST_700_RESULT: ${p}/${tot} PASSED</h3>` +
      tests.map(t => `<div class="test-item" data-pass="${t.pass}">${t.pass ? 'PASS' : 'FAIL'}: ${t.name} ${t.detail ? '(' + t.detail + ')' : ''}</div>`).join('');
  }, 400);
});
</script>
'@

    $content = [System.IO.File]::ReadAllText($arenaHtmlPath, [System.Text.Encoding]::UTF8)
    $harness = $content.Replace("<head>", "<head>`n$preAuthScript")
    $harness = $harness.Replace("</body>", "$testScript`n</body>")
    $tmpHarness = Join-Path $workspaceRoot "website/cold-call-arena/test_runner_700_leads.html"
    $utf8Bom = New-Object System.Text.UTF8Encoding($true)
    [System.IO.File]::WriteAllText($tmpHarness, $harness, $utf8Bom)

    $fileUri = "file:///" + $tmpHarness.Replace('\', '/')
    $domOutput = & $edgePath --headless=new --disable-gpu --virtual-time-budget=5000 --dump-dom $fileUri | Out-String

    Start-Sleep -Milliseconds 600
    Remove-Item $tmpHarness -ErrorAction SilentlyContinue

    if ($domOutput -match '<h3>TEST_700_RESULT: (\d+)/(\d+) PASSED</h3>') {
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
        Assert-Test "Headless Edge test runner executed and returned results" $false "Could not find TEST_700_RESULT in DOM"
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
