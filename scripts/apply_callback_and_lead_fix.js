const fs = require('fs');
const path = require('path');

const arenaPath = path.join(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
let arenaHtml = fs.readFileSync(arenaPath, 'utf8');

// Normalize line endings to LF for consistent replacement
const isCRLF = arenaHtml.includes('\r\n');
if (isCRLF) {
  arenaHtml = arenaHtml.replace(/\r\n/g, '\n');
}

// 1. Add Callbacks View Button to HTML View Switcher
const targetToggle = `<button type="button" class="view-toggle-pill" id="btnViewCalledHistory" onclick="switchLeadView('calledHistory')"`;
const replacementToggle = `<button type="button" class="view-toggle-pill" id="btnViewCallbacks" onclick="switchLeadView('callbacks')" style="display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:12px;font-size:14px;font-weight:800;border:1px solid rgba(56,189,248,0.5);background:rgba(56,189,248,0.12);color:#38bdf8;cursor:pointer;transition:all 0.2s">
            <span>⏳</span> Callbacks &amp; Follow-Ups (<span id="callbackCountBadge">7</span>)
          </button>
          <button type="button" class="view-toggle-pill" id="btnViewCalledHistory" onclick="switchLeadView('calledHistory')"`;

if (arenaHtml.includes(targetToggle) && !arenaHtml.includes('btnViewCallbacks')) {
  arenaHtml = arenaHtml.replace(targetToggle, replacementToggle);
  console.log('✓ Added btnViewCallbacks to HTML view toggle');
}

// 2. Add Batch 7 to batchSelect dropdown
const targetBatch6 = `<option value="6">Batch 6: Southwest Florida (21 Real Targets)</option>`;
const replacementBatch7 = `<option value="6">Batch 6: Southwest Florida (21 Real Targets)</option>
                <option value="7">⭐ Batch 7: Fresh 75 Verified Additions (North &amp; Central FL, Panhandle · 75 Targets)</option>`;

if (arenaHtml.includes(targetBatch6) && !arenaHtml.includes('value="7"')) {
  arenaHtml = arenaHtml.replace(targetBatch6, replacementBatch7);
  console.log('✓ Added Batch 7 to batchSelect dropdown');
}

// 3. Add Callbacks pill to Call Status Filter Pills
const targetCalledPill = `<button class="lead-pill-btn" data-status-filter="called">✅ Already Called (<span id="countStatusCalled">0</span>)</button>`;
const replacementCallbackPill = `<button class="lead-pill-btn" data-status-filter="callbacks">📞 Scheduled Callbacks (<span id="countStatusCallbacks">7</span>)</button>
          <button class="lead-pill-btn" data-status-filter="called">✅ Logged Calls (<span id="countStatusCalled">19</span>)</button>`;

if (arenaHtml.includes(targetCalledPill) && !arenaHtml.includes('data-status-filter="callbacks"')) {
  arenaHtml = arenaHtml.replace(targetCalledPill, replacementCallbackPill);
  console.log('✓ Added callbacks status filter pill');
}

// 4. Load full 19 seed calls and legacy mapping
const seedCallsPath = path.join(__dirname, '..', 'data', 'lead_call_records.json');
const fullSeedCalls = JSON.parse(fs.readFileSync(seedCallsPath, 'utf8'));

const legacyMapPath = path.join(__dirname, '..', 'data', 'legacy_id_map.json');
let legacyIdMap = {};
if (fs.existsSync(legacyMapPath)) {
  legacyIdMap = JSON.parse(fs.readFileSync(legacyMapPath, 'utf8'));
}

// Replace SEED_CALL_RECORDS and add getLeadCallRecord in JavaScript
const seedStart = arenaHtml.indexOf('const SEED_CALL_RECORDS = {');
const seedEnd = arenaHtml.indexOf('let CALL_RECORDS = {};', seedStart);

if (seedStart !== -1 && seedEnd !== -1) {
  const newSeedSection = `const SEED_CALL_RECORDS = ${JSON.stringify(fullSeedCalls, null, 2)};

  // Legacy ID mapping (maps old 825 directory IDs to verified 346 lead IDs)
  const LEGACY_ID_MAP = ${JSON.stringify(legacyIdMap, null, 2)};

  function getLeadCallRecord(lead) {
    if (!lead) return null;
    if (CALL_RECORDS && CALL_RECORDS[lead.id]) return CALL_RECORDS[lead.id];
    // Check legacy mapping
    for (const [oldId, newId] of Object.entries(LEGACY_ID_MAP)) {
      if (newId === lead.id && CALL_RECORDS[oldId]) return CALL_RECORDS[oldId];
    }
    // Check normalized phone number match
    const cleanPhone = (lead.phone || '').replace(/\\D/g, '');
    if (cleanPhone) {
      for (const [id, rec] of Object.entries(CALL_RECORDS || {})) {
        if (!rec || !rec.called) continue;
        const matched = (window.LEADS_DATA || []).find(l => l.id === id);
        if (matched && (matched.phone || '').replace(/\\D/g, '') === cleanPhone) {
          return rec;
        }
      }
    }
    return null;
  }
  window.getLeadCallRecord = getLeadCallRecord;

  `;

  arenaHtml = arenaHtml.substring(0, seedStart) + newSeedSection + arenaHtml.substring(seedEnd);
  console.log('✓ Embedded full 19 SEED_CALL_RECORDS, LEGACY_ID_MAP, and getLeadCallRecord()');
}

// 5. Update CALL_RECORDS initialization to run migration pass
const callInitTarget = `    if (_storedCalls && typeof _storedCalls === 'object' && Object.keys(_storedCalls).length > 0) {
      CALL_RECORDS = { ...SEED_CALL_RECORDS, ..._storedCalls };
    } else {
      CALL_RECORDS = { ...SEED_CALL_RECORDS };
    }`;

const callInitReplacement = `    if (_storedCalls && typeof _storedCalls === 'object' && Object.keys(_storedCalls).length > 0) {
      CALL_RECORDS = { ...SEED_CALL_RECORDS, ..._storedCalls };
    } else {
      CALL_RECORDS = { ...SEED_CALL_RECORDS };
    }
    // Auto-migrate any legacy keys to new IDs so callbacks and call logs are never lost
    for (const [oldId, newId] of Object.entries(LEGACY_ID_MAP)) {
      if (CALL_RECORDS[oldId] && !CALL_RECORDS[newId]) {
        CALL_RECORDS[newId] = { ...CALL_RECORDS[oldId] };
      }
    }`;

if (arenaHtml.includes(callInitTarget)) {
  arenaHtml = arenaHtml.replace(callInitTarget, callInitReplacement);
  console.log('✓ Added auto-migration pass on CALL_RECORDS initialization');
}

// 6. Update switchLeadView to handle 'callbacks'
const switchLeadViewTarget = `  window.switchLeadView = function(view) {
    currentLeadView = view;
    window.currentLeadView = view;
    
    const btnToCall = document.getElementById('btnViewToCall');
    const btnCalled = document.getElementById('btnViewCalledHistory');

    if (view === 'toCall') {
      if (btnToCall) {
        btnToCall.style.border = '1px solid #f59e0b';
        btnToCall.style.background = 'linear-gradient(135deg,#f59e0b,#d97706)';
        btnToCall.style.color = '#070a0f';
      }
      if (btnCalled) {
        btnCalled.style.border = '1px solid var(--line)';
        btnCalled.style.background = 'rgba(255,255,255,0.06)';
        btnCalled.style.color = '#cbd5e1';
      }
    } else {
      if (btnCalled) {
        btnCalled.style.border = '1px solid #34d399';
        btnCalled.style.background = 'linear-gradient(135deg,#10b981,#059669)';
        btnCalled.style.color = '#070a0f';
      }
      if (btnToCall) {
        btnToCall.style.border = '1px solid var(--line)';
        btnToCall.style.background = 'rgba(255,255,255,0.06)';
        btnToCall.style.color = '#cbd5e1';
      }
    }

    if (typeof renderLeadsTable === 'function') {
      renderLeadsTable();
    }
  };`;

const switchLeadViewReplacement = `  window.switchLeadView = function(view) {
    currentLeadView = view;
    window.currentLeadView = view;
    
    const btnToCall = document.getElementById('btnViewToCall');
    const btnCallbacks = document.getElementById('btnViewCallbacks');
    const btnCalled = document.getElementById('btnViewCalledHistory');

    const defaultStyle = {
      border: '1px solid var(--line)',
      background: 'rgba(255,255,255,0.06)',
      color: '#cbd5e1'
    };
    [btnToCall, btnCallbacks, btnCalled].forEach(btn => {
      if (btn) {
        btn.style.border = defaultStyle.border;
        btn.style.background = defaultStyle.background;
        btn.style.color = defaultStyle.color;
        btn.classList.remove('active');
      }
    });

    if (view === 'toCall') {
      if (btnToCall) {
        btnToCall.style.border = '1px solid #f59e0b';
        btnToCall.style.background = 'linear-gradient(135deg,#f59e0b,#d97706)';
        btnToCall.style.color = '#070a0f';
        btnToCall.classList.add('active');
      }
    } else if (view === 'callbacks') {
      if (btnCallbacks) {
        btnCallbacks.style.border = '1px solid #38bdf8';
        btnCallbacks.style.background = 'linear-gradient(135deg,#0284c7,#0369a1)';
        btnCallbacks.style.color = '#ffffff';
        btnCallbacks.classList.add('active');
      }
    } else if (view === 'calledHistory') {
      if (btnCalled) {
        btnCalled.style.border = '1px solid #34d399';
        btnCalled.style.background = 'linear-gradient(135deg,#10b981,#059669)';
        btnCalled.style.color = '#070a0f';
        btnCalled.classList.add('active');
      }
    }

    if (typeof renderLeadsTable === 'function') {
      renderLeadsTable();
    }
  };`;

if (arenaHtml.includes(switchLeadViewTarget)) {
  arenaHtml = arenaHtml.replace(switchLeadViewTarget, switchLeadViewReplacement);
  console.log('✓ Updated switchLeadView() to handle callbacks');
}

// 7. Update updateBatchHeading to handle Batch 7 cleanly
const headingTarget = `      } else if (currentBatch === 'all') {
        heading.textContent = \`NATIONWIDE MASTER DIRECTORY (825 TARGETS)\`;
      } else {
        heading.textContent = \`BATCH #\${currentBatch}: 75 NATIONWIDE TARGET LEADS\`;
      }`;

const headingReplacement = `      } else if (currentBatch === 'all') {
        heading.textContent = \`FLORIDA TRADE CONTRACTORS DIRECTORY (\${(window.LEADS_DATA || []).length} VERIFIED TARGETS)\`;
      } else if (currentBatch === '7') {
        heading.textContent = \`BATCH #7: 75 FRESH VERIFIED ADDITIONS (NORTH & CENTRAL FL, PANHANDLE)\`;
      } else {
        heading.textContent = \`BATCH #\${currentBatch}: 50 VERIFIED REGIONAL TARGETS\`;
      }`;

if (arenaHtml.includes(headingTarget)) {
  arenaHtml = arenaHtml.replace(headingTarget, headingReplacement);
  console.log('✓ Updated updateBatchHeading() for Batch 7 and dynamic counts');
}

// 8. Update renderLeadsTable: counts and filtering
const countsTarget = `    // Update uncalled vs called counts
    const callsObj = window.CALL_RECORDS || {};
    const totalCalledCount = Object.values(callsObj).filter(c => c && c.called).length;
    const totalUncalledCount = Math.max(0, (window.LEADS_DATA || []).length - totalCalledCount);

    const uncalledBadgeEl = document.getElementById('uncalledCountBadge');
    const calledBadgeEl = document.getElementById('calledCountBadge');
    if (uncalledBadgeEl) uncalledBadgeEl.textContent = totalUncalledCount;
    if (calledBadgeEl) calledBadgeEl.textContent = totalCalledCount;

    const tabBtnLeadsEl = document.getElementById('tabBtnLeads');
    if (tabBtnLeadsEl) tabBtnLeadsEl.textContent = \`📋 Lead Queue & Call History (\${(window.LEADS_DATA || []).length} Real Targets)\`;
    const optAllEl = document.querySelector('#batchSelect option[value="all"]');
    if (optAllEl) optAllEl.textContent = \`All \${(window.LEADS_DATA || []).length} Real Verified Leads (Strictly 2-10 Staff)\`;`;

const countsReplacement = `    // Update uncalled vs called vs callback counts using robust resolver
    let totalCalledCount = 0;
    let totalCallbackCount = 0;

    (window.LEADS_DATA || []).forEach(lead => {
      const rec = (typeof getLeadCallRecord === 'function') ? getLeadCallRecord(lead) : ((window.CALL_RECORDS || {})[lead.id]);
      if (rec && rec.called) {
        totalCalledCount++;
        if (rec.outcome === 'Call Back' || rec.outcome === 'Callback Scheduled') {
          totalCallbackCount++;
        }
      }
    });
    const totalUncalledCount = Math.max(0, (window.LEADS_DATA || []).length - totalCalledCount);

    const uncalledBadgeEl = document.getElementById('uncalledCountBadge');
    const callbackBadgeEl = document.getElementById('callbackCountBadge');
    const calledBadgeEl = document.getElementById('calledCountBadge');
    if (uncalledBadgeEl) uncalledBadgeEl.textContent = totalUncalledCount;
    if (callbackBadgeEl) callbackBadgeEl.textContent = totalCallbackCount;
    if (calledBadgeEl) calledBadgeEl.textContent = totalCalledCount;

    const countStatusAllEl = document.getElementById('countStatusAll');
    const countStatusUncalledEl = document.getElementById('countStatusUncalled');
    const countStatusCallbacksEl = document.getElementById('countStatusCallbacks');
    const countStatusCalledEl = document.getElementById('countStatusCalled');
    if (countStatusAllEl) countStatusAllEl.textContent = (window.LEADS_DATA || []).length;
    if (countStatusUncalledEl) countStatusUncalledEl.textContent = totalUncalledCount;
    if (countStatusCallbacksEl) countStatusCallbacksEl.textContent = totalCallbackCount;
    if (countStatusCalledEl) countStatusCalledEl.textContent = totalCalledCount;

    const tabBtnLeadsEl = document.getElementById('tabBtnLeads');
    if (tabBtnLeadsEl) tabBtnLeadsEl.textContent = \`📋 Lead Queue & Call History (\${(window.LEADS_DATA || []).length} Real Targets)\`;
    const optAllEl = document.querySelector('#batchSelect option[value="all"]');
    if (optAllEl) optAllEl.textContent = \`All \${(window.LEADS_DATA || []).length} Real Verified Leads (Strictly 2-10 Staff)\`;`;

if (arenaHtml.includes(countsTarget)) {
  arenaHtml = arenaHtml.replace(countsTarget, countsReplacement);
  console.log('✓ Updated renderLeadsTable() counts with robust resolver');
}

// 9. Update renderLeadsTable filter logic
const filterTarget = `      // 4. Call status filter
      const isCalled = !!(CALL_RECORDS[lead.id] && CALL_RECORDS[lead.id].called);
      if (currentLeadView === 'toCall' && isCalled) return false;
      if (currentLeadView === 'calledHistory' && !isCalled) return false;
      if (currentStatusFilter === 'uncalled' && isCalled) return false;
      if (currentStatusFilter === 'called' && !isCalled) return false;
      // 4b. Caller filter (Who Dialed)
      if (currentCallerFilter !== 'all') {
        if (!isCalled) return false;
        const callerLower = (CALL_RECORDS[lead.id]?.caller || '').toLowerCase();
        if (currentCallerFilter === 'carter' && !callerLower.includes('carter')) return false;
        if (currentCallerFilter === 'lucas' && !callerLower.includes('lucas')) return false;
        if (currentCallerFilter === 'luke' && !callerLower.includes('luke')) return false;
        if (currentCallerFilter === 'james' && !callerLower.includes('james')) return false;
        // caller filter
      }`;

const filterReplacement = `      // 4. Call status & View filter
      const rec = (typeof getLeadCallRecord === 'function') ? getLeadCallRecord(lead) : ((window.CALL_RECORDS || {})[lead.id]);
      const isCalled = !!(rec && rec.called);
      const isCallback = isCalled && (rec.outcome === 'Call Back' || rec.outcome === 'Callback Scheduled');

      // Lead View toggles
      if (currentLeadView === 'toCall' && isCalled) return false;
      if (currentLeadView === 'callbacks' && !isCallback) return false;
      if (currentLeadView === 'calledHistory' && !isCalled) return false;

      // Status pill filters
      if (currentStatusFilter === 'uncalled' && isCalled) return false;
      if (currentStatusFilter === 'callbacks' && !isCallback) return false;
      if (currentStatusFilter === 'called' && !isCalled) return false;

      // 4b. Caller filter (Who Dialed)
      if (currentCallerFilter !== 'all') {
        if (!isCalled) return false;
        const callerLower = (rec?.caller || '').toLowerCase();
        if (currentCallerFilter === 'carter' && !callerLower.includes('carter')) return false;
        if (currentCallerFilter === 'lucas' && !callerLower.includes('lucas')) return false;
        if (currentCallerFilter === 'luke' && !callerLower.includes('luke')) return false;
      }`;

if (arenaHtml.includes(filterTarget)) {
  arenaHtml = arenaHtml.replace(filterTarget, filterReplacement);
  console.log('✓ Updated renderLeadsTable() filtering to support callbacks view and getLeadCallRecord()');
}

// 10. In row generation: use getLeadCallRecord(lead)
const rowRecTarget = `      const isCalled = !!(CALL_RECORDS[lead.id] && CALL_RECORDS[lead.id].called);
      const rec = CALL_RECORDS[lead.id] || {};`;

const rowRecReplacement = `      const rec = (typeof getLeadCallRecord === 'function') ? getLeadCallRecord(lead) : ((window.CALL_RECORDS || {})[lead.id]) || {};
      const isCalled = !!(rec && rec.called);`;

if (arenaHtml.includes(rowRecTarget)) {
  arenaHtml = arenaHtml.replace(rowRecTarget, rowRecReplacement);
  console.log('✓ Updated table row generation to use getLeadCallRecord()');
}

// 11. In updateQuotaHUD: use getLeadCallRecord
const hudTarget = `    const totalInBatch = batchLeads.length;
    const calledInBatch = batchLeads.filter(l => CALL_RECORDS[l.id]?.called).length;
    const demosInBatch = batchLeads.filter(l => CALL_RECORDS[l.id]?.called && (CALL_RECORDS[l.id]?.outcome === 'Success' || CALL_RECORDS[l.id]?.outcome === 'Booked Demo')).length;`;

const hudReplacement = `    const totalInBatch = batchLeads.length;
    const calledInBatch = batchLeads.filter(l => {
      const r = (typeof getLeadCallRecord === 'function') ? getLeadCallRecord(l) : ((window.CALL_RECORDS || {})[l.id]);
      return r && r.called;
    }).length;
    const demosInBatch = batchLeads.filter(l => {
      const r = (typeof getLeadCallRecord === 'function') ? getLeadCallRecord(l) : ((window.CALL_RECORDS || {})[l.id]);
      return r && r.called && (r.outcome === 'Success' || r.outcome === 'Booked Demo');
    }).length;`;

if (arenaHtml.includes(hudTarget)) {
  arenaHtml = arenaHtml.replace(hudTarget, hudReplacement);
  console.log('✓ Updated updateQuotaHUD() to use getLeadCallRecord()');
}

// Write back
if (isCRLF) {
  arenaHtml = arenaHtml.replace(/\n/g, '\r\n');
}
fs.writeFileSync(arenaPath, arenaHtml, 'utf8');
console.log('✓ Successfully written all updates to website/cold-call-arena/index.html');
