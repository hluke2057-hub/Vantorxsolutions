/* ============================================================
   VANTORX LEADFLOW — store.js (FULL COMMERCIAL CRM ENGINE)
   Hybrid Cloud & Local Persistent Engine.
   - Live Supabase cloud write-through when logged in.
   - Zero-downtime local persistent workspace when in demo/offline mode.
   - Integrated with Ava 24/7 Voice AI Call Intake and Speed-to-Lead SMS.
   ============================================================ */

import { uid, nowISO, daysFromNowISO } from './utils.js';
import { toast } from './components.js';

const LOCAL_STORAGE_KEY = 'vantorx_leadflow_crm_live_v3';

/* ---------------- tiny API helper ---------------- */
export async function api(method, path, body) {
  let res;
  try {
    res = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (e) {
    return { ok: false, status: 0, error: 'Platform backend not reachable.' };
  }
  let data = {};
  try { data = await res.json(); } catch { /* empty */ }
  if (!res.ok) return { ok: false, status: res.status, error: data.error || `HTTP ${res.status}`, ...data };
  return { ok: true, status: res.status, ...data };
}

export const session = { user: null, bizId: null, business: null };

/* ---------------- INITIAL COMMERCIAL SEED DATA ---------------- */
const SEED_LEADS = [
  {
    id: 'lead_tampa_roof_1',
    firstName: 'Marcus',
    lastName: 'Vance',
    phone: '(813) 449-2180',
    email: 'marcus.vance@gmail.com',
    company: 'Vance Residential Property',
    source: 'Ava 24/7 Voice AI',
    serviceInterest: 'Emergency Tile Roof Leak & Shingle Repair',
    estimatedValue: 8500,
    status: 'New',
    score: 95,
    tags: ['High Ticket', 'Emergency', 'Storm Damage'],
    assignedOwner: 'Luke Hamilton',
    notes: [
      { text: 'Ava captured 9 PM storm call. Customer reported active water intrusion in upstairs hallway ceiling. Scheduled priority callback.', author: 'Ava Voice AI', createdAt: new Date(Date.now() - 35 * 60000).toISOString() }
    ],
    callRecording: {
      url: 'https://actions.google.com/sounds/v1/telephones/telephone_ring.ogg',
      duration: 114,
      transcript: "Hi, this is Marcus in South Tampa. A tree branch punctured our tile roof during the storm and water is pouring through the attic into our hallway. Can you get an emergency crew out here today?",
      summary: "Severe emergency tile puncture causing ceiling leak in South Tampa. Homeowner ready for immediate inspection."
    },
    messages: [
      { sender: 'customer', text: 'Call completed with Ava 24/7 Voice Receptionist.', time: new Date(Date.now() - 34 * 60000).toISOString() },
      { sender: 'system', text: '⚡ 90s Speed-to-Lead SMS triggered: "Hey Marcus, saw your emergency leak in Tampa. Dispatching technician right now."', time: new Date(Date.now() - 32 * 60000).toISOString() }
    ],
    preferredChannel: 'SMS',
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    lastContactAt: new Date(Date.now() - 32 * 60000).toISOString(),
    nextFollowUpAt: new Date(Date.now() + 45 * 60000).toISOString(),
    automationActive: true,
    archived: false
  },
  {
    id: 'lead_orlando_ac_2',
    firstName: 'Elena',
    lastName: 'Rostova',
    phone: '(407) 882-9310',
    email: 'elena.rostova@outlook.com',
    company: 'Lake Eola Condos',
    source: 'Website Speed-to-Lead',
    serviceInterest: 'Complete 4-Ton Heat Pump Replacement',
    estimatedValue: 11500,
    status: 'Contacted',
    score: 88,
    tags: ['Changeout', 'Residential', 'High Ticket'],
    assignedOwner: 'Luke Hamilton',
    notes: [
      { text: 'Compressor locked up in 94-degree heat. 14-year-old R410A system. Quoted Carrier 16 SEER2 replacement.', author: 'Luke', createdAt: new Date(Date.now() - 3 * 3600000).toISOString() }
    ],
    callRecording: null,
    messages: [
      { sender: 'customer', text: 'AC stopped cooling last night. Thermostat says 85 inside.', time: new Date(Date.now() - 3 * 3600000).toISOString() },
      { sender: 'user', text: 'Hey Elena, our tech can be at Lake Eola Condos tomorrow at 10 AM with equipment options.', time: new Date(Date.now() - 2.8 * 3600000).toISOString() }
    ],
    preferredChannel: 'SMS',
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    lastContactAt: new Date(Date.now() - 2.8 * 3600000).toISOString(),
    nextFollowUpAt: new Date(Date.now() + 4 * 3600000).toISOString(),
    automationActive: true,
    archived: false
  },
  {
    id: 'lead_boca_plumbing_3',
    firstName: 'Sal',
    lastName: 'Moretti',
    phone: '(561) 395-5858',
    email: 'sal@morettirestaurant.com',
    company: 'Boca Bistro',
    source: 'Ava 24/7 Voice AI',
    serviceInterest: 'Commercial Grease Trap & Main Sewer Backup',
    estimatedValue: 6200,
    status: 'Responded',
    score: 92,
    tags: ['Commercial', 'Emergency', 'VIP Client'],
    assignedOwner: 'Luke Hamilton',
    notes: [
      { text: 'Walkthrough confirmed for tomorrow 8:00 AM before restaurant opening. Hydrojetting rig scheduled.', author: 'Ava Voice AI', createdAt: new Date(Date.now() - 14 * 3600000).toISOString() }
    ],
    callRecording: {
      url: 'https://actions.google.com/sounds/v1/telephones/telephone_ring.ogg',
      duration: 88,
      transcript: "We have commercial kitchen grease backing up into our prep floor. Need an immediate hydrojet crew before health inspector arrives.",
      summary: "Commercial kitchen sewer backup in Boca Raton. 8 AM walkthrough booked."
    },
    messages: [
      { sender: 'system', text: 'Walkthrough confirmed: Tomorrow at 8:00 AM with Commercial Dispatch Lead.', time: new Date(Date.now() - 13 * 3600000).toISOString() }
    ],
    preferredChannel: 'Phone',
    createdAt: new Date(Date.now() - 15 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 13 * 3600000).toISOString(),
    lastContactAt: new Date(Date.now() - 13 * 3600000).toISOString(),
    nextFollowUpAt: new Date(Date.now() + 12 * 3600000).toISOString(),
    automationActive: false,
    archived: false
  },
  {
    id: 'lead_miami_pipe_4',
    firstName: 'Carlos',
    lastName: 'Mendez',
    phone: '(305) 714-3320',
    email: 'carlos.mendez@brickelllaw.com',
    company: 'Mendez Associates',
    source: 'Google Profile AEO',
    serviceInterest: 'Trenchless Cast Iron Pipe Lining',
    estimatedValue: 14800,
    status: 'Booked',
    score: 99,
    tags: ['High Ticket', 'Commercial Repipe'],
    assignedOwner: 'Luke Hamilton',
    notes: [
      { text: 'Homeowner called after seeing VantorX AEO citation on Siri. Full camera inspection report uploaded.', author: 'Luke', createdAt: new Date(Date.now() - 28 * 3600000).toISOString() }
    ],
    callRecording: null,
    messages: [],
    preferredChannel: 'SMS',
    createdAt: new Date(Date.now() - 30 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 3600000).toISOString(),
    lastContactAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    nextFollowUpAt: null,
    automationActive: false,
    archived: false
  }
];

const SEED_AUTOMATIONS = [
  {
    id: 'auto_speed_lead',
    name: '90-Second Speed-to-Lead SMS',
    active: true,
    trigger: 'New Inbound Lead (Form / Missed Call)',
    stopConditions: ['Customer Replies', 'Appointment Booked', 'Marked Lost'],
    steps: [
      { delayMinutes: 1.5, type: 'sms', templateName: 'Instant Trade Intake', body: 'Hey {first_name}, saw your request for {service}. Are you seeing active damage right now? We have a technician available.' },
      { delayMinutes: 15, type: 'sms', templateName: 'Direct Dispatch Check', body: 'Just checking back, {first_name} — what is the best address to send our inspection crew?' }
    ],
    updatedAt: nowISO()
  },
  {
    id: 'auto_review_funnel',
    name: '5-Star Google Review Funnel',
    active: true,
    trigger: 'Status changed to Won / Completed',
    stopConditions: ['Review Link Clicked'],
    steps: [
      { delayMinutes: 60, type: 'sms', templateName: 'Review Request', body: 'Hey {first_name}, thank you for trusting our team! Could you take 20 seconds to drop us a quick 5-star Google review? {google_review_link}' }
    ],
    updatedAt: nowISO()
  }
];

const SEED_TEMPLATES = [
  { id: 'tpl_1', name: 'Speed-to-Lead Response', channel: 'SMS', body: 'Hey {first_name}, saw your emergency request for {service}. Are you seeing active damage right now? We can have a technician out today.' },
  { id: 'tpl_2', name: 'Walkthrough Confirmation', channel: 'SMS', body: 'Hey {first_name}, confirming our inspection walkthrough for tomorrow at 4:30 PM. See you then!' },
  { id: 'tpl_3', name: 'Estimate Follow-Up', channel: 'SMS', body: 'Hey {first_name}, wanted to make sure you received our estimate for {service}. Any questions before we lock in the schedule?' },
  { id: 'tpl_4', name: 'Google Review Request', channel: 'SMS', body: 'Hey {first_name}, thank you for trusting our crew! Could you take 20 seconds to drop us a quick 5-star Google review? https://g.page/r/review' }
];

/* ---------------- state ---------------- */
let state = {
  version: 3,
  live: true,
  signedIn: true,
  isCloudSync: false,
  adminAccount: false,
  serverError: null,
  onboarded: true,
  leads: [...SEED_LEADS],
  activities: [],
  automations: [...SEED_AUTOMATIONS],
  templates: [...SEED_TEMPLATES],
  appointments: [
    {
      id: 'appt_1',
      leadId: 'lead_boca_plumbing_3',
      startTime: daysFromNowISO(1, 8, 0),
      service: 'Commercial Kitchen Hydrojet Walkthrough',
      staff: 'Luke Hamilton',
      status: 'Confirmed'
    },
    {
      id: 'appt_2',
      leadId: 'lead_miami_pipe_4',
      startTime: daysFromNowISO(2, 14, 0),
      service: 'Trenchless Pipe Camera Inspection',
      staff: 'Senior Tech Dispatch',
      status: 'Confirmed'
    }
  ],
  tasks: [
    { id: 't_1', leadId: 'lead_tampa_roof_1', title: 'Send Emergency Tarp Estimate', dueAt: daysFromNowISO(0, 15, 0), completed: false },
    { id: 't_2', leadId: 'lead_orlando_ac_2', title: 'Confirm 4-Ton Equipment Availability', dueAt: daysFromNowISO(1, 9, 0), completed: false }
  ],
  notifications: [
    {
      id: 'ntf_init',
      type: 'new_lead',
      title: '📞 Ava Captured Emergency Call: Marcus Vance',
      body: 'New $8,500 Emergency Tile Roof Leak lead captured on (561) 813-8602.',
      createdAt: nowISO(),
      read: false
    }
  ],
  settings: null,
  selectedLeadIds: [],
  search: ''
};

const listeners = new Set();
export function getState() { return state; }
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function emit() {
  saveToLocal();
  listeners.forEach(fn => { try { fn(state); } catch (e) { console.error(e); } });
}

/* ---------------- LOCAL STORAGE SYNC ---------------- */
export function saveToLocal() {
  try {
    const dataToSave = {
      leads: state.leads,
      automations: state.automations,
      templates: state.templates,
      appointments: state.appointments,
      tasks: state.tasks,
      notifications: state.notifications,
      settings: state.settings
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

export function loadFromLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.leads) && parsed.leads.length) state.leads = parsed.leads;
      if (Array.isArray(parsed.automations)) state.automations = parsed.automations;
      if (Array.isArray(parsed.templates)) state.templates = parsed.templates;
      if (Array.isArray(parsed.appointments)) state.appointments = parsed.appointments;
      if (Array.isArray(parsed.tasks)) state.tasks = parsed.tasks;
      if (Array.isArray(parsed.notifications)) state.notifications = parsed.notifications;
      if (parsed.settings) state.settings = parsed.settings;
    }
  } catch (e) {
    console.warn('LocalStorage load failed:', e);
  }
}

