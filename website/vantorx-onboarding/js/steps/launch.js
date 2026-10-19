/* ============================================================
   VANTORX ONBOARDING — steps/launch.js
   Step 6 · Connections checklist   Step 7 · Pre-launch tests
   Step 8 · Review & go-live (completion screen)
   ============================================================ */

import { esc } from '../utils.js';
import { CONNECTIONS, TESTS } from '../data.js';
import { setState } from '../state.js';
import { generateLlmsTxt, generateJsonLd } from '../aeo-generator.js';

/* ---------------- step 6: connections ---------------- */
export function paintConnections(body, d, rerender) {
  body.innerHTML = `
    <div class="onboard-title">Connections</div>
    <div class="onboard-sub">Switch on what you want. These are provisioning requests saved with your draft and synced to the platform — nothing is connected automatically.</div>

    <div class="obx-conn-list">
      ${CONNECTIONS.map(c => {
        const on = d.connections[c.id];
        return `
        <div class="obx-conn ${on ? 'on' : ''}">
          <span class="obx-conn-ico">${c.icon}</span>
          <div class="obx-conn-main">
            <div class="obx-conn-title">${c.title}</div>
            <div class="obx-conn-desc">${c.desc}</div>
          </div>
          <label class="toggle"><input type="checkbox" data-conn="${c.id}" ${on ? 'checked' : ''}><span></span></label>
        </div>`;
      }).join('')}
    </div>

    <div class="obx-hint-box" style="margin-top:16px">💡 Actual provisioning (phone number, calendar sync, CRM) is performed by the VantorX team after go-live — these toggles record what you asked for.</div>
  `;

  body.querySelectorAll('[data-conn]').forEach(cb => cb.addEventListener('change', () => {
    d.connections[cb.dataset.conn] = cb.checked;
    rerender();
  }));

  return { validate() { return ''; }, collect() {} };
}

/* ---------------- step 7: pre-launch tests ---------------- */
export function paintTests(body, d, rerender) {
  const allDone = () => TESTS.every(t => d.tests[t.id]);

  body.innerHTML = `
    <div class="onboard-title">Pre-launch checklist</div>
    <div class="onboard-sub">Work through each item with the VantorX team. You can go live before everything is checked — items stay saved.</div>

    <div class="obx-check-list">
      ${TESTS.map(t => {
        const done = d.tests[t.id];
        return `
        <label class="obx-check ${done ? 'done' : ''}">
          <input type="checkbox" data-test="${t.id}" ${done ? 'checked' : ''}>
          <span class="obx-check-box"></span>
          <span class="obx-check-main"><b>${t.label}</b><i>${t.hint}</i></span>
        </label>`;
      }).join('')}
    </div>

    <div class="obx-check-progress" id="checkProg">
      <strong>${TESTS.filter(t => d.tests[t.id]).length} of ${TESTS.length} complete</strong>
      ${allDone() ? '<span class="obx-check-ready">✓ Ready for launch</span>' : ''}
    </div>
  `;

  body.querySelectorAll('[data-test]').forEach(cb => cb.addEventListener('change', () => {
    d.tests[cb.dataset.test] = cb.checked;
    rerender();
  }));

  return { validate() { return ''; }, collect() {} };
}

