/* ============================================================
   VANTORX ONBOARDING — state.js
   Draft-onboarding store with localStorage persistence.
   UI never touches localStorage directly.
   ============================================================ */

const KEY = 'vantorx_onboarding_v1';

function defaultHours() {
  return {
    mon: { open: '9:00 AM', close: '7:00 PM', closed: false },
    tue: { open: '9:00 AM', close: '7:00 PM', closed: false },
    wed: { open: '9:00 AM', close: '7:00 PM', closed: false },
    thu: { open: '9:00 AM', close: '7:00 PM', closed: false },
    fri: { open: '9:00 AM', close: '8:00 PM', closed: false },
    sat: { open: '10:00 AM', close: '6:00 PM', closed: false },
    sun: { open: '10:00 AM', close: '4:00 PM', closed: true },
  };
}

function blank() {
  return {
    version: 1,
    completed: false,
    completedAt: null,
    draft: {
      name: '', contact: '', email: '', phone: '', industry: '', city: '', website: '',
      services: [],            // { name, price, minutes }
      hours: defaultHours(),
      policies: { cancellation: '', walkins: '', payment: '' },
      knowledge: [],           // { q, a }
      notes: '',
      ai: {
        name: 'Ava',
        personality: 'Friendly',
        greeting: '',
        transferNumber: '',
        transferWhen: 'If the caller asks for a human, or the request is outside the AI\u2019s knowledge.',
      },
      connections: { calendar: false, phone: false, leadflow: false, clienthub: false, aeo: false },
      tests: { info: false, services: false, hours: false, greeting: false, booking: false, transfer: false, aeo: false },
    },
  };
}

function deepMerge(base, saved) {
  if (!saved || typeof saved !== 'object') return base;
  const out = Array.isArray(base) ? [] : { ...base };
  for (const k of Object.keys(base)) {
    if (saved[k] === undefined) continue;
    const b = base[k], s = saved[k];
    if (b && typeof b === 'object' && !Array.isArray(b) && s && typeof s === 'object' && !Array.isArray(s)) out[k] = deepMerge(b, s);
    else if (Array.isArray(b) && Array.isArray(s)) out[k] = s;
    else out[k] = s;
  }
  return out;
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    const parsed = JSON.parse(raw);
    const base = blank();
    return { ...base, completed: !!parsed.completed, completedAt: parsed.completedAt || null, draft: deepMerge(base.draft, parsed.draft) };
  } catch (e) {
    return blank();
  }
}

let state = load();
const listeners = new Set();

export function getState() { return state; }

export function setState(mutator) {
  mutator(state);
  persist();
  listeners.forEach(fn => { try { fn(state); } catch (e) { console.error(e); } });
}

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function factoryReset() {
  localStorage.removeItem(KEY);
  state = blank();
  listeners.forEach(fn => { try { fn(state); } catch (e) { console.error(e); } });
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.error('persist failed', e); }
}
