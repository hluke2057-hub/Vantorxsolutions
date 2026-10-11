/* ============================================================
   VANTORX LEADFLOW — pages/leads.js
   CRM table + search + filters + sort + bulk + add/edit + CSV.
   ============================================================ */

import {
  getState, getLead, addLead, updateLead, changeStatus, archiveLead,
  deleteLead, duplicateLead, toggleLeadSelected, clearSelection,
  addNote, scheduleFollowUp
} from '../store.js';
import {
  STATUSES, SOURCES, fmtDate, fmtMoney, escapeHTML as esc, debounce,
  toCSV, downloadFile, parseCSV, statusBadge, uid, daysFromNowISO
} from '../utils.js';
import { openModal, confirmDialog, toast, emptyState, field, readForm } from '../components.js';
import { bulkUpdate, archiveLead, deleteLead, changeStatus, updateLead } from '../store.js';
import { leadImportService } from '../services.js';

const filterState = { search: '', status: '', source: '', owner: '', due: '', booked: '', sort: 'newest' };

export function renderLeads(root) {
  root.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Leads</div>
        <div class="page-subtitle">Every lead in one place — search, filter, and act.</div>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-ghost" data-action="import-csv">⬆ Import CSV</button>
        <button class="btn btn-ghost" data-action="export-csv">⬇ Export</button>
        <button class="btn btn-gold" data-action="add-lead">+ Add Lead</button>
      </div>
    </div>

    <div class="filter-bar">
      <input class="search-input" id="leadSearch" placeholder="Search name, phone, email, company, notes…" value="${esc(filterState.search)}"/>
      <select class="select-input" id="fStatus">
        <option value="">All statuses</option>
        ${STATUSES.map(st => `<option ${filterState.status === st ? 'selected' : ''}>${st}</option>`).join('')}
      </select>
      <select class="select-input" id="fSource">
        <option value="">All sources</option>
        ${SOURCES.map(sr => `<option ${filterState.source === sr ? 'selected' : ''}>${sr}</option>`).join('')}
      </select>
      <select class="select-input" id="fOwner">
        <option value="">All owners</option>
        ${ownerOptions()}
      </select>
      <select class="select-input" id="fBooked">
        <option value="">Replied or not</option>
        <option value="replied" ${filterState.booked === 'replied' ? 'selected' : ''}>Replied</option>
        <option value="noreply" ${filterState.booked === 'noreply' ? 'selected' : ''}>No reply</option>
      </select>
      <select class="select-input" id="fSort">
        <option value="newest" ${filterState.sort === 'newest' ? 'selected' : ''}>Newest</option>
        <option value="oldest" ${filterState.sort === 'oldest' ? 'selected' : ''}>Oldest</option>
        <option value="name" ${filterState.sort === 'name' ? 'selected' : ''}>Name</option>
        <option value="score" ${filterState.sort === 'score' ? 'selected' : ''}>Score</option>
        <option value="lastContact" ${filterState.sort === 'lastContact' ? 'selected' : ''}>Last contact</option>
        <option value="nextFollowUp" ${filterState.sort === 'nextFollowUp' ? 'selected' : ''}>Next follow-up</option>
      </select>
      <span class="result-count" id="leadCount"></span>
    </div>

    <div id="bulkBar"></div>
    <div class="card table-wrap"><div id="leadTable"></div></div>
  `;

  const rerenderTable = () => renderTable(root);
  root.querySelector('#leadSearch').addEventListener('input', debounce((e) => { filterState.search = e.target.value; rerenderTable(); }, 200));
  root.querySelector('#fStatus').addEventListener('change', e => { filterState.status = e.target.value; rerenderTable(); });
  root.querySelector('#fSource').addEventListener('change', e => { filterState.source = e.target.value; rerenderTable(); });
  root.querySelector('#fOwner').addEventListener('change', e => { filterState.owner = e.target.value; rerenderTable(); });
  root.querySelector('#fBooked').addEventListener('change', e => { filterState.booked = e.target.value; rerenderTable(); });
  root.querySelector('#fSort').addEventListener('change', e => { filterState.sort = e.target.value; rerenderTable(); });

  root.querySelector('[data-action="add-lead"]').addEventListener('click', () => openLeadForm(null, rerenderTable));
  root.querySelector('[data-action="export-csv"]').addEventListener('click', exportCSV);
  root.querySelector('[data-action="import-csv"]').addEventListener('click', openImport);

  renderTable(root);
}

function ownerOptions() {
  return getState().settings.team.map(m => `<option ${filterState.owner === m.name ? 'selected' : ''}>${esc(m.name)}</option>`).join('');
}

function filteredLeads() {
  const s = getState();
  let leads = s.leads.filter(l => !l.archived);
  const q = filterState.search.toLowerCase();
  if (q) {
    leads = leads.filter(l =>
      `${l.firstName} ${l.lastName}`.toLowerCase().includes(q) ||
      (l.phone || '').toLowerCase().includes(q) ||
      (l.email || '').toLowerCase().includes(q) ||
      (l.company || '').toLowerCase().includes(q) ||
      (l.source || '').toLowerCase().includes(q) ||
      (l.notes || []).some(n => n.text.toLowerCase().includes(q))
    );
  }
  if (filterState.status) leads = leads.filter(l => l.status === filterState.status);
  if (filterState.source) leads = leads.filter(l => l.source === filterState.source);
  if (filterState.owner) leads = leads.filter(l => l.assignedOwner === filterState.owner);
  if (filterState.booked === 'replied') leads = leads.filter(l => ['Responded', 'Booked'].includes(l.status));
  if (filterState.booked === 'noreply') leads = leads.filter(l => !['Responded', 'Booked'].includes(l.status));

  const sorters = {
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    name: (a, b) => `${a.firstName}${a.lastName}`.localeCompare(`${b.firstName}${b.lastName}`),
    score: (a, b) => b.score - a.score,
    lastContact: (a, b) => new Date(b.lastContactAt || 0) - new Date(a.lastContactAt || 0),
    nextFollowUp: (a, b) => new Date(a.nextFollowUpAt || 8e15) - new Date(b.nextFollowUpAt || 8e15)
  };
  return leads.sort(sorters[filterState.sort] || sorters.newest);
}

function renderTable(root) {
  const s = getState();
  const tableEl = root.querySelector('#leadTable');
  const countEl = root.querySelector('#leadCount');
  const bulkEl = root.querySelector('#bulkBar');
  const leads = filteredLeads();
  countEl.textContent = `${leads.length} lead${leads.length === 1 ? '' : 's'}`;

  if (!leads.length) {
    tableEl.innerHTML = emptyState({
      icon: '🔍',
      title: 'No leads match',
      message: 'Try clearing filters, or add your first lead to get started.',
      actionHTML: '<button class="btn btn-gold" data-action="add-lead-empty">+ Add Lead</button>'
    });
    tableEl.querySelector('[data-action="add-lead-empty"]')?.addEventListener('click', () => openLeadForm(null, () => renderTable(root)));
    bulkEl.innerHTML = '';
    return;
  }

  const selected = new Set(s.selectedLeadIds);
  tableEl.innerHTML = `
    <table>
      <thead><tr>
        <th style="width:34px"><input type="checkbox" class="checkbox" id="checkAll" ${selected.size && selected.size === leads.length ? 'checked' : ''}/></th>
        <th>Name</th><th>Phone</th><th>Source</th><th>Service</th><th>Status</th>
        <th>Score</th><th>Last contact</th><th>Next follow-up</th><th>Owner</th><th>Created</th><th></th>
      </tr></thead>
      <tbody>
        ${leads.map(l => {
          const isSel = selected.has(l.id);
          const due = l.nextFollowUpAt && new Date(l.nextFollowUpAt) < new Date();
          return `<tr class="${isSel ? 'selected' : ''}" data-lead-row="${l.id}">
            <td><input type="checkbox" class="checkbox row-check" data-id="${l.id}" ${isSel ? 'checked' : ''}/></td>
            <td><div class="lead-name" data-open-lead="${l.id}">${esc(l.firstName)} ${esc(l.lastName)}</div><div class="lead-sub">${esc(l.email || l.phone || '')}</div></td>
            <td class="cell-dim">${esc(l.phone || '—')}</td>
            <td class="cell-dim">${esc(l.source)}</td>
            <td class="cell-dim">${esc(l.serviceInterest || '—')}</td>
            <td>${statusBadge(l.status)}</td>
            <td>${l.score != null ? `<span class="score-pill ${l.score >= 70 ? 'score-high' : l.score >= 45 ? 'score-mid' : 'score-low'}">${l.score}</span>` : '<span class="cell-dim">—</span>'}</td>
            <td class="cell-dim">${l.lastContactAt ? fmtDate(l.lastContactAt) : '—'}</td>
            <td class="cell-dim" ${due ? 'style="color:var(--red)"' : ''}>${l.nextFollowUpAt ? fmtDate(l.nextFollowUpAt) : '—'}</td>
            <td class="cell-dim">${esc(l.assignedOwner)}</td>
            <td class="cell-dim">${fmtDate(l.createdAt)}</td>
            <td><div class="cell-actions">
              <button class="row-actions-btn" data-open-lead="${l.id}" title="Open profile">↗</button>
              <button class="row-actions-btn" data-edit-lead="${l.id}" title="Edit">✎</button>
              <button class="row-actions-btn" data-sms-lead="${l.id}" title="Generate message">✦</button>
            </div></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;

  /* bulk bar */
  bulkEl.innerHTML = selected.size ? `
    <div class="bulk-bar">
      <strong>${selected.size} selected</strong>
      <select class="select-input" id="bulkStatus">
        <option value="">Change status…</option>${STATUSES.map(st => `<option>${st}</option>`).join('')}
      </select>
      <select class="select-input" id="bulkOwner">
        <option value="">Assign owner…</option>${s.settings.team.map(m => `<option>${esc(m.name)}</option>`).join('')}
      </select>
      <button class="btn btn-ghost btn-sm" data-bulk="tag">+ Tag</button>
      <button class="btn btn-ghost btn-sm" data-bulk="followup">⏰ Schedule follow-up</button>
      <button class="btn btn-ghost btn-sm" data-bulk="start-auto">▶ Start automation</button>
      <button class="btn btn-ghost btn-sm" data-bulk="stop-auto">⏸ Stop automation</button>
      <button class="btn btn-ghost btn-sm" data-bulk="archive">📦 Archive</button>
      <button class="btn btn-danger btn-sm" data-bulk="delete">🗑 Delete</button>
      <button class="btn btn-ghost btn-sm" data-bulk="clear">Clear</button>
    </div>` : '';

  /* ---- wiring ---- */
  tableEl.querySelector('#checkAll').addEventListener('change', (e) => {
    const ids = leads.map(l => l.id);
    ids.forEach(id => toggleLeadSelected(id, e.target.checked));
    renderTable(root);
  });
  tableEl.querySelectorAll('.row-check').forEach(cb => {
    cb.addEventListener('change', (e) => {
      e.stopPropagation();
      toggleLeadSelected(cb.dataset.id, cb.checked);
      renderTable(root);
    });
  });
  tableEl.querySelectorAll('[data-open-lead]').forEach(el =>
    el.addEventListener('click', (e) => { e.stopPropagation(); window.LeadFlow.openLead(el.dataset.openLead); }));
  tableEl.querySelectorAll('[data-edit-lead]').forEach(el =>
    el.addEventListener('click', (e) => { e.stopPropagation(); openLeadForm(el.dataset.editLead, () => renderTable(root)); }));
  tableEl.querySelectorAll('[data-sms-lead]').forEach(el =>
    el.addEventListener('click', (e) => { e.stopPropagation(); window.LeadFlow.openAIAssistant(el.dataset.smsLead); }));

  bulkEl.querySelectorAll('[data-bulk]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const ids = [...selected];
      const action = btn.dataset.bulk;
      const { bulkChangeStatus, bulkAssign, bulkTag, bulkFollowUp, bulkAutomation, bulkArchive, bulkDelete } = bulkHelpers();
      if (action === 'status') return;
      if (action === 'tag') return bulkTag(ids, () => renderTable(root));
      if (action === 'followup') return bulkFollowUp(ids, () => renderTable(root));
      if (action === 'start-auto') return bulkAutomation(ids, true, () => renderTable(root));
      if (action === 'stop-auto') return bulkAutomation(ids, false, () => renderTable(root));
      if (action === 'archive') return bulkArchive(ids, () => { clearSelectionLocal(); renderTable(root); });
      if (action === 'delete') return bulkDelete(ids, () => { clearSelectionLocal(); renderTable(root); });
    });
  });
  const bulkStatus = bulkEl.querySelector('#bulkStatus');
  const bulkOwner = bulkEl.querySelector('#bulkOwner');
  if (bulkStatus) bulkStatus.addEventListener('change', async (e) => {
    if (!e.target.value) return;
    const { bulkChangeStatus } = bulkHelpers();
    await bulkChangeStatus([...selected], e.target.value);
    clearSelectionLocal(); renderTable(root);
  });
  if (bulkOwner) bulkOwner.addEventListener('change', async (e) => {
    if (!e.target.value) return;
    const { bulkAssign } = bulkHelpers();
    await bulkAssign([...selected], e.target.value);
    clearSelectionLocal(); renderTable(root);
  });

  function clearSelectionLocal() { clearSelection(); }
}

/* ---------- bulk helpers ---------- */
function bulkHelpers() {
  return {
    async bulkChangeStatus(ids, status) {
      for (const id of ids) await changeStatus(id, status);
      toast(`${ids.length} lead${ids.length > 1 ? 's' : ''} → ${status} (saved on server)`);
    },
    async bulkAssign(ids, owner) {
      bulkUpdate(ids, { assignedOwner: owner });
    },
    async bulkTag(ids, rerender) {
      toast('Tags are not tracked on the platform yet.', 'info');
    },
    async bulkFollowUp(ids, rerender) {
      const close = openModal({
        title: 'Schedule follow-up',
        body: `<div class="form-group"><label class="form-label">Date & time</label><input class="form-input" id="bulkFU" type="datetime-local" value="${toLocalInputValue(daysFromNowISO(1))}"/></div>`,
        footer: `<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-gold" data-ok>Schedule</button>`,
        onOpen(modal) {
          modal.querySelector('[data-cancel]').addEventListener('click', close);
          modal.querySelector('[data-ok]').addEventListener('click', () => {
            const v = modal.querySelector('#bulkFU').value;
            if (!v) return;
            ids.forEach(id => scheduleFollowUp(id, new Date(v).toISOString()));
            close(); toast(`Follow-up scheduled for ${ids.length} leads`); rerender();
          });
        }
      });
    },
    async bulkAutomation(ids, start, rerender) {
      const autos = getState().automations;
      if (!autos.length) { toast('No automations yet — create one first', 'error'); return; }
      const close = openModal({
        title: start ? 'Start automation' : 'Stop automation',
        body: start
          ? `<div class="form-group"><label class="form-label">Sequence</label><select class="form-select" id="bulkAuto">${autos.map(a => `<option value="${a.id}">${esc(a.name)}</option>`).join('')}</select></div>`
          : `<p style="color:var(--text-soft)">Stop automation for ${ids.length} lead${ids.length > 1 ? 's' : ''}?</p>`,
        footer: `<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-gold" data-ok>${start ? 'Start' : 'Stop'}</button>`,
        onOpen(modal) {
          modal.querySelector('[data-cancel]').addEventListener('click', close);
          modal.querySelector('[data-ok]').addEventListener('click', () => {
            ids.forEach(id => {
              if (start) { const autoId = modal.querySelector('#bulkAuto')?.value || autos[0].id; updateLead(id, { automationId: autoId, automationActive: true }); }
              else updateLead(id, { automationActive: false });
            });
            close(); toast(start ? 'Automation started' : 'Automation stopped'); rerender();
          });
        }
      });
    },
    async bulkArchive(ids, rerender) {
      const r = await archiveLead(ids[0], true);
      toast(r && r.error ? r.error : `${ids.length} lead${ids.length > 1 ? 's' : ''} archived`, r && r.error ? 'info' : undefined);
      rerender();
    },
    async bulkDelete(ids, rerender) {
      const ok = await confirmDialog({ title: `Delete ${ids.length} lead${ids.length > 1 ? 's' : ''}?`, message: 'This permanently removes the leads and their activity from the platform server. This cannot be undone.', confirmText: 'Delete forever', danger: true });
      if (!ok) return;
      for (const id of ids) await deleteLead(id);
      toast(`${ids.length} lead${ids.length > 1 ? 's' : ''} deleted from the server`, 'info'); rerender();
    }
  };
}

