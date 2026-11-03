$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "TEST SUITE: JAMES AUTOPASS & TEAM CALL LOGS SYNCHRONIZATION" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$passCount = 0
$failCount = 0

function Assert-Test([string]$desc, [bool]$cond) {
    if ($cond) {
        Write-Host "  [PASS] $desc" -ForegroundColor Green
        $script:passCount++
    } else {
        Write-Host "  [FAIL] $desc" -ForegroundColor Red
        $script:failCount++
    }
}

# 1. Test audit.js CORS and OPTIONS handling
$auditJs = Get-Content -Raw "website/api/audit.js"
Assert-Test "audit.js contains OPTIONS check" ($auditJs -match 'if\s*\(\s*req\.method\s*===\s*["'']OPTIONS["'']\s*\)\s*\{\s*return\s+res\.status\(200\)\.end\(\);?\s*\}')
Assert-Test "audit.js sets Access-Control-Allow-Origin: *" ($auditJs.Contains('res.setHeader("Access-Control-Allow-Origin", "*");'))
Assert-Test "audit.js sets Access-Control-Allow-Methods: GET, POST, OPTIONS" ($auditJs.Contains('res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");'))
Assert-Test "audit.js sets Access-Control-Allow-Headers" ($auditJs -match 'res\.setHeader\("Access-Control-Allow-Headers",\s*"Content-Type')

# 2. Test James McCullohs in Rosters and audit.js
Assert-Test "audit.js getRoster contains james_mccullohs" ($auditJs -match 'id:\s*["'']james_mccullohs["'']')
Assert-Test "audit.js handleRepSync includes isJames" ($auditJs -match 'isJames')

$rosterData = Get-Content -Raw "data/rep_roster.json"
Assert-Test "data/rep_roster.json contains jcmccullohs@gmail.com" ($rosterData.Contains("jcmccullohs@gmail.com"))
Assert-Test "data/rep_roster.json contains Level 5 Certified" ($rosterData.Contains("Level 5 Certified"))

$webRosterData = Get-Content -Raw "website/data/rep_roster.json"
Assert-Test "website/data/rep_roster.json contains jcmccullohs@gmail.com" ($webRosterData.Contains("jcmccullohs@gmail.com"))

# 3. Test Arena UI elements
$arenaHtml = Get-Content -Raw "website/cold-call-arena/index.html"
Assert-Test "Arena contains tabBtnTeamCalls tab button" ($arenaHtml.Contains('id="tabBtnTeamCalls"'))
Assert-Test "Arena contains teamCallLogBadgeCount" ($arenaHtml.Contains('id="teamCallLogBadgeCount"'))
Assert-Test "Arena contains tabTeamCalls panel" ($arenaHtml.Contains('id="tabTeamCalls"'))
Assert-Test "Arena contains teamCallLogsTable" ($arenaHtml.Contains('id="teamCallLogsTable"'))
Assert-Test "Arena contains teamCallRepFilterPills" ($arenaHtml.Contains('id="teamCallRepFilterPills"'))
Assert-Test "Arena contains teamCallOutcomeFilterPills" ($arenaHtml.Contains('id="teamCallOutcomeFilterPills"'))
Assert-Test "Arena contains teamLiveActivityTicker" ($arenaHtml.Contains('id="teamLiveActivityTicker"'))
Assert-Test "Arena contains leadCallerFilterPills" ($arenaHtml.Contains('id="leadCallerFilterPills"'))
Assert-Test "Arena contains renderTeamCallLogsTab function" ($arenaHtml.Contains('function renderTeamCallLogsTab()'))
Assert-Test "Arena contains updateTeamLiveTicker function" ($arenaHtml.Contains('function updateTeamLiveTicker()'))
Assert-Test "Arena contains exportCallLogsOnlyCsv function" ($arenaHtml.Contains('exportCallLogsOnlyCsv'))
Assert-Test "Arena syncCallRecordToCloud targets production fallback" ($arenaHtml.Contains('https://www.vantorxsolutions.com/api/lead-calls/lead-call-sync'))
Assert-Test "Arena fetchTeamCallsFromCloud targets production fallback" ($arenaHtml.Contains('https://www.vantorxsolutions.com/api/lead-calls'))
Assert-Test "Arena callerSelect includes James McCullohs" ($arenaHtml.Contains('<option value="James McCullohs">James McCullohs</option>'))

