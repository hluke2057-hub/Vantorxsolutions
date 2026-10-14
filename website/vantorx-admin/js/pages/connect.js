/* ============================================================
   VANTORX ADMIN — pages/connect.js
   BUSINESS CONNECT — the production onboarding path.
   Import → validate → review/dedupe → approve → provision →
   go-live. Talks to the real platform server (same origin,
   cookie session). NO demo data, NO localStorage truth:
   the server state machine is the only source of truth.
   All identifiers are Cx/cx-prefixed (single-file bundle is
   top-level concatenated — avoid collisions).
   ============================================================ */

import { esc, relTime } from '../utils.js';
import { toast, openModal, confirmDialog, emptyState } from '../components.js';

/* ---------------- api helper (same-origin, cookie session) ---------------- */

async function cxApi(method, path, body) {
  let res;
  try {
    res = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    return { status: 0, error: 'Platform server not reachable. Start platform/server.ps1 and reload.' };
  }
  let data = {};
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) return { status: res.status, error: data.error || `HTTP ${res.status}`, ...data };
  return { status: res.status, ...data };
}

/* ---------------- module state ---------------- */

let cxAuth = null;              // { email, role } | null
let cxView = { name: 'list' };  // { name:'list' } | { name:'detail', id }

/* ---------------- sample envelope ---------------- */

function cxSampleEnvelope() {
  return JSON.stringify({
    schema_version: '1.0',
    source: { system: 'manual', external_business_key: 'lakeside-001' },
    business: {
      legal_name: 'Lakeside Dental PLLC',
      display_name: 'Lakeside Dental',
      industry: 'Dental',
      timezone: 'America/Chicago',
      phone: '(312) 555-0142',
      email: 'frontdesk@lakesidedental.example',
      website: 'lakesidedental.example',
      currency: 'USD',
      address: { city: 'Chicago' },
      hours: [
        { weekday: 0, closed: true },
        { weekday: 1, open: '08:00', close: '17:00' },
        { weekday: 2, open: '08:00', close: '17:00' },
        { weekday: 3, open: '08:00', close: '17:00' },
        { weekday: 4, open: '08:00', close: '17:00' },
        { weekday: 5, open: '08:00', close: '16:00' },
        { weekday: 6, closed: true },
      ],
    },
    services: [
      { name: 'Cleaning', duration_minutes: 45, price_minor: 12000, external_key: 'svc-cleaning' },
      { name: 'Consultation', duration_minutes: 30, price_minor: 8000 },
    ],
    users: [
      { email: 'owner@lakesidedental.example', role: 'business_owner' },
    ],
    receptionist: { name: 'Ava', greeting: 'Thanks for calling Lakeside Dental!', enabled: false },
    knowledge: [
      { kind: 'faq', title: 'Do you take walk-ins?', content: 'We see walk-ins when the schedule allows.' },
    ],
    integrations: [{ provider: 'google_calendar' }],
    billing: { consent_to_subscribe: true, plan_code: 'receptionist-pro' },
  }, null, 2);
}

/* ---------------- shared bits ---------------- */

function cxStatePill(state) {
  const map = {
    importing: 'status-dim', mapped: 'status-dim',
    validated: 'status-blue', approved: 'status-gold',
    provisioning: 'status-orange', ready_for_go_live: 'status-green', active: 'status-green',
    validation_failed: 'status-red', duplicate_review: 'status-orange',
    provisioning_partial: 'status-red', verification_failed: 'status-red', cancelled: 'status-dim',
  };
  const label = String(state || '').replace(/_/g, ' ');
  return `<span class="status-pill ${map[state] || 'status-dim'}"><span class="sdot"></span>${esc(label)}</span>`;
}

function cxSteps(state) {
  const order = ['import', 'validate', 'review', 'provision', 'golive'];
  let activeIdx = 1;
  switch (state) {
    case 'importing': case 'mapped': activeIdx = 0; break;
    case 'validation_failed': activeIdx = 1; break;
    case 'validated': case 'duplicate_review': activeIdx = 2; break;
    case 'approved': case 'provisioning': case 'provisioning_partial': case 'verification_failed': activeIdx = 3; break;
    case 'ready_for_go_live': activeIdx = 4; break;
    case 'active': activeIdx = 5; break;
    default: activeIdx = 1;
  }
  return `<div class="cx-steps">${order.map((s, i) => `
    <div class="cx-step ${i < activeIdx ? 'done' : ''} ${i === activeIdx && state !== 'active' ? 'now' : ''}">
      <span class="cx-step-n">${i < activeIdx || state === 'active' ? '✓' : i + 1}</span>
      <span>${s}</span>
    </div>`).join('<span class="cx-step-arrow">→</span>')}</div>`;
}

function cxIssueRows(issues) {
  if (!issues || !issues.length) return '';
  return `<div class="table-wrap"><table>
    <thead><tr><th>Severity</th><th>Path</th><th>Code</th><th>Problem</th><th>How to fix</th></tr></thead>
    <tbody>${issues.map(i => `
      <tr>
        <td><span class="status-pill ${i.severity === 'error' ? 'status-red' : 'status-orange'}"><span class="sdot"></span>${esc(i.severity)}</span></td>
        <td><code>${esc(i.path)}</code></td>
        <td><code>${esc(i.code)}</code></td>
        <td>${esc(i.message)}</td>
        <td class="cell-dim">${esc(i.remediation || '')}</td>
      </tr>`).join('')}</tbody></table></div>`;
}