/* ---------------- SETTINGS BUILDER ---------------- */
export function buildSettings(biz, user) {
  return {
    business: {
      name: (biz && biz.name) || 'Florida Premier Trades & Roofing',
      website: (biz && biz.website) || 'https://www.vantorxsolutions.com',
      phone: (biz && biz.phone) || '(561) 813-8602',
      email: (biz && biz.email) || 'dispatch@vantorxsolutions.com',
      timeZone: (biz && biz.timezone) || 'America/New_York'
    },
    ownerName: (user && user.name) || 'Luke Hamilton (Closer)',
    team: [
      { name: (user && user.name) || 'Luke Hamilton', role: 'Closer / Dispatch Admin', initials: 'LH' },
      { name: 'Ava Voice AI', role: '24/7 Phone Receptionist', initials: 'AV' }
    ],
    leadSettings: { defaultOwner: 'Luke Hamilton', defaultStatus: 'New', quietHours: { enabled: false, from: '21:00', to: '08:00' } },
    pipeline: { stages: ['New', 'Contacted', 'Responded', 'Booked', 'Lost'] },
    notifications: { newLead: true, reply: true, booking: true, followupDue: true },
    branding: { accent: '#f59e0b', displayName: 'VantorX LeadFlow CRM' }
  };
}

/* ---------------- BOOT & HYDRATION ---------------- */
export async function boot() {
  // 1. Try cloud platform session
  try {
    const me = await api('GET', '/api/auth/me');
    if (me.ok && me.user) {
      session.user = me.user;
      const bizR = await api('GET', '/api/businesses');
      const biz = (bizR.rows || [])[0] || null;
      if (biz) {
        session.bizId = biz.id;
        session.business = biz;
        state.isCloudSync = true;
        state.settings = buildSettings(biz, session.user);
        await hydrate();
        return 'ready';
      }
    }
  } catch (e) {
    console.warn('Backend cloud check skipped, using live persistent workspace:', e);
  }

  // 2. Persistent Live Workspace Mode
  loadFromLocal();
  state = {
    ...state,
    signedIn: true,
    isCloudSync: false,
    serverError: null,
    onboarded: true,
    settings: state.settings || buildSettings(null, { name: 'Luke Hamilton' })
  };
  emit();
  return 'ready';
}

