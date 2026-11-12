const fs = require('fs');
const q = JSON.parse(fs.readFileSync('data/verified_targets_queue.json', 'utf8'));

const sentToday = q.filter(x => x.status === 'sent' && x.sentAt && x.sentAt.startsWith('2026-11-12'));
console.log('Sent today (2026-11-12):', sentToday.length);
console.log('Total sent all time in queue:', q.filter(x => x.status === 'sent').length);

const byDate = {};
q.filter(x => x.status === 'sent' && x.sentAt).forEach(x => {
  const d = x.sentAt.split('T')[0];
  byDate[d] = (byDate[d] || 0) + 1;
});
console.log('Sent by date:', byDate);
