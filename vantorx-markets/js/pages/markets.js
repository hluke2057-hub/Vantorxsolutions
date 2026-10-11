/* ============================================================
   VANTORX MARKETS INTELLIGENCE — pages/markets.js
   Full board: category tabs derived from live data, search,
   real YES/NO pricing. The drawer pulls a real 24h price
   history from Polymarket's public CLOB endpoint. No fake
   order book, no simulated positions.
   ============================================================ */

import { esc, fmtUsd } from '../utils.js';
import { openDrawer, emptyState } from '../components.js';
import { categoryIcon } from '../data.js';

export function renderMarkets(root, ctx) {
  let cat = '';
  let query = '';

  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">Market Board</div>
      <div class="page-sub">Real Polymarket markets, read-only. Click any row for the live workup.</div>
    </div>

    <div class="filter-bar">
      <div class="seg" id="catTabs"></div>
      <input class="search-input" id="mktSearch" placeholder="Search question or category…" autocomplete="off">
      <span class="result-count" id="mktCount"></span>
    </div>

    <div class="card"><div class="table-wrap"><table id="mktTable">
      <thead><tr><th>Market</th><th>Category</th><th>YES</th><th>NO</th><th>Volume</th><th>Liquidity</th><th>Closes</th></tr></thead>
      <tbody id="mktRows"></tbody>
    </table></div></div>
  `;

  const rows = root.querySelector('#mktRows');
  const count = root.querySelector('#mktCount');
  const table = root.querySelector('#mktTable');

  function paintTabs() {
    const s = ctx.getState();
    const seen = [];
    for (const m of s.markets) if (!seen.includes(m.cat)) seen.push(m.cat);
    const tabs = root.querySelector('#catTabs');
    tabs.innerHTML = `<button class="seg-btn ${cat === '' ? 'active' : ''}" data-cat="">All</button>` +
      seen.map(c => `<button class="seg-btn ${cat === c ? 'active' : ''}" data-cat="${esc(c)}">${categoryIcon(c)} ${esc(c)}</button>`).join('');
    tabs.querySelectorAll('.seg-btn').forEach(b => b.addEventListener('click', () => {
      cat = b.dataset.cat;
      tabs.querySelectorAll('.seg-btn').forEach(x => x.classList.toggle('active', x === b));
      paint();
    }));
  }

  function paint() {
    const s = ctx.getState();
    const list = s.markets
      .filter(m => !cat || m.cat === cat)
      .filter(m => !query || `${m.q} ${m.cat}`.toLowerCase().includes(query))
      .sort((a, b) => (b.vol || 0) - (a.vol || 0));

    count.textContent = `${list.length} markets`;
    table.style.fontSize = s.settings.compactTables ? '0.8rem' : '';

    rows.innerHTML = list.length ? list.map(m => `
      <tr data-clickable data-id="${m.id}">
        <td><span class="cell-main">${esc(m.q)}</span></td>
        <td class="cell-dim">${categoryIcon(m.cat)} ${esc(m.cat)}</td>
        <td><b>${m.yes !== null ? `${m.yes}¢` : '—'}</b></td>
        <td>${m.no !== null ? `${m.no}¢` : '—'}</td>
        <td>${fmtUsd(m.vol)}</td>
        <td class="cell-dim">${fmtUsd(m.liq)}</td>
        <td class="cell-dim">${m.close ? esc(shortDate(m.close)) : '—'}</td>
      </tr>`).join('')
      : `<tr><td colspan="7">${emptyState('📡', 'No markets loaded', s.sources.error
          ? `Live sync failed: ${s.sources.error}. No data is faked to cover it — retry from Settings.`
          : 'Run a live sync from Settings to load real Polymarket data.')}</td></tr>`;

    rows.querySelectorAll('tr[data-id]').forEach(tr => tr.addEventListener('click', () => openMarket(tr.dataset.id, ctx)));
  }

  root.querySelector('#mktSearch').addEventListener('input', e => { query = e.target.value.trim().toLowerCase(); paint(); });

  paintTabs();
  paint();
}

function shortDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/* ---------------- market drawer (live detail) ---------------- */

function yesTokenOf(m) {
  let t = m.tokens;
  if (typeof t === 'string') { try { t = JSON.parse(t); } catch { return (t && t.length > 20) ? t : null; } }
  if (Array.isArray(t) && t.length) return String(t[0]);
  return null;
}

async function openMarket(id, ctx) {
  const s = ctx.getState();
  const m = s.markets.find(x => x.id === id);
  if (!m) return;

  const api = openDrawer({ title: esc(m.q), body: drawerBody(m) });

  const token = yesTokenOf(m);
  const zone = () => api.drawer.querySelector('#trendZone');
  if (!token) {
    const el = zone();
    if (el) el.innerHTML = `<div class="obx-hint-box">This market exposes no outcome token, so no price history is available.</div>`;
    return;
  }
  try {
    const res = await fetch(`https://clob.polymarket.com/prices-history?market=${encodeURIComponent(token)}&interval=1d&fidelity=60`, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`history HTTP ${res.status}`);
    const data = await res.json();
    const pts = (data.history || []).map(h => h.p);
    const el = zone();
    if (el && api.drawer.isConnected) el.innerHTML = trendBlock(pts);
  } catch (err) {
    const el = zone();
    if (el && api.drawer.isConnected) el.innerHTML = `<div class="obx-hint-box">⚠️ Price history unavailable (${esc(err.message)}).</div>`;
  }
}

