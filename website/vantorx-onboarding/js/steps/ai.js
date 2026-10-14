/* ============================================================
   VANTORX ONBOARDING — steps/ai.js
   Step 5 · AI receptionist: name, personality, greeting,
   transfer rules + a live "test call" preview that answers
   using the draft's real hours, services and FAQs.
   ============================================================ */

import { esc } from '../utils.js';
import { PERSONALITIES, sampleGreeting } from '../data.js';

export function paintAI(body, d, rerender) {
  const a = d.ai;

  body.innerHTML = `
    <div class="onboard-title">Meet your AI receptionist</div>
    <div class="onboard-sub">It answers every call, books appointments, and only escalates when it should.</div>

    <div class="obx-ai-grid">
      <div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Receptionist name</label>
            <input class="form-input" id="aiName" value="${esc(a.name)}" placeholder="Ava"></div>
          <div class="form-group"><label class="form-label">Personality</label>
            <select class="select-input" id="aiPersona">
              ${PERSONALITIES.map(p => `<option value="${p.id}" ${a.personality === p.id ? 'selected' : ''}>${p.icon} ${p.id}</option>`).join('')}
            </select></div>
        </div>

        <div class="form-group"><label class="form-label">Opening greeting <span class="req">*</span></label>
          <textarea class="form-textarea obx-greeting" id="aiGreeting" placeholder="Thanks for calling! How can I help?">${esc(a.greeting)}</textarea>
          <div style="margin-top:8px"><button class="test-chip" id="genGreeting">✨ Write one for me</button></div></div>

        <div class="card-title" style="margin:18px 0 10px">↪️ Human transfer</div>
        <div class="form-group"><label class="form-label">Transfer to number</label>
          <input class="form-input" id="aiTransfer" value="${esc(a.transferNumber)}" placeholder="(555) 555-0100"></div>
        <div class="form-group"><label class="form-label">When should it transfer?</label>
          <textarea class="form-textarea obx-transfer-when" id="aiTransferWhen" placeholder="e.g. complaints, medical questions...">${esc(a.transferWhen)}</textarea></div>
      </div>

      <div class="obx-preview">
        <div class="card-title" style="margin-bottom:12px">📲 Test call preview <span class="cell-dim">(simulated — answers come from your draft setup)</span></div>
        <div class="obx-sim" id="simBox">
          <div class="obx-sim-welcome">Ask the AI something a caller would.</div>
        </div>
        <div class="test-chip-row" style="margin-top:12px" id="simChips"></div>
      </div>
    </div>
  `;

  /* ---- inputs ---- */
  body.querySelector('#aiName').addEventListener('input', e => { a.name = e.target.value; });
  body.querySelector('#aiPersona').addEventListener('change', e => { a.personality = e.target.value; });
  body.querySelector('#aiGreeting').addEventListener('input', e => { a.greeting = e.target.value; });
  body.querySelector('#aiTransfer').addEventListener('input', e => { a.transferNumber = e.target.value; });
  body.querySelector('#aiTransferWhen').addEventListener('input', e => { a.transferWhen = e.target.value; });

  body.querySelector('#genGreeting').addEventListener('click', () => {
    a.greeting = sampleGreeting(d.industry, d.name, a.name || 'Ava');
    rerender();
  });

  /* ---- simulator ---- */
  const sim = body.querySelector('#simBox');
  const chips = body.querySelector('#simChips');

  const CALLS = [
    { chip: '🕐 "What are your hours?"', match: () => true, reply: hoursReply },
    { chip: '💰 "How much is it?"', match: () => true, reply: priceReply },
    { chip: '📅 "Can I book Saturday?"', match: () => true, reply: bookingReply },
    { chip: '🚶 "Do you take walk-ins?"', match: () => true, reply: walkinReply },
    { chip: '❓ Anything else', match: q => true, reply: faqReply },
  ];

  chips.innerHTML = CALLS.map((c, i) => `<button class="test-chip" data-call="${i}">${c.chip}</button>`).join('');
  chips.querySelectorAll('[data-call]').forEach(b => b.addEventListener('click', () => {
    const c = CALLS[Number(b.dataset.call)];
    ask(c.chip.replace(/^[^\s]+\s/, '').replace(/"/g, ''), () => c.reply(d, a));
  }));

  function bubble(kind, text) {
    const el = document.createElement('div');
    el.className = `obx-sim-bubble ${kind}`;
    el.textContent = text;
    sim.appendChild(el);
    sim.scrollTop = sim.scrollHeight;
  }

  function ask(question, responder) {
    const welcome = sim.querySelector('.obx-sim-welcome');
    if (welcome) welcome.remove();
    bubble('caller', question);
    const typing = document.createElement('div');
    typing.className = 'obx-sim-bubble ai obx-typing';
    typing.textContent = '• • •';
    sim.appendChild(typing);
    sim.scrollTop = sim.scrollHeight;
    setTimeout(() => {
      typing.remove();
      bubble('ai', responder());
    }, 700);
  }

  return {
    validate() {
      if (!a.greeting.trim()) return 'Write or generate an opening greeting.';
      return '';
    },
    collect() {},
  };
}

/* ---------- reply engines (use the real draft data) ---------- */
function hoursReply(d) {
  const closed = Object.entries(d.hours).filter(([, h]) => h.closed).map(([k]) => k);
  const names = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
  const open = Object.entries(d.hours).filter(([, h]) => !h.closed)
    .map(([k, h]) => `${names[k]} ${h.open}–${h.close}`).join(', ');
  const closedTxt = closed.length ? ` We're closed on ${closed.map(k => names[k]).join(' and ')}.` : '';
  return `We're open ${open}.${closedTxt}`;
}

function priceReply(d) {
  const first = d.services.find(s => s.name.trim() && s.price.trim());
  if (!first) return `I can absolutely help with that — let me take your number and we'll confirm pricing.`;
  const list = d.services.filter(s => s.name.trim() && s.price.trim()).slice(0, 3)
    .map(s => `${s.name} is ${s.price}${s.minutes ? ` (${s.minutes} min)` : ''}`);
  return `Sure! ${list.join('; ')}. Would you like to book one?`;
}

function bookingReply(d, a) {
  const sat = d.hours.sat;
  if (sat.closed) return `We're actually closed Saturdays — I can book you Friday or Monday instead. What time works?`;
  return `Yes! Saturday we're open ${sat.open} to ${sat.close}. What time suits you? I'll put it in the book under your name.`;
}

function walkinReply(d) {
  const w = d.policies.walkins.trim();
  if (w) return `${w}. But booking ahead guarantees your spot — want me to reserve one?`;
  return `Walk-ins are welcome when there's room, though I'd recommend booking to be safe. Shall I reserve a time?`;
}

function faqReply(d, a) {
  const hit = d.knowledge.find(f => f.a.trim());
  if (hit) return hit.a;
  if (a.transferNumber.trim()) {
    return `Great question — let me connect you with the team at ${a.transferNumber} so you get an exact answer. One moment!`;
  }
  return `Great question — I'll take your number and have the team call you back with the details.`;
}
