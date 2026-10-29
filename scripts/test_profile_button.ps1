$htmlSource = Join-Path (Get-Location) 'website\cold-call-arena\index.html'
$content = [System.IO.File]::ReadAllText($htmlSource, [System.Text.Encoding]::UTF8)

$testScript = @'
<script>
window.addEventListener('DOMContentLoaded', () => {
  const tests = [];
  function assert(name, condition) {
    tests.push({ name, pass: !!condition });
  }

  try {
    // 1. Ensure modal is closed initially
    const modal = document.getElementById('accountModal');
    assert("accountModal exists in DOM", !!modal);
    assert("accountModal is closed initially", !modal.classList.contains('active'));

    // 2. Click user profile button in header
    const profileBtn = document.getElementById('userProfileBtn');
    assert("userProfileBtn exists in DOM", !!profileBtn);
    profileBtn.click();
    assert("accountModal has active class after clicking userProfileBtn", modal.classList.contains('active'));

    // 3. Close modal
    const closeBtn = document.getElementById('closeAccountModalBtn');
    assert("closeAccountModalBtn exists", !!closeBtn);
    closeBtn.click();
    assert("accountModal is closed after closeAccountModalBtn", !modal.classList.contains('active'));

    // 4. Click caller account action button in caller bar
    const callerBtn = document.getElementById('btnCallerAccountAction');
    assert("btnCallerAccountAction exists", !!callerBtn);
    callerBtn.click();
    assert("accountModal has active class after clicking btnCallerAccountAction", modal.classList.contains('active'));

    // 5. Test Carter McCauliss profile in default profiles
    const profiles = JSON.parse(localStorage.getItem('vantorx_user_profiles_v2') || '{}');
    const hasCarter = !!profiles['carter_mccauliss'];
    assert("Carter McCauliss exists in profiles", hasCarter);
    if (hasCarter) {
      assert("Carter is Level 5", profiles['carter_mccauliss'].level === 5);
      assert("Carter has 8 bosses defeated", profiles['carter_mccauliss'].bossesDefeated === 8);
      assert("Carter has autoPassed set to true", profiles['carter_mccauliss'].autoPassed === true);
    }

    const passed = tests.filter(t => t.pass).length;
    const total = tests.length;
    document.body.innerHTML = '<div id="profileTestResult" data-passed="' + passed + '" data-total="' + total + '">' +
      tests.map(t => '<div>[' + (t.pass ? 'PASS' : 'FAIL') + '] ' + t.name + '</div>').join('') +
      '</div>';
  } catch(e) {
    document.body.innerHTML = '<div id="profileTestResult" data-err="' + e.message + '"></div>';
  }
});
</script>
'@

$tempFile = Join-Path (Get-Location) 'scripts\temp_profile_test.html'
$newContent = $content.Replace('</body>', "$testScript`n</body>")
[System.IO.File]::WriteAllText($tempFile, $newContent, [System.Text.Encoding]::UTF8)

$edgePath = (Get-Item 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe').FullName
$dumpFile = Join-Path (Get-Location) 'scripts\temp_profile_dump.txt'
$p = Start-Process -FilePath $edgePath -ArgumentList @('--headless', '--disable-gpu', '--dump-dom', (Resolve-Path $tempFile).Path) -PassThru -NoNewWindow -RedirectStandardOutput $dumpFile
$p.WaitForExit(7000)
Start-Sleep -Milliseconds 600
$res = [System.IO.File]::ReadAllText($dumpFile, [System.Text.Encoding]::UTF8)
Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
Remove-Item $dumpFile -Force -ErrorAction SilentlyContinue

Write-Host "=========================================================="
Write-Host "AUTOMATED COLD CALL ARENA PROFILE BUTTON & CARTER TEST"
Write-Host "=========================================================="

if ($res -match '<div id="profileTestResult" data-passed="(\d+)" data-total="(\d+)">([\s\S]*?)</div>') {
  $passed = $matches[1]
  $total = $matches[2]
  $body = $matches[3]
  Write-Host "Result: $passed/$total Tests Passed" -ForegroundColor Cyan
  $body | Select-String -Pattern '\[(PASS|FAIL)\] [^<]+' -AllMatches | ForEach-Object {
    $_.Matches | ForEach-Object {
      if ($_.Value -match 'PASS') {
        Write-Host "  $($_.Value)" -ForegroundColor Green
      } else {
        Write-Host "  $($_.Value)" -ForegroundColor Red
      }
    }
  }
  if ($passed -eq $total) {
    Write-Host "`nALL PROFILE BUTTON & CARTER PASS TESTS PASSED!`n" -ForegroundColor Green
    exit 0
  } else {
    exit 1
  }
} elseif ($res -match '<div id="profileTestResult" data-err="([^"]+)">') {
  Write-Host "Error: $($matches[1])" -ForegroundColor Red
  exit 1
} else {
  Write-Host "Failed to find test results" -ForegroundColor Red
  exit 1
}
