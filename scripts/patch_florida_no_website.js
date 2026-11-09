const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'florida-no-website.html');
let html = fs.readFileSync(targetPath, 'utf8');

// Normalize line endings to LF
const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. Read the clean 100 leads
const clean100 = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'florida_100_no_website_leads.json'), 'utf8'));

// 2. Replace window.FLORIDA_100_NO_WEBSITE_LEADS = [ ... ];
const startMarker = 'window.FLORIDA_100_NO_WEBSITE_LEADS = [';
const endMarker = '];\nlet LEADS = window.FLORIDA_100_NO_WEBSITE_LEADS;';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find window.FLORIDA_100_NO_WEBSITE_LEADS block in html!');
  process.exit(1);
}

const replacementLeadsBlock = `window.FLORIDA_100_NO_WEBSITE_LEADS = ${JSON.stringify(clean100, null, 2)}`;
html = html.substring(0, startIdx) + replacementLeadsBlock + html.substring(endIdx);
console.log('✓ Replaced window.FLORIDA_100_NO_WEBSITE_LEADS with 100 100% Real Florida Leads!');

// 3. Add CSS for Callbacks if not present
if (!html.includes('.callback-badge')) {
  const cssTarget = '.disposition-select {';
  const callbackCss = `
    .status-CALLBACK {
      background: rgba(245, 158, 11, 0.15) !important;
      border-color: rgba(245, 158, 11, 0.5) !important;
      color: #fbbf24 !important;
    }
    .callback-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(245, 158, 11, 0.18);
      border: 1px solid rgba(245, 158, 11, 0.5);
      color: #fbbf24;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
      margin-top: 4px;
      transition: all 0.2s;
    }
    .callback-badge:hover {
      background: rgba(245, 158, 11, 0.3);
      border-color: #fbbf24;
      transform: translateY(-1px);
    }
    .callback-note-text {
      font-size: 10.5px;
      color: #cbd5e1;
      font-style: italic;
      margin-top: 2px;
      max-width: 220px;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .disposition-select {`;
  html = html.replace(cssTarget, callbackCss);
  console.log('✓ Added Callback CSS styles');
}

// 4. Add 5th KPI Card for Callbacks in kpi-grid
if (!html.includes('id="statCallbacks"')) {
  const kpiGridTarget = '<div class="kpi-grid">';
  const kpiCallbackCard = `<div class="kpi-grid">
    <div class="kpi-card" id="kpiCardCallbacks" onclick="filterByCallback()" style="cursor:pointer;border:1px solid rgba(245,158,11,0.4);background:rgba(245,158,11,0.06);transition:all 0.2s" onmouseover="this.style.borderColor='#f59e0b'" onmouseout="this.style.borderColor='rgba(245,158,11,0.4)'" title="Click to filter scheduled follow-up callbacks">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span class="kpi-label" style="color:#fbbf24">⏳ Callbacks Scheduled</span>
        <span style="font-size:10px;background:rgba(245,158,11,0.2);color:#fbbf24;padding:2px 6px;border-radius:4px;font-weight:800">1-CLICK</span>
      </div>
      <span class="kpi-val" style="color:#fbbf24" id="statCallbacks">0 Scheduled</span>
      <span class="kpi-sub" id="statCallbacksSub">View follow-ups</span>
    </div>`;
  html = html.replace(kpiGridTarget, kpiCallbackCard);
  console.log('✓ Added Callbacks KPI Card');
}

// 5. Update dispFilter options to include CALLBACK
const dispFilterTarget = `<select id="dispFilter" class="select-dropdown" onchange="filterTable()">
        <option value="ALL">📞 All Call Statuses</option>
        <option value="UNTOUCHED">⚪ Untouched</option>
        <option value="CALLED_VM">🟡 Called / Voicemail</option>`;

const dispFilterReplacement = `<select id="dispFilter" class="select-dropdown" onchange="filterTable()">
        <option value="ALL">📞 All Call Statuses</option>
        <option value="UNTOUCHED">⚪ Untouched</option>
        <option value="CALLED_VM">🟡 Called / Voicemail</option>
        <option value="CALLBACK">⏳ Callback Scheduled</option>`;

