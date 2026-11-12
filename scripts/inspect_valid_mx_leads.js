const fs = require('fs');
const dns = require('dns').promises;

const q = JSON.parse(fs.readFileSync('data/verified_targets_queue.json', 'utf8'));
const PARKED = ['parking', 'sedo', 'registrar-servers', 'dan.com', 'above.com', 'namebright', 'sav.com', 'bodis'];

const KNOWN_SUPPRESSED = new Set([
  'dispatch@thecleanplumbers.com',
  'charlie@thecleanplumbers.com',
  'dispatch@unitedplumbingdrain.com',
  'steve@unitedplumbingdrain.com',
  'dispatch@benefieldplumbing.com',
  'larry@benefieldplumbing.com',
  'service@asuperiormechanical.com',
  'dispatch@olinplumbing.com',
  'the.owner@olinplumbing.com',
  'estimates@arrysroofingservices.com',
  'matthew@arrysroofing.com',
  'the.owner@clarkroofing.com',
  'estimates@clarkroofing.com',
  'gregg@bestroofing.com',
  'estimates@bestroofing.com',
  'tommy@allyearcoolingheating.com',
  'dispatch@bocaratonplumbingpro.com',
  'dispatch@bocaratonplumbingpros.com',
  'danny@astarelectric.com'
]);

async function run() {
  const domainMxCache = new Map();
  
  let totalValidLeads = 0;
  const statusMap = {};
  const validLeads = [];

  for (const item of q) {
    if (!item.email || !item.email.includes('@')) continue;
    const cleanEmail = item.email.trim().toLowerCase();
    const domain = cleanEmail.split('@')[1];
    const local = cleanEmail.split('@')[0];

    // Check suppression
    if (KNOWN_SUPPRESSED.has(cleanEmail) || local === 'the.owner' || domain.endsWith('.con')) {
      continue;
    }

    if (!domainMxCache.has(domain)) {
      try {
        const mx = await dns.resolveMx(domain).catch(() => null);
        if (mx && mx.length > 0) {
          const hosts = mx.map(m => (m.exchange || '').toLowerCase());
          const isParked = hosts.some(h => PARKED.some(p => h.includes(p)));
          domainMxCache.set(domain, isParked ? false : hosts[0]);
        } else {
          domainMxCache.set(domain, false);
        }
      } catch (e) {
        domainMxCache.set(domain, false);
      }
    }

    const mxHost = domainMxCache.get(domain);
    if (mxHost) {
      totalValidLeads++;
      statusMap[item.status] = (statusMap[item.status] || 0) + 1;
      validLeads.push({
        id: item.id,
        company: item.company,
        email: cleanEmail,
        status: item.status,
        mxHost,
        touch: item.touch || 1,
        sentAt: item.sentAt
      });
    }
  }

  console.log(`Total valid leads with active MX: ${totalValidLeads}`);
  console.log('Status breakdown of valid MX leads:', statusMap);
}

run().catch(console.error);
