/* ============================================================
   VANTORX CLIENT HUB — app.js
   Router · sidebar · topbar (search/notifications/account) ·
   mobile drawer · onboarding gate · shared page context (ctx)
   ============================================================ */

import * as S from './state.js';
import * as U from './utils.js';
import { openModal, toast, confirmDialog, emptyState } from './components.js';
import { renderOnboarding } from './pages/onboarding.js';
import { renderHome } from './pages/home.js';
import { renderAI } from './pages/ai.js';
import { renderCalls, openCallDetail } from './pages/calls.js';
import { renderAppointments, openApptModal } from './pages/appointments.js';
import { renderLeadFlow, setLeadFlowTab } from './pages/leadflow.js';
import { renderActivity } from './pages/activity.js';
import { renderRequests, setRequestPrefill } from './pages/requests.js';
import { renderSettings } from './pages/settings.js';
import { notificationService } from './services/notificationService.js';

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

/* ---------------- shared page context ---------------- */
const ctx = {
  getState: S.getState,
  setState: S.setState,
  hydrate: S.hydrate,
  navigate,
  openCall: (id) => openCallDetail(id, ctx),
  openAppointment: (id) => openApptModal(id, ctx),
  testAI: () => {
    navigate('ai');
    setTimeout(() => $('#testInput')?.focus(), 120);
  },
  openLeadFlowApp: () => window.open('../leadflow/leadflow-app.html', '_blank'),
};

/* ---------------- routing ---------------- */
const routes = {
  home: renderHome,
  ai: renderAI,
  calls: renderCalls,
  appointments: renderAppointments,
  leadflow: renderLeadFlow,
  activity: renderActivity,
  requests: renderRequests,
  settings: renderSettings,
  billing: renderSettings,
  help: renderSettings,
};

const TITLES = {
  home: 'Home', ai: 'AI Receptionist', calls: 'Calls', appointments: 'Appointments',
  leadflow: 'LeadFlow', activity: 'Activity', requests: 'Request Changes',
  settings: 'Settings', billing: 'Billing', help: 'Help & Support',
};