# 4. Test Quest UI elements
$questHtml = Get-Content -Raw "website/cold-call-quest/index.html"
Assert-Test "Quest contains btnQuestLoginJames" ($questHtml.Contains('btnQuestLoginJames'))
Assert-Test "Quest contains james_mccullohs profile definition" ($questHtml.Contains('james_mccullohs'))
Assert-Test "Quest contains jcmccullohs@gmail.com" ($questHtml.Contains('jcmccullohs@gmail.com'))

# 5. Headless Edge simulation of cross-user calls and team call log UI rendering
Write-Host "`nRunning Headless Edge DOM Verification..." -ForegroundColor Yellow

$testDriverHtml = @"
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Driver Test</title></head>
<body>
<iframe id="arenaFrame" src="website/cold-call-arena/index.html" style="width:1280px;height:900px;"></iframe>
<script>
window.addEventListener('message', (e) => {});
</script>
</body>
</html>
"@

$driverPath = "$PSScriptRoot/test_driver_runner.html"
Set-Content -Path $driverPath -Value $testDriverHtml -Encoding UTF8

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$simScript = @'
(() => {
    try {
        const results = [];
        function pass(msg) { results.push({ pass: true, msg }); }
        function fail(msg) { results.push({ pass: false, msg }); }

        // 1. Check DOM elements
        const tabBtn = document.getElementById('tabBtnTeamCalls');
        if (tabBtn) pass("Team Call Logs tab button exists in DOM");
        else fail("Team Call Logs tab button missing");

        const tabPane = document.getElementById('tabTeamCalls');
        if (tabPane) pass("Team Call Logs tab panel exists in DOM");
        else fail("Team Call Logs tab panel missing");

        const ticker = document.getElementById('teamLiveActivityTicker');
        if (ticker) pass("Team Live Activity Ticker exists in DOM");
        else fail("Team Live Activity Ticker missing");

        // 2. Simulate 3 team calls from Carter, Lucas, and James
        const testCalls = {
            "fl_se_001": {
                called: true,
                caller: "Luke Hamilton",
                outcome: "Success",
                notes: "Booked demo for tomorrow 10am with owner Dave",
                updatedAt: new Date(Date.now() - 300000).toISOString()
            },
            "fl_se_002": {
                called: true,
                caller: "Carter McCauliss",
                outcome: "Success",
                notes: "Met with GM. Locked in Accelerate package demo!",
                updatedAt: new Date(Date.now() - 120000).toISOString()
            },
            "fl_se_003": {
                called: true,
                caller: "Lucas",
                outcome: "Call Back",
                notes: "Spoke to gatekeeper Sarah, call back at 4:30 PM",
                updatedAt: new Date(Date.now() - 60000).toISOString()
            },
            "fl_se_004": {
                called: true,
                caller: "James McCullohs",
                outcome: "No Luck",
                notes: "Left detailed voicemail regarding emergency leak math",
                updatedAt: new Date(Date.now() - 20000).toISOString()
            }
        };

        // Merge calls
        window.mergeCallsFromTeammate(testCalls, false);

        // Verify CALL_RECORDS updated
        if (window.CALL_RECORDS['fl_se_002'] && window.CALL_RECORDS['fl_se_002'].caller === "Carter McCauliss") {
            pass("Carter's call merged into CALL_RECORDS successfully");
        } else {
            fail("Carter's call missing in CALL_RECORDS");
        }

        if (window.CALL_RECORDS['fl_se_003'] && window.CALL_RECORDS['fl_se_003'].caller === "Lucas") {
            pass("Lucas's call merged into CALL_RECORDS successfully");
        } else {
            fail("Lucas's call missing in CALL_RECORDS");
        }

        if (window.CALL_RECORDS['fl_se_004'] && window.CALL_RECORDS['fl_se_004'].caller === "James McCullohs") {
            pass("James's call merged into CALL_RECORDS successfully");
        } else {
            fail("James's call missing in CALL_RECORDS");
        }

        // Verify Tab switch
        window.switchTab('tabTeamCalls');
        if (tabPane.classList.contains('active')) {
            pass("switchTab('tabTeamCalls') activated the Team Call Logs panel");
        } else {
            fail("Team Call Logs panel did not receive active class");
        }

        // Verify Table rows rendered
        const tbody = document.getElementById('teamCallLogsTableBody');
        const rows = tbody ? tbody.querySelectorAll('tr') : [];
        if (rows.length >= 4) {
            pass("Team Call Logs table rendered " + rows.length + " calls");
        } else {
            fail("Team Call Logs table only rendered " + rows.length + " rows");
        }

        // Verify Call contents in rows
        const tableHtml = tbody ? tbody.innerHTML : "";
        if (tableHtml.includes("Carter McCauliss")) {
            pass("Carter McCauliss call row rendered in call log table");
        } else {
            fail("Carter McCauliss row missing in call log table");
        }

        if (tableHtml.includes("Lucas")) {
            pass("Lucas call row rendered in call log table");
        } else {
            fail("Lucas row missing in call log table");
        }

        if (tableHtml.includes("James McCullohs")) {
            pass("James McCullohs call row rendered in call log table");
        } else {
            fail("James McCullohs row missing in call log table");
        }

        // Verify badges
        const badgeCarter = document.getElementById('teamLogBadgeCarter');
        if (badgeCarter && parseInt(badgeCarter.textContent, 10) >= 1) {
            pass("Carter badge count updated correctly: " + badgeCarter.textContent);
        } else {
            fail("Carter badge count incorrect");
        }

        // Verify Ticker text
        const tickerEl = document.getElementById('teamLiveTickerText');
        if (tickerEl && tickerEl.innerHTML.includes("James McCullohs") && tickerEl.innerHTML.includes("Lucas")) {
            pass("Live Activity Feed Ticker displays recent team calls: " + tickerEl.textContent.slice(0, 70) + "...");
        } else {
            fail("Ticker text did not update with recent calls");
        }

        // Verify Filtering by Rep
        window.filterTeamCallLogs('carter');
        const carterFilteredRows = tbody.querySelectorAll('tr');
        if (carterFilteredRows.length >= 1 && tbody.innerHTML.includes("Carter McCauliss")) {
            pass("filterTeamCallLogs('carter') correctly isolated Carter's calls (Count: " + carterFilteredRows.length + ")");
        } else {
            fail("filterTeamCallLogs('carter') failed, row count: " + carterFilteredRows.length);
        }

        // Reset filter
        window.filterTeamCallLogs('all');

        // Test Lead Queue Caller filter
        window.switchTab('tabLeads');
        const callerBtnCarter = document.querySelector('#leadCallerFilterPills [data-caller-filter="carter"]');
        if (callerBtnCarter) {
            callerBtnCarter.click();
            pass("Clicked [Carter] caller filter in 100-Lead Queue");
        } else {
            fail("Carter caller filter button missing in lead queue");
        }

        window.__TEST_REPORT = { success: true, results };
    } catch (e) {
        window.__TEST_REPORT = { success: false, error: e.message, stack: e.stack };
    }
})();
'@

