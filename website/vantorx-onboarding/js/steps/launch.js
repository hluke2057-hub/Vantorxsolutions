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
        <div class="obx-golive-done" style="text-align:left;width:100%;max-width:820px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,rgba(34,197,94,0.18),rgba(212,175,55,0.12));border:1px solid rgba(34,197,94,0.4);border-radius:14px;padding:22px;margin-bottom:20px;text-align:center;">
            <div style="font-size:3rem;margin-bottom:6px;">🎉</div>
            <h2 style="font-size:22px;color:#f8fafc;margin:0 0 6px;">Onboarding Dossier Locked In for ${esc(b.name)}!</h2>
            <p style="color:#cbd5e1;font-size:14px;max-width:620px;margin:0 auto 16px;">Your setup configuration has been safely recorded and dispatched to Luke Hamilton &amp; VantorX Engineering. Ava is being prepared for your live line.</p>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
              <button class="btn btn-gold btn-sm" id="dlDossierBtn">💾 Download Setup Dossier (.json)</button>
              <button class="btn btn-ghost btn-sm" id="copySummaryBtn">📋 Copy Setup Summary</button>
              <button class="btn btn-ghost btn-sm" id="reopenBtn">✏️ Reopen &amp; Edit Details</button>
            </div>
          </div>

          <!-- Step 2: Immediate Zero-Downtime Carrier Call Forwarding (*71) -->
          <div class="card" style="margin-bottom:20px;border-color:rgba(212,175,55,0.35);background:#0e121c;padding:20px;border-radius:14px;">
            <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <span style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:1.3rem;">📞</span>
                <strong style="font-size:16px;">Next Step: Turn On Conditional Call Forwarding (*71)</strong>
              </span>
              <span style="font-size:11px;background:rgba(34,197,94,0.2);color:#4ade80;padding:3px 10px;border-radius:999px;font-weight:700;">Zero Downtime · No Number Porting</span>
            </div>
            <p style="font-size:13.5px;color:#94a3b8;margin-bottom:14px;line-height:1.5;">
              Ava only answers when your phone is busy or rings 4 times without an answer. You keep your existing carrier and phone numbers. Select your mobile or office carrier below:
            </p>

            <!-- Carrier Selector Tabs -->
            <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;" id="carrierTabs">
              <button class="btn btn-sm btn-gold carrier-tab" data-carrier="verizon">Verizon</button>
              <button class="btn btn-sm btn-ghost carrier-tab" data-carrier="att">AT&amp;T</button>
              <button class="btn btn-sm btn-ghost carrier-tab" data-carrier="tmobile">T-Mobile</button>
              <button class="btn btn-sm btn-ghost carrier-tab" data-carrier="spectrum">Spectrum / Landline</button>
              <button class="btn btn-sm btn-ghost carrier-tab" data-carrier="voip">VOIP / RingCentral</button>
            </div>

            <!-- Carrier Instructions Box -->
            <div id="carrierGuideBox" style="background:#06080e;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px;"></div>
          </div>

          <!-- VIP Direct Support Card -->
          <div class="card" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;background:#141724;border-color:rgba(255,255,255,0.1);padding:18px;border-radius:12px;">
            <div>
              <div style="font-weight:700;color:#f8fafc;font-size:15px;margin-bottom:2px;">Ready for your live test call?</div>
              <div style="font-size:13px;color:#94a3b8;">Call or text Luke Hamilton directly to test your Ava receptionist on speaker.</div>
            </div>
            <div style="display:flex;gap:10px;align-items:center;">
              <a href="tel:5618138602" class="btn btn-gold btn-sm">📞 (561) 813-8602</a>
              <a href="mailto:luke@vantorxsolutions.com" class="btn btn-ghost btn-sm">✉️ Email Luke</a>
            </div>
          </div>
        </div>` : `
        <button class="btn btn-gold obx-golive-btn" id="goLiveBtn">🚀 Mark ready for launch</button>
        <div class="form-hint" style="margin-top:10px">Go-live validates and saves the business on the VantorX platform server — this is a real record, not a simulation.</div>`}
    </div>
  `;

  const gl = body.querySelector('#goLiveBtn');
  if (gl) gl.addEventListener('click', goLive);
  const ro = body.querySelector('#reopenBtn');
  if (ro) ro.addEventListener('click', () => { setState(s => { s.completed = false; }); rerender(); });

  /* Carrier Guide Switcher */
  const carrierGuideBox = body.querySelector('#carrierGuideBox');
  const carrierTabs = body.querySelectorAll('.carrier-tab');
  const targetNumber = '5618138602';

  const CARRIER_INFO = {
    verizon: {
      name: 'Verizon Wireless',
      dialStr: `*71${targetNumber}`,
      cancelStr: `*73`,
      desc: `Dial the activation string below directly on your mobile device. You will hear a short stutter tone or fast busy confirmation, then the call will disconnect. Conditional forwarding is now active.`,
    },
    att: {
      name: 'AT&T Wireless',
      dialStr: `*61*${targetNumber}#`,
      cancelStr: `#61#`,
      desc: `Dial the star code below, or open Phone Settings &gt; Cellular &gt; Call Forwarding &gt; Forward When Unanswered.`,
    },
    tmobile: {
      name: 'T-Mobile',
      dialStr: `**61*1${targetNumber}#`,
      cancelStr: `##61#`,
      desc: `Dial the standard GSM conditional forwarding code below from your phone's dialer.`,
    },
    spectrum: {
      name: 'Spectrum / Charter Landline',
      dialStr: `*72${targetNumber}`,
      cancelStr: `*73`,
      desc: `Pick up your landline receiver, listen for dial tone, and dial the code. You can also turn this on anytime inside your Spectrum Voice online management portal.`,
    },
    voip: {
      name: 'VOIP / PBX (RingCentral, Vonage, 8x8, Nextiva)',
      dialStr: `(561) 813-8602`,
      cancelStr: `Remove forwarding rule in portal`,
      desc: `Log into your PBX Admin Portal &gt; Inbound Call Rules &gt; After Hours / No Answer &gt; Forward External to (561) 813-8602.`,
    },
  };

  function renderCarrier(carrierKey) {
    if (!carrierGuideBox) return;
    const c = CARRIER_INFO[carrierKey] || CARRIER_INFO.verizon;
    carrierGuideBox.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <strong style="color:#d4af37;font-size:14px;">${c.name}</strong>
        <span style="font-size:12px;color:#94a3b8;">Ava Line: <strong>(561) 813-8602</strong></span>
      </div>
      <p style="font-size:13px;color:#cbd5e1;margin-bottom:12px;">${c.desc}</p>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;background:#101420;padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);">
        <div style="flex:1;min-width:200px;">
          <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;font-weight:700;">Dial String</div>
          <div style="font-family:monospace;font-size:16px;color:#4ade80;font-weight:bold;">${c.dialStr}</div>
        </div>
        <a href="tel:${c.dialStr.replace(/#/g, '%23')}" class="btn btn-gold btn-sm">📞 Tap to Dial</a>
        <button class="btn btn-ghost btn-sm" id="copyDialBtn">📋 Copy Code</button>
      </div>
      <div style="font-size:12px;color:#64748b;margin-top:10px;">
        To turn off anytime: Dial <strong style="color:#f87171;">${c.cancelStr}</strong>
      </div>
    `;

    const copyBtn = carrierGuideBox.querySelector('#copyDialBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(c.dialStr);
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyBtn.textContent = '📋 Copy Code'; }, 2000);
      });
    }
  }

  if (carrierTabs.length) {
    renderCarrier('verizon');
    carrierTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        carrierTabs.forEach(b => { b.className = 'btn btn-sm btn-ghost carrier-tab'; });
        btn.className = 'btn btn-sm btn-gold carrier-tab';
        renderCarrier(btn.dataset.carrier);
      });
    });
  }

  /* Download Setup Dossier (.json) */
  const dlDossierBtn = body.querySelector('#dlDossierBtn');
  if (dlDossierBtn) {
    dlDossierBtn.addEventListener('click', () => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(d, null, 2));
      const a = document.createElement('a');
      a.href = dataStr;
      a.download = `vantorx-onboarding-${(d.name || 'business').toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
      a.click();
      dlDossierBtn.textContent = '✓ Dossier Downloaded!';
      setTimeout(() => { dlDossierBtn.textContent = '💾 Download Setup Dossier (.json)'; }, 2500);
    });
  }

  /* Copy Setup Summary */
  const copySummaryBtn = body.querySelector('#copySummaryBtn');
  if (copySummaryBtn) {
    copySummaryBtn.addEventListener('click', () => {
      const summaryText = [
        `============================================================`,
        `VANTORX SOLUTIONS — CLIENT ONBOARDING SUMMARY`,
        `============================================================`,
        `Business Name:  ${d.name || '—'}`,
        `Owner/Contact:  ${d.contact || '—'}`,
        `Phone Number:   ${d.phone || '—'}`,
        `Email:          ${d.email || '—'}`,
        `City/Market:    ${d.city || '—'}`,
        `Industry:       ${d.industry || '—'}`,
        `Website:        ${d.website || 'None'}`,
        ``,
        `AI RECEPTIONIST:`,
        `Agent Name:     ${d.ai?.name || 'Ava'}`,
        `Personality:    ${d.ai?.personality || 'Friendly'}`,
        `Greeting:       ${d.ai?.greeting || 'Standard'}`,
        `Transfer Phone: ${d.ai?.transferNumber || d.phone || 'Not set'}`,
        `Transfer Rule:  ${d.ai?.transferWhen || 'Customer request or emergency'}`,
        ``,
        `SERVICES:`,
        ...(d.services || []).map(s => `- ${s.name}: $${s.price} (${s.minutes || 30} min)`),
        ``,
        `Submitted: ${new Date().toLocaleString()}`,
        `Support: Luke Hamilton | (561) 813-8602 | luke@vantorxsolutions.com`,
      ].join('\n');

      navigator.clipboard.writeText(summaryText);
      copySummaryBtn.textContent = '✓ Summary Copied!';
      setTimeout(() => { copySummaryBtn.textContent = '📋 Copy Setup Summary'; }, 2500);
    });
  }

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

