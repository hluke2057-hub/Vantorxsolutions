/* ============================================================
   VANTORX CLIENT HUB — pages/home.js
   Home dashboard: KPIs, system statuses, today's appointments,
   recent calls, leads needing attention, recent activity.
   ============================================================ */

import { esc, fmtTime, fmtDuration, relTime, scoreBar, initials } from '../utils.js';
import { callService } from '../services/callService.js';
import { appointmentService } from '../services/appointmentService.js';
import { leadflowService } from '../services/leadflowService.js';
import { emptyState } from '../components.js';

export function renderHome(root, ctx) {
  const s = ctx.getState();
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const callMetrics = callService.metrics();
  const leadMetrics = leadflowService.getMetrics();

  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">${greet}, ${esc(s.business.name)}</div>
      <div class="page-sub">Here's what is happening with your VantorX systems.</div>
    </div>

    <div class="kpi-grid">
      ${kpi('📞', 'Calls Today', callService.callsToday().length, callMetrics.answered + callMetrics.missed ? `${callService.answeredToday()} answered` : 'No calls yet today')}
      ${kpi('📅', 'Appointments Booked', s.appointments.filter(a => a.bookedBy === 'AI Receptionist').length, 'by AI Receptionist', 'accent-gold')}
      ${kpi('🎯', 'New Leads', leadMetrics.new, `${leadMetrics.total} total in LeadFlow`)}
      ${kpi('💬', 'Leads Responded', leadMetrics.responded, 'via LeadFlow')}
      ${kpi('✅', 'Calls Answered', callMetrics.answered, 'last 9 days')}
      ${kpi('📵', 'Missed Calls', callMetrics.missed, 'last 9 days')}
      ${kpi('📨', 'Leads Contacted', leadMetrics.contacted + leadMetrics.responded, 'by LeadFlow')}
      ${kpi('🏆', 'Conversions', leadMetrics.booked, `${leadMetrics.conversion}% conversion rate`)}
    </div>

    <div class="grid-2" style="margin-bottom:18px">
      <div class="card ai-status-card">
        <div class="card-title">🤖 AI Receptionist
          <span class="status-pill ${s.ai.status === 'online' ? 'status-green' : 'status-red'}" style="margin-left:auto">
            <span class="sdot"></span>${s.ai.status === 'online' ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
        <p style="color:var(--text-soft);font-size:0.86rem;margin-bottom:14px">
          Your AI receptionist is ${s.ai.status === 'online' ? 'active and answering calls' : 'currently offline'}.
          Answers on <strong style="color:var(--text)">${esc(s.business.phone)}</strong> — booking straight into ${esc(s.ai.calendar)}.
        </p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-gold btn-sm" data-h="test">Test AI</button>
          <button class="btn btn-ghost btn-sm" data-h="calls">View Calls</button>
          <button class="btn btn-ghost btn-sm" data-h="ai">Manage AI</button>
        </div>
      </div>

      <div class="card">
        <div class="card-title">⚡ LeadFlow
          <span class="status-pill status-gold" style="margin-left:auto"><span class="sdot"></span>ACTIVE</span>
        </div>
        <p style="color:var(--text-soft);font-size:0.86rem;margin-bottom:14px">
          Your automated lead follow-up system is running — ${leadMetrics.total} leads tracked,
          ${leadMetrics.contacted + leadMetrics.responded} already contacted, ${leadMetrics.booked} booked so far.
        </p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-gold btn-sm" data-h="leads">View Leads</button>
          <button class="btn btn-ghost btn-sm" data-h="queue">View Follow-ups</button>
          <button class="btn btn-ghost btn-sm" data-h="openlf">Open LeadFlow</button>
        </div>
      </div>
    </div>

    <div class="grid-side">
      <div>
        <div class="card" style="margin-bottom:18px">
          <div class="card-title">📅 Today's Appointments
            <button class="link-btn" data-h="appts">View all →</button>
          </div>
          <div id="todayAppts"></div>
        </div>

        <div class="card">
          <div class="card-title">📞 Recent Calls
            <button class="link-btn" data-h="calls">View all →</button>
          </div>
          <div id="recentCalls"></div>
        </div>
      </div>

      <div>
        <div class="card" style="margin-bottom:18px">
          <div class="card-title">🎯 Leads Needing Attention
            <button class="link-btn" data-h="leads">View all →</button>
          </div>
          <div id="hotLeads"></div>
        </div>

        <div class="card">
          <div class="card-title">🕘 Recent Activity
            <button class="link-btn" data-h="activity">View all →</button>
          </div>
          <div id="recentActivity"></div>
        </div>
      </div>
    </div>
  `;

  /* ---------- panels ---------- */

  const today = appointmentService.todaysAppointments();
  const taEl = root.querySelector('#todayAppts');
  if (!today.length) {
    taEl.innerHTML = emptyState('📅', 'Nothing booked for today', 'When the AI books appointments they will show up here.');
  } else {
    taEl.innerHTML = today.map(a => `
      <div class="list-row" data-appt="${a.id}" data-clickable>
        <div class="row-ico" style="background:var(--gold-dim);color:var(--gold-bright)">${fmtTime(a.date)}</div>
        <div class="row-main">
          <div class="row-title">${esc(a.customer)}</div>
          <div class="row-sub">${esc(a.service)} · via ${esc(a.bookedBy)}</div>
        </div>
        ${esc(a.status)}
      </div>`).join('');
    taEl.querySelectorAll('[data-appt]').forEach(row =>
      row.addEventListener('click', () => ctx.openAppointment(row.dataset.appt)));
  }

  const calls = callService.getCalls().slice(0, 5);
  root.querySelector('#recentCalls').innerHTML = calls.map(c => `
    <div class="list-row" data-call="${c.id}" data-clickable>
      <div class="row-ico" style="background:var(--bg-hover)">${esc(initials(c.caller))}</div>
      <div class="row-main">
        <div class="row-title">${esc(c.caller)}</div>
        <div class="row-sub">${relTime(c.date)} · ${fmtDuration(c.duration)} · ${esc(c.handled)}</div>
      </div>
      ${outcomePill(c.outcome)}
    </div>`).join('');
  root.querySelectorAll('#recentCalls [data-call]').forEach(row =>
    row.addEventListener('click', () => ctx.openCall(row.dataset.call)));

  const hot = leadflowService.needsAttention();
  root.querySelector('#hotLeads').innerHTML = hot.length ? hot.map(l => `
    <div class="list-row">
      <div class="row-ico" style="background:var(--bg-hover);font-size:0.72rem;font-weight:700">${esc(initials(l.name))}</div>
      <div class="row-main">
        <div class="row-title">${esc(l.name)} ${l.status === 'New' ? '<span class="status-pill status-blue" style="padding:1px 8px">NEW</span>' : '<span class="status-pill status-orange" style="padding:1px 8px">DUE</span>'}
        </div>
        <div class="row-sub">${esc(l.source)} · ${esc(l.status)}</div>
      </div>
      <span class="cell-dim">awaiting contact</span>
    </div>`).join('') : emptyState('🎯', 'No leads currently need attention', 'Every lead is up to date — nice work.');

  const acts = s.activity.slice(0, 6);
  root.querySelector('#recentActivity').innerHTML = acts.map(a => `
    <div class="list-row">
      <div class="row-ico" style="background:var(--bg-hover)">${a.icon}</div>
      <div class="row-main">
        <div class="row-title" style="font-size:0.82rem">${esc(a.title)}</div>
        <div class="row-sub">${esc(a.desc)}</div>
      </div>
      <div class="row-time">${relTime(a.at)}</div>
    </div>`).join('');

  /* ---------- status card buttons ---------- */
  root.querySelectorAll('[data-h]').forEach(b => b.addEventListener('click', () => {
    const h = b.dataset.h;
    if (h === 'test') ctx.testAI();
    else if (h === 'calls') ctx.navigate('calls');
    else if (h === 'ai') ctx.navigate('ai');
    else if (h === 'leads') ctx.navigate('leadflow');
    else if (h === 'queue') ctx.navigate('leadflow', { tab: 'queue' });
    else if (h === 'openlf') ctx.openLeadFlowApp();
    else if (h === 'appts') ctx.navigate('appointments');
    else if (h === 'activity') ctx.navigate('activity');
  }));
}

function kpi(icon, label, value, hint, accent = '') {
  return `
    <div class="kpi ${accent}">
      <div class="kpi-label">${icon} ${esc(label)}</div>
      <div class="kpi-value">${value}</div>
      <div class="kpi-hint">${esc(hint)}</div>
    </div>`;
}

export function outcomePill(outcome) {
  const map = {
    booked: ['status-gold', 'Booked'],
    answered: ['status-blue', 'Answered'],
    faq: ['status-blue', 'Question'],
    info: ['status-blue', 'Question'],
    transferred: ['status-purple', 'Transferred'],
    missed: ['status-red', 'Missed'],
  };
  const [cls, label] = map[outcome] || ['status-dim', outcome];
  return `<span class="status-pill ${cls}"><span class="sdot"></span>${esc(label)}</span>`;
}
