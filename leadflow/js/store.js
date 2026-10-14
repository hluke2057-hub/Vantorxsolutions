/* ============================================================
   VANTORX LEADFLOW — store.js (PRODUCTION)
   The platform server is the single source of truth. Leads,
   activities, appointments and notifications live on the server;
   this store keeps an in-memory read-model and writes through.
   Features the platform does not track yet (automations, message
   templates, follow-up tasks, lead scores, archiving) are honest
   nulls/empty sets — never invented. No demo data, no localStorage.
   ============================================================ */

import { uid, nowISO } from './utils.js';
import { toast } from './components.js';

/* ---------------- tiny API helper ---------------- */
export async function api(method, path, body) {
  let res;
  try {
    res = await fetch(path, { method, credentials: 'same-origin', headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined });
  } catch (e) {
    return { ok: false, status: 0, error: 'Platform server not reachable. Start platform/server.ps1 and reload.' };
  }
  let data = {};
  try { data = await res.json(); } catch { /* empty */ }
  if (!res.ok) return { ok: false, status: res.status, error: data.error || `HTTP ${res.status}`, ...data };
  return { ok: true, status: res.status, ...data };
}

export const session = { user: null, bizId: null, business: null };

/* ---------------- state ---------------- */
let state = {
  version: 2,
  live: true,
  signedIn: false,
  adminAccount: false,
  serverError: null,
  onboarded: true,
  leads: [],
  activities: [],
  automations: [],
  templates: [],
  appointments: [],
  tasks: [],
  notifications: [],
  settings: null,
  selectedLeadIds: [],
  search: ''
};
const listeners = new Set();

export function getState() { return state; }
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function emit() { listeners.forEach(fn => { try { fn(state); } catch (e) { console.error(e); } }); }

/* ---------------- adapters (server rows → app shapes) ---------------- */

function adaptLead(row) {
  const parts = String(row.name || '').trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  return {
    id: row.id,
    firstName, lastName,
    phone: row.phone || '', email: row.email || '',
    company: '',                    // not tracked server-side yet
    source: row.source || 'Phone',
    serviceInterest: '',            // not tracked server-side yet
    estimatedValue: null,           // not tracked server-side yet
    status: row.status || 'New',
    score: null,                    // no platform lead scoring — never invented
    tags: [],                       // not tracked server-side yet
    assignedOwner: 'Unassigned',    // ownership not tracked server-side yet
    notes: row.notes ? [{ text: row.notes, author: 'Platform', createdAt: row.updatedAt || row.createdAt }] : [],
    preferredChannel: 'SMS',
    createdAt: row.createdAt, updatedAt: row.updatedAt,
    lastContactAt: row.updatedAt || null,
    nextFollowUpAt: null,           // real follow-up scheduling arrives with automations
    automationId: null, automationActive: false,
    appointmentId: null, archived: false,
  };
}

const APPT_TO_APP = { Booked: 'Confirmed', Rescheduled: 'Confirmed', Completed: 'Completed', Cancelled: 'Canceled' };
const APPT_TO_SERVER = { Confirmed: 'Booked', Requested: null, Completed: 'Completed', Canceled: 'Cancelled', 'No-show': null };
function adaptAppt(row, leadsById) {
  const key = String(row.customer || '').toLowerCase();
  const lead = Object.values(leadsById).find(l => `${l.firstName} ${l.lastName}`.toLowerCase() === key);
  return {
    id: row.id,
    leadId: lead ? lead.id : null,   // matched by customer name — honest null when unmatched
    startTime: row.at,
    service: row.service || '',
    staff: row.bookedBy || 'Owner',
    status: APPT_TO_APP[row.status] || 'Confirmed',
    serverStatus: row.status,
  };
}

function adaptNotification(row) {
  return { id: row.id, type: 'info', title: row.title || '', body: row.body || '', createdAt: row.at, read: !!row.read };
}

