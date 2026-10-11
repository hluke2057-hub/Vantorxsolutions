/* ============================================================
   VANTORX LEADFLOW — components.js
   Reusable UI: modal, confirm, toast, empty state, charts.
   ============================================================ */

import { escapeHTML as esc } from './utils.js';

/* ============================================================
   MODAL
   Opens a modal. opts: { title, body (html string), wide,
   footer (html string), onOpen(modalEl), onClose() }
   Escape closes. Returns close function.
   ============================================================ */
export function openModal(opts) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal ${opts.wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(opts.title || 'Dialog')}">
      <div class="modal-head">
        <div class="modal-title">${esc(opts.title || '')}</div>
        <button class="modal-close" aria-label="Close dialog" data-close>×</button>
      </div>
      <div class="modal-body">${opts.body || ''}</div>
      ${opts.footer ? `<div class="modal-foot">${opts.footer}</div>` : ''}
    </div>`;
  document.body.appendChild(overlay);

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    overlay.remove();
    document.removeEventListener('keydown', onKey);
    opts.onClose && opts.onClose();
  };
  const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
  document.addEventListener('keydown', onKey);
  overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) close(); });
  overlay.querySelector('[data-close]').addEventListener('click', close);
  /* onOpen is deferred one tick so callers can reference their own `close`
     variable (assigned from this function's return value) inside the callback. */
  if (opts.onOpen) setTimeout(() => opts.onOpen(overlay), 0);
  return close;
}

/* ============================================================
   CONFIRM DIALOG
   Returns Promise<boolean>.
   ============================================================ */
export function confirmDialog({ title = 'Are you sure?', message = '', confirmText = 'Confirm', danger = false }) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.zIndex = 210;
    overlay.innerHTML = `
      <div class="modal confirm-box" role="alertdialog" aria-modal="true">
        <div class="modal-body">
          <div class="confirm-title">${esc(title)}</div>
          <div class="confirm-msg">${esc(message)}</div>
          <div style="display:flex;justify-content:flex-end;gap:10px">
            <button class="btn btn-ghost" data-cancel>Cancel</button>
            <button class="btn ${danger ? 'btn-danger' : 'btn-gold'}" data-ok>${esc(confirmText)}</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    const done = (v) => { overlay.remove(); document.removeEventListener('keydown', onKey); resolve(v); };
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); done(false); } if (e.key === 'Enter') { e.stopPropagation(); done(true); } };
    document.addEventListener('keydown', onKey);
    overlay.querySelector('[data-cancel]').addEventListener('click', () => done(false));
    overlay.querySelector('[data-ok]').addEventListener('click', () => done(true));
    overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) done(false); });
    overlay.querySelector('[data-ok]').focus();
  });
}

/* ============================================================
   TOASTS
   ============================================================ */
let toastContainer = null;
export function toast(message, kind = 'success') {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  const icons = { success: '✓', error: '✕', info: '✦' };
  const el = document.createElement('div');
  el.className = `toast toast-${kind}`;
  el.innerHTML = `<span class="toast-ico">${icons[kind] || '✦'}</span><span class="toast-msg">${esc(message)}</span>`;
  toastContainer.appendChild(el);
  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 260);
  }, 3200);
}

/* ============================================================
   EMPTY STATE
   ============================================================ */
export function emptyState({ icon = '📭', title, message, actionHTML = '' }) {
  return `
    <div class="empty-state">
      <div class="empty-ico">${icon}</div>
      <div class="empty-title">${esc(title)}</div>
      <div class="empty-msg">${esc(message)}</div>
      ${actionHTML}
    </div>`;
}

/* ============================================================
   CHARTS — hand-drawn SVG, no external libs
   ============================================================ */

