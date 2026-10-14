/* ============================================================
   VANTORX ADMIN — app.js (PRODUCTION)
   Auth gate (vantorx_admin only) · router · sidebar · topbar
   (search/notifications/account/home) · mobile drawer.
   All data comes from the platform server via realapi.js.
   There is no demo store and no offline fake data.
   ============================================================ */

import { esc, relTime } from './utils.js';
import { toast, openModal, emptyState } from './components.js';
import { api, getMe, login, logout, overview, notifications, markNotificationsRead } from './realapi.js';
import { renderOverview } from './pages/overview.js';
import { renderClients, openClientDetail } from './pages/clients.js';
import { renderRequests } from './pages/requests.js';
import { renderBilling } from './pages/billing.js';
import { renderActivity } from './pages/activity.js';
import { renderSettings } from './pages/settings.js';
import { renderConnect } from './pages/connect.js';
import { renderProviders } from './pages/providers.js';

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

/* ---------------- session + shared cache ---------------- */

let authUser = null;        // { id, email, name, role } | null
let overviewData = null;    // last /api/admin/overview payload

const ctx = {
  navigate,
  get user() { return authUser; },
  get overviewData() { return overviewData; },
  async overview(force) {
    if (force || !overviewData) {
      const r = await overview();
      if (r.status === 200) {
        overviewData = r;
        paintBadges();
      } else if (r.status === 401) {
        authUser = null;
        return null;
      } else {
        throw new Error(r.error || 'Failed to load platform data');
      }
    }
    return overviewData;
  },
  openClient: (id) => openClientDetail(id, ctx),
};

/* ---------------- routing ---------------- */

const routes = {
  overview: renderOverview,
  clients: renderClients,
  requests: renderRequests,
  billing: renderBilling,
  activity: renderActivity,
  settings: renderSettings,
  connect: renderConnect,
  providers: renderProviders,
};

const TITLES = {
  overview: 'Overview', clients: 'Clients', requests: 'Change Requests',
  billing: 'Billing & Plans', activity: 'Audit Activity', settings: 'Settings',
  connect: 'Business Connect', providers: 'Providers',
};

