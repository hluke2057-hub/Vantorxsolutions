const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;

const PARKED_MX = [
  'registrar-servers.com', 'parkingcrew.net', 'sedoparking.com',
  'bodis.com', 'above.com', 'eftydns.com', 'dan.com', 'afternic.com',
  'sav.com', 'cashparking.com', 'namebrightmail.com', 'jellyfish.systems'
];

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

async function main() {
  const q = JSON.parse(fs.readFileSync('data/verified_targets_queue.json', 'utf8'));
  const webTargets = JSON.parse(fs.readFileSync('website/data/normalized_lead_targets.json', 'utf8'));

  const leadMap = new Map();

  // Load from queue
  q.forEach(item => {
    if (!item.email || !item.email.includes('@')) return;
    const clean = item.email.trim().toLowerCase();
    if (!leadMap.has(clean)) {
      leadMap.set(clean, {
        id: item.id,
        company: item.company,
        owner: item.owner || 'Owner',
        email: clean,
        phone: item.phone,
        city: item.city,
        state: item.state || 'FL',
        trade: item.trade,
        service: item.service || '24/7 Emergency Dispatch',
        website: item.website,
        emailSource: item.emailSource,
        status: item.status,
        touch: item.touch || 1,
        sentAt: item.sentAt,
        estLoss: item.estLoss || '$8,000'
      });
    }
  });

  // Load from webTargets
  webTargets.forEach(item => {
    if (!item.email || !item.email.includes('@')) return;
    const clean = item.email.trim().toLowerCase();
    if (!leadMap.has(clean)) {
      leadMap.set(clean, {
        id: item.id || `lead_wt_${clean.split('@')[0]}`,
        company: item.company,
        owner: item.owner || 'Owner',
        email: clean,
        phone: item.phone,
        city: item.city,
        state: item.state || 'FL',
        trade: item.trade,
        service: item.service || '24/7 Emergency Dispatch',
        website: item.website,
        emailSource: 'Website Scraped & Verified',
        status: 'pending',
        touch: 1,
        sentAt: null,
        estLoss: '$8,000'
      });
    }
  });

  console.log(`Total unique email leads collected: ${leadMap.size}`);

  // Test MX for all domains
  const domainMxCache = new Map();
  const deliverableLeads = [];
  const rejectedLeads = [];

  for (const [email, lead] of leadMap.entries()) {
    const domain = email.split('@')[1];
    if (KNOWN_SUPPRESSED.has(email) || email.startsWith('the.owner@') || domain.endsWith('.con')) {
      rejectedLeads.push({ lead, reason: 'Suppressed / invalid prefix' });
      continue;
    }

    if (!domainMxCache.has(domain)) {
      try {
        const mx = await dns.resolveMx(domain).catch(() => null);
        if (mx && mx.length > 0) {
          const hosts = mx.map(m => (m.exchange || '').toLowerCase());
          const isParked = hosts.some(h => PARKED_MX.some(p => h.includes(p)));
          domainMxCache.set(domain, isParked ? null : hosts[0]);
        } else {
          domainMxCache.set(domain, null);
        }
      } catch (e) {
        domainMxCache.set(domain, null);
      }
    }

    const primaryMx = domainMxCache.get(domain);
    if (primaryMx) {
      lead.primaryMx = primaryMx;
      deliverableLeads.push(lead);
    } else {
      rejectedLeads.push({ lead, reason: 'No MX or Parked' });
    }
  }

  console.log(`Deliverable leads with verified active MX: ${deliverableLeads.length}`);
  console.log(`Rejected leads: ${rejectedLeads.length}`);

  const byStatus = {};
  deliverableLeads.forEach(l => byStatus[l.status] = (byStatus[l.status] || 0) + 1);
  console.log('Deliverable by status:', byStatus);

  // Group by MX provider
  const mxProviders = {};
  deliverableLeads.forEach(l => {
    let p = 'Other';
    if (l.primaryMx.includes('google') || l.primaryMx.includes('aspmx')) p = 'Google Workspace';
    else if (l.primaryMx.includes('outlook') || l.primaryMx.includes('protection.outlook.com')) p = 'Microsoft 365';
    else if (l.primaryMx.includes('pphosted') || l.primaryMx.includes('proofpoint')) p = 'Proofpoint';
    else if (l.primaryMx.includes('mimecast')) p = 'Mimecast';
    else if (l.primaryMx.includes('secureserver.net')) p = 'GoDaddy';
    else if (l.primaryMx.includes('zoho')) p = 'Zoho';
    mxProviders[p] = (mxProviders[p] || 0) + 1;
  });
  console.log('Deliverable MX providers:', mxProviders);
}

main().catch(console.error);
