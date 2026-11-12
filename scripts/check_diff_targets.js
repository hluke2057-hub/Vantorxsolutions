const fs = require('fs');

const q = JSON.parse(fs.readFileSync('data/verified_targets_queue.json', 'utf8'));
const qEmails = new Set(q.map(x => (x.email || '').trim().toLowerCase()));

const webTargets = JSON.parse(fs.readFileSync('website/data/normalized_lead_targets.json', 'utf8'));
const newLeads = [];

webTargets.forEach(t => {
  if (t.email && t.email.includes('@')) {
    const clean = t.email.trim().toLowerCase();
    if (!qEmails.has(clean)) {
      newLeads.push(t);
    }
  }
});

console.log(`Leads in website/data/normalized_lead_targets.json NOT in queue: ${newLeads.length}`);
newLeads.forEach(l => console.log(`+ New lead: ${l.company} | ${l.email} | ${l.website}`));
