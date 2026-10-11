/* ============================================================
   VANTORX ONBOARDING — steps/hours.js
   Step 3 · Hours & policies   Step 4 · Knowledge / FAQs
   ============================================================ */

import { esc } from '../utils.js';
import { starterFAQs } from '../data.js';

const DAYS = [
  ['mon', 'Monday'], ['tue', 'Tuesday'], ['wed', 'Wednesday'], ['thu', 'Thursday'],
  ['fri', 'Friday'], ['sat', 'Saturday'], ['sun', 'Sunday'],
];

/* ---------------- step 3: hours & policies ---------------- */
export function paintHours(body, d, rerender) {
  body.innerHTML = `
    <div class="onboard-title">Hours &amp; policies</div>
    <div class="onboard-sub">The AI answers "when are you open" and enforces these rules automatically.</div>

    <div class="card-title" style="margin-bottom:12px">🕐 Weekly hours</div>
    ${DAYS.map(([k, label]) => {
      const h = d.hours[k];
      return `
      <div class="obx-hours-row ${h.closed ? 'is-closed' : ''}">
        <label class="toggle"><input type="checkbox" data-open="${k}" ${h.closed ? '' : 'checked'}><span></span></label>
        <span class="obx-hours-day">${label}</span>
        ${h.closed ? '<span class="obx-hours-closed">Closed</span>' : `
          <input class="form-input obx-hours-time" type="time" data-o="${k}" value="${to24(h.open)}">
          <span class="obx-hours-dash">–</span>
          <input class="form-input obx-hours-time" type="time" data-c="${k}" value="${to24(h.close)}">`}
      </div>`;
    }).join('')}

    <div class="card-title" style="margin:20px 0 12px">📜 Policies</div>
    <div class="form-group"><label class="form-label">Cancellation policy</label>
      <textarea class="form-textarea" id="polCancel" placeholder="e.g. 24-hour notice or 50% of the service is charged.">${esc(d.policies.cancellation)}</textarea></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Walk-ins</label>
        <input class="form-input" id="polWalkins" value="${esc(d.policies.walkins)}" placeholder="e.g. Welcome when chairs are free"></div>
      <div class="form-group"><label class="form-label">Payment methods</label>
        <input class="form-input" id="polPayment" value="${esc(d.policies.payment)}" placeholder="e.g. Cards, tap, cash"></div>
    </div>
  `;

  function to24(t) {
    const m = String(t).match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!m) return '09:00';
    let h = Number(m[1]) % 12;
    if (m[3].toUpperCase() === 'PM') h += 12;
    return `${String(h).padStart(2, '0')}:${m[2]}`;
  }

  body.querySelectorAll('[data-open]').forEach(cb => cb.addEventListener('change', () => {
    d.hours[cb.dataset.open].closed = !cb.checked;
    rerender();
  }));
  body.querySelectorAll('[data-o]').forEach(inp => inp.addEventListener('change', () => { d.hours[inp.dataset.o].open = to12(inp.value); }));
  body.querySelectorAll('[data-c]').forEach(inp => inp.addEventListener('change', () => { d.hours[inp.dataset.c].close = to12(inp.value); }));
  body.querySelector('#polCancel').addEventListener('input', e => { d.policies.cancellation = e.target.value; });
  body.querySelector('#polWalkins').addEventListener('input', e => { d.policies.walkins = e.target.value; });
  body.querySelector('#polPayment').addEventListener('input', e => { d.policies.payment = e.target.value; });

  function to12(v) {
    if (!v) return '9:00 AM';
    const [hStr, m] = v.split(':');
    let h = Number(hStr);
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ap}`;
  }

  return {
    validate() { return ''; },
    collect() {},
  };
}

/* ---------------- step 4: knowledge / FAQs ---------------- */
export function paintKnowledge(body, d, rerender) {
  body.innerHTML = `
    <div class="onboard-title">Business knowledge</div>
    <div class="onboard-sub">Common questions the AI should answer without escalating. Keep answers short and factual.</div>

    <div id="faqRows">
      ${d.knowledge.length ? d.knowledge.map((f, i) => `
        <div class="obx-faq-row">
          <input class="form-input" data-q="${i}" value="${esc(f.q)}" placeholder="Question">
          <input class="form-input" data-a="${i}" value="${esc(f.a)}" placeholder="Answer">
          <button class="icon-btn" data-fdel="${i}" title="Remove">✕</button>
        </div>`).join('')
      : `<div class="obx-hint-box">No FAQs yet — add starter questions for your industry below.</div>`}
    </div>

    <div class="test-chip-row" style="margin-top:14px">
      <button class="test-chip" id="faqAdd">+ Add question</button>
      ${!d.knowledge.length ? `<button class="test-chip" id="faqStarter">✨ Add starter FAQs</button>` : ''}
    </div>

    <div class="form-group" style="margin-top:20px">
      <label class="form-label">Anything else the AI should know? (optional)</label>
      <textarea class="form-textarea" id="extraNotes" placeholder="Parking directions, building entry, seasonal notes...">${esc(d.notes)}</textarea>
    </div>
  `;

  body.querySelector('#faqAdd').addEventListener('click', () => { d.knowledge.push({ q: '', a: '' }); rerender(); });
  const starter = body.querySelector('#faqStarter');
  if (starter) starter.addEventListener('click', () => { d.knowledge = starterFAQs(d.industry).map(f => ({ ...f })); rerender(); });
  body.querySelectorAll('[data-fdel]').forEach(b => b.addEventListener('click', () => { d.knowledge.splice(Number(b.dataset.fdel), 1); rerender(); }));
  body.querySelectorAll('[data-q]').forEach(inp => inp.addEventListener('input', () => { const f = d.knowledge[Number(inp.dataset.q)]; if (f) f.q = inp.value; }));
  body.querySelectorAll('[data-a]').forEach(inp => inp.addEventListener('input', () => { const f = d.knowledge[Number(inp.dataset.a)]; if (f) f.a = inp.value; }));
  body.querySelector('#extraNotes').addEventListener('input', e => { d.notes = e.target.value; });

  return {
    validate() {
      const half = d.knowledge.find(f => (f.q.trim() && !f.a.trim()) || (!f.q.trim() && f.a.trim()));
      if (half) return 'Give each question an answer (or remove the row).';
      return '';
    },
    collect() {},
  };
}