if (html.includes(dispFilterTarget)) {
  html = html.replace(dispFilterTarget, dispFilterReplacement);
  console.log('✓ Added CALLBACK option to dispFilter');
}

// 6. Add Callback Modal HTML before </body>
if (!html.includes('id="callbackModal"')) {
  const cbModalHtml = `
<!-- ⏳ CALLBACK SCHEDULER MODAL -->
<div class="modal-overlay" id="callbackModal" onclick="if(event.target===this) closeCallbackModal()">
  <div style="max-width:520px;width:100%;background:#0d121d;border:1.5px solid rgba(245,158,11,0.5);border-radius:16px;padding:24px;box-shadow:0 0 50px rgba(0,0,0,0.9),0 0 30px rgba(245,158,11,0.2);position:relative">
    <button type="button" class="close-modal-btn" onclick="closeCallbackModal()" style="top:16px;right:18px">✕</button>
    
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <div style="font-size:26px">⏳</div>
      <div>
        <div style="font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:800;color:#fff" id="cbModalTitle">Schedule Callback</div>
        <div style="font-size:11.5px;color:#94a3b8" id="cbModalSubtitle">Target Contractor</div>
      </div>
    </div>

    <!-- Target Info Card -->
    <div style="background:rgba(15,23,42,0.8);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-weight:800;color:#fff;font-size:14px" id="cbTargetCompany">Company</div>
          <div style="font-size:12px;color:#94a3b8" id="cbTargetOwner">Owner</div>
        </div>
        <a id="cbTargetPhoneLink" href="#" class="dial-btn" style="padding:6px 12px;font-size:12px">
          📞 <span id="cbTargetPhone">Phone</span>
        </a>
      </div>
    </div>

    <!-- Quick Presets -->
    <div style="font-size:11px;font-family:var(--font-mono);font-weight:800;color:#fbbf24;text-transform:uppercase;margin-bottom:8px">
      ⚡ Quick Schedule Presets:
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:16px">
      <button type="button" class="btn btn-secondary btn-sm" onclick="setCbPreset(1)" style="font-size:11px;padding:8px 4px;text-align:center;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#fff;border-radius:6px;cursor:pointer">+1 Hour</button>
      <button type="button" class="btn btn-secondary btn-sm" onclick="setCbPreset(3)" style="font-size:11px;padding:8px 4px;text-align:center;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#fff;border-radius:6px;cursor:pointer">+3 Hours</button>
      <button type="button" class="btn btn-secondary btn-sm" onclick="setCbPresetTomorrow(9, 30)" style="font-size:11px;padding:8px 4px;text-align:center;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#fff;border-radius:6px;cursor:pointer">Tmrw 9:30 AM</button>
      <button type="button" class="btn btn-secondary btn-sm" onclick="setCbPresetTomorrow(14, 0)" style="font-size:11px;padding:8px 4px;text-align:center;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#fff;border-radius:6px;cursor:pointer">Tmrw 2:00 PM</button>
    </div>

    <!-- Datetime input -->
    <div style="margin-bottom:14px">
      <label style="display:block;font-size:11.5px;color:#cbd5e1;font-weight:700;margin-bottom:6px">Callback Date &amp; Time:</label>
      <input type="datetime-local" id="cbDateTimeInput" style="width:100%;padding:10px 12px;background:#07090e;border:1.5px solid rgba(245,158,11,0.35);border-radius:8px;color:#fbbf24;font-family:monospace;font-size:13px;outline:none" />
    </div>

    <!-- Notes input -->
    <div style="margin-bottom:18px">
      <label style="display:block;font-size:11.5px;color:#cbd5e1;font-weight:700;margin-bottom:6px">Call Notes / Reason for Callback:</label>
      <textarea id="cbNotesInput" rows="3" placeholder="e.g. Gatekeeper said owner is on roof until 3pm. Call back directly to discuss emergency mobile website." style="width:100%;padding:10px 12px;background:#07090e;border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#fff;font-size:12px;outline:none;resize:vertical"></textarea>
    </div>

    <!-- Actions -->
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
      <button type="button" onclick="clearCallback()" style="background:transparent;border:1px solid rgba(239,68,68,0.4);color:#f87171;font-size:12px;font-weight:700;padding:8px 12px;border-radius:8px;cursor:pointer">
        🗑️ Clear Callback
      </button>
      <div style="display:flex;gap:8px">
        <button type="button" onclick="closeCallbackModal()" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:12px;font-weight:700;padding:8px 14px;border-radius:8px;cursor:pointer">Cancel</button>
        <button type="button" class="btn-action" onclick="saveCallbackFromModal()" style="font-size:12.5px;padding:9px 18px">
          💾 Save Callback ➔
        </button>
      </div>
    </div>

  </div>
</div>
`;
  html = html.replace('</body>', cbModalHtml + '\n</body>');
  console.log('✓ Added callbackModal HTML before </body>');
}

