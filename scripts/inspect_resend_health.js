// scripts/inspect_resend_health.js
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/RESEND_API_KEY=([^\r\n]+)/);
if (!keyMatch) {
  console.error('RESEND_API_KEY missing in .env');
  process.exit(1);
}
const apiKey = keyMatch[1].trim();
console.log('Using Resend API key ending in:', apiKey.slice(-6));

(async () => {
  // 1. Domains
  console.log('\n--- 1. DOMAINS STATUS ---');
  const domRes = await fetch('https://api.resend.com/domains', {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  const domains = await domRes.json();
  console.log('Domains:', JSON.stringify(domains, null, 2));

  // 2. Recent Emails
  console.log('\n--- 2. RECENT EMAILS ---');
  const emRes = await fetch('https://api.resend.com/emails', {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  const emails = await emRes.json();
  console.log('Emails response:', emails);

  // 3. Check Suppressions
  console.log('\n--- 3. SUPPRESSIONS LIST ---');
  // Resend API endpoint for suppressions or bounces
  try {
    const supRes = await fetch('https://api.resend.com/suppressions', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (supRes.ok) {
      const suppressions = await supRes.json();
      console.log('Suppressions:', JSON.stringify(suppressions, null, 2));
    } else {
      console.log('Suppressions endpoint returned:', supRes.status, await supRes.text());
    }
  } catch (e) {
    console.error('Suppressions check error:', e.message);
  }

  // 4. Check specific email details (e.g. why dispatch@thecleanplumbers.com failed)
  if (emails.data && emails.data.length > 0) {
    console.log('\n--- 4. INSPECTING FIRST 5 EMAIL RECORDS ---');
    for (const em of emails.data.slice(0, 5)) {
      const detailRes = await fetch(`https://api.resend.com/emails/${em.id}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (detailRes.ok) {
        const detail = await detailRes.json();
        console.log(`Email ID ${em.id} to ${detail.to}: status=${detail.last_event || 'unknown'}`);
        console.log('Detail:', JSON.stringify(detail, null, 2));
      }
    }
  }
})();
