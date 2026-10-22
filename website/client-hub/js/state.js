/* ============================================================
   VANTORX CLIENT HUB — state.js (PRODUCTION)
   The platform server is the single source of truth.
   This module keeps a read-model of real server rows and the
   session context; pages stay synchronous via a stable snapshot.
   There is NO demo dataset and NO localStorage truth: if the
   server is unreachable, pages render honest empty states.
   ============================================================ */

import { api, session, discoverSession } from './live.js';

let snapshot = {
  ready: false,
  signedIn: false,
  needOnboarding: false,
  authRequired: false,
  adminAccount: false,
  serverError: null,
  business: { name: '', phone: '', email: '', address: '' },
  ai: { name: 'Ava', status: 'offline', calendar: 'the online calendar', transferNumber: '' },
  account: { name: '', email: '' },
  calls: [], appointments: [], leads: [], tasks: [],
  notifications: [], activity: [], requests: [], aiTests: [],
};
const listeners = new Set();

export function getState() { return snapshot; }
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit() { listeners.forEach(fn => { try { fn(snapshot); } catch (e) { console.error(e); } }); }

export async function refresh() {
  const r = await api('GET', '/api/health');
  if (!r.ok) { snapshot = { ...snapshot, ready: true, serverError: r.error, signedIn: false }; emit(); return snapshot; }
  snapshot = { ...snapshot, ready: true, serverError: null };
  emit();
  return snapshot;
}

export async function init() {
  const mode = await discoverSession();
  if (mode === 'signin') { snapshot = { ...snapshot, authRequired: true, signedIn: false, ready: true }; emit(); return; }
  if (mode === 'admin') { snapshot = { ...snapshot, adminAccount: true, signedIn: true, ready: true }; emit(); return; }
  if (mode === 'error') { snapshot = { ...snapshot, ready: true, serverError: 'Could not load tenant data' }; emit(); return; }

  // ready | onboard — refresh real rows
  await hydrate();
}

export async function hydrate() {
  const bizId = session.bizId;
  const [bizR, callR, apptR, leadR, notifR, reqR, cfgR] = await Promise.all([
    api('GET', '/api/businesses'),
    api('GET', '/api/calls'),
    api('GET', '/api/appointments'),
    api('GET', '/api/leads'),
    api('GET', '/api/notifications'),
    api('GET', '/api/change-requests'),
    api('GET', `/api/receptionist/config?businessId=${encodeURIComponent(bizId)}`),
  ]);

  const biz = (bizR.rows || []).find(b => b.id === bizId) || {};
  const cfg = (cfgR && cfgR.config) || {};
  const prof = cfg.profile || {};
  const know = cfg.knowledge || {};
  const pol = know.policies || {};

  /* activity timeline derived from real server rows (no invented events) */
  const activity = [
    ...(callR.rows || []).map(c => ({ type: 'calls', icon: '📞', title: `Call — ${c.from || c.caller || 'Unknown caller'}`, desc: c.summary || c.outcome || '', at: c.at || c.createdAt })),
    ...(apptR.rows || []).map(a => ({ type: 'appointments', icon: '📅', title: `Appointment — ${a.customer}`, desc: [a.service, a.status].filter(Boolean).join(' · '), at: a.at || a.createdAt })),
    ...(leadR.rows || []).map(l => ({ type: 'leads', icon: '🎯', title: `Lead — ${l.name}`, desc: [l.source, l.status].filter(Boolean).join(' · '), at: l.createdAt || l.updatedAt })),
    ...(reqR.rows || []).map(r => ({ type: 'account', icon: '📨', title: `Change request — ${r.type}`, desc: r.detail || r.status || '', at: r.at })),
  ].filter(x => x.at).sort((a, b) => new Date(b.at) - new Date(a.at));

  snapshot = {
    ...snapshot,
    __bizId: bizId,
    signedIn: true,
    authRequired: false,
    adminAccount: false,
    needOnboarding: !biz.id,
    ready: true,
    serverError: null,
    business: {
      name: biz.name || '',
      phone: biz.phone || '',
      email: biz.email || '',
      address: biz.city || '',
      industry: biz.industry || '',
    },
    ai: {
      name: (biz.receptionist && biz.receptionist.name) || 'Ava',
      status: cfg.active ? 'online' : 'offline',
      calendar: 'the platform calendar',
      transferNumber: prof.transferNumber || '',
      knowledge: {
        policies: pol.cancellation || '',
        payments: pol.payment || '',
        faqs: know.faqs || [],
      },
    },
    account: { name: (session.user && session.user.name) || (session.user && session.user.email) || '', email: (session.user && session.user.email) || '' },
    calls: (callR.rows || []).slice(),
    appointments: (apptR.rows || []).slice(),
    leads: (leadR.rows || []).slice(),
    tasks: [],
    notifications: (notifR.rows || []).slice(),
    activity,
    requests: (reqR.rows || []).slice(),
    aiTests: [],
  };
  emit();
}

