/* ============================================================
   VANTORX LEADFLOW — pages/pipeline.js
   Commercial Opportunity Kanban & Follow-Up Revenue Board.
   Includes Live Dollar Totals, Ava Voice AI Intake, and Drag & Drop.
   ============================================================ */

import { getState, changeStatus, completeTask, snoozeTask, getLead, addTask, emit, simulateAvaCall } from '../store.js';
import { STATUSES, STATUS_COLORS, escapeHTML as esc, relTime, fmtDate, fmtMoney, isOverdue } from '../utils.js';
import { openModal, confirmDialog, toast, emptyState } from '../components.js';
import { openFollowUpModal, openNoteModal } from './profile.js';

/* ============================================================
   PIPELINE
   ============================================================ */
export function renderPipeline(root) {
  const s = getState();
  const stages = (s.settings && s.settings.pipeline && s.settings.pipeline.stages) || STATUSES;
  const view = { compact: false, search: '', sort: 'score' };

  // Calculate overall pipeline value
  const activeLeads = s.leads.filter(l => !l.archived && l.status !== 'Lost');
  const totalPipelineVal = activeLeads.reduce((sum, l) => sum + (Number(l.estimatedValue) || 0), 0);

  root.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Opportunity Pipeline & Revenue Board</div>
        <div class="page-subtitle">💰 Active Pipeline: <strong style="color:var(--gold-bright);font-size:1.05rem">${fmtMoney(totalPipelineVal)}</strong> · ${activeLeads.length} Live Opportunities · Drag cards to advance</div>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-gold btn-sm" id="testAvaCallBtn" style="font-weight:700">⚡ Test Ava Call Intake</button>
        <button class="btn btn-ghost btn-sm" id="pbCompact">Toggle compact</button>
        <input class="search-input" id="pbSearch" placeholder="Filter leads…" style="min-width:180px"/>
        <select class="select-input" id="pbSort">
          <option value="score">Sort: Score</option>
          <option value="value">Sort: Deal Value</option>
          <option value="name">Sort: Name</option>
          <option value="recent">Sort: Last contact</option>
        </select>
      </div>
    </div>
    <div class="kanban" id="kanban"></div>
  `;

  const kanban = root.querySelector('#kanban');
  let dragId = null;

  function draw() {
    const freshState = getState();
    const q = view.search.toLowerCase();

    // Recalculate pipeline header total on every redraw
    const currentActive = freshState.leads.filter(l => !l.archived && l.status !== 'Lost');
    const freshTotal = currentActive.reduce((sum, l) => sum + (Number(l.estimatedValue) || 0), 0);
    const subTitle = root.querySelector('.page-subtitle');
    if (subTitle) {
      subTitle.innerHTML = `💰 Active Pipeline: <strong style="color:var(--gold-bright);font-size:1.05rem">${fmtMoney(freshTotal)}</strong> · ${currentActive.length} Live Opportunities · Drag cards to advance`;
    }

    kanban.innerHTML = stages.map(stage => {
      let leads = freshState.leads.filter(l => !l.archived && l.status === stage);
      if (q) {
        leads = leads.filter(l => `${l.firstName} ${l.lastName} ${l.serviceInterest || ''} ${l.company || ''} ${l.source || ''}`.toLowerCase().includes(q));
      }
      leads.sort((a, b) => {
        if (view.sort === 'name') return `${a.firstName}`.localeCompare(`${b.firstName}`);
        if (view.sort === 'value') return (Number(b.estimatedValue) || 0) - (Number(a.estimatedValue) || 0);
        if (view.sort === 'recent') return new Date(b.lastContactAt || 0) - new Date(a.lastContactAt || 0);
        return (b.score || 0) - (a.score || 0);
      });

      const colVal = leads.reduce((sum, l) => sum + (Number(l.estimatedValue) || 0), 0);

      return `<div class="kanban-col" data-stage="${esc(stage)}">
        <div class="kanban-col-head" style="color:${STATUS_COLORS[stage] || 'var(--text)'};display:flex;justify-content:space-between;align-items:center">
          <span>${esc(stage)}</span>
          <span class="kanban-col-count" style="display:inline-flex;align-items:center;gap:6px">
            ${leads.length} · <span style="color:var(--gold-bright);font-weight:700;font-size:0.78rem">${fmtMoney(colVal)}</span>
          </span>
        </div>
        ${leads.length ? leads.map(l => leadCard(l)).join('') : `<div class="kanban-empty">Drop leads here</div>`}
      </div>`;
    }).join('');
    wire();
  }

  function leadCard(l) {
    const scorePill = l.score != null ? `<span class="score-pill ${l.score >= 70 ? 'score-high' : l.score >= 45 ? 'score-mid' : 'score-low'}">${l.score}</span>` : '';
    const dealBadge = l.estimatedValue ? `<span class="badge" style="background:rgba(245,158,11,0.18);border:1px solid rgba(245,158,11,0.45);color:var(--gold-bright);font-weight:800;font-size:11.5px;padding:3px 7px">${fmtMoney(l.estimatedValue)}</span>` : '';
    const isAva = l.source === 'Ava 24/7 Voice AI' || l.callRecording;

    if (view.compact) {
      return `<div class="lead-card ${view.compact ? 'compact' : ''}" draggable="true" data-id="${l.id}">
        <div class="lead-card-head">
          <span class="lead-card-name" data-open-lead="${l.id}">${esc(l.firstName)} ${esc(l.lastName)}</span>
          <div style="display:flex;gap:5px;align-items:center">
            ${dealBadge}
            ${scorePill}
          </div>
        </div>
      </div>`;
    }

    return `<div class="lead-card" draggable="true" data-id="${l.id}">
      <div class="lead-card-head">
        <span class="lead-card-name" data-open-lead="${l.id}">${esc(l.firstName)} ${esc(l.lastName)}</span>
        <div style="display:flex;gap:5px;align-items:center">
          ${dealBadge}
          ${scorePill}
        </div>
      </div>
      <div class="lead-card-meta">
        <span style="font-weight:600;color:var(--text)">${esc(l.serviceInterest || 'Trade Service')}</span>
        <span>${esc(l.source)} · ${esc(l.company || 'Residential')}</span>
        <span>${l.lastContactAt ? `Touched ${relTime(l.lastContactAt)}` : 'Never contacted'}${l.nextFollowUpAt ? ` · FU ${relTime(l.nextFollowUpAt)}` : ''}</span>
      </div>
      <div class="lead-card-tags" style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px">
        ${isAva ? '<span class="badge" style="background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.35);color:#60a5fa;font-size:10.5px">📞 Ava Call</span>' : ''}
        ${(l.tags || []).map(t => `<span class="chip" style="font-size:10px">${esc(t)}</span>`).join('')}
        ${l.automationActive ? '<span class="badge badge-hot" style="font-size:10px">⚡ auto</span>' : ''}
      </div>
    </div>`;
  }

  function wire() {
    /* drag & drop */
    kanban.querySelectorAll('.lead-card').forEach(card => {
      card.addEventListener('dragstart', (e) => {
        dragId = card.dataset.id;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        try { e.dataTransfer.setData('text/plain', dragId); } catch {}
      });
      card.addEventListener('dragend', () => { card.classList.remove('dragging'); });
      card.querySelector('[data-open-lead]')?.addEventListener('click', (e) => {
        e.stopPropagation(); window.LeadFlow.openLead(card.dataset.id);
      });
    });

    kanban.querySelectorAll('.kanban-col').forEach(col => {
      col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('drag-over'); });
      col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
      col.addEventListener('drop', async (e) => {
        e.preventDefault();
        col.classList.remove('drag-over');
        if (!dragId) return;
        const lead = getLead(dragId);
        const stage = col.dataset.stage;
        if (lead && lead.status !== stage) {
          if (stage === 'Lost') {
            const ok = await confirmDialog({ title: `Mark ${lead.firstName} ${lead.lastName} as Lost?`, message: 'You can restore the lead from the table at any time.', confirmText: 'Mark Lost' });
            if (!ok) { draw(); return; }
          }
          await changeStatus(dragId, stage);
          toast(`${lead.firstName} ${lead.lastName} → ${stage} (updated in pipeline)`);
        }
        dragId = null;
        draw();
      });
    });
  }

  root.querySelector('#testAvaCallBtn')?.addEventListener('click', () => {
    simulateAvaCall();
    draw();
  });
  root.querySelector('#pbCompact').addEventListener('click', () => { view.compact = !view.compact; draw(); });
  root.querySelector('#pbSearch').addEventListener('input', (e) => { view.search = e.target.value; draw(); });
  root.querySelector('#pbSort').addEventListener('change', (e) => { view.sort = e.target.value; draw(); });

  draw();
}

/* ============================================================
   FOLLOW-UP QUEUE
   ============================================================ */
export function renderQueue(root) {
  const s = getState();
  const tasks = s.tasks.filter(t => !t.completed);
  const overdue = tasks.filter(t => isOverdue(t.dueAt)).sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
  const today = tasks.filter(t => !isOverdue(t.dueAt) && isTodayStr(t.dueAt)).sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
  const upcoming = tasks.filter(t => !isOverdue(t.dueAt) && !isTodayStr(t.dueAt)).sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));

  root.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Follow-Up & Dispatch Queue</div>
        <div class="page-subtitle">${overdue.length ? `<span style="color:var(--red);font-weight:600">${overdue.length} overdue</span>` : 'Nothing overdue'} · ${today.length} due today · ${upcoming.length} upcoming</div>
      </div>
      <button class="btn btn-gold" data-action="add-task">+ New Task</button>
    </div>

    ${overdue.length ? queueSection('Overdue', overdue, 'var(--red)', root) : ''}
    ${queueSection('Due Today', today, 'var(--gold-bright)', root)}
    ${queueSection('Upcoming', upcoming, 'var(--blue)', root)}

    ${!tasks.length ? `<div class="card">${emptyState({ icon: '⏰', title: 'No follow-up tasks currently pending', message: 'All scheduled contractor follow-ups and inspections are up to date.' })}</div>` : ''}
  `;

  root.querySelectorAll('[data-complete-task]').forEach(btn =>
    btn.addEventListener('click', () => { completeTask(btn.dataset.completeTask); toast('Task completed'); renderQueue(root); }));
  root.querySelectorAll('[data-snooze-task]').forEach(btn =>
    btn.addEventListener('click', () => { snoozeTask(btn.dataset.snoozeTask, 24); toast('Snoozed 24 hours'); renderQueue(root); }));
  root.querySelectorAll('[data-reassign-task]').forEach(btn =>
    btn.addEventListener('click', () => openReassign(btn.dataset.reassignTask, () => renderQueue(root))));
  root.querySelectorAll('[data-open-lead]').forEach(el =>
    el.addEventListener('click', () => window.LeadFlow.openLead(el.dataset.openLead)));
  root.querySelector('[data-action="add-task"]')?.addEventListener('click', () => openAddTask(() => renderQueue(root)));
}

