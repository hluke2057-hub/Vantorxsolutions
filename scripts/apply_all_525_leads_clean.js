// scripts/apply_all_525_leads_clean.js
const fs = require('fs');
const path = require('path');
const { batch6New, batch8Leads, batch9Leads, formatLead } = require('./build_verified_525_leads');

const htmlPath = path.resolve('website/cold-call-arena/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Generate formatted lead objects
const formattedB6 = batch6New.map((item, idx) => formatLead(item, `fl_cg_${126 + idx}`, 6));
const formattedB8 = batch8Leads.map((item, idx) => formatLead(item, `fl_sc_${347 + idx}`, 8));
const formattedB9 = batch9Leads.map((item, idx) => formatLead(item, `sb_exp_${347 + batch8Leads.length + idx}`, 9));
const allNewLeads = [...formattedB6, ...formattedB8, ...formattedB9];
console.log(`Generated ${allNewLeads.length} new leads.`);

// 2. Insert new leads right before the closing ]; of LEADS_DATA
const targetEndOfLeads = `    "isSmallLocalBiz": true,
    "smallBizPitchAngle": "Larry is actively under a sink or on a commercial sewer repipe. When high-ticket emergency calls ring, homeowners hang up on voicemail and call the next listing. Ava catches them in under 1 second."
  }
];`;

const newLeadsFormatted = allNewLeads.map(l => '  ' + JSON.stringify(l, null, 2).replace(/\n/g, '\n  ')).join(',\n');
const replacementEndOfLeads = `    "isSmallLocalBiz": true,
    "smallBizPitchAngle": "Larry is actively under a sink or on a commercial sewer repipe. When high-ticket emergency calls ring, homeowners hang up on voicemail and call the next listing. Ava catches them in under 1 second."
  },
${newLeadsFormatted}
];`;

const normalize = s => s.replace(/\r\n/g, '\n');

if (!normalize(html).includes(normalize(targetEndOfLeads))) {
  throw new Error('Could not find targetEndOfLeads in index.html');
}
html = normalize(html).replace(normalize(targetEndOfLeads), normalize(replacementEndOfLeads));
console.log('Successfully appended 179 new leads into LEADS_DATA!');

// 3. Update tab button text
html = html.replace(
  'id="tabBtnLeads" data-tab="tabLeads" onclick="switchTab(\'tabLeads\')">📋 Lead Queue &amp; Call History (346 Real Targets)</button>',
  'id="tabBtnLeads" data-tab="tabLeads" onclick="switchTab(\'tabLeads\')">📋 Lead Queue &amp; Call History (525 Real Targets)</button>'
);

// 4. Update Batch Dropdown HTML
const oldBatchSelectHtml = `<select id="batchSelect" class="custom-select" style="font-weight:700">
                  <option value="today100" selected>⚡ Today's 100 Fresh Leads</option>
                  <option value="all">📁 All Available Verified Leads (346 Targets)</option>
                  <option value="1">Batch 1: Palm Beach &amp; Broward (50 Real Targets)</option>
                  <option value="2">Batch 2: Miami-Dade &amp; South FL (50 Real Targets)</option>
                  <option value="3">Batch 3: Tampa Bay &amp; Gulf Coast (50 Real Targets)</option>
                  <option value="4">Batch 4: Orlando &amp; Central FL (50 Real Targets)</option>
                  <option value="5">Batch 5: Jacksonville &amp; North FL (50 Real Targets)</option>
                  <option value="6">Batch 6: Southwest Florida (21 Real Targets)</option>
                  <option value="7">⚡ Batch 7: Fresh 75 Verified Additions (North &amp; Central FL • 75 Targets)</option>
                </select>`;

const newBatchSelectHtml = `<select id="batchSelect" class="custom-select" style="font-weight:700">
                  <option value="today100" selected>⚡ Active Queue (100 Fresh Leads • +100 On Demand)</option>
                  <option value="all">📁 All 525 Real Verified Leads (Strictly 2-10 Staff)</option>
                  <option value="1">Batch 1: Palm Beach &amp; Broward (50 Real Targets)</option>
                  <option value="2">Batch 2: Miami-Dade &amp; South FL (50 Real Targets)</option>
                  <option value="3">Batch 3: Tampa Bay &amp; Gulf Coast (50 Real Targets)</option>
                  <option value="4">Batch 4: Orlando &amp; Central FL (50 Real Targets)</option>
                  <option value="5">Batch 5: Jacksonville &amp; North FL (50 Real Targets)</option>
                  <option value="6">Batch 6: Southwest FL &amp; Gulf Coast (50 Real Targets)</option>
                  <option value="7">Batch 7: North &amp; Central FL &amp; Panhandle (75 Real Targets)</option>
                  <option value="8">Batch 8: Space Coast, Treasure Coast &amp; Central FL (75 Real Targets)</option>
                  <option value="9">Batch 9: Sunbelt Expansion: GA, NC, TX, AZ (75 Real Targets)</option>
                </select>`;

html = html.replace(normalize(oldBatchSelectHtml), normalize(newBatchSelectHtml));

// 5. Update row selector from "All (750)" to "All (525)"
html = html.replace(/data-page-size="all"[^>]*>All \(\d+\)<\/button>/g, 'data-page-size="all">All (525)</button>');

// 6. Update getActiveQueueLimit to use BASE_QUEUE_SIZE + manualAdditions (starts at 100 on load)
const oldLimitCode = `  function getActiveQueueLimit() {
    return Math.min(LEADS_DATA.length, BASE_QUEUE_SIZE + autoDailyAdditions + manualAdditions);
  }`;

const newLimitCode = `  function getActiveQueueLimit() {
    return Math.min(LEADS_DATA.length, BASE_QUEUE_SIZE + manualAdditions);
  }`;

html = html.replace(normalize(oldLimitCode), normalize(newLimitCode));

// 7. Update expandQueue100Leads
const oldExpandCode = `  window.expandQueue100Leads = function() {
    manualAdditions += 100;
    try {
      localStorage.setItem('vantorx_manual_lead_additions', manualAdditions.toString());
    } catch(e) {}
    renderLeadsTable();
    updateQuotaHUD();
    showToast(\`✓ +100 Verified Leads added to active queue! (Active queue: \${getActiveQueueLimit()} leads)\`);
  };`;

const newExpandCode = `  window.expandQueue100Leads = function() {
    const curLimit = getActiveQueueLimit();
    if (curLimit >= LEADS_DATA.length) {
      showToast(\`All \${LEADS_DATA.length} verified trade contractor leads are already active in your queue!\`);
      return;
    }
    manualAdditions += 100;
    try {
      localStorage.setItem('vantorx_manual_lead_additions', manualAdditions.toString());
    } catch(e) {}
    const newLimit = getActiveQueueLimit();
    currentLeadPage = 1;
    updateBatchHeading();
    updateBatchDropdownLabels();
    renderLeadsTable();
    updateQuotaHUD();
    playSound('levelup');
    showToast(\`✅ +100 Verified Leads added to active queue! (Active queue: \${newLimit} leads)\`);
  };`;

html = html.replace(normalize(oldExpandCode), normalize(newExpandCode));

// 8. Update updateBatchDropdownLabels
const oldDropdownCode = `  function updateBatchDropdownLabels() {
    const activeLimit = getActiveQueueLimit();
    const batchSel = document.getElementById('batchSelect');
    if (batchSel) {
      const optActive = batchSel.querySelector('option[value="activeQueue"]');
      if (optActive) {
        optActive.textContent = isIntakePaused
          ? \`⭐ Active Dial Queue (\${activeLimit} Leads · 1-Wk Pause Active)\`
          : \`⭐ Active Dial Queue (\${activeLimit} Leads · Starts 100 + Daily Growth)\`;
      }
    }
  }`;

const newDropdownCode = `  function updateBatchDropdownLabels() {
    const activeLimit = getActiveQueueLimit();
    const batchSel = document.getElementById('batchSelect');
    if (batchSel) {
      const optToday = batchSel.querySelector('option[value="today100"]');
      if (optToday) {
        optToday.textContent = \`⚡ Active Queue (\${activeLimit} Fresh Leads • +100 On Demand)\`;
      }
      const optAll = batchSel.querySelector('option[value="all"]');
      if (optAll) {
        optAll.textContent = \`📁 All \${LEADS_DATA.length} Real Verified Leads (Strictly 2-10 Staff)\`;
      }
    }
  }`;

html = html.replace(normalize(oldDropdownCode), normalize(newDropdownCode));

// 9. Update updateBatchHeading
const oldHeadingCode = `  function updateBatchHeading() {
    const heading = document.getElementById('batchHeadingText');
    const activeLimit = getActiveQueueLimit();
    if (heading) {
      if (currentBatch === 'today100') {
        heading.textContent = \`TODAY'S 100 FRESH VERIFIED TARGETS (DAILY ROTATION · 0 FAKE NUMBERS)\`;
      } else if (currentBatch === 'activeQueue') {
        heading.textContent = isIntakePaused
          ? \`ACTIVE COLD CALL QUEUE: \${activeLimit} TARGETS (PAUSED FOR 1 WEEK · 700 STACKED LEADS READY)\`
          : \`ACTIVE COLD CALL QUEUE: \${activeLimit} TARGETS (+100 ADDED DAILY)\`;
      } else if (currentBatch === 'todayFresh') {
        heading.textContent = \`TODAY'S 100 FRESH UNLOCKED TARGETS\`;
      } else if (currentBatch === 'all') {
        heading.textContent = \`FLORIDA TRADE CONTRACTORS DIRECTORY (\${(window.LEADS_DATA || []).length} VERIFIED TARGETS)\`;
      } else if (currentBatch === '7') {
        heading.textContent = \`BATCH #7: 75 FRESH VERIFIED ADDITIONS (NORTH & CENTRAL FL, PANHANDLE)\`;
      } else {
        heading.textContent = \`BATCH #\${currentBatch}: 50 VERIFIED REGIONAL TARGETS\`;
      }
    }
    const btnAdd = document.getElementById('btnAdd75Leads');
    if (btnAdd && isIntakePaused) {
      btnAdd.title = 'Intake paused for 1 week at 700 stacked targets. Click to manually unlock +75 if ready.';
    }
    updateBatchDropdownLabels();
  }`;

const newHeadingCode = `  function updateBatchHeading() {
    const heading = document.getElementById('batchHeadingText');
    const activeLimit = getActiveQueueLimit();
    if (heading) {
      if (currentBatch === 'today100' || currentBatch === 'activeQueue' || currentBatch === 'todayFresh') {
        heading.textContent = \`ACTIVE COLD CALL QUEUE: \${activeLimit} TARGETS (+100 ADDED ON DEMAND)\`;
      } else if (currentBatch === 'all') {
        heading.textContent = \`VERIFIED TRADE CONTRACTORS DIRECTORY (\${(window.LEADS_DATA || []).length} TARGETS)\`;
      } else if (currentBatch === '6') {
        heading.textContent = \`BATCH #6: SOUTHWEST FLORIDA & GULF COAST (50 VERIFIED TARGETS)\`;
      } else if (currentBatch === '7') {
        heading.textContent = \`BATCH #7: 75 VERIFIED ADDITIONS (NORTH & CENTRAL FL, PANHANDLE)\`;
      } else if (currentBatch === '8') {
        heading.textContent = \`BATCH #8: 75 VERIFIED ADDITIONS (SPACE COAST, TREASURE COAST & CENTRAL FL)\`;
      } else if (currentBatch === '9') {
        heading.textContent = \`BATCH #9: 75 VERIFIED TARGETS (SUNBELT EXPANSION: GA, NC, TX, AZ)\`;
      } else {
        heading.textContent = \`BATCH #\${currentBatch}: 50 VERIFIED REGIONAL TARGETS\`;
      }
    }
    updateBatchDropdownLabels();
  }`;

html = html.replace(normalize(oldHeadingCode), normalize(newHeadingCode));

// 10. Update renderLeadsTable queue slice
const oldRenderSlice = `    // ☀️ TODAY'S 100 FRESH LEADS QUEUE SLICE
    if (currentBatch === 'today100' || currentBatch === 'todayFresh') {
      filtered = filtered.slice(0, 100);
    }`;

const newRenderSlice = `    // ☀️ ACTIVE QUEUE SLICE (+100 ON DEMAND VIA BUTTON)
    if (currentBatch === 'today100' || currentBatch === 'todayFresh' || currentBatch === 'activeQueue') {
      filtered = filtered.slice(0, activeLimit);
    }`;

html = html.replace(normalize(oldRenderSlice), normalize(newRenderSlice));

// 11. Update updateQuotaHUD batchLeads
const oldQuotaBatchLeads = `    let batchLeads = [];
    if (currentBatch === 'activeQueue') {
      batchLeads = LEADS_DATA.slice(0, activeLimit);
    } else if (currentBatch === 'todayFresh') {
      batchLeads = LEADS_DATA.slice(freshRange.start, freshRange.end);
    } else if (currentBatch === 'all') {
      batchLeads = LEADS_DATA;
    } else {
      const bNum = parseInt(currentBatch, 10);
      batchLeads = LEADS_DATA.filter(l => l.batch === bNum);
    }`;

const newQuotaBatchLeads = `    let batchLeads = [];
    if (currentBatch === 'today100' || currentBatch === 'activeQueue' || currentBatch === 'todayFresh') {
      batchLeads = LEADS_DATA.slice(0, activeLimit);
    } else if (currentBatch === 'all') {
      batchLeads = LEADS_DATA;
    } else {
      const bNum = parseInt(currentBatch, 10);
      batchLeads = isNaN(bNum) ? LEADS_DATA.slice(0, activeLimit) : LEADS_DATA.filter(l => l.batch === bNum);
    }`;

html = html.replace(normalize(oldQuotaBatchLeads), normalize(newQuotaBatchLeads));

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ All 525 leads and queue controls successfully updated!');
