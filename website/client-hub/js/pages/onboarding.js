/* ============================================================
   VANTORX CLIENT HUB — pages/onboarding.js
   8-step first-run wizard, gated before routing. Finishes by
   setting state.onboarded = true (persisted in localStorage).
   Signature: renderOnboarding(root, ctx) — matches app.js.
   ============================================================ */

import * as S from '../state.js';
import { esc } from '../utils.js';

const STEPS = [
  'Welcome', 'Business profile', 'Hours & services', 'AI Receptionist',
  'LeadFlow', 'Requests', 'Billing', "You're set",
];

const ONB_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function renderOnboarding(root, ctx) {
  if (document.getElementById('onboardOverlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'onboard-overlay';
  overlay.id = 'onboardOverlay';
  overlay.innerHTML = `
    <div class="onboard-card">
      <div class="onboard-progress" id="onbDots"></div>
      <div class="onboard-step-label" id="onbStepLabel" style="font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-dim);margin-bottom:8px"></div>
      <div id="onbBody"></div>
      <div style="display:flex;gap:9px;justify-content:flex-end;margin-top:20px">
        <button class="btn btn-ghost btn-sm" id="onbBack">Back</button>
        <button class="btn btn-gold" id="onbNext">Continue</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const body = overlay.querySelector('#onbBody');
  const q = (sel) => overlay.querySelector(sel);

  let i = 0;

  function paint() {
    q('#onbDots').innerHTML = STEPS.map((_, n) =>
      `<span class="${n <= i ? 'done' : ''}"></span>`).join('');
    q('#onbStepLabel').textContent = `Step ${i + 1} of 8 · ${STEPS[i]}`;
    q('#onbNext').textContent = i === STEPS.length - 1 ? 'Enter the Hub' : 'Continue';
    q('#onbBack').hidden = i === 0;
    paintStep();
  }

  function paintStep() {
    const s = S.getState();
    if (i === 0) {
      body.innerHTML = `
        <div class="onboard-title">Welcome to VantorX Hub</div>
        <p class="onboard-sub">This is the command center for your AI Receptionist and LeadFlow — every call, booking, and follow-up in one place. This 60-second tour shows you around.</p>
        <div class="cap-grid" style="grid-template-columns:1fr 1fr">
          ${[['✦', 'AI Receptionist', 'Answers calls 24/7 in your business voice'],
             ['▤', 'Bookings', 'Every confirmed appointment lands here'],
             ['⟳', 'LeadFlow', 'Automatic follow-up until they reply'],
             ['✎', 'Requests', 'Ask for changes — applied same-day']]
            .map(([ic, t, d]) => `<div class="cap-card"><span class="cap-ico">${ic}</span><div><div style="font-weight:600;font-size:0.84rem">${t}</div><div style="font-size:0.74rem;color:var(--text-dim)">${d}</div></div></div>`).join('')}
        </div>`;
    } else if (i === 1) {
      body.innerHTML = `
        <div class="onboard-title">Business profile</div>
        <p class="onboard-sub">How your business appears across the Hub. Pre-filled with your details — adjust anything that's off.</p>
        <div class="form-group"><label class="form-label">Business name</label><input class="form-input" id="onbName" value="${esc(s.business.name)}"/></div>
        <div class="form-group"><label class="form-label">Phone</label><input class="form-input" id="onbPhone" value="${esc(s.business.phone)}"/></div>
        <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="onbEmail" value="${esc(s.business.email)}"/></div>
        <div class="form-group" style="margin-bottom:0"><label class="form-label">Address</label><input class="form-input" id="onbAddress" value="${esc(s.business.address)}"/></div>`;
    } else if (i === 2) {
      body.innerHTML = `
        <div class="onboard-title">Hours &amp; services</div>
        <p class="onboard-sub">The AI books within these hours and only offers these services. You can edit both later in the AI Receptionist section.</p>
        <div class="kv-list" style="margin-bottom:14px">
          ${ONB_DAYS.map(d => {
            const h = s.business.hours[d];
            return `<div class="kv-row"><div class="kv-label" style="width:90px">${d}</div><div class="kv-value">${h ? `${h[0]} – ${h[1]}` : '<span style="color:var(--red)">Closed</span>'}</div></div>`;
          }).join('')}
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${s.business.services.map(v => `<span class="chip">${esc(v.name)} · $${v.price} · ${v.duration} min</span>`).join('')}
        </div>`;
    } else if (i === 3) {
      body.innerHTML = `
        <div class="onboard-title">Meet ${esc(s.ai.name)}</div>
        <p class="onboard-sub">Your AI Receptionist answers every call on <strong>${esc(s.business.phone)}</strong>, books straight into ${esc(s.ai.calendar)}, and transfers anything sensitive to <strong>${esc(s.ai.transferNumber)}</strong>. You can switch it off anytime.</p>
        <div class="kv-list">
          <div class="kv-row"><div class="kv-label">Status</div><div class="kv-value"><span class="status-pill ${s.ai.status === 'online' ? 'status-green' : 'status-red'}"><span class="sdot"></span>${s.ai.status === 'online' ? 'ONLINE' : 'OFFLINE'}</span></div></div>
          <div class="kv-row"><div class="kv-label">Voice</div><div class="kv-value">${esc(s.ai.voice)}</div></div>
          <div class="kv-row"><div class="kv-label">Capabilities</div><div class="kv-value">Answer · Book · Reschedule · Cancel · Answer FAQs · Transfer</div></div>
        </div>`;
    } else if (i === 4) {
      const leads = s.leads.length;
      const queue = s.tasks.filter(t => !t.done).length;
      body.innerHTML = `
        <div class="onboard-title">LeadFlow is active</div>
        <p class="onboard-sub">Every lead automatically gets a friendly 5-touch follow-up sequence over SMS and email until they reply or book — no lead goes cold.</p>
        <div class="kv-list">
          <div class="kv-row"><div class="kv-label">Leads tracked</div><div class="kv-value">${leads}</div></div>
          <div class="kv-row"><div class="kv-label">Follow-ups in queue</div><div class="kv-value">${queue}</div></div>
          <div class="kv-row"><div class="kv-label">Sequence</div><div class="kv-value">5 touches · SMS + email · stops on reply</div></div>
        </div>`;
    } else if (i === 5) {
      body.innerHTML = `
        <div class="onboard-title">Request Changes</div>
        <p class="onboard-sub">Anything you want changed — greeting, prices, hours, what the AI says — submit it from the Requests page. Changes are applied same-day; no tickets, no waiting on hold.</p>
        <div class="cap-grid" style="grid-template-columns:1fr 1fr">
          ${['Pricing & services', 'Business hours', 'AI behavior', 'Call transfers', 'Calendar', 'Phone number']
            .map(t => `<div class="cap-card"><span class="cap-ico">✎</span>${t}</div>`).join('')}
        </div>`;
    } else if (i === 6) {
      const a = s.account;
      body.innerHTML = `
        <div class="onboard-title">Billing</div>
        <p class="onboard-sub">One flat monthly plan — everything included. Cancel anytime, no contracts, no setup fees.</p>
        <div class="kv-list">
          <div class="kv-row"><div class="kv-label">Plan</div><div class="kv-value">${esc(a.plan)}</div></div>
          <div class="kv-row"><div class="kv-label">Price</div><div class="kv-value">${esc(a.price)}</div></div>
          <div class="kv-row"><div class="kv-label">Status</div><div class="kv-value">${esc(a.status)}</div></div>
          <div class="kv-row" style="border-bottom:none"><div class="kv-label">Billing</div><div class="kv-value">${esc(a.nextBilling)}</div></div>
        </div>`;
    } else {
      body.innerHTML = `
        <div class="onboard-title">You're set 🎉</div>
        <p class="onboard-sub">The Hub is pre-loaded with realistic demo data so you can explore freely. Reset it anytime from Account → Reset demo data.</p>
        <div class="kv-list">
          <div class="kv-row"><div class="kv-label">AI Receptionist</div><div class="kv-value"><span class="status-pill status-green"><span class="sdot"></span>Online</span></div></div>
          <div class="kv-row" style="border-bottom:none"><div class="kv-label">LeadFlow</div><div class="kv-value">Active — ${s.leads.length} leads tracked</div></div>
        </div>`;
    }
  }

  function commit() {
    if (i !== 1) return;
    const name = q('#onbName').value.trim();
    const phone = q('#onbPhone').value.trim();
    const email = q('#onbEmail').value.trim();
    const address = q('#onbAddress').value.trim();
    S.setState(s => {
      if (name) s.business.name = name;
      if (phone) s.business.phone = phone;
      if (email) s.business.email = email;
      if (address) s.business.address = address;
    });
  }

  q('#onbNext').addEventListener('click', () => {
    commit();
    if (i < STEPS.length - 1) { i++; paint(); }
    else {
      S.setState(s => { s.onboarded = true; }); // app.js subscriber routes to the dashboard
      overlay.remove();
    }
  });
  q('#onbBack').addEventListener('click', () => { if (i > 0) { i--; paint(); } });

  paint();
}
