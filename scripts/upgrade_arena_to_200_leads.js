// scripts/upgrade_arena_to_200_leads.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../website/cold-call-arena/index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Upgrade button HTML to +200 Fresh Leads
const oldButtonHTML = `<button class="btn btn-gold btn-sm" id="btnAdd100Leads" onclick="expandQueue100Leads()" style="font-weight:700" title="Expand your active queue with +100 fresh leads immediately">⚡ Add +100 Fresh Leads</button>`;
const newButtonHTML = `<button class="btn btn-gold btn-sm" id="btnAdd200Leads" onclick="expandQueueLeads(200)" style="font-weight:700" title="Expand your active queue with +200 fresh leads for the full team">⚡ Add +200 Fresh Leads</button>`;

if (content.includes(oldButtonHTML)) {
  content = content.replace(oldButtonHTML, newButtonHTML);
  console.log('✓ Upgraded Button HTML to Add +200 Fresh Leads');
} else {
  // Try regex match
  const btnRegex = /<button class="btn btn-gold btn-sm" id="btnAdd100Leads"[\s\S]*?<\/button>/;
  if (btnRegex.test(content)) {
    content = content.replace(btnRegex, newButtonHTML);
    console.log('✓ Upgraded Button HTML via regex');
  } else {
    console.warn('Button regex did not match directly, searching alternative...');
  }
}

// 2. Upgrade JavaScript function to support +200 additions
const oldFunctionRegex = /window\.expandQueue100Leads = function\(\) \{[\s\S]*?showToast\(`[^`]*\+100 Verified Leads[^`]*`\);\s*\};/m;

const newFunctionJS = `window.expandQueueLeads = function(amount = 200) {
    const curLimit = getActiveQueueLimit();
    if (curLimit >= LEADS_DATA.length) {
      showToast(\`All \${LEADS_DATA.length} verified trade contractor leads are already active in your queue!\`);
      return;
    }
    manualAdditions += amount;
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
    showToast(\`🚀 +\${amount} Verified Leads added to active queue! (Active queue: \${newLimit} leads for team)\`);
  };
  window.expandQueue100Leads = function() { window.expandQueueLeads(100); };`;

if (oldFunctionRegex.test(content)) {
  content = content.replace(oldFunctionRegex, newFunctionJS);
  console.log('✓ Successfully upgraded expandQueueLeads(200) engine logic');
} else {
  console.warn('Could not match oldFunctionRegex directly');
}

// 3. Update Batch Heading & Dropdown to mention +200
content = content.replace(
  "heading.textContent = `ACTIVE COLD CALL QUEUE: ${activeLimit} TARGETS (+100 ADDED ON DEMAND)`;",
  "heading.textContent = `ACTIVE COLD CALL QUEUE: ${activeLimit} TARGETS (+200 TEAM QUOTA ON DEMAND)`;"
);

content = content.replace(
  "optToday.textContent = `⚡ Active Queue (${activeLimit} Fresh Leads · +100 On Demand)`;",
  "optToday.textContent = `⚡ Active Queue (${activeLimit} Fresh Leads · +200 Team Quota On Demand)`;"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Successfully saved updated website/cold-call-arena/index.html');
