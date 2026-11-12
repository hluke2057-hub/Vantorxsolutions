const fs = require('fs');
const targets = JSON.parse(fs.readFileSync('data/normalized_lead_targets.json', 'utf8'));

console.log('Total targets in normalized_lead_targets.json:', targets.length);
const withEmail = targets.filter(t => t.email && t.email.includes('@'));
console.log('Targets with email:', withEmail.length);
console.log('Sample 5:');
withEmail.slice(0, 5).forEach(t => console.log(t.company, t.email, t.phone, t.owner));
