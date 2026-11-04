const fs = require('fs');

const content = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, i) => {
  if (l.includes('CALL_RECORDS[') && (l.includes('=') || l.includes('delete'))) {
    console.log((i+1) + ': ' + l.trim());
  }
});
