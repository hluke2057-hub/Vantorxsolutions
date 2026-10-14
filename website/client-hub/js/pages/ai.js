/* ============================================================
   VANTORX CLIENT HUB — pages/ai.js (PRODUCTION)
   Live receptionist config: real status (fail-closed toggle),
   real knowledge editor (PUT /api/receptionist/config), real
   hours (PUT /api/hours), real talk-API test console.
   ============================================================ */

import { esc } from '../utils.js';
import { aiReceptionistService } from '../services/aiReceptionistService.js';
import { api } from '../live.js';
import { toast, emptyState } from '../components.js';
import { session } from '../live.js';

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_FULL = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };

export function renderAI(root, ctx) {
  const s = ctx.getState();
  const st = aiReceptionistService.getStatus();

  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">AI Receptionist</div>
      <div class="page-sub">Your receptionist config is live on the platform server. Going online is fail-closed — it needs real telephony/LLM credentials first.</div>
    </div>

    <div class="grid-side" style="margin-bottom:18px">
      <div class="card">
        <div class="card-title">
          🤖 ${esc(st.name)} — your AI receptionist
          <span class="status-pill ${st.online ? 'status-green' : 'status-red'}" style="margin-left:auto">
            <span class="sdot"></span>${st.label} <span class="cell-dim" style="font-size:0.7rem">(test mode)</span>
          </span>
        </div>
        <div class="kv-list">
          <div class="kv-row"><div class="kv-label">Business phone</div><div class="kv-value">${esc(st.phone || '—')}</div></div>
          <div class="kv-row"><div class="kv-label">Transfer number</div>
            <div class="kv-value" style="display:flex;gap:10px;align-items:center">
              <input class="form-input" id="transferInput" style="max-width:220px" value="${esc(st.transferNumber)}"/>
              <button class="btn btn-ghost btn-sm" id="saveTransfer">Save</button>
            </div>
          </div>
          <div class="kv-row"><div class="kv-label">Status</div>
            <div class="kv-value" style="display:flex;align-items:center;gap:12px">
              <div class="toggle ${st.online ? 'on' : ''}" id="aiToggle" role="switch" aria-checked="${st.online}"></div>
              <span id="aiToggleHint" style="font-size:0.8rem;color:var(--text-soft)">Not answering — calls ring through unanswered</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">🛠️ Capabilities</div>
        <div class="cap-grid" style="grid-template-columns:1fr 1fr">
          ${[['📞', 'Answer Calls'], ['📅', 'Book Appointments'], ['🔁', 'Reschedule'], ['🚫', 'Cancel'], ['❓', 'Answer Questions'], ['🙋', 'Transfer to Human']]
            .map(([i, t]) => `<div class="cap-card"><span class="cap-ico">${i}</span>${t}</div>`).join('')}
        </div>
        <div class="form-hint" style="margin-top:12px">Capabilities are managed by your VantorX team — request changes any time.</div>
      </div>
    </div>

    <div class="section-stack">
      <div class="card">
        <div class="card-title">📚 Business knowledge
          <span class="chip" style="margin-left:auto">Saved to the platform server</span>
        </div>
        <div class="form-row" style="margin-bottom:0">
          <div class="form-group"><label class="form-label">Business name</label><input class="form-input" id="kbName" value="${esc(s.business.name)}"/></div>
          <div class="form-group"><label class="form-label">Location</label><input class="form-input" id="kbLocation" value="${esc(s.business.address)}"/></div>
        </div>
        <div class="form-group"><label class="form-label">Policies (what the AI tells callers)</label>
          <textarea class="form-textarea" id="kbPolicies" rows="3">${esc((s.ai.knowledge && s.ai.knowledge.policies) || '')}</textarea>
        </div>
        <div class="form-group" style="margin-bottom:0"><label class="form-label">Payment methods (what the AI tells callers)</label>
          <textarea class="form-textarea" id="kbPayments" rows="2">${esc((s.ai.knowledge && s.ai.knowledge.payments) || '')}</textarea>
        </div>
        <div style="display:flex;gap:9px;margin-top:14px;align-items:center">
          <button class="btn btn-gold btn-sm" id="saveKB">Save knowledge</button>
          <span id="kbSavedAt" style="font-size:0.74rem;color:var(--text-dim)">Saved to server</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">🕒 Business hours (drives real availability)</div>
        <div id="hoursEditor"><div class="cx-loading">Loading hours…</div></div>
        <button class="btn btn-gold btn-sm" id="saveHours" style="margin-top:10px">Save hours</button>
      </div>

      <div class="ai-test-box">
        <div class="card-title" style="margin-bottom:4px">🧪 Test your AI — live engine</div>
        <div class="page-sub" style="margin-bottom:12px">Runs the real receptionist engine in test mode. Bookings in test mode are previews — nothing is committed until activation.</div>
        <div style="display:flex;gap:9px;flex-wrap:wrap">
          <input class="form-input" id="testInput" placeholder='Try: "I need a haircut tomorrow."' style="flex:1;min-width:240px"/>
          <button class="btn btn-gold" id="runTest">Run Test</button>
        </div>
        <div class="test-chip-row">
          <button class="test-chip" data-sc='I need a haircut tomorrow.'>"I need a haircut tomorrow."</button>
          <button class="test-chip" data-sc='How much is a haircut?'>"How much is a haircut?"</button>
          <button class="test-chip" data-sc='What time do you open today?'>"What time do you open today?"</button>
          <button class="test-chip" data-sc='Can I speak to the owner?'>"Can I speak to the owner?"</button>
        </div>
        <div id="testResult" style="margin-top:16px"></div>
      </div>
    </div>
  `;

  /* ---------- hours editor (server-backed) ---------- */
  const bizId = session.bizId;
  const hoursEl = root.querySelector('#hoursEditor');
  api('GET', `/api/hours/${encodeURIComponent(bizId)}`).then(hr => {
    const row = (hr.status === 200 && hr.row) || {};
    hoursEl.innerHTML = DAYS.map(d => {
      const h = row[d] || { open: '', close: '', closed: true };
      return `
        <div class="kv-row" data-day="${d}">
          <div class="kv-label" style="width:110px">${DAY_FULL[d]}</div>
          <input class="form-input h-open" data-hr="${d}" data-edge="open" style="max-width:110px" value="${esc(h.open || '')}" ${h.closed ? 'disabled' : ''}/>
          <span style="color:var(--text-dim)">–</span>
          <input class="form-input h-close" data-hr="${d}" data-edge="close" style="max-width:110px" value="${esc(h.close || '')}" ${h.closed ? 'disabled' : ''}/>
          <label style="display:flex;align-items:center;gap:6px;margin-left:auto;font-size:0.78rem">
            <input type="checkbox" data-hr-closed="${d}" ${h.closed ? 'checked' : ''}/> closed
          </label>
        </div>`;
    }).join('');
    hoursEl.querySelectorAll('[data-hr-closed]').forEach(cb => cb.addEventListener('change', () => {
      const d = cb.dataset.hrClosed;
      const off = cb.checked;
      hoursEl.querySelector(`[data-hr="${d}"][data-edge="open"]`).disabled = off;
      hoursEl.querySelector(`[data-hr="${d}"][data-edge="close"]`).disabled = off;
    }));
  });

  root.querySelector('#saveHours').addEventListener('click', function () {
    this.disabled = true;
    const payload = { businessId: bizId };
    DAYS.forEach(d => {
      const off = hoursEl.querySelector(`[data-hr-closed="${d}"]`).checked;
      payload[d] = {
        open: hoursEl.querySelector(`[data-hr="${d}"][data-edge="open"]`).value,
        close: hoursEl.querySelector(`[data-hr="${d}"][data-edge="close"]`).value,
        closed: off,
      };
    });
    api('PUT', `/api/hours/${encodeURIComponent(bizId)}`, payload).then(r => {
      this.disabled = false;
      if (r.error) { toast(r.error, 'error'); return; }
      toast('Hours saved to server', 'success');
    });
  });

  /* ---------- save actions (async writes) ---------- */
  root.querySelector('#saveTransfer').addEventListener('click', function () {
    const v = root.querySelector('#transferInput').value.trim();
    if (!v) return toast('Enter a transfer number first', 'error');
    this.disabled = true;
    aiReceptionistService.setTransferNumber(v).then(r => {
      this.disabled = false;
      if (r && r.ok === false) { toast(r.error || 'Save failed', 'error'); return; }
      toast('Transfer number saved to server', 'success');
    });
  });

  root.querySelector('#aiToggle').addEventListener('click', async () => {
    const nowOnline = !aiReceptionistService.getStatus().online;
    const r = await aiReceptionistService.setStatus(nowOnline);
    if (r && r.ok === false) {
      toast(r.error, 'error');
      root.querySelector('#aiToggleHint').textContent = `Blocked: ${r.error}`;
      return;
    }
    await ctx.hydrate();
    const onlineNow = aiReceptionistService.getStatus().online;
    toast(onlineNow ? 'AI Receptionist is online' : 'AI Receptionist turned offline', onlineNow ? 'success' : 'info');
  });

  root.querySelector('#saveKB').addEventListener('click', function () {
    this.disabled = true;
    (async () => {
      const profile = {};
      const kb = {};
      const name = root.querySelector('#kbName').value.trim();
      if (name && name !== s.business.name) profile.name = name;
      const r = await aiReceptionistService.updateBusinessInfo({
        name: name || undefined,
        policies: root.querySelector('#kbPolicies').value,
        payments: root.querySelector('#kbPayments').value,
      });
      this.disabled = false;
      if (r && r.ok === false) { toast(r.error || 'Save failed', 'error'); return; }
      toast('Knowledge saved to the platform server', 'success');
    })();
  });

  /* ---------- test area (real talk API) ---------- */
  const input = root.querySelector('#testInput');
  const result = root.querySelector('#testResult');
  let testSession = null;
  let greeting = '';

  const ensureSession = async () => {
    if (testSession) return true;
    const r = await aiReceptionistService.startTest();
    if (r.error || !r.sessionId) { toast(r.error || 'Test console unavailable', 'error'); return false; }
    testSession = r.sessionId;
    greeting = r.greeting || '';
    return true;
  };

  const run = async () => {
    const scenario = input.value.trim();
    if (!scenario) return toast('Type a test scenario first', 'error');
    result.innerHTML = `<div style="display:flex;align-items:center;gap:10px;color:var(--text-dim);font-size:0.84rem">
      <span class="typing-dots"><i></i><i></i><i></i></span> ${esc(st.name)} is thinking…</div>`;
    const okStart = await ensureSession();
    if (!okStart) { result.innerHTML = ''; return; }
    const r = await aiReceptionistService.turn(testSession, scenario);
    if (r.error) { result.innerHTML = `<div class="cx-error">✕ ${esc(r.error)}</div>`; return; }
    result.innerHTML = `
      <div class="sim-bubble">
        ${greeting ? `<div class="cell-dim" style="font-size:0.72rem;margin-bottom:6px">${esc(st.name)}: "${esc(greeting)}"</div>` : ''}
        <div class="cell-dim" style="font-size:0.72rem;margin-bottom:8px">Caller: "${esc(scenario)}"</div>
        <div style="margin-bottom:10px">${esc(r.reply)}</div>
        <span class="chip" style="background:var(--gold-dim);color:var(--gold-bright);border-color:rgba(212,175,55,0.3)">Intent: ${esc(r.intent || 'question')}</span>
        ${(r.preview && r.preview.service) ? `<span class="chip">Booking preview: ${esc(r.preview.service)}</span>` : ''}
      </div>`;
  };
  root.querySelector('#runTest').addEventListener('click', run);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
  root.querySelectorAll('.test-chip').forEach(c => c.addEventListener('click', () => { input.value = c.dataset.sc; run(); }));
}
