const fs = require('fs');
const dns = require('dns').promises;

const q = JSON.parse(fs.readFileSync('data/verified_targets_queue.json', 'utf8'));
const PARKED = ['parking', 'sedo', 'registrar-servers', 'dan.com', 'above.com', 'namebright', 'sav.com', 'bodis'];

async function analyze() {
  const domains = new Set();
  q.forEach(i => {
    if (i.email && i.email.includes('@')) {
      domains.add(i.email.split('@')[1].toLowerCase());
    }
  });

  console.log(`Unique domains in queue: ${domains.size}`);

  let noMx = 0;
  let parked = 0;
  let valid = 0;
  let errored = 0;

  for (const d of domains) {
    try {
      const mx = await dns.resolveMx(d).catch(() => null);
      if (!mx || mx.length === 0) {
        noMx++;
      } else {
        const mxHosts = mx.map(m => (m.exchange || '').toLowerCase());
        const isParked = mxHosts.some(h => PARKED.some(p => h.includes(p)));
        if (isParked) parked++;
        else valid++;
      }
    } catch (e) {
      errored++;
    }
  }

  console.log({ valid, noMx, parked, errored });
}

analyze().catch(console.error);
