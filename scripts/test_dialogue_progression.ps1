# scripts/test_dialogue_progression.ps1
$ErrorActionPreference = "Stop"

$htmlPath = Join-Path $PSScriptRoot "..\website\cold-call-quest\index.html"
$content = [System.IO.File]::ReadAllText((Resolve-Path $htmlPath).Path, [System.Text.Encoding]::UTF8)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "AUTOMATED DIALOGUE PROGRESSION & PRODUCT MENTION AUDIT" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$tests = @()

function Assert-Check($name, $condition) {
    $script:tests += [PSCustomObject]@{ Name = $name; Pass = [bool]$condition }
    if ($condition) {
        Write-Host "  [PASS] $name" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] $name" -ForegroundColor Red
    }
}

# 1. Static pattern checks: verify the response arrays for early turns do NOT contain Ava or LeadFlow
Assert-Check "Email pivot success array does NOT mention Ava" (-not ($content -match "\[[^\]]*?\bAva\b[^\]]*?\]\s*,\s*'email_pivot_success'"))
Assert-Check "gatekeeper crm ack array does NOT mention Ava" (-not ($content -match "\[[^\]]*?\bAva\b[^\]]*?\]\s*,\s*'gk_crm_ack'"))
Assert-Check "gatekeeper crm ack array does NOT mention LeadFlow" (-not ($content -match "\[[^\]]*?\bLeadFlow\b[^\]]*?\]\s*,\s*'gk_crm_ack'"))
Assert-Check "contractor crm ack array does NOT mention LeadFlow" (-not ($content -match "\[[^\]]*?\bLeadFlow\b[^\]]*?\]\s*,\s*'contractor_crm_ack'"))
Assert-Check "Dave (price_pain_ack) array does NOT mention Ava" (-not ($content -match "\[[^\]]*?\bAva\b[^\]]*?\]\s*,\s*'price_pain_ack'"))
Assert-Check "Brad (brad_pain_ack) array does NOT mention Ava" (-not ($content -match "\[[^\]]*?\bAva\b[^\]]*?\]\s*,\s*'brad_pain_ack'"))
Assert-Check "Rex (rex_pain_ack) array does NOT mention Ava" (-not ($content -match "\[[^\]]*?\bAva\b[^\]]*?\]\s*,\s*'rex_pain_ack'"))
Assert-Check "Mitch (mitch_pain_ack) array does NOT mention LeadFlow" (-not ($content -match "\[[^\]]*?\bLeadFlow\b[^\]]*?\]\s*,\s*'mitch_pain_ack'"))
Assert-Check "Wayne (wayne_explain_demand) array does NOT mention LeadFlow" (-not ($content -match "\[[^\]]*?\bLeadFlow\b[^\]]*?\]\s*,\s*'wayne_explain_demand'"))
Assert-Check "Victor (victor_explain_demand) array does NOT mention Ava" (-not ($content -match "\[[^\]]*?\bAva\b[^\]]*?\]\s*,\s*'victor_explain_demand'"))
Assert-Check "Turn 1 off-topic fallback array does NOT mention Ava" (-not ($content -match "\[[^\]]*?\bAva\b[^\]]*?\]\s*,\s*'general_trade_context'"))
Assert-Check "Brad Angi branch array does NOT mention Ava prematurely" (-not ($content -match "\[[^\]]*?\bAva\b[^\]]*?\]\s*,\s*'brad_angi_reaction'"))
Assert-Check "Gary yellow pad branch array does NOT mention Ava prematurely" (-not ($content -match "\[[^\]]*?\bAva\b[^\]]*?\]\s*,\s*'gary_pad_reaction'"))
Assert-Check "Prompt price array does NOT mention Ava" (-not ($content -match "\[[^\]]*?\bAva\b[^\]]*?\]\s*,\s*'prompt_price'"))
Assert-Check "Dodge explain leadflow array does NOT mention LeadFlow" (-not ($content -match "\[[^\]]*?\bLeadFlow\b[^\]]*?\]\s*,\s*'dodge_explain_leadflow'"))
Assert-Check "Dodge explain ava array does NOT mention Ava" (-not ($content -match "\[[^\]]*?\bAva\b[^\]]*?\]\s*,\s*'dodge_explain_ava'"))
Assert-Check "Dodge demo warning array does NOT mention Ava" (-not ($content -match "\[[^\]]*?\bAva\b[^\]]*?\]\s*,\s*'dodge_demo_warning'"))

