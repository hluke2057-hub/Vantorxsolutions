/* ============================================================
   VANTORX LEADFLOW — pages/profile.js (COMMERCIAL CRM ENGINE)
   Lead Profile: Two-Way SMS, Ava AI Voice Recording Playback,
   AI Transcripts, Quick-Reply Battlecards, Calendar Booking,
   Notes, and Real-Time Deal Values.
   ============================================================ */

import {
  getState, getLead, leadActivities, updateLead, changeStatus, addNote,
  scheduleFollowUp, startAutomation, stopAutomation, bookAppointment,
  archiveLead, deleteLead, duplicateLead, saveTemplate, addActivity, emit,
  sendMessage, addTask
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
    root.innerHTML = emptyState({ icon: '🕵️', title: 'Lead not found', message: 'This lead may have been deleted or archived.', actionHTML: '<button class="btn btn-gold" data-nav="leads">Back to Leads</button>' });
    return;
  }
  const acts = leadActivities(leadId);
  const appts = s.appointments.filter(a => a.leadId === leadId);
  const messages = lead.messages || [];

  root.innerHTML = `
    <div style="margin-bottom:14px;display:flex;align-items:center;justify-content:space-between">
      <button class="btn btn-ghost btn-sm" data-nav="leads">← Back to Leads</button>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" data-action="edit">✎ Edit Lead</button>
        <button class="btn btn-ghost btn-sm" data-action="duplicate">⧉ Duplicate</button>
        <button class="btn btn-ghost btn-sm" data-action="delete" style="color:var(--red)">🗑 Delete</button>
      </div>
    </div>

    <!-- PROFILE HEADER CARD -->
    <div class="profile-head" style="margin-bottom:18px">
      <div class="profile-avatar">${esc((lead.firstName[0] || '') + (lead.lastName[0] || ''))}</div>
      <div style="flex:1;min-width:240px">
        <div class="profile-name-row" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <div class="profile-name" style="font-size:1.45rem">${esc(lead.firstName)} ${esc(lead.lastName)}</div>
          ${statusBadge(lead.status)}
          ${lead.estimatedValue ? `<span class="badge" style="background:rgba(245,158,11,0.18);border:1px solid rgba(245,158,11,0.45);color:var(--gold-bright);font-weight:800;font-size:12px;padding:3px 9px">💰 ${fmtMoney(lead.estimatedValue)}</span>` : ''}
          ${lead.source === 'Ava 24/7 Voice AI' || lead.callRecording ? '<span class="badge" style="background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.35);color:#60a5fa;font-size:11px">📞 Ava AI Call</span>' : ''}
        </div>
        <div class="page-subtitle" style="margin:4px 0 10px">${esc(lead.serviceInterest || 'Trade Contractor Lead')} · ${esc(lead.source)} · Created ${fmtDate(lead.createdAt)}</div>
        
        <div class="profile-quick">
          <a class="btn btn-ghost btn-sm" href="tel:${esc((lead.phone || '').replace(/\D/g, ''))}">📞 Call (${esc(lead.phone || 'No phone')})</a>
          <button class="btn btn-ghost btn-sm" data-action="focus-sms">💬 SMS</button>
          <a class="btn btn-ghost btn-sm" href="mailto:${esc(lead.email || '')}">📧 Email</a>
          <button class="btn btn-gold btn-sm" data-action="book">📅 Book Walkthrough</button>
          <button class="btn btn-ghost btn-sm" data-action="note">📝 Add Note</button>
          <button class="btn btn-ghost btn-sm" data-action="status">🔀 Stage: ${esc(lead.status)}</button>
        </div>
      </div>
    </div>

    <!-- MAIN PROFILE GRID -->
    <div class="profile-grid">
      <!-- LEFT COLUMN: VOICE RECORDING + TWO-WAY SMS + NOTES -->
      <div>
        ${lead.callRecording ? `
        <!-- AVA 24/7 VOICE AI CALL RECORDING & TRANSCRIPT -->
        <div class="card card-pad" style="margin-bottom:16px;border:1px solid rgba(245,158,11,0.35);background:linear-gradient(180deg, rgba(245,158,11,0.06) 0%, rgba(15,23,42,0) 100%)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <div class="panel-title" style="display:flex;align-items:center;gap:8px;font-size:0.95rem">
              <span>📞 Ava 24/7 Voice AI Inbound Recording</span>
            </div>
            <div style="display:flex;gap:6px;align-items:center">
              <span class="badge badge-hot" style="font-size:11px">⏱ ${Math.floor((lead.callRecording.duration || 90) / 60)}m ${(lead.callRecording.duration || 90) % 60}s</span>
              <span class="badge badge-connected" style="font-size:11px">Line: (561) 813-8602</span>
            </div>
          </div>
          
          <audio controls src="${esc(lead.callRecording.url || 'https://actions.google.com/sounds/v1/telephones/telephone_ring.ogg')}" style="width:100%;height:36px;margin:8px 0;border-radius:6px;outline:none"></audio>
          
          <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border-soft);border-radius:6px;padding:10px 12px;margin:8px 0">
            <div style="font-size:0.75rem;font-weight:700;color:var(--gold-bright);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">🤖 Ava AI Intake Summary:</div>
            <div style="font-size:0.86rem;color:var(--text);line-height:1.45">${esc(lead.callRecording.summary || 'Emergency incoming phone request captured and qualified by Ava 24/7.')}</div>
          </div>

          <details style="margin-top:8px;font-size:0.84rem;color:var(--text-soft)">
            <summary style="cursor:pointer;color:var(--gold-bright);font-weight:600;padding:4px 0">View Full Word-for-Word Transcript</summary>
            <div style="background:var(--bg-app);padding:10px;border-radius:6px;margin-top:6px;line-height:1.5;white-space:pre-wrap;border-left:3px solid var(--gold)">${esc(lead.callRecording.transcript || 'Transcript recorded.')}</div>
          </details>
        </div>` : ''}

        <!-- TWO-WAY SPEED-TO-LEAD SMS HUB -->
        <div class="card card-pad" id="smsCard" style="margin-bottom:16px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <div class="panel-title" style="display:flex;align-items:center;gap:6px">
              <span>💬 Two-Way SMS Thread</span>
              <span style="font-size:0.75rem;color:var(--text-dim)">(${esc(lead.phone || 'No phone')})</span>
            </div>
            <span class="badge badge-connected" style="font-size:10.5px">⚡ Speed-to-Lead Active</span>
          </div>

          <!-- Message History -->
          <div id="smsThread" style="background:var(--bg-app);border:1px solid var(--border-soft);border-radius:8px;padding:12px;max-height:280px;min-height:120px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;margin-bottom:14px">
            ${messages.length ? messages.map(m => {
              const isUser = m.sender === 'user';
              const isCust = m.sender === 'customer';
              const isSys = m.sender === 'system';
              return `<div style="display:flex;flex-direction:column;align-items:${isUser ? 'flex-end' : 'flex-start'}">
                <div style="max-width:85%;padding:9px 12px;border-radius:8px;font-size:0.85rem;line-height:1.4;
                  ${isUser ? 'background:var(--gold);color:#0B0F16;font-weight:600;border-bottom-right-radius:2px;' :
                    isCust ? 'background:rgba(255,255,255,0.07);color:var(--text);border-bottom-left-radius:2px;border:1px solid var(--border-soft);' :
                    'background:rgba(74,222,128,0.1);color:#4ade80;border:1px solid rgba(74,222,128,0.3);font-size:0.8rem;'}">
                  ${esc(m.text)}
                </div>
                <div style="font-size:0.68rem;color:var(--text-dim);margin-top:3px">
                  ${isUser ? 'You' : isCust ? esc(lead.firstName) : '⚡ System / Ava'} · ${fmtDateTime(m.time)}
                </div>
              </div>`;
            }).join('') : '<div style="color:var(--text-dim);font-size:0.84rem;text-align:center;padding:24px 0">No SMS messages logged yet. Use quick battlecards below to send an instant reply.</div>'}
          </div>

          <!-- 4 Contractor Quick Battlecard Templates -->
          <div style="margin-bottom:10px">
            <div style="font-size:0.74rem;color:var(--text-dim);font-weight:700;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">1-Click Contractor Battlecards:</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              <button class="btn btn-ghost btn-sm quick-tpl-btn" data-tpl="speed">⚡ 90s Speed-to-Lead</button>
              <button class="btn btn-ghost btn-sm quick-tpl-btn" data-tpl="confirm">📅 Confirm Walkthrough</button>
              <button class="btn btn-ghost btn-sm quick-tpl-btn" data-tpl="quote">📝 Estimate Follow-Up</button>
              <button class="btn btn-ghost btn-sm quick-tpl-btn" data-tpl="review">⭐ Google Review Request</button>
            </div>
          </div>

          <!-- Composer Form -->
          <div style="display:flex;flex-direction:column;gap:8px">
            <textarea id="smsInput" class="form-textarea" rows="2" placeholder="Write custom SMS message to ${esc(lead.firstName)}…" style="font-size:0.86rem;resize:vertical"></textarea>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:0.75rem;color:var(--text-dim)">⚡ Dispatched via Twilio / VantorX SMS Engine</span>
              <button class="btn btn-gold btn-sm" id="sendSmsBtn" style="font-weight:700">Send SMS 💬</button>
            </div>
          </div>
        </div>

        <!-- NOTES SECTION -->
        <div class="card card-pad" style="margin-bottom:16px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div class="panel-title">Contractor Field Notes</div>
            <button class="btn btn-ghost btn-sm" data-action="note">+ Add Note</button>
          </div>
          <div id="notesList">
            ${(lead.notes || []).length ? [...lead.notes].reverse().map(n => `
              <div class="note-item" style="border-bottom:1px solid var(--border-soft);padding:8px 0">
                <div style="font-size:0.86rem;white-space:pre-wrap;color:var(--text)">${esc(n.text)}</div>
                <div class="note-meta" style="font-size:0.72rem;color:var(--text-dim);margin-top:4px">${esc(n.author || 'Staff')} · ${fmtDateTime(n.createdAt)}</div>
              </div>`).join('') : '<div style="color:var(--text-dim);font-size:0.84rem;padding:8px 0">No notes yet. Add field notes or estimate specs here.</div>'}
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: OPPORTUNITY DETAILS + APPOINTMENTS + TIMELINE -->
      <div>
        <!-- OPPORTUNITY DETAILS CARD -->
        <div class="card card-pad" style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div class="panel-title">Opportunity Details</div>
            <button class="btn btn-ghost btn-sm" data-action="edit">✎ Edit</button>
          </div>
          <div class="info-grid">
            <div class="info-item"><div class="lbl">Phone</div><div class="val">${esc(lead.phone || '—')}</div></div>
            <div class="info-item"><div class="lbl">Email</div><div class="val">${esc(lead.email || '—')}</div></div>
            <div class="info-item"><div class="lbl">Company / Property</div><div class="val">${esc(lead.company || 'Residential')}</div></div>
            <div class="info-item"><div class="lbl">Service Interest</div><div class="val" style="font-weight:600;color:var(--gold-bright)">${esc(lead.serviceInterest || 'General Service')}</div></div>
            <div class="info-item"><div class="lbl">Estimated Value</div><div class="val" style="font-weight:800;color:var(--gold-bright)">${lead.estimatedValue ? fmtMoney(lead.estimatedValue) : 'Not specified'}</div></div>
            <div class="info-item"><div class="lbl">Lead Source</div><div class="val">${esc(lead.source)}</div></div>
            <div class="info-item"><div class="lbl">Current Stage</div><div class="val">${statusBadge(lead.status)}</div></div>
            <div class="info-item"><div class="lbl">Assigned Owner</div><div class="val">${esc(lead.assignedOwner || 'Luke Hamilton')}</div></div>
            <div class="info-item"><div class="lbl">Preferred Channel</div><div class="val">${esc(lead.preferredChannel || 'SMS')}</div></div>
            <div class="info-item"><div class="lbl">Lead Score</div><div class="val"><span class="score-pill ${lead.score >= 70 ? 'score-high' : lead.score >= 45 ? 'score-mid' : 'score-low'}">${lead.score || 90}</span></div></div>
            <div class="info-item"><div class="lbl">Created</div><div class="val">${fmtDate(lead.createdAt)}</div></div>
            <div class="info-item"><div class="lbl">Last Contact</div><div class="val">${lead.lastContactAt ? relTime(lead.lastContactAt) : 'Never'}</div></div>
          </div>

          ${(lead.tags || []).length ? `
          <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border-soft)">
            <div style="font-size:0.75rem;color:var(--text-dim);margin-bottom:6px">Tags:</div>
            <div style="display:flex;flex-wrap:wrap;gap:5px">
              ${lead.tags.map(t => `<span class="chip" style="font-size:11px">${esc(t)}</span>`).join('')}
            </div>
          </div>` : ''}
        </div>

        <!-- FLEET DISPATCH / APPOINTMENTS CARD -->
        <div class="card card-pad" style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div class="panel-title">Inspection Walkthroughs</div>
            <button class="btn btn-gold btn-sm" data-action="book">+ Book Walkthrough</button>
          </div>
          ${appts.length ? appts.map(a => `
            <div class="stat-row" style="padding:8px 0;border-bottom:1px solid var(--border-soft)">
              <div>
                <div style="font-weight:600;font-size:0.86rem;color:var(--text)">${esc(a.service)}</div>
                <div style="font-size:0.74rem;color:var(--text-dim)">Tech: ${esc(a.staff || 'Field Dispatch')} · <span style="color:var(--gold-bright)">${esc(a.status || 'Confirmed')}</span></div>
              </div>
              <div class="val" style="font-size:0.84rem;text-align:right">${fmtDateTime(a.startTime)}</div>
            </div>`).join('')
          : '<div style="color:var(--text-dim);font-size:0.84rem;padding:6px 0">No walkthrough appointments booked yet. Click "+ Book Walkthrough" to schedule an on-site inspection.</div>'}
        </div>

        <!-- ACTIVITY TIMELINE -->
        <div class="card card-pad">
          <div class="panel-title" style="margin-bottom:10px">Activity & Dispatch History</div>
          ${activityRows(acts.slice(0, 20), s)}
        </div>
      </div>
    </div>
  `;

  /* ============ WIRING ============ */
  root.querySelector('[data-action="edit"]')?.addEventListener('click', () => openLeadForm(leadId, () => renderProfile(root, leadId)));
  root.querySelector('[data-action="duplicate"]')?.addEventListener('click', async () => {
    const r = await duplicateLead(leadId);
    if (r.ok) { toast('Opportunity duplicated'); window.LeadFlow.navigate('leads'); }
  });
  root.querySelector('[data-action="delete"]')?.addEventListener('click', async () => {
    const ok = await confirmDialog({ title: 'Delete this opportunity?', message: 'This permanently removes the lead, call audio, and message history from the CRM.', confirmText: 'Delete forever', danger: true });
    if (!ok) return;
    const r = await deleteLead(leadId);
    if (r.ok) { toast('Lead deleted', 'info'); window.LeadFlow.navigate('leads'); }
  });
  root.querySelector('[data-action="note"]')?.addEventListener('click', () => openNoteModal(leadId, () => renderProfile(root, leadId)));
  root.querySelector('[data-action="status"]')?.addEventListener('click', () => openStatusModal(leadId, () => renderProfile(root, leadId)));
  root.querySelector('[data-action="book"]')?.addEventListener('click', () => openBookingModal(leadId, () => renderProfile(root, leadId)));

  // Focus SMS composer
  root.querySelector('[data-action="focus-sms"]')?.addEventListener('click', () => {
    const inp = root.querySelector('#smsInput');
    if (inp) { inp.focus(); inp.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  });

  // SMS Quick Battlecards
  const smsInput = root.querySelector('#smsInput');
  const leadValStr = lead.estimatedValue ? fmtMoney(lead.estimatedValue) : 'estimated';
  const leadSvc = lead.serviceInterest || 'emergency repair';

  root.querySelectorAll('.quick-tpl-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tpl = btn.dataset.tpl;
      if (tpl === 'speed') {
        smsInput.value = `Hey ${lead.firstName}, this is Luke with VantorX. Saw your emergency request for ${leadSvc}. Our crew can be on-site in 45 minutes. Are you home right now?`;
      } else if (tpl === 'confirm') {
        smsInput.value = `Hey ${lead.firstName}, confirming our inspection walkthrough for tomorrow at 10:00 AM. Our lead technician will call you 15 minutes before arrival.`;
      } else if (tpl === 'quote') {
        smsInput.value = `Hey ${lead.firstName}, following up on the ${leadValStr} estimate we sent over for ${leadSvc}. Any questions before we lock in materials and schedule your crew?`;
      } else if (tpl === 'review') {
        smsInput.value = `Hey ${lead.firstName}, thank you for trusting our crew with your ${leadSvc}! Could you take 30 seconds to drop us a quick 5-star Google review? https://g.page/r/vantorx-review`;
      }
      smsInput.focus();
    });
  });

  // Send SMS
  root.querySelector('#sendSmsBtn')?.addEventListener('click', async () => {
    const text = smsInput.value.trim();
    if (!text) { toast('Please write a message before sending', 'error'); return; }
    await sendMessage(leadId, text, 'SMS');
    renderProfile(root, leadId);
  });
}