function buildSettings(biz, user) {
  return {
    business: {
      name: (biz && biz.name) || '',
      website: (biz && biz.website) || '',
      phone: (biz && biz.phone) || '',
      email: (biz && biz.email) || '',
      timeZone: (biz && biz.timezone) || 'America/Chicago'
    },
    ownerName: (user && user.name) || '',
    team: user ? [{ name: user.name, role: user.role === 'owner' ? 'Admin' : 'Sales Rep', initials: String(user.name || '?').split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() }] : [],
    leadSettings: { defaultOwner: (user && user.name) || '', defaultStatus: 'New', quietHours: { enabled: false, from: '21:00', to: '08:00' } },
    pipeline: { stages: ['New', 'Contacted', 'Responded', 'Booked', 'Lost'] },
    notifications: { newLead: true, reply: true, booking: true, followupDue: true },
    branding: { accent: '#d4af37', displayName: 'VantorX LeadFlow' }
  };
}

/* ---------------- hydration ---------------- */

export async function hydrate() {
  const bizId = session.bizId;
  const [leadsR, apptR, notifR] = await Promise.all([
    api('GET', '/api/leads'),
    api('GET', '/api/appointments'),
    api('GET', '/api/notifications'),
  ]);

  const leadRows = leadsR.rows || [];
  const leads = leadRows.map(adaptLead);
  const leadsById = {};
  leads.forEach(l => { leadsById[l.id] = l; });

  /* per-lead activity timelines (real server rows) */
  const actResults = await Promise.all(leadRows.map(l => api('GET', `/api/leads/${encodeURIComponent(l.id)}/activities`)));
  const activities = [];
  leadRows.forEach((l, i) => {
    (actResults[i].rows || []).forEach(a => activities.push({
      id: a.id, leadId: l.id, type: 'event', channel: null,
      message: a.text, createdAt: a.at, createdBy: 'Platform', metadata: null
    }));
  });

  state = {
    ...state,
    signedIn: true,
    serverError: null,
    onboarded: true,
    leads,
    activities,
    appointments: (apptR.rows || []).map(a => adaptAppt(a, leadsById)),
    notifications: (notifR.rows || []).map(adaptNotification),
  };
  emit();
  return state;
}

/** Boot: verify the session, resolve the tenant, hydrate. Returns a mode string. */
export async function boot() {
  const me = await api('GET', '/api/auth/me');
  if (!me.ok || !me.user) { state = { ...state, signedIn: false }; emit(); return 'signin'; }
  if (me.user.role === 'vantorx_admin') { state = { ...state, signedIn: true, adminAccount: true }; emit(); return 'admin'; }
  session.user = me.user;

  const bizR = await api('GET', '/api/businesses');
  if (!bizR.ok) { state = { ...state, serverError: bizR.error || 'Could not load tenant data' }; emit(); return 'error'; }
  const biz = (bizR.rows || [])[0];
  if (!biz) { state = { ...state, signedIn: true, onboarded: false }; emit(); return 'onboard'; }
  session.bizId = biz.id;
  session.business = biz;
  state = { ...state, settings: buildSettings(biz, session.user) };
  await hydrate();
  return 'ready';
}

export async function platformLogin(email, password) {
  const r = await api('POST', '/api/auth/login', { email, password });
  if (!r.ok) return { ok: false, error: r.error || 'Login failed' };
  return { ok: true, mode: await boot() };
}

export async function platformLogout() {
  await api('POST', '/api/auth/logout', {});
  state = {
    ...state,
    signedIn: false, adminAccount: false, onboarded: true,
    leads: [], activities: [], appointments: [], notifications: [],
    settings: null, selectedLeadIds: [],
  };
  session.user = null; session.bizId = null; session.business = null;
  emit();
}

/* legacy entry points used by pages */
export function loadState() { return state; }

/* ---------------- selectors ---------------- */
export function getLead(id) {
  return state.leads.find(l => l.id === id);
}

