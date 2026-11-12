const fs = require('fs');
const path = require('path');
const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const envPath = path.join(root, '.env');
const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const m = env.match(/RESEND_API_KEY\s*=\s*([^\r\n]+)/);
if (!m) {
  console.log('No RESEND_API_KEY in .env');
  process.exit(1);
}
const key = m[1].trim().replace(/['"]/g, '');

(async () => {
  const res = await fetch('https://api.resend.com/emails?limit=50', {
    headers: { Authorization: 'Bearer ' + key }
  });
  const data = await res.json();
  const list = data.data || [];
  console.log('Total recent emails from Resend API:', list.length);
  const counts = {};
  for (const e of list) {
    counts[e.last_event] = (counts[e.last_event] || 0) + 1;
  }
  console.log('Status summary:', counts);
  console.log('\nLatest 15 emails:');
  for (const e of list.slice(0, 15)) {
    const detRes = await fetch('https://api.resend.com/emails/' + e.id, {
      headers: { Authorization: 'Bearer ' + key }
    });
    const det = await detRes.json();
    console.log(`- [${e.last_event}] To: ${JSON.stringify(e.to)} | From: ${e.from} | Subject: ${e.subject} | Created: ${e.created_at}`);
    if (det.bounce || det.last_event === 'bounced' || det.last_event === 'failed') {
      console.log('   Detail:', JSON.stringify(det));
    }
  }
})();