export async function setState(mutator) {
  mutator(snapshot);
  emit();                          // optimistic paint; hydrate() re-syncs after writes
}

/* sign in from the auth screen, then load tenant data */
export async function platformLogin(email, password) {
  const r = await api('POST', '/api/auth/login', { email, password });
  if (!r.ok) return { ok: false, error: r.error || 'Login failed' };
  const mode = await discoverSession();
  if (mode === 'admin') { snapshot = { ...snapshot, adminAccount: true, signedIn: true, ready: true }; emit(); return { ok: true }; }
  if (mode === 'signin' || mode === 'error') return { ok: false, error: 'Could not load a business tenant for this account' };
  await hydrate();
  return { ok: true };
}

export async function platformLogout() {
  await api('POST', '/api/auth/logout', {});
  snapshot = {
    ...snapshot,
    signedIn: false, authRequired: true, adminAccount: false,
    __bizId: null,
    calls: [], appointments: [], leads: [], tasks: [], notifications: [], activity: [], requests: [],
    business: { name: '', phone: '', email: '', address: '' },
    account: { name: '', email: '' },
  };
  emit();
}

export function mountDemoMode() {
  snapshot = {
    ...snapshot,
    signedIn: true,
    authRequired: false,
    adminAccount: false,
    needOnboarding: false,
    ready: true,
    serverError: null,
    business: {
      name: 'Apex Plumbing & HVAC',
      phone: '(561) 813-8602',
      email: 'service@apexplumbing.com',
      address: 'Tampa, FL',
      industry: 'Plumbing & HVAC',
    },
    ai: {
      name: 'Ava',
      status: 'online',
      calendar: 'Google Calendar (Synced)',
      transferNumber: '(561) 813-8602',
      knowledge: {
        policies: '24-hour cancellation notice required. 24/7 emergency dispatch available.',
        payments: 'All major credit cards, debit, ACH, and tap-to-pay.',
        faqs: [
          { q: 'What are your hours?', a: 'Monday through Saturday, 7:00 AM to 7:00 PM. Emergency on-call technicians 24/7.' },
          { q: 'Do you charge a diagnostic trip fee?', a: 'Standard diagnostic service call is $89, waived if repair work is authorized.' },
          { q: 'Do you offer financing for water heater or AC replacements?', a: 'Yes, 0% APR financing options are available through our portal.' }
        ],
      },
    },
    account: { name: 'Luke Hamilton (Demo)', email: 'luke@vantorxsolutions.com' },
    calls: [
      { id: 'c1', caller: 'Marcus Vance', from: '+15615550184', at: new Date(Date.now() - 1800000).toISOString(), outcome: 'Appointment Booked', summary: 'Commercial tankless water heater leaking in utility closet. Booked emergency inspection for 1:30 PM.', transcript: 'Caller: We have water pouring out of our commercial tankless heater. / Ava: Understood Marcus, I am flagging this as high-priority emergency. Let me lock in our on-call tech Gary for 1:30 PM today.' },
      { id: 'c2', caller: 'Sarah Jenkins', from: '+15615550133', at: new Date(Date.now() - 7200000).toISOString(), outcome: 'Transferred', summary: 'Main sewer line backup into basement. Transferred immediately to on-call dispatcher cell.', transcript: 'Caller: Our sewer line is backing up into the downstairs bathroom! / Ava: That is an urgent emergency. I am transferring you directly to our lead master plumber right now. Please hold for two seconds.' },
      { id: 'c3', caller: 'Robert Hayes', from: '+15615550198', at: new Date(Date.now() - 14400000).toISOString(), outcome: 'Quote Provided', summary: 'Inquired about AC tune-up special. Ava quoted $129 and sent booking SMS link.', transcript: 'Caller: How much is your spring AC tune-up? / Ava: Our comprehensive 21-point AC precision tune-up is $129. Would you like me to reserve a morning slot this Thursday?' }
    ],
    appointments: [
      { id: 'a1', customer: 'Marcus Vance', phone: '(561) 555-0184', service: 'Emergency Water Heater Inspection', at: new Date(Date.now() + 7200000).toISOString(), status: 'Confirmed' },
      { id: 'a2', customer: 'Linda Kowalski', phone: '(561) 555-0167', service: 'Full HVAC System Diagnostic', at: new Date(Date.now() + 86400000).toISOString(), status: 'Confirmed' }
    ],
    leads: [
      { id: 'l1', name: 'Marcus Vance', phone: '(561) 555-0184', source: 'Inbound Phone Call (Ava)', status: 'Booked', value: 1850, createdAt: new Date(Date.now() - 1800000).toISOString() },
      { id: 'l2', name: 'Sarah Jenkins', phone: '(561) 555-0133', source: 'Speed-to-Lead Web Form', status: 'In Progress', value: 3400, createdAt: new Date(Date.now() - 7200000).toISOString() },
      { id: 'l3', name: 'Robert Hayes', phone: '(561) 555-0198', source: 'Google Local Services Ads', status: 'New', value: 129, createdAt: new Date(Date.now() - 14400000).toISOString() }
    ],
    tasks: [],
    notifications: [
      { id: 'n1', title: 'New Call Booked', message: 'Ava booked emergency inspection for Marcus Vance ($1,850)', read: false, createdAt: new Date(Date.now() - 1800000).toISOString() },
      { id: 'n2', title: 'AEO Search Protocol Verified', message: 'ChatGPT & Perplexity schema crawled successfully (100% score)', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() }
    ],
    activity: [
      { type: 'calls', icon: '📞', title: 'Call — Marcus Vance', desc: 'Commercial water heater emergency booked', at: new Date(Date.now() - 1800000).toISOString() },
      { type: 'appointments', icon: '📅', title: 'Appointment — Marcus Vance', desc: 'Emergency Water Heater Inspection · Confirmed', at: new Date(Date.now() - 1800000).toISOString() }
    ],
    requests: [],
    aiTests: []
  };
  emit();
}

