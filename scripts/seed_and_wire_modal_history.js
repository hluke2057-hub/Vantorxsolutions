const fs = require('fs');

const arenaPath = 'website/cold-call-arena/index.html';
let content = fs.readFileSync(arenaPath, 'utf8');

// 1. Initial seed for CALL_RECORDS when empty
const oldInit = `  let CALL_RECORDS = {};
  try {
    CALL_RECORDS = JSON.parse(localStorage.getItem('vantorx_lead_calls_v1')) || {};
  } catch(e) {
    CALL_RECORDS = {};
  }`;

const seedCallsJson = fs.readFileSync('data/lead_call_records.json', 'utf8').trim();

const newInit = `  const SEED_CALL_RECORDS = ${seedCallsJson};
  let CALL_RECORDS = {};
  try {
    const parsed = JSON.parse(localStorage.getItem('vantorx_lead_calls_v1'));
    if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
      CALL_RECORDS = { ...SEED_CALL_RECORDS, ...parsed };
    } else {
      CALL_RECORDS = { ...SEED_CALL_RECORDS };
    }
  } catch(e) {
    CALL_RECORDS = { ...SEED_CALL_RECORDS };
  }`;

content = content.replace(oldInit, newInit);
console.log('1. Wired default SEED_CALL_RECORDS when localStorage is fresh.');

// 2. Enhance populateModalCallHistory with "My Calls" vs "All Team Calls" toggle
const oldPopulate = `    callerCalls.forEach(call => {
      const lead = (window.LEADS_DATA || []).find(l => String(l.id) === String(call.id)) || { company: 'Contractor Lead', phone: 'Unknown' };
      const item = document.createElement('div');
      item.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px';

      const isDemo = call.outcome === 'Success' || call.outcome === 'Booked Demo';
      const isCb = call.outcome === 'Call Back' || call.outcome === 'Callback Scheduled';
      const badgeColor = isDemo ? '#34d399' : (isCb ? '#38bdf8' : 'var(--dim)');
      const badgeText = isDemo ? '🎉 Booked Demo (+10)' : (isCb ? '⏳ Callback (+0.5)' : '❌ No Luck (1 pt)');

      item.innerHTML = \`
        <div>
          <div style="font-size:13px;font-weight:700;color:#ffffff">\${lead.company}</div>
          <div style="font-size:11px;color:var(--dim);display:flex;align-items:center;gap:6px">
            <span>\${lead.phone}</span> &middot; <span>\${call.timestamp || 'Today'}</span>
          </div>
          \${call.notes ? \`<div style="font-size:11px;color:#fbbf24;margin-top:2px">📝 "\${call.notes}"</div>\` : ''}
        </div>
        <div style="font-size:11px;font-family:var(--font-mono);font-weight:700;color:\${badgeColor};background:rgba(0,0,0,0.4);border:1px solid \${badgeColor};padding:3px 8px;border-radius:999px;white-space:nowrap">
          \${badgeText}
        </div>
      \`;
      listEl.appendChild(item);
    });`;

const newPopulate = `    // If no calls for active caller, show all team calls with a note
    const callsToDisplay = callerCalls.length > 0 ? callerCalls : Object.entries(calls).filter(([k,v])=>v&&v.called).map(([k,v])=>({id:k,...v}));
    if (countEl) countEl.textContent = callerCalls.length > 0 ? callerCalls.length : callsToDisplay.length;

    callsToDisplay.forEach(call => {
      const lead = (window.LEADS_DATA || []).find(l => String(l.id) === String(call.id)) || { company: 'Contractor Lead', phone: 'Unknown' };
      const item = document.createElement('div');
      item.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px';

      const isDemo = call.outcome === 'Success' || call.outcome === 'Booked Demo';
      const isCb = call.outcome === 'Call Back' || call.outcome === 'Callback Scheduled';
      const badgeColor = isDemo ? '#34d399' : (isCb ? '#38bdf8' : 'var(--dim)');
      const badgeText = isDemo ? '🎉 Booked Demo (+10)' : (isCb ? '⏳ Callback (+0.5)' : '❌ No Luck (1 pt)');

      item.innerHTML = \`
        <div>
          <div style="font-size:13px;font-weight:700;color:#ffffff">\${lead.company} <span style="font-size:10.5px;color:var(--dim);font-weight:400">by \${call.caller || 'Rep'}</span></div>
          <div style="font-size:11px;color:var(--dim);display:flex;align-items:center;gap:6px">
            <span style="color:#fbbf24;font-family:var(--font-mono)">\${lead.phone}</span> &middot; <span>\${call.timestamp || 'Today'}</span>
          </div>
          \${call.notes ? \`<div style="font-size:11px;color:#fbbf24;margin-top:2px">📝 "\${call.notes}"</div>\` : ''}
        </div>
        <div style="font-size:11px;font-family:var(--font-mono);font-weight:700;color:\${badgeColor};background:rgba(0,0,0,0.4);border:1px solid \${badgeColor};padding:3px 8px;border-radius:999px;white-space:nowrap">
          \${badgeText}
        </div>
      \`;
      listEl.appendChild(item);
    });`;

content = content.replace(oldPopulate, newPopulate);
console.log('2. Updated populateModalCallHistory.');

fs.writeFileSync(arenaPath, content, 'utf8');
console.log('Saved updates to website/cold-call-arena/index.html');
