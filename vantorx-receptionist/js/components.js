/* ============================================================
   VANTORX CLIENT HUB — components.js
   Shared UI primitives: toasts, modal, drawer, confirm,
   empty states, skeletons.
   ============================================================ */

import { esc } from './utils.js';

/* ---------- toast ---------- */

let toastZone;
function ensureToastZone() {
  if (!toastZone) {
    toastZone = document.createElement('div');
    toastZone.className = 'toast-zone';
    document.body.appendChild(toastZone);
  }
  return toastZone;
}

export function toast(msg, kind = 'success') {
  const zone = ensureToastZone();
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  const icon = kind === 'success' ? '✓' : kind === 'error' ? '✕' : 'ℹ';
  el.innerHTML = `<span style="font-weight:800;color:var(--gold-bright)">${icon}</span><span>${esc(msg)}</span>`;
  zone.appendChild(el);
  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 260);
  }, 3400);
}

/* ---------- modal / drawer ----------
   onOpen fires after the caller has received { close } so callbacks
   can safely reference close (avoids TDZ issues). */

export function openModal({ title, body, footer, onOpen, wide }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  const modal = document.createElement('div');
  modal.className = 'modal';
  if (wide) modal.style.width = 'min(720px, calc(100vw - 40px))';
  modal.innerHTML = `
    <div class="modal-head">
      <div class="modal-title">${title}</div>
      <button class="icon-btn modal-x" aria-label="Close">✕</button>
    </div>
    <div class="modal-body">${body}</div>
    ${footer ? `<div class="modal-foot">${footer}</div>` : ''}
  `;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const api = { overlay, modal };
  let closeFn = () => {};
  api.close = () => closeFn();

  closeFn = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
  function onKey(e) { if (e.key === 'Escape') closeFn(); }
  document.addEventListener('keydown', onKey);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeFn(); });
  modal.querySelector('.modal-x').addEventListener('click', closeFn);

  if (onOpen) queueMicrotask(() => onOpen(api));
  return api;
}

export function openDrawer({ title, body, footer, onOpen }) {
  const overlay = document.createElement('div');
  overlay.className = 'drawer-overlay';
  const drawer = document.createElement('div');
  drawer.className = 'drawer';
  drawer.innerHTML = `
    <div class="drawer-head">
      <div class="modal-title">${title}</div>
      <button class="icon-btn modal-x" aria-label="Close">✕</button>
    </div>
    <div class="drawer-body">${body}</div>
    ${footer ? `<div class="drawer-foot">${footer}</div>` : ''}
  `;
  overlay.appendChild(drawer);
  document.body.appendChild(overlay);

  let closeFn = () => {};
  const api = { overlay, drawer, close: () => closeFn() };

  closeFn = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
  function onKey(e) { if (e.key === 'Escape') closeFn(); }
  document.addEventListener('keydown', onKey);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeFn(); });
  drawer.querySelector('.modal-x').addEventListener('click', closeFn);

  if (onOpen) queueMicrotask(() => onOpen(api));
  return api;
}

export function confirmDialog({ title = 'Are you sure?', message = '', confirmText = 'Confirm', danger = false }) {
  return new Promise(resolve => {
    const m = openModal({
      title,
      body: `<p style="color:var(--text-soft);font-size:0.9rem">${esc(message)}</p>`,
      footer: `
        <button class="btn btn-ghost" data-c="no">Cancel</button>
        <button class="btn ${danger ? 'btn-red' : 'btn-gold'}" data-c="yes">${esc(confirmText)}</button>`,
      onOpen: ({ modal, close }) => {
        modal.querySelector('[data-c="no"]').addEventListener('click', () => { close(); resolve(false); });
        modal.querySelector('[data-c="yes"]').addEventListener('click', () => { close(); resolve(true); });
      },
    });
    const origClose = m.close;
    // resolve(false) if dismissed via X / overlay / Escape
    const obs = new MutationObserver(() => {
      if (!document.body.contains(m.overlay)) { obs.disconnect(); resolve(false); }
    });
    obs.observe(document.body, { childList: true });
    m.close = () => origClose();
  });
}

/* ---------- empty / skeleton ---------- */

export function emptyState(icon, title, msg, actionHTML = '') {
  return `
    <div class="empty-state">
      <div class="empty-ico">${icon}</div>
      <div class="empty-title">${esc(title)}</div>
      <div class="empty-msg">${esc(msg)}</div>
      ${actionHTML}
    </div>`;
}

export function skeletonRows(n = 4) {
  return `<div style="display:flex;flex-direction:column;gap:12px;padding:6px 0">
    ${Array.from({ length: n }, () => '<div class="skeleton" style="height:34px"></div>').join('')}
  </div>`;
}

export function statusPill(status, map) {
  const cls = map[status] || 'status-dim';
  return `<span class="status-pill ${cls}"><span class="sdot"></span>${esc(status)}</span>`;
}

/* ---------- KPI grid — receptionist local addition ---------- */
export function kpiGrid(items) {
  return `<div class="kpi-grid">${items.map((i) => `
    <div class="kpi"><div class="kpi-label">${esc(i.label)}</div><div class="kpi-value">${esc(i.value)}</div>${i.hint ? `<div class="kpi-hint">${esc(i.hint)}</div>` : ''}</div>`).join('')}</div>`;
}

/* ---------- modal (promise-based) — receptionist local addition ---------- */
export function modal({ title = '', body = '', actions = [], wide = false }) {
  return new Promise((resolve) => {
    const host = document.getElementById('modalHost');
    if (!host) { resolve(null); return; }
    const wrap = document.createElement('div');
    wrap.className = 'modal-overlay';
    wrap.innerHTML = `
      <div class="modal-card${wide ? ' wide' : ''}" role="dialog" aria-modal="true">
        <div class="modal-head"><strong>${esc(title)}</strong><button class="modal-x" aria-label="Close">✕</button></div>
        <div class="modal-body">${body}</div>
        <div class="modal-foot">
          ${actions.map((a, i) => `<button class="btn ${a.kind || 'ghost'}" data-i="${i}">${esc(a.label)}</button>`).join('')}
        </div>
      </div>`;
    const close = (val) => { wrap.remove(); resolve(val); };
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap) close(null);
      const x = e.target.closest('.modal-x'); if (x) close(null);
      const b = e.target.closest('button[data-i]');
      if (b) { const a = actions[Number(b.dataset.i)]; close(a ? (a.fn ? a.fn() || true : true) : true); }
    });
    host.appendChild(wrap);
  });
}
