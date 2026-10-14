/* ============================================================
   VANTORX MARKETS INTELLIGENCE — pages/settings.js
   Preferences and the Polymarket live-data connection. Live
   sync is READ-ONLY and keyless. There is no demo dataset in
   this build, so there is no "back to demo" switch — only a
   live sync, and an honest error when it fails.
   ============================================================ */

import { esc } from '../utils.js';
import { toast, emptyState } from '../components.js';

const TOGGLES = [
  { key: 'liveSync',      label: 'Polymarket live data', sub: 'Auto-sync real market prices every time the app opens' },
  { key: 'compactTables', label: 'Compact tables',       sub: 'Denser rows on the market board' },
];

export function renderSettings(root, ctx) {
  const s = ctx.getState();

  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">Settings</div>
      <div class="page-sub">Data sources and display preferences. Preferences are saved in this browser only.</div>
    </div>

    <div class="grid-side">
      <div class="section-stack">

        <div class="card">
          <div class="card-title">⚙️ Preferences</div>
          ${TOGGLES.map(t => `
            <div class="list-row" data-clickable data-toggle="${t.key}">
              <div class="row-main">
                <div class="row-title">${esc(t.label)}</div>
                <div class="row-sub">${esc(t.sub)}</div>
              </div>
              <div class="row-side">
                <div class="toggle ${s.settings[t.key] ? 'on' : ''}" role="switch" aria-checked="${s.settings[t.key]}"></div>
              </div>
            </div>`).join('')}
        </div>

        <div class="card">
          <div class="card-title">🔗 Polymarket connection</div>
          <div class="kv-list">
            <div class="kv-row"><div class="kv-label">Endpoint</div><div class="kv-value cell-dim">${esc(s.sources.endpoint)}</div></div>
            <div class="kv-row"><div class="kv-label">Status</div><div class="kv-value"><span class="status-pill ${s.sources.live ? 'status-green' : 'status-orange'}"><span class="sdot"></span>${s.sources.live ? 'Live (read-only)' : s.markets.length ? 'Offline — stale data' : 'Not connected'}</span></div></div>
            <div class="kv-row"><div class="kv-label">Last sync</div><div class="kv-value">${s.sources.lastSync ? esc(new Date(s.sources.lastSync).toLocaleString()) : 'never'}</div></div>
            ${s.sources.error ? `<div class="kv-row"><div class="kv-label" style="color:var(--red)">Last error</div><div class="kv-value">${esc(s.sources.error)}</div></div>` : ''}
            <div class="kv-row"><div class="kv-label">API key</div><div class="kv-value">not required — public read API</div></div>
          </div>
          <div style="display:flex;gap:8px;margin-top:12px">
            <button class="btn btn-gold" id="testConn">${s.sources.live ? 'Refresh live data' : 'Connect &amp; sync'}</button>
          </div>
          <div class="obx-hint-box" style="margin-top:10px">This build reads public market prices from Polymarket's open Gamma API — no account, no keys, no trading. If the API is unreachable the board stays empty and the error is shown; no demo data is ever substituted.</div>
        </div>

      </div>

      <div class="section-stack">

        <div class="card">
          <div class="card-title">👤 Account</div>
          ${emptyState('👤', 'No account connected',
            'This app runs locally against public Polymarket data. Nothing is tied to a user account, and no account details are simulated.')}
        </div>

        <div class="card">
          <div class="card-title">🔒 Data honesty</div>
          <div class="kv-list">
            <div class="kv-row"><div class="kv-label">Market data</div><div class="kv-value">100% live Polymarket</div></div>
            <div class="kv-row"><div class="kv-label">Demo / sample data</div><div class="kv-value">none in this build</div></div>
            <div class="kv-row"><div class="kv-label">AI signals</div><div class="kv-value">engine not connected</div></div>
            <div class="kv-row"><div class="kv-label">Trading / portfolio</div><div class="kv-value">not connected</div></div>
          </div>
        </div>

      </div>
    </div>
  `;

  root.querySelectorAll('[data-toggle]').forEach(row => row.addEventListener('click', () => {
    const key = row.dataset.toggle;
    ctx.setState(st => { st.settings[key] = !st.settings[key]; });
    const t = TOGGLES.find(x => x.key === key);
    toast(`${t.label} — ${ctx.getState().settings[key] ? 'enabled' : 'disabled'}`, 'info');
    /* enabling live sync triggers a real sync immediately */
    if (key === 'liveSync' && ctx.getState().settings.liveSync) ctx.syncLive();
  }));

  root.querySelector('#testConn').addEventListener('click', () => ctx.syncLive());
}