function cxErrBanner(msg) {
  return msg ? `<div class="cx-error">✕ ${esc(msg)}</div>` : '';
}

/* ============================================================
   ENTRY — auth gate then workspace
   ============================================================ */

export async function renderConnect(root, ctx) {
  root.innerHTML = `<div class="cx-loading">Connecting to platform…</div>`;
  const me = await cxApi('GET', '/api/auth/me');
  cxAuth = (me.status === 200 && me.user) ? me.user : null;

  if (!cxAuth) { cxRenderSignIn(root); return; }
  if (cxAuth.role !== 'vantorx_admin') {
    root.innerHTML = `
      <div class="page-head"><div class="page-title">Business Connect</div>
      <div class="page-sub">Production tenant onboarding console.</div></div>
      <div class="card">${emptyState('🔒', 'Platform admin required',
        `Signed in as ${cxAuth.email} (${cxAuth.role}). Business Connect is restricted to vantorx_admin accounts.`,
        `<button class="btn btn-gold btn-sm" id="cxSignOut">Sign out</button>`)}</div>`;
    root.querySelector('#cxSignOut').addEventListener('click', cxSignOut);
    return;
  }
  if (cxView.name === 'detail' && cxView.id) await cxRenderDetail(root);
  else await cxRenderList(root);
}

/* ---------------- sign in ---------------- */

function cxRenderSignIn(root) {
  root.innerHTML = `
    <div class="page-head"><div class="page-title">Business Connect</div>
      <div class="page-sub">Production tenant onboarding — sign in with a platform admin account.</div></div>
    <div class="card cx-auth-card">
      <div class="card-title">🔐 Platform sign-in</div>
      <div class="cx-form-row"><label>Email or username</label><input id="cxEmail" type="text" placeholder="Email or username" autocomplete="username"></div>
      <div class="cx-form-row"><label>Password</label><input id="cxPass" type="password" autocomplete="current-password"></div>
      <div id="cxErr"></div>
      <div style="display:flex;gap:9px;margin-top:14px">
        <button class="btn btn-gold" id="cxLoginBtn">Sign in</button>
      </div>
      <div class="cell-dim" style="margin-top:12px;font-size:0.78rem">
        Sessions are cookie-based on the platform server (port 8787). Credentials are never stored in this page.
      </div>
    </div>`;
  const submit = async () => {
    const email = root.querySelector('#cxEmail').value.trim();
    const pass = root.querySelector('#cxPass').value;
    root.querySelector('#cxErr').innerHTML = '';
    const r = await cxApi('POST', '/api/auth/login', { email, password: pass });
    if (r.error) { root.querySelector('#cxErr').innerHTML = cxErrBanner(r.error); return; }
    toast('Signed in to platform', 'success');
    await renderConnect(root);
  };
  root.querySelector('#cxLoginBtn').addEventListener('click', submit);
  root.querySelector('#cxPass').addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
}

async function cxSignOut() {
  await cxApi('POST', '/api/auth/logout', {});
  cxAuth = null;
  cxView = { name: 'list' };
  toast('Signed out', 'info');
  const root = document.querySelector('#view .page');
  if (root) await renderConnect(root);
}

/* ============================================================
   LIST VIEW
   ============================================================ */

async function cxRenderList(root) {
  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">Clients · Business Connect</div>
      <div class="page-sub">VantorX provisions every client for them: add the client → validate → review → provision → readiness checks → GO LIVE. Every gate is enforced server-side; clients never set themselves up.</div>
    </div>
    <div class="card" id="cxInqCard" style="margin-bottom:14px">
      <div class="card-title">📬 Sales inquiries <span style="flex:1"></span><span class="cell-dim" style="font-size:0.75rem">from the VantorX website</span></div>
      <div id="cxInqBody"></div>
    </div>
    <div class="card">
      <div class="card-title">🏢 Client setups
        <span style="flex:1"></span>
        <span class="cell-dim" id="cxWho" style="font-size:0.75rem;margin-right:10px"></span>
        <button class="btn btn-ghost btn-sm" id="cxRefresh">↻ Refresh</button>
        <button class="btn btn-ghost btn-sm" id="cxNew">+ Import JSON</button>
        <button class="btn btn-gold btn-sm" id="cxAddClient">+ Add New Client</button>
      </div>
      <div id="cxListBody"></div>
    </div>`;

  const who = root.querySelector('#cxWho');
  who.textContent = `signed in: ${cxAuth.email}`;
  root.querySelector('#cxRefresh').addEventListener('click', () => cxRenderList(root));
  root.querySelector('#cxNew').addEventListener('click', () => cxOpenNewImport(root));
  root.querySelector('#cxAddClient').addEventListener('click', () => cxOpenAddClient(root, null));
  cxLoadInquiries(root);

  const body = root.querySelector('#cxListBody');
  const r = await cxApi('GET', '/api/admin/connect/imports');
  if (r.error) { body.innerHTML = cxErrBanner(r.error); return; }
  const rows = r.imports || [];
  if (!rows.length) {
    body.innerHTML = emptyState('🔌', 'No imports yet',
      'Create the first import: paste a schema 1.0 business envelope and the wizard will validate, dedupe, provision and gate go-live.');
    return;
  }
  body.innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th>Import</th><th>Business / file</th><th>State</th><th>Errors</th><th>Tenant</th><th>Updated</th><th></th></tr></thead>
    <tbody>${rows.map(m => `
      <tr data-clickable data-imp="${esc(m.id)}">
        <td><code>${esc(m.id)}</code></td>
        <td><span class="cell-main">${esc(m.filename || '(pasted envelope)')}</span><div class="cell-dim">by ${esc(m.createdBy || '')}</div></td>
        <td>${cxStatePill(m.state)}</td>
        <td>${m.errorCount ? `<span class="status-pill status-red"><span class="sdot"></span>${m.errorCount}</span>` : '<span class="cell-dim">0</span>'}</td>
        <td>${m.tenantId ? `<code>${esc(m.tenantId)}</code>` : '<span class="cell-dim">—</span>'}</td>
        <td class="cell-dim">${relTime(m.updatedAt)}</td>
        <td><button class="btn btn-ghost btn-sm" data-open="${esc(m.id)}">Open</button></td>
      </tr>`).join('')}</tbody></table></div>`;

  body.querySelectorAll('[data-imp]').forEach(tr => tr.addEventListener('click', () => {
    cxView = { name: 'detail', id: tr.dataset.imp };
    cxRenderDetail(root);
  }));
}


