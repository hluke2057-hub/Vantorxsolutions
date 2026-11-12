const fs = require('fs');
const q = JSON.parse(fs.readFileSync('data/verified_targets_queue.json', 'utf8'));

const sentLeads = q.filter(x => x.status === 'sent');
console.log('Total sent leads:', sentLeads.length);

const now = Date.now();
let eligibleTouch2 = 0;
let eligibleTouch3 = 0;
const sentDates = [];

sentLeads.forEach(l => {
  if (l.sentAt) {
    const ageHours = (now - new Date(l.sentAt).getTime()) / (1000 * 3600);
    sentDates.push({ company: l.company, email: l.email, touch: l.touch || 1, ageHours: ageHours.toFixed(1), sentAt: l.sentAt });
    if ((l.touch || 1) === 1 && ageHours >= 48) eligibleTouch2++;
    if (l.touch === 2 && ageHours >= 72) eligibleTouch3++;
  }
});

console.log(`Eligible for Touch 2 (>= 48h): ${eligibleTouch2}`);
console.log(`Eligible for Touch 3 (>= 72h): ${eligibleTouch3}`);
console.log('Sample sent leads with ages:');
sentDates.slice(0, 10).forEach(s => console.log(`- ${s.company} | ${s.email} | Touch ${s.touch} | ${s.ageHours}h ago`));
