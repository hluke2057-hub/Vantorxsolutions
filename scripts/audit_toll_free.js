const fs = require('fs');

const leads = JSON.parse(fs.readFileSync('data/florida_100_no_website_leads.json', 'utf8'));

const tollFree = [];
leads.forEach((l, i) => {
  const digits = l.phone.replace(/\D/g, '');
  const area = digits.slice(0, 3);
  if (['800', '888', '877', '866', '855', '844', '833'].includes(area) || l.company.length < 5) {
    tollFree.push({ index: i, id: l.id, company: l.company, phone: l.phone });
  }
});

console.log('Toll-free or short names count:', tollFree.length);
console.log(tollFree);
