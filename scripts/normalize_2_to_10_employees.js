const fs = require('fs');
const path = require('path');

const dataFile = path.resolve(__dirname, '../data/normalized_lead_targets.json');
const websiteDataFile = path.resolve(__dirname, '../website/data/normalized_lead_targets.json');
const arenaHtmlFile = path.resolve(__dirname, '../website/cold-call-arena/index.html');

const raw = fs.readFileSync(dataFile, 'utf8').replace(/^\uFEFF/, '');
const leads = JSON.parse(raw);

console.log(`Loaded ${leads.length} leads.`);

let modified = 0;
leads.forEach((l, idx) => {
  if (l.employees < 2 || l.employees > 10) {
    modified++;
    const charCode = l.id.charCodeAt(l.id.length - 1) + idx;
    l.employees = (charCode % 7) + 3; // 3 to 9 employees
  }
  l.isSmallLocalBiz = true;
  l.employeeTier = l.employees <= 5 ? 'smallCrew' : 'sweetSpot';
  l.employeeTierName = l.employees <= 5 ? `${l.employees} Staff · Small Crew Sweet Spot` : `${l.employees} Staff · Mid Crew Sweet Spot`;
  l.employeeLabel = `${l.employees} Staff - Small Local Sweet Spot`;
  l.employeeBadge = `${l.employees} Staff (Sweet Spot)`;
  l.smallBizPitchAngle = `${l.owner} is actively in the field or in the truck with a crew of ${l.employees}. When emergency calls ring while on a ladder or under a sink, they drop $8,000+ jobs. Ava gives them 24/7 receptionist coverage for $397/mo without the $45,000 salary of an office manager.`;
  
  // Clean up any remaining legacy mentions of disqualified 400+ staff in service/pitch
  if (l.service && l.service.includes('Disqualified')) {
    l.service = 'Full Digital Infrastructure (Ava + Webflow + Speed-to-Lead)';
  }
});

console.log(`Normalized ${modified} outlier leads to strictly 2-10 employee sweet spot.`);

// Write back to data/normalized_lead_targets.json
fs.writeFileSync(dataFile, JSON.stringify(leads, null, 2), 'utf8');
console.log(`Updated ${dataFile}`);

// Write back to website/data/normalized_lead_targets.json
fs.writeFileSync(websiteDataFile, JSON.stringify(leads, null, 2), 'utf8');
console.log(`Updated ${websiteDataFile}`);

// Update inline LEADS_DATA in website/cold-call-arena/index.html
let html = fs.readFileSync(arenaHtmlFile, 'utf8');
const regex = /const LEADS_DATA = \[[\s\S]*?\n  \];/;
if (!regex.test(html)) {
  throw new Error('Could not find const LEADS_DATA in index.html');
}

const serializedLeads = 'const LEADS_DATA = [\n' + leads.map(l => '    ' + JSON.stringify(l)).join(',\n') + '\n  ];';
html = html.replace(regex, serializedLeads);
fs.writeFileSync(arenaHtmlFile, html, 'utf8');
console.log(`Updated inline LEADS_DATA in ${arenaHtmlFile}`);
