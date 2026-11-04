const fs = require('fs');
const path = require('path');

const arenaPath = 'website/cold-call-arena/index.html';
let content = fs.readFileSync(arenaPath, 'utf8');

// 1. Read clean verified real leads
const cleanLeads = JSON.parse(fs.readFileSync('data/real_verified_leads.json', 'utf8'));
console.log(`Loaded ${cleanLeads.length} clean real verified leads.`);

// 2. Replace LEADS_DATA array
const leadsDataStart = content.indexOf('  const LEADS_DATA = [');
const leadsDataEndMarker = '  window.LEADS_DATA = LEADS_DATA;';
const leadsDataEnd = content.indexOf(leadsDataEndMarker);

if (leadsDataStart === -1 || leadsDataEnd === -1) {
  throw new Error('Could not find LEADS_DATA boundaries in index.html');
}

// Find the return statement right before window.LEADS_DATA
const returnIdx = content.lastIndexOf('return Math.min(LEADS_DATA.length', leadsDataEnd);
const leadArrayEnd = content.lastIndexOf('];', returnIdx);

if (leadArrayEnd === -1) {
  throw new Error('Could not find ]; for LEADS_DATA');
}

const newLeadsJson = '  const LEADS_DATA = ' + JSON.stringify(cleanLeads, null, 2) + ';';

content = content.substring(0, leadsDataStart) + newLeadsJson + content.substring(leadArrayEnd + 2);
console.log('Successfully replaced LEADS_DATA with 271 clean real leads!');

// Write to check progress
fs.writeFileSync(arenaPath, content, 'utf8');
console.log('Saved arena HTML with new leads data.');