function parseHash() {
  const h = (location.hash || '#/overview').replace(/^#\//, '');
  const [page] = h.split('/');
  return { page: page || 'overview' };
}

function setActiveNav(page) {
  $$('#sidebar .nav-item').forEach(a => a.classList.toggle('active', a.dataset.nav === page));
}

async function router() {
  const view = $('#view');
  if (!authUser || authUser.role !== 'vantorx_admin') {
    setActiveNav('');
    $('#topbarTitle').textContent = 'VantorX Admin';
    view.innerHTML = '';
    const el = document.createElement('div');
    el.className = 'page';
    view.appendChild(el);
    renderAuth(el);
    return;
  }
  paintIdentity();
  const { page } = parseHash();
  const render = routes[page] || renderOverview;
  setActiveNav(page);
  $('#topbarTitle').textContent = TITLES[page] || 'VantorX Admin';
  view.innerHTML = '';
  const pageEl = document.createElement('div');
  pageEl.className = 'page';
  view.appendChild(pageEl);
  try {
    await render(pageEl, ctx);
  } catch (err) {
    console.error('Render failed on', page, err);
    pageEl.innerHTML = `<div class="card">${emptyState('⚠️', 'Could not load live data', String(err.message || err) + ' — the console only shows real platform data, so it stays empty until the server responds.')}</div>`;
  }
  closeMobileNav();
  $('.content').scrollTop = 0;
}

/* ---------------- auth gate ---------------- */

function renderAuth(root) {
  root.innerHTML = `
    <div class="auth-wrap">
      <div class="card auth-card">
        <div class="card-title">🔐 Platform sign-in</div>
        <p class="cell-dim" style="font-size:0.84rem;margin:0 0 12px">This console runs live against the VantorX platform. Access is restricted to <strong>vantorx_admin</strong> accounts.</p>
        <div class="cx-form-row"><label>Email or username</label><input id="authEmail" type="text" placeholder="Email or username" autocomplete="username"></div>
        <div class="cx-form-row"><label>Password</label><input id="authPass" type="password" autocomplete="current-password"></div>
        <div id="authErr"></div>
        <div style="display:flex;gap:9px;margin-top:14px">
          <button class="btn btn-gold" id="authGo">Sign in</button>
          <a class="btn btn-ghost" href="/" style="text-decoration:none;display:inline-flex;align-items:center">← Portal home</a>
        </div>
      </div>
    </div>`;
  const submit = async () => {
    const email = root.querySelector('#authEmail').value.trim();
    const pass = root.querySelector('#authPass').value;
    root.querySelector('#authErr').innerHTML = '';
    const r = await login(email, pass);
    if (r.error) { root.querySelector('#authErr').innerHTML = `<div class="cx-error">✕ ${esc(r.error)}</div>`; return; }
    if (r.user.role !== 'vantorx_admin') {
      root.querySelector('#authErr').innerHTML = `<div class="cx-error">✕ ${esc(r.user.email)} is a ${esc(r.user.role)} account — the admin console requires a platform admin.</div>`;
      return;
    }
    authUser = r.user;
    overviewData = null;
    toast('Signed in to live platform', 'success');
    router();
  };
  root.querySelector('#authGo').addEventListener('click', submit);
  root.querySelector('#authPass').addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
}

/* ---------------- identity + badges ---------------- */

function paintIdentity() {
  if (!authUser) return;
  const name = authUser.name || authUser.email;
  $('#avatarName').textContent = String(name).split(' ')[0];
  $('#avatarInitials').textContent = String(name).split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  $('#opsName').textContent = 'Platform Admin';
  $('#opsPlan').textContent = authUser.email;
}

function paintBadges() {
  if (!overviewData) return;
  const bizCount = overviewData.businesses.length;
  $('#clientsBadge').textContent = bizCount;
  const open = overviewData.counts.changeRequests || 0;
  const reqBadge = $('#reqBadge');
  reqBadge.textContent = open;
  reqBadge.classList.toggle('red', open > 5);
}

async function refreshNotificationsDot() {
  const r = await notifications();
  if (r.status !== 200) return;
  const unread = (r.rows || []).filter(n => !n.read).length;
  $('#notifDot').classList.toggle('show', unread > 0);
}

/* ---------------- boot ---------------- */

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', async () => {
  const me = await getMe();
  if (me.status === 200 && me.user && me.user.role === 'vantorx_admin') {
    authUser = me.user;
    try { await ctx.overview(true); } catch (e) { console.warn('overview load failed', e); }
    refreshNotificationsDot();
  }
  router();
});

/* ---------------- navigation helper ---------------- */

