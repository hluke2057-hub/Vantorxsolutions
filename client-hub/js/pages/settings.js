/* ============================================================
   VANTORX CLIENT HUB — pages/settings.js
   Routes: #/settings · #/billing · #/help (sub-tabbed).
   Uses aiReceptionistService, billingService, factoryReset.
   ============================================================ */

import { esc } from '../utils.js';
import { confirmDialog } from '../components.js';
import * as S from '../state.js';
import { aiReceptionistService } from '../services/aiReceptionistService.js';
import { billingService } from '../services/billingService.js';
import { toast } from '../components.js';

let activeTab = 'settings';

export function renderSettings(root, ctx, param) {
  /* Routes are #/settings, #/billing, #/help — derive the tab from the hash,
     falling back to the (unused) param so the function stays self-contained. */
  const fromHash = (location.hash.match(/^#\/(billing|help)/) || [])[1];
  const tab = fromHash || (param === 'billing' || param === 'help' ? param : 'settings');
  activeTab = tab;

  root.innerHTML = `
    <div class="page-head"><div class="page-title">${{ settings: 'Settings', billing: 'Billing', help: 'Help & Support' }[tab]}</div></div>
    <div class="settings-nav" id="settingsNav">
      <button data-tab="settings">Settings</button>
      <button data-tab="billing">Billing</button>
      <button data-tab="help">Help & Support</button>
    </div>
    <div id="settingsBody"></div>`;

  root.querySelectorAll('#settingsNav button').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
    b.addEventListener('click', () => { location.hash = '#/' + b.dataset.tab; });
  });

  const body = root.querySelector('#settingsBody');
  if (tab === 'settings') paintSettings(body, ctx);
  else if (tab === 'billing') paintBilling(body);
  else paintHelp(body, ctx);
}

/* ---------------- SETTINGS ---------------- */
function paintSettings(body, ctx) {
  const s = S.getState();
  const ai = aiReceptionistService.getStatus();

  body.innerHTML = `
    <div class="grid-side">
      <div class="card">
        <div class="card-title">🏬 Business profile</div>
        <div class="form-group"><label class="form-label">Business name</label><input class="form-input" id="setName" value="${esc(s.business.name)}"/></div>
        <div class="form-group"><label class="form-label">Phone</label><input class="form-input" id="setPhone" value="${esc(s.business.phone)}"/></div>
        <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="setEmail" value="${esc(s.business.email)}" disabled/><div class="form-hint">Email changes go through your VantorX team — use <a href="#/requests" class="link-btn" style="padding:0">Request Changes</a>.</div></div>
        <div class="form-group" style="margin-bottom:14px"><label class="form-label">Address</label><input class="form-input" id="setAddress" value="${esc(s.business.address)}"/></div>
        <button class="btn btn-gold btn-sm" id="saveBiz">Save changes</button>
      </div>

      <div class="card">
        <div class="card-title">🤖 AI Receptionist</div>
        <div class="kv-list">
          <div class="kv-row"><div class="kv-label">Status</div>
            <div class="kv-value"><span class="status-pill ${ai.online ? 'status-green' : 'status-red'}"><span class="sdot"></span>${ai.label}</span></div></div>
          <div class="kv-row"><div class="kv-label">Transfer number</div>
            <div class="kv-value" style="display:flex;gap:8px;align-items:center">
              <input class="form-input" id="setTransfer" style="max-width:180px" value="${esc(ai.transferNumber)}"/>
              <button class="btn btn-ghost btn-sm" id="saveTransfer">Save</button>
            </div></div>
          <div class="kv-row" style="border-bottom:none"><div class="kv-label">Knowledge, hours &amp; test area</div>
            <div class="kv-value"><button class="btn btn-ghost btn-sm" id="goAI">Open AI Receptionist →</button></div></div>
        </div>
        <div class="form-hint" style="margin-top:12px">Need deeper changes (voice, script, capabilities)? Use <a href="#/requests" class="link-btn" style="padding:0">Request Changes</a> — applied same-day.</div>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <div class="card-title">🔐 Session</div>
      <p class="cell-dim" style="font-size:0.84rem">Signed in as <strong>${esc(s.account.email)}</strong>. Your Hub talks to the live platform server; changes save directly to it. Data source: <code>platform/data/vantorx-db.json</code>.</p>
      <button class="btn btn-ghost btn-sm" id="hubSignOut" style="color:var(--red)">Sign out</button>
    </div>`;

  body.querySelector('#saveBiz').addEventListener('click', async function () {
    const name = body.querySelector('#setName').value.trim();
    const phone = body.querySelector('#setPhone').value.trim();
    const address = body.querySelector('#setAddress').value.trim();
    if (!name) return toast('Business name is required', 'error');
    const r = await aiReceptionistService.updateBusinessInfo({ name, phone, address });
    if (r && r.ok === false) { toast(r.error || 'Save failed', 'error'); return; }
    await ctx.hydrate();
    toast('Business profile saved to server', 'success');
  });

  body.querySelector('#saveTransfer').addEventListener('click', async function () {
    const v = body.querySelector('#setTransfer').value.trim();
    if (!v) return toast('Enter a transfer number first', 'error');
    this.disabled = true;
    const r = await aiReceptionistService.setTransferNumber(v);
    this.disabled = false;
    if (r && r.ok === false) { toast(r.error || 'Save failed', 'error'); return; }
    toast('Transfer number saved to server', 'success');
  });

  body.querySelector('#goAI').addEventListener('click', () => { location.hash = '#/ai'; });

  body.querySelector('#hubSignOut').addEventListener('click', async () => {
    const ok = await confirmDialog({ title: 'Sign out?', message: 'End your Hub session.', confirmText: 'Sign out', danger: true });
    if (!ok) return;
    await S.platformLogout();
    if (ctx.navigate) ctx.navigate('home');
  });
}

