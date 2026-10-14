/* ============================================================
   VANTORX MARKETS INTELLIGENCE — app.js
   Router, sidebar, search, notifications. Data is LIVE ONLY:
   a read-only sync from Polymarket's public Gamma API. There
   is no demo dataset and no fallback — when the API is
   unreachable the board stays empty (or shows clearly-stale
   data) and the error is surfaced honestly.
   ============================================================ */

import { getState, setState, subscribe } from './state.js';
import { esc } from './utils.js';
import { openModal, emptyState, toast } from './components.js';
import { renderOverview } from './pages/overview.js';
import { renderMarkets } from './pages/markets.js';
import { renderSignals } from './pages/signals.js';
import { renderPortfolio } from './pages/portfolio.js';
import { renderSettings } from './pages/settings.js';

const ctx = {
  getState, setState, navigate,
  syncLive,
  refreshSyncUI,
  settings: null,
};

const PAGES = {
  overview:  { title: 'Overview',     icon: '📊', render: renderOverview },
  markets:   { title: 'Market Board', icon: '🎯', render: renderMarkets },
  signals:   { title: 'AI Signals',   icon: '🤖', render: renderSignals },
  portfolio: { title: 'Portfolio',    icon: '💼', render: renderPortfolio },
  settings:  { title: 'Settings',     icon: '⚙️', render: renderSettings },
};

function route() {
  const hash = location.hash.replace(/^#\/?/, '') || 'overview';
  const [page] = hash.split('/');
  return { page: PAGES[page] ? page : 'overview' };
}

function navigate(page) { location.hash = `#/${page}`; }

function render() {
  const { page } = route();
  const def = PAGES[page];

  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  document.getElementById('view').innerHTML = '';
  def.render(document.getElementById('view'), ctx);

  document.getElementById('pageTitle').textContent = def.title;
  document.title = `${def.title} · VantorX Markets Intelligence`;

  paintSyncStatus();
}

/* ---------------- sync status in sidebar ---------------- */
function paintSyncStatus() {
  const s = getState();
  const el = document.getElementById('syncStatus');
  const chip = document.getElementById('modeChip');
  if (s.sources.syncing) {
    el.textContent = 'Syncing live data…';
    chip.textContent = 'Syncing — Polymarket live';
    return;
  }
  if (s.sources.live) {
    el.textContent = `Live · Polymarket · synced ${new Date(s.sources.lastSync).toLocaleTimeString()}`;
    chip.textContent = 'Live Mode — read-only Polymarket data';
  } else if (s.markets.length && s.sources.lastSync) {
    el.textContent = `Offline — stale data from ${new Date(s.sources.lastSync).toLocaleTimeString()}`;
    chip.textContent = 'Offline — showing last synced data';
  } else if (s.sources.error) {
    el.textContent = 'Sync failed — retry in Settings';
    chip.textContent = 'Not connected — no market data';
  } else {
    el.textContent = 'Not synced — connect in Settings';
    chip.textContent = 'Not connected — no market data';
  }
}

function refreshSyncUI() { paintSyncStatus(); render(); }

/* ---------------- Polymarket live sync (read-only, keyless) ----------------
   Gamma list endpoint, newest by 24h volume. Anything the API does not
   provide stays null in the model — never invented. On failure there is
   NO demo fallback: the error is stored and the UI says so. */
async function syncLive({ silent = false } = {}) {
  if (getState().sources.syncing) return;
  setState(st => {
    st.sources.syncing = true;
    st.sources.error = null;
  });
  paintSyncStatus();
  if (!silent) toast('Syncing live data from Polymarket…', 'info');
  try {
    const url = 'https://gamma-api.polymarket.com/markets?closed=false&limit=40&order=volume24hr&ascending=false';
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`Polymarket HTTP ${res.status}`);
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.data || []);
    const mapped = list.map(mapLiveMarket).filter(Boolean);

    setState(st => {
      st.markets = mapped;
      st.sources.live = true;
      st.sources.lastSync = new Date().toISOString();
      st.sources.syncing = false;
      st.sources.error = mapped.length ? null : 'Polymarket returned no open markets';
    });
    if (!silent) toast(`Live sync OK — ${mapped.length} real markets loaded (read-only)`, 'success');
  } catch (err) {
    setState(st => {
      st.sources.live = false;
      st.sources.syncing = false;
      st.sources.error = err.message;
    });
    toast(`Live sync failed (${err.message}) — no data is faked to cover it`, 'error');
  }
  refreshSyncUI();
}

/* Gamma returns some fields as JSON-encoded strings; parse defensively. */
function parsePrice(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return v > 1 ? v / 100 : v;
  if (typeof v === 'string') {
    try { const s = JSON.parse(v); return Array.isArray(s) ? parsePrice(s[0]) : parsePrice(Number(s)); }
    catch { const n = Number(v); return Number.isFinite(n) ? (n > 1 ? n / 100 : n) : null; }
  }
  if (Array.isArray(v)) return parsePrice(v[0]);
  return null;
}

