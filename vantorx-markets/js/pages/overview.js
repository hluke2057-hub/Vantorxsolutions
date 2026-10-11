/* ============================================================
   VANTORX MARKETS INTELLIGENCE — pages/overview.js
   Board KPIs, category breakdown and volume leaders, all
   computed from live synced Polymarket data only. KPIs that
   would need invented data (portfolio P/L, AI signal counts)
   are shown honestly as not connected.
   ============================================================ */

import { esc, fmtUsd, relTime } from '../utils.js';
import { emptyState } from '../components.js';
import { categoryIcon } from '../data.js';

export function renderOverview(root, ctx) {
  const s = ctx.getState();
  const markets = s.markets;
  const byVol = [...markets].sort((a, b) => (b.vol || 0) - (a.vol || 0));
  const totalVol = markets.reduce((a, m) => a + (m.vol || 0), 0);

  const cats = {};
  for (const m of markets) {
    cats[m.cat] = cats[m.cat] || { n: 0, vol: 0 };
    cats[m.cat].n++;
    cats[m.cat].vol += (m.vol || 0);
  }
  const catRows = Object.entries(cats).sort((a, b) => b[1].vol - a[1].vol);
  const maxVol = catRows[0]?.[1].vol || 1;

  const syncPill = s.sources.syncing ? 'Syncing…' : s.sources.live ? 'Live' : markets.length ? 'Offline' : 'Not connected';

  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">Market Overview</div>
      <div class="page-sub">${markets.length ? `${markets.length} open Polymarket markets · read-only live prices` : 'No market data loaded yet'}</div>
    </div>

    <div class="kpi-grid">
      <div class="kpi">
        <div class="kpi-label">Open markets</div>
        <div class="kpi-value">${markets.length}</div>
        <div class="kpi-hint">across ${catRows.length} categories</div>
      </div>
      <div class="kpi accent-gold">
        <div class="kpi-label">Board volume</div>
        <div class="kpi-value">${fmtUsd(totalVol)}</div>
        <div class="kpi-hint">all-time USD · Polymarket</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Largest category</div>
        <div class="kpi-value" style="font-size:26px">${catRows[0] ? esc(catRows[0][0]) : '—'}</div>
        <div class="kpi-hint">${catRows[0] ? `${fmtUsd(catRows[0][1].vol)} volume` : 'no data'}</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Data source</div>
        <div class="kpi-value" style="font-size:26px">${syncPill}</div>
        <div class="kpi-hint">${s.sources.lastSync ? `last sync ${relTime(s.sources.lastSync)}` : 'never synced'}</div>
      </div>
    </div>

    ${markets.length ? `
    <div class="grid-side">
      <div class="section-stack">

        <div class="card">
          <div class="card-title">🔥 Volume leaders <button class="link" data-go="markets">Full board →</button></div>
          ${byVol.slice(0, 5).map(moverRow).join('')}
        </div>

        <div class="card">
          <div class="card-title">🤖 AI signals</div>
          ${emptyState('🤖', 'Signal engine not connected', 'This build shows live market data only — no AI signals are generated.')}
        </div>

      </div>

      <div class="section-stack">

        <div class="card">
          <div class="card-title">🗂 Category breakdown</div>
          ${catRows.map(([cat, v]) => `
            <div class="kv-row">
              <div class="kv-label">${categoryIcon(cat)} ${esc(cat)} <span class="cell-dim">· ${v.n} markets</span></div>
              <div class="kv-value"><span class="score-bar" style="width:100px;display:inline-block;vertical-align:middle"><i style="width:${Math.max(4, Math.round(v.vol / maxVol * 100))}%"></i></span>&nbsp;${fmtUsd(v.vol)}</div>
            </div>`).join('')}
        </div>

        <div class="card">
          <div class="card-title">🕘 Activity</div>
          ${emptyState('🕘', 'No activity yet', 'Activity appears here as connected features are used — nothing is simulated.')}
        </div>

      </div>
    </div>` : `
    <div class="card">
      ${emptyState('📡', 'No market data', s.sources.error
        ? `Last sync failed: ${s.sources.error}. No demo data is substituted — retry the live sync.`
        : 'Sync live Polymarket data to load the real board. Auto-sync can be enabled in Settings.')}
      <div style="display:flex;gap:8px;padding:0 0 12px">
        <button class="btn btn-gold" id="ovSync">Sync live data now</button>
        <button class="btn btn-ghost" data-go="settings">Open Settings</button>
      </div>
    </div>`}
  `;

  root.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => ctx.navigate(b.dataset.go)));
  const syncBtn = root.querySelector('#ovSync');
  if (syncBtn) syncBtn.addEventListener('click', () => ctx.syncLive());
}

function moverRow(m) {
  return `
    <div class="list-row" data-clickable data-market="${m.id}">
      <div class="row-ico">🎯</div>
      <div class="row-main">
        <div class="row-title">${esc(m.q)}</div>
        <div class="row-sub">${categoryIcon(m.cat)} ${esc(m.cat)} · ${m.vol ? `${fmtUsd(m.vol)} volume` : 'volume n/a'}</div>
      </div>
      <div class="row-side" style="text-align:right">
        <div style="font-weight:700">${m.yes !== null ? `${m.yes}¢` : '—'}</div>
        <div class="cell-dim">YES</div>
      </div>
    </div>`;
}
