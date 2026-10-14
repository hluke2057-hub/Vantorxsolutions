/* ============================================================
   VANTORX CLIENT HUB — pages/calls.js
   Calls: metrics, searchable/filterable table, detail drawer
   with realistic transcript snippets.
   ============================================================ */

import { esc, fmtDate, fmtTime, fmtDuration, relTime, initials, debounce } from '../utils.js';
import { callService } from '../services/callService.js';
import { appointmentService } from '../services/appointmentService.js';
import { toast, openDrawer, emptyState } from '../components.js';
import { outcomePill } from './home.js';

let callFilter = 'all';
let callQuery = '';

export function renderCalls(root, ctx) {
  const m = callService.metrics();
  const kpis = [
    ['📞', 'Total Calls', m.total], ['✅', 'Answered', m.answered], ['📵', 'Missed', m.missed],
    ['🙋', 'Transferred', m.transferred], ['📅', 'Appointments Booked', m.booked],
  ];

  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">Calls</div>
      <div class="page-sub">Every call your AI receptionist handled — searchable and linked to appointments.</div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(5,1fr)">
      ${kpis.map(([i, l, v]) => `
        <div class="kpi" data-kpi="${l}">
          <div class="kpi-label">${i} ${esc(l)}</div>
          <div class="kpi-value">${v}</div>
        </div>`).join('')}
    </div>

    <div class="card">
      <div class="filter-bar">
        <div class="seg" id="callFilters">
          ${[['all', 'All'], ['answered', 'Answered'], ['missed', 'Missed'], ['transferred', 'Transferred'], ['booked', 'Appointment Booked']]
            .map(([v, l]) => `<button data-f="${v}" class="${callFilter === v ? 'active' : ''}">${l}</button>`).join('')}
        </div>
        <input class="search-input" id="callSearch" placeholder="Search caller or phone…" value="${esc(callQuery)}"/>
        <span class="result-count" id="callCount"></span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Caller</th><th>Phone</th><th>Date</th><th>Time</th><th>Duration</th>
            <th>Outcome</th><th>Handled By</th><th>Appointment</th>
          </tr></thead>
          <tbody id="callRows"></tbody>
        </table>
        <div id="callEmpty"></div>
      </div>
    </div>
  `;

  const tbody = root.querySelector('#callRows');
  const emptyEl = root.querySelector('#callEmpty');

  function drawRows() {
    const q = callQuery.toLowerCase();
    let calls = callService.getCalls();
    if (callFilter === 'answered') calls = calls.filter(c => c.outcome !== 'missed');
    else if (callFilter !== 'all') calls = calls.filter(c => c.outcome === callFilter);
    if (q) calls = calls.filter(c => c.caller.toLowerCase().includes(q) || c.phone.includes(q));

    root.querySelector('#callCount').textContent = `${calls.length} call${calls.length === 1 ? '' : 's'}`;
    emptyEl.innerHTML = '';
    if (!calls.length) {
      tbody.innerHTML = '';
      emptyEl.innerHTML = emptyState('📞', 'No calls match', callQuery
        ? 'Try a different name or number — or clear the filter.'
        : 'No calls yet. Calls to your VantorX number will appear here automatically.');
      return;
    }
    tbody.innerHTML = calls.map(c => {
      const appt = c.apptId ? appointmentService.getAppointment(c.apptId) : null;
      return `
      <tr data-call="${c.id}" data-clickable>
        <td><div class="cell-main">${esc(c.caller)}</div></td>
        <td class="cell-dim">${esc(c.phone)}</td>
        <td class="cell-dim">${fmtDate(c.date)}</td>
        <td class="cell-dim">${fmtTime(c.date)}</td>
        <td class="cell-dim">${fmtDuration(c.duration)}</td>
        <td>${outcomePill(c.outcome)}</td>
        <td class="cell-dim">${esc(c.handled)}</td>
        <td>${appt ? `<span class="chip" style="background:var(--gold-dim);color:var(--gold-bright);border-color:rgba(212,175,55,0.3)">${fmtTime(appt.date)} ✓</span>` : '<span class="cell-dim">—</span>'}</td>
      </tr>`;
    }).join('');
    tbody.querySelectorAll('[data-call]').forEach(tr =>
      tr.addEventListener('click', () => openCallDetail(tr.dataset.call, ctx)));
  }

  drawRows();

  root.querySelectorAll('#callFilters button').forEach(b => b.addEventListener('click', () => {
    callFilter = b.dataset.f;
    root.querySelectorAll('#callFilters button').forEach(x => x.classList.toggle('active', x === b));
    drawRows();
  }));
  root.querySelector('#callSearch').addEventListener('input', debounce(e => { callQuery = e.target.value; drawRows(); }, 180));
}

/* ---------- detail drawer ---------- */

export function openCallDetail(id, ctx) {
  const c = callService.getCall(id);
  if (!c) return;
  const appt = c.apptId ? appointmentService.getAppointment(c.apptId) : null;

  openDrawer({
    title: `Call — ${esc(c.caller)}`,
    body: `
      <div class="kv-list">
        <div class="kv-row"><div class="kv-label">Caller</div><div class="kv-value">${esc(c.caller)}</div></div>
        <div class="kv-row"><div class="kv-label">Phone</div><div class="kv-value">${esc(c.phone)}</div></div>
        <div class="kv-row"><div class="kv-label">Date / time</div><div class="kv-value">${fmtDate(c.date)} · ${fmtTime(c.date)} (${relTime(c.date)})</div></div>
        <div class="kv-row"><div class="kv-label">Duration</div><div class="kv-value">${fmtDuration(c.duration)}</div></div>
        <div class="kv-row"><div class="kv-label">Outcome</div><div class="kv-value">${outcomePill(c.outcome)}</div></div>
        <div class="kv-row"><div class="kv-label">Handled by</div><div class="kv-value">${esc(c.handled)}</div></div>
        <div class="kv-row"><div class="kv-label">Appointment</div><div class="kv-value">
          ${appt ? `${esc(appt.service)} — ${fmtDate(appt.date)} ${fmtTime(appt.date)} ${esc(appt.status)}`
                : (c.outcome === 'missed' ? 'None — missed call' : 'No appointment booked')}
        </div></div>
        ${c.summary ? `<div class="kv-row"><div class="kv-label">Summary</div><div class="kv-value">${esc(c.summary)}</div></div>` : ''}
      </div>

      <div style="margin-top:18px">
        <div class="card-title" style="font-size:0.85rem">Transcript (snippets)</div>
        <div class="transcript">
        ${c.transcriptBlocks.map(t => `
          <div class="tr-line">
            <div class="tr-who ${t.who}">${t.who === 'ai' ? 'AI' : t.who === 'human' ? 'Caller' : 'Sys'}</div>
            <div class="tr-text">${esc(t.text)}<div class="tr-time">${esc(t.t)}</div></div>
          </div>`).join('')}
        </div>
      </div>

      <div style="margin-top:18px">
        <div class="card-title" style="font-size:0.85rem">Your note</div>
        <textarea class="form-textarea" id="callNote" rows="2" placeholder="Add an internal note about this call…">${esc(c.note || '')}</textarea>
      </div>
    `,
    footer: `
      ${appt ? '<button class="btn btn-ghost btn-sm" data-a="appt">View Appointment</button>' : ''}
      <button class="btn btn-ghost btn-sm" data-a="note">Add Note</button>
      <button class="btn btn-gold btn-sm" data-a="help">Request Help</button>`,
    onOpen: ({ drawer, close }) => {
      drawer.querySelector('[data-a="note"]').addEventListener('click', async () => {
        const v = drawer.querySelector('#callNote').value.trim();
        if (!v) return toast('Write the note first', 'error');
        const r = await callService.addNote(id, v);
        if (r && r.ok === false) { toast(r.error, 'error'); return; }
        toast('Note saved to call record', 'success');
      });
      drawer.querySelector('[data-a="help"]').addEventListener('click', () => {
        close();
        ctx.navigate('requests', { prefill: `Help with call from ${c.caller} (${fmtDate(c.date)}): ` });
      });
      drawer.querySelector('[data-a="appt"]')?.addEventListener('click', () => {
        close();
        ctx.openAppointment(appt.id);
      });
    },
  });
}