// 7. Update renderTable, handleDispChange, and Callback JS logic
// We replace the renderTable and filterTable functions with enhanced versions supporting CALLBACK
const oldRenderTableStart = 'function renderTable(leads) {';
const oldRenderTableEnd = 'function filterTable() {';

const newJsMethods = `
window.CURRENT_CB_LEAD_ID = null;

function updateKpiStats() {
  let cbCount = 0;
  LEADS.forEach(l => {
    const disp = localStorage.getItem('vantorx_fl_disp_' + l.id);
    if (disp === 'CALLBACK') cbCount++;
  });
  const cbEl = document.getElementById('statCallbacks');
  if (cbEl) cbEl.textContent = cbCount + ' Scheduled';
  const cbSub = document.getElementById('statCallbacksSub');
  if (cbSub) cbSub.textContent = cbCount > 0 ? (cbCount + ' follow-up' + (cbCount > 1 ? 's' : '') + ' pending') : 'No pending callbacks';
}

function filterByCallback() {
  const dispSel = document.getElementById('dispFilter');
  if (dispSel) {
    dispSel.value = 'CALLBACK';
    filterTable();
    showToast('⏳ Filtered to Scheduled Callbacks');
  }
}

function openCallbackModal(id) {
  const lead = LEADS.find(l => l.id === id);
  if (!lead) return;
  window.CURRENT_CB_LEAD_ID = id;

  document.getElementById('cbModalTitle').textContent = 'Schedule Callback: ' + lead.company;
  document.getElementById('cbModalSubtitle').textContent = lead.city + ', FL · ' + lead.trade;
  document.getElementById('cbTargetCompany').textContent = lead.company;
  document.getElementById('cbTargetOwner').textContent = 'Owner: ' + lead.owner + ' · ' + lead.address;
  document.getElementById('cbTargetPhone').textContent = lead.phone;
  document.getElementById('cbTargetPhoneLink').href = 'tel:' + lead.phone.replace(/[^0-9]/g, '');

  // Load existing callback if any
  const rawCb = localStorage.getItem('vantorx_fl_cb_' + id);
  if (rawCb) {
    try {
      const cb = JSON.parse(rawCb);
      document.getElementById('cbDateTimeInput').value = cb.time || '';
      document.getElementById('cbNotesInput').value = cb.note || '';
    } catch(e) {}
  } else {
    // Default to +2 hours from now
    setCbPreset(2);
    document.getElementById('cbNotesInput').value = '';
  }

  const modal = document.getElementById('callbackModal');
  if (modal) modal.classList.add('active');
}

function closeCallbackModal() {
  const modal = document.getElementById('callbackModal');
  if (modal) modal.classList.remove('active');
  window.CURRENT_CB_LEAD_ID = null;
}

function setCbPreset(hours) {
  const now = new Date();
  now.setHours(now.getHours() + hours);
  now.setMinutes(Math.round(now.getMinutes() / 15) * 15);
  now.setSeconds(0);
  now.setMilliseconds(0);
  const pad = n => String(n).padStart(2, '0');
  const str = now.getFullYear() + '-' + pad(now.getMonth()+1) + '-' + pad(now.getDate()) + 'T' + pad(now.getHours()) + ':' + pad(now.getMinutes());
  document.getElementById('cbDateTimeInput').value = str;
}

function setCbPresetTomorrow(hour, min) {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(hour);
  d.setMinutes(min);
  d.setSeconds(0);
  d.setMilliseconds(0);
  const pad = n => String(n).padStart(2, '0');
  const str = d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  document.getElementById('cbDateTimeInput').value = str;
}

function saveCallbackFromModal() {
  const id = window.CURRENT_CB_LEAD_ID;
  if (!id) return;

  const dtVal = document.getElementById('cbDateTimeInput').value;
  const noteVal = document.getElementById('cbNotesInput').value.trim();

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

  closeCallbackModal();
  updateKpiStats();
  filterTable();
  showToast('⏳ Callback scheduled: ' + readableStr);
}

function clearCallback() {
  const id = window.CURRENT_CB_LEAD_ID;
  if (!id) return;
  localStorage.removeItem('vantorx_fl_cb_' + id);
  localStorage.setItem('vantorx_fl_disp_' + id, 'UNTOUCHED');
  closeCallbackModal();
  updateKpiStats();
  filterTable();
  showToast('Removed callback for lead');
}

function handleDispChange(id, val) {
  if (val === 'CALLBACK') {
    openCallbackModal(id);
  } else {
    localStorage.setItem('vantorx_fl_disp_' + id, val);
    showToast('Saved status: ' + val);
    updateKpiStats();
    filterTable();
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderTable(leads) {
  const tbody = document.getElementById('leadsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  document.getElementById('visibleCount').textContent = leads.length;

  leads.forEach(l => {
    const tr = document.createElement('tr');
    const savedDisp = localStorage.getItem('vantorx_fl_disp_' + l.id) || 'UNTOUCHED';

    let cbData = null;
    const rawCb = localStorage.getItem('vantorx_fl_cb_' + l.id);
    if (rawCb) {
      try { cbData = JSON.parse(rawCb); } catch(e) {}
    }

    tr.innerHTML = \`
      <td>
        <div class="company-cell">
          <span class="company-name">\${l.company}</span>
          <span class="owner-name">Owner: <strong>\${l.owner}</strong> · \${l.address}</span>
        </div>
      </td>
      <td>
        <span style="font-weight:700;color:#e2e8f0">\${l.trade}</span>
      </td>
      <td>
        <div style="font-weight:700;color:#fff">\${l.city}, FL</div>
        <div style="font-size:11px;color:#94a3b8">\${l.zip}</div>
      </td>
      <td>
        <span style="color:#fbbf24;font-weight:800">\${l.rating}</span>
      </td>
      <td>
        \${(() => {
          const savedWeb = localStorage.getItem('vantorx_fl_website_' + l.id);
          const isVerifiedZero = localStorage.getItem('vantorx_fl_zero_verified_' + l.id) === 'true';
          if (savedWeb && savedWeb !== 'None') {
            const clean = savedWeb.startsWith('http') ? savedWeb : 'https://' + savedWeb;
            return \`<span style="background:rgba(52,211,153,0.18);color:#34d399;border:1px solid rgba(52,211,153,0.5);border-radius:6px;padding:3px 7px;font-size:11px;font-weight:800;display:inline-block">🌐 HAS SITE</span>
                    <div style="font-size:10px;color:#94a3b8;margin-top:2px;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><a href="\${clean}" target="_blank" style="color:#38bdf8">\${savedWeb}</a></div>
                    <div style="font-size:9.5px;color:#64748b;margin-top:1px"><a href="javascript:void(0)" onclick="openWebsiteCheckerModal('\${l.id}')" style="color:#fbbf24">Edit/Check</a></div>\`;
          }
          if (isVerifiedZero) {
            return \`<span class="tag-no-web" style="background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.5)">🛡️ VERIFIED NO SITE</span>
                    <div style="font-size:10px;color:#34d399;margin-top:2px">✓ Confirmed No Map Link</div>
                    <div style="font-size:9.5px"><a href="javascript:void(0)" onclick="openWebsiteCheckerModal('\${l.id}')" style="color:#38bdf8">Re-verify</a></div>\`;
          }
          return \`<span class="tag-no-web">🚫 NO WEBSITE</span>
                  <div style="font-size:10px;color:#94a3b8;margin-top:2px"><a href="javascript:void(0)" onclick="openWebsiteCheckerModal('\${l.id}')" style="color:#38bdf8;text-decoration:none;font-weight:700">🔍 Verify (Maps)</a></div>\`;
        })()}
      </td>
      <td>
        <span style="color:#ef4444;font-weight:800;font-family:monospace">\${l.monthlyLossEst}/mo</span>
      </td>
      <td>
        <a href="tel:\${l.phone.replace(/[^0-9]/g, '')}" class="dial-btn" onclick="logCall('\${l.id}')">
          📞 \${l.phone}
        </a>
      </td>
      <td style="max-width:280px;font-size:11.5px;color:#cbd5e1;line-height:1.4">
        \${l.pitchAngle}
      </td>
      <td>
        <div style="display:flex;flex-direction:column;gap:6px">
          <div style="display:flex;gap:6px">
            <button type="button" class="btn-preview-mockup" onclick="openMockup('\${l.id}')" style="flex:1">
              📱 Mockup
            </button>
            <button type="button" class="btn-preview-mockup" onclick="openWebsiteCheckerModal('\${l.id}')" style="background:rgba(245,158,11,0.15);border-color:#f59e0b;color:#fbbf24" title="Check Website Presence">
              🔍 Check
            </button>
          </div>
          <select class="disposition-select \${savedDisp==='CALLBACK'?'status-CALLBACK':''}" onchange="handleDispChange('\${l.id}', this.value)">
            <option value="UNTOUCHED" \${savedDisp==='UNTOUCHED'?'selected':''}>⚪ Untouched</option>
            <option value="CALLED_VM" \${savedDisp==='CALLED_VM'?'selected':''}>🟡 Left VM</option>
            <option value="CALLBACK" \${savedDisp==='CALLBACK'?'selected':''}>⏳ Callback Scheduled</option>
            <option value="PITCHED_SMS" \${savedDisp==='PITCHED_SMS'?'selected':''}>🔵 Mockup Sent</option>
            <option value="DEMO_BOOKED" \${savedDisp==='DEMO_BOOKED'?'selected':''}>🟣 Demo Booked</option>
            <option value="CLOSED_WON" \${savedDisp==='CLOSED_WON'?'selected':''}>🟢 Closed ($1.5k+)</option>
          </select>
          \${savedDisp === 'CALLBACK' ? \`
            <div class="callback-badge" onclick="openCallbackModal('\${l.id}')" title="Click to edit callback">
              <span>⏳ \${cbData ? cbData.timeStr : 'Set Time'}</span>
              <span style="font-size:9.5px;opacity:0.8">✏️</span>
            </div>
            \${cbData && cbData.note ? \`<div class="callback-note-text" title="\${escapeHtml(cbData.note)}">"\${escapeHtml(cbData.note)}"</div>\` : ''}
          \` : \`
            <div style="font-size:10px;margin-top:1px">
              <a href="javascript:void(0)" onclick="openCallbackModal('\${l.id}')" style="color:#f59e0b;text-decoration:none;font-weight:700">⏳ Set Callback</a>
            </div>
          \`}
        </div>
      </td>
    \`;
    tbody.appendChild(tr);
  });
}
`;

const renderTableIdx = html.indexOf(oldRenderTableStart);
const filterTableIdx = html.indexOf(oldRenderTableEnd);

if (renderTableIdx !== -1 && filterTableIdx !== -1) {
  html = html.substring(0, renderTableIdx) + newJsMethods + '\n' + html.substring(filterTableIdx);
  console.log('✓ Injected new renderTable and Callback methods');
}

// 8. Update checkVaultAccess to also call updateKpiStats()
if (html.includes('renderTable(LEADS);')) {
  html = html.replace('renderTable(LEADS);', 'renderTable(LEADS);\n    updateKpiStats();');
  console.log('✓ Added updateKpiStats() to checkVaultAccess');
}

// Convert back to CRLF if needed
if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(targetPath, html, 'utf8');
console.log('Successfully patched website/cold-call-arena/florida-no-website.html!');
