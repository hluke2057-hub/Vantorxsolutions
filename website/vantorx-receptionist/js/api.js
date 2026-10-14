/* ============================================================
   VANTORX AI RECEPTIONIST — api.js
   Thin authenticated client for the platform backend.
   Same-origin session cookie (HttpOnly) — no tokens in JS.
   The UI renders exactly what the server returns; nothing is
   faked client-side.
   ============================================================ */

async function jfetch(path, opts = {}) {
  const res = await fetch(path, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    const err = new Error((data && data.error) || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  me: () => jfetch('/api/auth/me'),
  login: (email, password) => jfetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => jfetch('/api/auth/logout', { method: 'POST', body: '{}' }),
  signup: (payload) => jfetch('/api/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),

  businesses: () => jfetch('/api/businesses').then((d) => d.rows || []),

  /* receptionist */
  config: (businessId) => jfetch(`/api/receptionist/config?businessId=${encodeURIComponent(businessId)}`),
  saveConfig: (businessId, patch) => jfetch('/api/receptionist/config', { method: 'PUT', body: JSON.stringify({ businessId, ...patch }) }),
  readiness: (businessId) => jfetch(`/api/receptionist/readiness?businessId=${encodeURIComponent(businessId)}`),
  activate: (businessId) => jfetch('/api/receptionist/activate', { method: 'POST', body: JSON.stringify({ businessId, action: 'activate' }) }),
  deactivate: (businessId) => jfetch('/api/receptionist/activate', { method: 'POST', body: JSON.stringify({ businessId, action: 'deactivate' }) }),

  talk: (payload) => jfetch('/api/receptionist/talk', { method: 'POST', body: JSON.stringify(payload) }),

  services: (businessId) => jfetch(`/api/services?businessId=${encodeURIComponent(businessId)}`).then((d) => d.rows || []),
  hours: (businessId) => jfetch(`/api/hours?businessId=${encodeURIComponent(businessId)}`).then((d) => d.hours || d.row || null),
  appointments: (businessId) => jfetch(`/api/appointments?businessId=${encodeURIComponent(businessId)}`).then((d) => d.rows || []),
  calls: (businessId) => jfetch(`/api/calls?businessId=${encodeURIComponent(businessId)}`).then((d) => d.rows || []),
  notifications: () => jfetch('/api/notifications').then((d) => d.rows || []),
};