function navigate(route) {
  const target = '#/' + route;
  if (location.hash === target) router();
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

/* ---------------- notifications (real, all tenants for admin) ---------------- */

$('#notifBtn').addEventListener('click', async () => {
  const r = await notifications();
  const rows = (r.status === 200 ? (r.rows || []) : []).slice(0, 30);
  openModal({
    title: `Notifications${rows.length ? ` · ${rows.filter(n => !n.read).length} unread` : ''}`,
    wide: true,
    body: rows.length
      ? `<div>${rows.map(n => `
          <div class="list-row" style="${n.read ? 'opacity:0.55' : ''}">
            <div class="row-ico" style="background:var(--bg-hover)">•</div>
            <div class="row-main">
              <div class="row-title">${esc(n.title)}</div>
              <div class="row-sub">${esc(n.body || '')}</div>
            </div>
            <div class="row-time">${relTime(n.at)}</div>
          </div>`).join('')}</div>`
      : emptyState('◔', 'No notifications', 'Tenant events appear here as they happen on the platform.'),
    footer: `<button class="btn btn-ghost btn-sm" data-close2>Close</button>
             ${rows.length ? '<button class="btn btn-gold btn-sm" data-markread>Mark all read</button>' : ''}`,
    onOpen: ({ modal, close }) => {
      modal.querySelector('[data-close2]').addEventListener('click', close);
      const mark = modal.querySelector('[data-markread]');
      if (mark) mark.addEventListener('click', async () => {
        await markNotificationsRead();
        close();
        refreshNotificationsDot();
        toast('All notifications marked read', 'success');
      });
    },
  });
  refreshNotificationsDot();
});

/* ---------------- account menu (real session) ---------------- */

$('#accountBtn').addEventListener('click', openAccount);
$('#opsCard').addEventListener('click', openAccount);

function openAccount() {
  if (!authUser) { router(); return; }
  openModal({
    title: 'Account',
    body: `
      <div class="kv-list">
        <div class="kv-row"><div class="kv-label">Signed in</div><div class="kv-value">${esc(authUser.name || authUser.email)}<div class="cell-dim">${esc(authUser.email)} · ${esc(authUser.role)}</div></div></div>
        <div class="kv-row"><div class="kv-label">Data source</div><div class="kv-value">Live platform server — port 8787</div></div>
      </div>
      <div style="display:flex;gap:9px;margin-top:16px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" data-act="reload">↻ Reload live data</button>
        <button class="btn btn-ghost btn-sm" data-act="signout" style="color:var(--red)">Sign out</button>
      </div>`,
    onOpen: ({ modal, close }) => {
      modal.querySelector('[data-act="reload"]').addEventListener('click', async () => {
        close();
        overviewData = null;
        await ctx.overview(true);
        router();
        toast('Live data reloaded', 'success');
      });
      modal.querySelector('[data-act="signout"]').addEventListener('click', async () => {
        close();
        await logout();
        authUser = null;
        overviewData = null;
        toast('Signed out', 'info');
        router();
      });
    },
  });
}

/* ---------------- global search (live tenants + users) ---------------- */

const searchInput = $('#globalSearch');
const searchWrap = $('#topbarSearchWrap');
let searchBox = null;

function searchAll(q) {
  const s = q.toLowerCase();
  const out = [];
  if (overviewData) {
    overviewData.businesses.forEach(b => {
      if ((b.name + ' ' + (b.industry || '') + ' ' + (b.city || '')).toLowerCase().includes(s))
        out.push({ kind: 'Tenant', label: b.name, sub: `${b.industry || ''} · ${b.status || ''}`, go: () => ctx.openClient(b.id) });
    });
    overviewData.users.forEach(u => {
      if ((u.email + ' ' + u.name).toLowerCase().includes(s))
        out.push({ kind: 'User', label: u.name || u.email, sub: `${u.email} · ${u.role}`, go: () => navigate('activity') });
    });
  }
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
    searchBox.innerHTML = `<div class="sr-item"><span class="cell-dim">No matches for "${esc(q)}"</span></div>`;
  } else {
    hits.forEach(h => {
      const row = document.createElement('div');
      row.className = 'sr-item';
      row.innerHTML = `<span><strong>${esc(h.label)}</strong>&nbsp; <span class="cell-dim">${esc(h.sub)}</span></span><span class="sr-kind">${esc(h.kind)}</span>`;
      row.addEventListener('click', () => { searchInput.value = ''; closeSearch(); h.go(); });
      searchBox.appendChild(row);
    });
  }
  searchWrap.appendChild(searchBox);
}

searchInput.addEventListener('input', renderSearchResults);
searchInput.addEventListener('keydown', e => { if (e.key === 'Escape') { closeSearch(); searchInput.blur(); } });
document.addEventListener('click', e => { if (searchBox && !e.target.closest('#topbarSearchWrap')) closeSearch(); });

/* "/" focuses search */
document.addEventListener('keydown', e => {
  if (e.key === '/' && !/input|textarea|select/i.test(e.target.tagName) && authUser) {
    e.preventDefault();
    searchInput.focus();
  }
});
