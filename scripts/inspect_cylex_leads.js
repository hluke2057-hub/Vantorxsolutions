const fs = require('fs');

const p1 = fs.readFileSync('scripts/leads_data_cylex_part1.js', 'utf8');
const p2 = fs.readFileSync('scripts/leads_data_cylex_part2.js', 'utf8');

console.log('p1 lines:', p1.split('\n').length);
console.log('p2 lines:', p2.split('\n').length);

// Count how many objects in p1 and p2
const countP1 = (p1.match(/company:\s*"/g) || []).length;
const countP2 = (p2.match(/company:\s*"/g) || []).length;
console.log('p1 company count:', countP1);
console.log('p2 company count:', countP2);
