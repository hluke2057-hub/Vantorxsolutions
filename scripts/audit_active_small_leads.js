const fs = require('fs');

const leads = JSON.parse(fs.readFileSync('data/real_verified_leads.json', 'utf8'));
const activeSmall = leads.filter(l => l.employees <= 10 && l.sunbizStatus === 'Active');

console.log('Total active small leads in real_verified_leads.json:', activeSmall.length);
activeSmall.forEach((l, i) => {
  console.log((i + 1) + '. [' + l.id + '] ' + l.company + ' | ' + l.phone + ' | ' + l.city + ' | Emp: ' + l.employees + ' | Owner: ' + l.fullOwner);
});