/* ---------------- step 8: review & go-live ---------------- */
export function paintReview(body, d, rerender, goLive, isCompleted) {
  const b = d;
  const connOn = CONNECTIONS.filter(c => d.connections[c.id]);
  const testsDone = TESTS.filter(t => d.tests[t.id]).length;

  body.innerHTML = `
    <div class="onboard-title">Review &amp; go live</div>
    <div class="onboard-sub">One last look before the business is marked ready for launch.</div>

    <div class="obx-review-grid">
      <div class="card obx-review-card">
        <div class="card-title">🏢 Business</div>
        <div class="kv-row"><span class="kv-label">Name</span><span>${esc(b.name) || '—'}</span></div>
        <div class="kv-row"><span class="kv-label">Contact</span><span>${esc(b.contact)} · ${esc(b.phone)}</span></div>
        <div class="kv-row"><span class="kv-label">City</span><span>${esc(b.city)}</span></div>
        <div class="kv-row"><span class="kv-label">Services</span><span>${d.services.filter(s => s.name.trim()).length} listed</span></div>
        <div class="kv-row"><span class="kv-label">Knowledge</span><span>${d.knowledge.filter(f => f.q.trim()).length} FAQs</span></div>
      </div>

      <div class="card obx-review-card">
        <div class="card-title">🤖 AI receptionist</div>
        <div class="kv-row"><span class="kv-label">Name</span><span>${esc(d.ai.name)}</span></div>
        <div class="kv-row"><span class="kv-label">Personality</span><span>${esc(d.ai.personality)}</span></div>
        <div class="kv-row"><span class="kv-label">Transfer</span><span>${esc(d.ai.transferNumber) || 'not set'}</span></div>
        <div class="kv-row"><span class="kv-label">Connections</span><span>${connOn.length ? connOn.map(c => c.title).join(', ') : 'none selected'}</span></div>
        <div class="kv-row"><span class="kv-label">Checklist</span><span>${testsDone} of ${TESTS.length} done</span></div>
      </div>

      <div class="card obx-review-card" style="grid-column: 1 / -1; margin-top: 14px; border-color: rgba(199,164,104,0.4); background: var(--bg-soft, #161e2e);">
        <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;">
          <span>🧠 AEO Engine™ Standard Generated (ChatGPT &amp; Perplexity)</span>
          <span style="font-size:12px;color:var(--accent2);font-weight:600">${d.connections.aeo ? '✓ AEO Provisioning Active' : '⚡ Instant Preview Available'}</span>
        </div>
        <p style="font-size:13.5px;color:var(--dim);margin:6px 0 14px">Your business data has been compiled into the official AI search protocol so ChatGPT, Claude, and Perplexity recommend you #1.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-gold btn-sm" id="viewLlmsBtn">📄 View / Copy llms.txt</button>
          <button class="btn btn-ghost btn-sm" id="viewJsonBtn">📋 View / Copy Schema.org</button>
          <button class="btn btn-ghost btn-sm" id="dlLlmsBtn">💾 Download llms.txt</button>
          <a href="/aeo-tool/" target="_blank" class="btn btn-ghost btn-sm">⚡ Open AEO Simulator ↗</a>
        </div>
        <div id="aeoPreviewBox" style="display:none;margin-top:14px;background:#080b10;border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px;max-height:240px;overflow-y:auto">
          <pre id="aeoPreContent" style="font-family:monospace;font-size:12px;color:#cbd5e1;white-space:pre-wrap;"></pre>
        </div>
      </div>
    </div>

    <div class="obx-golive" id="goLiveBox">
      ${isCompleted ? `
        <div class="obx-golive-done">
          <span class="big">✓</span>
          <div><strong>${esc(b.name)}</strong> is marked ready for launch.</div>
          <button class="btn btn-ghost btn-sm" id="reopenBtn">Reopen setup</button>
        </div>` : `
        <button class="btn btn-gold obx-golive-btn" id="goLiveBtn">🚀 Mark ready for launch</button>
        <div class="form-hint" style="margin-top:10px">Go-live validates and saves the business on the VantorX platform server — this is a real record, not a simulation.</div>`}
    </div>
  `;

  const gl = body.querySelector('#goLiveBtn');
  if (gl) gl.addEventListener('click', goLive);
  const ro = body.querySelector('#reopenBtn');
  if (ro) ro.addEventListener('click', () => { setState(s => { s.completed = false; }); rerender(); });

  const pBox = body.querySelector('#aeoPreviewBox');
  const pPre = body.querySelector('#aeoPreContent');
  const viewLlmsBtn = body.querySelector('#viewLlmsBtn');
  const viewJsonBtn = body.querySelector('#viewJsonBtn');
  const dlLlmsBtn = body.querySelector('#dlLlmsBtn');

  if (viewLlmsBtn && pBox && pPre) {
    viewLlmsBtn.addEventListener('click', () => {
      const txt = generateLlmsTxt(d);
      pPre.textContent = txt;
      pBox.style.display = 'block';
      navigator.clipboard.writeText(txt);
      viewLlmsBtn.textContent = '✓ Copied llms.txt to Clipboard!';
      setTimeout(() => { viewLlmsBtn.textContent = '📄 View / Copy llms.txt'; }, 2500);
    });
  }

  if (viewJsonBtn && pBox && pPre) {
    viewJsonBtn.addEventListener('click', () => {
      const jsonStr = generateJsonLd(d);
      pPre.textContent = jsonStr;
      pBox.style.display = 'block';
      navigator.clipboard.writeText(jsonStr);
      viewJsonBtn.textContent = '✓ Copied Schema to Clipboard!';
      setTimeout(() => { viewJsonBtn.textContent = '📋 View / Copy Schema.org'; }, 2500);
    });
  }

  if (dlLlmsBtn) {
    dlLlmsBtn.addEventListener('click', () => {
      const txt = generateLlmsTxt(d);
      const blob = new Blob([txt], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'llms.txt';
      a.click();
      dlLlmsBtn.textContent = '✓ Downloaded llms.txt!';
      setTimeout(() => { dlLlmsBtn.textContent = '💾 Download llms.txt'; }, 2500);
    });
  }

  return { validate() { return ''; }, collect() {} };
}
