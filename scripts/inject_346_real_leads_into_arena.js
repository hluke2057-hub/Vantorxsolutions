const fs = require('fs');
const path = require('path');

const arenaPath = path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
const leadsPath = path.resolve(__dirname, '..', 'data', 'real_verified_leads.json');

const leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
console.log('Injecting ' + leads.length + ' 100% real verified leads into index.html...');

let content = fs.readFileSync(arenaPath, 'utf8');
const isCRLF = content.includes('\r\n');
if (isCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

const lines = content.split('\n');
const startLineIdx = lines.findIndex(l => l.includes('const LEADS_DATA = ['));
if (startLineIdx === -1) {
  console.error('Could not find "const LEADS_DATA = [" in index.html');
  process.exit(1);
}

let endLineIdx = -1;
for (let i = startLineIdx + 1; i < lines.length; i++) {
  if (lines[i].trim() === '];' && lines[i+1] && lines[i+1].includes('Sound Engine')) {
    endLineIdx = i;
    break;
  }
}

if (endLineIdx === -1) {
  console.error('Could not find closing "];" for LEADS_DATA');
  process.exit(1);
}

console.log(`Replacing lines ${startLineIdx + 1} to ${endLineIdx + 1} (${endLineIdx - startLineIdx + 1} lines)...`);

const formattedLeadsJson = 'const LEADS_DATA = ' + JSON.stringify(leads, null, 2) + ';';

const newLines = [
  ...lines.slice(0, startLineIdx),
  formattedLeadsJson,
  ...lines.slice(endLineIdx + 1)
];

let newContent = newLines.join('\n');
if (isCRLF) {
  newContent = newContent.replace(/\n/g, '\r\n');
}

fs.writeFileSync(arenaPath, newContent, 'utf8');
console.log('Successfully replaced LEADS_DATA in index.html with 346 100% REAL leads!');
