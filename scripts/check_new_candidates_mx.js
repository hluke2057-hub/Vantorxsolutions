const fs = require('fs');
const dns = require('dns').promises;

const PARKED = ['parking', 'sedo', 'registrar-servers', 'dan.com', 'above.com', 'namebright', 'sav.com', 'bodis'];
const q = JSON.parse(fs.readFileSync('data/verified_targets_queue.json', 'utf8'));
const qEmails = new Set(q.map(x => (x.email || '').trim().toLowerCase()));

const webTargets = JSON.parse(fs.readFileSync('website/data/normalized_lead_targets.json', 'utf8'));

async function checkNew() {
  const candidates = [];
  webTargets.forEach(t => {
    if (t.email && t.email.includes('@')) {
      const clean = t.email.trim().toLowerCase();
      if (!qEmails.has(clean)) {
        candidates.push({ ...t, email: clean });
      }
    }
  });

  console.log(`Checking MX for ${candidates.length} new leads...`);
  const validNew = [];

  for (const c of candidates) {
    const domain = c.email.split('@')[1];
    try {
      const mx = await dns.resolveMx(domain).catch(() => null);
      if (mx && mx.length > 0) {
        const hosts = mx.map(m => (m.exchange || '').toLowerCase());
        const isParked = hosts.some(h => PARKED.some(p => h.includes(p)));
        if (!isParked) {
          validNew.push({
            company: c.company,
            email: c.email,
            phone: c.phone,
            primaryMx: hosts[0]
          });
        }
      }
    } catch (e) {}
  }

  console.log(`Valid new deliverable leads with active MX: ${validNew.length}`);
  validNew.slice(0, 10).forEach(v => console.log(`- ${v.company} | ${v.email} | MX: ${v.primaryMx}`));
}

checkNew().catch(console.error);
