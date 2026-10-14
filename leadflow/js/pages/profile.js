/* ============================================================
   VANTORX LEADFLOW — pages/profile.js (PRODUCTION)
   Lead profile backed by the platform server: real notes,
   real status changes, real appointment booking into the
   platform calendar. Automations and AI drafting are shown
   honestly as not connected until their providers go live.
   ============================================================ */

import {
  getState, getLead, leadActivities, updateLead, changeStatus, addNote,
  scheduleFollowUp, startAutomation, stopAutomation, bookAppointment,
  archiveLead, deleteLead, duplicateLead, saveTemplate, addActivity, emit
} from '../store.js';
import { api } from '../store.js';
import {
  STATUSES, fmtDate, fmtDateTime, fmtMoney, relTime, escapeHTML as esc,
  statusBadge, daysFromNowISO
} from '../utils.js';
import { openModal, confirmDialog, toast, field, readForm, emptyState } from '../components.js';
import { activityRows } from './dashboard.js';
import { openLeadForm } from './leads.js';

export function renderProfile(root, leadId) {
  const s = getState();
  const lead = getLead(leadId);
  if (!lead) {
    root.innerHTML = emptyState({ icon: '🕵️', title: 'Lead not found', message: 'This lead may have been deleted.', actionHTML: '<button class="btn btn-gold" data-nav="leads">Back to Leads</button>' });
    return;
  }
  const acts = leadActivities(leadId);
  const appts = s.appointments.filter(a => a.leadId === leadId);

  root.innerHTML = `
    <div style="margin-bottom:14px"><button class="btn btn-ghost btn-sm" data-nav="leads">← Back to Leads</button></div>

    <div class="profile-head">
      <div class="profile-avatar">${esc((lead.firstName[0] || '') + (lead.lastName[0] || ''))}</div>
      <div style="flex:1;min-width:240px">
        <div class="profile-name-row">
          <div class="profile-name">${esc(lead.firstName)} ${esc(lead.lastName)}</div>
          ${statusBadge(lead.status)}
        </div>
        <div class="page-subtitle">${esc(lead.source)} · Created ${fmtDate(lead.createdAt)} · Last update ${relTime(lead.updatedAt)}</div>
        <div class="profile-quick">
          <a class="btn btn-ghost btn-sm" href="tel:${esc((lead.phone || '').replace(/\D/g, ''))}" data-tooltip="${esc(lead.phone || 'No phone')}">📞 Call</a>
          <a class="btn btn-ghost btn-sm" href="sms:${esc((lead.phone || '').replace(/\D/g, ''))}">💬 SMS</a>
          <a class="btn btn-ghost btn-sm" href="mailto:${esc(lead.email || '')}">📧 Email</a>
          <button class="btn btn-ghost btn-sm" data-action="book">📅 Book appointment</button>
          <button class="btn btn-ghost btn-sm" data-action="note">📝 Add note</button>
          <button class="btn btn-ghost btn-sm" data-action="status">🔀 Change status</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button class="btn btn-ghost btn-sm" data-action="edit">✎ Edit</button>
        <button class="btn btn-ghost btn-sm" data-action="duplicate">⧉ Duplicate</button>
        <button class="btn btn-ghost btn-sm" data-action="delete" style="color:var(--red)">🗑 Delete</button>
      </div>
    </div>

    <div class="profile-grid">
      <div>
        <div class="card card-pad" style="margin-bottom:16px">
          <div class="panel-title" style="margin-bottom:14px">Contact</div>
          <div class="info-grid">
            <div class="info-item"><div class="lbl">Phone</div><div class="val">${esc(lead.phone || '—')}</div></div>
            <div class="info-item"><div class="lbl">Email</div><div class="val">${esc(lead.email || '—')}</div></div>
            <div class="info-item"><div class="lbl">Source</div><div class="val">${esc(lead.source)}</div></div>
            <div class="info-item"><div class="lbl">Status</div><div class="val">${esc(lead.status)}</div></div>
            <div class="info-item"><div class="lbl">Created</div><div class="val">${fmtDate(lead.createdAt)}</div></div>
            <div class="info-item"><div class="lbl">Last update</div><div class="val">${fmtDateTime(lead.updatedAt)}</div></div>
          </div>
          <div class="form-hint" style="margin-top:12px">Company, service interest, estimated value, tags and lead ownership are not tracked by the platform yet — they show honestly as empty rather than invented.</div>
        </div>

        <div class="card card-pad" style="margin-bottom:16px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div class="panel-title">Notes</div>
            <button class="btn btn-ghost btn-sm" data-action="note">+ Add note</button>
          </div>
          <div id="notesList">
            ${(lead.notes || []).length ? [...lead.notes].reverse().map(n => `
              <div class="note-item">
                <div style="font-size:0.86rem;white-space:pre-wrap">${esc(n.text)}</div>
                <div class="note-meta">${esc(n.author)} · ${fmtDateTime(n.createdAt)}</div>
              </div>`).join('') : '<div style="color:var(--text-dim);font-size:0.84rem;padding:8px 0">No notes yet.</div>'}
          </div>
        </div>
      </div>

      <div>
        <div class="card card-pad" style="margin-bottom:16px">
          <div class="panel-title" style="margin-bottom:12px">Automated follow-up</div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
            <span class="badge badge-not-connected">NOT CONNECTED</span>
          </div>
          <p style="color:var(--text-soft);font-size:0.86rem;margin:0">SMS/email automations switch on when your messaging providers go live through VantorX. Until then your leads are tracked here and worked manually.</p>
        </div>

        <div class="card card-pad" style="margin-bottom:16px">
          <div class="panel-title" style="margin-bottom:12px">Appointments</div>
          ${appts.length ? appts.map(a => `
            <div class="stat-row"><span>${esc(a.service)} · ${esc(a.staff)} · ${esc(a.status)}</span><span class="val">${fmtDateTime(a.startTime)}</span></div>`).join('')
          : '<div style="color:var(--text-dim);font-size:0.84rem">No appointments yet — book one and it lands on the real platform calendar.</div>'}
        </div>

        <div class="card card-pad">
          <div class="panel-title" style="margin-bottom:8px">Activity Timeline</div>
          ${activityRows(acts.slice(0, 20), s)}
        </div>
      </div>
    </div>
  `;

  /* ============ wiring ============ */
  root.querySelector('[data-action="edit"]').addEventListener('click', () => openLeadForm(leadId, () => renderProfile(root, leadId)));
  root.querySelector('[data-action="duplicate"]').addEventListener('click', async () => {
    const r = await duplicateLead(leadId);
    if (r.ok) { toast('Lead duplicated on the server'); window.LeadFlow.navigate('leads'); }
  });
  root.querySelector('[data-action="delete"]').addEventListener('click', async () => {
    const ok = await confirmDialog({ title: 'Delete this lead?', message: 'This permanently removes the lead and its activity from the platform server. This cannot be undone.', confirmText: 'Delete forever', danger: true });
    if (!ok) return;
    const r = await deleteLead(leadId);
    if (r.ok) { toast('Lead deleted', 'info'); window.LeadFlow.navigate('leads'); }
  });
  root.querySelector('[data-action="note"]').addEventListener('click', () => openNoteModal(leadId, () => renderProfile(root, leadId)));
  root.querySelector('[data-action="status"]').addEventListener('click', () => openStatusModal(leadId, () => renderProfile(root, leadId)));
  root.querySelector('[data-action="book"]').addEventListener('click', () => openBookingModal(leadId, () => renderProfile(root, leadId)));
}

