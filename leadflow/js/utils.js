/* ============================================================
   VANTORX LEADFLOW — utils.js
   Shared helpers: dates, formatting, scoring, CSV export
   ============================================================ */

export const STATUSES = ['New', 'Contacted', 'Responded', 'Booked', 'Lost'];
export const STATUS_COLORS = {
  New: '#60a5fa', Contacted: '#fbbf24', Responded: '#a78bfa',
  Booked: '#4ade80', Lost: '#f87171'
};

export const SOURCES = ['Phone', 'Website', 'Instagram', 'Facebook', 'TikTok', 'Google', 'Walk-in', 'Referral', 'Manual', 'Other'];

export const APPOINTMENT_STATUSES = ['Requested', 'Confirmed', 'Completed', 'Canceled', 'No-show'];

export const CHANNELS = ['SMS', 'Email'];

export const ROLES = ['Admin', 'Manager', 'Sales Rep', 'Viewer'];

/* ---------- ids ---------- */
let _idCounter = Date.now();
export function uid(prefix = 'id') {
  return `${prefix}_${(_idCounter++).toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/* ---------- dates ---------- */
export function nowISO() { return new Date().toISOString(); }

export function daysAgoISO(days, hour = 10) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
}

export function daysFromNowISO(days, hour = 10, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function fmtDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function fmtTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/* Relative label like "2h ago" / "in 3d" */
export function relTime(iso) {
  if (!iso) return '—';
  const diff = new Date(iso) - Date.now();
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60000);
  const hours = Math.round(abs / 3600000);
  const days = Math.round(abs / 86400000);
  let label;
  if (mins < 1) return 'just now';
  if (mins < 60) label = `${mins}m`;
  else if (hours < 24) label = `${hours}h`;
  else label = `${days}d`;
  return diff < 0 ? `${label} ago` : `in ${label}`;
}

export function isToday(iso) {
  if (!iso) return false;
  const d = new Date(iso), n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}

export function isOverdue(iso) {
  return iso && new Date(iso) < new Date();
}

export function isWithinDays(iso, days) {
  if (!iso) return false;
  return (Date.now() - new Date(iso)) / 86400000 <= days;
}

/* ---------- numbers / money ---------- */
export function fmtMoney(n) {
  if (n == null || isNaN(n)) return '—';
  return '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function fmtPct(n, digits = 0) {
  return (n * 100).toFixed(digits) + '%';
}

export function fmtNum(n) {
  return Number(n || 0).toLocaleString('en-US');
}

/* ---------- lead score (transparent local heuristic) ---------- */
export function computeScore(lead, activities = []) {
  let s = 30;
  if (lead.phone) s += 8;
  if (lead.email) s += 8;
  if (lead.estimatedValue > 500) s += 8;
  if (lead.estimatedValue > 2000) s += 6;
  if (lead.status === 'Responded') s += 20;
  if (lead.status === 'Booked') s += 30;
  if (lead.status === 'Lost') s -= 25;
  const replies = activities.filter(a => a.type === 'reply').length;
  s += replies * 10;
  const sent = activities.filter(a => a.type && a.type.includes('sent')).length;
  s += Math.min(sent, 3) * 3;
  if (isWithinDays(lead.createdAt, 7)) s += 6;
  return Math.max(0, Math.min(100, s));
}

export function scoreClass(score) {
  if (score >= 70) return 'score-high';
  if (score >= 45) return 'score-mid';
  return 'score-low';
}

/* ---------- template variables ---------- */
export function renderTemplate(body, lead, extra = {}) {
  if (!body) return '';
  const business = extra.businessName || 'Your Business';
  const map = {
    first_name: lead?.firstName || 'there',
    last_name: lead?.lastName || '',
    business_name: business,
    service: lead?.serviceInterest || 'your service',
    appointment_time: extra.appointmentTime || 'your upcoming appointment',
    owner_name: extra.ownerName || 'The Team'
  };
  return body.replace(/\{\{(\w+)\}\}/g, (_, key) => map[key] != null ? map[key] : `{{${key}}}`);
}

/* ---------- csv ---------- */
export function toCSV(rows, columns) {
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.map(c => c.label).join(',');
  const lines = rows.map(r => columns.map(c => esc(r[c.key])).join(','));
  return [header, ...lines].join('\n');
}

export function downloadFile(filename, content, type = 'text/csv') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

export function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') inQ = false;
      else field += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(f => f.trim() !== '')) rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field !== '' || row.length) { row.push(field); if (row.some(f => f.trim() !== '')) rows.push(row); }
  return rows;
}

/* ---------- misc ---------- */
export function escapeHTML(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function initials(first = '', last = '') {
  return ((first[0] || '') + (last[0] || '')).toUpperCase() || '?';
}

export function debounce(fn, ms = 250) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

export function countUp(el, target, opts = {}) {
  const dur = opts.duration || 700;
  const start = performance.now();
  const from = 0;
  const suffix = opts.suffix || '';
  const isMoney = opts.money;
  const isPct = opts.pct;
  const fmt = (val) => {
    if (isMoney) return '$' + Math.round(val).toLocaleString('en-US');
    if (isPct) return Math.round(val * 100) + suffix;
    return Math.round(val).toLocaleString('en-US') + suffix;
  };
  let animated = false;
  function frame(t) {
    animated = true;
    const p = Math.min((t - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = from + (target - from) * eased;
    el.textContent = fmt(val);
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  /* rAF is throttled or paused in hidden/background tabs — snap to the real
     value so the number is never stuck at zero (falls back within ~1.2s). */
  setTimeout(() => { el.textContent = fmt(target); }, Math.max(dur + 500, 1200));
}

export function statusBadge(status) {
  const cls = { New: 'badge-new', Contacted: 'badge-contacted', Responded: 'badge-responded', Booked: 'badge-booked', Lost: 'badge-lost' }[status] || 'badge-archived';
  return `<span class="badge ${cls}">${escapeHTML(status)}</span>`;
}

export function daysLabel(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const diff = Math.round((Date.now() - d) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 0) return `In ${Math.abs(diff)}d`;
  if (diff < 7) return `${diff}d ago`;
  return fmtDate(iso);
}