function drawerBody(m) {
  return `
    <div style="display:flex;align-items:center;gap:16px;padding:6px 0 16px">
      <div style="text-align:center">
        <div style="font-size:2.2rem;font-weight:800;color:var(--gold-bright)">${m.yes !== null ? `${m.yes}¢` : '—'}</div>
        <div class="cell-dim">YES · NO ${m.no !== null ? `${m.no}¢` : '—'}</div>
      </div>
      <div style="flex:1">
        ${m.yes !== null ? `
        <div style="display:flex;height:12px;border-radius:6px;overflow:hidden;font-size:0.62rem">
          <div style="width:${m.yes}%;background:var(--green);color:#04120a;display:flex;align-items:center;justify-content:center;font-weight:700">YES</div>
          <div style="width:${m.no}%;background:var(--red);color:#1a0505;display:flex;align-items:center;justify-content:center;font-weight:700">NO</div>
        </div>` : `<div class="obx-hint-box">The API returned no price for this market.</div>`}
        <div class="cell-dim" style="margin-top:6px">Implied probability${m.close ? ` · closes ${esc(new Date(m.close).toLocaleDateString())}` : ''}</div>
      </div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="kpi"><div class="kpi-label">Volume</div><div class="kpi-value" style="font-size:1.2rem">${fmtUsd(m.vol)}</div></div>
      <div class="kpi"><div class="kpi-label">Liquidity</div><div class="kpi-value" style="font-size:1.2rem">${fmtUsd(m.liq)}</div></div>
      <div class="kpi"><div class="kpi-label">Category</div><div class="kpi-value" style="font-size:1.2rem">${categoryIcon(m.cat)} ${esc(m.cat)}</div></div>
    </div>

    <div class="card-title" style="margin:16px 0 8px">📈 24h price history (live)</div>
    <div id="trendZone"><div class="obx-hint-box">Loading live price history…</div></div>

    <div class="card-title" style="margin:16px 0 8px">📚 Order book</div>
    <div class="obx-hint-box">Order book is not connected in this build — no depth data is shown rather than simulated.</div>

    <div class="card-title" style="margin:16px 0 8px">🤖 AI signal</div>
    <div class="obx-hint-box">Signal engine not connected — this build displays market data only and generates no AI signals.</div>
  `;
}

function trendBlock(pts) {
  if (!pts || pts.length < 2) return `<div class="obx-hint-box">No price history returned for this market.</div>`;
  const firstPct = Math.round(pts[0] * 100);
  const lastPct = Math.round(pts[pts.length - 1] * 100);
  const bars = pts.map(p => {
    const pct = Math.round(p * 100);
    const h = 12 + Math.round(pct * 0.5);
    return `<div title="${pct}¢" style="flex:1;height:${h}%;min-height:6px;background:${pct >= firstPct ? 'rgba(74,222,128,0.55)' : 'rgba(248,113,113,0.5)'};border-radius:2px 2px 0 0"></div>`;
  }).join('');
  return `
    <div style="display:flex;align-items:flex-end;gap:2px;height:64px;padding:0 2px">${bars}</div>
    <div style="display:flex;justify-content:space-between" class="cell-dim"><span>24h ago · ${firstPct}¢</span><span>${lastPct - firstPct >= 0 ? '+' : ''}${lastPct - firstPct}¢ today</span></div>`;
}