/* ---------- note modal ---------- */
export function openNoteModal(leadId, onDone) {
  const close = openModal({
    title: 'Add Note',
    body: `<div class="form-group"><label class="form-label">Note</label><textarea class="form-textarea" id="noteText" placeholder="Write a note about this lead…"></textarea></div>`,
    footer: `<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-gold" data-ok>Add note</button>`,
    onOpen(modal) {
      modal.querySelector('[data-cancel]').addEventListener('click', close);
      modal.querySelector('[data-ok]').addEventListener('click', async () => {
        const text = modal.querySelector('#noteText').value;
        if (!text.trim()) return;
        const r = await addNote(leadId, text);
        close();
        if (r.ok) { toast('Note saved to the server'); onDone && onDone(); }
      });
      modal.querySelector('#noteText').focus();
    }
  });
}

/* ---------- follow-up modal (honest) ---------- */
export function openFollowUpModal(leadId, onDone) {
  toast('Follow-up scheduling arrives with automations — not on the platform yet.', 'info');
}

/* ---------- status modal ---------- */
function openStatusModal(leadId, onDone) {
  const lead = getLead(leadId);
  const close = openModal({
    title: 'Change Status',
    body: `<div class="form-group"><label class="form-label">Status</label><select class="form-select" id="statusSel">${STATUSES.map(st => `<option ${st === lead.status ? 'selected' : ''}>${st}</option>`).join('')}</select></div>`,
    footer: `<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-gold" data-ok>Save</button>`,
    onOpen(modal) {
      modal.querySelector('[data-cancel]').addEventListener('click', close);
      modal.querySelector('[data-ok]').addEventListener('click', async () => {
        const v = modal.querySelector('#statusSel').value;
        const r = await changeStatus(leadId, v);
        close();
        if (r.ok) { toast(`Status → ${v} (saved on server)`); onDone && onDone(); }
      });
    }
  });
}

