const fs = require('fs');
const q = JSON.parse(fs.readFileSync('data/verified_targets_queue.json', 'utf8'));

const pending = q.filter(x => x.status === 'pending');
console.log('Total pending:', pending.length);
console.log('Pending by mx_status:', pending.reduce((acc, x) => { acc[x.mx_status || 'none'] = (acc[x.mx_status || 'none'] || 0) + 1; return acc; }, {}));

console.log('First 10 pending:');
pending.slice(0, 10).forEach((p, idx) => {
  console.log(`${idx+1}. ${p.company} | ${p.email} | mx_status: ${p.mx_status} | emailSource: ${p.emailSource}`);
});
