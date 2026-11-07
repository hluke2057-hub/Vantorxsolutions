const fs = require('fs');
const html = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');
const lines = html.split('\n');

let start = -1;
let end = -1;
lines.forEach((l, i) => {
  if (l.includes('<div id="tabNoWebsite"')) start = i;
  if (start !== -1 && end === -1 && i > start && (l.includes('<!-- TAB') || l.includes('<!-- END TAB') || l.includes('<div id="tab') && l.includes('tab-panel'))) {
    end = i;
  }
});

console.log('tabNoWebsite starts at line:', start + 1, 'ends near line:', end + 1);
console.log('End line text:', lines[end]);