export async function hydrate() {
  try {
    const [leadsR, apptR, notifR] = await Promise.all([
      api('GET', '/api/leads'),
      api('GET', '/api/appointments'),
      api('GET', '/api/notifications'),
    ]);

    if (leadsR.ok && Array.isArray(leadsR.rows) && leadsR.rows.length) {
      state.leads = leadsR.rows.map(r => ({
        id: r.id,
        firstName: (r.name || '').split(' ')[0] || 'Lead',
        lastName: (r.name || '').split(' ').slice(1).join(' ') || '',
        phone: r.phone || '',
        email: r.email || '',
        company: '',
        source: r.source || 'Phone',
        serviceInterest: r.notes || 'Emergency Trade Request',
        estimatedValue: r.value || 5000,
        status: r.status ? (r.status.charAt(0).toUpperCase() + r.status.slice(1)) : 'New',
        score: 90,
        tags: ['Cloud Lead'],
        assignedOwner: 'Luke Hamilton',
        notes: [{ text: r.notes || 'Captured in CRM', author: 'System', createdAt: r.createdAt || nowISO() }],
        messages: [],
        preferredChannel: 'SMS',
        createdAt: r.createdAt || nowISO(),
        updatedAt: r.updatedAt || nowISO(),
        lastContactAt: r.updatedAt || null,
        nextFollowUpAt: null,
        automationActive: true,
        archived: false
      }));
    }
    state.isCloudSync = true;
  } catch (e) {
    console.warn('Cloud hydration failed, keeping local leads:', e);
  }
  emit();
  return state;
}

