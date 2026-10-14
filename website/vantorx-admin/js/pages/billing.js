/* ============================================================
   VANTORX ADMIN — pages/billing.js (PRODUCTION)
   Live tenant plan status (Business Connect billing consent is
   recorded server-side). Card payments are NOT CONNECTED — the
   page says so honestly instead of inventing invoices.
   ============================================================ */

import { esc, relTime } from '../utils.js';
import { toast, emptyState } from '../components.js';
import { api } from '../realapi.js';

const PLAN_LABEL = { 'receptionist-pro': 'Receptionist Pro', 'receptionist-starter': 'Receptionist Starter' };

export async function renderBilling(root, ctx) {
  root.innerHTML = `<div class="cx-loading">Loading live billing state…</div>`;
  const [ov, imp] = await Promise.all([ctx.overview(true), api('GET', '/api/admin/connect/imports')]);
  if (!ov) { root.innerHTML = `<div class="card">${emptyState('🔒', 'Session expired', 'Sign in again.')}</div>`; return; }
  const imports = (imp.status === 200 ? imp.imports : []) || [];

  const bizById = {};
  (ov.businesses || []).forEach(b => { bizById[b.id] = b; });

  // plan data is whatever Business Connect actually recorded per tenant
  const planRows = imports
    .filter(m => m.tenantId && bizById[m.tenantId])
    .map(m => ({ biz: bizById[m.tenantId], planCode: m.planCode || '', consent: !!m.billingConsent, imp: m }));

  const consented = planRows.filter(r => r.consent).length;

  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">Billing & Plans</div>
      <div class="page-sub">Subscription intent recorded by Business Connect. ${consented} of ${planRows.length} onboarded tenants consented to subscribe.</div>
    </div>

    <div class="kpi-grid">
      <div class="kpi accent-gold">
        <div class="kpi-label">Tenants with plan consent</div>
        <div class="kpi-value">${consented}</div>
        <div class="kpi-hint">recorded at import approval</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Active card payments</div>
        <div class="kpi-value">0</div>
        <div class="kpi-hint">payment provider not connected — honest counter</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">📋 Tenant plan status</div>
      ${planRows.length ? `<div class="table-wrap"><table>
        <thead><tr><th>Tenant</th><th>Plan</th><th>Billing consent</th><th>Payment collection</th></tr></thead>
        <tbody>${planRows.map(r => `
          <tr>
            <td><span class="cell-main">${esc(r.biz.name)}</span><div class="cell-dim">${esc(r.biz.id)}</div></td>
            <td>${r.planCode ? esc(PLAN_LABEL[r.planCode] || r.planCode) : '<span class="cell-dim">— no plan on record</span>'}</td>
            <td>${r.consent
              ? '<span class="status-pill status-green"><span class="sdot"></span>consented</span>'
              : '<span class="status-pill status-dim"><span class="sdot"></span>none recorded</span>'}</td>
            <td><span class="status-pill status-orange"><span class="sdot"></span>not connected</span></td>
          </tr>`).join('')}</tbody></table></div>`
        : emptyState('📋', 'No billed tenants yet', 'Plan consent appears here after a tenant is onboarded through Business Connect.')}
    </div>

    <div class="card">
      <div class="card-title">⚠️ What is real vs not connected</div>
      <div class="kv-list">
        <div class="kv-row"><div class="kv-label">Plan + consent record</div><div class="kv-value">✅ Real — captured per import, stored server-side, audited</div></div>
        <div class="kv-row"><div class="kv-label">Card charging / invoices</div><div class="kv-value"><span style="color:var(--orange)">❌ Payment provider NOT CONNECTED</span> — no fake invoices are shown; connect a processor before collecting money</div></div>
      </div>
    </div>`;
}