/* ---------------- sales inquiries (from the public website) ---------------- */

async function cxLoadInquiries(root) {
  const body = root.querySelector('#cxInqBody');
  if (!body) return;
  const r = await cxApi('GET', '/api/admin/inquiries');
  if (r.error) { body.innerHTML = `<div class="cell-dim" style="padding:8px 2px">${esc(r.error)}</div>`; return; }
  const rows = (r.inquiries || []).filter(q => q.status === 'new' || q.status === 'contacted');
  if (!rows.length) { body.innerHTML = `<div class="cell-dim" style="padding:8px 2px">No open inquiries. New website submissions appear here.</div>`; return; }
  body.innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th>When</th><th>Who</th><th>Interested in</th><th>Message</th><th></th></tr></thead>
    <tbody>${rows.slice(0, 15).map(q => `
      <tr>
        <td class="cell-dim">${relTime(q.createdAt)}<div>${esc(q.kind)}</div></td>
        <td><span class="cell-main">${esc(q.name)}</span><div class="cell-dim">${esc(q.business || '')} · ${esc(q.email)}${q.phone ? ' · ' + esc(q.phone) : ''}</div></td>
        <td class="cell-dim">${esc((q.interests || []).join(', ') || q.industry || '')}</td>
        <td class="cell-dim" style="max-width:280px">${esc((q.message || '').slice(0, 140))}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-gold btn-sm" data-inq-start="${esc(q.id)}">Start client setup</button>
          <button class="btn btn-ghost btn-sm" data-inq-done="${esc(q.id)}">Dismiss</button>
        </td>
      </tr>`).join('')}</tbody></table></div>`;
  body.querySelectorAll('[data-inq-start]').forEach(b => b.addEventListener('click', async () => {
    const q = rows.find(x => x.id === b.dataset.inqStart);
    await cxApi('PATCH', '/api/admin/inquiries/' + q.id, { status: 'contacted' });
    cxOpenAddClient(root, q);
  }));
  body.querySelectorAll('[data-inq-done]').forEach(b => b.addEventListener('click', async () => {
    await cxApi('PATCH', '/api/admin/inquiries/' + b.dataset.inqDone, { status: 'lost' });
    cxLoadInquiries(root);
  }));
}

/* ---------------- + Add New Client (guided provisioning form) ----------------
   Builds a schema 1.0 envelope and feeds the SAME server pipeline as a pasted import
   (validate -> review -> provision -> readiness -> go-live). Nothing is written to a tenant here. */

function cxOpenAddClient(root, inq) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hoursRows = days.map((d, i) => {
    const closed = (i === 0 || i === 6);
    return `<tr><td style="padding:3px 8px 3px 0">${d}</td>
      <td><input type="time" id="cxH${i}o" value="09:00" ${closed ? 'disabled' : ''}></td>
      <td><input type="time" id="cxH${i}c" value="17:00" ${closed ? 'disabled' : ''}></td>
      <td><label style="display:flex;gap:5px;align-items:center"><input type="checkbox" id="cxH${i}x" ${closed ? 'checked' : ''}> closed</label></td></tr>`;
  }).join('');
  const tz = ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Phoenix', 'America/Los_Angeles', 'America/Anchorage', 'Pacific/Honolulu'];
  openModal({
    title: 'Add New Client',
    wide: true,
    body: `
      <p class="cell-dim" style="margin:0 0 10px;font-size:0.82rem">Enter what you know now. Everything is validated and reviewed before anything is created — and the client stays <strong>not live</strong> until all readiness checks pass and you click GO LIVE.</p>
      <div class="cx-form-row"><strong>1 · Business</strong></div>
      <div class="cx-form-row"><label>Business name *</label><input id="cxAcName" type="text" value="${esc(inq ? inq.business : '')}" placeholder="Lakeside Barbers"></div>
      <div class="cx-form-row"><label>Industry *</label><input id="cxAcInd" type="text" value="${esc(inq ? inq.industry : '')}" placeholder="Barber / Salon / Dental / Detailing…"></div>
      <div class="cx-form-row"><label>Business phone *</label><input id="cxAcPhone" type="text" value="${esc(inq ? inq.phone : '')}" placeholder="(813) 555-0100"></div>
      <div class="cx-form-row"><label>Business email *</label><input id="cxAcEmail" type="text" value="${esc(inq ? inq.email : '')}"></div>
      <div class="cx-form-row"><label>Website</label><input id="cxAcWeb" type="text" value="${esc(inq ? inq.website : '')}"></div>
      <div class="cx-form-row"><label>City</label><input id="cxAcCity" type="text"></div>
      <div class="cx-form-row"><label>Time zone</label><select id="cxAcTz">${tz.map(z => `<option ${z === 'America/New_York' ? 'selected' : ''}>${z}</option>`).join('')}</select></div>
      <div class="cx-form-row"><strong>2 · Hours</strong></div>
      <table style="font-size:0.82rem">${hoursRows}</table>
      <div class="cx-form-row"><strong>3 · Services</strong> <span class="cell-dim">one per line: name | minutes | price in dollars</span>
        <textarea id="cxAcSvc" rows="5" placeholder="Haircut | 30 | 35&#10;Beard trim | 15 | 15"></textarea></div>
      <div class="cx-form-row"><strong>4 · Business knowledge / FAQs</strong> <span class="cell-dim">one per line: question | answer (policies, parking, payment, etc.)</span>
        <textarea id="cxAcKb" rows="5" placeholder="Do you take walk-ins? | Yes, when the schedule allows."></textarea></div>
      <div class="cx-form-row"><strong>5 · AI receptionist</strong></div>
      <div class="cx-form-row"><label>Receptionist name</label><input id="cxAcRxName" type="text" value="Ava"></div>
      <div class="cx-form-row"><label>Greeting</label><input id="cxAcRxGreet" type="text" placeholder="Thanks for calling … how can I help?"></div>
      <div class="cx-form-row"><strong>6 · Client login (owner)</strong></div>
      <div class="cx-form-row"><label>Owner email *</label><input id="cxAcOwner" type="text" value="${esc(inq ? inq.email : '')}"></div>
      <div class="cx-form-row"><label><input type="checkbox" id="cxAcCal"> Connect Google Calendar (completed later under Connections)</label></div>
      <div id="cxAcErr" style="margin-top:10px"></div>`,
    footer: `<button class="btn btn-ghost" data-cx-cancel>Cancel</button>
             <button class="btn btn-gold" data-cx-create>Create client setup</button>`,
    onOpen: ({ modal, close }) => {
      const q = (id) => modal.querySelector('#' + id);
      days.forEach((d, i) => q(`cxH${i}x`).addEventListener('change', () => {
        q(`cxH${i}o`).disabled = q(`cxH${i}c`).disabled = q(`cxH${i}x`).checked;
      }));
      modal.querySelector('[data-cx-cancel]').addEventListener('click', close);
      modal.querySelector('[data-cx-create]').addEventListener('click', async () => {
        const err = q('cxAcErr'); err.innerHTML = '';
        const name = q('cxAcName').value.trim();
        const owner = q('cxAcOwner').value.trim();
        if (!name || !q('cxAcInd').value.trim() || !q('cxAcPhone').value.trim() || !q('cxAcEmail').value.trim() || !owner) {
          err.innerHTML = cxErrBanner('Business name, industry, business phone, business email and owner email are required.'); return;
        }
        const hours = days.map((d, i) => q(`cxH${i}x`).checked
          ? { weekday: i, closed: true }
          : { weekday: i, open: q(`cxH${i}o`).value, close: q(`cxH${i}c`).value });
        const services = q('cxAcSvc').value.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
          const [n, m, p] = l.split('|').map(x => (x || '').trim());
          const svc = { name: n, duration_minutes: parseInt(m, 10) || 30 };
          const price = parseFloat((p || '').replace(/[^0-9.]/g, ''));
          if (!isNaN(price)) svc.price_minor = Math.round(price * 100);
          return svc;
        });
        const knowledge = q('cxAcKb').value.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
          const [a, ...rest] = l.split('|');
          return { kind: 'faq', title: (a || '').trim(), content: rest.join('|').trim() };
        }).filter(k => k.title && k.content);
        const envelope = {
          schema_version: '1.0',
          source: { system: 'manual', external_business_key: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') },
          business: {
            display_name: name, legal_name: name, industry: q('cxAcInd').value.trim(),
            timezone: q('cxAcTz').value, phone: q('cxAcPhone').value.trim(),
            email: q('cxAcEmail').value.trim() || undefined, website: q('cxAcWeb').value.trim() || undefined,
            currency: 'USD', address: { city: q('cxAcCity').value.trim() || undefined }, hours,
          },
          services,
          users: [{ email: owner, role: 'business_owner' }],
          receptionist: { name: q('cxAcRxName').value.trim() || 'Ava', greeting: q('cxAcRxGreet').value.trim() || undefined, enabled: false },
          knowledge,
          integrations: q('cxAcCal').checked ? [{ provider: 'google_calendar' }] : [],
        };
        const r = await cxApi('POST', '/api/admin/connect/imports', { envelope: JSON.stringify(envelope), filename: `${name} (guided form)` });
        if (r.error && !r.import) { err.innerHTML = cxErrBanner(r.error); return; }
        close();
        const imp = r.import;
        toast(`Client setup ${imp.id} created — state: ${imp.state}`, imp.state === 'validated' ? 'success' : 'error');
        cxView = { name: 'detail', id: imp.id };
        cxRenderDetail(root);
      });
    },
  });
}


/* ---------------- owner invitation hand-off ---------------- */

async function cxLoadInvites(root, tenantId) {
  const box = root.querySelector('#cxInviteBody');
  if (!box) return;
  const r = await cxApi('GET', '/api/admin/tenants/' + encodeURIComponent(tenantId) + '/invites');
  if (r.error) { box.innerHTML = `<span class="cell-dim">${esc(r.error)}</span>`; return; }
  const enrolled = r.enrolled || [], pending = r.invites || [];
  const enr = enrolled.length
    ? `<div class="list-row"><div class="row-main"><div class="row-title">Enrolled</div><div class="row-sub">${enrolled.map(u => esc(u.email) + ' (' + esc(u.role || 'user') + ')').join(' · ')}</div></div><span class="status-pill status-green"><span class="sdot"></span>active</span></div>` : '';
  const pen = pending.map(i => `
    <div class="list-row" style="flex-wrap:wrap;gap:8px">
      <div class="row-main"><div class="row-title">${esc(i.email)} <span class="cell-dim">(${esc(i.role || 'owner')})</span></div>
        <div class="row-sub">${i.expired ? 'Invitation expired — renew it to issue a fresh link.' : 'Invited ' + esc(relTime(i.invitedAt)) + ' · valid 14 days'}</div>
        <input type="text" readonly value="${esc(i.link)}" data-inv-link="${esc(i.userId)}" style="width:100%;margin-top:6px;font-family:ui-monospace,monospace;font-size:0.76rem"></div>
      <button class="btn btn-gold btn-sm" data-inv-copy="${esc(i.userId)}">Copy link</button>
      <button class="btn btn-ghost btn-sm" data-inv-renew="${esc(i.userId)}">Renew</button>
    </div>`).join('');
  box.innerHTML = (enr + pen) || '<span class="cell-dim">No owner users found for this business.</span>';
  box.querySelectorAll('[data-inv-copy]').forEach(b => b.addEventListener('click', async () => {
    const inp = box.querySelector(`[data-inv-link="${b.dataset.invCopy}"]`);
    try { await navigator.clipboard.writeText(inp.value); toast('Invitation link copied', 'success'); }
    catch (e) { inp.select(); toast('Press Ctrl+C to copy the selected link', 'info'); }
  }));
  box.querySelectorAll('[data-inv-renew]').forEach(b => b.addEventListener('click', async () => {
    const x = await cxApi('POST', '/api/admin/invites/' + encodeURIComponent(b.dataset.invRenew) + '/renew', {});
    if (x.error) { toast(x.error, 'error'); return; }
    toast('New invitation link issued', 'success');
    cxLoadInvites(root, tenantId);
  }));
}

/* ---------------- new import modal ---------------- */

function cxOpenNewImport(root) {
  openModal({
    title: 'New Business Connect import',
    wide: true,
    body: `
      <p class="cell-dim" style="margin:0 0 10px;font-size:0.82rem">
        Paste a <strong>schema_version 1.0</strong> envelope. Validation, duplicate detection and provisioning all run
        server-side — this form never edits tenant data directly.</p>
      <div class="cx-form-row"><label>Filename / source label</label>
        <input id="cxImpFile" type="text" placeholder="e.g. lakeside-dental.json"></div>
      <div class="cx-form-row"><label>Envelope JSON</label>
        <textarea id="cxImpJson" rows="16" spellcheck="false" style="font-family:ui-monospace,monospace;font-size:0.78rem"></textarea></div>
      <div style="display:flex;gap:9px;margin-top:4px">
        <button class="btn btn-ghost btn-sm" id="cxSample">Load sample envelope</button>
      </div>
      <div id="cxImpErr" style="margin-top:10px"></div>`,
    footer: `<button class="btn btn-ghost" data-cx-cancel>Cancel</button>
             <button class="btn btn-gold" data-cx-create>Create import</button>`,
    onOpen: ({ modal, close }) => {
      modal.querySelector('#cxSample').addEventListener('click', () => {
        modal.querySelector('#cxImpJson').value = cxSampleEnvelope();
      });
      modal.querySelector('[data-cx-cancel]').addEventListener('click', close);
      modal.querySelector('[data-cx-create]').addEventListener('click', async () => {
        const raw = modal.querySelector('#cxImpJson').value.trim();
        const errBox = modal.querySelector('#cxImpErr');
        errBox.innerHTML = '';
        if (!raw) { errBox.innerHTML = cxErrBanner('Paste an envelope or load the sample.'); return; }
        const r = await cxApi('POST', '/api/admin/connect/imports', {
          envelope: raw,
          filename: modal.querySelector('#cxImpFile').value.trim(),
        });
        if (r.error && !r.import) { errBox.innerHTML = cxErrBanner(r.error); return; }
        close();
        const imp = r.import;
        toast(`Import ${imp.id} created — state: ${imp.state}`, imp.state === 'validated' ? 'success' : 'error');
        cxView = { name: 'detail', id: imp.id };
        cxRenderDetail(root);
      });
    },
  });
}

/* ============================================================
   DETAIL VIEW — the wizard, driven entirely by server state
   ============================================================ */

async function cxRenderDetail(root) {
  root.innerHTML = `<div class="cx-loading">Loading import…</div>`;
  const r = await cxApi('GET', `/api/admin/connect/imports/${encodeURIComponent(cxView.id)}`);
  if (r.error) {
    root.innerHTML = `
      <div class="page-head"><div class="page-title">Business Connect</div></div>
      <div class="card">${cxErrBanner(r.error)}
        <button class="btn btn-ghost btn-sm" id="cxBack1">← Back to imports</button></div>`;
    root.querySelector('#cxBack1').addEventListener('click', () => { cxView = { name: 'list' }; cxRenderList(root); });
    return;
  }

  const imp = r.import;
  const dupes = r.duplicates || [];
  const run = r.provisioningRun || null;
  const glc = r.goLiveChecks || null;

  const issues = (imp.issues || []).filter(i => i.severity === 'error');
  const warnOnly = (imp.issues || []).length > 0 && issues.length === 0;

  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">Import ${esc(imp.id)} ${cxStatePill(imp.state)}</div>
      <div class="page-sub">${esc(imp.filename || '(pasted envelope)')} · created ${relTime(imp.createdAt)} by ${esc(imp.createdBy || '')}
        ${imp.externalBusinessKey ? ` · external key <code>${esc(imp.externalBusinessKey)}</code>` : ''}</div>
    </div>
    ${cxSteps(imp.state)}
    <div class="section-stack" style="margin-top:14px">

      ${cxErrBanner(imp.state === 'validation_failed' ? '' : '')}
      <div class="card">
        <div class="card-title">🗺️ Mapped envelope
          <span style="flex:1"></span>
          <button class="btn btn-ghost btn-sm" id="cxBack">← All imports</button>
          <button class="btn btn-ghost btn-sm" id="cxRaw">View JSON</button>
        </div>
        <div class="kv-list">
          ${cxKv('Legal name', imp.envelope && imp.envelope.business ? imp.envelope.business.legal_name : '')}
          ${cxKv('Display name', imp.envelope && imp.envelope.business ? imp.envelope.business.display_name : '')}
          ${cxKv('Industry', imp.envelope && imp.envelope.business ? imp.envelope.business.industry : '')}
          ${cxKv('Plan / billing consent', `${imp.planCode || '—'} · ${imp.billingConsent ? 'consented' : 'no billing consent'}`)}
          ${cxKv('Schema version', imp.schemaVersion || '—')}
        </div>
      </div>

      ${issues.length ? `
      <div class="card">
        <div class="card-title">⛔ Validation errors (${issues.length}) — provisioning is blocked until fixed</div>
        ${cxIssueRows(imp.issues)}
        <p class="cell-dim" style="font-size:0.8rem;margin:10px 0 0">
          The envelope is immutable after import (audit trail). Fix the source data and create a corrected re-import;
          use the same <code>source.external_business_key</code> so duplicate detection can link them.</p>
      </div>` : ''}

      ${warnOnly && imp.issues.length ? `
      <div class="card">
        <div class="card-title">⚠️ Warnings</div>
        ${cxIssueRows(imp.issues)}
      </div>` : ''}

      ${cxActionsCard(root, imp, dupes, r)}

      ${dupes.length ? `
      <div class="card">
        <div class="card-title">👥 Possible duplicates in existing tenants (scored, never auto-merged)</div>
        <div class="table-wrap"><table>
          <thead><tr><th>Tenant</th><th>Name</th><th>Status</th><th>Score</th><th>Reasons</th></tr></thead>
          <tbody>${dupes.map(d => `
            <tr>
              <td><code>${esc(d.tenantId)}</code></td>
              <td>${esc(d.name)}</td>
              <td>${esc(d.status || '')}</td>
              <td><span class="status-pill ${d.score >= 80 ? 'status-red' : 'status-orange'}"><span class="sdot"></span>${d.score}</span></td>
              <td class="cell-dim">${esc((d.reasons || []).join('; '))}</td>
            </tr>`).join('')}</tbody></table></div>
      </div>` : ''}

      ${(r.review || []).length ? `
      <div class="card">
        <div class="card-title">🔍 Review — exactly what will be provisioned</div>
        <div class="table-wrap"><table>
          <thead><tr><th>Field</th><th>Value after normalization</th><th>Source</th></tr></thead>
          <tbody>${r.review.map(f => `
            <tr><td><code>${esc(f.field)}</code></td><td>${esc(f.value || '—')}</td>
            <td>${f.source === 'normalized' ? '<span class="status-pill status-blue"><span class="sdot"></span>normalized</span>' : '<span class="cell-dim">import</span>'}</td></tr>`).join('')}</tbody></table></div>
      </div>` : ''}

      ${run ? `
      <div class="card">
        <div class="card-title">⚙️ Provisioning run <code>${esc(run.id)}</code></div>
        <div class="kv-list">
          ${cxKv('Run state', esc(String(run.state).replace(/_/g, ' ')))}
          ${cxKv('Idempotency key', `<code>${esc(run.idempotencyKey)}</code>`)}
          ${cxKv('Attempts', String(run.attempts))}
          ${run.tenantId ? cxKv('Tenant', `<code>${esc(run.tenantId)}</code>`) : ''}
          ${run.failureDetail ? cxKv('Last failure', esc(run.failureDetail)) : ''}
        </div>
        ${run.steps && run.steps.length ? `
        <div style="margin-top:10px">${run.steps.map(s => `
          <div class="list-row">
            <div class="row-ico" style="background:${s.state === 'done' ? 'var(--green-dim);color:var(--green)' : s.state === 'failed' ? 'var(--red-dim);color:var(--red)' : 'var(--bg-hover)'}">
              ${s.state === 'done' ? '✓' : s.state === 'failed' ? '✕' : '•'}</div>
            <div class="row-main">
              <div class="row-title">${esc(s.key)}</div>
              <div class="row-sub">${esc(s.detail || '')}</div>
            </div>
            <span class="status-pill ${s.state === 'done' ? 'status-green' : s.state === 'failed' ? 'status-red' : 'status-dim'}"><span class="sdot"></span>${esc(s.state)}</span>
          </div>`).join('')}</div>` : ''}
      </div>` : ''}

      ${glc && imp.tenantId ? `
      <div class="card">
        <div class="card-title">🚦 Go-live checks <span style="flex:1"></span>
          <button class="btn btn-ghost btn-sm" id="cxRecheck">↻ Re-run checks</button></div>
        ${glc.checks.map(c => `
          <div class="list-row">
            <div class="row-ico" style="background:${c.pass ? 'var(--green-dim);color:var(--green)' : 'var(--red-dim);color:var(--red)'}">${c.pass ? '✓' : '✕'}</div>
            <div class="row-main">
              <div class="row-title">${esc(c.label)} ${c.required ? '<span class="cell-dim">(required)</span>' : ''}</div>
              <div class="row-sub">${esc(c.detail || '')}</div>
            </div>
            <span class="status-pill ${c.pass ? 'status-green' : 'status-red'}"><span class="sdot"></span>${c.pass ? 'pass' : 'blocked'}</span>
          </div>`).join('')}
        ${!glc.ready ? `<p class="cell-dim" style="font-size:0.8rem;margin:10px 0 0">
          Blocked by: ${glc.blockers.map(b => `<code>${esc(b)}</code>`).join(', ')}. Go-live will fail closed until every required check passes.</p>` : ''}
      </div>` : ''}

      ${imp.tenantId ? `
      <div class="card" id="cxInviteCard">
        <div class="card-title">🔑 Owner access — hand-off <span style="flex:1"></span></div>
        <p class="cell-dim" style="font-size:0.82rem;margin:0 0 10px">Send the private link below to the owner (email or text). They choose a password and land in their finished system. Treat the link like a password. Go-live requires the owner to have enrolled.</p>
        <div id="cxInviteBody"><span class="cell-dim">Loading…</span></div>
      </div>` : ''}
    </div>`;

  if (imp.tenantId) cxLoadInvites(root, imp.tenantId);
  root.querySelector('#cxBack').addEventListener('click', () => { cxView = { name: 'list' }; cxRenderList(root); });
  root.querySelector('#cxRaw').addEventListener('click', () => {
    openModal({
      title: `Envelope — ${imp.id}`,
      wide: true,
      body: `<textarea readonly rows="20" style="width:100%;font-family:ui-monospace,monospace;font-size:0.78rem">${esc(JSON.stringify(imp.envelope, null, 2))}</textarea>`,
      footer: `<button class="btn btn-ghost" data-close3>Close</button>`,
      onOpen: ({ modal, close }) => modal.querySelector('[data-close3]').addEventListener('click', close),
    });
  });
  const recheck = root.querySelector('#cxRecheck');
  if (recheck) recheck.addEventListener('click', () => cxRenderDetail(root));

  cxBindActions(root, imp);
}

