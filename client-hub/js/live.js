/* ============================================================
   VANTORX CLIENT HUB — live.js (PRODUCTION data plumbing)
   Real platform server is the ONLY source of truth. Adapters
   map server rows to the UI shapes. Unknown values are null or
   omitted — never invented. No demo data anywhere.
   ============================================================ */

export async function api(method, path, body) {
  let res;
  try {
    res = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    return { ok: false, status: 0, error: 'Platform server not reachable. Start platform/server.ps1 and reload.' };
  }
  let data = {};
  try { data = await res.json(); } catch { /* empty */ }
  if (!res.ok) return { ok: false, status: res.status, error: data.error || `HTTP ${res.status}`, ...data };
  return { ok: true, status: res.status, ...data };
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* ---------------- adapters ---------------- */

export function adaptCall(row, appointments) {
  const blocks = String(row.transcript || '')
    .split(' / ')
    .filter(Boolean)
    .map(line => {
      const i = line.indexOf(':');
      return i > 0
        ? { who: /^(caller|client|customer)/i.test(line.slice(0, i)) ? 'human' : 'ai', text: line.slice(i + 1).trim(), t: '' }
        : { who: 'ai', text: line, t: '' };
    });
  const bookedAppt = (appointments || []).find(a =>
    new Date(a.at).getTime() - new Date(row.at).getTime() >= 0 &&
    new Date(a.at).getTime() - new Date(row.at).getTime() < 7 * 864e5);
  return {
    id: row.id,
    caller: (row.from || '').replace(/^\+1\s*/, '') || 'Unknown caller',
    phone: row.from || '',
    date: row.at,
    duration: null,                    // server does not record call length yet — shown honestly as —
    outcome: row.outcome || 'info',
    summary: row.summary || '',
    apptId: bookedAppt ? bookedAppt.id : null,
    transcriptBlocks: blocks,
    note: row.notes || '',
  };
}

export function adaptLead(row) {
  return {
    id: row.id,
    name: row.name,
    service: null,                     // real lead source does not track a service — not shown
    source: row.source || '—',
    status: row.status || 'New',
    score: null,                       // no server-side lead scoring — no fake score bars
    lastContact: row.updatedAt || row.createdAt || null,
    nextFollowUp: null,                // real follow-up scheduling lives in LeadFlow; measured there, not invented here
    phone: row.phone || '',
    email: row.email || '',
    notes: row.notes || '',
  };
}

export function statusToHub(serverStatus) {
  return serverStatus === 'Open' ? 'Submitted' : serverStatus === 'In Progress' ? 'In Progress' : 'Completed';
}
export function statusToServer(hubStatus) {
  return hubStatus === 'Submitted' ? 'Open' : hubStatus;
}

/* ---------------- session + tenant discovery ---------------- */

export const session = { user: null, bizId: null, needOnboarding: false };

export async function discoverSession() {
  const me = await api('GET', '/api/auth/me');
  if (!me.ok || !me.user) return 'signin';
  if (me.user.role === 'vantorx_admin') return 'admin';
  session.user = me.user;

  for (let i = 0; i < 10; i++) {
    const b = await api('GET', '/api/businesses');
    if (b.status === 200 && b.rows && b.rows.length) { session.bizId = b.rows[0].id; break; }
    if (b.status === 200 && (!b.rows || !b.rows.length)) {
      session.needOnboarding = true;
      return 'onboard';
    }
    if (b.status === 404) { await sleep(400); continue; }
    return 'error';
  }
  if (!session.bizId) return 'onboard';
  return 'ready';
}