/* ---------------- BILLING ---------------- */
function paintBilling(body) {
  const plan = billingService.getPlan();

  body.innerHTML = `
    <div class="grid-side">
      <div class="card">
        <div class="card-title">💠 Your plan</div>
        <div class="kpi" style="margin-bottom:14px">
          <div class="kpi-label">Current plan</div>
          <div class="kpi-value" style="font-size:1.5rem">${esc(plan.plan)}</div>
          <div class="kpi-hint">${esc(plan.price)} · status ${esc(plan.status)}</div>
        </div>
        <div class="kv-list">
          <div class="kv-row" style="border-bottom:none"><div class="kv-label">Next billing date</div><div class="kv-value">${esc(plan.nextBilling || 'Not scheduled — card payments not connected')}</div></div>
        </div>
        <button class="btn btn-ghost btn-sm" id="manageBilling" style="margin-top:10px">Manage billing</button>
      </div>

      <div class="card">
        <div class="card-title">Everything included</div>
        <div class="kv-list">
          ${plan.features.map(f => `
            <div class="kv-row"><div class="kv-value" style="display:flex;gap:9px;align-items:flex-start">
              <span style="color:var(--gold-bright);font-weight:800">✓</span><span>${esc(f)}</span>
            </div></div>`).join('')}
          <div class="kv-row" style="border-bottom:none"><div class="kv-value cell-dim" style="font-size:0.8rem">One flat monthly price. Cancel anytime — no contracts, no setup fees.</div></div>
        </div>
      </div>
    </div>`;

  body.querySelector('#manageBilling').addEventListener('click', () => {
    const r = billingService.openManageBilling();
    toast(r.message, 'info');
  });
}

/* ---------------- HELP ---------------- */
function paintHelp(body, ctx) {
  const s = S.getState();
  const faqs = [
    ['How do I change my greeting, prices, or hours?', 'Go to Request Changes and describe what you need — your VantorX team applies changes same-day. Hours and business knowledge can also be edited instantly in the AI Receptionist section.'],
    ['What happens when the AI is off?', 'Calls ring through unanswered, like a normal phone. Toggle it back on anytime from the AI Receptionist page or Settings.'],
    ['What is LeadFlow?', 'Every new lead automatically gets a friendly 5-touch follow-up sequence over SMS and email until they reply or book. The full CRM lives in the LeadFlow app.'],
    ['Can I see what the AI says on calls?', 'Yes — every call has a full transcript in the Calls page, plus outcomes and any appointments that were booked.'],
    ['Is my data shared?', 'Your data lives on the VantorX platform server, belongs to your business, and is never sold or shared.'],
  ];

  body.innerHTML = `
    <div class="grid-side">
      <div class="card">
        <div class="card-title">Quick answers</div>
        ${faqs.map(([q, a]) => `
          <details class="faq-item"><summary class="faq-q">${esc(q)}</summary><div class="faq-a">${esc(a)}</div></details>`).join('')}
      </div>

      <div class="card">
        <div class="card-title">Contact your VantorX team</div>
        <div class="kv-list">
          <div class="kv-row"><div class="kv-label">Support line</div><div class="kv-value">${esc(s.ai.transferNumber)}</div></div>
          <div class="kv-row"><div class="kv-label">Email</div><div class="kv-value">support@vantorx.ai</div></div>
          <div class="kv-row" style="border-bottom:none"><div class="kv-label">Hours</div><div class="kv-value">Mon–Fri · 9am–6pm ET</div></div>
        </div>
        <button class="btn btn-gold btn-sm" id="helpReq" style="margin-top:14px">Submit a request</button>
        <div class="form-hint" style="margin-top:10px">Most requests are completed the same business day.</div>
      </div>
    </div>`;

  body.querySelector('#helpReq').addEventListener('click', () => { location.hash = '#/requests'; });
}
