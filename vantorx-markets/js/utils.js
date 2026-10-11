/* ============================================================
   VANTORX CLIENT HUB — utils.js
   Shared helpers. No dependencies.
   ============================================================ */

export const STATUS_META = {
  Submitted:   { cls: 'req-status-submitted',   icon: '📨' },
  'In Review': { cls: 'req-status-in-review',   icon: '🔎' },
  'In Progress': { cls: 'req-status-in-progress', icon: '🛠️' },
  'Waiting on Client': { cls: 'req-status-waiting', icon: '⏸️' },
  Completed:   { cls: 'req-status-completed',   icon: '✅' },
};

export const CALL_OUTCOMES = {
  answered:    { label: 'Answered',    cls: 'status-green' },
  missed:      { label: 'Missed',      cls: 'status-red' },
  transferred: { label: 'Transferred', cls: 'status-purple' },
  booked:      { label: 'Booked',      cls: 'status-gold' },
  faq:         { label: 'Question Answered', cls: 'status-blue' },
};

export const APPT_STATUS = {
  Confirmed:  'status-green',
  Completed:  'status-dim',
  Rescheduled: 'status-orange',
  Cancelled:  'status-red',
};

export function esc(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function fmtDate(iso) {
  return new Date(iso).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

export function fmtDateTime(iso) {
  return `${fmtDate(iso)} · ${fmtTime(iso)}`;
}

export function fmtDuration(sec) {
  if (sec == null) return '—';
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

export function relTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return fmtDate(iso);
}

export function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/* Deterministic PRNG so demo data is stable across reloads until edited */
export function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function scoreBar(score) {
  return `<span class="score-bar"><i style="width:${Math.min(100, score)}%"></i></span>${score}`;
}

export function initials(name) {
  return String(name || '?').split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const k = keyFn(item);
    (acc[k] = acc[k] || []).push(item);
    return acc;
  }, {});
}

export function monthLabel(y, m) {
  return new Date(y, m, 1).toLocaleDateString([], { month: 'long', year: 'numeric' });
}

export function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/* USD volume formatting; null/undefined renders as an honest dash */
export function fmtUsd(n) {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}k`;
  return `$${Math.round(n)}`;
}
