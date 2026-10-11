/* ============================================================
   VANTORX MARKETS INTELLIGENCE — state.js (v2, LIVE ONLY)
   No demo dataset exists in this build. `markets` stays empty
   until a real Polymarket sync succeeds; nothing synthetic is
   ever seeded. Only user preferences (settings) persist —
   market data is always re-fetched live.
   ============================================================ */

const KEY = 'vantorx_markets_v2';
const LEGACY_KEY = 'vantorx_markets_v1'; // old demo build — discarded on load

function baseState() {
  return {
    version: 2,
    account: { name: 'Guest', role: 'Local session' },
    sources: {
      live: false,          // true only after a successful live sync
      lastSync: null,       // ISO string of the last successful sync
      error: null,          // last sync error, shown honestly in the UI
      syncing: false,
      endpoint: 'https://gamma-api.polymarket.com',
    },
    markets: [],            // live Polymarket data only — never seeded
    notifications: [],      // nothing invented; fills only if real features emit events
    settings: {
      liveSync: true,       // auto-sync live Polymarket data on boot
      compactTables: false,
    },
  };
}

function load() {
  try {
    localStorage.removeItem(LEGACY_KEY);
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && saved.version === 2) {
        const base = baseState();
        base.settings = { ...base.settings, ...(saved.settings || {}) };
        return base;
      }
    }
  } catch (e) { /* corrupted or private mode — fall through to defaults */ }
  return baseState();
}

let state = load();
const listeners = new Set();

export function getState() { return state; }

export function setState(mutator) {
  mutator(state);
  persist();
  listeners.forEach(fn => fn(state));
}

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

/* only preferences are persisted; market data always comes from a live sync */
function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: 2, settings: state.settings }));
  } catch (e) { /* private mode */ }
}
