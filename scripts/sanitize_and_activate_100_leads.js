/**
 * Sanitizes and activates 100+ clean, MX-verified contractor leads in verified_targets_queue.json
 */
const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;

const QUEUE_FILE = path.join(__dirname, '..', 'data', 'verified_targets_queue.json');
const WEB_QUEUE_FILE = path.join(__dirname, '..', 'website', 'data', 'verified_targets_queue.json');

const KNOWN_SUPPRESSED = new Set([
  'dispatch@thecleanplumbers.com',
  'dispatch@unitedplumbingdrain.com',
  'dispatch@benefieldplumbing.com',
  'service@asuperiormechanical.com',
  'dispatch@olinplumbing.com',
  'estimates@arrysroofingservices.com'
]);

async function checkMx(domain) {
  if (!domain || !domain.includes('.')) return false;
  if (domain.endsWith('.con') || domain.endsWith('.coom') || domain.endsWith('roofin.com') || domain.endsWith('constructi.com')) {
    return false;
  }
  try {
    const mx = await dns.resolveMx(domain);
    return mx && mx.length > 0;
  } catch(e) {
    return false;
  }
}

async function main() {
  console.log('Sanitizing and activating verified targets queue...');
  const queue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
  console.log(`Loaded ${queue.length} targets.`);

  const domainMxMap = new Map();
  let activatedPending = 0;
  let shieldedCount = 0;
  let alreadySentCount = 0;
  let suppressedCount = 0;

  for (const item of queue) {
    const email = (item.email || '').trim().toLowerCase();

    // 1. Check known suppressed / bounced
    if (KNOWN_SUPPRESSED.has(email)) {
      item.status = 'suppressed_in_resend';
      suppressedCount++;
      continue;
    }

    // 2. Check already sent
    if (item.status === 'sent' && item.resendMessageId) {
      alreadySentCount++;
      continue;
    }

    // 3. Check email validity
    const match = email.match(/^[^\s@]+@([^\s@]+\.[a-zA-Z]{2,})$/);
    if (!match) {
      item.status = 'skipped_invalid_email';
      shieldedCount++;
      continue;
    }

    const domain = match[1];
    let hasMx = domainMxMap.get(domain);
    if (hasMx === undefined) {
      hasMx = await checkMx(domain);
      domainMxMap.set(domain, hasMx);
    }

    if (hasMx) {
      item.status = 'pending';
      item.mx_status = 'VERIFIED';
      activatedPending++;
    } else {
      item.status = 'skipped_dns';
      item.mx_status = 'NO_MX_RECORDS';
      shieldedCount++;
    }
  }

  console.log('--- Sanitation Results ---');
  console.log(`✅ Activated Pending (100% Valid MX): ${activatedPending}`);
  console.log(`🛡️ Shielded (Dead / Missing MX):      ${shieldedCount}`);
  console.log(`🚫 Known Suppressed in Resend:        ${suppressedCount}`);
  console.log(`📦 Already Sent:                      ${alreadySentCount}`);

  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8');
  if (fs.existsSync(path.dirname(WEB_QUEUE_FILE))) {
    fs.writeFileSync(WEB_QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8');
  }
  console.log(`Saved updated queue to ${QUEUE_FILE} and ${WEB_QUEUE_FILE}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