/** Line/area chart. series: {color, points:[{x:Date, y:number}], fill?} */
export function lineChart(series, { width = 600, height = 220, labels = [] } = {}) {
  const all = series.flatMap(s => s.points);
  if (!all.length) return '<div style="color:var(--text-dim);padding:30px;text-align:center">No data yet</div>';
  const xs = all.map(p => p.x instanceof Date ? p.x.getTime() : p.x);
  const ys = all.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const maxY = Math.max(...ys, 1);
  const padL = 34, padR = 12, padT = 14, padB = 26;
  const X = v => padL + ((v - minX) / Math.max(1, maxX - minX)) * (width - padL - padR);
  const Y = v => padT + (1 - v / maxY) * (height - padT - padB);
  const yTicks = 4;
  let gridLines = '';
  for (let i = 0; i <= yTicks; i++) {
    const yv = Math.round(maxY * i / yTicks);
    const y = Y(yv);
    gridLines += `<line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <text x="${padL - 6}" y="${y + 3}" fill="rgba(255,255,255,0.35)" font-size="9" text-anchor="end">${yv}</text>`;
  }
  let paths = '';
  series.forEach((s, si) => {
    const pts = [...s.points].sort((a, b) => (a.x instanceof Date ? a.x.getTime() : a.x) - (b.x instanceof Date ? b.x.getTime() : b.x));
    if (!pts.length) return;
    const coords = pts.map(p => `${X(p.x instanceof Date ? p.x.getTime() : p.x)},${Y(p.y)}`);
    const line = `<polyline points="${coords.join(' ')}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    let area = '';
    if (s.fill) {
      area = `<polygon points="${padL},${Y(0)} ${coords.join(' ')} ${X(maxX)},${Y(0)}" fill="${s.color}" opacity="0.08"/>`;
    }
    const dots = pts.map((p, i) =>
      `<circle cx="${X(p.x instanceof Date ? p.x.getTime() : p.x)}" cy="${Y(p.y)}" r="2.6" fill="${s.color}"><title>${labels[i] || ''}: ${p.y}</title></circle>`
    ).join('');
    paths += area + line + dots;
  });
  let xLabels = '';
  if (labels.length) {
    const step = Math.ceil(labels.length / 7);
    labels.forEach((lb, i) => {
      if (i % step !== 0) return;
      xLabels += `<text x="${X(i * (1000 * 60 * 60 * 24))}" y="${height - 8}" fill="rgba(255,255,255,0.35)" font-size="9" text-anchor="middle">${esc(lb)}</text>`;
    });
  }
  return `<svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;display:block" role="img" aria-label="Line chart">
    ${gridLines}${paths}${xLabels}</svg>`;
}

/** Donut chart. data: [{label, value, color}] */
export function donutChart(data, { size = 170, thickness = 22 } = {}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return '<div style="color:var(--text-dim);padding:30px;text-align:center">No data yet</div>';
  const r = (size - thickness) / 2;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const segs = data.filter(d => d.value > 0).map(d => {
    const frac = d.value / total;
    const len = frac * circ;
    const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d.color}" stroke-width="${thickness}"
      stroke-dasharray="${len} ${circ - len}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})">
      <title>${esc(d.label)}: ${d.value} (${Math.round(frac * 100)}%)</title></circle>`;
    offset += len;
    return seg;
  }).join('');
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Donut chart">
    ${segs}
    <text x="${cx}" y="${cy - 2}" text-anchor="middle" fill="var(--text)" font-size="20" font-weight="800" font-family="Sora,sans-serif">${total}</text>
    <text x="${cx}" y="${cy + 15}" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="9" letter-spacing="1">TOTAL</text>
  </svg>`;
}

/** Horizontal bar list. data: [{label, value, color?}] */
export function barList(data, { format = (v) => v } = {}) {
  const max = Math.max(...data.map(d => d.value), 1);
  return data.map(d => `
    <div class="src-row">
      <div class="src-label">${esc(d.label)}</div>
      <div class="src-track"><div class="src-bar" style="width:${(d.value / max) * 100}%;${d.color ? `background:${d.color}` : ''}"></div></div>
      <div class="src-count">${format(d.value)}</div>
    </div>`).join('');
}

/** Vertical bar chart. data: [{label, value, color?}] */
export function barChart(data, { width = 600, height = 220 } = {}) {
  const max = Math.max(...data.map(d => d.value), 1);
  const padB = 26, padT = 12;
  const n = data.length || 1;
  const bw = Math.min(46, (width - 20) / n - 12);
  const bars = data.map((d, i) => {
    const x = 14 + i * ((width - 20) / n) + ((width - 20) / n - bw) / 2;
    const h = Math.max(2, (d.value / max) * (height - padB - padT));
    const y = height - padB - h;
    return `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="5" fill="${d.color || '#d4af37'}" opacity="0.9"><title>${esc(d.label)}: ${d.value}</title></rect>
      <text x="${x + bw / 2}" y="${height - 8}" fill="rgba(255,255,255,0.4)" font-size="9" text-anchor="middle">${esc(d.label)}</text>
      <text x="${x + bw / 2}" y="${y - 5}" fill="rgba(255,255,255,0.6)" font-size="9" text-anchor="middle">${d.value}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;display:block" role="img" aria-label="Bar chart">${bars}</svg>`;
}

/* ============================================================
   FORM HELPERS
   ============================================================ */
export function field({ label, name, type = 'text', value = '', required = false, placeholder = '', options = null, hint = '', full = false }) {
  const req = required ? ' <span class="req">*</span>' : '';
  if (type === 'select') {
    return `<div class="form-group" data-field="${name}" ${full ? 'style="grid-column:1/-1"' : ''}>
      <label class="form-label" for="f_${name}">${label}${req}</label>
      <select class="form-select" id="f_${name}" name="${name}">
        ${options.map(o => `<option value="${esc(o)}" ${o === value ? 'selected' : ''}>${esc(o)}</option>`).join('')}
      </select>${hint ? `<div class="form-hint">${esc(hint)}</div>` : ''}
    </div>`;
  }
  if (type === 'textarea') {
    return `<div class="form-group" data-field="${name}" ${full ? 'style="grid-column:1/-1"' : ''}>
      <label class="form-label" for="f_${name}">${label}${req}</label>
      <textarea class="form-textarea" id="f_${name}" name="${name}" placeholder="${esc(placeholder)}">${esc(value)}</textarea>${hint ? `<div class="form-hint">${esc(hint)}</div>` : ''}
    </div>`;
  }
  return `<div class="form-group" data-field="${name}" ${full ? 'style="grid-column:1/-1"' : ''}>
    <label class="form-label" for="f_${name}">${label}${req}</label>
    <input class="form-input" id="f_${name}" name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}"/>
    ${hint ? `<div class="form-hint">${esc(hint)}</div>` : ''}
  </div>`;
}

export function readForm(container) {
  const data = {};
  container.querySelectorAll('[name]').forEach(el => { data[el.name] = el.value.trim(); });
  return data;
}

/* toggle switch */
export function toggle(name, checked, label, sub = '') {
  return `<div class="toggle-row">
    <div><div class="toggle-label">${esc(label)}</div>${sub ? `<div class="toggle-sub">${esc(sub)}</div>` : ''}</div>
    <label class="switch"><input type="checkbox" name="${name}" ${checked ? 'checked' : ''}/><span class="track"></span></label>
  </div>`;
}