/* ---------- note modal ---------- */
export function openNoteModal(leadId, onDone) {
  const close = openModal({
    title: 'Add Field Note',
    body: `<div class="form-group"><label class="form-label">Note</label><textarea class="form-textarea" id="noteText" placeholder="Write inspection notes, material specs, or customer details…"></textarea></div>`,
    footer: `<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-gold" data-ok>Add Note</button>`,
    onOpen(modal) {
      modal.querySelector('[data-cancel]').addEventListener('click', close);
      modal.querySelector('[data-ok]').addEventListener('click', async () => {
        const text = modal.querySelector('#noteText').value;
        if (!text.trim()) return;
        const r = await addNote(leadId, text);
        close();
        if (r.ok) { toast('Note added'); onDone && onDone(); }
      });
      modal.querySelector('#noteText').focus();
    }
  });
}

/* ---------- follow-up modal ---------- */
export function openFollowUpModal(leadId, onDone) {
  const lead = getLead(leadId);
  const s = getState();
  const close = openModal({
    title: `Schedule Follow-Up for ${lead ? lead.firstName : 'Lead'}`,
    body: `
      <div class="form-group"><label class="form-label">Task Description</label><input class="form-input" id="fuTitle" value="Call back regarding estimate"/></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Due Date & Time</label><input class="form-input" type="datetime-local" id="fuDue" value="${daysFromNowISO(1, 10, 0).slice(0, 16)}"/></div>
        <div class="form-group"><label class="form-label">Priority</label><select class="form-select" id="fuPriority"><option>High</option><option selected>Medium</option><option>Low</option></select></div>
      </div>
      <div class="form-group"><label class="form-label">Owner</label><select class="form-select" id="fuOwner">${s.settings.team.map(m => `<option>${esc(m.name)}</option>`).join('')}</select></div>`,
    footer: `<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-gold" data-ok>Schedule Follow-Up</button>`,
    onOpen(modal) {
      modal.querySelector('[data-cancel]').addEventListener('click', close);
      modal.querySelector('[data-ok]').addEventListener('click', async () => {
        const title = modal.querySelector('#fuTitle').value.trim();
        const dueAt = modal.querySelector('#fuDue').value;
        const priority = modal.querySelector('#fuPriority').value;
        const owner = modal.querySelector('#fuOwner').value;
        if (!title) { toast('Please specify a task description', 'error'); return; }
        await addTask({
          leadId,
          title,
          type: 'Call',
          dueAt: new Date(dueAt).toISOString(),
          priority,
          assignedOwner: owner
        });
        close();
        toast('Follow-up task scheduled');
        onDone && onDone();
      });
    }
  });
}

