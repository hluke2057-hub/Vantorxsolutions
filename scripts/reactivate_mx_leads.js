const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;

const QUEUE_FILE = path.join(__dirname, '..', 'data', 'verified_targets_queue.json');
const WEB_QUEUE_FILE = path.join(__dirname, '..', 'website', 'data', 'verified_targets_queue.json');

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

async function reactivateAndSanitize() {
  const queue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
  console.log(`Processing ${queue.length} queue entries...`);

  const now = Date.now();
  const twoDaysMs = 48 * 60 * 60 * 1000;
  const threeDaysMs = 72 * 60 * 60 * 1000;

  const domainMxCache = new Map();
  let reactivatedSkipped = 0;
  let advancedTouch2 = 0;
  let advancedTouch3 = 0;
  let keptPending = 0;

  for (const item of queue) {
    if (!item.email || !item.email.includes('@')) continue;
    const cleanEmail = item.email.trim().toLowerCase();
    const domain = cleanEmail.split('@')[1];
    const local = cleanEmail.split('@')[0];

    // Suppressed
    if (KNOWN_SUPPRESSED.has(cleanEmail) || local === 'the.owner' || domain.endsWith('.con')) {
      item.status = 'suppressed_bounced';
      continue;
    }

    // Resolve MX
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

    const primaryMx = domainMxCache.get(domain);
    if (!primaryMx) {
      if (item.status !== 'sent') {
        item.status = 'skipped_dns';
      }
      continue;
    }

    // Lead has valid active MX!
    item.mxHost = primaryMx;
    item.mx_status = 'VERIFIED';

    // 1. Reactivate falsely skipped leads
    if (item.status === 'skipped_unverified_mailbox' || (item.status === 'skipped_dns' && primaryMx)) {
      item.status = 'pending';
      item.emailSource = `MX Verified (${primaryMx})`;
      reactivatedSkipped++;
    }

    // 2. Advance multi-touch for sent leads
    if (item.status === 'sent' && item.sentAt) {
      const sentTime = new Date(item.sentAt).getTime();
      const ageMs = now - sentTime;

      if ((item.touch || 1) === 1 && ageMs >= twoDaysMs) {
        item.status = 'pending';
        item.touch = 2;
        item.resendMessageId = null;
        advancedTouch2++;
      } else if (item.touch === 2 && ageMs >= threeDaysMs) {
        item.status = 'pending';
        item.touch = 3;
        item.resendMessageId = null;
        advancedTouch3++;
      }
    }

    if (item.status === 'pending') {
      keptPending++;
    }
  }

  console.log(`Reactivated Falsely Skipped Leads with Active MX: ${reactivatedSkipped}`);
  console.log(`Advanced to Touch 2 (>= 48h):                   ${advancedTouch2}`);
  console.log(`Advanced to Touch 3 (>= 72h):                   ${advancedTouch3}`);
  console.log(`Total Pending Deliverable Leads Ready Now:     ${keptPending}`);

  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8');
  if (fs.existsSync(path.dirname(WEB_QUEUE_FILE))) {
    fs.writeFileSync(WEB_QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8');
  }
  console.log('Successfully saved to QUEUE_FILE and WEB_QUEUE_FILE.');
}

reactivateAndSanitize().catch(console.error);