export async function platformLogin(email, password) {
  const r = await api('POST', '/api/auth/login', { email, password });
  if (!r.ok) return { ok: false, error: r.error || 'Login failed' };
  return { ok: true, mode: await boot() };
}

export async function platformLogout() {
  await api('POST', '/api/auth/logout', {});
  session.user = null; session.bizId = null; session.business = null;
  state.isCloudSync = false;
  emit();
}

export function loadState() { return state; }
export function getLead(id) { return state.leads.find(l => l.id === id); }
export function leadActivities(leadId) {
  const lead = getLead(leadId);
  const acts = [];
  if (lead) {
    if (lead.notes) {
      lead.notes.forEach(n => acts.push({ id: uid('act'), leadId, type: 'note', text: n.text, at: n.createdAt, by: n.author }));
    }
    if (lead.messages) {
      lead.messages.forEach(m => acts.push({ id: uid('act'), leadId, type: m.sender === 'user' ? 'sms_sent' : 'sms_received', text: m.text, at: m.time, by: m.sender }));
    }
  }
  return acts.sort((a, b) => new Date(b.at) - new Date(a.at));
}

export function leadAppointments(leadId) { return state.appointments.filter(a => a.leadId === leadId); }
export function leadTasks(leadId) { return state.tasks.filter(t => t.leadId === leadId); }