function parseHash() {
  const h = (location.hash || '#/home').replace(/^#\//, '');
  const [page, ...rest] = h.split('/');
  return { page: page || 'home', param: rest.join('/') };
}

function setActiveNav(page) {
  const mapped = page === 'billing' || page === 'help' ? 'settings' : page;
  $$('#sidebar .nav-item').forEach(a => a.classList.toggle('active', a.dataset.nav === mapped));
}

async function router() {
  const view = $('#view');
  const s = S.getState();

  /* auth / session gates — before anything renders */
  if (s.authRequired) {
    setActiveNav('');
    $('#topbarTitle').textContent = 'Sign in';
    view.innerHTML = '';
    const authEl = document.createElement('div');
    authEl.className = 'page';
    authEl.innerHTML = `
      <div style="display:flex;justify-content:center;padding-top:8vh">
        <div class="card" style="width:min(440px,100%)">
          <div class="card-title">🔐 Sign in to your Hub</div>
          <p class="cell-dim" style="font-size:0.84rem;margin:0 0 12px">Your Hub shows your live business data, call recordings, and Ava settings.</p>
          <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="hubEmail" type="email" autocomplete="username"/></div>
          <div class="form-group"><label class="form-label">Password</label><input class="form-input" id="hubPass" type="password" autocomplete="current-password"/></div>
          <div id="hubAuthErr"></div>
          <div style="display:flex;gap:9px;margin-top:14px;flex-wrap:wrap">
            <button class="btn btn-gold" id="hubGo" style="flex:1">Sign In</button>
            <button class="btn btn-ghost" id="hubDemo" style="flex:1">⚡ Demo Preview</button>
          </div>
          <div style="margin-top:14px;text-align:center">
            <a class="cell-dim" href="/" style="font-size:0.8rem;text-decoration:none">← Return to VantorX Portal</a>
          </div>
        </div>
      </div>`;
    view.appendChild(authEl);
    authEl.querySelector('#hubGo').addEventListener('click', async () => {
      const email = authEl.querySelector('#hubEmail').value.trim();
      const pass = authEl.querySelector('#hubPass').value;
      authEl.querySelector('#hubAuthErr').innerHTML = '';
      const r = await S.platformLogin(email, pass);
      if (!r.ok) { authEl.querySelector('#hubAuthErr').innerHTML = `<div class="cx-error">✕ ${U.esc(r.error)}</div>`; return; }
      router();
    });
    authEl.querySelector('#hubDemo').addEventListener('click', () => {
      S.mountDemoMode();
      toast('Welcome to Apex Plumbing Interactive Hub Demo', 'success');
      router();
    });
    authEl.querySelector('#hubPass').addEventListener('keydown', e => { if (e.key === 'Enter') authEl.querySelector('#hubGo').click(); });
    closeMobileNav();
    return;
  }

  if (s.adminAccount) {
    setActiveNav('');
    view.innerHTML = '';
    const el = document.createElement('div');
    el.className = 'page';
    el.innerHTML = `<div style="display:flex;justify-content:center;padding-top:8vh">
      <div class="card" style="width:min(520px,100%)">${emptyState('🛡️', 'Platform admin account', 'The Client Hub is for business owner and staff accounts. Use the VantorX Admin console to manage tenants.', '<a class="btn btn-gold btn-sm" href="/vantorx-admin/admin-app.html" style="text-decoration:none">Open Admin console →</a>')}</div>
    </div>`;
    view.appendChild(el);
    closeMobileNav();
    return;
  }
  if (s.serverError) {
    setActiveNav('');
    view.innerHTML = '';
    const el = document.createElement('div');
    el.className = 'page';
    el.innerHTML = `<div class="card">${emptyState('📡', 'Platform server not reachable', U.esc(s.serverError) + ' The Hub only shows real platform data — it stays empty until the server responds.', '<a class="btn btn-ghost btn-sm" href="/" style="text-decoration:none">← Portal home</a>')}</div>`;
    view.appendChild(el);
    closeMobileNav();
    return;
  }
  if (s.needOnboarding) {
    setActiveNav('');
    $('#topbarTitle').textContent = 'Welcome';
    view.innerHTML = '';
    const el = document.createElement('div');
    el.className = 'page';
    el.innerHTML = `<div style="display:flex;justify-content:center;padding-top:8vh">
      <div class="card" style="width:min(560px,100%)">${emptyState('🚀', 'Your business is being set up', 'Your VantorX team is building and configuring your system for you. You will get access here as soon as it is ready — contact your VantorX representative if you have questions.')}</div>
    </div>`;
    view.appendChild(el);
    closeMobileNav();
    return;
  }

  const { page, param } = parseHash();
  const render = routes[page] || renderHome;
  setActiveNav(page);
  $('#topbarTitle').textContent = TITLES[page] || 'VantorX Hub';
  view.innerHTML = '';
  const pageEl = document.createElement('div');
  pageEl.className = 'page';
  view.appendChild(pageEl);
  try {
    await render(pageEl, ctx, param);
  } catch (err) {
    console.error('Render failed on', page, err);
    pageEl.innerHTML = `<div class="card">${emptyState('⚠️', 'Something went wrong', 'This section failed to load. Try navigating again — the rest of the Hub still works.')}</div>`;
  }
  closeMobileNav();
  $('.content').scrollTop = 0;
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', async () => { await S.init(); paintIdentity(); router(); });

/* ---------------- identity (sidebar biz card + avatar) ---------------- */
function paintIdentity() {
  const s = S.getState();
  const name = s.account?.name || 'Client';
  $('#bizName').textContent = s.business?.name || '—';
  $('#bizPlan').textContent = s.business?.industry || 'Client Portal';
  $('#avatarName').textContent = name.split(' ')[0];
  $('#avatarInitials').textContent = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

/* ---------------- navigation helper ---------------- */
function navigate(route, opts = {}) {
  if (route === 'requests' && opts.prefill) setRequestPrefill(opts.prefill);
  if (route === 'leadflow' && opts.tab) setLeadFlowTab(opts.tab);
  const target = '#/' + route;
  if (location.hash === target) router(); // same-route re-render
  else location.hash = target;
}

/* ---------------- sidebar / mobile drawer ---------------- */
const sidebar = $('#sidebar');
const scrim = $('#mobileScrim');

function closeMobileNav() {
  sidebar.classList.remove('mobile-open');
  scrim.hidden = true;
}
$('#menuBtn').addEventListener('click', () => {
  sidebar.classList.add('mobile-open');
  scrim.hidden = false;
});
scrim.addEventListener('click', closeMobileNav);
$$('#sidebar .nav-item').forEach(a => a.addEventListener('click', closeMobileNav));

/* ---------------- notifications ---------------- */
function refreshNotifDot() {
  const unread = notificationService.unreadCount();
  $('#notifDot').classList.toggle('show', unread > 0);
}

function openNotifications() {
  const items = notificationService.getNotifications();
  const unread = notificationService.unreadCount();
  openModal({
    title: `Notifications${unread ? ` · ${unread} new` : ''}`,
    wide: true,
    body: items.length ? `<div>${items.map(n => `
      <div class="list-row" ${n.link ? `data-go="${n.link}"` : ''} style="${n.read ? 'opacity:0.6' : ''}">
        <div class="row-ico" style="background:var(--bg-hover)">${n.icon || '•'}</div>
        <div class="row-main">
          <div class="row-title">${U.esc(n.title)}</div>
          <div class="row-sub">${U.esc(n.body || '')}</div>
        </div>
        <div class="row-time">${U.relTime(n.at)}</div>
      </div>`).join('')}</div>`
      : emptyState('◔', 'No notifications', 'Updates from your AI, bookings, and leads will appear here.'),
    footer: `<button class="btn btn-ghost btn-sm" data-close2>Close</button>`,
    onOpen: ({ modal, close }) => {
      modal.querySelector('[data-close2]').addEventListener('click', close);
      modal.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => { close(); navigate(b.dataset.go); }));
    },
  });
  notificationService.markAllRead();
  refreshNotifDot();
}

$('#notifBtn').addEventListener('click', openNotifications);

/* ---------------- account menu ---------------- */
$('#accountBtn').addEventListener('click', openAccount);
$('#bizCard').addEventListener('click', openAccount);

function openAccount() {
  const a = S.getState().account;
  const b = S.getState().business;
  openModal({
    title: 'Account',
    body: `
      <div class="kv-list">
        <div class="kv-row"><div class="kv-label">Signed in</div><div class="kv-value">${U.esc(a.name)}<div class="cell-dim">${U.esc(a.email)}</div></div></div>
        <div class="kv-row"><div class="kv-label">Business</div><div class="kv-value">${U.esc(b.name)}<div class="cell-dim">${U.esc(b.industry || '')}</div></div></div>
        <div class="kv-row"><div class="kv-label">Billing</div><div class="kv-value">Managed by your VantorX agreement</div></div>
      </div>
      <div style="display:flex;gap:9px;margin-top:16px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" data-act="billing">Billing</button>
        <button class="btn btn-ghost btn-sm" data-act="settings">Settings</button>
        <button class="btn btn-ghost btn-sm" data-act="signout" style="color:var(--red)">Sign out</button>
      </div>`,
    onOpen: ({ modal, close }) => {
      modal.querySelector('[data-act="billing"]').addEventListener('click', () => { close(); navigate('billing'); });
      modal.querySelector('[data-act="settings"]').addEventListener('click', () => { close(); navigate('settings'); });
      modal.querySelector('[data-act="signout"]').addEventListener('click', async () => {
        close();
        await S.platformLogout();
        router();
        toast('Signed out', 'info');
      });
    },
  });
}

/* ---------------- global search (live dropdown) ---------------- */
const searchInput = $('#globalSearch');
const searchWrap = $('#topbarSearchWrap');
let searchBox = null;

function searchAll(q) {
  const s = q.toLowerCase();
  const st = S.getState();
  const out = [];
  (st.calls || []).forEach(c => {
    // raw server rows: seeded calls use from/at; web-test calls add caller/phone
    const who = c.from || c.caller || '';
    const num = c.phone || c.from || '';
    if (who.toLowerCase().includes(s) || num.toLowerCase().includes(s))
      out.push({ kind: 'Call', label: who, sub: `${c.outcome || ''} · ${U.relTime(c.at || c.createdAt)}`, go: () => navigate('calls') });
  });
  (st.appointments || []).forEach(a => {
    if ((a.customer || '').toLowerCase().includes(s) || (a.service || '').toLowerCase().includes(s))
      out.push({ kind: 'Appointment', label: a.customer, sub: `${a.service || ''} · ${U.fmtDate(a.at || a.createdAt)}`, go: () => navigate('appointments') });
  });
  (st.leads || []).forEach(l => {
    if (l.name.toLowerCase().includes(s) || (l.source || '').toLowerCase().includes(s))
      out.push({ kind: 'Lead', label: l.name, sub: `${l.source} · ${l.status}`, go: () => navigate('leadflow') });
  });
  (st.tasks || []).forEach(t => {
    if ((t.leadName || '').toLowerCase().includes(s))
      out.push({ kind: 'Follow-up', label: t.leadName, sub: `${t.type} · ${U.relTime(t.dueAt)}`, go: () => navigate('leadflow', { tab: 'queue' }) });
  });
  return out.slice(0, 8);
}

function closeSearch() {
  if (searchBox) { searchBox.remove(); searchBox = null; }
}

function renderSearchResults() {
  closeSearch();
  const q = searchInput.value.trim();
  if (q.length < 2) return;
  const hits = searchAll(q);
  searchBox = document.createElement('div');
  searchBox.className = 'search-results';
  if (!hits.length) {
    searchBox.innerHTML = `<div class="sr-item"><span class="cell-dim">No matches for "${U.esc(q)}"</span></div>`;
  } else {
    hits.forEach(h => {
      const row = document.createElement('div');
      row.className = 'sr-item';
      row.innerHTML = `<span><strong>${U.esc(h.label)}</strong>&nbsp; <span class="cell-dim">${U.esc(h.sub)}</span></span><span class="sr-kind">${U.esc(h.kind)}</span>`;
      row.addEventListener('click', () => { searchInput.value = ''; closeSearch(); h.go(); });
      searchBox.appendChild(row);
    });
  }
  searchWrap.appendChild(searchBox);
}

searchInput.addEventListener('input', renderSearchResults);
searchInput.addEventListener('keydown', e => { if (e.key === 'Escape') { closeSearch(); searchInput.blur(); } });
document.addEventListener('click', e => { if (searchBox && !e.target.closest('#topbarSearchWrap')) closeSearch(); });

/* "/" focuses search, "n" opens request form */
document.addEventListener('keydown', e => {
  if (e.key === '/' && !/input|textarea|select/i.test(e.target.tagName) && S.getState().signedIn && !S.getState().needOnboarding) {
    e.preventDefault();
    searchInput.focus();
  }
  if (e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey && !e.altKey &&
      !/input|textarea|select/i.test(e.target.tagName) && S.getState().signedIn && !S.getState().needOnboarding) {
    e.preventDefault();
    navigate('requests');
  }
});

/* ---------------- boot ---------------- */
let lastState = S.getState();
S.subscribe(s => {
  refreshNotifDot();
  if (!!s.signedIn !== !!lastState.signedIn || !!s.needOnboarding !== !!lastState.needOnboarding ||
      !!s.authRequired !== !!lastState.authRequired) {
    lastState = s;
    paintIdentity();
    router();
  }
  lastState = s;
});
