const fs = require('fs');

const p1 = fs.readFileSync('scripts/leads_data_cylex_part1.js', 'utf8');
const lines = p1.split('\n');

console.log('p1 lines count:', lines.length);
// Check for alliterative names in p1
let fakeCount = 0;
lines.forEach((l, i) => {
  if (l.includes('company:')) {
    const m = l.match(/company:\s*"([^"]+)",\s*owner:\s*"([^"]+)",\s*fullOwner:\s*"([^"]+)",.*phone:\s*"([^"]+)",\s*city:\s*"([^"]+)"/);
    if (m) {
      const comp = m[1];
      const owner = m[2];
      const fullOwner = m[3];
      const phone = m[4];
      const city = m[5];
      // Check if fullOwner has last name matching city or company
      const last = fullOwner.split(' ').slice(-1)[0].toLowerCase();
      const c = city.toLowerCase();
      if (c.includes(last) || comp.toLowerCase().includes(last)) {
        console.log(`Line ${i}: Suspicious match! Comp: ${comp}, Owner: ${fullOwner}, City: ${city}`);
        fakeCount++;
      }
    }
  }
});
console.log('Total suspicious in p1:', fakeCount);
