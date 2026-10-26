# scripts/embed_750_into_arena.ps1
# Embeds the 750 polished leads from data/normalized_lead_targets.json into website/cold-call-arena/index.html
# and updates the 75-leads-per-day rotation engine and UI.

$ErrorActionPreference = "Stop"

$arenaPath = Join-Path $PSScriptRoot "../website/cold-call-arena/index.html"
$jsonPath = Join-Path $PSScriptRoot "../data/normalized_lead_targets.json"

Write-Host "Reading $jsonPath..." -ForegroundColor Cyan
$leadsJson = [System.IO.File]::ReadAllText($jsonPath, [System.Text.Encoding]::UTF8)
$leads = $leadsJson | ConvertFrom-Json

Write-Host "Loaded $($leads.Count) leads from JSON." -ForegroundColor Green
if ($leads.Count -ne 750) {
    throw "Expected 750 leads in normalized_lead_targets.json, found $($leads.Count)!"
}

# Format leads into JS string
$sb = [System.Text.StringBuilder]::new()
$sb.AppendLine("  const LEADS_DATA = [") | Out-Null
for ($i = 0; $i -lt $leads.Count; $i++) {
    $l = $leads[$i]
    $leadJson = $l | ConvertTo-Json -Compress
    $sb.Append("    ") | Out-Null
    $sb.Append($leadJson) | Out-Null
    if ($i -lt $leads.Count - 1) {
        $sb.AppendLine(",") | Out-Null
    } else {
        $sb.AppendLine() | Out-Null
    }
}
$sb.Append("];") | Out-Null
$newLeadsDataJs = $sb.ToString()

Write-Host "Reading $arenaPath..." -ForegroundColor Cyan
$html = [System.IO.File]::ReadAllText($arenaPath, [System.Text.Encoding]::UTF8)
$html = $html -replace "`r`n", "`n"

# 1. Replace the LEADS_DATA array specifically bounded by "// Sound Engine"
$leadsPattern = '(?s)  const LEADS_DATA = \[.*?\];\n\n  // Sound Engine'
if (-not ($html -match $leadsPattern)) {
    throw "Could not match exact LEADS_DATA boundary leading up to Sound Engine in index.html"
}
$replacementLeads = ($newLeadsDataJs -replace "`r`n", "`n") + "`n`n  // Sound Engine"
$html = [System.Text.RegularExpressions.Regex]::Replace($html, $leadsPattern, [System.Text.RegularExpressions.MatchEvaluator]{ return $replacementLeads })
Write-Host "Replaced LEADS_DATA array with 750 leads." -ForegroundColor Green

# 2. Update Header, Title, Meta, Tabs
$html = $html.Replace('<title>VantorX — Cold Calling Cockpit, 250+ Nationwide Leads &amp; Sales RPG</title>', '<title>VantorX — Cold Calling Cockpit, 750+ Nationwide Leads &amp; Sales RPG</title>')
$html = $html.Replace('<title>VantorX - Cold Calling Cockpit, 250+ Nationwide Leads &amp; Sales RPG</title>', '<title>VantorX — Cold Calling Cockpit, 750+ Nationwide Leads &amp; Sales RPG</title>')
$html = $html.Replace('content="Multi-product cold calling teleprompter, 250+ nationwide trade leads dispatcher with 25-daily automated rotation, call tracking, 45+ objection battlecards, and Cold Call Quest RPG."', 'content="Multi-product cold calling teleprompter, 750+ nationwide trade leads dispatcher with 75-daily automated rotation, call tracking, 45+ objection battlecards, and Cold Call Quest RPG."')
$html = $html.Replace('📋 100-Lead Dial Queue (+25/Day)</button>', '📋 100-Lead Dial Queue (+75/Day)</button>')
$html = $html.Replace('📋 Nationwide Trade Leads Dispatcher &amp; Leak Calculator (250+ Targets)</h2>', '📋 Nationwide Trade Leads Dispatcher &amp; Leak Calculator (750+ Targets)</h2>')
$html = $html.Replace('Starts with 100 primed high-ticket targets across FL, TX, CA, GA, NC, AZ, OH &amp; more. Unlocks +25 fresh leads every 24 hours, or add +25 on demand.', 'Starts with 100 primed high-ticket targets across FL, TX, CA, GA, NC, AZ, OH &amp; more. Unlocks +75 fresh leads every 24 hours, or add +75 on demand.')

# 3. Update Batch HUD title & subtitle
$html = $html.Replace('ACTIVE COLD CALL QUEUE: 100 TARGETS (+25 ADDED DAILY)</span></h3>', 'ACTIVE COLD CALL QUEUE: 100 TARGETS (+75 ADDED DAILY)</span></h3>')
$html = $html.Replace('Starts with 100 nationwide leads · +25 fresh leads added every 24h · Hit [⚡ Add +25 Leads Now] anytime!', 'Starts with 100 nationwide leads · +75 fresh leads added every 24h · Hit [➕ Add +75 Leads Now] anytime!')

