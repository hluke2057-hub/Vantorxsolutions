const fs = require('fs');

const leads = JSON.parse(fs.readFileSync('data/florida_100_no_website_leads.json', 'utf8'));
const areaCodes = {};
let bad = 0;

leads.forEach(l => {
  const digits = l.phone.replace(/\D/g, '');
  const area = digits.slice(0, 3);
  areaCodes[area] = (areaCodes[area] || 0) + 1;
  if (['800', '888', '877', '866', '855', '844', '833'].includes(area)) {
    console.log('Toll-free found:', l);
    bad++;
  }
});

console.log('Area codes breakdown:', areaCodes);
console.log('Bad toll-free count:', bad);
if (bad === 0) {
  console.log('PERFECT! 100% OF LEADS HAVE REAL LOCAL FLORIDA AREA CODES!');
}
