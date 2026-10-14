/* ============================================================
   VANTORX CLIENT HUB — pages/appointments.js
   Appointments: tabs, metrics, table with reschedule/cancel,
   and Day / Week / Month calendar views (local demo state).
   ============================================================ */

import { esc, fmtDate, fmtTime, relTime, monthLabel, sameDay } from '../utils.js';
import { appointmentService } from '../services/appointmentService.js';
import { toast, openModal, confirmDialog, emptyState } from '../components.js';

const APPT_PILL = { Confirmed: 'status-green', Completed: 'status-dim', Rescheduled: 'status-orange', Cancelled: 'status-red' };
let apptTab = 'upcoming';
let calMode = 'month';
let calCursor = new Date();

export function renderAppointments(root, ctx) {
  const m = appointmentService.metrics();
  const now = new Date();

  /* tab counts are recomputed on every table draw so they stay true after
     server writes (cancel/reschedule re-hydrate the snapshot) */
  function counts() {
    const all = appointmentService.getAppointments();
    return {
      upcoming: all.filter(a => new Date(a.date) > now && a.status !== 'Cancelled').length,
      today: all.filter(a => sameDay(new Date(a.date), now) && a.status !== 'Cancelled').length,
      past: all.filter(a => new Date(a.date) < now && a.status !== 'Cancelled').length,
      cancelled: all.filter(a => a.status === 'Cancelled').length,
    };
  }

  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">Appointments</div>
      <div class="page-sub">Booked by your AI receptionist — stored live on the platform server.</div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr)">
      ${[['📅', 'Upcoming', m.upcoming], ['🤖', 'Booked by AI', m.bookedByAI], ['🔁', 'Rescheduled', m.rescheduled], ['🚫', 'Cancelled', m.cancelled]]
        .map(([i, l, v]) => `<div class="kpi"><div class="kpi-label">${i} ${esc(l)}</div><div class="kpi-value">${v}</div></div>`).join('')}
    </div>

    <div class="tabs">
      ${[['upcoming', 'Upcoming'], ['today', 'Today'], ['past', 'Past'], ['cancelled', 'Cancelled']]
        .map(([v, l]) => `<button class="tab ${apptTab === v ? 'active' : ''}" data-tab="${v}">${l}<span class="tab-count" data-count="${v}">0</span></button>`).join('')}
    </div>

    <div class="section-stack">
      <div class="card">
        <div class="card-title">📋 Appointments</div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Customer</th><th>Service</th><th>Date</th><th>Time</th><th>Booked By</th><th>Status</th><th style="width:150px">Actions</th></tr></thead>
            <tbody id="apptRows"></tbody>
          </table>
          <div id="apptEmpty"></div>
        </div>
      </div>

      <div class="card">
        <div class="cal-head">
          <div class="card-title" style="margin-bottom:0">🗓️ Calendar</div>
          <div class="seg" id="calSeg">
            ${[['day', 'Day'], ['week', 'Week'], ['month', 'Month']].map(([v, l]) => `<button data-m="${v}" class="${calMode === v ? 'active' : ''}">${l}</button>`).join('')}
          </div>
          <span style="flex:1"></span>
          <button class="icon-btn" id="calPrev">‹</button>
          <div class="cal-title" id="calTitle"></div>
          <button class="icon-btn" id="calNext">›</button>
          <button class="btn btn-ghost btn-sm" id="calToday">Today</button>
        </div>
        <div id="calBody"></div>
      </div>
    </div>
  `;

  /* ---------- table ---------- */
  function drawTable() {
    const fresh = appointmentService.getAppointments(); // re-read after server writes
    const c = counts();
    root.querySelectorAll('[data-count]').forEach(el => { el.textContent = c[el.dataset.count]; });
    const rows = fresh.filter(a => {
      const d = new Date(a.date);
      if (apptTab === 'cancelled') return a.status === 'Cancelled';
      if (a.status === 'Cancelled') return false;
      if (apptTab === 'upcoming') return d > now;
      if (apptTab === 'today') return sameDay(d, now);
      if (apptTab === 'past') return d < now;
      return true;
    });
    const tbody = root.querySelector('#apptRows');
    const emptyEl = root.querySelector('#apptEmpty');
    emptyEl.innerHTML = '';
    if (!rows.length) {
      tbody.innerHTML = '';
      const msgs = {
        upcoming: ['Nothing upcoming', 'New AI bookings will land here automatically.'],
        today: ['No appointments today', 'Enjoy the quiet — or test the AI booking flow.'],
        past: ['No past appointments', 'Completed appointments will appear here.'],
        cancelled: ['No cancellations', 'Cancelled appointments will appear here.'],
      };
      emptyEl.innerHTML = emptyState('📅', msgs[apptTab][0], msgs[apptTab][1]);
      return;
    }
    tbody.innerHTML = rows.map(a => `
      <tr>
        <td><div class="cell-main">${esc(a.customer)}</div><div class="cell-dim">${esc(a.phone)}</div></td>
        <td class="cell-dim">${esc(a.service)}</td>
        <td class="cell-dim">${fmtDate(a.date)}</td>
        <td class="cell-dim">${fmtTime(a.date)}</td>
        <td class="cell-dim">${esc(a.bookedBy)}</td>
        <td><span class="status-pill ${APPT_PILL[a.status] || 'status-dim'}"><span class="sdot"></span>${esc(a.status)}</span></td>
        <td>
          ${a.status !== 'Cancelled' ? `
            <button class="btn btn-ghost btn-sm" data-view="${a.id}">View</button>
            <button class="btn btn-ghost btn-sm" data-resched="${a.id}">Reschedule</button>
            <button class="btn btn-ghost btn-sm" data-cancel="${a.id}">Cancel</button>`
          : `<button class="btn btn-ghost btn-sm" data-view="${a.id}">View</button>`}
        </td>
      </tr>`).join('');

    tbody.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => openApptModal(b.dataset.view, ctx)));
    tbody.querySelectorAll('[data-resched]').forEach(b => b.addEventListener('click', () => openReschedule(b.dataset.resched, ctx, drawAll)));
    tbody.querySelectorAll('[data-cancel]').forEach(b => b.addEventListener('click', async () => {
      const a = appointmentService.getAppointment(b.dataset.cancel);
      const ok = await confirmDialog({ title: 'Cancel appointment?', message: `Cancel ${a.customer} — ${a.service} on ${fmtDate(a.date)} ${fmtTime(a.date)}? This cancels it on the platform server immediately.`, confirmText: 'Cancel appointment', danger: true });
      if (!ok) return;
      const r = await appointmentService.cancel(a.id);
      if (r && r.ok === false) { toast(r.error || 'Cancel failed', 'error'); return; }
      toast('Appointment cancelled on the server', 'success');
      drawAll();
    }));
  }

  function openReschedule(id, ctx2, redraw) {
    const a = appointmentService.getAppointment(id);
    const base = new Date(a.date);
    const dayStr = base.toISOString().slice(0, 10);
    openModal({
      title: `Reschedule — ${esc(a.customer)}`,
      body: `
        <div class="form-group"><label class="form-label">New date</label>
          <input type="date" class="form-input" id="rsDate" value="${dayStr}"/></div>
        <div class="form-group"><label class="form-label">New time</label>
          <select class="form-select" id="rsTime">
            ${['9:00 AM', '9:30 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '1:30 PM', '2:00 PM', '3:00 PM', '3:30 PM', '4:00 PM', '5:00 PM', '6:00 PM']
              .map(t => `<option ${fmtTime(a.date) === t ? 'selected' : ''}>${t}</option>`).join('')}
          </select></div>
        <div class="form-hint">Saves the new time to the platform server immediately.</div>`,
      footer: `<button class="btn btn-ghost btn-sm" data-close2>Close</button><button class="btn btn-gold btn-sm" data-go>Reschedule</button>`,
      onOpen: ({ modal, close }) => {
        modal.querySelector('[data-close2]').addEventListener('click', close);
        modal.querySelector('[data-go]').addEventListener('click', async () => {
          const d = new Date(modal.querySelector('#rsDate').value + 'T00:00:00');
          if (isNaN(d)) return toast('Pick a valid date', 'error');
          const t = modal.querySelector('#rsTime').value;
          const mm = t.match(/(\d+):(\d+)\s*(AM|PM)/);
          let h = parseInt(mm[1], 10) % 12 + (mm[3] === 'PM' ? 12 : 0);
          d.setHours(h, parseInt(mm[2], 10), 0, 0);
          const r = await appointmentService.reschedule(id, d);
          if (r && r.ok === false) { toast(r.error || 'Reschedule failed', 'error'); return; }
          close();
          toast('Appointment rescheduled on the server', 'success');
          redraw();
        });
      },
    });
  }

  /* ---------- calendar ---------- */
  function drawCal() {
    const titleEl = root.querySelector('#calTitle');
    const body = root.querySelector('#calBody');
    const appts = appointmentService.getAppointments().filter(a => a.status !== 'Cancelled');

    if (calMode === 'day') {
      titleEl.textContent = calCursor.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
      const day = appts.filter(a => sameDay(new Date(a.date), calCursor));
      body.innerHTML = day.length
        ? `<div class="cal-day-list">${day.map(a => `
            <div class="cal-day-row">
              <div class="cal-day-time">${fmtTime(a.date)}</div>
              <div class="cal-day-line"><div class="cal-day-name">${esc(a.customer)}</div><div class="cell-dim">${esc(a.service)} · ${esc(a.bookedBy)}</div></div>
              <button class="btn btn-ghost btn-sm" data-view="${a.id}">View</button>
            </div>`).join('')}</div>`
        : emptyState('🗓️', 'No appointments this day', 'Pick another date or switch to Month view.');
    } else if (calMode === 'week') {
      const start = new Date(calCursor);
      start.setDate(start.getDate() - start.getDay() + (start.getDay() === 0 ? -6 : 1)); // Monday start
      const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
      titleEl.textContent = `${days[0].toLocaleDateString([], { month: 'short', day: 'numeric' })} – ${days[6].toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
      body.innerHTML = `<div class="week-cols">${days.map(d => {
        const day = appts.filter(a => sameDay(new Date(a.date), d));
        return `<div class="week-col ${sameDay(d, new Date()) ? 'today-col' : ''}">
          <div class="week-dow">${d.toLocaleDateString([], { weekday: 'short' })}</div>
          <div class="week-date">${d.getDate()}</div>
          ${day.length ? day.map(a => `<div class="cal-evt" data-view="${a.id}" title="${esc(a.customer)} — ${esc(a.service)}">${fmtTime(a.date)} ${esc(a.customer.split(' ')[0])}</div>`).join('') : '<div style="font-size:0.68rem;color:var(--text-dim)">—</div>'}
        </div>`;
      }).join('')}</div>`;
    } else {
      const y = calCursor.getFullYear(), mo = calCursor.getMonth();
      titleEl.textContent = monthLabel(y, mo);
      const first = new Date(y, mo, 1);
      const startOffset = (first.getDay() + 6) % 7; // Monday-first
      const start = new Date(y, mo, 1 - startOffset);
      const cells = Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
      body.innerHTML = `
        <div class="cal-grid">
          ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => `<div class="cal-dow">${d}</div>`).join('')}
          ${cells.map(d => {
            const day = appts.filter(a => sameDay(new Date(a.date), d));
            const inMonth = d.getMonth() === mo;
            return `<div class="cal-cell ${inMonth ? '' : 'other'} ${sameDay(d, new Date()) ? 'today' : ''}">
              <div class="cal-num">${d.getDate()}</div>
              ${day.slice(0, 2).map(a => `<div class="cal-evt ${a.status === 'Cancelled' ? 'cancelled' : ''}" data-view="${a.id}">${fmtTime(a.date)} ${esc(a.customer.split(' ')[0])}</div>`).join('')}
              ${day.length > 2 ? `<div class="cal-count">+${day.length - 2} more</div>` : ''}
            </div>`;
          }).join('')}
        </div>`;
    }
    body.querySelectorAll('[data-view]').forEach(el => el.addEventListener('click', () => openApptModal(el.dataset.view, ctx)));
  }

  function drawAll() { drawTable(); drawCal(); }

  root.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    apptTab = t.dataset.tab;
    root.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x === t));
    drawTable();
  }));

  root.querySelectorAll('#calSeg button').forEach(b => b.addEventListener('click', () => {
    calMode = b.dataset.m;
    root.querySelectorAll('#calSeg button').forEach(x => x.classList.toggle('active', x === b));
    drawCal();
  }));
  root.querySelector('#calPrev').addEventListener('click', () => { stepCal(-1); });
  root.querySelector('#calNext').addEventListener('click', () => { stepCal(1); });
  root.querySelector('#calToday').addEventListener('click', () => { calCursor = new Date(); drawCal(); });

  function stepCal(dir) {
    if (calMode === 'day') calCursor.setDate(calCursor.getDate() + dir);
    else if (calMode === 'week') calCursor.setDate(calCursor.getDate() + dir * 7);
    else calCursor.setMonth(calCursor.getMonth() + dir);
    drawCal();
  }

  drawAll();
}

