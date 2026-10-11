/* ============================================================
   VANTORX ADMIN — pages/settings.js (PRODUCTION)
   Real session + platform status. No demo reset button: there is
   no demo data to reset. Shows live server connectivity and the
   platform's honest integration status.
   ============================================================ */

import { esc } from '../utils.js';
import { toast, confirmDialog, emptyState } from '../components.js';
import { api, logout } from '../realapi.js';

function pillFor(status) {
  if (status === 'connected' || status === 'CONNECTED') return '<span class="status-pill status-green"><span class="sdot"></span>connected</span>';
  if (status === 'BLOCKED') return '<span class="status-pill status-red"><span class="sdot"></span>blocked</span>';
  return '<span class="status-pill status-orange"><span class="sdot"></span>not connected</span>';
}

export async function renderSettings(root, ctx) {
  const u = ctx.user;
  const h = await api('GET', '/api/health');
  const health = h.status === 200 ? h : null;

  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">Settings</div>
      <div class="page-sub">Live session, platform connectivity and integration status.</div>
    </div>

    <div class="card">
      <div class="card-title">👤 Session</div>
      <div class="kv-list">
        <div class="kv-row"><div class="kv-label">Signed in as</div><div class="kv-value">${esc(u ? u.name || u.email : '—')}<div class="cell-dim">${esc(u ? u.email : '')} · role ${esc(u ? u.role : '')}</div></div></div>
        <div class="kv-row"><div class="kv-label">Auth</div><div class="kv-value">Server-side session cookie (port 8787)</div></div>
        <div class="kv-row"><div class="kv-label">Data store</div><div class="kv-value"><code>platform/data/vantorx-db.json</code> — persisted, server-owned</div></div>
      </div>
      <div style="display:flex;gap:9px;margin-top:14px">
        <button class="btn btn-gold btn-sm" id="stReload">↻ Reload live data</button>
        <button class="btn btn-ghost btn-sm" id="stSignOut" style="color:var(--red)">Sign out</button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🩺 Platform health</div>
      ${health ? `
        <div class="kv-list">
          <div class="kv-row"><div class="kv-label">Server</div><div class="kv-value"><span class="status-pill status-green"><span class="sdot"></span>reachable</span></div></div>
          ${Object.keys(health).filter(k => k !== 'status').map(k => `
            <div class="kv-row"><div class="kv-label">${esc(k)}</div><div class="kv-value">${esc(String(health[k]))}</div></div>`).join('')}
        </div>`
        : `<div class="cx-error">✕ Platform server not reachable: ${esc(h.error || 'unknown')}</div>`}
    </div>

    <div class="card">
      <div class="card-title">🔌 Integration status (honest)</div>
      <div class="table-wrap"><table>
        <thead><tr><th>Capability</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Business Connect provisioning</td><td><span class="status-pill status-green"><span class="sdot"></span>live</span></td></tr>
          <tr><td>AI Receptionist engine</td><td><span class="status-pill status-green"><span class="sdot"></span>live (LLM when connected; test console always)</span></td></tr>
          <tr><td>Telephony / LLM / STT / TTS</td><td>${health && health.providers ? pillFor(health.providers.telephony) + ' telephony · ' + pillFor(health.providers.llm) + ' llm' : '<span class="status-pill status-orange"><span class="sdot"></span>not connected — gates go-live</span>'}</td></tr>
          <tr><td>Email / SMS delivery</td><td>${health && health.providers ? pillFor(health.providers.email) + ' email · ' + pillFor(health.providers.sms) + ' sms' : '<span class="status-pill status-orange"><span class="sdot"></span>not connected</span>'}</td></tr>
          <tr><td>Card payments</td><td>${health && health.providers ? pillFor(health.providers.payments) : '<span class="status-pill status-orange"><span class="sdot"></span>not connected</span>'}</td></tr>
          <tr><td>Full registry + live tests</td><td><a href="#/providers">Open the Providers page →</a></td></tr>
        </tbody></table></div>
    </div>`;

  root.querySelector('#stReload').addEventListener('click', async function () {
    this.disabled = true;
    try {
      ctx.overview(true);
      toast('Live data reloaded', 'success');
    } finally { this.disabled = false; }
  });
  root.querySelector('#stSignOut').addEventListener('click', async () => {
    const ok = await confirmDialog({ title: 'Sign out?', message: 'End the platform session.', confirmText: 'Sign out' });
    if (!ok) return;
    await logout();
    location.reload();
  });
}