# 4. Update Dropdown Options using Regex
$selectRegex = '(?s)<select id="batchSelect" class="custom-select">.*?</select>'
$newSelect = @'
<select id="batchSelect" class="custom-select">
                <option value="activeQueue" selected>⭐ Active Dial Queue (100 Leads · Starts 100 + Daily Growth: +75/day)</option>
                <option value="todayFresh">✨ Today's +75 Fresh Additions Only</option>
                <option value="all">🌐 All 750 Nationwide Leads</option>
                <option value="1">Batch 1: Florida Premier (Palm Beach, Broward &amp; Miami) (75)</option>
                <option value="2">Batch 2: Florida Gulf &amp; Central (Tampa, Orlando &amp; Jax) (75)</option>
                <option value="3">Batch 3: Texas DFW Metroplex (Dallas, Fort Worth, Plano) (75)</option>
                <option value="4">Batch 4: Texas Gulf Coast &amp; Austin (Houston &amp; San Antonio) (75)</option>
                <option value="5">Batch 5: Georgia Southeast (Atlanta, Marietta, Savannah) (75)</option>
                <option value="6">Batch 6: Carolinas Metro (Charlotte, Raleigh, Charleston) (75)</option>
                <option value="7">Batch 7: Arizona Sunbelt (Phoenix, Scottsdale, Tucson) (75)</option>
                <option value="8">Batch 8: California Coast (Los Angeles, Orange Co, San Diego) (75)</option>
                <option value="9">Batch 9: Mountain &amp; Desert (Denver, Vegas, Salt Lake) (75)</option>
                <option value="10">Batch 10: Midwest &amp; Industrial (Columbus, Cincinnati, Indy) (75)</option>
              </select>
'@
if (-not ($html -match $selectRegex)) {
    throw "batchSelect element not found via regex!"
}
$html = [System.Text.RegularExpressions.Regex]::Replace($html, $selectRegex, [System.Text.RegularExpressions.MatchEvaluator]{ return $newSelect })
Write-Host "Updated batchSelect dropdown options." -ForegroundColor Green

# 5. Update Add Leads Button in HTML
$btnRegex = '<button class="btn btn-gold btn-sm" id="btnAdd25Leads"[^>]*>.*?</button>'
$newBtnHtml = '<button class="btn btn-gold btn-sm" id="btnAdd75Leads" style="font-weight:700" title="Expand your active queue with +75 fresh leads immediately">➕ Add +75 Leads Now</button>'
if (-not ($html -match $btnRegex)) {
    throw "btnAdd25Leads button not found via regex!"
}
$html = [System.Text.RegularExpressions.Regex]::Replace($html, $btnRegex, [System.Text.RegularExpressions.MatchEvaluator]{ return $newBtnHtml })
Write-Host "Updated Add Leads button to id=btnAdd75Leads." -ForegroundColor Green

# 6. Update Pills & Row Size
$html = $html.Replace('<button class="lead-pill-btn active" data-lead-filter="all">All (250)</button>', '<button class="lead-pill-btn active" data-lead-filter="all">All (750)</button>')
$html = $html.Replace('<button class="btn-size-pill" data-size="all" onclick="setLeadPageSize(''all'')">All (250)</button>', '<button class="btn-size-pill" data-size="75" onclick="setLeadPageSize(75)">75</button><button class="btn-size-pill" data-size="all" onclick="setLeadPageSize(''all'')">All (750)</button>')
$html = $html.Replace('<!-- Populated via JavaScript from 250 normalized targets -->', '<!-- Populated via JavaScript from 750 normalized targets -->')

# 7. Update Queue Engine JS
$engineRegex = '(?s)  // Base Starting Queue: 100 leads, \+25 daily auto growth.*?function getTodayFreshRange\(\) \{.*?return \{ start, end: limit \};\n  \}'
$newEngineJs = @'
  // Base Starting Queue: 100 leads, +75 daily auto growth, + manual additions
  const BASE_QUEUE_SIZE = 100;
  const LAUNCH_DATE = new Date('2026-10-21T00:00:00');
  const msPerDay = 1000 * 60 * 60 * 24;
  const now = new Date();
  const daysSinceLaunch = Math.max(0, Math.floor((now.getTime() - LAUNCH_DATE.getTime()) / msPerDay));
  const autoDailyAdditions = daysSinceLaunch * 75;

  let manualAdditions = 0;
  try {
    manualAdditions = parseInt(localStorage.getItem('vantorx_manual_lead_additions') || '0', 10);
  } catch(e) {
    manualAdditions = 0;
  }

  function getActiveQueueLimit() {
    return Math.min(LEADS_DATA.length, BASE_QUEUE_SIZE + autoDailyAdditions + manualAdditions);
  }

  function getTodayFreshRange() {
    const limit = getActiveQueueLimit();
    const start = Math.max(0, limit - 75);
    return { start, end: limit };
  }
  window.LEADS_DATA = LEADS_DATA;
  window.getActiveQueueLimit = getActiveQueueLimit;
  window.getTodayFreshRange = getTodayFreshRange;
