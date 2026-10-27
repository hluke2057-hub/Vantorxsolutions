# scripts/test_briefing_and_close_fix.ps1
$ErrorActionPreference = "Stop"

$edgeExe = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgeExe)) { $edgeExe = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }
$htmlPath = (Resolve-Path "website/cold-call-quest/index.html").Path

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "COLD CALL QUEST: DUNGEON BRIEFING & CLOSE DIALOGUE AUDIT" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$testHarness = @'
<script>
window.__auditResults = [];
function aAssert(name, cond) { window.__auditResults.push({ name: name, pass: !!cond }); }

try {
  // Test 1: Dungeon Briefing Modal and HUD button exist
  const modal = document.getElementById('dungeonBriefingModal');
  const hudBtn = document.getElementById('hudBossIntelBtn');
  aAssert("dungeonBriefingModal exists in DOM", !!modal);
  aAssert("hudBossIntelBtn exists in Active Boss HUD", !!hudBtn);
  aAssert("openDungeonBriefingModal function is exposed globally", typeof window.openDungeonBriefingModal === 'function');
  aAssert("closeDungeonBriefingModal function is exposed globally", typeof window.closeDungeonBriefingModal === 'function');

  // Test 2: Briefing Modal population for Mike The Robot Crusher
  selectBoss(2); // Mike
  window.openDungeonBriefingModal(2);
  const bossName = document.getElementById('briefingBossName');
  const hpVal = document.getElementById('briefingHpVal');
  const prodTitle = document.getElementById('briefingProductTitle');
  const winCond = document.getElementById('briefingWinCondition');
  aAssert("Briefing modal displays Mike's name", bossName && bossName.textContent.includes('Robot Crusher'));
  aAssert("Briefing modal displays 250 HP", hpVal && hpVal.textContent.includes('250 HP'));
  aAssert("Briefing modal displays Ava 24/7 AI Phone Receptionist offer", prodTitle && prodTitle.textContent.includes('Ava'));
  aAssert("Briefing modal displays 10-minute walkthrough win condition", winCond && winCond.textContent.includes('10-minute'));
  window.closeDungeonBriefingModal();

  // Test 3: Rep pitching 'books appointments' is graded as MECHANISM and NOT time proposal close
  selectBoss(2); // Reset match memory
  const resPitch = evaluateTurn('we have a 24/7 ai that answers the phone and books appointments with out you having to lift a finger');
  aAssert("AI feature pitch is NOT falsely flagged as time proposal", !/DEFINITIVE CLOSE/i.test(resPitch.feedback));
  aAssert("AI feature pitch deals mechanism damage (Grade A/S)", resPitch.grade === 'A' || resPitch.grade === 'S');
  aAssert("Feedback recognizes mechanism delivery", resPitch.feedback.includes('MECHANISM DELIVERED'));
  aAssert("Mike asks about monthly cost rather than agreeing to a meeting", resPitch.contractorReply.includes('cost') || resPitch.contractorReply.includes('month'));
  aAssert("Stage transitions to price", matchMemory.stage === 'price');

  // Test 4: Pricing quote -> transitions to demo
  const resPrice = evaluateTurn('It is 397 a month flat with zero contracts and 497 setup.');
  aAssert("Direct pricing quote answers cost objection", resPrice.grade === 'S' || resPrice.grade === 'A');
  aAssert("Mike asks for demo or proof", resPrice.contractorReply.includes('test') || resPrice.contractorReply.includes('sound') || resPrice.contractorReply.includes('robot'));

  // Test 5: Live demo -> transitions to carrier
  const resDemo = evaluateTurn('Dial our Florida test line on (561) 813-8602 right now from your truck.');
  aAssert("Demo test line triggers live proof reaction", resDemo.grade === 'S');

  // Test 6: Carrier explanation -> transitions to walkthrough close
  const resCarrier = evaluateTurn('We hook it up via Carrier *71 conditional call forwarding so your company number stays with your provider.');
  aAssert("Carrier explanation handles line setup", resCarrier.contractorReply.includes('*71') || resCarrier.contractorReply.includes('Star-7-1') || resCarrier.contractorReply.includes('walkthrough') || resCarrier.contractorReply.includes('demo'));

  // Test 7: Genuine meeting proposal triggers Mike's specific victory dialogue
  const resClose = evaluateTurn('Are you free tomorrow at 4:30 PM for a quick 10-minute walkthrough?');
  aAssert("Genuine time close proposal recognizes time proposal", resClose.grade === 'S' && resClose.feedback.includes('DEFINITIVE CLOSE'));
  aAssert("Mike uses trade-specific victory dialogue (panel/813-8602)", resClose.contractorReply.includes('panel') || resClose.contractorReply.includes('813-8602') || resClose.contractorReply.includes('4:30 PM'));

} catch(err) {
  aAssert("Simulation error: " + err.message, false);
}

document.body.setAttribute('data-audit-results', JSON.stringify(window.__auditResults));
</script>
'@

$harnessFile = Join-Path (Get-Location) 'scripts/temp_audit_harness.html'
$html = Get-Content $htmlPath -Raw -Encoding UTF8
$html = $html.Replace('</body>', $testHarness + '</body>')
[System.IO.File]::WriteAllText($harnessFile, $html, [System.Text.Encoding]::UTF8)
$dom = & $edgeExe --headless=new --disable-gpu --virtual-time-budget=4000 --dump-dom ('file:///' + $harnessFile.Replace('\', '/')) | Out-String
Remove-Item $harnessFile -Force -ErrorAction SilentlyContinue

if ($dom -match 'data-audit-results="([^"]+)"') {
  $raw = $matches[1].Replace('&quot;', '"')
  $results = $raw | ConvertFrom-Json
  $passed = 0
  foreach ($r in $results) {
    if ($r.pass) {
      Write-Host "  [PASS] $($r.name)" -ForegroundColor Green
      $passed++
    } else {
      Write-Host "  [FAIL] $($r.name)" -ForegroundColor Red
    }
  }
  Write-Host ""
  Write-Host "Result: $passed/$($results.Count) Tests Passed" -ForegroundColor $(if ($passed -eq $results.Count) { "Green" } else { "Red" })
  if ($passed -ne $results.Count) { exit 1 }
} else {
  Write-Host "Failed to extract audit results from DOM" -ForegroundColor Red
  exit 1
}
