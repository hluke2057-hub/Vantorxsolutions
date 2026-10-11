/* ============================================================
   VANTORX LEADFLOW — pages/insights.js
   Activity log · Analytics · Appointments
   ============================================================ */

import {
  getState, getLead, setAppointmentStatus
} from '../store.js';
import {
  STATUSES, STATUS_COLORS, SOURCES, fmtDateTime, fmtDate, fmtPct,
  escapeHTML as esc, isWithinDays, APPOINTMENT_STATUSES
} from '../utils.js';
import { lineChart, donutChart, barList, barChart } from '../components.js';
import { describeActivity } from './dashboard.js';
import { toast } from '../components.js';

/* ============================================================
   ACTIVITY LOG
   ============================================================ */
export function renderActivity(root) {
  const s = getState();
  const filters = { lead: '', type: '', channel: '', days: '' };
  const TYPES = [...new Set(s.activities.map(a => a.type))];

  root.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Activity</div>
        <div class="page-subtitle">Everything that has happened across your leads.</div>
      </div>
    </div>
    <div class="filter-bar">
      <select class="select-input" id="actLead">
        <option value="">All leads</option>
        ${s.leads.map(l => `<option value="${l.id}">${esc(l.firstName)} ${esc(l.lastName)}</option>`).join('')}
      </select>
      <select class="select-input" id="actType">
        <option value="">All types</option>
        ${TYPES.map(t => `<option value="${t}">${t.replace(/_/g, ' ')}</option>`).join('')}
      </select>
      <select class="select-input" id="actChannel">
        <option value="">All channels</option>
        <option value="SMS">SMS</option>
        <option value="Email">Email</option>
      </select>
      <select class="select-input" id="actDays">
        <option value="">All time</option>
        <option value="1">Today</option>
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
      </select>
      <span class="result-count" id="actCount"></span>
    </div>
    <div class="card card-pad"><div id="actList"></div></div>`;

  const list = root.querySelector('#actList');
  const count = root.querySelector('#actCount');

  function draw() {
    let acts = [...getState().activities].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (filters.lead) acts = acts.filter(a => a.leadId === filters.lead);
    if (filters.type) acts = acts.filter(a => a.type === filters.type);
    if (filters.channel) acts = acts.filter(a => a.channel === filters.channel);
    if (filters.days) {
      const cutoff = Date.now() - Number(filters.days) * 86400000;
      acts = acts.filter(a => new Date(a.createdAt) >= cutoff);
    }
    count.textContent = `${acts.length} event${acts.length === 1 ? '' : 's'}`;
    if (!acts.length) {
      list.innerHTML = '<div style="color:var(--text-dim);padding:30px;text-align:center">No activity matches these filters.</div>';
      return;
    }
    const ICONS = {
      lead_created: '✨', lead_updated: '✏️', status_changed: '🔀', note_added: '📝',
      sms_sent: '💬', email_sent: '📧', sms_drafted: '✍️', email_drafted: '✉️',
      reply: '⚡', automation_started: '▶️', automation_stopped: '⏸️',
      appointment_booked: '📅', lead_archived: '📦', lead_deleted: '🗑️', followup_scheduled: '⏰'
    };
    list.innerHTML = acts.slice(0, 200).map(a => {
      const lead = getLead(a.leadId);
      return `<div class="timeline-item">
        <div class="timeline-ico">${ICONS[a.type] || '•'}</div>
        <div class="timeline-body">
          <div class="timeline-head">
            <span class="timeline-text">${lead ? `<strong data-open-lead="${lead.id}">${esc(lead.firstName)} ${esc(lead.lastName)}</strong> · ` : ''}${describeActivity(a)}</span>
            <span class="timeline-time">${fmtDateTime(a.createdAt)}</span>
          </div>
          ${a.createdBy ? `<div class="act-time">by ${esc(a.createdBy)}${a.channel ? ` · ${esc(a.channel)}` : ''}</div>` : ''}
        </div>
      </div>`;
    }).join('');
    list.querySelectorAll('[data-open-lead]').forEach(el =>
      el.addEventListener('click', () => window.LeadFlow.openLead(el.dataset.openLead)));
  }

  root.querySelector('#actLead').addEventListener('change', e => { filters.lead = e.target.value; draw(); });
  root.querySelector('#actType').addEventListener('change', e => { filters.type = e.target.value; draw(); });
  root.querySelector('#actChannel').addEventListener('change', e => { filters.channel = e.target.value; draw(); });
  root.querySelector('#actDays').addEventListener('change', e => { filters.days = e.target.value; draw(); });
  draw();
}

/* ============================================================
   ANALYTICS
   ============================================================ */
export function renderAnalytics(root) {
  let range = 30;

  root.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Know where your leads are coming from — and what converts.</div>
        <div class="page-subtitle">Live platform data — every number reflects your real leads and bookings.</div>
      </div>
      <div class="range-toggle" id="anRange">
        <button data-r="1">Today</button>
        <button data-r="7">7d</button>
        <button data-r="30" class="active">30d</button>
        <button data-r="90">90d</button>
      </div>
    </div>
    <div class="metrics-grid" id="anMetrics" style="grid-template-columns:repeat(5,1fr)"></div>
    <div class="dash-grid">
      <div class="card chart-card"><h3>Leads over time</h3><div id="chartLeads"></div></div>
      <div class="card chart-card"><h3>Bookings over time</h3><div id="chartBookings"></div></div>
    </div>
    <div class="dash-grid-3" style="margin-top:18px">
      <div class="card chart-card"><h3>Leads by status</h3><div class="donut-wrap" id="chartStatus"></div></div>
      <div class="card chart-card"><h3>Leads by source</h3><div class="source-bars" id="chartSources"></div></div>
      <div class="card chart-card"><h3>Leads by service</h3><div class="source-bars" id="chartServices"></div></div>
    </div>
    <div class="dash-grid-2" style="margin-top:18px">
      <div class="card chart-card">
        <h3>Speed & effort</h3>
        <div id="speedStats"></div>
        <div class="form-hint" style="margin-top:10px">Measured from live platform activity.</div>
      </div>
      <div class="card chart-card"><h3>Source performance</h3><div id="sourcePerf"></div></div>
    </div>`;

  function draw() {
    const st = getState();
    const leads = st.leads.filter(l => !l.archived && isWithinDays(l.createdAt, range) || (range === 90 && !l.archived));
    const scoped = st.leads.filter(l => !l.archived && (range === 90 ? true : isWithinDays(l.createdAt, range)));
    const total = scoped.length;
    const contacted = scoped.filter(l => l.lastContactAt).length;
    const responded = scoped.filter(l => ['Responded', 'Booked'].includes(l.status)).length;
    const booked = scoped.filter(l => l.status === 'Booked').length;

    root.querySelector('#anMetrics').innerHTML = [
      ['Total leads', total], ['New leads', scoped.filter(l => l.status === 'New').length],
      ['Response rate', fmtPct(contacted ? responded / contacted : 0)], ['Booking rate', fmtPct(total ? booked / total : 0)],
      ['Conversion rate', fmtPct(total ? booked / total : 0)]
    ].map(([label, v]) => `<div class="card metric-card"><div class="metric-label">${label}</div><div class="metric-value" style="font-size:1.4rem">${v}</div></div>`).join('');

    /* time series */
    const days = Math.min(range, 30);
    const labels = [], leadPts = [], bookPts = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(12, 0, 0, 0);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const inDay = iso => { const t = new Date(iso); return t >= d && t < next; };
      labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      leadPts.push({ x: d, y: st.leads.filter(l => inDay(l.createdAt)).length });
      bookPts.push({ x: d, y: st.activities.filter(a => a.type === 'appointment_booked' && inDay(a.createdAt)).length });
    }
    root.querySelector('#chartLeads').innerHTML = lineChart([{ color: '#60a5fa', points: leadPts, fill: true }], { labels });
    root.querySelector('#chartBookings').innerHTML = lineChart([{ color: '#4ade80', points: bookPts, fill: true }], { labels });

    /* status donut */
    root.querySelector('#chartStatus').innerHTML = donutChart(
      STATUSES.map(stt => ({ label: stt, value: scoped.filter(l => l.status === stt).length, color: STATUS_COLORS[stt] }))
    ) + `<div class="legend">${STATUSES.map(stt => `<div class="legend-item"><span class="legend-swatch" style="background:${STATUS_COLORS[stt]}"></span>${stt}<strong>${scoped.filter(l => l.status === stt).length}</strong></div>`).join('')}</div>`;

    /* sources */
    const srcCounts = SOURCES.map(sr => ({ label: sr, value: scoped.filter(l => l.source === sr).length })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);
    root.querySelector('#chartSources').innerHTML = srcCounts.length ? barList(srcCounts) : '<div style="color:var(--text-dim)">No leads in range.</div>';

    /* services */
    const svcMap = {};
    scoped.forEach(l => { const k = l.serviceInterest || 'Other'; svcMap[k] = (svcMap[k] || 0) + 1; });
    const svcData = Object.entries(svcMap).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 7);
    root.querySelector('#chartServices').innerHTML = svcData.length ? barList(svcData) : '<div style="color:var(--text-dim)">No data.</div>';

    /* speed stats */
    const firstFollowUps = st.activities.filter(a => a.type === 'sms_sent' || a.type === 'email_sent');
    let avgFirstFU = null;
    const byLead = {};
    firstFollowUps.forEach(a => {
      if (!byLead[a.leadId]) byLead[a.leadId] = a.createdAt;
      else if (new Date(a.createdAt) < new Date(byLead[a.leadId])) byLead[a.leadId] = a.createdAt;
    });
    const gaps = Object.entries(byLead).map(([leadId, sentAt]) => {
      const lead = getLead(leadId);
      return lead ? (new Date(sentAt) - new Date(lead.createdAt)) / 3600000 : null;
    }).filter(g => g != null && g >= 0);
    if (gaps.length) avgFirstFU = gaps.reduce((s, g) => s + g, 0) / gaps.length;

    const bookedLeads = scoped.filter(l => l.status === 'Booked');
    const touchesBefore = bookedLeads.map(l => st.activities.filter(a => a.leadId === l.id && (a.type === 'sms_sent' || a.type === 'email_sent')).length);
    const avgTouches = touchesBefore.length ? (touchesBefore.reduce((s, t) => s + t, 0) / touchesBefore.length) : 0;

    root.querySelector('#speedStats').innerHTML = `
      <div class="stat-row"><span>Average time to first follow-up</span><span class="val">${avgFirstFU != null ? avgFirstFU.toFixed(1) + ' hours' : '—'}</span></div>
      <div class="stat-row"><span>Average touches before booking</span><span class="val">${avgTouches.toFixed(1)}</span></div>
      <div class="stat-row"><span>Leads contacted</span><span class="val">${contacted} of ${total}</span></div>
      <div class="stat-row"><span>Open follow-up tasks</span><span class="val">${st.tasks.filter(t => !t.completed).length}</span></div>`;

    /* source performance */
    const rows = SOURCES.map(sr => {
      const ls = scoped.filter(l => l.source === sr);
      const bk = ls.filter(l => l.status === 'Booked').length;
      return { source: sr, leads: ls.length, booked: bk, conv: ls.length ? bk / ls.length : 0 };
    }).filter(r => r.leads > 0).sort((a, b) => b.leads - a.leads);
    root.querySelector('#sourcePerf').innerHTML = `
      <table style="font-size:0.82rem">
        <thead><tr><th>Source</th><th>Leads</th><th>Booked</th><th>Conversion</th></tr></thead>
        <tbody>${rows.map(r => `<tr><td>${esc(r.source)}</td><td>${r.leads}</td><td>${r.booked}</td><td><strong style="color:var(--gold-bright)">${fmtPct(r.conv)}</strong></td></tr>`).join('')}</tbody>
      </table>`;
  }

  root.querySelector('#anRange').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    root.querySelectorAll('#anRange button').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); range = Number(b.dataset.r); draw();
  });
  draw();
}