function queueSection(title, tasks, color, root) {
  if (!tasks.length) return '';
  return `<div class="card" style="margin-bottom:16px">
    <div class="panel-head"><div class="panel-title" style="color:${color}">${title} · ${tasks.length}</div></div>
    <div class="panel-body">
      ${tasks.map(t => {
        const lead = getLead(t.leadId);
        const overdueT = isOverdue(t.dueAt);
        return `<div class="fu-row">
          <span class="badge ${t.priority === 'High' ? 'badge-lost' : t.priority === 'Medium' ? 'badge-contacted' : 'badge-not-connected'}">${esc(t.priority || 'Medium')}</span>
          <div class="fu-main">
            <div class="fu-name" data-open-lead="${t.leadId}">${esc(lead ? `${lead.firstName} ${lead.lastName}` : 'Unknown lead')}</div>
            <div class="fu-meta">${esc(t.title)} · ${esc(t.type || 'Task')} · ${esc(t.assignedOwner || 'Luke Hamilton')}</div>
          </div>
          <div style="text-align:right;min-width:90px">
            <div style="font-size:0.8rem;font-weight:600;${overdueT ? 'color:var(--red)' : ''}">${fmtDate(t.dueAt)}</div>
            <div style="font-size:0.7rem;color:var(--text-dim)">${relTime(t.dueAt)}</div>
          </div>
          <div class="cell-actions">
            <button class="btn btn-success btn-sm" data-complete-task="${t.id}" data-tooltip="Complete">✓</button>
            <button class="btn btn-ghost btn-sm" data-snooze-task="${t.id}" data-tooltip="Snooze 24h">⏱</button>
            <button class="btn btn-ghost btn-sm" data-reassign-task="${t.id}" data-tooltip="Reassign">↔</button>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function isTodayStr(iso) {
  const d = new Date(iso), n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}

function openReassign(taskId, onDone) {
  const s = getState();
  const close = openModal({
    title: 'Reassign Task',
    body: `<div class="form-group"><label class="form-label">Assign to</label><select class="form-select" id="re">${s.settings.team.map(m => `<option>${esc(m.name)}</option>`).join('')}</select></div>`,
    footer: `<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-gold" data-ok>Reassign</button>`,
    onOpen(modal) {
      modal.querySelector('[data-cancel]').addEventListener('click', close);
      modal.querySelector('[data-ok]').addEventListener('click', () => {
        const t = s.tasks.find(x => x.id === taskId);
        if (t) t.assignedOwner = modal.querySelector('#re').value;
        emit();
        close(); toast('Task reassigned'); onDone && onDone();
      });
    }
  });
}

function openAddTask(onDone) {
  const s = getState();
  const leadOpts = s.leads.filter(l => !l.archived).map(l => `<option value="${l.id}">${esc(l.firstName)} ${esc(l.lastName)}</option>`).join('');
  const close = openModal({
    title: 'New Follow-Up Task',
    body: `
      <div class="form-group"><label class="form-label">Lead</label><select class="form-select" name="tLead">${leadOpts}</select></div>
      <div class="form-group"><label class="form-label">Task Description</label><input class="form-input" name="tTitle" placeholder="e.g. Call back regarding roof inspection"/></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Due Date & Time</label><input class="form-input" type="datetime-local" name="tDue"/></div>
        <div class="form-group"><label class="form-label">Priority</label><select class="form-select" name="tPriority"><option>High</option><option selected>Medium</option><option>Low</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Type</label><select class="form-select" name="tType"><option>Call</option><option selected>Message</option><option>Email</option><option>Other</option></select></div>
        <div class="form-group"><label class="form-label">Owner</label><select class="form-select" name="tOwner">${s.settings.team.map(m => `<option>${esc(m.name)}</option>`).join('')}</select></div>
      </div>`,
    footer: `<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-gold" data-ok>Create Task</button>`,
    onOpen(modal) {
      modal.querySelector('[data-cancel]').addEventListener('click', close);
      modal.querySelector('[data-ok]').addEventListener('click', async () => {
        const leadId = modal.querySelector('[name="tLead"]').value;
        const title = modal.querySelector('[name="tTitle"]').value.trim();
        if (!leadId || !title) { toast('Pick a lead and give the task a name', 'error'); return; }
        await addTask({
          leadId, title,
          type: modal.querySelector('[name="tType"]').value,
          dueAt: new Date(modal.querySelector('[name="tDue"]').value || Date.now() + 86400000).toISOString(),
          priority: modal.querySelector('[name="tPriority"]').value,
          assignedOwner: modal.querySelector('[name="tOwner"]').value
        });
        close(); toast('Task created and added to queue'); onDone && onDone();
      });
    }
  });
}
