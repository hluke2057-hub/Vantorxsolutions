/* ============================================================
   VANTORX ADMIN — pages/overview.js (PRODUCTION)
   Live KPIs from /api/admin/overview + recent audit trail.
   ============================================================ */

import { esc, relTime } from '../utils.js';
import { emptyState } from '../components.js';
import { audit } from '../realapi.js';

export async function renderOverview(root, ctx) {
  root.innerHTML = `<div class="cx-loading">Loading live platform data…</div>`;
  const ov = await ctx.overview(true);
  if (!ov) { root.innerHTML = `<div class="card">${emptyState('🔒', 'Session expired', 'Sign in again to continue.')}</div>`; ctx.navigate('overview'); return; }

  const biz = ov.businesses || [];
  const live = biz.filter(b => b.status === 'live').length;
  const provisioning = biz.filter(b => b.status && b.status !== 'live').length;
  const counts = ov.counts || {};

  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">Operations Overview</div>
      <div class="page-sub">Live platform state — every number below comes from the server database, not a demo store.</div>
    </div>

    <div class="kpi-grid">
      <div class="kpi accent-gold">
        <div class="kpi-label">Tenants</div>
        <div class="kpi-value">${biz.length}</div>
        <div class="kpi-hint">${live} live · ${provisioning} in onboarding</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Platform users</div>
        <div class="kpi-value">${(ov.users || []).length}</div>
        <div class="kpi-hint">owners, staff & admins</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Open change requests</div>
        <div class="kpi-value">${counts.changeRequests || 0}</div>
        <div class="kpi-hint"><button class="link" data-go="requests">Open board →</button></div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Appointments</div>
        <div class="kpi-value">${counts.appointments || 0}</div>
        <div class="kpi-hint">${counts.calls || 0} calls · ${counts.leads || 0} leads</div>
      </div>
    </div>

    <div class="grid-side">
      <div class="section-stack">
        <div class="card">
          <div class="card-title">🏢 Tenants <button class="link" data-go="clients">Manage →</button></div>
          ${biz.length ? `<div class="table-wrap"><table>
            <thead><tr><th>Tenant</th><th>Industry</th><th>Status</th><th></th></tr></thead>
            <tbody>
              ${biz.map(b => `
                <tr data-clickable data-biz="${esc(b.id)}">
                  <td><span class="cell-main">${esc(b.name)}</span><div class="cell-dim">${esc(b.city || '')}</div></td>
                  <td class="cell-dim">${esc(b.industry || '—')}</td>
                  <td>${b.status === 'live'
                    ? '<span class="status-pill status-green"><span class="sdot"></span>live</span>'
                    : `<span class="status-pill status-orange"><span class="sdot"></span>${esc(b.status || 'unknown')}</span>`}</td>
                  <td><button class="btn btn-ghost btn-sm" data-open="${esc(b.id)}">Open</button></td>
                </tr>`).join('')}
            </tbody></table></div>`
            : emptyState('🏢', 'No tenants yet', 'Onboard the first client with Business Connect.',
                '<button class="btn btn-gold btn-sm" data-go="connect">Open Business Connect →</button>')}
        </div>
      </div>

      <div class="section-stack">
        <div class="card">
          <div class="card-title">🕘 Recent platform activity <button class="link" data-go="activity">Full audit →</button></div>
          <div id="ovAudit">${'<div class="cx-loading">Loading audit…</div>'}</div>
        </div>
        <div class="card">
          <div class="card-title">🔌 Production onboarding</div>
          <p class="cell-dim" style="font-size:0.84rem;margin:0 0 10px">New tenants are onboarded through Business Connect: import → validate → dedupe → provision → fail-closed go-live.</p>
          <button class="btn btn-gold btn-sm" data-go="connect">Open Business Connect →</button>
        </div>
      </div>
    </div>`;

  root.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => ctx.navigate(b.dataset.go)));
  root.querySelectorAll('[data-biz]').forEach(tr => tr.addEventListener('click', () => ctx.openClient(tr.dataset.biz)));
  root.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => ctx.openClient(b.dataset.open)));

  const a = await audit();
  const rows = (a.status === 200 ? (a.rows || []) : []).slice(0, 8);
  const userById = {};
  (ov.users || []).forEach(u => { userById[u.id] = u.email; });
  root.querySelector('#ovAudit').innerHTML = rows.length
    ? rows.map(r => `
        <div class="list-row">
          <div class="row-ico" style="background:var(--bg-hover)">•</div>
          <div class="row-main">
            <div class="row-title">${esc(r.action)}</div>
            <div class="row-sub">${esc(r.detail || '')}</div>
          </div>
          <div class="row-time">${relTime(r.at)}</div>
        </div>`).join('')
    : emptyState('◔', 'No audit entries yet', 'Platform actions will appear here.');
}
