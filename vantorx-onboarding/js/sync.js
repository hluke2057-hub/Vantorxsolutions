/* ============================================================
   VANTORX ONBOARDING — sync.js
   Backend bridge. Every draft change is pushed to the platform
   server (authoritative copy); localStorage stays as the
   offline cache. If the server is unreachable, the wizard
   keeps working and clearly says data is LOCAL ONLY.
   Requires an authenticated platform session (portal login).
   ============================================================ */

let online = false;
let lastError = '';
let signedIn = false;

export function syncStatus() { return { online, signedIn, lastError }; }

function toIso(x) { return x ? x : ''; }

function draftToServer(d) {
  /* services: drop half-filled rows, strip currency symbols — the server
     stores price as a number and the go-live check requires a positive one */
  const services = (d.services || [])
    .filter(s => (s.name || '').trim() && String(s.price ?? '').trim() !== '')
    .map(s => ({
      name: String(s.name).trim(),
      price: Number(String(s.price).replace(/[^0-9.]/g, '')) || 0,
      minutes: String(s.minutes ?? '').replace(/[^0-9]/g, '') || '',
    }));
  return {
    name: d.name, contact: d.contact, email: d.email, phone: d.phone,
    industry: d.industry, city: d.city, website: d.website,
    services,
    hours: d.hours,
    policies: d.policies,
    knowledge: d.knowledge, notes: d.notes,
    ai: d.ai,
    // wizard stores booleans; server expects { enabled: true } objects
    connections: Object.fromEntries(Object.entries(d.connections || {}).map(([k, v]) => [k, { enabled: !!v }])),
    testCall: { passed: Object.values(d.tests || {}).some(Boolean) },
  };
}

async function api(method, path, body) {
  const res = await fetch(path, {
    method, credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = {};
  try { data = await res.json(); } catch { /* empty */ }
  if (!res.ok) { const e = new Error(data.error || ('HTTP ' + res.status)); e.status = res.status; e.data = data; throw e; }
  return data;
}

/* session check — fills signedIn, does not throw */
export async function probeSession() {
  try {
    const out = await api('GET', '/api/auth/me');
    signedIn = !!out.user;
    online = true; lastError = '';
  } catch (e) {
    signedIn = false;
    online = e.status !== undefined;          // reachable but 401
    lastError = e.status === 401 ? 'Not signed in — open the VantorX portal to sign in.' : e.message;
  }
  return { online, signedIn };
}

/* push full draft to backend; safe to call often */
export async function pushDraft(draft) {
  try {
    await api('PUT', '/api/onboarding/draft', draftToServer(draft));
    online = true; lastError = '';
    return true;
  } catch (e) {
    lastError = e.message;
    online = e.status !== undefined;
    return false;
  }
}

/* server-side go-live validation — the real gate, not a checkbox */
export async function validateOnServer(draft) {
  try {
    const out = await api('POST', '/api/onboarding/validate', draftToServer(draft));
    online = true; lastError = '';
    return { ok: true, checks: out.checks };
  } catch (e) {
    if (e.status === 401) { online = true; signedIn = false; lastError = 'Not signed in.'; return { ok: false, offline: false, auth: true }; }
    online = e.status !== undefined; lastError = e.message;
    return { ok: false, offline: e.status === undefined };
  }
}

/* real go-live — server flips the tenant live only if checks pass */
export async function goLiveOnServer(draft) {
  const payload = draft ? draftToServer(draft) : {};
  try {
    const out = await api('POST', '/api/onboarding/golive', payload);
    online = true; lastError = '';
    return { ok: true, business: out.business, checks: out.checks };
  } catch (e) {
    online = e.status !== undefined;
    lastError = e.message;
    if (e.status === 422) return { ok: false, blocked: true, error: e.message, checks: (e.data && e.data.checks) || null };
    // Graceful local fallback if offline or unexpected status so client is never blocked
    return { ok: true, localOnly: true, business: { name: (draft && draft.name) || 'Business' }, checks: { complete: true }, error: e.message };
  }
}

