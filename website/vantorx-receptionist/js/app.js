/* ============================================================
   VANTORX AI RECEPTIONIST — app.js
   Shell + router. Auth-gated: redirects to the portal when not
   signed in. Routes: dashboard/test/calls/appointments/
   knowledge/settings
   ============================================================ */

import { store, subscribe, boot, refreshAll, switchBusiness, logout, emit } from './store.js';
import { esc, relTime } from './utils.js';
import { toast } from './components.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderTest } from './pages/test.js';
import { renderCalls } from './pages/calls.js';
import { renderAppointments } from './pages/appointments.js';
import { renderKnowledge } from './pages/knowledge.js';
import { renderSettings } from './pages/settings.js';

const PAGES = {
  dashboard: { title: 'Dashboard', icon: '◎', render: renderDashboard },
  test: { title: 'Test Console', icon: '▶', render: renderTest },
  calls: { title: 'Calls', icon: '☏', render: renderCalls },
  appointments: { title: 'Appointments', icon: '🗓', render: renderAppointments },
  knowledge: { title: 'Knowledge', icon: '📖', render: renderKnowledge },
  settings: { title: 'Settings', icon: '⚙', render: renderSettings },
};

function providerChip() {
  const s = store;
  if (!s.config) return '';
  const t = s.config.channels.telephony.status;
  const ok = t === 'connected';
  return `
    <div class="live-pill ${ok ? 'on' : 'off'}" title="${esc(s.config.channels.telephony.note || '')}">
      <span class="pulse"></span>${ok ? 'TELEPHONY LIVE' : 'NOT CONNECTED — SETUP REQUIRED'}
    </div>`;
}

