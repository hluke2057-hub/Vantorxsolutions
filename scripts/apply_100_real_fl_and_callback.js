/**
 * Applies 100 100% Real Florida Leads and Full Callback System
 * to website/cold-call-arena/index.html and website/cold-call-arena/florida-no-website.html
 */
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const LEADS_FILE = path.join(ROOT_DIR, 'data', 'florida_100_no_website_leads.json');
const ARENA_FILE = path.join(ROOT_DIR, 'website', 'cold-call-arena', 'index.html');
const VAULT_FILE = path.join(ROOT_DIR, 'website', 'cold-call-arena', 'florida-no-website.html');

const realLeads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
console.log(`Loaded ${realLeads.length} real Florida leads.`);

const leadsJsString = '  window.FLORIDA_100_NO_WEBSITE_LEADS = ' + JSON.stringify(realLeads, null, 2) + ';';

// ==========================================
// 1. UPDATE website/cold-call-arena/index.html
// ==========================================
console.log('1. Updating website/cold-call-arena/index.html...');
let arenaHtml = fs.readFileSync(ARENA_FILE, 'utf8');

// A. Replace Leads Array
const arenaStartMarker = 'window.FLORIDA_100_NO_WEBSITE_LEADS = [';
const arenaStartIdx = arenaHtml.indexOf(arenaStartMarker);
if (arenaStartIdx === -1) {
  throw new Error('Could not find window.FLORIDA_100_NO_WEBSITE_LEADS in index.html');
}

// Find closing ]; after start
let arenaEndIdx = arenaHtml.indexOf('];', arenaStartIdx);
if (arenaEndIdx === -1) {
  throw new Error('Could not find end of window.FLORIDA_100_NO_WEBSITE_LEADS in index.html');
}
arenaEndIdx += 2; // include ];

arenaHtml = arenaHtml.slice(0, arenaStartIdx) + leadsJsString.trim() + arenaHtml.slice(arenaEndIdx);
console.log('  ✓ Replaced window.FLORIDA_100_NO_WEBSITE_LEADS with 100 Real Leads');

// B. Add Callbacks Scheduled Metric Card to fl-metrics-grid
if (!arenaHtml.includes('flStatCallbacksCount')) {
  const targetMetrics = `<div class="fl-metric-card">
          <div class="fl-metric-num" style="color:#38bdf8" id="flStatClosedCount">0</div>
          <div class="fl-metric-label">Sites Closed Today</div>
        </div>`;
  const replacementMetrics = `<div class="fl-metric-card">
          <div class="fl-metric-num" style="color:#38bdf8" id="flStatClosedCount">0</div>
          <div class="fl-metric-label">Sites Closed Today</div>
        </div>
        <div class="fl-metric-card" onclick="filterFloridaByCallback()" style="cursor:pointer" title="Click to view all scheduled callbacks">
          <div class="fl-metric-num" style="color:#f59e0b" id="flStatCallbacksCount">0</div>
          <div class="fl-metric-label">⏳ Callbacks Scheduled</div>
        </div>`;

  if (arenaHtml.includes(targetMetrics)) {
    arenaHtml = arenaHtml.replace(targetMetrics, replacementMetrics);
    console.log('  ✓ Added Callbacks Scheduled KPI Card');
  } else {
    console.warn('  ⚠️ Could not find exact targetMetrics for KPI card');
  }
}

// C. Add CALLBACK Option to #flDispositionSelect
if (!arenaHtml.includes('<option value="CALLBACK">⏳ Scheduled Callback</option>')) {
  const targetDispSelect = `<select id="flDispositionSelect" class="fl-select" onchange="handleFloridaFilterChange()">
          <option value="ALL">All Call Statuses</option>
          <option value="UNTOUCHED">⚪ Not Called Yet</option>`;
  const replacementDispSelect = `<select id="flDispositionSelect" class="fl-select" onchange="handleFloridaFilterChange()">
          <option value="ALL">All Call Statuses</option>
          <option value="CALLBACK">⏳ Scheduled Callback</option>
          <option value="UNTOUCHED">⚪ Not Called Yet</option>`;

  if (arenaHtml.includes(targetDispSelect)) {
    arenaHtml = arenaHtml.replace(targetDispSelect, replacementDispSelect);
    console.log('  ✓ Added CALLBACK to flDispositionSelect filter');
  } else {
    // Try CRLF
    const targetDispSelectCRLF = targetDispSelect.replace(/\n/g, '\r\n');
    const replacementDispSelectCRLF = replacementDispSelect.replace(/\n/g, '\r\n');
    if (arenaHtml.includes(targetDispSelectCRLF)) {
      arenaHtml = arenaHtml.replace(targetDispSelectCRLF, replacementDispSelectCRLF);
      console.log('  ✓ Added CALLBACK to flDispositionSelect filter (CRLF)');
    }
  }
}

