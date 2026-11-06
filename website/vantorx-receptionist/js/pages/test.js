/* ============================================================
   VANTORX AI RECEPTIONIST — pages/test.js
   Server-driven test conversation. Every turn is a POST to the
   backend engine; nothing is decided in the browser. TEST MODE
   banner always visible; bookings need an explicit apply.
   ============================================================ */

import { esc } from '../utils.js';
import { api } from '../api.js';

const SCENARIOS = [
  'AC compressor stopped cooling on 95° Sunday afternoon.',
  'Burst pipe under kitchen sink flooding hardwood floors right now.',
  'Severe storm blew off shingles and water is leaking into ceiling.',
  'How much is a diagnostic inspection for a heat pump?',
  'Do you have an emergency technician available for immediate dispatch?',
  'Can you help with insurance documentation for storm roof damage?',
  'Can I speak with Luke or the master technician on call right now?',
  'Are your technicians state-licensed and fully insured in Florida?',
];

let session = null; // { id, testMode }
let lastPreview = null;

export function renderTest(root, ctx) {
  const { store, refresh, toast } = ctx;
  root.innerHTML = `
    <section class="card">
      <div class="row between wrap">
        <h3 style="margin:0">Test console <span class="status-pill status-gold"><span class="sdot"></span>TEST MODE</span></h3>
        <div class="row gap">
          <button class="btn primary" id="btnStart">☎ Start test call</button>
          <button class="btn danger" id="btnEnd" disabled>■ End & save</button>
        </div>
      </div>
      <p class="dim small" style="margin:8px 0 0">Runs the <b>real backend engine</b> against the <b>real calendar</b> — availability is genuinely checked and applied bookings are real appointments. It is labeled TEST MODE because it is a web console test, not a production phone call${store.config && store.config.active ? '; the receptionist is also ACTIVE for real callers.' : '.'}</p>
    </section>
    <div class="grid-side" style="margin-top:18px">
      <section class="card">
        <h3>Scenario starters</h3>
        <div class="row gap wrap" style="margin-top:6px">
          ${SCENARIOS.map((x) => `<button class="chip" data-scenario="${esc(x)}" ${session ? '' : 'disabled'}>${esc(x)}</button>`).join('')}
        </div>
        <div class="kv-list" style="margin-top:14px">
          <div class="kv-row"><span>Engine</span><b>Ava Neural Triage Engine (Vapi / OpenAI / 11Labs)</b></div>
          <div class="kv-row"><span>Calendar</span><b>${esc((store.providers.find((p) => /calendar/i.test(p.capability)) || {}).status || '—')}</b></div>
          <div class="kv-row"><span>Booking rule</span><b>explicit apply only</b></div>
        </div>
      </section>
      <section class="card">
        <h3>Live transcript</h3>
        <div id="transcript" class="transcript"><div class="dim">Start a test call to begin.</div></div>
        <div class="row gap" style="margin-top:10px">
          <input class="input grow" id="sayInput" placeholder="${session ? 'Type what the caller says…' : 'Start the call first'}" ${session ? '' : 'disabled'} />
          <button class="btn primary" id="btnSay" ${session ? '' : 'disabled'}>Send</button>
        </div>
        <div class="row between" style="margin-top:10px">
          <div id="previewBox" class="dim small">${lastPreview ? `Pending: ${esc(lastPreview.detail || '')}` : ''}</div>
          <button class="btn gold" id="btnApply" ${lastPreview ? '' : 'disabled'}>✓ Apply to calendar</button>
        </div>
      </section>
    </div>`;
  wireTest(root, ctx);
  const t = root.querySelector('#transcript');
  t.scrollTop = t.scrollHeight;
}

function paint(role, text) {
  const t = document.getElementById('transcript');
  if (!t) return;
  const cls = role === 'caller' ? 'tr-caller' : role === 'ai' ? 'tr-ai' : 'tr-sys';
  const who = role === 'caller' ? 'Caller' : role === 'ai' ? 'AI Receptionist' : '';
  t.insertAdjacentHTML('beforeend', `<div class="tr ${cls}">${who ? `<div class="tr-who">${who}</div>` : ''}<div class="tr-text">${esc(text)}</div></div>`);
  t.scrollTop = t.scrollHeight;
}

async function wireTest(root, ctx) {
  const { store, toast, refreshAll } = ctx;
  const bid = store.business.id;

  root.querySelector('#btnStart').addEventListener('click', async () => {
    try {
      const r = await api.talk({ action: 'start', businessId: bid, callerName: 'Web test caller', phone: '(555) 010-2030' });
      session = { id: r.sessionId, testMode: r.testMode };
      const t = document.getElementById('transcript');
      t.innerHTML = '';
      paint('sys', `— test call connected · engine: server · ${r.providers.filter((p) => p.status !== 'connected').length} provider(s) NOT CONNECTED —`);
      paint('ai', r.greeting);
      setLive(true);
      root.querySelectorAll('[data-scenario]').forEach((b) => (b.disabled = false));
    } catch (e) { toast(e.message, 'error'); }
  });

  root.querySelector('#btnSay').addEventListener('click', () => send(ctx));
  root.querySelector('#sayInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') send(ctx); });
  root.querySelectorAll('[data-scenario]').forEach((b) => b.addEventListener('click', () => {
    const inp = document.getElementById('sayInput');
    inp.value = b.dataset.scenario;
    send(ctx);
  }));
  root.querySelector('#btnEnd').addEventListener('click', async () => {
    try {
      const r = await api.talk({ action: 'end', sessionId: session.id });
      paint('sys', '— call ended · durable record saved (channel: web-test) —');
      session = null; setLive(false); refreshAll();
    } catch (e) { toast(e.message, 'error'); }
  });
  root.querySelector('#btnApply').addEventListener('click', async () => {
    try {
      const r = await api.talk({ action: 'apply', sessionId: session.id });
      if (r.ok) {
        paint('sys', `— APPLIED to real calendar: ${r.detail || 'booking committed'} —`);
        toast('Booking committed to the real calendar', 'success');
        lastPreview = null;
        const b = document.getElementById('btnApply'); if (b) b.disabled = true;
        refreshAll();
      } else { toast(r.reason === 'conflict' ? 'Slot no longer available' : (r.error || 'Apply failed'), 'error'); }
    } catch (e) { toast(e.message, 'error'); }
  });
}

async function send(ctx) {
  const inp = document.getElementById('sayInput');
  const text = (inp.value || '').trim();
  if (!text || !session) return;
  paint('caller', text);
  inp.value = '';
  try {
    const r = await api.talk({ action: 'turn', sessionId: session.id, text });
    setTimeout(() => {
      paint('ai', r.reply);
      if (r.preview) {
        lastPreview = r.preview;
        const box = document.getElementById('previewBox');
        if (box) box.innerHTML = `<b>Pending (not committed):</b> ${esc(r.preview.detail || '')}`;
        const b = document.getElementById('btnApply'); if (b) b.disabled = false;
      }
    }, 160);
  } catch (e) { paint('sys', `— error: ${e.message} —`); }
}

function setLive(on) {
  const b1 = document.getElementById('btnStart'), b2 = document.getElementById('btnEnd');
  const inp = document.getElementById('sayInput'), sb = document.getElementById('btnSay');
  if (b1) b1.disabled = on; if (b2) b2.disabled = !on;
  if (inp) { inp.disabled = !on; inp.placeholder = on ? 'Type what the caller says…' : 'Start the call first'; }
  if (sb) sb.disabled = !on;
}
