// scripts/audit_real_leads.js
const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  if (filePath.endsWith('.json')) {
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : Object.values(data);
  }
  return [];
}

const f1 = checkFile('data/normalized_lead_targets.json');
const f2 = checkFile('data/verified_targets_queue.json');
const f3 = checkFile('data/real_verified_leads.json');

console.log('f1 count:', f1.length);
console.log('f2 count:', f2.length);
console.log('f3 count:', f3.length);

const allLeads = [...f1, ...f2, ...f3];
const unique = new Map();
allLeads.forEach(l => {
  if (!l || !l.phone || !l.company) return;
  const digits = l.phone.replace(/\D/g, '');
  if (digits.length >= 10 && !digits.includes('5550')) {
    unique.set(digits, l);
  }
});

console.log('Verified unique leads count:', unique.size);