# 2. Dynamic Headless Browser Simulation: Test all 12 bosses on Turn 1 & Turn 2
$testScript = @'
<div id="testOutput"></div>
<script>
(function() {
  const dynamicTests = [];
  function assertD(name, cond) {
    dynamicTests.push({ name: name, pass: !!cond });
    console.log((cond ? '[PASS] ' : '[FAIL] ') + name);
  }

  function getLastBossReply() {
    const entries = document.querySelectorAll('#combatLog .log-boss');
    return entries.length > 0 ? entries[entries.length - 1].textContent : '';
  }

  try {
    const inputEl = document.getElementById('playerCustomInput');

    BOSSES.forEach((b, idx) => {
      selectBoss(idx);
      
      // Turn 1: Standard permission opener
      inputEl.value = "Hey, you got 20 seconds before you hang up?";
      submitRebuttal();
      const lastReply1 = getLastBossReply();
      assertD(`Boss ${b.name} Turn 1 does not mention Ava`, !/\bAva\b/i.test(lastReply1));
      assertD(`Boss ${b.name} Turn 1 does not mention LeadFlow`, !/\bLeadFlow\b/i.test(lastReply1));

      // Turn 2: Standard revenue leak hook (without mentioning product yet!)
      inputEl.value = "Where do your emergency calls go when your guys are working on a job site?";
      submitRebuttal();
      const lastReply2 = getLastBossReply();
      assertD(`Boss ${b.name} Turn 2 does not mention Ava before introduced`, !/\bAva\b/i.test(lastReply2));
      assertD(`Boss ${b.name} Turn 2 does not mention LeadFlow before introduced`, !/\bLeadFlow\b/i.test(lastReply2));
    });

    // Special test: Turn 1 off-topic greeting should not mention Ava
    selectBoss(0);
    inputEl.value = "Hey man, beautiful weather today in Tampa!";
    submitRebuttal();
    const offTopicReply = getLastBossReply();
    assertD("Turn 1 off-topic does not mention Ava", !/\bAva\b/i.test(offTopicReply));

    // Special test: Brad Angi lead mention on Turn 1 does not bring up Ava
    selectBoss(4); // Brad
    inputEl.value = "Hey Brad, are you buying shared leads on Angi?";
    submitRebuttal();
    const bradReply = getLastBossReply();
    assertD("Brad Angi reply does not mention Ava prematurely", !/\bAva\b/i.test(bradReply));

  } catch(e) {
    assertD("Dynamic test error: " + e.message, false);
  }

  const passed = dynamicTests.filter(t => t.pass).length;
  const out = document.getElementById('testOutput');
  if (out) {
    out.innerHTML = `<h3>TESTS_RESULT: ${passed}/${dynamicTests.length} PASSED</h3>` +
      dynamicTests.map(t => `<div class="test-item" data-pass="${t.pass}">${t.pass ? 'PASS' : 'FAIL'}: ${t.name}</div>`).join('');
  }
})();
</script>
'@

$tempHtml = Join-Path $PSScriptRoot "test_dialogue_harness.html"
$injectedContent = $content.Replace("</body>", "$testScript`n</body>")
[System.IO.File]::WriteAllText($tempHtml, $injectedContent, (New-Object System.Text.UTF8Encoding($true)))

try {
    $edgeExe = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    if (-not (Test-Path $edgeExe)) {
        $edgeExe = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    }

    $uri = "file:///" + ($tempHtml.Replace("\", "/"))
    $domOutput = & $edgeExe --headless=new --disable-gpu --dump-dom $uri | Out-String

    if ($domOutput -match '<h3>TESTS_RESULT: (\d+)/(\d+) PASSED</h3>') {
        $dynPassed = [int]$matches[1]
        $dynTotal = [int]$matches[2]
        
        $regex = [regex]'<div class="test-item" data-pass="(true|false)">(PASS|FAIL): ([^<]+)</div>'
        $allMatches = $regex.Matches($domOutput)
        foreach ($m in $allMatches) {
            $status = $m.Groups[2].Value
            $name = $m.Groups[3].Value
            Assert-Check $name ($status -eq "PASS")
        }
        Assert-Check "Dynamic simulation completed 100% ($dynPassed/$dynTotal)" ($dynPassed -eq $dynTotal -and $dynTotal -gt 0)
    } else {
        Assert-Check "Failed to capture DOM simulation output" $false
    }
} finally {
    if (Test-Path $tempHtml) {
        Remove-Item -Force $tempHtml
    }
}

$allPassed = ($script:tests | Where-Object { -not $_.Pass }).Count -eq 0
$totalPassed = ($script:tests | Where-Object { $_.Pass }).Count
$totalTests = $script:tests.Count

Write-Host ""
Write-Host "Result: $totalPassed/$totalTests Tests Passed" -ForegroundColor Yellow
if ($allPassed) {
    Write-Host "ALL DIALOGUE PROGRESSION & NATURAL PACING CHECKS PASSED!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "SOME TESTS FAILED!" -ForegroundColor Red
    exit 1
}