export function leadActivities(leadId) {
  return state.activities
    .filter(a => a.leadId === leadId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function leadAppointments(leadId) {
  return state.appointments.filter(a => a.leadId === leadId);
}

export function leadTasks(leadId) {
  return [];   // follow-up tasks are not tracked on the platform yet
}

/* ---------------- mutations (server write-through) ---------------- */

export async function addLead(data) {
  const name = `${data.firstName || ''} ${data.lastName || ''}`.trim();
  if (!name) return { ok: false, error: 'A lead name is required.' };
  const r = await api('POST', '/api/leads', {
    businessId: session.bizId,
    name,
    phone: data.phone || '',
    email: data.email || '',
    source: data.source || 'Phone',
    notes: '',
  });
  if (!r.ok) return r;
  await hydrate();
  const created = state.leads.find(l => l.id === r.row.id) || null;
  return { ok: true, lead: created };
}

export async function updateLead(id, patch, { logType, logMsg, by } = {}) {
  const lead = getLead(id);
  if (!lead) return { ok: false, error: 'Lead not found.' };
  const body = {};
  if (patch.firstName != null || patch.lastName != null) {
    body.name = `${patch.firstName != null ? patch.firstName : lead.firstName} ${patch.lastName != null ? patch.lastName : lead.lastName}`.trim();
  }
  if (patch.phone != null) body.phone = patch.phone;
  if (patch.email != null) body.email = patch.email;
  if (patch.source != null) body.source = patch.source;

  const ignored = [];
  ['company', 'serviceInterest', 'estimatedValue', 'preferredChannel', 'assignedOwner', 'tags'].forEach(k => {
    if (patch[k] != null && JSON.stringify(patch[k]) !== JSON.stringify(lead[k])) ignored.push(k);
  });
  if (ignored.length) {
    toast(`Not tracked by the platform yet: ${ignored.join(', ')} — other changes saved.`, 'info');
  }

  let r = { ok: true };
  if (Object.keys(body).length) {
    r = await api('PATCH', `/api/leads/${encodeURIComponent(id)}`, body);
    if (!r.ok) return r;
  }
  if (patch.status && patch.status !== lead.status) await changeStatus(id, patch.status);
  await hydrate();
  return { ok: true };
}

export async function changeStatus(id, newStatus) {
  const lead = getLead(id);
  if (!lead || lead.status === newStatus) return { ok: true };
  const r = await api('PATCH', `/api/leads/${encodeURIComponent(id)}`, { status: newStatus });
  if (!r.ok) { toast(r.error || 'Status change failed', 'error'); return r; }
  await hydrate();
  return { ok: true };
}

export async function archiveLead(id, archived = true) {
  return { ok: false, error: 'Archiving is not available on the platform yet — mark the lead Lost instead.' };
}

export async function deleteLead(id) {
  const r = await api('DELETE', `/api/leads/${encodeURIComponent(id)}`);
  if (!r.ok) { toast(r.error || 'Delete failed', 'error'); return r; }
  await hydrate();
  return { ok: true };
}

export async function duplicateLead(id) {
  const src = getLead(id);
  if (!src) return { ok: false, error: 'Lead not found.' };
  return addLead({
    firstName: `${src.firstName} (Copy)`, lastName: src.lastName,
    phone: src.phone, email: src.email, source: src.source,
  });
}

export async function addNote(leadId, text, author = 'You') {
  const lead = getLead(leadId);
  if (!lead || !text.trim()) return { ok: false, error: 'Write the note first.' };
  const existing = (lead.notes || []).map(n => n.text).join('\n');
  const merged = existing ? `${existing}\n${text.trim()}` : text.trim();
  const r = await api('PATCH', `/api/leads/${encodeURIComponent(leadId)}`, { notes: merged });
  if (!r.ok) { toast(r.error || 'Note save failed', 'error'); return r; }
  await hydrate();
  return { ok: true };
}

export async function scheduleFollowUp(leadId, whenISO) {
  toast('Follow-up scheduling arrives with automations — not on the platform yet.', 'info');
  return { ok: false, error: 'Follow-up scheduling is not on the platform yet.' };
}

export function bulkUpdate(ids, patch) {
  if (patch.assignedOwner) toast('Lead ownership is not tracked on the platform yet.', 'info');
  return { ok: false, error: 'Bulk fields beyond status are not on the platform yet.' };
}

export function toggleLeadSelected(id, selected) {
  if (selected) { if (!state.selectedLeadIds.includes(id)) state.selectedLeadIds.push(id); }
  else state.selectedLeadIds = state.selectedLeadIds.filter(s => s !== id);
  emit();
}
export function clearSelection() { state.selectedLeadIds = []; emit(); }

/* ---------------- automations / templates (not on the platform yet) ---------------- */

const NOT_LIVE = 'Automations are not live yet — they connect when SMS/email providers go live.';

export async function startAutomation(leadId, automationId) { toast(NOT_LIVE, 'info'); return { ok: false, error: NOT_LIVE }; }
export async function stopAutomation(leadId) { toast(NOT_LIVE, 'info'); return { ok: false, error: NOT_LIVE }; }
export async function saveAutomation(automation) { toast(NOT_LIVE, 'info'); return { ok: false, error: NOT_LIVE }; }
export async function deleteAutomation(id) { toast(NOT_LIVE, 'info'); return { ok: false, error: NOT_LIVE }; }
export async function toggleAutomation(id) { toast(NOT_LIVE, 'info'); return { ok: false, error: NOT_LIVE }; }
export async function saveTemplate(tpl) { toast('Message templates are not on the platform yet.', 'info'); return { ok: false, error: 'Templates are not on the platform yet.' }; }
export async function deleteTemplate(id) { toast('Message templates are not on the platform yet.', 'info'); return { ok: false, error: 'Templates are not on the platform yet.' }; }

/* ---------------- tasks (not on the platform yet) ---------------- */

export async function completeTask(taskId) { return { ok: false, error: 'Follow-up tasks are not on the platform yet.' }; }
export async function snoozeTask(taskId, hours = 24) { return { ok: false, error: 'Follow-up tasks are not on the platform yet.' }; }
export async function addTask(task) { return { ok: false, error: 'Follow-up tasks are not on the platform yet.' }; }

/* ---------------- appointments (real server rows) ---------------- */

export async function bookAppointment(leadId, { startTime, service, staff }) {
  const lead = getLead(leadId);
  if (!lead) return { ok: false, error: 'Lead not found.' };
  /* service is a real platform service — resolve its id */
  const svcR = await api('GET', '/api/services');
  const svc = (svcR.rows || []).find(s => s.businessId === session.bizId && s.name === service);
  if (!svc) return { ok: false, error: 'Pick one of your platform services — the calendar books real services only.' };
  const r = await api('POST', '/api/appointments', {
    businessId: session.bizId,
    customer: `${lead.firstName} ${lead.lastName}`.trim(),
    serviceId: svc.id,
    at: startTime,
    bookedBy: 'Owner',
    notes: 'Booked from LeadFlow',
  });
  if (!r.ok) return r;
  if (lead.status !== 'Booked') await changeStatus(leadId, 'Booked');
  await hydrate();
  return { ok: true, appointment: r.row };
}

export async function setAppointmentStatus(apptId, status) {
  const serverStatus = APPT_TO_SERVER[status];
  if (!serverStatus) {
    toast(`“${status}” is not tracked on the platform yet — use Confirmed, Completed or Canceled.`, 'info');
    return { ok: false, error: 'Unsupported status.' };
  }
  const r = await api('PATCH', `/api/appointments/${encodeURIComponent(apptId)}`, { status: serverStatus });
  if (!r.ok) { toast(r.error || 'Update failed', 'error'); return r; }
  await hydrate();
  return { ok: true };
}

/* ---------------- notifications ---------------- */

function notifyUser() { /* the platform creates its own notifications — no local fake feed */ }

export async function markNotificationRead(id) {
  const r = await api('POST', '/api/notifications/read', { id });
  if (r.ok) await hydrate();
  return r;
}

export async function markAllNotificationsRead() {
  const r = await api('POST', '/api/notifications/read', {});
  if (r.ok) await hydrate();
  return r;
}

export async function clearNotifications() {
  toast('Clearing notifications is not available on the platform — mark them read instead.', 'info');
  return { ok: false };
}

/* ---------------- settings ---------------- */

export async function saveSettings(patch) {
  /* business identity → real businesses PATCH; everything else stays
     session-local until the platform tracks it (never silently faked) */
  if (patch.business) {
    const b = patch.business;
    const body = {};
    if (b.name != null) body.name = b.name;
    if (b.phone != null) body.phone = b.phone;
    if (b.timeZone != null) body.timezone = b.timeZone;
    if (Object.keys(body).length) {
      const r = await api('PATCH', `/api/businesses/${encodeURIComponent(session.bizId)}`, body);
      if (!r.ok) { toast(r.error || 'Save failed', 'error'); return r; }
      session.business = r.row || session.business;
      await hydrate();
      return { ok: true };
    }
  }
  state = { ...state, settings: { ...state.settings, ...patch } };
  emit();
  return { ok: true, local: true };
}

export function setOnboarded() { state = { ...state, onboarded: true }; emit(); }

export async function addActivity() { return { ok: false }; }   // server logs activity itself

/* ---------------- legacy name kept for page imports ---------------- */
export function resetDemoData() {
  toast('There is no demo data anymore — LeadFlow runs on the live platform.', 'info');
}
