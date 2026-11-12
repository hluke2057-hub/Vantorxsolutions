const fs = require('fs');
const q = JSON.parse(fs.readFileSync('data/verified_targets_queue.json', 'utf8'));

const pending = q.filter(x => x.status === 'pending');
console.log('Total pending:', pending.length);

const unverifiedInPending = pending.filter(x => x.mx_status !== 'VERIFIED');
console.log('Pending without VERIFIED mx_status:', unverifiedInPending.length);
unverifiedInPending.forEach(x => {
  console.log(`- ${x.company} | ${x.email} | touch: ${x.touch} | mx_status: ${x.mx_status} | source: ${x.emailSource}`);
  x.status = 'skipped_dns';
  x.dnsError = 'Unverified recipient domain';
});

if (unverifiedInPending.length > 0) {
  fs.writeFileSync('data/verified_targets_queue.json', JSON.stringify(q, null, 2), 'utf8');
  fs.writeFileSync('website/data/verified_targets_queue.json', JSON.stringify(q, null, 2), 'utf8');
  console.log('Cleaned unverified leads from pending status.');
}
