const fs = require('fs');
const q = JSON.parse(fs.readFileSync('data/verified_targets_queue.json', 'utf8'));

const skippedDns = q.filter(x => x.status === 'skipped_dns');
console.log('Total skipped_dns:', skippedDns.length);
console.log('Sample 10 skipped_dns emails & companies:');
skippedDns.slice(0, 10).forEach(x => {
  console.log(`- ${x.company} | ${x.email} | source: ${x.emailSource} | website: ${x.website}`);
});