/* ---------- add / edit lead ---------- */
export function openLeadForm(leadId, onSaved) {
  const s = getState();
  const lead = leadId ? getLead(leadId) : null;
  const sources = [...new Set([...SOURCES, ...s.leads.map(l => l.source)])];
  const body = `
    <div class="form-row">
      ${field({ label: 'First name', name: 'firstName', value: lead?.firstName || '', required: true })}
      ${field({ label: 'Last name', name: 'lastName', value: lead?.lastName || '', required: true })}
    </div>
    <div class="form-row">
      ${field({ label: 'Phone', name: 'phone', type: 'tel', value: lead?.phone || '', placeholder: '(813) 555-0100' })}
      ${field({ label: 'Email', name: 'email', type: 'email', value: lead?.email || '', placeholder: 'name@example.com' })}
    </div>
    <div class="form-row">
      ${field({ label: 'Company', name: 'company', value: lead?.company || '' })}
      ${field({ label: 'Lead source', name: 'source', type: 'select', options: sources, value: lead?.source || 'Manual' })}
    </div>
    <div class="form-row">
      ${field({ label: 'Service interest', name: 'serviceInterest', value: lead?.serviceInterest || '', placeholder: 'e.g. Haircut + Beard' })}
      ${field({ label: 'Estimated value ($)', name: 'estimatedValue', type: 'number', value: lead?.estimatedValue ?? '' })}
    </div>
    <div class="form-row">
      ${field({ label: 'Status', name: 'status', type: 'select', options: STATUSES, value: lead?.status || 'New' })}
      ${field({ label: 'Preferred channel', name: 'preferredChannel', type: 'select', options: ['SMS', 'Email'], value: lead?.preferredChannel || 'SMS' })}
    </div>
    <div class="form-row">
      ${field({ label: 'Assigned owner', name: 'assignedOwner', type: 'select', options: s.settings.team.map(m => m.name), value: lead?.assignedOwner || s.settings.leadSettings.defaultOwner })}
      ${field({ label: 'Tags (comma separated)', name: 'tags', value: (lead?.tags || []).join(', '), placeholder: 'vip, high-value' })}
    </div>
    ${field({ label: 'Notes', name: 'notes', type: 'textarea', value: '', placeholder: lead ? 'Add a note (appended to existing notes)…' : 'Anything worth remembering…', full: true })}
  `;

  const close = openModal({
    title: lead ? `Edit ${lead.firstName} ${lead.lastName}` : 'Add Lead',
    wide: true,
    body,
    footer: `${lead ? `<button class="btn btn-danger" data-del style="margin-right:auto">Delete</button>` : ''}
      <button class="btn btn-ghost" data-cancel>Cancel</button>
      <button class="btn btn-gold" data-save>${lead ? 'Save changes' : 'Add lead'}</button>`,
    onOpen(modal) {
      modal.querySelector('[data-cancel]').addEventListener('click', close);
      const delBtn = modal.querySelector('[data-del]');
      if (delBtn) delBtn.addEventListener('click', async () => {
        const ok = await confirmDialog({ title: 'Delete this lead?', message: 'This permanently removes the lead and its history. This cannot be undone.', confirmText: 'Delete forever', danger: true });
        if (ok) { deleteLead(leadId); close(); toast('Lead deleted from the server', 'info'); onSaved && onSaved(); }
      });
      modal.querySelector('[data-save]').addEventListener('click', async () => {
        const data = readForm(modal);
        /* validation */
        const errors = [];
        if (!data.firstName && !data.lastName) errors.push(['firstName', 'Name is required']);
        if (!data.phone && !data.email) errors.push(['phone', 'Phone or email is required']);
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push(['email', 'That email does not look valid']);
        if (data.phone && data.phone.replace(/\D/g, '').length < 7) errors.push(['phone', 'That phone number looks too short']);
        modal.querySelectorAll('.form-error').forEach(e => e.remove());
        modal.querySelectorAll('.invalid').forEach(e => e.classList.remove('invalid'));
        if (errors.length) {
          errors.forEach(([name, msg]) => {
            const fg = modal.querySelector(`[data-field="${name}"]`);
            if (fg) {
              fg.querySelector('.form-input')?.classList.add('invalid');
              const err = document.createElement('div');
              err.className = 'form-error'; err.textContent = msg;
              fg.appendChild(err);
            }
          });
          return;
        }
        const patch = {
          firstName: data.firstName, lastName: data.lastName,
          phone: data.phone, email: data.email, company: data.company,
          source: data.source, serviceInterest: data.serviceInterest,
          estimatedValue: data.estimatedValue ? Number(data.estimatedValue) : null,
          status: data.status, preferredChannel: data.preferredChannel,
          assignedOwner: data.assignedOwner,
          tags: data.tags ? data.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : []
        };
        if (lead) {
          const noteText = data.notes;
          delete patch.notes;
          await updateLead(lead.id, patch);
          if (noteText) await addNote(lead.id, noteText);
          toast('Lead updated on the server');
        } else {
          const out = await addLead(patch);
          if (!out.ok) { toast(out.error || 'Could not add lead', 'error'); return; }
          if (data.notes) await addNote(out.lead.id, data.notes);
          toast('Lead added to the platform');
        }
        close();
        onSaved && onSaved();
      });
    }
  });
  return close;
}

