/* ============================================================
   VANTORX LEADFLOW — pages/dashboard.js
   ============================================================ */

import { getState, getLead } from '../store.js';
import {
  STATUSES, STATUS_COLORS, fmtNum, fmtPct, relTime, fmtTime, isOverdue,
  countUp, escapeHTML as esc, daysLabel
} from '../utils.js';
import { lineChart, barChart } from '../components.js';

export function renderDashboard(root) {
  const s = getState();
  const leads = s.leads.filter(l => !l.archived);
  const total = leads.length;
  const count = (st) => leads.filter(l => l.status === st).length;
  const respondedCount = count('Responded') + count('Booked');
  const conversion = count('Booked');
  const rate = total ? respondedCount / total : 0;
  const convRate = total ? conversion / total : 0;

  const dueTasks = s.tasks.filter(t => !t.completed);
  const overdue = dueTasks.filter(t => isOverdue(t.dueAt));
  const todayTasks = dueTasks.filter(t => !isOverdue(t.dueAt) && isTodayStr(t.dueAt));
  const upcoming = dueTasks.filter(t => !isOverdue(t.dueAt) && !isTodayStr(t.dueAt));
  const sentCount = s.activities.filter(a => a.type === 'sms_sent' || a.type === 'email_sent').length;

  const weekLeads = leads.filter(l => new Date(l.createdAt) > Date.now() - 7 * 86400000).length;
  const monthConversions = leads.filter(l => l.status === 'Booked' && new Date(l.updatedAt) > Date.now() - 30 * 86400000).length;

  root.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Here's what's happening with your leads.</div>
        <div class="page-subtitle">${esc(s.settings.business.name)} · ${esc(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))}</div>
      </div>
      <div class="page-header-actions">
        <span class="badge badge-connected">LIVE PLATFORM</span>
        <button class="btn btn-gold" data-action="quick-add">+ Quick Add Lead</button>
      </div>
    </div>

    <div class="metrics-grid">
      ${metricCard('Total Leads', total, '', 'fa-users')}
      ${metricCard('New Leads', count('New'))}
      ${metricCard('Contacted', count('Contacted'))}
      ${metricCard('Responded', respondedCount)}
      ${metricCard('Booked', conversion)}
      ${metricCard('Conversion Rate', convRate, 'pct')}
    </div>

    <div class="dash-grid">
      <div class="card">
        <div class="panel-head">
          <div class="panel-title">Performance</div>
          <div style="display:flex;gap:8px;align-items:center">
            <div class="chart-toggle" id="perfMetric">
              <button data-metric="new" class="active">New leads</button>
              <button data-metric="replies">Replies</button>
              <button data-metric="bookings">Bookings</button>
              <button data-metric="conversions">Conversions</button>
            </div>
            <div class="range-toggle" id="perfRange">
              <button data-range="7">7d</button>
              <button data-range="30" class="active">30d</button>
              <button data-range="90">90d</button>
            </div>
          </div>
        </div>
        <div class="panel-body"><div id="perfChart" class="chart-canvas"></div></div>
      </div>

      <div class="card">
        <div class="panel-head"><div class="panel-title">Pipeline Summary</div></div>
        <div class="panel-body">
          ${STATUSES.map(st => {
            const n = count(st);
            return `<div class="psum-row">
              <div class="psum-label">${st}</div>
              <div class="psum-bar-track"><div class="psum-bar" style="width:${total ? (n / total) * 100 : 0}%;background:${STATUS_COLORS[st]}"></div></div>
              <div class="psum-count">${n}</div>
            </div>`;
          }).join('')}
          <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border-soft)">
            <div class="stat-row"><span>Follow-ups due</span><span class="val">${dueTasks.length}</span></div>
            <div class="stat-row"><span>Messages sent</span><span class="val">${sentCount}</span></div>
            <div class="stat-row"><span>Response rate</span><span class="val">${fmtPct(rate)}</span></div>
            <div class="stat-row"><span>Appointments booked</span><span class="val">${s.appointments.filter(a => a.status === 'Confirmed' || a.status === 'Requested').length}</span></div>
            <div class="stat-row"><span>Leads this week</span><span class="val">${weekLeads}</span></div>
            <div class="stat-row"><span>Conversions this month</span><span class="val">${monthConversions}</span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="dash-grid">
      <div class="card">
        <div class="panel-head">
          <div class="panel-title">Leads that need attention</div>
          <button class="btn btn-ghost btn-sm" data-nav="queue">Open Queue →</button>
        </div>
        <div class="panel-body" id="dashFollowups">
          ${followUpRows([...overdue, ...todayTasks, ...upcoming].slice(0, 6), s)}
        </div>
      </div>

      <div class="card">        <div class="panel-head"><div class="panel-title">Newest leads <span class="badge badge-hot" style="margin-left:6px">awaiting contact</span></div></div>
        <div class="panel-body">
          ${hotLeadRows(leads, s)}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="panel-head">
        <div class="panel-title">Recent Activity</div>
        <button class="btn btn-ghost btn-sm" data-nav="activity">View All →</button>
      </div>
      <div class="panel-body" id="dashActivity">${activityRows(s.activities.slice(0, 8), s)}</div>
    </div>
  `;

  /* ---- animated count-ups ---- */
  root.querySelectorAll('.metric-value[data-count]').forEach(el => {
    const target = Number(el.dataset.count);
    const type = el.dataset.type;
    countUp(el, target, { pct: type === 'pct', suffix: type === 'pct' ? '%' : '' });
  });

  /* ---- performance chart ---- */
  const chartState = { metric: 'new', range: 30 };
  function drawChart() {
    const days = chartState.range;
    const labels = [], pts = { new: [], replies: [], bookings: [], conversions: [] };
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(12, 0, 0, 0);
      labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const inDay = (iso) => { const t = new Date(iso); return t >= d && t < next; };
      pts.new.push({ x: d, y: leads.filter(l => inDay(l.createdAt)).length });
      pts.replies.push({ x: d, y: s.activities.filter(a => /reply/i.test(a.message || '') && inDay(a.createdAt)).length });
      pts.bookings.push({ x: d, y: s.appointments.filter(a => inDay(a.startTime)).length });
      pts.conversions.push({ x: d, y: s.leads.filter(l => l.status === 'Booked' && inDay(l.updatedAt)).length });
    }
    const color = { new: '#60a5fa', replies: '#a78bfa', bookings: '#4ade80', conversions: '#f0d060' }[chartState.metric];
    document.getElementById('perfChart').innerHTML =
      lineChart([{ color, points: pts[chartState.metric], fill: true }], { labels });
  }
  drawChart();

  root.querySelector('#perfMetric').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    root.querySelectorAll('#perfMetric button').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); chartState.metric = b.dataset.metric; drawChart();
  });
  root.querySelector('#perfRange').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    root.querySelectorAll('#perfRange button').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); chartState.range = Number(b.dataset.range); drawChart();
  });
}

function metricCard(label, value, type = '', _icon = '') {
  const display = type === 'pct' ? '0%' : '0';
  return `<div class="card metric-card card-hover">
    <div class="metric-label">${label}</div>
    <div class="metric-value" data-count="${value}" data-type="${type}">${display}</div>
  </div>`;
}

function followUpRows(tasks, s) {
  if (!tasks.length) {
    return `<div style="text-align:center;color:var(--text-dim);padding:24px 0">No follow-ups due. You're all caught up. 🎉</div>`;
  }
  return tasks.map(t => {
    const lead = getLead(t.leadId);
    const overdueTask = isOverdue(t.dueAt);
    return `<div class="fu-row">
      <div class="fu-main">
        <div class="fu-name" data-open-lead="${t.leadId}">${esc(lead ? lead.firstName + ' ' + lead.lastName : 'Unknown')}</div>
        <div class="fu-meta">${esc(t.type)} · ${esc(t.assignedOwner)} · <span style="color:${overdueTask ? 'var(--red)' : 'inherit'}">${overdueTask ? 'Overdue' : 'Due'} ${relTime(t.dueAt)}</span></div>
      </div>
      <button class="btn btn-ghost btn-sm" data-complete-task="${t.id}">✓</button>
      <button class="btn btn-gold btn-sm" data-open-lead="${t.leadId}">Open</button>
    </div>`;
  }).join('');
}