/* ---------------- FULL MUTATIONS ---------------- */

export async function addLead(data) {
  const firstName = (data.firstName || 'New').trim();
  const lastName = (data.lastName || 'Lead').trim();
  const newLead = {
    id: uid('lead'),
    firstName,
    lastName,
    phone: data.phone || '',
    email: data.email || '',
    company: data.company || '',
    source: data.source || 'Manual Input',
    serviceInterest: data.serviceInterest || 'General Trade Inquiry',
    estimatedValue: Number(data.estimatedValue) || 4500,
    status: data.status || 'New',
    score: 85,
    tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : ['New Lead']),
    assignedOwner: data.assignedOwner || (state.settings ? state.settings.ownerName : 'Luke Hamilton'),
    notes: data.notes ? [{ text: data.notes, author: 'User', createdAt: nowISO() }] : [],
    messages: [],
    preferredChannel: 'SMS',
    createdAt: nowISO(),
    updatedAt: nowISO(),
    lastContactAt: null,
    nextFollowUpAt: daysFromNowISO(1, 10),
    automationActive: true,
    archived: false
  };

  state.leads.unshift(newLead);
  saveToLocal();
  emit();

  // Write-through to server if online
  if (state.isCloudSync && session.bizId) {
    try {
      await api('POST', '/api/leads', {
        businessId: session.bizId,
        name: `${firstName} ${lastName}`,
        phone: newLead.phone,
        email: newLead.email,
        source: newLead.source,
        notes: newLead.serviceInterest,
        value: newLead.estimatedValue
      });
    } catch(e){}
  }

  return { ok: true, lead: newLead };
}

