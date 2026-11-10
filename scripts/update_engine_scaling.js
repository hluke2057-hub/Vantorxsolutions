const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'cloud_outbound_engine.js');
let code = fs.readFileSync(p, 'utf8');

// 1. Add KNOWN_SUPPRESSED and update sendPhysicalEmail
const target1 = 'async function sendPhysicalEmail(lead) {\n  if (!RESEND_API_KEY) {';
const replacement1 = `const KNOWN_SUPPRESSED = new Set([
  'dispatch@thecleanplumbers.com',
  'dispatch@unitedplumbingdrain.com',
  'dispatch@benefieldplumbing.com',
  'service@asuperiormechanical.com',
  'dispatch@olinplumbing.com',
  'estimates@arrysroofingservices.com'
]);

async function sendPhysicalEmail(lead) {
  if (!RESEND_API_KEY) {
    console.warn(\`[Resend Engine] Skipping physical send for \${lead.email} — RESEND_API_KEY not configured.\`);
    return null;
  }

  const cleanEmail = (lead.email || '').trim().toLowerCase();
  if (KNOWN_SUPPRESSED.has(cleanEmail)) {
    console.warn(\`[Suppression Guard] Skipping \${lead.company} (\${cleanEmail}) — Address is in Resend Suppression list.\`);
    return { skipped: true, error: 'Recipient is in Resend Suppression List' };
  }`;

// Handle CRLF or LF
if (code.includes(target1)) {
  code = code.replace(target1, replacement1);
  console.log('✓ Replaced target1 (LF)');
} else if (code.includes(target1.replace(/\n/g, '\r\n'))) {
  code = code.replace(target1.replace(/\n/g, '\r\n'), replacement1.replace(/\n/g, '\r\n'));
  console.log('✓ Replaced target1 (CRLF)');
} else {
  console.warn('Could not find target1');
}

// 2. Scalable batch size (10 per batch default, scalable up to 25+)
const target2 = `  // 3. Take next 5 verified targets (Safe Drip)
  const batchSize = Math.min(5, pendingTargets.length);`;

const replacement2 = `  // 3. Take next verified targets (Scaled Outbound: 10-15/batch or configurable)
  const defaultBatch = 10;
  const batchArg = process.argv.find(a => a.startsWith('--batch='));
  const requestedBatch = batchArg ? parseInt(batchArg.split('=')[1], 10) : (parseInt(process.env.BATCH_SIZE, 10) || defaultBatch);
  const batchSize = Math.min(requestedBatch, pendingTargets.length);`;

if (code.includes(target2)) {
  code = code.replace(target2, replacement2);
  console.log('✓ Replaced target2 (LF)');
} else if (code.includes(target2.replace(/\n/g, '\r\n'))) {
  code = code.replace(target2.replace(/\n/g, '\r\n'), replacement2.replace(/\n/g, '\r\n'));
  console.log('✓ Replaced target2 (CRLF)');
} else {
  console.warn('Could not find target2');
}

fs.writeFileSync(p, code, 'utf8');
console.log('Updated cloud_outbound_engine.js successfully.');