function hotLeadRows(leads) {
  /* no platform lead scoring — newest untouched leads are the honest "hot" list */
  const hot = [...leads].filter(l => l.status !== 'Lost' && l.status !== 'Booked')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  if (!hot.length) return '<div style="color:var(--text-dim);padding:20px 0">No hot leads right now.</div>';
  return hot.map(l => `
    <div class="hot-row">
      <span class="badge badge-not-connected">NEW</span>
      <div class="fu-main">
        <div class="fu-name" data-open-lead="${l.id}">${esc(l.firstName)} ${esc(l.lastName)}</div>
        <div class="fu-meta">${esc(l.source)} · created ${relTime(l.createdAt)}</div>
      </div>
      <button class="btn btn-ghost btn-sm" data-open-lead="${l.id}">Open</button>
    </div>`).join('');
}

export function activityRows(activities, s, { compact = true } = {}) {
  const ICONS = {
    lead_created: '✨', lead_updated: '✏️', status_changed: '🔀', note_added: '📝',
    sms_sent: '💬', email_sent: '📧', reply: '⚡', automation_started: '▶️',
    automation_stopped: '⏸️', appointment_booked: '📅', lead_archived: '📦', lead_deleted: '🗑️',
    sms_drafted: '✍️', email_drafted: '✉️', followup_scheduled: '⏰'
  };
  if (!activities.length) return '<div style="color:var(--text-dim);padding:20px 0">No activity yet.</div>';
  return activities.map(a => {
    const lead = getLead(a.leadId);
    return `<div class="act-row">
      <div class="act-ico">${ICONS[a.type] || '•'}</div>
      <div style="flex:1;min-width:0">
        <div class="act-text">
          ${lead ? `<strong style="cursor:pointer" data-open-lead="${lead.id}">${esc(lead.firstName)} ${esc(lead.lastName)}</strong> · ` : ''}
          ${describeActivity(a)}
        </div>
        <div class="act-time">${esc(a.createdBy || 'System')} · ${relTime(a.createdAt)}</div>
      </div>
    </div>`;
  }).join('');
}

