const fs = require('fs');

const content = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');
const startMarker = 'const LEADS_DATA = [';
const endMarker = '];\n\nwindow.LEADS_DATA = LEADS_DATA;';
const altEndMarker = '];\nwindow.LEADS_DATA = LEADS_DATA;';

const sIdx = content.indexOf(startMarker);
console.log('startMarker found at:', sIdx);

let eIdx = content.indexOf(endMarker, sIdx);
if (eIdx === -1) {
  eIdx = content.indexOf(altEndMarker, sIdx);
}
console.log('endMarker found at:', eIdx);

if (sIdx !== -1 && eIdx !== -1) {
  const block = content.substring(sIdx, eIdx + 2);
  const leadCount = (block.match(/"id":/g) || []).length;
  console.log('Current LEADS_DATA lead count in index.html:', leadCount);
} else {
  // Find where LEADS_DATA ends
  const lines = content.split('\n');
  const startLine = lines.findIndex(l => l.includes('const LEADS_DATA = ['));
  console.log('Start line in index.html:', startLine + 1);
  for (let i = startLine + 1; i < lines.length; i++) {
    if (lines[i].trim() === '];' && lines[i+1] && lines[i+1].includes('LEADS_DATA')) {
      console.log('End line in index.html:', i + 1, lines[i+1]);
      break;
    }
  }
}
