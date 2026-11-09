const fs = require('fs');

const content = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');
const lines = content.split('\n');
const startLine = lines.findIndex(l => l.includes('const LEADS_DATA = ['));

for (let i = startLine + 1; i < lines.length; i++) {
  if (lines[i].trim() === '];') {
    console.log(`Line ${i + 1}: ${lines[i]}`);
    console.log(`Line ${i + 2}: ${lines[i+1]}`);
    console.log(`Line ${i + 3}: ${lines[i+2]}`);
    break;
  }
}
