/* ============================================================
   VANTORX CLIENT HUB — pages/leadflow.js
   The client-facing overview of the LeadFlow product.
   Read-only: the full CRM lives in the LeadFlow app.
   ============================================================ */

import { esc, relTime, fmtDate, scoreBar } from '../utils.js';
import { leadflowService } from '../services/leadflowService.js';
import { toast, emptyState } from '../components.js';

let lfTab = 'leads';

/** Called by app.js navigate('leadflow', { tab }) before rendering. */
export function setLeadFlowTab(t) { lfTab = t === 'queue' ? 'queue' : 'leads'; }

export function renderLeadFlow(root, ctx) {
  const s = ctx.getState();
  const m = leadflowService.getMetrics();
  const pipeline = leadflowService.pipelineCounts();
  const maxCount = Math.max(...pipeline.map(p => p.count), 1);
  const queue = leadflowService.followUpQueue();
  const now = Date.now();

  const STAGE_COLORS = {
    New: 'var(--blue)', Contacted: 'var(--orange)', Responded: 'var(--purple)',
    Booked: 'var(--green)', Lost: 'var(--red)',
  };

  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">LeadFlow
        <span class="status-pill status-gold" style="vertical-align:middle;margin-left:10px"><span class="sdot"></span>ACTIVE</span>
      </div>
      <div class="page-sub">Your automated lead follow-up system. This is the overview — the full CRM lives in LeadFlow.</div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(6,1fr)">
      ${[['🎯', 'Total Leads', m.total], ['✨', 'New', m.new], ['📨', 'Contacted', m.contacted],
         ['💬', 'Responded', m.responded], ['🏆', 'Booked', m.booked], ['📈', 'Conversion', m.conversion + '%']]
        .map(([i, l, v]) => `<div class="kpi"><div class="kpi-label">${i} ${esc(l)}</div><div class="kpi-value">${v}</div></div>`).join('')}
    </div>

    <div class="tabs">
      <button class="tab ${lfTab === 'leads' ? 'active' : ''}" data-tab="leads">Leads</button>
      <button class="tab ${lfTab === 'queue' ? 'active' : ''}" data-tab="queue">Follow-up Queue<span class="tab-count">${queue.length}</span></button>
    </div>

    <div id="lfBody"></div>

    <div class="card" style="margin-top:18px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <div style="font-size:0.86rem;color:var(--text-soft)">Need to edit leads, run automations, or manage the pipeline?</div>
      <span style="flex:1"></span>
      <button class="btn btn-gold btn-sm" id="openLF">Open LeadFlow →</button>
    </div>
  `;

  const body = root.querySelector('#lfBody');

  function drawLeads() {
    const leads = leadflowService.getLeads();
    body.innerHTML = `
      <div class="card" style="margin-bottom:18px">
        <div class="card-title">📊 Pipeline</div>
        ${pipeline.map(p => `
          <div style="display:flex;align-items:center;gap:12px;padding:7px 0">
            <div style="width:92px;font-size:0.8rem;font-weight:600">${esc(p.stage)}</div>
            <div style="flex:1;height:10px;background:var(--bg-hover);border-radius:5px;overflow:hidden">
              <div style="width:${(p.count / maxCount) * 100}%;height:100%;background:${STAGE_COLORS[p.stage]};border-radius:5px;opacity:0.85"></div>
            </div>
            <div style="width:30px;text-align:right;font-family:var(--font-display);font-weight:700">${p.count}</div>
          </div>`).join('')}
      </div>

      <div class="grid-3" id="leadCards">
        ${leads.map(l => `
          <div class="card" style="padding:15px">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:9px">
              <div class="row-ico" style="background:var(--bg-hover);font-size:0.72rem;font-weight:700">${esc(l.name.split(' ').map(w => w[0]).slice(0, 2).join(''))}</div>
              <div style="min-width:0">
                <div class="row-title">${esc(l.name)}</div>
                <div class="row-sub">${esc(l.service || 'Service not set')}</div>
              </div>
              <span class="status-pill ${l.status === 'Booked' ? 'status-green' : l.status === 'Lost' ? 'status-red' : l.status === 'New' ? 'status-blue' : l.status === 'Contacted' ? 'status-orange' : 'status-purple'}" style="margin-left:auto">
                <span class="sdot"></span>${esc(l.status)}
              </span>
            </div>
            <div class="cell-dim" style="margin-bottom:8px">${esc(l.source)} · score ${l.score != null ? scoreBar(l.score) : 'not scored'}</div>
            <div style="display:flex;justify-content:space-between;font-size:0.74rem;color:var(--text-dim)">
              <span>Last contact ${relTime(l.lastContact)}</span>
              <span>${l.nextFollowUp ? `Next ${fmtDate(l.nextFollowUp)}` : '—'}</span>
            </div>
          </div>`).join('')}
      </div>`;
  }

  function drawQueue() {
    body.innerHTML = queue.length ? `
      <div class="card">
        <div class="card-title">⏰ Follow-up queue <span class="chip" style="margin-left:auto">${queue.length} pending</span></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Lead</th><th>Type</th><th>Due</th><th style="width:110px"></th></tr></thead>
          <tbody>
            ${queue.map(t => {
              const overdue = new Date(t.dueAt) < new Date();
              return `<tr>
                <td class="cell-main">${esc(t.leadName)}</td>
                <td><span class="chip">${esc(t.type)}</span></td>
                <td><span class="${overdue ? 'cell-main' : 'cell-dim'}" style="${overdue ? 'color:var(--red)' : ''}">${overdue ? 'Overdue — ' : ''}${relTime(t.dueAt)}</span></td>
                <td><button class="btn btn-ghost btn-sm" data-done="${t.id}">Mark done</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table></div>
      </div>` : emptyState('⏰', 'Queue is clear', 'Every follow-up has been completed.');

    body.querySelectorAll('[data-done]').forEach(b => b.addEventListener('click', () => {
      leadflowService.markTaskDone(b.dataset.done);
      toast('Follow-up marked done', 'success');
      lfTab = 'queue';
      renderLeadFlow(root, ctx);
    }));
  }

  function draw() { lfTab === 'leads' ? drawLeads() : drawQueue(); }

  root.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    lfTab = t.dataset.tab;
    root.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x === t));
    draw();
  }));

  root.querySelector('#openLF').addEventListener('click', () => ctx.openLeadFlowApp());

  draw();
}
