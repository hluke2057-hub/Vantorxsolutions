const fs = require('fs');

const html = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');
const match = html.match(/const\s+LEADS_DATA\s*=\s*(\[[\s\S]*?\]);\s*\n/);
const leads = eval(match[1]);

console.log('Total verified leads in arena:', leads.length);
console.log('--- FIRST 15 LEADS AUDIT ---');
leads.slice(0, 15).forEach((l, i) => {
  console.log((i + 1) + '. ' + l.company);
  console.log('   📞 Phone:   ' + l.phone);
  console.log('   🌐 Website: ' + l.website);
  console.log('   👤 Owner:   ' + l.fullOwner + ' (' + l.title + ')');
  console.log('   👥 Team:    ' + l.employees + ' Staff · ' + l.employeeSource);
  console.log('   📍 City:    ' + l.city);
  console.log('   📜 License: ' + l.licenseNumber);
  console.log('');
});
