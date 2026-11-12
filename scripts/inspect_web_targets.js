const fs = require('fs');
const targets = JSON.parse(fs.readFileSync('website/data/normalized_lead_targets.json', 'utf8'));

console.log('Total in website/data/normalized_lead_targets.json:', targets.length);
const withEmail = targets.filter(t => t.email && t.email.includes('@'));
console.log('Targets with email:', withEmail.length);
console.log('Sample 10:');
withEmail.slice(0, 10).forEach(t => console.log(t.company, '|', t.email, '|', t.phone, '|', t.website));
