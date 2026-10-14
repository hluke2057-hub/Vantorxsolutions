/* ============================================================
   VANTORX ADMIN — pages/clients.js (PRODUCTION)
   Live tenant management. Data + writes go straight to the
   platform server (businesses PATCH, services CRUD, hours PUT).
   ============================================================ */

import { esc } from '../utils.js';
import { toast, openDrawer, confirmDialog, emptyState } from '../components.js';
import { api } from '../realapi.js';

const DAY_LABELS = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };

export async function renderClients(root, ctx) {
  root.innerHTML = `<div class="cx-loading">Loading tenants…</div>`;
  const ov = await ctx.overview();
  if (!ov) { root.innerHTML = `<div class="card">${emptyState('🔒', 'Session expired', 'Sign in again.')}</div>`; return; }
  const biz = ov.businesses || [];

  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">Tenants</div>
      <div class="page-sub">${biz.length} client businesses on the platform. Open one to edit profile, services and hours — changes write through to the server.</div>
    </div>
    <div class="card">
      ${biz.length ? `<div class="table-wrap"><table>
        <thead><tr><th>Tenant</th><th>Industry</th><th>City</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${biz.map(b => `
            <tr data-clickable data-biz="${esc(b.id)}">
              <td><span class="cell-main">${esc(b.name)}</span><div class="cell-dim">${esc(b.phone || b.email || '')}</div></td>
              <td class="cell-dim">${esc(b.industry || '—')}</td>
              <td class="cell-dim">${esc(b.city || '—')}</td>
              <td>${b.status === 'live'
                ? '<span class="status-pill status-green"><span class="sdot"></span>live</span>'
                : `<span class="status-pill status-orange"><span class="sdot"></span>${esc(b.status || 'unknown')}</span>`}</td>
              <td><button class="btn btn-ghost btn-sm" data-open="${esc(b.id)}">Open</button></td>
            </tr>`).join('')}
        </tbody></table></div>`
        : emptyState('🏢', 'No tenants yet', 'Onboard the first client through Business Connect.',
            '<button class="btn btn-gold btn-sm" data-go="connect">Open Business Connect →</button>')}
    </div>`;

  root.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => ctx.navigate(b.dataset.go)));
  root.querySelectorAll('[data-biz]').forEach(tr => tr.addEventListener('click', () => openClientDetail(tr.dataset.biz, ctx)));
  root.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => openClientDetail(b.dataset.open, ctx)));
}

/* ---------------- tenant drawer (live edit) ---------------- */

export async function openClientDetail(id, ctx) {
  const b0 = (ctx.overviewData.businesses || []).find(x => x.id === id);
  if (!b0) { toast('Tenant not found', 'error'); return; }

  const drawer = openDrawer({
    title: esc(b0.name),
    body: `<div class="cx-loading">Loading live tenant data…</div>`,
    footer: `<button class="btn btn-ghost" data-close>Close</button>`,
    onOpen: async ({ drawer, close }) => {
      drawer.querySelector('[data-close]').addEventListener('click', close);

      const [svcR, hrR] = await Promise.all([
        api('GET', '/api/services'),
        api('GET', `/api/hours/${encodeURIComponent(id)}`),
      ]);
      const services = ((svcR.status === 200 ? svcR.rows : []) || []).filter(s => s.businessId === id);
      const hoursRow = hrR.status === 200 ? hrR.row : null;
      const hours = hoursRow || {};

      const dayRow = (k) => {
        const d = hours[k] || { open: '', close: '', closed: true };
        return `
          <div class="cx-form-row" style="grid-template-columns:90px 1fr 1fr 70px;align-items:center">
            <span class="cell-dim" style="font-size:0.78rem">${DAY_LABELS[k]}</span>
            <input data-hr-open="${k}" value="${esc(d.open || '')}" placeholder="9:00 AM">
            <input data-hr-close="${k}" value="${esc(d.close || '')}" placeholder="7:00 PM">
            <label class="cx-check" style="margin:0"><input type="checkbox" data-hr-closed="${k}" ${d.closed ? 'checked' : ''}> closed</label>
          </div>`;
      };

      drawer.querySelector('.drawer-body').innerHTML = `
        <div class="card-title">Profile</div>
        <div class="cx-form-row"><label>Name</label><input id="clName" value="${esc(b0.name || '')}"></div>
        <div class="cx-form-row" style="grid-template-columns:1fr 1fr">
          <div><label>Industry</label><input id="clIndustry" value="${esc(b0.industry || '')}"></div>
          <div><label>City</label><input id="clCity" value="${esc(b0.city || '')}"></div>
        </div>
        <div class="cx-form-row" style="grid-template-columns:1fr 1fr">
          <div><label>Phone</label><input id="clPhone" value="${esc(b0.phone || '')}"></div>
          <div><label>Status</label>
            <select id="clStatus">
              ${['live', 'provisioning', 'paused'].map(s => `<option value="${s}" ${b0.status === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select></div>
        </div>
        <button class="btn btn-gold btn-sm" id="clSaveProfile" style="margin-top:6px">Save profile</button>

        <div class="card-title" style="margin-top:18px">Services (${services.length})</div>
        ${services.length ? `<div>${services.map(s => `
          <div class="list-row">
            <div class="row-ico" style="background:var(--bg-hover)">✂</div>
            <div class="row-main">
              <div class="row-title">${esc(s.name)}</div>
              <div class="row-sub">$${Number(s.price).toFixed(2)} · ${s.minutes} min</div>
            </div>
            <button class="btn btn-ghost btn-sm" data-svc-del="${esc(s.id)}">Delete</button>
          </div>`).join('')}</div>`
          : '<p class="cell-dim" style="font-size:0.82rem">No services yet.</p>'}
        <div class="cx-form-row" style="grid-template-columns:1fr 90px 70px auto;align-items:end;margin-top:8px">
          <div><label>New service</label><input id="svcName" placeholder="Deep Tissue Massage"></div>
          <div><label>Price $</label><input id="svcPrice" type="number" min="0" step="0.01" placeholder="60"></div>
          <div><label>Min</label><input id="svcMins" type="number" min="5" step="5" placeholder="30"></div>
          <button class="btn btn-gold btn-sm" id="svcAdd">Add</button>
        </div>

        <div class="card-title" style="margin-top:18px">Business hours</div>
        ${['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(dayRow).join('')}
        <button class="btn btn-gold btn-sm" id="hrSave" style="margin-top:10px">Save hours</button>`;

      const busy = async (btn, fn) => {
        btn.disabled = true;
        try { await fn(); } finally { btn.disabled = false; }
      };

      drawer.querySelector('#clSaveProfile').addEventListener('click', function () {
        busy(this, async () => {
          const r = await api('PATCH', `/api/businesses/${encodeURIComponent(id)}`, {
            name: drawer.querySelector('#clName').value.trim(),
            industry: drawer.querySelector('#clIndustry').value.trim(),
            city: drawer.querySelector('#clCity').value.trim(),
            phone: drawer.querySelector('#clPhone').value.trim(),
            status: drawer.querySelector('#clStatus').value,
          });
          if (r.error) { toast(r.error, 'error'); return; }
          toast('Profile saved to server', 'success');
          await ctx.overview(true);
        });
      });        drawer.querySelector('#svcAdd').addEventListener('click', function () {
        busy(this, async () => {
          const name = drawer.querySelector('#svcName').value.trim();
          if (!name) { toast('Service name required', 'error'); return; }
          const r = await api('POST', '/api/services', {
            businessId: id,
            name,
            price: Number(drawer.querySelector('#svcPrice').value || 0),
            minutes: Number(drawer.querySelector('#svcMins').value || 30),
          });
          if (r.error) { toast(r.error, 'error'); return; }
          toast('Service added', 'success');
          close();
          openClientDetail(id, ctx);
        });
      });

      drawer.querySelectorAll('[data-svc-del]').forEach(btn => btn.addEventListener('click', function () {
        busy(this, async () => {
          const ok = await confirmDialog({ title: 'Delete service?', message: 'This removes it from the live tenant immediately.', confirmText: 'Delete', danger: true });
          if (!ok) return;
          const r = await api('DELETE', `/api/services/${encodeURIComponent(this.dataset.svcDel)}`);
          if (r.error) { toast(r.error, 'error'); return; }
          toast('Service deleted', 'success');
          close();
          openClientDetail(id, ctx);
        });
      }));

      drawer.querySelector('#hrSave').addEventListener('click', function () {
        busy(this, async () => {
          const payload = { businessId: id };
          ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach(k => {
            payload[k] = {
              open: drawer.querySelector(`[data-hr-open="${k}"]`).value,
              close: drawer.querySelector(`[data-hr-close="${k}"]`).value,
              closed: drawer.querySelector(`[data-hr-closed="${k}"]`).checked,
            };
          });
          const r = await api('PUT', `/api/hours/${encodeURIComponent(id)}`, payload);
          if (r.error) { toast(r.error, 'error'); return; }
          toast('Hours saved to server', 'success');
        });
      });
    },
  });
  return drawer;
}
