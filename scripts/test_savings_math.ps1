# scripts/test_savings_math.ps1
$ErrorActionPreference = "Stop"

$arenaPath = (Resolve-Path (Join-Path $PSScriptRoot "..\website\cold-call-arena\index.html")).Path
$arenaHtml = [System.IO.File]::ReadAllText($arenaPath, [System.Text.Encoding]::UTF8)

Write-Host "=========================================================="
Write-Host "TESTING COLD CALL ARENA SAVINGS MATH & PROSPECT TALK TRACK"
Write-Host "Target: $arenaPath"
Write-Host "=========================================================="

$edgePaths = @(
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
)
$edgeExe = $null
foreach ($p in $edgePaths) {
    if (Test-Path $p) { $edgeExe = $p; break }
}
if (!$edgeExe) {
    Write-Error "Microsoft Edge not found"
    exit 1
}

$tests = [System.Collections.Generic.List[PSObject]]::new()
function Assert-True($name, $cond) {
    $tests.Add([PSCustomObject]@{ Name = $name; Pass = [bool]$cond })
    if ($cond) {
        Write-Host "  [PASS] $name" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] $name" -ForegroundColor Red
    }
}

# 1. Static HTML Checks
Assert-True "activeLeadSavingsCell has .active-lead-savings-cell" ($arenaHtml.Contains('active-lead-savings-cell'))
Assert-True "activeLeadSavingsMiniMath badge exists" ($arenaHtml.Contains('id="activeLeadSavingsMiniMath"'))
Assert-True "activeLeadRoiPill exists" ($arenaHtml.Contains('id="activeLeadRoiPill"'))
Assert-True "Dedicated activeLeadSavingsMathCard exists" ($arenaHtml.Contains('id="activeLeadSavingsMathCard"'))
Assert-True "activeLeadMathEquationBadge exists" ($arenaHtml.Contains('id="activeLeadMathEquationBadge"'))
Assert-True "mathCardGrossLeak exists" ($arenaHtml.Contains('id="mathCardGrossLeak"'))
Assert-True "mathCardVantorxCost exists" ($arenaHtml.Contains('id="mathCardVantorxCost"'))
Assert-True "mathCardNetSaved exists" ($arenaHtml.Contains('id="mathCardNetSaved"'))
Assert-True "mathCardBreakeven exists" ($arenaHtml.Contains('id="mathCardBreakeven"'))
Assert-True "activeLeadMathScriptText verbatim talk track exists" ($arenaHtml.Contains('id="activeLeadMathScriptText"'))
Assert-True "script-savings-math-cue exists in prompter panels" ($arenaHtml.Contains('script-savings-math-cue'))
Assert-True "dyn-script-savings-math dynamic class exists" ($arenaHtml.Contains('dyn-script-savings-math'))
Assert-True "updateSavingsMathUI function defined" ($arenaHtml.Contains('function updateSavingsMathUI'))
Assert-True "copySavingsMathScript function defined" ($arenaHtml.Contains('window.copySavingsMathScript = function'))
Assert-True "Table Net Saved column has math subtitle formula" ($arenaHtml.Contains('Math.round(lead.annualLoss/1000)'))

# 2. Dynamic Browser In-Memory Test Harness
$testJs = @'
<script>
window.__testResults = [];
function testAssert(name, cond) {
  window.__testResults.push({ name: name, pass: !!cond });
}

