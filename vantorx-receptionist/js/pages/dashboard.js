/* ============================================================
   VANTORX AI RECEPTIONIST — pages/dashboard.js
   Everything shown comes from the server: provider matrix with
   honest NOT CONNECTED states, fail-closed readiness, real
   call/appointment data.
   ============================================================ */

import { esc, relTime, fmtTime } from '../utils.js';

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function statusTag(status) {
  if (status === 'connected') return '<span class="status-pill status-green"><span class="sdot"></span>connected</span>';
  if (status === 'first-party' || status === 'vantorx-first-party') return '<span class="status-pill status-gold"><span class="sdot"></span>first-party</span>';
  return `<span class="status-pill status-dim"><span class="sdot"></span>${esc(String(status || 'NOT_CONNECTED'))}</span>`;
}

export function renderDashboard(root, ctx) {
  const { store } = ctx;
  const s = store;
  const today = new Date().toDateString();
  const todayAppts = s.appointments.filter((a) => new Date(a.at).toDateString() === today && a.status !== 'Cancelled');
  const todaysCalls = s.calls.filter((c) => new Date(c.at).toDateString() === today);
  const rdy = s.readiness || { checks: [], blockers: [], ready: false };
  const active = s.config && s.config.active;

  root.innerHTML = `
    <section class="card">
      <div class="row between wrap">
        <div>
          <div class="stat-line ${active ? 'ok' : 'dim'}">
            <span class="pulse"></span> Receptionist ${active ? 'ACTIVE' : 'NOT ACTIVATED'} — ${esc(s.business ? s.business.name : '')}
          </div>
          <h2 class="page-head" style="margin:6px 0 0">Real platform capability. Honest integrations.</h2>
          <p class="dim" style="max-width:640px">Voice runs on configured telephony + LLM + speech providers. Anything not configured shows <b>NOT CONNECTED — SETUP REQUIRED</b> and blocks activation (fail-closed). The test console is real backend logic against the real calendar, clearly labeled TEST MODE.</p>
        </div>
        <div class="row gap">
          <a class="btn primary" href="#/test">▶ Open test console</a>
          <a class="btn ghost" href="#/settings">⚙ Settings & activation</a>
        </div>
      </div>
    </section>

    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Calls today</div><div class="kpi-value">${todaysCalls.length}</div></div>
      <div class="kpi"><div class="kpi-label">Booked by AI (all)</div><div class="kpi-value">${s.appointments.filter((a) => a.source === 'ai-receptionist').length}</div></div>
      <div class="kpi"><div class="kpi-label">Appointments today</div><div class="kpi-value">${todayAppts.length}</div></div>
      <div class="kpi ${rdy.ready ? 'accent-gold' : ''}"><div class="kpi-label">Readiness</div><div class="kpi-value">${rdy.ready ? 'READY' : `${rdy.checks.filter((c) => c.required && !c.pass).length} blockers`}</div><div class="kpi-hint">${rdy.ready ? 'eligible to activate' : 'fail-closed until resolved'}</div></div>
    </div>

    <div class="grid-2">
      <section class="card">
        <h3>Provider status <span class="dim small">— code exists ≠ connected</span></h3>
        <div class="list">
          ${(s.providers || []).map((p) => `
            <div class="list-row">
              <div>
                <div>${esc(p.capability)}</div>
                <div class="dim small">${esc(p.provider || 'no provider configured')}${p.note ? ` — ${esc(p.note)}` : ''}</div>
              </div>
              ${statusTag(p.status)}
            </div>`).join('')}
        </div>
      </section>
      <section class="card">
        <h3>Activation readiness <span class="dim small">— server-evaluated, fail-closed</span></h3>
        <div class="list">
          ${rdy.checks.map((c) => `
            <div class="list-row">
              <div>
                <div>${esc(c.label)} ${c.required ? '<span class="dim small">(required)</span>' : '<span class="dim small">(optional)</span>'}</div>
                <div class="dim small">${esc(c.detail || '')}</div>
              </div>
              <span class="status-pill ${c.pass ? 'status-green' : c.required ? 'status-dim' : 'status-dim'}"><span class="sdot"></span>${c.pass ? 'pass' : c.required ? 'BLOCKER' : 'todo'}</span>
            </div>`).join('')}
        </div>
        ${!rdy.ready ? `<p class="dim small" style="margin-top:8px">Activation is blocked until every required check passes. Blockers: ${esc(rdy.blockers.join(', '))}.</p>` : ''}
      </section>
    </div>

    <div class="grid-2">
      <section class="card">
        <h3>Recent calls</h3>
        ${s.calls.length ? s.calls.slice(0, 5).map((c) => `
          <div class="list-row">
            <div><b>${esc(c.caller || c.from || 'Caller')}</b> <span class="dim small">${esc(c.phone || '')}</span><div class="dim small">${esc(c.summary || '')}</div></div>
            <div class="dim small">${relTime(c.at)}${c.testMode ? ' · TEST' : ''}</div>
          </div>`).join('') : '<div class="dim">No calls yet — run the test console.</div>'}
      </section>
      <section class="card">
        <h3>Upcoming appointments</h3>
        ${s.appointments.filter((a) => a.status !== 'Cancelled').slice(0, 5).map((a) => `
          <div class="list-row">
            <div><b>${fmtTime(a.at)}</b> — ${esc(a.customer)}</div>
            <div class="dim small">${esc(a.service)} · ${esc(a.bookedBy || a.source || '')}</div>
          </div>`).join('') || '<div class="dim">Nothing booked yet.</div>'}
      </section>
    </div>`;
}