/* ---------- shared detail modal (module scope — used by app.js ctx.openAppointment) ---------- */
export function openApptModal(id, ctx2) {
  const a = appointmentService.getAppointment(id);
  if (!a) return;
  openModal({
    title: `Appointment — ${esc(a.customer)}`,
    body: `<div class="kv-list">
      <div class="kv-row"><div class="kv-label">Customer</div><div class="kv-value">${esc(a.customer)}<div class="cell-dim">${esc(a.phone)}</div></div></div>
      <div class="kv-row"><div class="kv-label">Service</div><div class="kv-value">${esc(a.service)}</div></div>
      <div class="kv-row"><div class="kv-label">When</div><div class="kv-value">${fmtDate(a.date)} · ${fmtTime(a.date)} (${relTime(a.date)})</div></div>
      <div class="kv-row"><div class="kv-label">Booked by</div><div class="kv-value">${esc(a.bookedBy)}</div></div>
      <div class="kv-row"><div class="kv-label">Status</div><div class="kv-value"><span class="status-pill ${APPT_PILL[a.status] || 'status-dim'}"><span class="sdot"></span>${esc(a.status)}</span></div></div>
      ${a.notes ? `<div class="kv-row"><div class="kv-label">Note</div><div class="kv-value">${esc(a.notes)}</div></div>` : ''}
      ${a.callId ? `<div class="kv-row"><div class="kv-label">Source call</div><div class="kv-value"><button class="link-btn" id="apptCall">View call →</button></div></div>` : ''}
    </div>`,
    footer: `<button class="btn btn-ghost btn-sm" data-close2>Close</button>`,
    onOpen: ({ modal, close }) => {
      modal.querySelector('[data-close2]').addEventListener('click', close);
      modal.querySelector('#apptCall')?.addEventListener('click', () => { close(); ctx2.openCall(a.callId); });
    },
  });
}
