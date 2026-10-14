/* ============================================================
   VANTORX LEADFLOW — pages/pipeline.js
   Kanban board with drag & drop + Follow-Up Queue.
   ============================================================ */

import { getState, changeStatus, completeTask, snoozeTask, getLead, addTask, emit } from '../store.js';
import { STATUSES, STATUS_COLORS, escapeHTML as esc, relTime, fmtDate, isOverdue } from '../utils.js';
import { openModal, confirmDialog, toast, emptyState } from '../components.js';
import { openFollowUpModal, openNoteModal } from './profile.js';

/* ============================================================
   PIPELINE
   ============================================================ */
export function renderPipeline(root) {
  const s = getState();
  const stages = s.settings.pipeline.stages;
  const view = { compact: false, search: '', sort: 'score' };

  root.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">See every opportunity at a glance.</div>
        <div class="page-subtitle">Drag leads between stages to update their status.</div>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-ghost btn-sm" id="pbCompact">Toggle compact</button>
        <input class="search-input" id="pbSearch" placeholder="Filter leads…" style="min-width:180px"/>
        <select class="select-input" id="pbSort">
          <option value="score">Sort: Score</option>
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
    const s = getState(); // fresh read — status changes re-hydrate the snapshot
    const q = view.search.toLowerCase();
    kanban.innerHTML = stages.map(stage => {
      let leads = s.leads.filter(l => !l.archived && l.status === stage);
      if (q) leads = leads.filter(l => `${l.firstName} ${l.lastName} ${l.serviceInterest} ${l.source}`.toLowerCase().includes(q));
      leads.sort((a, b) => {
        if (view.sort === 'name') return `${a.firstName}`.localeCompare(`${b.firstName}`);
        if (view.sort === 'recent') return new Date(b.lastContactAt || 0) - new Date(a.lastContactAt || 0);
        return b.score - a.score;
      });
      return `<div class="kanban-col" data-stage="${esc(stage)}">
        <div class="kanban-col-head" style="color:${STATUS_COLORS[stage] || 'var(--text)'}">
          <span>${esc(stage)}</span>
          <span class="kanban-col-count">${leads.length}</span>
        </div>
        ${leads.length ? leads.map(l => leadCard(l)).join('') : `<div class="kanban-empty">Drop leads here</div>`}
      </div>`;
    }).join('');
    wire();
  }

  function leadCard(l) {
    const scorePill = l.score != null ? `<span class="score-pill ${l.score >= 70 ? 'score-high' : l.score >= 45 ? 'score-mid' : 'score-low'}">${l.score}</span>` : '';
    if (view.compact) {
      return `<div class="lead-card ${view.compact ? 'compact' : ''}" draggable="true" data-id="${l.id}">
        <div class="lead-card-head"><span class="lead-card-name" data-open-lead="${l.id}">${esc(l.firstName)} ${esc(l.lastName)}</span>
        ${scorePill}</div>
      </div>`;
    }
    return `<div class="lead-card" draggable="true" data-id="${l.id}">
      <div class="lead-card-head">
        <span class="lead-card-name" data-open-lead="${l.id}">${esc(l.firstName)} ${esc(l.lastName)}</span>
        ${scorePill}
      </div>
      <div class="lead-card-meta">
        <span>${esc(l.serviceInterest || '—')}</span>
        <span>${esc(l.source)} · ${l.assignedOwner.split(' ')[0]}</span>
        <span>${l.lastContactAt ? `Touched ${relTime(l.lastContactAt)}` : 'Never contacted'}${l.nextFollowUpAt ? ` · FU ${relTime(l.nextFollowUpAt)}` : ''}</span>
      </div>
      ${l.tags.length ? `<div class="lead-card-tags">${l.tags.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>` : ''}
      ${l.automationActive ? '<div class="lead-card-tags"><span class="badge badge-hot">⚡ auto</span></div>' : ''}
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
          toast(`${lead.firstName} ${lead.lastName} → ${stage} (saved on server)`);
        }
        dragId = null;
        draw();
      });
    });
  }

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
        <div class="page-title">Leads that need attention</div>
        <div class="page-subtitle">${overdue.length ? `<span style="color:var(--red);font-weight:600">${overdue.length} overdue</span>` : 'Nothing overdue'} · ${today.length} due today · ${upcoming.length} upcoming</div>
      </div>
      <button class="btn btn-gold" data-action="add-task">+ New Task</button>
    </div>

    ${overdue.length ? queueSection('Overdue', overdue, 'var(--red)', root) : ''}
    ${queueSection('Due Today', today, 'var(--gold-bright)', root)}
    ${queueSection('Upcoming', upcoming, 'var(--blue)', root)}

    ${!tasks.length ? `<div class="card">${emptyState({ icon: '⏰', title: 'No follow-up tasks yet', message: 'Follow-up scheduling switches on when SMS/email automations go live through VantorX. Until then, work leads directly from the pipeline.' })}</div>` : ''}
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
          <span class="badge ${t.priority === 'High' ? 'badge-lost' : t.priority === 'Medium' ? 'badge-contacted' : 'badge-not-connected'}">${esc(t.priority)}</span>
          <div class="fu-main">
            <div class="fu-name" data-open-lead="${t.leadId}">${esc(lead ? `${lead.firstName} ${lead.lastName}` : 'Unknown lead')}</div>
            <div class="fu-meta">${esc(t.title)} · ${esc(t.type)} · ${esc(t.assignedOwner)}</div>
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
  toast('Follow-up tasks are not on the platform yet — they arrive with automations.', 'info');
  return;
  const s = getState();
  const leadOpts = s.leads.filter(l => !l.archived).map(l => `<option value="${l.id}">${esc(l.firstName)} ${esc(l.lastName)}</option>`).join('');
  const close = openModal({
    title: 'New Task',
    body: `
      <div class="form-group"><label class="form-label">Lead</label><select class="form-select" name="tLead">${leadOpts}</select></div>
      <div class="form-group"><label class="form-label">Task</label><input class="form-input" name="tTitle" placeholder="e.g. Call back about estimate"/></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Due</label><input class="form-input" type="datetime-local" name="tDue"/></div>
        <div class="form-group"><label class="form-label">Priority</label><select class="form-select" name="tPriority"><option>High</option><option selected>Medium</option><option>Low</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Type</label><select class="form-select" name="tType"><option>Call</option><option selected>Message</option><option>Email</option><option>Other</option></select></div>
        <div class="form-group"><label class="form-label">Owner</label><select class="form-select" name="tOwner">${s.settings.team.map(m => `<option>${esc(m.name)}</option>`).join('')}</select></div>
      </div>`,
    footer: `<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-gold" data-ok>Create task</button>`,
    onOpen(modal) {
      modal.querySelector('[data-cancel]').addEventListener('click', close);
      modal.querySelector('[data-ok]').addEventListener('click', () => {
        const leadId = modal.querySelector('[name="tLead"]').value;
        const title = modal.querySelector('[name="tTitle"]').value.trim();
        if (!leadId || !title) { toast('Pick a lead and give the task a name', 'error'); return; }
        addTask({
          leadId, title,
          type: modal.querySelector('[name="tType"]').value,
          dueAt: new Date(modal.querySelector('[name="tDue"]').value || Date.now() + 86400000).toISOString(),
          priority: modal.querySelector('[name="tPriority"]').value,
          assignedOwner: modal.querySelector('[name="tOwner"]').value
        });
        close(); toast('Task created'); onDone && onDone();
      });
    }
  });
}