// D. Add Callback Modal HTML if not present
if (!arenaHtml.includes('id="flCallbackModal"')) {
  const modalHtml = `
<!-- ⏳ Florida No-Website Tab Callback Modal -->
<div class="modal-overlay" id="flCallbackModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:rgba(5,8,14,0.92);backdrop-filter:blur(14px);align-items:center;justify-content:center" onclick="if(event.target===this)closeFloridaCallbackModal()">
  <div class="modal-box" style="max-width:560px;width:95%;border:1.5px solid rgba(245,158,11,0.5);box-shadow:0 0 50px rgba(0,0,0,0.9),0 0 30px rgba(245,158,11,0.25);border-radius:18px;padding:24px;background:#0b0f19">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.1)">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:26px">⏳</span>
        <div>
          <h3 style="font-family:var(--font-head);font-size:19px;color:#fbbf24;margin:0" id="flCbModalTitle">Schedule Callback</h3>
          <span style="font-size:11.5px;color:var(--dim)" id="flCbModalSubtitle">Follow up on website preview</span>
        </div>
      </div>
      <button type="button" class="btn btn-ghost btn-sm" onclick="closeFloridaCallbackModal()" style="font-size:16px;padding:4px 8px;color:#94a3b8">✕</button>
    </div>

    <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:14px;margin-bottom:16px">
      <div style="font-size:11px;font-family:var(--font-mono);color:var(--accent2);font-weight:800;text-transform:uppercase;margin-bottom:4px">Target Profile:</div>
      <div style="font-size:16px;font-weight:800;color:#ffffff" id="flCbModalLeadCompany">Company Name</div>
      <div style="font-size:12.5px;color:#cbd5e1;margin-top:2px">
        Owner: <strong style="color:#fbbf24" id="flCbModalLeadOwner">Owner Name</strong> · <span id="flCbModalLeadTrade">Trade</span> · <span id="flCbModalLeadCity">City, FL</span>
      </div>
      <div style="font-size:13px;color:#38bdf8;font-weight:700;margin-top:6px;display:flex;align-items:center;gap:6px">
        <span>📞 Direct Phone:</span>
        <a id="flCbModalLeadPhoneLink" href="#" style="color:#38bdf8;text-decoration:none;font-family:var(--font-mono)"><span id="flCbModalLeadPhone">(813) 000-0000</span></a>
      </div>
    </div>

    <!-- Quick Presets -->
    <div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:8px">⚡ Quick Presets:</div>
      <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px">
        <button type="button" class="btn btn-ghost btn-sm" onclick="setFlCbPreset(2)" style="border:1px solid rgba(255,255,255,0.15);color:#e2e8f0;font-size:12px">⚡ +2 Hours</button>
        <button type="button" class="btn btn-ghost btn-sm" onclick="setFlCbPresetTomorrow(9, 30)" style="border:1px solid rgba(245,158,11,0.4);color:#fbbf24;font-size:12px">📅 Tmrw 9:30 AM</button>
        <button type="button" class="btn btn-ghost btn-sm" onclick="setFlCbPresetTomorrow(14, 0)" style="border:1px solid rgba(56,189,248,0.4);color:#38bdf8;font-size:12px">📅 Tmrw 2:00 PM</button>
      </div>
    </div>

    <!-- Date/Time Picker -->
    <div style="margin-bottom:14px">
      <label style="display:block;font-size:12px;font-weight:700;color:#cbd5e1;margin-bottom:6px">📅 Callback Date &amp; Time:</label>
      <input type="datetime-local" id="flCbDateTimeInput" style="width:100%;padding:10px 12px;background:#070a12;border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#ffffff;font-size:14px;box-sizing:border-box" />
    </div>

    <!-- Notes -->
    <div style="margin-bottom:18px">
      <label style="display:block;font-size:12px;font-weight:700;color:#cbd5e1;margin-bottom:6px">📝 Follow-Up Notes &amp; Objection Context:</label>
      <textarea id="flCbNotesInput" rows="3" placeholder="e.g. Owner is out on job site until 2 PM. Call back to text 30-second mobile website mockup and close for $997..." style="width:100%;padding:10px 12px;background:#070a12;border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#ffffff;font-size:13px;resize:vertical;box-sizing:border-box"></textarea>
    </div>

    <!-- Actions -->
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.1)">
      <button type="button" class="btn btn-ghost btn-sm" onclick="clearFloridaCallback()" style="border:1px solid rgba(239,68,68,0.4);color:#f87171">🗑️ Clear Callback</button>
      <div style="display:flex;gap:8px">
        <button type="button" class="btn btn-ghost btn-sm" onclick="closeFloridaCallbackModal()" style="color:#94a3b8">Cancel</button>
        <button type="button" class="btn btn-gold btn-sm" onclick="saveFloridaCallbackFromModal()" style="font-weight:800;padding:8px 18px">💾 Save Callback ➔</button>
      </div>
    </div>
  </div>
</div>
`;
  // Insert before closing body
  const bodyClose = '</body>';
  arenaHtml = arenaHtml.replace(bodyClose, modalHtml + '\n' + bodyClose);
  console.log('  ✓ Injected flCallbackModal HTML');
}