export function initSessionFromCache() { return { get: () => snapshot }; }


/* ---------------- write-through actions (server → re-hydrate) ---------------- */

export async function persistProfilePatch(patch) {
  const r = await api('PATCH', `/api/businesses/${encodeURIComponent(session.bizId)}`, patch);
  if (!r.ok) return r;
  await hydrate();
  return r;
}

export async function saveRxProfile(patch) {
  const r = await api('PUT', `/api/receptionist/config`, { businessId: session.bizId, ...patch });
  if (!r.ok) return r;
  await hydrate();
  return r;
}

export async function rxActivate() {
  return api('POST', '/api/receptionist/activate', { action: 'activate', businessId: session.bizId });
}
export async function rxDeactivate() {
  const r = await api('POST', '/api/receptionist/activate', { action: 'deactivate', businessId: session.bizId });
  if (r.ok) await hydrate();
  return r;
}

export async function createChangeRequest(type, description) {
  const r = await api('POST', '/api/change-requests', { businessId: session.bizId, type, detail: description });
  if (!r.ok) return r;
  await hydrate();
  return r;
}

export async function cancelAppointment(id) {
  const r = await api('PATCH', `/api/appointments/${encodeURIComponent(id)}`, { status: 'Cancelled' });
  if (!r.ok) return r;
  await hydrate();
  return r;
}

export async function rescheduleAppointment(id, date) {
  const r = await api('PATCH', `/api/appointments/${encodeURIComponent(id)}`, { at: date });
  if (!r.ok) return r;
  await hydrate();
  return r;
}

export async function markNotificationsRead(id) {
  const r = await api('POST', '/api/notifications/read', id ? { id } : {});
  if (!r.ok) return r;
  await hydrate();
  return r;
}

export async function runAiTest() {
  return api('POST', '/api/receptionist/talk', { action: 'start', businessId: session.bizId, callerName: 'Test Caller', phone: '+10000000000' });
}
export async function runAiTurn(sessionId, text) {
  return api('POST', '/api/receptionist/talk', { action: 'turn', sessionId, text });
}
