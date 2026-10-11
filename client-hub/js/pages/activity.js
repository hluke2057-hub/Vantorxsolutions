/* ============================================================
   VANTORX CLIENT HUB — pages/activity.js
   Full activity timeline with type filters.
   ============================================================ */

import { esc, relTime, fmtDateTime } from '../utils.js';
import { emptyState } from '../components.js';

const FILTERS = [
  ['all', 'All'], ['calls', 'Calls'], ['appointments', 'Appointments'],
  ['leads', 'Leads'], ['ai', 'AI'], ['account', 'Account'],
];

let actFilter = 'all';

export function renderActivity(root, ctx) {
  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">Activity</div>
      <div class="page-sub">Everything your VantorX systems are doing for your business, newest first.</div>
    </div>

    <div class="filter-bar">
      <div class="seg" id="actFilters">
        ${FILTERS.map(([v, l]) => `<button data-f="${v}" class="${actFilter === v ? 'active' : ''}">${l}</button>`).join('')}
      </div>
    </div>

    <div class="card"><div id="actTimeline" style="padding:6px 4px"></div></div>
  `;

  function draw() {
    const items = ctx.getState().activity
      .filter(a => actFilter === 'all' || a.type === actFilter)
      .sort((a, b) => new Date(b.at) - new Date(a.at));

    const el = root.querySelector('#actTimeline');
    if (!items.length) {
      el.innerHTML = emptyState('🕘', 'No activity in this category', 'Actions from your AI, appointments, and leads will appear here.');
      return;
    }
    el.innerHTML = `<div class="timeline">${items.map(a => `
      <div class="tl-item">
        <div class="tl-dot">${a.icon || '•'}</div>
        <div class="tl-title">${esc(a.title)}</div>
        <div class="tl-desc">${esc(a.desc)}</div>
        <div class="tl-meta">${fmtDateTime(a.at)} · ${relTime(a.at)}${a.link ? ` · <button class="link-btn" data-go="${a.link}" style="padding:0">View →</button>` : ''}</div>
      </div>`).join('')}</div>`;

    el.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => ctx.navigate(b.dataset.go)));
  }

  root.querySelectorAll('#actFilters button').forEach(b => b.addEventListener('click', () => {
    actFilter = b.dataset.f;
    root.querySelectorAll('#actFilters button').forEach(x => x.classList.toggle('active', x === b));
    draw();
  }));

  draw();
}