// E. Update renderFloridaLeadsTable and Callback JS logic
const oldRenderFnTarget = `window.renderFloridaLeadsTable = function() {`;
const oldRenderFnIdx = arenaHtml.indexOf(oldRenderFnTarget);

if (oldRenderFnIdx !== -1) {
  // Let's replace the render function and inject full callback helper functions
  const newCallbackLogic = `
window.CURRENT_FL_CB_LEAD_ID = null;

window.openFloridaCallbackModal = function(leadId) {
  const lead = (window.FLORIDA_100_NO_WEBSITE_LEADS && window.FLORIDA_100_NO_WEBSITE_LEADS.find(l => l.id === leadId)) || window.FL_CURRENT_SELECTED_LEAD;
  if (!lead) return;
  window.CURRENT_FL_CB_LEAD_ID = lead.id;

  const titleEl = document.getElementById('flCbModalTitle'); if (titleEl) titleEl.textContent = 'Schedule Callback: ' + lead.company;
  const subEl = document.getElementById('flCbModalSubtitle'); if (subEl) subEl.textContent = lead.city + ', FL · ' + lead.trade;
  const compEl = document.getElementById('flCbModalLeadCompany'); if (compEl) compEl.textContent = lead.company;
  const ownerEl = document.getElementById('flCbModalLeadOwner'); if (ownerEl) ownerEl.textContent = lead.owner + (lead.fullOwner ? ' (' + lead.fullOwner + ')' : '');
  const tradeEl = document.getElementById('flCbModalLeadTrade'); if (tradeEl) tradeEl.textContent = lead.trade;
  const cityEl = document.getElementById('flCbModalLeadCity'); if (cityEl) cityEl.textContent = lead.city + ', FL';
  const phoneEl = document.getElementById('flCbModalLeadPhone'); if (phoneEl) phoneEl.textContent = lead.phone;
  const phoneLink = document.getElementById('flCbModalLeadPhoneLink'); if (phoneLink) phoneLink.href = 'tel:' + lead.phone.replace(/[^0-9]/g, '');

  const rawCb = localStorage.getItem('vantorx_fl_cb_' + lead.id);
  if (rawCb) {
    try {
      const cb = JSON.parse(rawCb);
      const dtInput = document.getElementById('flCbDateTimeInput'); if (dtInput) dtInput.value = cb.time || '';
      const notesInput = document.getElementById('flCbNotesInput'); if (notesInput) notesInput.value = cb.note || '';
    } catch(e) {}
  } else {
    window.setFlCbPreset(2);
    const notesInput = document.getElementById('flCbNotesInput'); if (notesInput) notesInput.value = '';
  }

  const modal = document.getElementById('flCallbackModal');
  if (modal) modal.style.display = 'flex';
};

window.closeFloridaCallbackModal = function() {
  const modal = document.getElementById('flCallbackModal');
  if (modal) modal.style.display = 'none';
  window.CURRENT_FL_CB_LEAD_ID = null;
};

window.setFlCbPreset = function(hours) {
  const now = new Date();
  now.setHours(now.getHours() + hours);
  now.setMinutes(Math.round(now.getMinutes() / 15) * 15);
  now.setSeconds(0);
  now.setMilliseconds(0);
  const pad = n => String(n).padStart(2, '0');
  const str = now.getFullYear() + '-' + pad(now.getMonth()+1) + '-' + pad(now.getDate()) + 'T' + pad(now.getHours()) + ':' + pad(now.getMinutes());
  const input = document.getElementById('flCbDateTimeInput');
  if (input) input.value = str;
};

window.setFlCbPresetTomorrow = function(hour, min) {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(hour);
  d.setMinutes(min);
  d.setSeconds(0);
  d.setMilliseconds(0);
  const pad = n => String(n).padStart(2, '0');
  const str = d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  const input = document.getElementById('flCbDateTimeInput');
  if (input) input.value = str;
};

window.saveFloridaCallbackFromModal = function() {
  const id = window.CURRENT_FL_CB_LEAD_ID;
  if (!id) return;

  const dtVal = document.getElementById('flCbDateTimeInput') ? document.getElementById('flCbDateTimeInput').value : '';
  const noteVal = document.getElementById('flCbNotesInput') ? document.getElementById('flCbNotesInput').value.trim() : '';

  let readableStr = 'Callback Scheduled';
  if (dtVal) {
    const dt = new Date(dtVal);
    readableStr = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' ' +
                  dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  localStorage.setItem('vantorx_fl_disp_' + id, 'CALLBACK');
  localStorage.setItem('vantorx_fl_cb_' + id, JSON.stringify({
    time: dtVal,
    timeStr: readableStr,
    note: noteVal,
    savedAt: Date.now()
  }));

  window.closeFloridaCallbackModal();
  window.renderFloridaLeadsTable();
  showToast('⏳ Callback scheduled: ' + readableStr);
};

window.clearFloridaCallback = function() {
  const id = window.CURRENT_FL_CB_LEAD_ID;
  if (!id) return;
  localStorage.removeItem('vantorx_fl_cb_' + id);
  localStorage.setItem('vantorx_fl_disp_' + id, 'UNTOUCHED');
  window.closeFloridaCallbackModal();
  window.renderFloridaLeadsTable();
  showToast('Removed callback for lead');
};

window.filterFloridaByCallback = function() {
  const sel = document.getElementById('flDispositionSelect');
  if (sel) {
    sel.value = 'CALLBACK';
    window.renderFloridaLeadsTable();
    showToast('⏳ Filtered to Scheduled Callbacks');
  }
};

window.renderFloridaLeadsTable = function() {
    const tbody = document.getElementById('flLeadsTableBody');
    if (!tbody) return;

    const query = (document.getElementById('flSearchInput')?.value || '').toLowerCase().trim();
    const metro = document.getElementById('flMetroSelect')?.value || 'ALL';
    const trade = document.getElementById('flTradeSelect')?.value || 'ALL';
    const disposition = document.getElementById('flDispositionSelect')?.value || 'ALL';

    const leads = window.FLORIDA_100_NO_WEBSITE_LEADS;
    let filtered = leads.filter(l => {
      // Search query
      if (query) {
        const hay = (l.company + ' ' + l.owner + ' ' + (l.fullOwner||'') + ' ' + l.city + ' ' + l.trade + ' ' + l.phone + ' ' + l.zip + ' ' + (l.pitchAngle||'')).toLowerCase();
        if (!hay.includes(query)) return false;
      }
      // Metro
      if (metro !== 'ALL') {
        const c = l.city.toLowerCase();
        if (metro === 'Tampa Bay' && !['tampa', 'st. petersburg', 'brandon', 'clearwater', 'largo'].some(x => c.includes(x))) return false;
        if (metro === 'Central FL' && !['orlando', 'kissimmee', 'sanford', 'ocala', 'altamonte', 'winter park'].some(x => c.includes(x))) return false;
        if (metro === 'South FL' && !['miami', 'fort lauderdale', 'pompano beach', 'hollywood', 'hialeah', 'coral springs', 'davie', 'sunrise', 'doral'].some(x => c.includes(x))) return false;
        if (metro === 'Palm Beach' && !['boca raton', 'delray beach', 'boynton beach', 'west palm beach', 'jupiter', 'lake worth', 'deerfield beach'].some(x => c.includes(x))) return false;
        if (metro === 'SW Florida' && !['cape coral', 'fort myers', 'naples', 'sarasota', 'bradenton'].some(x => c.includes(x))) return false;
        if (metro === 'North FL' && !['jacksonville', 'pensacola', 'tallahassee', 'panama city'].some(x => c.includes(x))) return false;
      }
      // Trade
      if (trade !== 'ALL' && !l.trade.toLowerCase().includes(trade.toLowerCase())) return false;

      // Disposition
      const savedStatus = localStorage.getItem('vantorx_fl_disp_' + l.id) || 'UNTOUCHED';
      if (disposition !== 'ALL') {
        if (disposition === 'CALLBACK') {
          if (savedStatus !== 'CALLBACK' && !localStorage.getItem('vantorx_fl_cb_' + l.id)) return false;
        } else if (savedStatus !== disposition) {
          return false;
        }
      }

      return true;
    });

    const showingCountEl = document.getElementById('flStatTotalCount');
    if (showingCountEl) showingCountEl.textContent = leads.length;
    const showEl = document.getElementById('flShowingCount');
    if (showEl) showEl.textContent = filtered.length;

    // Count closed & callbacks
    let closedCount = 0;
    let callbacksCount = 0;
    leads.forEach(l => {
      const disp = localStorage.getItem('vantorx_fl_disp_' + l.id);
      if (disp === 'CLOSED') closedCount++;
      if (disp === 'CALLBACK' || localStorage.getItem('vantorx_fl_cb_' + l.id)) callbacksCount++;
    });
    const closedCountEl = document.getElementById('flStatClosedCount');
    if (closedCountEl) closedCountEl.textContent = closedCount;
    const callbacksCountEl = document.getElementById('flStatCallbacksCount');
    if (callbacksCountEl) callbacksCountEl.textContent = callbacksCount;

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:30px;color:#94a3b8">No matching Florida contractors found. Adjust your search or filters.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map((l, idx) => {
      const savedDisp = localStorage.getItem('vantorx_fl_disp_' + l.id) || 'UNTOUCHED';
      const savedNote = localStorage.getItem('vantorx_fl_notes_' + l.id) || '';
      const isSelected = window.FL_CURRENT_SELECTED_LEAD && window.FL_CURRENT_SELECTED_LEAD.id === l.id;

      // Callback info
      let cbBadgeHtml = '';
      const rawCb = localStorage.getItem('vantorx_fl_cb_' + l.id);
      if (rawCb || savedDisp === 'CALLBACK') {
        let cbTimeStr = 'Callback Set';
        let cbNote = '';
        if (rawCb) {
          try {
            const parsed = JSON.parse(rawCb);
            cbTimeStr = parsed.timeStr || cbTimeStr;
            cbNote = parsed.note || '';
          } catch(e){}
        }
        cbBadgeHtml = \`
          <div style="margin-top:4px">
            <span onclick="openFloridaCallbackModal('\${l.id}')" style="cursor:pointer;background:rgba(245,158,11,0.22);border:1px solid rgba(245,158,11,0.6);color:#fbbf24;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:800;display:inline-flex;align-items:center;gap:4px">
              <span>⏳</span> <span>\${cbTimeStr}</span>
            </span>
            \${cbNote ? \`<div style="font-size:10px;color:#cbd5e1;margin-top:2px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${cbNote}</div>\` : ''}
          </div>
        \`;
      }

      return \`
        <tr style="\${isSelected ? 'background:rgba(245,158,11,0.12);' : ''}">
          <td style="font-family:monospace;color:#64748b">\${idx + 1}</td>
          <td>
            <div style="font-weight:800;color:#ffffff;display:flex;align-items:center;gap:6px">
              <span>\${l.company}</span>
              <span style="font-size:10px;background:#1e293b;color:#94a3b8;padding:1px 5px;border-radius:3px">ID: \${l.id}</span>
            </div>
            <div style="font-size:11px;color:#94a3b8;margin-top:2px">
              Owner: <strong style="color:#fbbf24">\${l.owner}</strong> \${l.fullOwner && l.fullOwner !== l.owner ? '(' + l.fullOwner + ')' : ''} · <span style="color:#38bdf8">\${l.employees} staff</span>
            </div>
            \${cbBadgeHtml}
          </td>
          <td>
            <div style="font-weight:700;color:#38bdf8">\${l.trade}</div>
            <div style="font-size:11px;color:#fbbf24">\${l.rating}</div>
          </td>
          <td>
            <div style="font-weight:600;color:#cbd5e1">\${l.city}, FL \${l.zip}</div>
            <div style="font-size:10.5px;color:#64748b">\${l.address}</div>
          </td>
          <td>
            <a href="tel:\${l.phone.replace(/[^0-9]/g, '')}" class="fl-tel-link" onclick="handleFloridaDialClick('\${l.id}', '\${l.phone}')">
              <span>📞</span> <span>\${l.phone}</span>
            </a>
            <button type="button" onclick="copyFloridaPhone('\${l.phone}')" style="background:none;border:none;color:#64748b;font-size:10px;cursor:pointer;margin-left:4px" title="Copy Number">📋</button>
          </td>
          <td>
            \${(() => {
              const savedWeb = localStorage.getItem('vantorx_fl_website_' + l.id);
              const isVerifiedZero = localStorage.getItem('vantorx_fl_zero_verified_' + l.id) === 'true';
              if (savedWeb && savedWeb !== 'None') {
                const clean = savedWeb.startsWith('http') ? savedWeb : 'https://' + savedWeb;
                return \`<span class="fl-badge-hasweb" style="background:rgba(52,211,153,0.18);color:#34d399;border:1px solid rgba(52,211,153,0.5);border-radius:6px;padding:3px 7px;font-size:11px;font-weight:800;display:inline-block">🌐 HAS SITE</span>
                        <div style="font-size:10px;color:#94a3b8;margin-top:2px;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><a href="\${clean}" target="_blank" style="color:#38bdf8">\${savedWeb}</a></div>
                        <div style="font-size:9.5px;color:#64748b;margin-top:1px"><a href="javascript:void(0)" onclick="openWebsiteCheckerModal('\${l.id}')" style="color:#fbbf24">Edit/Check</a></div>\`;
              }
              if (isVerifiedZero) {
                return \`<span class="fl-badge-noweb" style="background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.5);border-radius:6px;padding:3px 7px;font-size:11px;font-weight:800;display:inline-block">🛡️ VERIFIED NO SITE</span>
                        <div style="font-size:10px;color:#34d399;margin-top:2px">✓ Confirmed No Map Link</div>
                        <div style="font-size:9.5px"><a href="javascript:void(0)" onclick="openWebsiteCheckerModal('\${l.id}')" style="color:#38bdf8">Re-verify</a></div>\`;
              }
              return \`<span class="fl-badge-noweb">🚨 NO WEBSITE</span>
                      <div style="font-size:10px;color:#94a3b8;margin-top:2px"><a href="javascript:void(0)" onclick="openWebsiteCheckerModal('\${l.id}')" style="color:#38bdf8;text-decoration:none;font-weight:700">🔍 Verify (Maps)</a></div>\`;
            })()}
          </td>
          <td>
            <strong style="color:#ef4444;font-family:monospace;font-size:13.5px">\${l.monthlyLossEst}/mo</strong>
            <div style="font-size:10px;color:#94a3b8">Bounced traffic</div>
          </td>
          <td>
            <div style="display:flex;gap:5px;flex-wrap:wrap">
              <button type="button" class="fl-btn-action" onclick="selectFloridaTarget('\${l.id}')">
                📞 Pitch
              </button>
              <button type="button" class="fl-btn-action" style="background:rgba(245,158,11,0.18);border-color:#f59e0b;color:#fbbf24" onclick="openFloridaCallbackModal('\${l.id}')" title="Schedule Callback">
                ⏳ Callback
              </button>
              <button type="button" class="fl-btn-action" style="background:rgba(56,189,248,0.15);border-color:#38bdf8;color:#38bdf8" onclick="openContractorSiteDemo('\${l.id}')">
                🌐 Live Preview
              </button>
              <button type="button" class="fl-btn-action" style="background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.2);color:#94a3b8" onclick="openWebsiteCheckerModal('\${l.id}')" title="Check Site">
                🔍 Check
              </button>
            </div>
          </td>
          <td>
            <select class="fl-disposition-select" onchange="updateFloridaDisposition('\${l.id}', this.value)">
              <option value="UNTOUCHED" \${savedDisp==='UNTOUCHED'?'selected':''}>⚪ Not Called</option>
              <option value="CALLBACK" \${savedDisp==='CALLBACK'?'selected':''}>⏳ Scheduled Callback</option>
              <option value="SPOKE" \${savedDisp==='SPOKE'?'selected':''}>🟡 Spoke to Owner</option>
              <option value="SENT_DEMO" \${savedDisp==='SENT_DEMO'?'selected':''}>🔵 Sent Demo SMS</option>
              <option value="CLOSED" \${savedDisp==='CLOSED'?'selected':''}>🟢 Closed $997 Site!</option>
              <option value="NOT_INTERESTED" \${savedDisp==='NOT_INTERESTED'?'selected':''}>🔴 Not Interested</option>
            </select>
          </td>
          <td>
            <input type="text" class="fl-note-input" placeholder="Quick call notes..." value="\${savedNote.replace(/"/g, '&quot;')}" onchange="saveFloridaNote('\${l.id}', this.value)" />
          </td>
        </tr>
      \`;
    }).join('');
  };
`;

  // Find end of renderFloridaLeadsTable in arenaHtml
  const renderEndTarget = `window.handleFloridaFilterChange = function() {`;
  const renderEndIdx = arenaHtml.indexOf(renderEndTarget);
  if (renderEndIdx !== -1) {
    arenaHtml = arenaHtml.slice(0, oldRenderFnIdx) + newCallbackLogic.trim() + '\n\n  ' + arenaHtml.slice(renderEndIdx);
    console.log('  ✓ Injected new renderFloridaLeadsTable with callback column, badge, and handlers');
  }
}