/* ---------- booking modal (real platform calendar) ---------- */
async function openBookingModal(leadId, onDone) {
  const lead = getLead(leadId);
  const svcR = await api('GET', '/api/services');
  const services = (svcR.rows || []).filter(x => x.businessId === getState().__bizId || true) // rows are already tenant-scoped
    .map(x => ({ id: x.id, name: x.name, label: `${x.name} — $${x.price} · ${x.minutes} min` }));
  if (!services.length) {
    toast('No services on the platform yet — add services in the Hub or onboarding first.', 'error');
    return;
  }
  const def = new Date(Date.now() + 2 * 86400000);
  const pad = n => String(n).padStart(2, '0');
  const close = openModal({
    title: 'Book Appointment',
    body: `
      <div class="form-group"><label class="form-label">Date &amp; time</label>
        <input class="form-input" type="datetime-local" id="apptWhen" value="${def.getFullYear()}-${pad(def.getMonth() + 1)}-${pad(def.getDate())}T14:00"/></div>
      <div class="form-group"><label class="form-label">Service (real platform services)</label>
        <select class="form-select" id="apptService">${services.map(sv => `<option value="${esc(sv.name)}">${esc(sv.label)}</option>`).join('')}</select></div>
      <div class="form-hint">Books into the real platform calendar — closed days and double-bookings are rejected by the server.</div>`,
    footer: `<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-gold" data-ok>Book appointment</button>`,
    onOpen(modal) {
      modal.querySelector('[data-cancel]').addEventListener('click', close);
      modal.querySelector('[data-ok]').addEventListener('click', async () => {
        const v = modal.querySelector('#apptWhen').value;
        if (!v) return;
        const btn = modal.querySelector('[data-ok]');
        btn.disabled = true;
        const r = await bookAppointment(leadId, {
          startTime: new Date(v).toISOString(),
          service: modal.querySelector('#apptService').value,
        });
        btn.disabled = false;
        if (!r.ok) { toast(r.error || 'Booking failed', 'error'); return; }
        close();
        toast('Appointment booked on the platform calendar');
        onDone && onDone();
      });
    }
  });
}
