/* ============================================================
   VANTORX ADMIN — pages/requests.js (PRODUCTION)
   Live change-request board. GET /api/change-requests,
   PATCH /api/change-requests/:id, POST /api/change-requests.
   ============================================================ */

import { esc, relTime } from '../utils.js';
import { toast, openModal, emptyState } from '../components.js';
import { changeRequests, setRequestStatus } from '../realapi.js';

const COLS = [
  { key: 'Open', next: 'In Progress', nextLabel: 'Start working →' },
  { key: 'In Progress', next: 'Completed', nextLabel: 'Mark completed →' },
  { key: 'Completed', next: null, nextLabel: null },
];

const TYPE_ICONS = { 'Update hours': '🕐', 'Add service': '➕', 'Pricing update': '💵', 'General request': '📝' };

export async function renderRequests(root, ctx) {
  root.innerHTML = `<div class="cx-loading">Loading change requests…</div>`;
  const [cr, ov] = await Promise.all([changeRequests(), ctx.overview()]);
  if (cr.error) { root.innerHTML = `<div class="card">${emptyState('⚠️', 'Could not load requests', esc(cr.error))}</div>`; return; }
  const rows = cr.rows || [];
  const bizById = {};
  ((ov && ov.businesses) || []).forEach(b => { bizById[b.id] = b.name; });

  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">Change Requests</div>
      <div class="page-sub">${rows.filter(r => r.status !== 'Completed').length} open across all tenants — live from the platform queue.</div>
      <span style="flex:1"></span>
      <button class="btn btn-gold btn-sm" id="crNew">+ New request</button>
    </div>
    <div class="board-grid">
      ${COLS.map(c => `
        <div class="board-col">
          <div class="board-col-head">${esc(c.key)} <span class="nav-badge">${rows.filter(r => r.status === c.key).length}</span></div>
          ${rows.filter(r => r.status === c.key).map(r => `
            <div class="board-card" data-id="${esc(r.id)}">
              <div class="row-title">${TYPE_ICONS[r.type] || '📝'} ${esc(r.type)}</div>
              <div class="row-sub" style="white-space:normal">${esc(r.detail)}</div>
              <div class="cell-dim" style="font-size:0.72rem;margin-top:6px">${esc(bizById[r.businessId] || r.businessId)} · ${relTime(r.at)}</div>
              ${c.next ? `<button class="btn btn-ghost btn-sm" data-adv="${esc(r.id)}" data-next="${esc(c.next)}" style="margin-top:8px">${c.nextLabel}</button>` : ''}
            </div>`).join('') || `<div class="cell-dim" style="font-size:0.8rem;padding:10px 2px">Empty</div>`}
        </div>`).join('')}
    </div>`;

  root.querySelectorAll('[data-adv]').forEach(btn => btn.addEventListener('click', async e => {
    e.stopPropagation();
    const r = await setRequestStatus(btn.dataset.adv, btn.dataset.next);
    if (r.error) { toast(r.error, 'error'); return; }
    toast(`Request moved to ${btn.dataset.next}`, 'success');
    renderRequests(root, ctx);
  }));

  root.querySelector('#crNew').addEventListener('click', () => {
    const ov2 = ctx.overviewData;
    openModal({
      title: 'New change request',
      body: `
        <div class="cx-form-row"><label>Tenant</label>
          <select id="crBiz">${(ov2.businesses || []).map(b => `<option value="${esc(b.id)}">${esc(b.name)}</option>`).join('')}</select></div>
        <div class="cx-form-row"><label>Type</label>
          <select id="crType">${Object.keys(TYPE_ICONS).map(t => `<option>${esc(t)}</option>`).join('')}</select></div>
        <div class="cx-form-row"><label>Detail</label><textarea id="crDetail" rows="4" placeholder="What needs to change?"></textarea></div>
        <div id="crErr"></div>`,
      footer: `<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-gold" data-create>Create</button>`,
      onOpen: ({ modal, close }) => {
        modal.querySelector('[data-cancel]').addEventListener('click', close);
        modal.querySelector('[data-create]').addEventListener('click', async () => {
          const detail = modal.querySelector('#crDetail').value.trim();
          if (!detail) { modal.querySelector('#crErr').innerHTML = '<div class="cx-error">✕ Detail is required</div>'; return; }
          const r = await api2Create(modal.querySelector('#crBiz').value, modal.querySelector('#crType').value, detail);
          if (r.error) { modal.querySelector('#crErr').innerHTML = `<div class="cx-error">✕ ${esc(r.error)}</div>`; return; }
          close(); toast('Request created', 'success'); renderRequests(root, ctx);
        });
      },
    });
  });
}

import { api } from '../realapi.js';
function api2Create(businessId, type, detail) { return api('POST', '/api/change-requests', { businessId, type, detail }); }
