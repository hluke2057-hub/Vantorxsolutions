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
  document.getElementById('lnkLogout').addEventListener('click', async (e) => { e.preventDefault(); await logout(); location.href = '/platform/portal.html'; });
}

let booted = false;
export async function start() {
  if (booted) return;
  booted = true;
  await boot();
  if (!store.user) { location.href = '/platform/portal.html'; return; }
  shell();
  subscribe(() => {
    const chipHost = document.querySelector('.sidebar-foot');
    if (!chipHost) return;
    // light refresh of dynamic bits without nuking page state
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
