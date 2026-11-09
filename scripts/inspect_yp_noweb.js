const fs = require('fs');

const rawYP = JSON.parse(fs.readFileSync('data/yp_scraped_raw.json', 'utf8'));
console.log('Raw YP count:', rawYP.length);

const ypNoWeb = rawYP.filter(x => !x.hasWeb);
console.log('YP with NO WEBSITE:', ypNoWeb.length);

ypNoWeb.forEach((x, i) => {
  console.log(`[${i+1}] ${x.name} | Phone: ${x.phone} | Addr: ${x.street} ${x.locality} | City: ${x.targetCity} | Trade: ${x.trade}`);
});
