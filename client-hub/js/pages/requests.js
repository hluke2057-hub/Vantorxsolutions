/* ============================================================
   VANTORX CLIENT HUB — pages/requests.js (PRODUCTION)
   Real change-request queue: POST /api/change-requests.
   The real VantorX Admin console is the staff side of this queue.
   ============================================================ */

import { esc, fmtDate, relTime } from '../utils.js';
import { REQUEST_TYPES, requestService } from '../services/requestService.js';
import { toast, openModal, emptyState } from '../components.js';
import { STATUS_META } from '../utils.js';

let pendingPrefill = '';

/** Called by app.js navigate('requests', { prefill }) before rendering. */
export function setRequestPrefill(text) { pendingPrefill = text; }

export function renderRequests(root, ctx) {
  const requests = requestService.getRequests();

  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">Request a Change</div>
      <div class="page-sub">Needs something updated? Send the VantorX team a request — it lands in the real admin queue instantly.</div>
    </div>

    <div class="grid-side">
      <div class="card">
        <div class="card-title">📝 New request</div>
        <form id="reqForm" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Request type <span class="req">*</span></label>
              <select class="form-select" id="reqType">
                <option value="">Select a type…</option>
                ${REQUEST_TYPES.map(t => `<option>${esc(t)}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Description <span class="req">*</span></label>
            <textarea class="form-textarea" id="reqDesc" placeholder="Tell us what you want changed..." rows="6"></textarea>
          </div>
          <button type="submit" class="btn btn-gold" id="reqSubmit">Submit Request</button>
        </form>
        <div id="reqSuccess" style="display:none"></div>
      </div>

      <div>
        <div class="card" style="margin-bottom:18px">
          <div class="card-title">🔁 How it works</div>
          <div class="timeline" style="padding-left:24px">
            ${[['📤', 'You submit', 'Your request posts to the platform server immediately.'],
               ['🔎', 'We review', 'The team triages it in the admin console — usually same business day.'],
               ['🛠️', 'We update', 'Changes are made to your systems by VantorX.'],
               ['✅', 'You get told', 'Status updates appear right here in the Hub.']]
              .map(([i, t, d]) => `
              <div class="tl-item">
                <div class="tl-dot">${i}</div>
                <div class="tl-title" style="font-size:0.84rem">${t}</div>
                <div class="tl-desc">${d}</div>
              </div>`).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-title">🛡️ Where it goes</div>
          <p class="cell-dim" style="font-size:0.8rem;margin:0">Requests are stored server-side and worked in the <strong>VantorX Admin console</strong> (Change Requests board). Priorities and assignments are managed there.</p>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <div class="card-title">🗂️ Request history</div>
      <div id="reqHistory"></div>
    </div>
  `;

  /* ---------- form (real submit) ---------- */
  const form = root.querySelector('#reqForm');
  const successEl = root.querySelector('#reqSuccess');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const type = root.querySelector('#reqType').value;
    const desc = root.querySelector('#reqDesc').value.trim();
    if (!type) return toast('Choose a request type', 'error');
    if (desc.length < 5) return toast('Describe the change you need', 'error');
    const btn = root.querySelector('#reqSubmit');
    btn.disabled = true;
    try {
      const out = await requestService.createRequest({ type, description: desc });
      if (out.ok === false) { toast(out.error || 'Submit failed', 'error'); return; }
      const req = out.request;
      form.reset();
      successEl.style.display = 'block';
      successEl.innerHTML = `
        <div class="sim-bubble" style="border-color:rgba(74,222,128,0.35)">
          <strong style="color:var(--green)">✓ Request submitted to the platform.</strong><br/>
          Your VantorX team has received your request.
          <div class="cell-dim" style="margin-top:6px">Reference ${esc(req.id)} · ${esc(req.type)}</div>
        </div>`;
      toast('Request submitted — it is in the live admin queue', 'success');
      drawHistory();
    } finally {
      btn.disabled = false;
    }
  });

  /* ---------- history ---------- */
  if (pendingPrefill) {
    root.querySelector('#reqDesc').value = pendingPrefill;
    pendingPrefill = '';
    root.querySelector('#reqDesc').focus();
  }

  function drawHistory() {
    const list = requestService.getRequests();
    const el = root.querySelector('#reqHistory');
    if (!list.length) {
      el.innerHTML = emptyState('🗂️', "You haven't submitted any requests", 'Use the form to ask for anything — pricing updates, AI tweaks, calendar changes.');
      return;
    }
    el.innerHTML = `<div class="table-wrap"><table>
      <thead><tr><th>Request</th><th>Type</th><th>Submitted</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${list.map(r => `
          <tr>
            <td style="max-width:300px"><div class="cell-main" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.description)}</div></td>
            <td class="cell-dim">${esc(r.type)}</td>
            <td class="cell-dim">${fmtDate(r.createdAt)}<div class="cell-dim">${esc(r.requestId)}</div></td>
            <td><span class="status-pill ${STATUS_META[r.status]?.cls || 'status-dim'}"><span class="sdot"></span>${esc(r.status)}</span></td>
            <td><button class="btn btn-ghost btn-sm" data-view="${esc(r.id)}">View</button></td>
          </tr>`).join('')}
      </tbody>
    </table></div>`;

    el.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => {
      const r = requestService.getRequests().find(x => x.id === b.dataset.view);
      if (!r) return;
      openModal({
        title: `Request ${esc(r.requestId)}`,
        body: `<div class="kv-list">
          <div class="kv-row"><div class="kv-label">Type</div><div class="kv-value">${esc(r.type)}</div></div>
          <div class="kv-row"><div class="kv-label">Description</div><div class="kv-value">${esc(r.description)}</div></div>
          <div class="kv-row"><div class="kv-label">Status</div><div class="kv-value"><span class="status-pill ${STATUS_META[r.status]?.cls || 'status-dim'}"><span class="sdot"></span>${esc(r.status)}</span></div></div>
          <div class="kv-row"><div class="kv-label">Submitted</div><div class="kv-value">${fmtDate(r.createdAt)}</div></div>
        </div>`,
        footer: `<button class="btn btn-ghost btn-sm" data-close2>Close</button>`,
        onOpen: ({ modal, close }) => modal.querySelector('[data-close2]').addEventListener('click', close),
      });
    }));
  }

  drawHistory();
}
