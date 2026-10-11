/* ============================================================
   VANTORX LEADFLOW — pages/automations.js
   Sequence builder + message templates with live preview.
   ============================================================ */

import {
  getState, saveAutomation, deleteAutomation, toggleAutomation,
  saveTemplate, deleteTemplate, getLead
} from '../store.js';
import {
  escapeHTML as esc, relTime, renderTemplate, uid, fmtDate
} from '../utils.js';
import { openModal, confirmDialog, toast, emptyState, field, readForm } from '../components.js';

/* ============================================================
   AUTOMATIONS
   ============================================================ */
export function renderAutomations(root) {
  const s = getState();

  root.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Follow up automatically. Convert more consistently.</div>
        <div class="page-subtitle">Sequences run until the lead replies, books, opts out, or is marked lost.</div>
      </div>
      <button class="btn btn-gold" data-action="new-auto">+ New Sequence</button>
    </div>
    <div id="autoList"></div>
  `;
  const list = root.querySelector('#autoList');

  function draw() {
    const st = getState();
    if (!st.automations.length) {
      list.innerHTML = `<div class="card">${emptyState({
        icon: '⚙️', title: 'No sequences yet',
        message: 'Create your first follow-up sequence and start converting more leads automatically.',
        actionHTML: '<button class="btn btn-gold" data-new-auto>+ New Sequence</button>'
      })}</div>`;
      list.querySelector('[data-new-auto]').addEventListener('click', () => openEditor(null, draw));
      return;
    }
    list.innerHTML = st.automations.map(a => {
      const enrolled = st.leads.filter(l => l.automationId === a.id).length;
      const conversions = st.leads.filter(l => l.automationId === a.id && l.status === 'Booked').length;
      return `<div class="card" style="margin-bottom:14px">
        <div class="auto-card">
          <div class="auto-info">
            <div class="auto-name">${esc(a.name)} ${a.active ? '<span class="automation-status-pill" style="margin-left:8px"><span class="pulse-dot"></span><span class="pill-text">ACTIVE</span></span>' : '<span class="badge badge-paused" style="margin-left:8px">PAUSED</span>'}</div>
            <div class="auto-meta">
              <span>Trigger: <span class="trigger-select">${esc(a.trigger)}</span></span>
              <span>${enrolled} lead${enrolled === 1 ? '' : 's'} enrolled</span>
              <span>${conversions} booked</span>
              <span>Edited ${relTime(a.updatedAt)}</span>
              <span>Stops on: ${a.stopConditions.join(', ')}</span>
            </div>
          </div>
          <div class="cell-actions">
            <button class="btn btn-ghost btn-sm" data-toggle-auto="${a.id}">${a.active ? '⏸ Pause' : '▶ Enable'}</button>
            <button class="btn btn-ghost btn-sm" data-edit-auto="${a.id}">✎ Edit</button>
            <button class="btn btn-danger btn-sm" data-del-auto="${a.id}">🗑</button>
          </div>
        </div>
        <div class="auto-steps-visual">
          ${a.steps.map((st2, i) => stepRow(st2, i, a)).join('')}
        </div>
      </div>`;
    }).join('');

    list.querySelectorAll('[data-toggle-auto]').forEach(b => b.addEventListener('click', () => {
      toggleAutomation(b.dataset.toggleAuto); toast('Sequence updated'); draw();
    }));
    list.querySelectorAll('[data-edit-auto]').forEach(b => b.addEventListener('click', () => openEditor(b.dataset.editAuto, draw)));
    list.querySelectorAll('[data-del-auto]').forEach(b => b.addEventListener('click', async () => {
      const ok = await confirmDialog({ title: 'Delete this sequence?', message: 'Leads enrolled in it will stop receiving automated messages. This cannot be undone.', confirmText: 'Delete', danger: true });
      if (!ok) return;
      deleteAutomation(b.dataset.delAuto); toast('Sequence deleted', 'info'); draw();
    }));
  }

  function stepRow(st, i, auto) {
    const delayTxt = st.delayMinutes === 0 ? 'Immediately' : st.delayMinutes < 1440
      ? `Wait ${st.delayMinutes / 60}h` : `Wait ${st.delayMinutes / 1440} day${st.delayMinutes / 1440 > 1 ? 's' : ''}`;
    const icon = { 'Send SMS': '💬', 'Send Email': '📧', 'Wait': '⏱', 'Create task': '📝', 'Change status': '🔀', 'Notify owner': '🔔', 'Stop sequence': '⏹' }[st.type] || '•';
    return `<div class="auto-step-row ${st.enabled ? '' : 'disabled'}">
      <span class="auto-step-num">${i + 1}</span>
      <span>${icon}</span>
      <span class="auto-step-type">${esc(st.type)}</span>
      <span class="auto-step-detail">${esc(delayTxt)}${st.message ? ` — “${esc(st.message.slice(0, 80))}${st.message.length > 80 ? '…' : ''}”` : ''}</span>
      <div class="cell-actions">
        <button class="row-actions-btn" data-preview-step="${st.id}" data-tooltip="Preview">👁</button>
        <button class="row-actions-btn" data-toggle-step="${st.id}" data-tooltip="${st.enabled ? 'Disable' : 'Enable'} step">${st.enabled ? '✓' : '○'}</button>
      </div>
    </div>`;
  }

  /* step preview uses closure over current list */
  list.addEventListener('click', (e) => {
    const pv = e.target.closest('[data-preview-step]');
    if (!pv) return;
    const auto = getState().automations.find(a => a.steps.some(st => st.id === pv.dataset.previewStep));
    const st = auto?.steps.find(x => x.id === pv.dataset.previewStep);
    if (!st) return;
    const sampleLead = getState().leads.find(l => !l.archived) || { firstName: 'there', lastName: '', serviceInterest: 'your service' };
    const rendered = renderTemplate(st.message, sampleLead, { businessName: getState().settings.business.name });
    openModal({
      title: 'Step Preview (sample lead)',
      body: `<div class="msg-preview ${st.type === 'Send Email' ? '' : 'sms'}">${esc(rendered)}</div>
        <div class="form-hint" style="margin-top:8px">Rendered with sample lead “${esc(sampleLead.firstName)}” in demo mode.</div>`,
      footer: `<button class="btn btn-ghost" data-cancel>Close</button>`,
      onOpen(modal) { modal.querySelector('[data-cancel]').addEventListener('click', modal.querySelector('.modal-close').onclick); }
    });
  });

  root.querySelector('[data-action="new-auto"]').addEventListener('click', () => openEditor(null, draw));
  draw();
}

/* ---------- sequence editor ---------- */
function openEditor(autoId, onDone) {
  const s = getState();
  const auto = autoId ? JSON.parse(JSON.stringify(s.automations.find(a => a.id === autoId))) : {
    name: '', trigger: 'New lead', active: true,
    stopConditions: ['Lead replies', 'Lead books', 'Lead opts out', 'Lead marked lost'],
    steps: [{ id: uid('st'), type: 'Send SMS', delayMinutes: 0, templateId: null, message: '', enabled: true }]
  };
  const TRIGGERS = ['New lead', 'Website lead', 'Missed call', 'No response', 'Appointment requested', 'Appointment missed', 'Manual enrollment'];
  const STEP_TYPES = ['Send SMS', 'Send Email', 'Wait', 'Create task', 'Change status', 'Notify owner', 'Stop sequence'];

  const close = openModal({
    title: autoId ? 'Edit Sequence' : 'New Sequence',
    wide: true,
    body: `
      <div class="form-row">
        ${field({ label: 'Sequence name', name: 'aName', value: auto.name, required: true })}
        ${field({ label: 'Trigger', name: 'aTrigger', type: 'select', options: TRIGGERS, value: auto.trigger })}
      </div>
      <div class="form-group">
        <label class="form-label">Stop conditions</label>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          ${['Lead replies', 'Lead books', 'Lead opts out', 'Lead marked lost'].map(c =>
            `<label class="chip" style="cursor:pointer;padding:7px 14px"><input type="checkbox" name="aStop" value="${c}" ${auto.stopConditions.includes(c) ? 'checked' : ''} style="accent-color:var(--gold)"/> ${c}</label>`).join('')}
        </div>
      </div>
      <div class="form-label" style="margin:14px 0 8px">Steps</div>
      <div id="stepEditor"></div>
      <button class="btn btn-ghost btn-sm" id="addStep">+ Add step</button>`,
    footer: `<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-gold" data-save>Save sequence</button>`,
    onOpen(modal) {
      modal.querySelector('[data-cancel]').addEventListener('click', close);
      const stepEditor = modal.querySelector('#stepEditor');

      function drawSteps() {
        stepEditor.innerHTML = auto.steps.map((st, i) => `
          <div class="auto-step-row" data-step="${st.id}">
            <div class="step-up-down">
              <button data-up="${st.id}" ${i === 0 ? 'disabled' : ''}>▲</button>
              <button data-down="${st.id}" ${i === auto.steps.length - 1 ? 'disabled' : ''}>▼</button>
            </div>
            <span class="auto-step-num">${i + 1}</span>
            <select class="select-input" data-sf="type" style="width:130px">${STEP_TYPES.map(t => `<option ${st.type === t ? 'selected' : ''}>${t}</option>`).join('')}</select>
            <div style="display:flex;align-items:center;gap:6px">
              <input class="form-input" type="number" data-sf="delayVal" value="${st.delayMinutes === 0 ? 0 : st.delayMinutes >= 1440 ? st.delayMinutes / 1440 : st.delayMinutes / 60}" min="0" style="width:64px;padding:6px 8px"/>
              <select class="select-input" data-sf="delayUnit" style="width:80px">
                <option value="60" ${st.delayMinutes > 0 && st.delayMinutes < 1440 ? 'selected' : ''}>hours</option>
                <option value="1440" ${st.delayMinutes >= 1440 ? 'selected' : ''}>days</option>
                <option value="1" ${st.delayMinutes === 0 ? 'selected' : ''}>min</option>
              </select>
            </div>
            <input class="form-input" data-sf="message" value="${esc(st.message || '')}" placeholder="Message / instruction (use {{first_name}}, {{service}}…)" style="flex:1;min-width:160px"/>
            <div class="cell-actions">
              <button class="row-actions-btn" data-eye="${st.id}" data-tooltip="Preview">👁</button>
              <label class="switch" style="transform:scale(0.85)"><input type="checkbox" data-sf="enabled" ${st.enabled ? 'checked' : ''}/><span class="track"></span></label>
              <button class="row-actions-btn" data-del-step="${st.id}" data-tooltip="Remove step">🗑</button>
            </div>
          </div>`).join('');

        stepEditor.querySelectorAll('[data-sf]').forEach(el => {
          el.addEventListener('change', () => {
            stepEditor.querySelectorAll('[data-step]').forEach(row => {
              const stId = row.dataset.step;
              const target = auto.steps.find(x => x.id === stId);
              if (!target) return;
              const unit = Number(row.querySelector('[data-sf="delayUnit"]').value) || 60;
              const val = Number(row.querySelector('[data-sf="delayVal"]').value) || 0;
              target.type = row.querySelector('[data-sf="type"]').value;
              target.delayMinutes = unit === 1 ? 0 : val * unit;
              target.message = row.querySelector('[data-sf="message"]').value;
              target.enabled = row.querySelector('[data-sf="enabled"]').checked;
            });
          });
          if (el.dataset.sf === 'message') el.addEventListener('input', () => {
            const row = el.closest('[data-step]');
            const target = auto.steps.find(x => x.id === row.dataset.step);
            if (target) target.message = el.value;
          });
        });
        stepEditor.querySelectorAll('[data-up]').forEach(b => b.addEventListener('click', () => {
          const i = auto.steps.findIndex(x => x.id === b.dataset.up);
          if (i > 0) { [auto.steps[i - 1], auto.steps[i]] = [auto.steps[i], auto.steps[i - 1]]; drawSteps(); }
        }));
        stepEditor.querySelectorAll('[data-down]').forEach(b => b.addEventListener('click', () => {
          const i = auto.steps.findIndex(x => x.id === b.dataset.down);
          if (i < auto.steps.length - 1) { [auto.steps[i + 1], auto.steps[i]] = [auto.steps[i], auto.steps[i + 1]]; drawSteps(); }
        }));
        stepEditor.querySelectorAll('[data-del-step]').forEach(b => b.addEventListener('click', () => {
          auto.steps = auto.steps.filter(x => x.id !== b.dataset.delStep); drawSteps();
        }));
        stepEditor.querySelectorAll('[data-eye]').forEach(b => b.addEventListener('click', () => {
          const st = auto.steps.find(x => x.id === b.dataset.eye);
          const sampleLead = { firstName: 'there', lastName: '', serviceInterest: 'your service' };
          const rendered = renderTemplate(st.message || '(no message yet)', sampleLead, { businessName: getState().settings.business.name });
          toast(rendered.slice(0, 90) + (rendered.length > 90 ? '…' : ''), 'info');
        }));
      }
      drawSteps();

      modal.querySelector('#addStep').addEventListener('click', () => {
        auto.steps.push({ id: uid('st'), type: 'Wait', delayMinutes: 1440, templateId: null, message: '', enabled: true });
        drawSteps();
      });

      modal.querySelector('[data-save]').addEventListener('click', () => {
        const name = modal.querySelector('[name="aName"]').value.trim();
        if (!name) { toast('Give the sequence a name', 'error'); return; }
        auto.name = name;
        auto.trigger = modal.querySelector('[name="aTrigger"]').value;
        auto.stopConditions = [...modal.querySelectorAll('[name="aStop"]:checked')].map(c => c.value);
        saveAutomation(auto);
        close(); toast('Sequence saved'); onDone && onDone();
      });
    }
  });
}

