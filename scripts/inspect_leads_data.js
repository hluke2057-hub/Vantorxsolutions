// scripts/inspect_leads_data.js
const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html'), 'utf8');

const match = content.match(/let\s+leadPageSize\s*=\s*([^;]+);/);
console.log('leadPageSize initialization:', match ? match[0] : 'not found');

const currentBatchMatch = content.match(/let\s+currentBatch\s*=\s*([^;]+);/);
console.log('currentBatch initialization:', currentBatchMatch ? currentBatchMatch[0] : 'not found');

const lines = content.split('\n');
const startIdx = lines.findIndex(l => l.includes('const LEADS_DATA = ['));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.trim() === '];');

let leadObjs = [];
let cur = '';
for (let i = startIdx + 1; i < endIdx; i++) {
  cur += lines[i] + '\n';
  if (lines[i].trim() === '},' || (lines[i].trim() === '}' && lines[i+1].trim() === '];')) {
    try {
      const obj = eval('(' + cur.trim().replace(/,$/, '') + ')');
      leadObjs.push(obj);
    } catch(e) {}
    cur = '';
  }
}
console.log('Parsed leads count:', leadObjs.length);

console.log('\n=== Page 1 (leads 0 to 9) ===');
leadObjs.slice(0, 10).forEach((l, idx) => {
  console.log((idx+1) + ': [' + l.id + '] ' + l.company + ' | ' + l.owner + ' | ' + l.phone + ' | ' + l.city + ' | Batch: ' + l.batch);
});

console.log('\n=== Page 2 (leads 25 to 34 if pageSize=25) ===');
leadObjs.slice(25, 35).forEach((l, idx) => {
  console.log((idx+26) + ': [' + l.id + '] ' + l.company + ' | ' + l.owner + ' | ' + l.phone + ' | ' + l.city + ' | Batch: ' + l.batch);
});

console.log('\n=== Leads 50 to 59 ===');
leadObjs.slice(50, 60).forEach((l, idx) => {
  console.log((idx+51) + ': [' + l.id + '] ' + l.company + ' | ' + l.owner + ' | ' + l.phone + ' | ' + l.city + ' | Batch: ' + l.batch);
});

console.log('\n=== Leads 100 to 109 ===');
leadObjs.slice(100, 110).forEach((l, idx) => {
  console.log((idx+101) + ': [' + l.id + '] ' + l.company + ' | ' + l.owner + ' | ' + l.phone + ' | ' + l.city + ' | Batch: ' + l.batch);
});

console.log('\n=== Leads 200 to 209 ===');
leadObjs.slice(200, 210).forEach((l, idx) => {
  console.log((idx+201) + ': [' + l.id + '] ' + l.company + ' | ' + l.owner + ' | ' + l.phone + ' | ' + l.city + ' | Batch: ' + l.batch);
});

console.log('\n=== Leads 500 to 509 ===');
leadObjs.slice(500, 510).forEach((l, idx) => {
  console.log((idx+501) + ': [' + l.id + '] ' + l.company + ' | ' + l.owner + ' | ' + l.phone + ' | ' + l.city + ' | Batch: ' + l.batch);
});