try {
  // Test 1: Initial Palm Air (fl_se_001) state
  const initialSavings = document.getElementById('activeLeadSavings')?.textContent || '';
  const initialMiniMath = document.getElementById('activeLeadSavingsMiniMath')?.textContent || '';
  const initialRoi = document.getElementById('activeLeadRoiPill')?.textContent || '';
  const initialEquation = document.getElementById('activeLeadMathEquationBadge')?.textContent || '';
  const initialScript = document.getElementById('activeLeadMathScriptText')?.textContent || '';

  testAssert("Initial Net Savings is +$93,636 / year", initialSavings.includes('93,636'));
  testAssert("Initial Mini Math formula renders ($102k leak - $8.3k VantorX)", initialMiniMath.includes('102k') && initialMiniMath.includes('8.3k'));
  testAssert("Initial ROI pill displays 11.2x ROI", initialRoi.includes('11.2x'));
  testAssert("Initial Equation displays Gross - Cost = Net", initialEquation.includes('102,000') && initialEquation.includes('8,364') && initialEquation.includes('93,636'));
  testAssert("Initial Spoken Script mentions HVAC, $8,500 ticket, and $93,636 net cash", initialScript.includes('HVAC') && initialScript.includes('8,500') && initialScript.includes('93,636'));

  // Test 2: Load Roofing Lead on Scale Tier (Whale Roofing - fl_se_006: $150k annual loss, Scale Tier $1,297/mo)
  window.loadLeadIntoTeleprompter('fl_se_006');
  const roofSavings = document.getElementById('activeLeadSavings')?.textContent || '';
  const roofMiniMath = document.getElementById('activeLeadSavingsMiniMath')?.textContent || '';
  const roofRoi = document.getElementById('activeLeadRoiPill')?.textContent || '';
  const roofEquation = document.getElementById('activeLeadMathEquationBadge')?.textContent || '';
  const roofScript = document.getElementById('activeLeadMathScriptText')?.textContent || '';
  const roofCost = document.getElementById('mathCardVantorxCost')?.textContent || '';
  const roofNet = document.getElementById('mathCardNetSaved')?.textContent || '';

  testAssert("Whale Roofing Net Savings is +$134,436 / year (Scale Tier)", roofSavings.includes('134,436'));
  testAssert("Whale Roofing Mini Math shows ($150k leak - $15.6k VantorX)", roofMiniMath.includes('150k') && roofMiniMath.includes('15.6k'));
  testAssert("Whale Roofing ROI displays ~9.6x ROI", roofRoi.includes('9.6x'));
  testAssert("Whale Roofing Equation displays $150,000 - $15,564 = +$134,436", roofEquation.includes('150,000') && roofEquation.includes('134,436'));
  testAssert("Whale Roofing Spoken Script dynamically adapts to Roofing and $134,436", roofScript.includes('Roofing') && roofScript.includes('134,436'));

  // Test 3: Strategy Toggle to Standalone Fallback (Ava Voice AI $397/mo = $4,764/yr)
  const btnToggle = document.getElementById('btnToggleScriptStrategy');
  if (btnToggle) {
    btnToggle.click();
    const fbSavings = document.getElementById('activeLeadSavings')?.textContent || '';
    const fbCost = document.getElementById('mathCardVantorxCost')?.textContent || '';
    const fbRoi = document.getElementById('activeLeadRoiPill')?.textContent || '';
    const fbScript = document.getElementById('activeLeadMathScriptText')?.textContent || '';

    testAssert("Fallback Toggle recalculates VantorX cost to -$4,764 / yr ($397/mo)", fbCost.includes('4,764'));
    testAssert("Fallback Toggle recalculates Net Savings to +$145,236 / yr", fbSavings.includes('145,236'));
    testAssert("Fallback Toggle recalculates ROI to ~31.5x ROI", fbRoi.includes('31.5x'));
    testAssert("Fallback Toggle updates verbatim script to quote $397 a month", fbScript.includes('$397 a month'));

    // Toggle back to Scale package
    btnToggle.click();
    const backSavings = document.getElementById('activeLeadSavings')?.textContent || '';
    testAssert("Toggling back restores Scale Net Savings ($134,436)", backSavings.includes('134,436'));
  } else {
    testAssert("btnToggleScriptStrategy exists", false);
  }

  // Test 4: In-Script Prompter Math Cue
  const prompterCue = document.querySelector('#scriptPanel_scale .dyn-script-savings-math') || document.querySelector('.dyn-script-savings-math');
  testAssert("Prompter panel dyn-script-savings-math contains updated talk track", !!prompterCue && prompterCue.textContent.includes('134,436'));

  // Test 5: Table Net Saved column rendering
  const tableSaveCells = document.querySelectorAll('#leadTableBody .badge-save');
  testAssert("Leads table contains Net Saved badges", tableSaveCells.length > 0);

  const firstSub = document.querySelector('#leadTableBody td div[title*="Math formula"]');
  testAssert("Leads table row displays math subtitle formula ($102k - $8.3k)", !!firstSub && firstSub.textContent.includes('k - $8.3k'));

} catch(err) {
  testAssert("Exception in DOM savings math test: " + err.message, false);
}

document.body.setAttribute('data-test-done', 'true');
document.body.setAttribute('data-test-summary', JSON.stringify(window.__testResults));
</script>
'@

$harnessHtml = $arenaHtml.Replace("</body>", $testJs + "</body>")
$harnessPath = Join-Path $PSScriptRoot "test_savings_math_harness.html"
[System.IO.File]::WriteAllText($harnessPath, $harnessHtml, (New-Object System.Text.UTF8Encoding($true)))
$harnessUri = "file:///" + $harnessPath.Replace("\", "/")

Write-Host "Running Headless Edge to verify live DOM calculations..."
$domOutput = & $edgeExe --headless=new --disable-gpu --virtual-time-budget=4000 --dump-dom $harnessUri | Out-String
Remove-Item $harnessPath -Force -ErrorAction SilentlyContinue

if ($domOutput -match 'data-test-summary="([^"]+)"') {
    $encoded = $matches[1].Replace("&quot;", '"')
    $browserTests = $encoded | ConvertFrom-Json
    foreach ($bt in $browserTests) {
        Assert-True $bt.name $bt.pass
    }
} else {
    Assert-True "Headless browser executed Savings Math test harness" $false
}

$failedCount = ($tests | Where-Object { -not $_.Pass }).Count
$passCount = ($tests | Where-Object { $_.Pass }).Count
$totalCount = $tests.Count

$resultColor = if ($failedCount -eq 0) { 'Green' } else { 'Red' }
Write-Host "`nResult: $passCount/$totalCount Tests Passed" -ForegroundColor $resultColor
if ($failedCount -eq 0) {
    Write-Host "ALL SAVINGS MATH & PROSPECT TALK TRACK TESTS PASSED (100%)!" -ForegroundColor Green
} else {
    throw "$failedCount test(s) failed."
}
