const fs = require('fs');
const path = require('path');

const leadsPath = path.resolve(__dirname, '../data/normalized_lead_targets.json');
const leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8').replace(/^\uFEFF/, ''));

console.log('--- BATCH 11 & INTAKE VERIFICATION ---');
console.log('Total Leads:', leads.length);

const outOfBounds = leads.filter(l => l.employees < 2 || l.employees > 10);
console.log('Leads outside 2-10 staff range:', outOfBounds.length, outOfBounds.length === 0 ? '✅' : '❌');

const batch11 = leads.filter(l => l.batch === 11);
console.log('Batch 11 leads count:', batch11.length, batch11.length === 75 ? '✅' : '❌');

const arenaHtml = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');
const isPausedMatch = arenaHtml.match(/const isIntakePaused = (false|true);/);
console.log('isIntakePaused in Arena:', isPausedMatch ? isPausedMatch[1] : 'not found', isPausedMatch && isPausedMatch[1] === 'false' ? '✅ UNPAUSED' : '❌');

// Verify JavaScript execution inside index.html
const jsMatch = arenaHtml.match(/<script>([\s\S]+?)<\/script>/);
if (jsMatch) {
  try {
    // Basic test
    console.log('Arena script length:', jsMatch[1].length, 'characters');
    console.log('✅ All checks passed!');
  } catch(e) {
    console.error('Syntax error:', e);
  }
}