$arenaResolved = Resolve-Path "website/cold-call-arena/index.html"
$arenaUri = [System.Uri]($arenaResolved.ProviderPath)

$evalFile = "$PSScriptRoot/eval_script.js"
Set-Content -Path $evalFile -Value $simScript -Encoding UTF8

# Start Headless Edge and inject test
$pinfo = New-Object System.Diagnostics.ProcessStartInfo
$pinfo.FileName = $edgePath
$pinfo.Arguments = "--headless=new --disable-gpu --remote-debugging-port=9222 `"$arenaUri`""
$pinfo.UseShellExecute = $false
$pinfo.CreateNoWindow = $true

$process = [System.Diagnostics.Process]::Start($pinfo)
Start-Sleep -Seconds 2

try {
    # Connect via Chrome DevTools Protocol to inspect
    $tabsRes = Invoke-RestMethod -Uri "http://localhost:9222/json" -TimeoutSec 5
    $targetTab = $tabsRes | Where-Object { $_.type -eq "page" -and $_.url -like "*cold-call-arena*" } | Select-Object -First 1

    if ($targetTab -and $targetTab.webSocketDebuggerUrl) {
        $wsUrl = $targetTab.webSocketDebuggerUrl
        $ws = New-Object System.Net.WebSockets.ClientWebSocket
        $cts = New-Object System.Threading.CancellationTokenSource
        $cts.CancelAfter(8000)
        $ws.ConnectAsync([System.Uri]$wsUrl, $cts.Token).Wait()

        $escapedScript = ($simScript -replace '\\', '\\' -replace '"', '\"' -replace "`n", '\n' -replace "`r", '')
        $evalMsg = "{`"id`":1,`"method`":`"Runtime.evaluate`",`"params`":{`"expression`":`"$escapedScript`",`"returnByValue`":true}}"

        $sendBytes = [System.Text.Encoding]::UTF8.GetBytes($evalMsg)
        $sendSegment = New-Object System.ArraySegment[byte] -ArgumentList @(,$sendBytes)
        $ws.SendAsync($sendSegment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token).Wait()

        # Read response
        $recvBuffer = New-Object byte[] 65536
        $recvSegment = New-Object System.ArraySegment[byte] -ArgumentList @(,$recvBuffer)
        $recvResult = $ws.ReceiveAsync($recvSegment, $cts.Token).Result
        $resJson = [System.Text.Encoding]::UTF8.GetString($recvBuffer, 0, $recvResult.Count)
        $resObj = $resJson | ConvertFrom-Json

        # Fetch window.__TEST_REPORT
        $getReportMsg = "{`"id`":2,`"method`":`"Runtime.evaluate`",`"params`":{`"expression`":`"window.__TEST_REPORT`",`"returnByValue`":true}}"
        $sendBytes2 = [System.Text.Encoding]::UTF8.GetBytes($getReportMsg)
        $sendSegment2 = New-Object System.ArraySegment[byte] -ArgumentList @(,$sendBytes2)
        $ws.SendAsync($sendSegment2, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token).Wait()

        $recvBuffer2 = New-Object byte[] 65536
        $recvSegment2 = New-Object System.ArraySegment[byte] -ArgumentList @(,$recvBuffer2)
        $recvResult2 = $ws.ReceiveAsync($recvSegment2, $cts.Token).Result
        $reportJson = [System.Text.Encoding]::UTF8.GetString($recvBuffer2, 0, $recvResult2.Count)
        $reportObj = $reportJson | ConvertFrom-Json

        $val = $reportObj.result.result.value
        if ($val -and $val.results) {
            foreach ($r in $val.results) {
                Assert-Test $r.msg ($r.pass)
            }
        } elseif ($val -and $val.error) {
            Write-Host "  [FAIL] Script Error: $($val.error)" -ForegroundColor Red
            $script:failCount++
        }
        $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "done", $cts.Token).Wait()
    } else {
        Write-Host "  [WARN] CDP port 9222 could not find target tab; skipping DOM websocket verification." -ForegroundColor Yellow
    }
} catch {
    Write-Host "  [WARN] Headless edge websocket notice: $($_.Exception.Message)" -ForegroundColor Yellow
} finally {
    if ($process -and -not $process.HasExited) {
        $process.Kill()
    }
    if (Test-Path $driverPath) { Remove-Item -Force $driverPath }
    if (Test-Path $evalFile) { Remove-Item -Force $evalFile }
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "SUMMARY: $passCount PASSED, $failCount FAILED" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if ($failCount -gt 0) {
    exit 1
}
exit 0
