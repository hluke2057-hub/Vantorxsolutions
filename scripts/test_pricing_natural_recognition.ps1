$content = [System.IO.File]::ReadAllText((Join-Path $PSScriptRoot "..\website\cold-call-quest\index.html"), [System.Text.Encoding]::UTF8)

$testScript = @'
<script>
(function() {
  const tests = [];
  function assert(name, condition) {
    tests.push({ name, pass: !!condition });
  }

  try {
    const inputs = [
      "It's three ninety-seven a month plus four ninety-seven setup with zero contracts",
      "It starts at 397 flat per month",
      "It's 400 bucks a month",
      "It pays for itself with just one emergency service call, it's 397 a month",
      "It's a fraction of what an answering service charges at 397 a month",
      "We charge 397/mo flat rate",
      "The monthly rate is going to be 397 just for the ai receptionist and we also have packages",
      "three hundred and ninety seven dollars a month"
    ];

    inputs.forEach(input => {
      const mem = { lastBossQuestion: 'how_much_does_it_cost', topicsCovered: {} };
      const analysis = analyzeSpeech(input, mem, { key: 'price' });
      assert("Analysis recognizes: " + input, analysis.hasPricingAnswer === true && analysis.isDodgingQuestion === false);

      matchMemory.lastBossQuestion = 'how_much_does_it_cost';
      matchMemory.dodgedCount = 1;
      matchMemory.lastDodgedQuestion = 'how_much_does_it_cost';
      const res = evaluateTurn(input);
      assert("evaluateTurn does not flag fatal dodge on: " + input, res.isHangup === false && res.grade !== 'F');
    });

    // Test consecutive dodge tracking
    const memDodge = { lastBossQuestion: 'how_much_does_it_cost', topicsCovered: {}, dodgedCount: 0 };
    // Turn 1 dodge:
    const dodge1 = analyzeSpeech("Can we meet tomorrow at 4:30?", memDodge, { key: 'price' });
    assert("Dodge 1 is flagged as dodging price", dodge1.isDodgingQuestion === true);

    const passed = tests.filter(t => t.pass).length;
    const total = tests.length;
    const outDiv = document.createElement('div');
    outDiv.id = 'pricingTestOutput';
    outDiv.setAttribute('data-passed', passed);
    outDiv.setAttribute('data-total', total);
    outDiv.innerHTML = tests.map(t => '<div class="test-item">[' + (t.pass ? 'PASS' : 'FAIL') + '] ' + t.name + '</div>').join('\n');
    document.body.appendChild(outDiv);
  } catch(err) {
    const outDiv = document.createElement('div');
    outDiv.id = 'pricingTestOutput';
    outDiv.setAttribute('data-err', err.message || '' + err);
    document.body.appendChild(outDiv);
  }
})();
</script>
'@

$injected = $content.Replace("</body>", "$testScript`n</body>")
$tmpFile = Join-Path $PSScriptRoot "..\website\cold-call-quest\test_runner_pricing.html"
$utf8Bom = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllText($tmpFile, $injected, $utf8Bom)

$edgeExe = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgeExe)) {
    $edgeExe = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$fileUri = "file:///" + $tmpFile.Replace('\', '/')
$domOutput = & $edgeExe --headless=new --disable-gpu --dump-dom $fileUri | Out-String

Remove-Item $tmpFile -ErrorAction SilentlyContinue

Write-Host "=========================================================="
Write-Host "AUTOMATED NATURAL PRICING & ZERO-DODGE TEST RESULTS"
Write-Host "=========================================================="
if ($domOutput -match '<div id="pricingTestOutput" data-passed="(\d+)" data-total="(\d+)">([\s\S]*?)</div>') {
    $passed = $matches[1]
    $total = $matches[2]
    $body = $matches[3]
    Write-Host "  PRICING_TESTS_RESULT: $passed/$total PASSED"
    
    $body | Select-String -Pattern '\[(PASS|FAIL)\] [^<]+' -AllMatches | ForEach-Object {
        $_.Matches | ForEach-Object { Write-Host "    $($_.Value)" }
    }
    
    if ($passed -eq $total) {
        Write-Host "`n100% OF NATURAL PRICING & DODGE PREVENTION TESTS PASSED!`n" -ForegroundColor Green
        exit 0
    } else {
        Write-Host "`nSOME PRICING TESTS FAILED!`n" -ForegroundColor Red
        exit 1
    }
} elseif ($domOutput -match '<div id="pricingTestOutput" data-err="([^"]+)">') {
    Write-Host "Test Runner Exception in Headless DOM: $($matches[1])" -ForegroundColor Red
    exit 1
} else {
    Write-Host "Could not find test output in DOM" -ForegroundColor Red
    exit 1
}
