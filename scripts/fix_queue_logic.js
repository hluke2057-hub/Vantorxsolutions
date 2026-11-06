// scripts/fix_queue_logic.js
const fs = require('fs');
const htmlPath = 'website/cold-call-arena/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// Update expandQueue100Leads:
const oldExpandRegex = /window\.expandQueue100Leads = function\(\) \{[\s\S]*?showToast\([^\)]*\);\s*\r?\n\s*\};/;

const newExpand = `window.expandQueue100Leads = function() {
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

console.log('Match expand regex:', oldExpandRegex.test(html));
if (oldExpandRegex.test(html)) {
  html = html.replace(oldExpandRegex, newExpand);
}

// Update updateBatchDropdownLabels:
const oldDropdownRegex = /function updateBatchDropdownLabels\(\) \{[\s\S]*?\r?\n\s*\}/;
const newDropdown = `function updateBatchDropdownLabels() {
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

console.log('Match dropdown regex:', oldDropdownRegex.test(html));
if (oldDropdownRegex.test(html)) {
  html = html.replace(oldDropdownRegex, newDropdown);
}

// Update updateBatchHeading:
const oldHeadingRegex = /function updateBatchHeading\(\) \{[\s\S]*?updateBatchDropdownLabels\(\);\s*\r?\n\s*\}/;
const newHeading = `function updateBatchHeading() {
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

console.log('Match heading regex:', oldHeadingRegex.test(html));
if (oldHeadingRegex.test(html)) {
  html = html.replace(oldHeadingRegex, newHeading);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('fix_queue_logic.js updated successfully!');
