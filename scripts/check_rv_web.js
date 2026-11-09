const fs = require('fs');
const path = require('path');

const leads = JSON.parse(fs.readFileSync('data/real_verified_leads.json', 'utf8'));
let noWeb = 0;
let hasWeb = 0;
let unknown = 0;

leads.forEach(l => {
  if (l.website) {
    if (l.website.toLowerCase().includes('none') || l.website.toLowerCase().includes('no website')) {
      noWeb++;
    } else {
      hasWeb++;
    }
  } else {
    unknown++;
  }
});

console.log({ total: leads.length, noWeb, hasWeb, unknown });
console.log('Sample lead keys:', Object.keys(leads[0]));
