# scripts/test_dave_opener_and_fullscreen_briefing.ps1
$ErrorActionPreference = "Stop"

$edgeExe = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgeExe)) { $edgeExe = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }
$htmlPath = (Resolve-Path "website/cold-call-quest/index.html").Path

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "AUDIT: DAVE OPENER & FULLSCREEN DUNGEON BRIEFING GATE" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$testHarness = @'
<script>
window.__daveAuditResults = [];
function dAssert(name, cond) { window.__daveAuditResults.push({ name: name, pass: !!cond }); }

try {
  // Test 1: Fullscreen Modal Styling Audit
  const modal = document.getElementById('dungeonBriefingModal');
  const card = modal.querySelector('.dungeon-briefing-card');
  const btn = document.getElementById('btnEnterDungeon');

  dAssert("dungeonBriefingModal exists in DOM", !!modal);
  dAssert("dungeon-briefing-card exists inside modal", !!card);
  dAssert("btnEnterDungeon exists in modal sticky footer", !!btn);

  // Check computed styling of the overlay
  const comp = window.getComputedStyle(modal);
  dAssert("Overlay has fixed positioning", comp.position === 'fixed');
  dAssert("Overlay has high z-index (999999)", parseInt(comp.zIndex, 10) >= 99990);
  dAssert("Overlay has backdrop-filter blur", comp.backdropFilter.includes('blur') || comp.webkitBackdropFilter.includes('blur'));

  // Test 2: Select Dave "The Budget Dragon" (Boss Index 3)
  selectBoss(3);
  
  // Verify that selecting Dave opens the briefing modal immediately
  dAssert("Modal opens automatically when selecting Dave", modal.classList.contains('open'));

  // Verify Dave's opener in the combat log
  const logEntries = Array.from(document.querySelectorAll('#combatLog .log-boss'));
  const daveOpener = logEntries.length > 0 ? logEntries[0].textContent : '';

  dAssert("Dave's initial opener does NOT mention '$3,000'", !daveOpener.includes('3,000') && !daveOpener.includes('3000'));
  dAssert("Dave's initial opener does NOT mention 'marketing clown'", !/marketing clown/i.test(daveOpener));
  dAssert("Dave's initial opener does NOT say 'how fancy it is'", !/how fancy/i.test(daveOpener));
  dAssert("Dave's initial opener asks what this is regarding", /regarding|supply invoices|what's this/i.test(daveOpener));

  // Verify Briefing Screen details for Dave
  const bossName = document.getElementById('briefingBossName').textContent;
  const hpVal = document.getElementById('briefingHpVal').textContent;
  const priceVal = document.getElementById('briefingPriceVal').textContent;
  const weakEl = document.getElementById('briefingWeaknesses').textContent;
  const prodTitle = document.getElementById('briefingProductTitle').textContent;

  dAssert("Briefing displays Dave 'The Budget Dragon'", bossName.includes('Budget Dragon'));
  dAssert("Briefing displays 280 HP", hpVal.includes('280 HP'));
  dAssert("Briefing displays $397/mo + $497 setup", priceVal.includes('397') && priceVal.includes('497'));
  dAssert("Briefing displays Ava 24/7 Voice AI offer", prodTitle.includes('Ava'));
  dAssert("Briefing weaknesses explicitly warn about $3,000 marketing clown trap", weakEl.includes('3,000') || weakEl.includes('marketing clown'));

  // Test 3: Clicking 'Enter the Dungeon' closes the modal and focuses input
  window.enterDungeonAndStartCall();
  dAssert("Clicking Enter Dungeon closes modal", !modal.classList.contains('open'));
  dAssert("Input is active and focused", !document.getElementById('playerCustomInput').disabled);

  // Test 4: Turn 1 Pitch to Dave produces the marketing clown budget objection
  document.getElementById('playerCustomInput').value = "We have a 24/7 AI that answers the phone in 1 ring so you never miss an emergency repipe.";
  const resTurn1 = submitRebuttal();
  const daveTurn1Reply = resTurn1 ? resTurn1.contractorReply : '';

  dAssert("Dave Turn 1 reply reacts to pitch with price/cost inquiry", /cost|monthly|dollar|how much|bleed/i.test(daveTurn1Reply));

  // Test 5: Re-opening modal via HUD button works seamlessly
  window.openDungeonBriefingModal();
  dAssert("HUD Boss Intel button re-opens briefing modal", modal.classList.contains('open'));
  const resumeBtn = document.getElementById('btnEnterDungeon');
  dAssert("Button changes to 'RESUME BATTLE' during active combat", resumeBtn.textContent.includes('RESUME BATTLE'));
  window.closeDungeonBriefingModal();
  dAssert("Closing modal returns to active battle", !modal.classList.contains('open'));

} catch(err) {
  dAssert("Simulation error: " + err.message, false);
}

document.body.setAttribute('data-dave-audit-results', JSON.stringify(window.__daveAuditResults));
</script>
'@

$harnessFile = Join-Path (Get-Location) 'scripts/temp_dave_harness.html'
$html = Get-Content $htmlPath -Raw -Encoding UTF8
$html = $html.Replace('</body>', $testHarness + '</body>')
[System.IO.File]::WriteAllText($harnessFile, $html, [System.Text.Encoding]::UTF8)

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $edgeExe
$psi.Arguments = "--headless --disable-gpu --dump-dom `"$harnessFile`""
$psi.RedirectStandardOutput = $true
$psi.UseShellExecute = $false
$proc = [System.Diagnostics.Process]::Start($psi)
$dom = $proc.StandardOutput.ReadToEnd()
$proc.WaitForExit()

Remove-Item $harnessFile -Force

$pattern = 'data-dave-audit-results="([^"]+)"'
if ($dom -match $pattern) {
    $rawJson = [System.Net.WebUtility]::HtmlDecode($matches[1])
    $results = ConvertFrom-Json $rawJson
    $passCount = 0
    foreach ($r in $results) {
        if ($r.pass) {
            Write-Host "  [PASS] $($r.name)" -ForegroundColor Green
            $passCount++
        } else {
            Write-Host "  [FAIL] $($r.name)" -ForegroundColor Red
        }
    }
    Write-Host "`nResult: $passCount/$($results.Length) Tests Passed" -ForegroundColor Cyan
    if ($passCount -ne $results.Length) { exit 1 }
} else {
    Write-Error "Could not extract data-dave-audit-results from DOM"
    exit 1
}