export function describeActivity(a) {
  switch (a.type) {
    case 'lead_created': return 'Lead created';
    case 'lead_updated': return 'Lead updated';
    case 'status_changed': return a.message ? `Status: ${esc(a.message)}` : 'Status changed';
    case 'note_added': return 'Note added' + (a.message ? ` — “${esc(a.message)}”` : '');
    case 'sms_sent': return a.message ? `SMS sent: “${esc(a.message)}”` : 'SMS sent';
    case 'email_sent': return a.message ? `Email sent: “${esc(a.message)}”` : 'Email sent';
    case 'reply': return a.message ? `Reply received: “${esc(a.message)}”` : 'Reply received';
    case 'automation_started': return 'Automation started' + (a.message ? ` — ${esc(a.message)}` : '');
    case 'automation_stopped': return 'Automation stopped';
    case 'appointment_booked': return a.message ? `Appointment booked — ${esc(a.message)}` : 'Appointment booked';
    case 'lead_archived': return 'Lead archived';
    case 'lead_deleted': return 'Lead deleted';
    case 'followup_scheduled': return a.message || 'Follow-up scheduled';
    default: return esc(a.type?.replace(/_/g, ' ') || 'Event');
  }
}

function isTodayStr(iso) {
  const d = new Date(iso), n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}
