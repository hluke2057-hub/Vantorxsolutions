const fs = require('fs');

const p2 = fs.readFileSync('scripts/leads_data_cylex_part2.js', 'utf8');
const lines = p2.split('\n');
console.log('p2 first 30 lines:');
console.log(lines.slice(0, 30).join('\n'));
console.log('\np2 lines 250 to 280:');
console.log(lines.slice(250, 280).join('\n'));
console.log('\np2 last 30 lines:');
console.log(lines.slice(-30).join('\n'));
