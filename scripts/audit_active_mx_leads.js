const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const qPath = path.join(root, 'data/verified_targets_queue.json');
const queue = JSON.parse(fs.readFileSync(qPath, 'utf8'));

const PARKED_MX_PATTERNS = [
  'registrar-servers.com', 'parkingcrew.net', 'sedoparking.com',
  'bodis.com', 'above.com', 'eftydns.com', 'dan.com', 'afternic.com',
  'sav.com', 'cashparking.com', 'namebrightmail.com', 'jellyfish.systems'
];

async function checkDomains() {
  const domains = new Map();
  queue.forEach(item => {
    if (!item.email || !item.email.includes('@')) return;
    const domain = item.email.split('@')[1].trim().toLowerCase();
    if (!domains.has(domain)) domains.set(domain, []);
    domains.get(domain).push(item);
  });

  console.log(`Checking MX records for ${domains.size} unique domains across ${queue.length} queue items...`);
  
  let validDomains = 0;
  let invalidDomains = 0;
  let validLeadsCount = 0;
  const verifiedDeliverable = [];

  for (const [dom, leads] of domains.entries()) {
    try {
      const mx = await dns.resolveMx(dom).catch(() => null);
      if (mx && mx.length > 0) {
        const mxHosts = mx.map(r => (r.exchange || '').toLowerCase());
        const isParked = mxHosts.some(h => PARKED_MX_PATTERNS.some(p => h.includes(p)));
        if (!isParked) {
          validDomains++;
          validLeadsCount += leads.length;
          leads.forEach(l => {
            verifiedDeliverable.push({
              id: l.id,
              company: l.company,
              email: l.email,
              domain: dom,
              primaryMx: mxHosts[0],
              status: l.status
            });
          });
        } else {
          invalidDomains++;
        }
      } else {
        invalidDomains++;
      }
    } catch (e) {
      invalidDomains++;
    }
  }

  console.log(`\nResults:`);
  console.log(`Valid active MX domains: ${validDomains} (${validLeadsCount} leads)`);
  console.log(`Invalid / No MX domains: ${invalidDomains}`);
  
  // Breakdown of statuses among valid leads
  const validStatus = {};
  verifiedDeliverable.forEach(l => validStatus[l.status] = (validStatus[l.status] || 0) + 1);
  console.log(`Status breakdown of valid leads:`, validStatus);

  console.log(`\nSample 15 verified deliverable leads with active MX:`);
  verifiedDeliverable.slice(0, 15).forEach(l => {
    console.log(`- ${l.company}: ${l.email} (MX: ${l.primaryMx}) [status: ${l.status}]`);
  });
}

checkDomains().catch(console.error);
