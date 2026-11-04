const fs = require('fs');
const content = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');

const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('modalAccount') || l.includes('function openAccountModal')) {
    console.log(`Line ${i+1}: ${l.trim()}`);
    console.log(lines.slice(i, i+35).join('\n'));
    console.log('----------------------------------------');
  }
});