/* ---------- status modal ---------- */
function openStatusModal(leadId, onDone) {
  const lead = getLead(leadId);
  const close = openModal({
    title: 'Update Pipeline Stage',
    body: `<div class="form-group"><label class="form-label">Stage</label><select class="form-select" id="statusSel">${STATUSES.map(st => `<option ${st === lead.status ? 'selected' : ''}>${st}</option>`).join('')}</select></div>`,
    footer: `<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-gold" data-ok>Update Stage</button>`,
    onOpen(modal) {
      modal.querySelector('[data-cancel]').addEventListener('click', close);
      modal.querySelector('[data-ok]').addEventListener('click', async () => {
        const v = modal.querySelector('#statusSel').value;
        const r = await changeStatus(leadId, v);
        close();
        if (r.ok) { toast(`Opportunity stage → ${v}`); onDone && onDone(); }
      });
    }
  });
}

/* ---------- booking modal (real platform calendar + fallback) ---------- */
async function openBookingModal(leadId, onDone) {
  let services = [];
  try {
    const svcR = await api('GET', '/api/services');
    if (svcR.ok && Array.isArray(svcR.rows) && svcR.rows.length) {
      services = svcR.rows.map(x => ({ id: x.id, name: x.name, label: `${x.name} — $${x.price || 0} · ${x.minutes || 60} min` }));
    }
  } catch (e) {
    /* fallback to commercial trade defaults */
  }

  if (!services.length) {
    services = [
      { id: 'srv_1', name: 'Emergency On-Site Leak Inspection', label: 'Emergency On-Site Leak Inspection — Free (30 min)' },
      { id: 'srv_2', name: 'Full Roof Replacement Walkthrough', label: 'Full Roof Replacement Walkthrough — Free (45 min)' },
      { id: 'srv_3', name: 'HVAC System Diagnostic & Estimate', label: 'HVAC System Diagnostic & Estimate — Free (45 min)' },
      { id: 'srv_4', name: 'Commercial Plumbing Scope & Camera Inspection', label: 'Commercial Plumbing Scope & Camera Inspection — Free (60 min)' }
    ];
  }

  const def = new Date(Date.now() + 86400000);
  const pad = n => String(n).padStart(2, '0');
  const close = openModal({
    title: 'Book Inspection Walkthrough',
    body: `
      <div class="form-group"><label class="form-label">Inspection Date &amp; Time</label>
        <input class="form-input" type="datetime-local" id="apptWhen" value="${def.getFullYear()}-${pad(def.getMonth() + 1)}-${pad(def.getDate())}T10:00"/></div>
      <div class="form-group"><label class="form-label">Contractor Service</label>
        <select class="form-select" id="apptService">${services.map(sv => `<option value="${esc(sv.name)}">${esc(sv.label)}</option>`).join('')}</select></div>
      <div class="form-hint">Walkthrough automatically dispatches onto the fleet dispatch calendar and notifies the lead.</div>`,
    footer: `<button class="btn btn-ghost" data-cancel>Cancel</button><button class="btn btn-gold" data-ok>Confirm Walkthrough</button>`,
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
          staff: 'Luke Hamilton'
        });
        btn.disabled = false;
        if (!r.ok) { toast(r.error || 'Booking failed', 'error'); return; }
        close();
        toast('Walkthrough scheduled on dispatch calendar!');
        onDone && onDone();
      });
    }
  });
}
