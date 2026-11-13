const fs = require('fs');
const path = require('path');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const indexPath = path.join(root, 'website/cold-call-arena/index.html');
const leadsPath = path.join(root, 'data/private_250_leads.json');

const leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
let html = fs.readFileSync(indexPath, 'utf8');

const startMarker = 'window.INTERNATIONAL_150_LEADS = [';
const endMarker = '];\n\nwindow.INTL_CURRENT_VIEW =';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error('Markers not found: startIdx:', startIdx, 'endIdx:', endIdx);
  process.exit(1);
}

const before = html.substring(0, startIdx);
const after = html.substring(endIdx + 2); // after the '];'

const replacement = `window.INTERNATIONAL_150_LEADS = ${JSON.stringify(leads, null, 2)};
window.PRIVATE_250_LEADS = window.INTERNATIONAL_150_LEADS;`;

const newHtml = before + replacement + after;
fs.writeFileSync(indexPath, newHtml, 'utf8');
console.log(`✅ Injected ${leads.length} leads into window.INTERNATIONAL_150_LEADS & window.PRIVATE_250_LEADS!`);