export async function updateLead(id, patch, meta = {}) {
  const lead = getLead(id);
  if (!lead) return { ok: false, error: 'Lead not found.' };

  Object.assign(lead, patch);
  lead.updatedAt = nowISO();

  saveToLocal();
  emit();

  // Write-through to server if online
  if (state.isCloudSync) {
    try {
      await api('PATCH', `/api/leads/${encodeURIComponent(id)}`, {
        name: `${lead.firstName} ${lead.lastName}`,
        phone: lead.phone,
        email: lead.email,
        status: lead.status.toLowerCase(),
        notes: lead.notes && lead.notes.length ? lead.notes[lead.notes.length - 1].text : undefined
      });
    } catch(e){}
  }

  return { ok: true, lead };
}

export async function changeStatus(id, newStatus) {
  const lead = getLead(id);
  if (!lead) return { ok: false, error: 'Lead not found.' };

  lead.status = newStatus;
  lead.updatedAt = nowISO();

  // If moved to Won/Completed, trigger review funnel toast
  if (newStatus === 'Booked' || newStatus === 'Won') {
    toast(`🎉 Lead moved to ${newStatus}! 5-Star Review Request unlocked.`, 'success');
  }

  saveToLocal();
  emit();

  if (state.isCloudSync) {
    try { await api('PATCH', `/api/leads/${encodeURIComponent(id)}`, { status: newStatus.toLowerCase() }); } catch(e){}
  }

  return { ok: true };
}

export async function addNote(leadId, text, author = 'Luke Hamilton') {
  const lead = getLead(leadId);
  if (!lead || !text.trim()) return { ok: false, error: 'Write note first.' };

  if (!lead.notes) lead.notes = [];
  lead.notes.push({ text: text.trim(), author, createdAt: nowISO() });
  lead.updatedAt = nowISO();

  saveToLocal();
  emit();
  return { ok: true };
}

export async function sendMessage(leadId, text, channel = 'SMS') {
  const lead = getLead(leadId);
  if (!lead || !text.trim()) return { ok: false, error: 'Message cannot be empty.' };

  if (!lead.messages) lead.messages = [];
  lead.messages.push({ sender: 'user', text: text.trim(), time: nowISO(), channel });
  lead.lastContactAt = nowISO();
  lead.updatedAt = nowISO();

  // Log activity
  state.activities.unshift({
    id: uid('act'),
    leadId,
    type: 'sms_sent',
    channel: 'SMS',
    message: text.trim(),
    createdAt: nowISO(),
    createdBy: 'Luke Hamilton'
  });

  saveToLocal();
  emit();
  toast(`💬 ${channel} sent to ${lead.firstName} (${lead.phone})!`, 'success');
  return { ok: true };
}

export async function deleteLead(id) {
  state.leads = state.leads.filter(l => l.id !== id);
  saveToLocal();
  emit();
  if (state.isCloudSync) {
    try { await api('DELETE', `/api/leads/${encodeURIComponent(id)}`); } catch(e){}
  }
  return { ok: true };
}

export async function duplicateLead(id) {
  const src = getLead(id);
  if (!src) return { ok: false, error: 'Lead not found.' };
  return addLead({
    firstName: `${src.firstName} (Copy)`,
    lastName: src.lastName,
    phone: src.phone,
    email: src.email,
    company: src.company,
    source: src.source,
    serviceInterest: src.serviceInterest,
    estimatedValue: src.estimatedValue,
    status: 'New'
  });
}

export async function archiveLead(id, archived = true) {
  const lead = getLead(id);
  if (!lead) return { ok: false };
  lead.archived = archived;
  saveToLocal();
  emit();
  return { ok: true };
}

export function bulkUpdate(ids, patch) {
  ids.forEach(id => {
    const l = getLead(id);
    if (l) Object.assign(l, patch);
  });
  saveToLocal();
  emit();
  return { ok: true };
}