function mapLiveMarket(mk, i) {
  if (!mk) return null;
  const yes = parsePrice(mk.outcomePrices ?? mk.outcomes);
  /* one-decimal cents so a 0.4% longshot never displays as a fake "0¢" */
  const pct = yes !== null ? Math.round(yes * 1000) / 10 : null;
  const vol = mk.volumeNum ?? (mk.volume ? Number(mk.volume) : null);
  const liq = mk.liquidityNum ?? (mk.liquidity ? Number(mk.liquidity) : null);
  return {
    id: String(mk.id ?? mk.slug ?? `live-${i}`),
    q: mk.question ?? mk.title ?? 'Untitled market',
    cat: mk.category || 'Uncategorized',
    yes: pct, no: pct !== null ? 100 - pct : null,
    chg: null, spread: null, trades: null,  // not provided by this endpoint — never invented
    vol: Number.isFinite(vol) ? Math.round(vol) : null,
    liq: Number.isFinite(liq) ? Math.round(liq) : null,
    trend: null,                            // fetched live per-market in the drawer
    ai: null,                               // signal engine not connected in this build
    resolved: !!mk.closed,
    close: mk.endDate ?? mk.closeTime ?? null,
    tokens: mk.clobTokenIds ?? null,
  };
}

/* ---------------- global search ---------------- */
function initSearch() {
  const input = document.getElementById('globalSearch');
  const results = document.getElementById('searchResults');
  let open = false;

  function close() { results.style.display = 'none'; open = false; }

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { close(); return; }
    const s = getState();
    const hits = [];
    for (const m of s.markets) {
      const hay = `${m.q} ${m.cat}`.toLowerCase();
      if (hay.includes(q)) {
        hits.push({ icon: '🎯', text: `${m.yes !== null ? m.yes + '¢' : '—'} · ${m.q}`, go: () => { location.hash = '#/markets'; } });
      }
    }
    if (!hits.length) hits.push({ icon: '🔍', text: 'No matches in the synced markets', go: close });
    results.innerHTML = hits.slice(0, 8).map((h, i) =>
      `<div class="search-hit" data-hit="${i}"><span class="sh-ico">${h.icon}</span>${esc(h.text)}</div>`).join('');
    results.style.display = 'block';
    open = true;
    results.querySelectorAll('[data-hit]').forEach((el, i) => {
      el.addEventListener('click', () => { hits[i].go(); close(); input.value = ''; });
    });
  });

  document.addEventListener('click', e => {
    if (open && !results.contains(e.target) && e.target !== input) close();
  });
}

/* ---------------- notifications ---------------- */
function initNotifications() {
  const btn = document.getElementById('notifBtn');
  const dot = document.getElementById('notifDot');

  function paintDot() {
    const unread = getState().notifications.filter(n => !n.read).length;
    dot.style.display = unread ? 'block' : 'none';
  }

  btn.addEventListener('click', () => {
    const s = getState();
    openModal({
      title: '🔔 Notifications',
      body: s.notifications.length ? `<div class="list-rows">
        ${s.notifications.map(n => `
          <div class="list-row" data-clickable data-link="${n.link || ''}">
            <div class="row-ico">${n.icon}</div>
            <div class="row-main">
              <div class="row-title">${esc(n.title)}</div>
              <div class="row-sub">${esc(n.body)}</div>
            </div>
          </div>`).join('')}
      </div>`
      : emptyState('🔔', 'No notifications', 'Nothing has been emitted yet. This build generates no simulated alerts.'),
      footer: `<button class="btn btn-gold" data-nn-close>Close</button>`,
      onOpen: ({ modal, close }) => {
        modal.querySelectorAll('[data-link]').forEach(el => el.addEventListener('click', () => {
          if (el.dataset.link) location.hash = el.dataset.link;
          close();
        }));
        modal.querySelector('[data-nn-close]').addEventListener('click', close);
      },
    });
  });

  subscribe(paintDot);
  paintDot();
}

/* ---------------- mobile drawer ---------------- */
function initDrawer() {
  const burger = document.getElementById('burger');
  const sidebar = document.getElementById('sidebar');
  const scrim = document.getElementById('scrim');
  function close() { sidebar.classList.remove('open'); scrim.classList.remove('show'); }
  burger.addEventListener('click', () => { sidebar.classList.toggle('open'); scrim.classList.toggle('show'); });
  scrim.addEventListener('click', close);
  sidebar.addEventListener('click', e => { if (e.target.closest('.nav-item')) close(); });
}

/* ---------------- account menu ---------------- */
function initAccount() {
  const btn = document.getElementById('avatarBtn');
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const existing = document.querySelector('.account-menu');
    if (existing) { existing.remove(); return; }
    const s = getState();
    const menu = document.createElement('div');
    menu.className = 'account-menu';
    menu.innerHTML = `
      <div class="account-name">${esc(s.account.name)}<span class="account-role">${esc(s.account.role)}</span></div>
      <button class="account-item" data-act="refresh">🔄 Refresh live data</button>
      <button class="account-item" data-act="settings">⚙️ Connection settings</button>
    `;
    btn.appendChild(menu);
    menu.querySelector('[data-act="refresh"]').addEventListener('click', () => { menu.remove(); syncLive(); });
    menu.querySelector('[data-act="settings"]').addEventListener('click', () => { menu.remove(); navigate('settings'); });
  });
  document.addEventListener('click', () => {
    const m = document.querySelector('.account-menu');
    if (m) m.remove();
  });
}

/* ---------------- boot ---------------- */
function paintIdentity() {
  const s = getState();
  document.getElementById('avatarInitials').textContent =
    s.account.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function boot() {
  paintIdentity();
  initSearch();
  initNotifications();
  initDrawer();
  initAccount();
  window.addEventListener('hashchange', render);
  render();
  /* auto-sync live Polymarket data on boot when enabled in settings */
  if (getState().settings.liveSync) syncLive({ silent: true });
}

boot();
