// scripts/add_update_batch_heading.js
const fs = require('fs');
const htmlPath = 'website/cold-call-arena/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const targetStr = `  function getTodayFreshRange() {
    const limit = getActiveQueueLimit();
    const start = Math.max(0, limit - 100);
    return { start, end: limit };
  }`;

const replacementStr = `  function getTodayFreshRange() {
    const limit = getActiveQueueLimit();
    const start = Math.max(0, limit - 100);
    return { start, end: limit };
  }

  function updateBatchDropdownLabels() {
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
  }

  function updateBatchHeading() {
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
  }
  window.updateBatchHeading = updateBatchHeading;
  window.updateBatchDropdownLabels = updateBatchDropdownLabels;`;

const normalize = s => s.replace(/\r\n/g, '\n');
if (normalize(html).includes(normalize(targetStr))) {
  html = normalize(html).replace(normalize(targetStr), normalize(replacementStr));
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('Successfully added updateBatchHeading and updateBatchDropdownLabels definitions!');
} else {
  console.error('Target string not found!');
  process.exit(1);
}