// Update updateFloridaDisposition to handle 'CALLBACK'
const oldDispUpdate = `window.updateFloridaDisposition = function(leadId, status) {
    localStorage.setItem('vantorx_fl_disp_' + leadId, status);`;
const newDispUpdate = `window.updateFloridaDisposition = function(leadId, status) {
    if (status === 'CALLBACK') {
      window.openFloridaCallbackModal(leadId);
      return;
    }
    localStorage.setItem('vantorx_fl_disp_' + leadId, status);`;

if (arenaHtml.includes(oldDispUpdate)) {
  arenaHtml = arenaHtml.replace(oldDispUpdate, newDispUpdate);
  console.log('  ✓ Updated updateFloridaDisposition to trigger callback modal');
} else {
  const oldDispUpdateCRLF = oldDispUpdate.replace(/\n/g, '\r\n');
  const newDispUpdateCRLF = newDispUpdate.replace(/\n/g, '\r\n');
  if (arenaHtml.includes(oldDispUpdateCRLF)) {
    arenaHtml = arenaHtml.replace(oldDispUpdateCRLF, newDispUpdateCRLF);
    console.log('  ✓ Updated updateFloridaDisposition to trigger callback modal (CRLF)');
  }
}

fs.writeFileSync(ARENA_FILE, arenaHtml, 'utf8');
console.log('  ✅ website/cold-call-arena/index.html updated successfully.');


// ==========================================
// 2. UPDATE website/cold-call-arena/florida-no-website.html
// ==========================================
console.log('\n2. Updating website/cold-call-arena/florida-no-website.html...');
let vaultHtml = fs.readFileSync(VAULT_FILE, 'utf8');

const vaultStartMarker = 'window.FLORIDA_100_NO_WEBSITE_LEADS = [';
const vaultStartIdx = vaultHtml.indexOf(vaultStartMarker);
if (vaultStartIdx !== -1) {
  let vaultEndIdx = vaultHtml.indexOf('];', vaultStartIdx);
  if (vaultEndIdx !== -1) {
    vaultEndIdx += 2;
    vaultHtml = vaultHtml.slice(0, vaultStartIdx) + leadsJsString.trim() + vaultHtml.slice(vaultEndIdx);
    console.log('  ✓ Replaced window.FLORIDA_100_NO_WEBSITE_LEADS in florida-no-website.html with 100 Real Leads');
  }
}

// Also check if LEADS is assigned: const LEADS = window.FLORIDA_100_NO_WEBSITE_LEADS;
fs.writeFileSync(VAULT_FILE, vaultHtml, 'utf8');
console.log('  ✅ website/cold-call-arena/florida-no-website.html updated successfully.');