/* ============================================================
   TEMPLATES
   ============================================================ */
export function renderTemplates(root) {
  const s = getState();
  let tab = 'SMS';

  root.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Message Templates</div>
        <div class="page-subtitle">Reusable SMS and email messages with variables like <span class="tpl-var">{{first_name}}</span>.</div>
      </div>
      <button class="btn btn-gold" data-action="new-tpl">+ New Template</button>
    </div>
    <div class="chart-toggle" style="margin-bottom:16px" id="tplTabs">
      <button data-tab="SMS" class="active">SMS</button>
      <button data-tab="Email">Email</button>
    </div>
    <div id="tplList"></div>`;

  const list = root.querySelector('#tplList');

  function draw() {
    const st = getState();
    const tpls = st.templates.filter(t => t.channel === tab);
    if (!tpls.length) {
      list.innerHTML = `<div class="card">${emptyState({ icon: '📝', title: `No ${tab} templates yet`, message: 'Create a reusable template so follow-ups stay consistent.' })}</div>`;
      return;
    }
    list.innerHTML = `<div class="tpl-grid">${tpls.map(t => `
      <div class="card card-hover tpl-card">
        <div class="tpl-head">
          <span class="tpl-name">${esc(t.name)}</span>
          <span class="badge ${t.active ? 'badge-connected' : 'badge-not-connected'}">${t.active ? 'Active' : 'Off'}</span>
        </div>
        <span class="chip" style="align-self:flex-start">${esc(t.category)}</span>
        <div class="tpl-body">${esc(t.body)}</div>
        <div class="cell-actions" style="margin-top:auto;padding-top:8px">
          <button class="btn btn-ghost btn-sm" data-view-tpl="${t.id}">Preview</button>
          <button class="btn btn-ghost btn-sm" data-edit-tpl="${t.id}">✎ Edit</button>
          <button class="btn btn-danger btn-sm" data-del-tpl="${t.id}">🗑</button>
        </div>
      </div>`).join('')}</div>`;

    list.querySelectorAll('[data-view-tpl]').forEach(b => b.addEventListener('click', () => {
      const t = getState().templates.find(x => x.id === b.dataset.viewTpl);
      const sampleLead = getState().leads.find(l => !l.archived) || { firstName: 'there' };
      const rendered = renderTemplate(t.body, sampleLead, { businessName: getState().settings.business.name, ownerName: getState().settings.ownerName });
      openModal({
        title: t.name,
        body: `${t.subject ? `<div class="form-hint" style="margin-bottom:10px">Subject: ${esc(renderTemplate(t.subject, sampleLead, { businessName: getState().settings.business.name }))}</div>` : ''}
          <div class="msg-preview ${t.channel === 'SMS' ? 'sms' : ''}">${esc(rendered)}</div>
          <div class="form-hint" style="margin-top:8px">Previewed with sample lead data.</div>`,
        footer: `<button class="btn btn-ghost" data-cancel>Close</button>`,
        onOpen(modal) { modal.querySelector('[data-cancel]').addEventListener('click', modal.querySelector('.modal-close').onclick); }
      });
    }));
    list.querySelectorAll('[data-edit-tpl]').forEach(b => b.addEventListener('click', () => openTplEditor(b.dataset.editTpl, draw)));
    list.querySelectorAll('[data-del-tpl]').forEach(b => b.addEventListener('click', async () => {
      const ok = await confirmDialog({ title: 'Delete template?', message: 'Sequences using this template will keep their written messages, but this template will be gone.', confirmText: 'Delete', danger: true });
      if (!ok) return;
      deleteTemplate(b.dataset.delTpl); toast('Template deleted', 'info'); draw();
    }));
  }

  root.querySelector('#tplTabs').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    root.querySelectorAll('#tplTabs button').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); tab = b.dataset.tab; draw();
  });
  root.querySelector('[data-action="new-tpl"]').addEventListener('click', () => openTplEditor(null, draw));
  draw();
}

function openTplEditor(tplId, onDone) {
  const t = tplId ? { ...getState().templates.find(x => x.id === tplId) } : { name: '', channel: 'SMS', category: 'Custom', subject: '', body: '', active: true };
  const cats = ['First contact', 'No response', 'Follow-up', 'Booking', 'Re-engagement', 'Missed call', 'Reminder', 'Final follow-up', 'Custom'];
  const close = openModal({
    title: tplId ? 'Edit Template' : 'New Template',
    wide: true,
    body: `
      <div class="form-row">
        ${field({ label: 'Name', name: 'tplName', value: t.name, required: true })}
        ${field({ label: 'Category', name: 'tplCategory', type: 'select', options: cats, value: t.category })}
      </div>
      ${field({ label: 'Subject (email only)', name: 'tplSubject', value: t.subject, full: true })}
      ${field({ label: 'Body', name: 'tplBody', type: 'textarea', value: t.body, full: true, hint: 'Variables: {{first_name}} {{last_name}} {{business_name}} {{service}} {{appointment_time}} {{owner_name}}' })}
      <div class="form-label" style="margin:6px 0 8px">Live preview</div>
      <div class="msg-preview" id="tplLive"></div>`,
    footer: `<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-gold" data-save>Save template</button>`,
    onOpen(modal) {
      modal.querySelector('[data-cancel]').addEventListener('click', close);
      const bodyEl = modal.querySelector('[name="tplBody"]');
      const subjEl = modal.querySelector('[name="tplSubject"]');
      const live = modal.querySelector('#tplLive');
      const sampleLead = getState().leads.find(l => !l.archived) || { firstName: 'there' };
      const update = () => {
        const rendered = renderTemplate(bodyEl.value, sampleLead, { businessName: getState().settings.business.name, ownerName: getState().settings.ownerName });
        live.textContent = subjEl.value ? `Subject: ${renderTemplate(subjEl.value, sampleLead, {})}\n\n${rendered}` : rendered;
      };
      bodyEl.addEventListener('input', update);
      subjEl.addEventListener('input', update);
      update();
      modal.querySelector('[data-save]').addEventListener('click', () => {
        const name = modal.querySelector('[name="tplName"]').value.trim();
        if (!name) { toast('Name your template', 'error'); return; }
        saveTemplate({ ...t, name, category: modal.querySelector('[name="tplCategory"]').value, subject: subjEl.value, body: bodyEl.value });
        close(); toast('Template saved'); onDone && onDone();
      });
    }
  });
}