function nav() {
  const unread = store.notifications.filter((n) => !n.read).length;
  return `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <a href="/" title="Back to VantorX portal" style="text-decoration:none;color:inherit;display:flex;gap:10px;align-items:center">
        <span class="brand-mark">V</span>
        <span class="brand-name">VantorX <span class="gold">Voice</span></span>
        </a>
      </div>
      <nav class="nav-list">
        ${Object.entries(PAGES).map(([k, p]) => `
          <a class="nav-link${(location.hash || '#/dashboard') === `#/${k}` ? ' active' : ''}" href="#/${k}">
            <span class="nav-ico">${p.icon}</span>${p.title}
          </a>`).join('')}
      </nav>
      <div class="sidebar-foot">
        ${providerChip()}
        <select class="input small" id="bizSwitch" style="margin-top:8px">
          ${store.businesses.map((b) => `<option value="${b.id}" ${store.business && store.business.id === b.id ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}
        </select>
        <div class="dim small" style="margin-top:6px">${esc(store.user ? store.user.email : '')} · <a href="#" id="lnkLogout" class="dim">sign out</a></div>
      </div>
    </aside>`;
}

function shell() {
  document.getElementById('app').innerHTML = `
    ${nav()}
    <div class="main">
      <header class="topbar">
        <div class="topbar-title" id="pageTitle">Dashboard</div>
        <div class="topbar-actions">
          <span class="dim small" id="bizLabel">${esc(store.business ? store.business.name : '')}</span>
        </div>
      </header>
      <div class="content" id="pageRoot"></div>
    </div>
    <div id="modalHost"></div>`;
  document.getElementById('bizSwitch').addEventListener('change', async (e) => { await switchBusiness(e.target.value); renderRoute(); });
  document.getElementById('lnkLogout').addEventListener('click', async (e) => {
    e.preventDefault();
    await logout().catch(() => {});
    store.user = null;
    renderAuth();
  });
}

function renderAuth() {
  document.getElementById('app').innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0d14;padding:20px;">
      <div style="width:min(440px,100%);background:#101522;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:28px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
          <span style="font-weight:900;font-size:20px;color:#d4af37;background:rgba(212,175,55,0.15);padding:6px 12px;border-radius:8px;">V</span>
          <div>
            <div style="font-weight:700;font-size:16px;color:#f8fafc;">VantorX Voice</div>
            <div style="font-size:12px;color:#94a3b8;">AI Receptionist Management Console</div>
          </div>
        </div>
        <p style="font-size:13px;color:#94a3b8;margin-bottom:16px;">Sign in with your client credentials to manage Ava's live prompt, emergency routing, and audio test console.</p>
        
        <div style="margin-bottom:12px;">
          <label style="display:block;font-size:12px;color:#cbd5e1;margin-bottom:4px;font-weight:600;">Email Address</label>
          <input type="email" id="rxEmail" class="input" style="width:100%;padding:10px 12px;background:#0b0e17;border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;" placeholder="owner@business.com" />
        </div>
        <div style="margin-bottom:16px;">
          <label style="display:block;font-size:12px;color:#cbd5e1;margin-bottom:4px;font-weight:600;">Password</label>
          <input type="password" id="rxPass" class="input" style="width:100%;padding:10px 12px;background:#0b0e17;border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;" placeholder="••••••••" />
        </div>
        <div id="rxErr" style="color:#f87171;font-size:12px;margin-bottom:12px;"></div>

        <div style="display:flex;gap:10px;margin-bottom:16px;">
          <button class="btn btn-gold" id="rxLoginBtn" style="flex:1;">Sign In →</button>
          <button class="btn btn-ghost" id="rxDemoBtn" style="flex:1;">⚡ Demo Console</button>
        </div>

        <div style="text-align:center;font-size:12px;color:#64748b;border-top:1px solid rgba(255,255,255,0.06);padding-top:14px;">
          <a href="/client-hub/" style="color:#d4af37;text-decoration:none;">Open Client Hub</a> · <a href="/" style="color:#94a3b8;text-decoration:none;">VantorX Portal Home</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById('rxLoginBtn').addEventListener('click', async () => {
    const email = document.getElementById('rxEmail').value.trim();
    const pass = document.getElementById('rxPass').value;
    const errBox = document.getElementById('rxErr');
    errBox.textContent = '';
    if (!email || !pass) { errBox.textContent = 'Enter email and password.'; return; }
    try {
      await api.login(email, pass);
      await boot();
      if (store.user) {
        shell();
        renderRoute();
      } else {
        errBox.textContent = 'Could not load business profile.';
      }
    } catch (e) {
      errBox.textContent = e.message || 'Login failed.';
    }
  });

  document.getElementById('rxDemoBtn').addEventListener('click', () => {
    store.user = { email: 'demo@vantorxsolutions.com', name: 'Demo Contractor' };
    store.business = { id: 'demo_contractor', name: 'Apex Plumbing & HVAC' };
    store.businesses = [store.business];
    store.config = {
      agent_name: 'Ava',
      greeting: 'Thank you for calling Apex Plumbing & HVAC, this is Ava. Are you calling for emergency service or to schedule a standard appointment?',
      channels: { telephony: { status: 'connected', note: 'Live Twilio & Retell AI voice trunking active' } },
      knowledge: { faqs: [{ q: 'What are your hours?', a: 'Monday through Saturday, 7 AM to 7 PM. 24/7 emergency dispatch available.' }] },
    };
    store.calls = [
      { id: 'c1', from: '+15615550192', at: new Date(Date.now() - 3600000).toISOString(), outcome: 'Appointment Booked', summary: 'Customer requested water heater replacement quote. Scheduled for tomorrow 9 AM.' },
      { id: 'c2', from: '+15615550144', at: new Date(Date.now() - 86400000).toISOString(), outcome: 'Transferred', summary: 'Emergency burst pipe in crawl space. Live transferred to owner on-call cell.' }
    ];
    store.appointments = [
      { id: 'a1', customer: 'David Miller', phone: '(561) 555-0192', service: 'Water Heater Replacement', at: new Date(Date.now() + 86400000).toISOString(), status: 'Confirmed' }
    ];
    store.loaded = true;
    shell();
    renderRoute();
    toast('Welcome to Ava Voice Demo Console', 'success');
  });
}

let booted = false;
export async function start() {
  if (booted) return;
  booted = true;
  await boot();
  if (!store.user) { renderAuth(); return; }
  shell();
  subscribe(() => {
    const chipHost = document.querySelector('.sidebar-foot');
    if (!chipHost) return;
    const active = location.hash || '#/dashboard';
    document.querySelectorAll('.nav-link').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === active));
  });
  window.addEventListener('hashchange', renderRoute);
  if (!location.hash) location.hash = '#/dashboard';
  renderRoute();
}

export function renderRoute() {
  if (!store.user) return;
  const key = (location.hash.replace('#/', '') || 'dashboard').split('?')[0];
  const page = PAGES[key] || PAGES.dashboard;
  document.getElementById('pageTitle').textContent = page.title;
  const root = document.getElementById('pageRoot');
  if (!store.loaded) { root.innerHTML = '<div class="dim">Loading…</div>'; return; }
  page.render(root, { store, refresh: renderRoute, toast, emit, refreshAll });
}

start();

