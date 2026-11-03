# scripts/test_website_demo_and_employee_leads.ps1
# Automated test suite for the clean website demo and employee-centric small local business lead targeting.

$ErrorActionPreference = "Stop"

$passed = 0
$failed = 0

function Assert-Condition($msg, $cond) {
    if ($cond) {
        Write-Host "  [PASS] $msg" -ForegroundColor Green
        $script:passed++
    } else {
        Write-Host "  [FAIL] $msg" -ForegroundColor Red
        $script:failed++
    }
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "TEST SUITE: WEBSITE DEMO & SMALL BIZ LEAD TARGETING" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Check Demo Page Files
$demoPath = Join-Path $PSScriptRoot "../website/demo/index.html"
Assert-Condition "website/demo/index.html exists" (Test-Path $demoPath)

$demoHtml = [System.IO.File]::ReadAllText($demoPath, [System.Text.Encoding]::UTF8)
Assert-Condition "Demo has Mobile/Desktop/Tablet device toggles" ($demoHtml.Contains("btnDeviceMobile") -and $demoHtml.Contains("btnDeviceDesktop"))
Assert-Condition "Demo has Sample Trade toggles (HVAC, Plumbing, Roofing, Electrical)" ($demoHtml.Contains("btnTradeHvac") -and $demoHtml.Contains("btnTradePlumbing"))
Assert-Condition "Demo has Ava Voice AI scenarios" ($demoHtml.Contains("setAvaScenario") -and $demoHtml.Contains("audioWaveform"))
Assert-Condition "Demo has Speed-to-Lead SMS conversation" ($demoHtml.Contains("smsThread") -and $demoHtml.Contains("45s"))
Assert-Condition "Demo has Small Local Business ROI calculator" ($demoHtml.Contains("sliderTeamSize") -and $demoHtml.Contains("calcNetSaved"))

# 2. Check Homepage Navigation Links
$homePath = Join-Path $PSScriptRoot "../website/index.html"
$homeHtml = [System.IO.File]::ReadAllText($homePath, [System.Text.Encoding]::UTF8)
Assert-Condition "Homepage navbar contains Live Demo link to /demo/" ($homeHtml -match 'href="/demo/".*?Live Demo')
Assert-Condition "Homepage hero contains Interactive Demo CTA" ($homeHtml -match 'href="/demo/".*?Interactive Demo Showcase')

# 3. Check Lead Datasets Enrichment
$normJsonPath = Join-Path $PSScriptRoot "../data/normalized_lead_targets.json"
$leads = Get-Content -Path $normJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
Assert-Condition "normalized_lead_targets.json has 750 leads" ($leads.Count -eq 750)

$hasEmployeesCount = ($leads | Where-Object { $_.employees -gt 0 }).Count
Assert-Condition "All 750 leads have valid employee counts" ($hasEmployeesCount -eq 750)

$smallBizCount = ($leads | Where-Object { $_.isSmallLocalBiz -eq $true }).Count
Assert-Condition "Majority (500+) are small local businesses (1-10 staff)" ($smallBizCount -ge 500)

$sweetSpotCount = ($leads | Where-Object { $_.employeeTier -eq 'sweetSpot' }).Count
Assert-Condition "Significant share (300+) in the 1-5 staff sweet spot" ($sweetSpotCount -ge 300)

$hasPitchAngleCount = ($leads | Where-Object { [string]::IsNullOrWhiteSpace($_.smallBizPitchAngle) -eq $false }).Count
Assert-Condition "All 750 leads have smallBizPitchAngle" ($hasPitchAngleCount -eq 750)

# 4. Check Arena Markup
$arenaPath = Join-Path $PSScriptRoot "../website/cold-call-arena/index.html"
$arenaHtml = [System.IO.File]::ReadAllText($arenaPath, [System.Text.Encoding]::UTF8)
Assert-Condition "Arena table header contains 'Team / Employees'" ($arenaHtml.Contains("<th>Team / Employees</th>"))
Assert-Condition "Arena contains Team Size filter pills (leadEmpFilterPills)" ($arenaHtml.Contains('id="leadEmpFilterPills"'))
Assert-Condition "Arena contains leadSortSelect dropdown" ($arenaHtml.Contains('id="leadSortSelect"'))
Assert-Condition "Arena contains Small Local Business Focus KPI card" ($arenaHtml.Contains('id="kpiSmallBizFocus"'))
Assert-Condition "Arena teleprompter has activeLeadEmpVal" ($arenaHtml.Contains('id="activeLeadEmpVal"'))
Assert-Condition "Arena teleprompter has activeLeadSmallBizCard" ($arenaHtml.Contains('id="activeLeadSmallBizCard"'))

# 5. Headless Edge DOM Verification
Write-Host "`nRunning Headless Edge DOM Verification for Arena & Demo..." -ForegroundColor Yellow
$arenaResolved = Resolve-Path $arenaPath
$arenaUri = [System.Uri]($arenaResolved.ProviderPath)
$demoResolved = Resolve-Path $demoPath
$demoUri = [System.Uri]($demoResolved.ProviderPath)

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$domScript = @"
<!DOCTYPE html>
<html>
<head><title>Test Runner</title></head>
<body>
<div id="results"></div>
<script>
async function run() {
  const res = [];
  const assert = (name, ok) => res.push({ name, ok });

  try {
    // 1. Test Demo Page
    const fDemo = document.createElement('iframe');
    fDemo.src = '$demoUri';
    fDemo.style.width = '1200px';
    fDemo.style.height = '800px';
    document.body.appendChild(fDemo);

    await new Promise(r => fDemo.onload = r);
    const dDoc = fDemo.contentDocument;

    assert('Demo: Title exists', dDoc.title.includes('Live Interactive Demo'));
    assert('Demo: Device frame exists', !!dDoc.getElementById('mockDeviceFrame'));

    // Test device switcher
    dDoc.getElementById('btnDeviceDesktop').click();
    assert('Demo: Desktop mode activated', dDoc.getElementById('mockDeviceFrame').classList.contains('desktop-mode'));

    // Test trade switcher
    dDoc.getElementById('btnTradePlumbing').click();
    assert('Demo: Switched to Plumbing', dDoc.getElementById('simHeroHeading').textContent.includes('Plumbing'));

    // Test ROI calculator
    const tSlider = dDoc.getElementById('sliderTeamSize');
    tSlider.value = 5;
    tSlider.dispatchEvent(new Event('input', { bubbles: true }));
    assert('Demo: Team size updated to 5', dDoc.getElementById('valTeamSize').textContent.includes('5 Employees'));

    // 2. Test Arena Page
    const fArena = document.createElement('iframe');
    fArena.src = '$arenaUri';
    fArena.style.width = '1200px';
    fArena.style.height = '800px';
    document.body.appendChild(fArena);

    await new Promise(r => fArena.onload = r);
    const aDoc = fArena.contentDocument;

    // Login Carter or founder
    const btnCarter = aDoc.getElementById('btnArenaLoginCarter');
    if (btnCarter) btnCarter.click();

    // Verify Team/Employees cells exist
    const rows = aDoc.querySelectorAll('#leadTableBody tr');
    assert('Arena: Rows rendered in table', rows.length > 0);

    const firstRowText = rows[0].innerHTML;
    assert('Arena: First row has employee count', firstRowText.includes('Staff') && firstRowText.includes('badge-emp'));

    // Test Filter: Sweet Spot 1-5 Staff
    const btnSweet = aDoc.querySelector('[data-emp-filter="sweetSpot"]');
    btnSweet.click();

    const filteredRows = aDoc.querySelectorAll('#leadTableBody tr');
    assert('Arena: Sweet spot filtered rows rendered', filteredRows.length > 0);
    const hasOnlySmall = Array.from(filteredRows).every(r => r.innerHTML.includes('1-5 Staff') || r.innerHTML.includes('badge-emp-sweetSpot'));
    assert('Arena: All filtered rows belong to sweet spot (1-5 staff)', hasOnlySmall);

    // Test Teleprompter load
    const firstPitchBtn = filteredRows[0].querySelector('.btn-pitch-lead');
    firstPitchBtn.click();

    const empVal = aDoc.getElementById('activeLeadEmpVal').textContent;
    assert('Arena: Teleprompter displays team size badge', empVal.includes('Staff'));

    const smallBizText = aDoc.getElementById('activeLeadSmallBizText').textContent;
    assert('Arena: Teleprompter displays small business battle hook', smallBizText.length > 20);

  } catch(err) {
    assert('Execution error: ' + err.message, false);
  }

  document.getElementById('results').textContent = JSON.stringify(res);
  window.__done = true;
}
run();
</script>
</body>
</html>
"@

$runnerPath = Join-Path $PSScriptRoot "../test_runner_demo_leads.html"
[System.IO.File]::WriteAllText($runnerPath, $domScript, [System.Text.Encoding]::UTF8)

$runnerUri = [System.Uri](Resolve-Path $runnerPath).ProviderPath

$proc = Start-Process -FilePath $edgePath -ArgumentList @(
    "--headless=new",
    "--disable-gpu",
    "--allow-file-access-from-files",
    "--dump-dom",
    "$runnerUri"
) -PassThru -NoNewWindow -RedirectStandardOutput (Join-Path $PSScriptRoot "../edge_out_demo.txt")

$proc.WaitForExit(15000) | Out-Null
if (-not $proc.HasExited) { $proc.Kill() }

$edgeOutput = Get-Content (Join-Path $PSScriptRoot "../edge_out_demo.txt") -Raw
if ($edgeOutput -match '<div id="results">(.*?)</div>') {
    $json = $matches[1]
    if ($json.Trim().Length -gt 0) {
        $results = $json | ConvertFrom-Json
        foreach ($r in $results) {
            Assert-Condition $r.name $r.ok
        }
    } else {
        Assert-Condition "Edge returned DOM results" $false
    }
} else {
    Assert-Condition "Edge completed execution" $false
}

Remove-Item -Path $runnerPath -ErrorAction SilentlyContinue
Remove-Item -Path (Join-Path $PSScriptRoot "../edge_out_demo.txt") -ErrorAction SilentlyContinue

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "SUMMARY: $passed PASSED, $failed FAILED" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

if ($failed -gt 0) {
    exit 1
} else {
    exit 0
}
