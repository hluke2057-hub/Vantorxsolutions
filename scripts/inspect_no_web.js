const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('data/yp_scraped_raw.json', 'utf8'));
const noWeb = raw.filter(x => !x.hasWeb);
console.log('Total scraped with NO WEBSITE:', noWeb.length);
noWeb.slice(0, 15).forEach((x, i) => {
  console.log(`${i+1}: ${x.name} | ${x.phone} | ${x.street} ${x.locality} | Trade: ${x.trade} | YP: ${x.years || 'N/A'}`);
});