function cxKv(label, valueHtml) {
  return `<div class="kv-row"><div class="kv-label">${label}</div><div class="kv-value">${valueHtml || '<span class="cell-dim">—</span>'}</div></div>`;
}

/* ---------------- state-driven action card ---------------- */

function cxActionsCard(root, imp, dupes, detail) {
  const state = imp.state;
  let body = '';
  const dupNote = dupes.length
    ? `<p class="cell-dim" style="font-size:0.8rem;margin:8px 0 0">${dupes.length} possible duplicate${dupes.length === 1 ? '' : 's'} detected. Approving without resolving requires explicit confirmation — imports are never auto-merged.</p>`
    : '';

  if (state === 'validated' || state === 'duplicate_review') {
    body = `
      <div class="card-title">✅ Ready for review & approval</div>
      <p class="cell-dim" style="font-size:0.85rem;margin:0 0 10px">Validation passed. Approving locks this import for provisioning. Duplicate checks re-run server-side at approval time.</p>
      ${dupNote}
      <div style="display:flex;gap:10px;align-items:center;margin-top:12px;flex-wrap:wrap">
        <button class="btn btn-gold" id="cxBtnApprove">Approve import</button>
        ${dupes.length ? `<button class="btn btn-red" id="cxBtnApproveDespite">Approve anyway — create as separate business</button>` : ''}
      </div>`;
  } else if (state === 'approved') {
    body = `
      <div class="card-title">Approved — ready to provision</div>
      <p class="cell-dim" style="font-size:0.85rem;margin:0 0 10px">Provisioning creates the tenant (org + business), profile, hours, services, receptionist config, declared integrations (recorded honestly as <strong>not_configured</strong>) and owner invitation. It is idempotent — safe to re-run.</p>
      <button class="btn btn-gold" id="cxBtnProvision">Provision tenant</button>`;
  } else if (state === 'provisioning_partial' || state === 'verification_failed') {
    body = `
      <div class="card-title">⚠️ Provisioning incomplete</div>
      <p class="cell-dim" style="font-size:0.85rem;margin:0 0 10px">The last run stopped with failures. Re-running resumes from completed steps — finished steps are skipped, partial ones are retried (upsert semantics).</p>
      <button class="btn btn-gold" id="cxBtnProvision">Resume provisioning (idempotent)</button>`;
  } else if (state === 'ready_for_go_live') {
    body = `
      <div class="card-title">🚀 Ready for go-live</div>
      <p class="cell-dim" style="font-size:0.85rem;margin:0 0 10px">Tenant provisioned and verified. Go-live is <strong>fail-closed</strong>: it requires the explicit owner-approval flag AND every required check passing (including an enrolled owner and real receptionist provider readiness).</p>
      <label class="cx-check"><input type="checkbox" id="cxOwnerApproval">
        <span>Business owner has explicitly approved go-live (documented consent)</span></label>
      <div style="margin-top:12px"><button class="btn btn-gold" id="cxBtnGolive">Execute go-live</button></div>`;
  } else if (state === 'active') {
    body = `
      <div class="card-title">🏆 Tenant is live</div>
      <p class="cell-dim" style="font-size:0.85rem;margin:0 0 4px">Business Connect onboarding complete for tenant <code>${esc(imp.tenantId || '')}</code>. Ongoing configuration lives in the tenant's own apps (Client Hub, AI Receptionist).</p>`;
  } else if (state === 'validation_failed') {
    body = `
      <div class="card-title">⛔ Validation failed</div>
      <p class="cell-dim" style="font-size:0.85rem;margin:0">Fix the errors listed above in the source data, then create a corrected re-import. Approval and provisioning stay locked.</p>`;
  } else if (state === 'provisioning') {
    body = `<div class="card-title">⏳ Provisioning in progress…</div>
      <p class="cell-dim" style="font-size:0.85rem;margin:0">Refresh to see the latest run state.</p>
      <button class="btn btn-ghost btn-sm" id="cxRef" style="margin-top:8px">↻ Refresh</button>`;
  }

  return body ? `<div class="card" id="cxActions">${body}</div>` : '';
}