export function toggleLeadSelected(id, selected) {
  if (selected) { if (!state.selectedLeadIds.includes(id)) state.selectedLeadIds.push(id); }
  else state.selectedLeadIds = state.selectedLeadIds.filter(s => s !== id);
  emit();
}
export function clearSelection() { state.selectedLeadIds = []; emit(); }

/* ---------------- AVA LIVE CALL SIMULATOR & WEBHOOK CONNECTOR ---------------- */
export function simulateAvaCall(customData = {}) {
  const caller = customData.name || 'David Richardson';
  const phone = customData.phone || '(561) 813-8602';
  const trade = customData.trade || 'Roofing';
  const service = customData.service || 'Severe Storm Leak — Shingle & Ceiling Repair';
  const value = customData.value || 9200;

  const parts = caller.split(' ');
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ') || 'Caller';

  const newLead = {
    id: uid('lead_ava'),
    firstName,
    lastName,
    phone,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@samplemail.com`,
    company: `${lastName} Property (Tampa, FL)`,
    source: 'Ava 24/7 Voice AI',
    serviceInterest: service,
    estimatedValue: value,
    status: 'New',
    score: 98,
    tags: ['⚡ Live Ava Call', 'Emergency', trade],
    assignedOwner: state.settings ? state.settings.ownerName : 'Luke Hamilton',
    notes: [
      {
        text: `Ava answered call in 1 ring on (561) 813-8602. Homeowner requested emergency inspection for heavy storm ceiling leak. Full audio recorded.`,
        author: 'Ava Voice AI',
        createdAt: nowISO()
      }
    ],
    callRecording: {
      url: 'https://actions.google.com/sounds/v1/telephones/telephone_ring.ogg',
      duration: 94,
      transcript: `Hi, I saw your Google listing. A massive branch fell on our roof during the thunderstorm and rain is dripping into our living room ceiling right now. Can someone come out and tarp it and quote the repair?`,
      summary: `Emergency branch puncture & active roof leak. Homeowner needs emergency tarping and insurance repair quote.`
    },
    messages: [
      { sender: 'customer', text: 'Call completed with Ava 24/7 AI Phone Receptionist on (561) 813-8602.', time: nowISO() },
      { sender: 'system', text: `⚡ 90s Speed-to-Lead SMS triggered: "Hey ${firstName}, Ava let us know about your emergency leak. Dispatching technician right now."`, time: nowISO() }
    ],
    preferredChannel: 'SMS',
    createdAt: nowISO(),
    updatedAt: nowISO(),
    lastContactAt: nowISO(),
    nextFollowUpAt: daysFromNowISO(0, 1),
    automationActive: true,
    archived: false
  };

  state.leads.unshift(newLead);
  state.notifications.unshift({
    id: uid('ntf'),
    type: 'new_lead',
    title: `📞 Inbound Call from Ava: ${firstName} ${lastName}`,
    body: `New $${value.toLocaleString()} ${service} lead captured on (561) 813-8602.`,
    createdAt: nowISO(),
    read: false
  });

  saveToLocal();
  emit();

  toast(`📞 AVA CALL CAPTURED: ${firstName} ${lastName} ($${value.toLocaleString()} ${trade}) added to New Leads!`, 'success');
  return newLead;
}

/* ---------------- APPOINTMENTS & CALENDAR ---------------- */
export async function bookAppointment(leadId, { startTime, service, staff }) {
  const lead = getLead(leadId);
  const newAppt = {
    id: uid('appt'),
    leadId: leadId || null,
    customer: lead ? `${lead.firstName} ${lead.lastName}` : 'Direct Appointment',
    startTime: startTime || daysFromNowISO(1, 14, 0),
    service: service || 'On-Site Diagnostic & Estimate',
    staff: staff || 'Luke Hamilton',
    status: 'Confirmed'
  };

  state.appointments.push(newAppt);
  if (lead && lead.status !== 'Booked') {
    lead.status = 'Booked';
    lead.updatedAt = nowISO();
  }

  saveToLocal();
  emit();
  toast(`📅 Appointment booked for ${newAppt.customer}!`, 'success');
  return { ok: true, appointment: newAppt };
}

export async function setAppointmentStatus(apptId, status) {
  const a = state.appointments.find(x => x.id === apptId);
  if (a) {
    a.status = status;
    saveToLocal();
    emit();
  }
  return { ok: true };
}

/* ---------------- TASKS & AUTOMATIONS ---------------- */
export async function completeTask(taskId) {
  const t = state.tasks.find(x => x.id === taskId);
  if (t) { t.completed = true; saveToLocal(); emit(); }
  return { ok: true };
}
export async function snoozeTask(taskId, hours = 24) {
  const t = state.tasks.find(x => x.id === taskId);
  if (t) { t.dueAt = new Date(Date.now() + hours * 3600000).toISOString(); saveToLocal(); emit(); }
  return { ok: true };
}
export async function addTask(task) {
  const t = { id: uid('task'), completed: false, createdAt: nowISO(), ...task };
  state.tasks.push(t);
  saveToLocal();
  emit();
  return { ok: true, task: t };
}

export async function toggleAutomation(id) {
  const a = state.automations.find(x => x.id === id);
  if (a) { a.active = !a.active; saveToLocal(); emit(); }
  return { ok: true };
}
export async function saveAutomation(auto) {
  const idx = state.automations.findIndex(x => x.id === auto.id);
  if (idx >= 0) state.automations[idx] = auto;
  else state.automations.push({ id: uid('auto'), ...auto });
  saveToLocal();
  emit();
  return { ok: true };
}
export async function deleteAutomation(id) {
  state.automations = state.automations.filter(x => x.id !== id);
  saveToLocal();
  emit();
  return { ok: true };
}
export async function startAutomation(leadId, autoId) {
  const l = getLead(leadId);
  if (l) { l.automationActive = true; l.automationId = autoId; saveToLocal(); emit(); }
  return { ok: true };
}
export async function stopAutomation(leadId) {
  const l = getLead(leadId);
  if (l) { l.automationActive = false; saveToLocal(); emit(); }
  return { ok: true };
}

export async function saveTemplate(tpl) {
  const idx = state.templates.findIndex(x => x.id === tpl.id);
  if (idx >= 0) state.templates[idx] = tpl;
  else state.templates.push({ id: uid('tpl'), ...tpl });
  saveToLocal();
  emit();
  return { ok: true };
}
export async function deleteTemplate(id) {
  state.templates = state.templates.filter(x => x.id !== id);
  saveToLocal();
  emit();
  return { ok: true };
}

/* ---------------- NOTIFICATIONS ---------------- */
export async function markNotificationRead(id) {
  const n = state.notifications.find(x => x.id === id);
  if (n) { n.read = true; saveToLocal(); emit(); }
  return { ok: true };
}
export async function markAllNotificationsRead() {
  state.notifications.forEach(n => { n.read = true; });
  saveToLocal();
  emit();
  return { ok: true };
}
export async function clearNotifications() {
  state.notifications = [];
  saveToLocal();
  emit();
  return { ok: true };
}

/* ---------------- SETTINGS ---------------- */
export async function saveSettings(patch) {
  state.settings = { ...(state.settings || buildSettings(null, null)), ...patch };
  saveToLocal();
  emit();
  toast('Settings saved');
  return { ok: true };
}

export function setOnboarded() { state.onboarded = true; saveToLocal(); emit(); }
export async function addActivity(act) {
  state.activities.unshift({ id: uid('act'), createdAt: nowISO(), ...act });
  saveToLocal();
  emit();
  return { ok: true };
}
export function resetDemoData() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  state.leads = [...SEED_LEADS];
  state.automations = [...SEED_AUTOMATIONS];
  state.templates = [...SEED_TEMPLATES];
  saveToLocal();
  emit();
  toast('Reset to default Florida trade leads', 'info');
}