/* ---------- CSV import ---------- */
function openImport() {
  const close = openModal({
    title: 'Import Leads from CSV',
    wide: true,
    body: `
      <div class="form-group">
        <label class="form-label">CSV file</label>
        <input class="form-input" type="file" id="csvFile" accept=".csv,text/csv"/>
        <div class="form-hint">First row is treated as headers. You will map columns before import.</div>
      </div>
      <div id="csvPreview"></div>`,
    footer: `<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-gold" data-go id="csvGo" disabled>Continue</button>`,
    onOpen(modal) {
      modal.querySelector('[data-cancel]').addEventListener('click', close);
      const fileInput = modal.querySelector('#csvFile');
      const goBtn = modal.querySelector('#csvGo');
      let parsed = null;
      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const rows = parseCSV(reader.result);
          if (rows.length < 2) {
            modal.querySelector('#csvPreview').innerHTML = '<div class="form-error">That file appears to be empty.</div>';
            return;
          }
          parsed = rows;
          renderMapping(modal, rows, goBtn);
        };
        reader.readAsText(file);
      });
      goBtn.addEventListener('click', () => {
        if (!parsed) return;
        doImport(modal, parsed, close);
      });
    }
  });
}

function renderMapping(modal, rows, goBtn) {
  const headers = rows[0];
  const sample = rows.slice(1, 6);
  const targetFields = ['firstName', 'lastName', 'phone', 'email', 'company', 'source', 'serviceInterest', 'estimatedValue', 'status'];
  modal.querySelector('#csvPreview').innerHTML = `
    <div class="form-label" style="margin-bottom:8px">Map columns</div>
    <div class="table-wrap" style="border:1px solid var(--border);border-radius:10px">
      <table>
        <thead><tr>${headers.map((h, i) => `<th>
          <select class="select-input" data-map="${i}" style="min-width:120px">
            <option value="">— skip —</option>
            ${targetFields.map(tf => `<option value="${tf}">${tf}</option>`).join('')}
          </select>
          <div style="font-weight:400;text-transform:none;letter-spacing:0;margin-top:4px;color:var(--text-dim)">“${esc(h)}”</div>
        </th>`).join('')}</tr></thead>
        <tbody>${sample.map(r => `<tr>${r.map(c => `<td class="cell-dim">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>
    <div class="form-hint" style="margin-top:8px">Showing first ${sample.length} data rows.</div>`;
  goBtn.disabled = false;
  goBtn.textContent = 'Import';
  goBtn.dataset.stage = 'import';
  goBtn.onclick = async () => {
    const mapping = [...modal.querySelectorAll('[data-map]')].map(sel => sel.value);
    const defaults = { source: 'Manual', status: 'New' };
    const { leads, errors } = leadImportService.import(rows.slice(1), mapping, defaults);
    const s = getState();
    const existing = new Set(s.leads.map(l => `${l.firstName}|${l.lastName}|${l.phone}|${l.email}`.toLowerCase()));
    let added = 0, skipped = 0;
    for (const l of leads) {
      const key = `${l.firstName}|${l.lastName}|${l.phone}|${l.email}`.toLowerCase();
      if (existing.has(key)) { skipped++; continue; }
      const out = await addLead(l);
      if (out.ok) added++; else skipped++;
    }
    close();
    if (errors.length) toast(`Imported ${added}${skipped ? `, skipped ${skipped}` : ''} — ${errors.length} rows had errors`, 'info');
    else toast(`Imported ${added} leads to the platform${skipped ? `, skipped ${skipped} duplicates` : ''}`);
    window.LeadFlow.navigate('leads');
  };
}

function doImport(modal, rows, close) {
  /* handled in renderMapping onclick — kept for structure */
}

/* ---------- CSV export ---------- */
function exportCSV() {
  const leads = filteredLeads();
  const csv = toCSV(leads.map(l => ({
    firstName: l.firstName, lastName: l.lastName, phone: l.phone, email: l.email,
    company: l.company, source: l.source, serviceInterest: l.serviceInterest,
    estimatedValue: l.estimatedValue ?? '', status: l.status, score: l.score,
    tags: l.tags.join('; '), assignedOwner: l.assignedOwner,
    lastContactAt: l.lastContactAt ? fmtDate(l.lastContactAt) : '',
    nextFollowUpAt: l.nextFollowUpAt ? fmtDate(l.nextFollowUpAt) : '',
    createdAt: fmtDate(l.createdAt)
  })), [
    { key: 'firstName', label: 'First Name' }, { key: 'lastName', label: 'Last Name' },
    { key: 'phone', label: 'Phone' }, { key: 'email', label: 'Email' },
    { key: 'company', label: 'Company' }, { key: 'source', label: 'Source' },
    { key: 'serviceInterest', label: 'Service Interest' }, { key: 'estimatedValue', label: 'Estimated Value' },
    { key: 'status', label: 'Status' }, { key: 'score', label: 'Score' },
    { key: 'tags', label: 'Tags' }, { key: 'assignedOwner', label: 'Owner' },
    { key: 'lastContactAt', label: 'Last Contact' }, { key: 'nextFollowUpAt', label: 'Next Follow-Up' },
    { key: 'createdAt', label: 'Created' }
  ]);
  downloadFile(`vantorx-leads-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  toast(`Exported ${leads.length} leads to CSV`);
}

function toLocalInputValue(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
