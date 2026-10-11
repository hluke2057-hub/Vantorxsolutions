/* ============================================================
   VANTORX AI RECEPTIONIST — store.js
   Tiny reactive store over the backend. NO localStorage as
   production truth: every page view fetches live state from
   the platform API. Auth gate mirrors the portal.
   ============================================================ */

import { api } from './api.js';

const listeners = new Set();

export const store = {
  user: null,
  business: null,
  businesses: [],
  config: null,
  providers: [],
  readiness: null,
  services: [],
  hours: null,
  appointments: [],
  calls: [],
  notifications: [],
  loaded: false,
};

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function emit() { listeners.forEach((f) => f()); }

export async function boot() {
  try {
    const me = await api.me();
    store.user = me.user;
  } catch {
    store.user = null;
    store.loaded = true;
    emit();
    return store;
  }
  await refreshAll();
  return store;
}

export async function refreshAll() {
  const bizs = await api.businesses();
  store.businesses = bizs;
  const desired = sessionStorage.getItem('rx-biz');
  store.business = bizs.find((b) => b.id === desired) || bizs[0] || null;
  if (!store.business) { store.loaded = true; emit(); return store; }
  sessionStorage.setItem('rx-biz', store.business.id);
  const bid = store.business.id;
  const [cfg, appts, calls, notifs] = await Promise.all([
    api.config(bid),
    api.appointments(bid),
    api.calls(bid),
    api.notifications().catch(() => []),
  ]);
  store.config = cfg.config;
  store.providers = cfg.providers || [];
  store.readiness = cfg.readiness || null;
  store.appointments = appts;
  store.calls = calls;
  store.notifications = notifs;
  store.loaded = true;
  emit();
  return store;
}

export async function switchBusiness(id) {
  sessionStorage.setItem('rx-biz', id);
  await refreshAll();
}

/* wrap an action with a global busy flag + error toast */
export async function act(fn, onErr) {
  store.busy = true; emit();
  try { return await fn(); }
  catch (e) { if (onErr) onErr(e); else console.error(e); return null; }
  finally { store.busy = false; emit(); }
}

export async function logout() {
  try { await api.logout(); } catch { /* ignore */ }
  store.user = null;
  emit();
}
