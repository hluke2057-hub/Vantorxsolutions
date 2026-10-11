/* ============================================================
   VANTORX ADMIN — realapi.js
   The ONLY data layer of the admin console. Every page talks to
   the platform server (same origin, cookie session). There is no
   demo store: if the server is unreachable, pages show an honest
   error — they never fall back to fake data.
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
  } catch {
    return { status: 0, error: 'Platform server not reachable. Start platform/server.ps1 and reload.' };
  }
  let data = {};
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) return { status: res.status, error: data.error || `HTTP ${res.status}`, ...data };
  return { status: res.status, ...data };
}

export const getMe = () => api('GET', '/api/auth/me');
export const login = (email, password) => api('POST', '/api/auth/login', { email, password });
export const logout = () => api('POST', '/api/auth/logout', {});
export const overview = () => api('GET', '/api/admin/overview');
export const audit = () => api('GET', '/api/admin/audit');
export const changeRequests = () => api('GET', '/api/change-requests');
export const setRequestStatus = (id, status) => api('PATCH', `/api/change-requests/${encodeURIComponent(id)}`, { status });
export const notifications = () => api('GET', '/api/notifications');
export const markNotificationsRead = () => api('POST', '/api/notifications/read', {});