'@
if (-not ($html -match $engineRegex)) {
    throw "Queue Engine JS not found via regex!"
}
$html = [System.Text.RegularExpressions.Regex]::Replace($html, $engineRegex, [System.Text.RegularExpressions.MatchEvaluator]{ return $newEngineJs })
Write-Host "Updated Queue Engine JS constants and exposed window helpers." -ForegroundColor Green

# 8. Update updateBatchDropdownLabels & updateBatchHeading
$html = $html.Replace('`⭐ Active Dial Queue (${activeLimit} Leads · Starts 100 + Daily Growth)`', '`⭐ Active Dial Queue (${activeLimit} Leads · Starts 100 + Daily Growth: +75/day)`')
$html = $html.Replace('heading.textContent = `ACTIVE COLD CALL QUEUE: ${activeLimit} TARGETS (+25 ADDED DAILY)`;', 'heading.textContent = `ACTIVE COLD CALL QUEUE: ${activeLimit} TARGETS (+75 ADDED DAILY)`;')
$html = $html.Replace('heading.textContent = `TODAY''S 25 FRESH UNLOCKED TARGETS`;', 'heading.textContent = `TODAY''S 75 FRESH UNLOCKED TARGETS`;')
$html = $html.Replace('heading.textContent = `NATIONWIDE MASTER DIRECTORY (250 TARGETS)`;', 'heading.textContent = `NATIONWIDE MASTER DIRECTORY (750 TARGETS)`;')
$html = $html.Replace('heading.textContent = `BATCH #${currentBatch}: 25 NATIONWIDE TARGET LEADS`;', 'heading.textContent = `BATCH #${currentBatch}: 75 NATIONWIDE TARGET LEADS`;')

# 9. Update comments & filtering
$html = $html.Replace('search across ALL 250 NATIONWIDE LEADS!', 'search across ALL 750 NATIONWIDE LEADS!')

$btnListenerRegex = '(?s)// Add \+25 Leads Button Listener.*?// State Filter Select Listener'
$newBtnListenerJs = @'
// Add +75 Leads Button Listener (Supports btnAdd75Leads and legacy btnAdd25Leads)
  const handleAdd75Click = () => {
    const curLimit = getActiveQueueLimit();
    if (curLimit >= LEADS_DATA.length) {
      showToast('⭐ All 750 nationwide leads are already unlocked in your queue!');
      return;
    }
    manualAdditions += 75;
    try {
      localStorage.setItem('vantorx_manual_lead_additions', String(manualAdditions));
    } catch(e) {}
    const newLimit = getActiveQueueLimit();
    currentBatch = 'activeQueue';
    currentLeadPage = 1;
    if (batchSelectEl) batchSelectEl.value = 'activeQueue';
    updateBatchHeading();
    renderLeadsTable();
    updateQuotaHUD();
    playSound('levelup');
    showToast(`⚡ Unlocked +75 Fresh Leads! Active queue now: ${newLimit} targets.`);
  };

  const btnAdd75LeadsEl = document.getElementById('btnAdd75Leads');
  if (btnAdd75LeadsEl) {
    btnAdd75LeadsEl.addEventListener('click', handleAdd75Click);
  }
  const btnAdd25LeadsEl = document.getElementById('btnAdd25Leads');
  if (btnAdd25LeadsEl && btnAdd25LeadsEl !== btnAdd75LeadsEl) {
    btnAdd25LeadsEl.addEventListener('click', handleAdd75Click);
  }

  // State Filter Select Listener
'@
if (-not ($html -match $btnListenerRegex)) {
    throw "btnAdd25Leads listener JS not found via regex!"
}
$html = [System.Text.RegularExpressions.Regex]::Replace($html, $btnListenerRegex, [System.Text.RegularExpressions.MatchEvaluator]{ return $newBtnListenerJs })
Write-Host "Updated Add Leads button listener in JS." -ForegroundColor Green

# 11. Update CSV export toast & filename
$html = $html.Replace('VantorX_Nationwide_Leads_250_with_Call_Logs.csv', 'VantorX_Nationwide_Leads_750_with_Call_Logs.csv')
$html = $html.Replace('✓ 250 Leads with Call Logs exported to CSV!', '✓ 750 Leads with Call Logs exported to CSV!')

# Convert back to CRLF
$html = $html -replace "`n", "`r`n"

# Write back to file with clean UTF-8
[System.IO.File]::WriteAllText($arenaPath, $html, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Successfully embedded 750 leads and updated arena engine in $arenaPath!" -ForegroundColor Green