/* ============================================================
   APPOINTMENTS
   ============================================================ */
export function renderAppointments(root) {
  const s = getState();
  const appts = [...s.appointments].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  root.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Appointments</div>
        <div class="page-subtitle">Bookings linked to leads. Connect Cal.com or Google Calendar in Integrations when ready.</div>
      </div>
      <span class="badge badge-connected">LIVE PLATFORM</span>
    </div>
    ${appts.length ? `<div class="card card-pad">${appts.map(a => {
      const lead = getLead(a.leadId);
      const d = new Date(a.startTime);
      const cls = { Requested: 'badge-requested', Confirmed: 'badge-confirmed', Completed: 'badge-completed', Canceled: 'badge-canceled', 'No-show': 'badge-noshow' }[a.status] || '';
      return `<div class="appt-row">
        <div class="appt-date"><span class="d">${d.getDate()}</span><span class="m">${d.toLocaleDateString('en-US', { month: 'short' })}</span></div>
        <div class="appt-info">
          <div class="appt-lead" data-open-lead="${a.leadId || ''}">${esc(lead ? `${lead.firstName} ${lead.lastName}` : 'Not linked to a lead')}</div>
          <div class="appt-meta">${esc(a.service)} · ${esc(a.staff)} · ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div>
        </div>
        <span class="badge ${cls}">${esc(a.status)}</span>
        <select class="select-input" data-appt-status="${a.id}" style="width:130px">
          ${APPOINTMENT_STATUSES.map(st => `<option ${st === a.status ? 'selected' : ''}>${st}</option>`).join('')}
        </select>
      </div>`;
    }).join('')}</div>`
      : `<div class="card">${emptyState({ icon: '📅', title: 'No appointments yet', message: 'Book one from any lead profile, or connect a calendar.' })}</div>`}
  `;

  root.querySelectorAll('[data-open-lead]').forEach(el =>
    el.addEventListener('click', () => window.LeadFlow.openLead(el.dataset.openLead)));
  root.querySelectorAll('[data-appt-status]').forEach(sel =>
    sel.addEventListener('change', () => { setAppointmentStatus(sel.dataset.apptStatus, sel.value); toast('Appointment updated on the server'); }));
}