function cxBindActions(root, imp) {
  const bind = (id, fn) => { const el = root.querySelector(id); if (el) el.addEventListener('click', fn); };
  const refresh = () => cxRenderDetail(root);

  bind('#cxRef', refresh);

  bind('#cxBtnApprove', async () => {
    const r = await cxApi('POST', `/api/admin/connect/imports/${imp.id}/approve`, {});
    if (r.status === 409 && r.needsDuplicateResolution) {
      toast('Duplicates found — resolve or approve explicitly', 'info');
      refresh(); return;
    }
    if (r.error) { toast(r.error, 'error'); refresh(); return; }
    toast('Import approved', 'success'); refresh();
  });

  bind('#cxBtnApproveDespite', async () => {
    const ok = await confirmDialog({
      title: 'Create as a separate business?',
      message: 'Possible duplicates were detected. This records "proceed-separate" on the import and creates a NEW tenant alongside the possible matches. Nothing is merged.',
      confirmText: 'Approve despite duplicates',
      danger: true,
    });
    if (!ok) return;
    const r = await cxApi('POST', `/api/admin/connect/imports/${imp.id}/approve`, { proceedDespiteDuplicates: true });
    if (r.error) { toast(r.error, 'error'); refresh(); return; }
    toast('Import approved (proceed-separate recorded)', 'success'); refresh();
  });

  bind('#cxBtnProvision', async () => {
    const r = await cxApi('POST', `/api/admin/connect/imports/${imp.id}/provision`, {});
    if (r.error) { toast(r.error, 'error'); refresh(); return; }
    if (r.already) toast('Provisioning already complete (idempotent re-run)', 'info');
    else toast(`Provisioned tenant ${r.tenantId} — state: ${r.state}`, r.state === 'ready_for_go_live' ? 'success' : 'error');
    refresh();
  });

  bind('#cxBtnGolive', async () => {
    const chk = root.querySelector('#cxOwnerApproval');
    if (!chk || !chk.checked) { toast('Owner approval must be checked — go-live is fail-closed', 'error'); return; }
    const ok = await confirmDialog({
      title: 'Execute go-live?',
      message: 'The tenant becomes active for real call handling. All required checks must pass, including enrolled owner and receptionist provider readiness (real telephony/LLM credentials).',
      confirmText: 'Go live',
      danger: true,
    });
    if (!ok) return;
    const r = await cxApi('POST', `/api/admin/connect/imports/${imp.id}/golive`, { ownerApproval: true });
    if (r.error) { toast(r.error, 'error'); refresh(); return; }
    toast('Tenant is live', 'success'); refresh();
  });
}
