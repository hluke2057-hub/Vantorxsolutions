/* ============================================================
   VANTORX ONBOARDING — app.js
   Wizard controller: step routing, progress, validation,
   autosave indicator, reset. Data model lives in state.js.
   ============================================================ */

import { getState, setState, factoryReset, subscribe } from './state.js';
import { probeSession, pushDraft, goLiveOnServer, syncStatus } from './sync.js';
import { confirmDialog, toast } from './components.js';
import { paintBusiness, paintServices } from './steps/business.js';
import { paintHours, paintKnowledge } from './steps/hours.js';
import { paintAI } from './steps/ai.js';
import { paintConnections, paintTests, paintReview } from './steps/launch.js';

const STEPS = [
  { key: 'business',    name: 'Business',    paint: paintBusiness },
  { key: 'services',    name: 'Services',    paint: paintServices },
  { key: 'hours',       name: 'Hours',       paint: paintHours },
  { key: 'knowledge',   name: 'Knowledge',   paint: paintKnowledge },
  { key: 'ai',          name: 'AI Setup',    paint: paintAI },
  { key: 'connections', name: 'Connections', paint: paintConnections },
  { key: 'tests',       name: 'Checklist',   paint: paintTests },
  { key: 'review',      name: 'Go Live',     paint: paintReview },
];

const view = document.getElementById('view');
const progBar = document.getElementById('progBar');
const stepLabel = document.getElementById('stepLabel');
const stepName = document.getElementById('stepName');
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const validationMsg = document.getElementById('validationMsg');
const autosaveFlag = document.getElementById('autosaveFlag');
const progressCard = document.getElementById('progressCard');
const navCard = document.getElementById('navCard');
const resetBtn = document.getElementById('resetBtn');

const ACCESS_CODES = ['VANTORX2026', 'VANTORX', 'LUKE2026', 'CLIENT2026', 'LAUNCH2026'];

function checkUnlocked() {
  if (sessionStorage.getItem('vantorx_onboard_unlocked') === 'true' || localStorage.getItem('vantorx_onboard_unlocked') === 'true') {
    return true;
  }
  const params = new URLSearchParams(window.location.search);
  const code = (params.get('code') || params.get('access') || params.get('key') || '').trim().toUpperCase();
  if (code && ACCESS_CODES.includes(code)) {
    sessionStorage.setItem('vantorx_onboard_unlocked', 'true');
    localStorage.setItem('vantorx_onboard_unlocked', 'true');
    return true;
  }
  return false;
}

let unlocked = checkUnlocked();

function paintGate() {
  if (progressCard) progressCard.style.display = 'none';
  if (navCard) navCard.style.display = 'none';
  if (resetBtn) resetBtn.style.display = 'none';
  if (autosaveFlag) autosaveFlag.style.display = 'none';

  view.innerHTML = `
    <div class="obx-gate-wrap">
      <div class="obx-gate-card">
        <div class="obx-gate-badge">🔒 Private Client Portal</div>
        <h2>Client Onboarding Access</h2>
        <p class="obx-gate-desc">This onboarding pipeline is private and reserved for active VantorX Solutions clients. Enter your Client Access Passcode or sign into your Client Hub account to begin setup.</p>
        
        <div class="obx-gate-form">
          <label class="obx-gate-label" for="gateCode">Client Access Passcode</label>
          <div class="obx-gate-input-row">
            <input type="text" class="obx-gate-input" id="gateCode" placeholder="Enter Access Code (e.g. VANTORX2026)" autocomplete="off" />
            <button class="btn btn-gold" id="unlockGateBtn">Unlock Setup →</button>
          </div>
          <div id="gateError" class="obx-gate-error">✕ Invalid access code. Please check your welcome email or contact Luke.</div>
        </div>

        <div class="obx-gate-divider"><span>OR</span></div>

        <a href="/client-hub/" class="obx-gate-portal-link">
          <span>🔐 Sign in with Client Hub Account</span> ↗
        </a>

        <div class="obx-gate-footer">
          Need your access code? Call or text Luke directly at <a href="tel:5618138602"><strong>(561) 813-8602</strong></a> or email <a href="mailto:luke@vantorxsolutions.com">luke@vantorxsolutions.com</a>.
        </div>
      </div>
    </div>
  `;

  const input = document.getElementById('gateCode');
  const btn = document.getElementById('unlockGateBtn');
  const err = document.getElementById('gateError');

  function tryUnlock() {
    const val = (input.value || '').trim().toUpperCase();
    if (ACCESS_CODES.includes(val)) {
      err.classList.remove('show');
      sessionStorage.setItem('vantorx_onboard_unlocked', 'true');
      localStorage.setItem('vantorx_onboard_unlocked', 'true');
      unlocked = true;
      if (progressCard) progressCard.style.display = '';
      if (navCard) navCard.style.display = '';
      if (resetBtn) resetBtn.style.display = '';
      if (autosaveFlag) autosaveFlag.style.display = '';
      toast('Access verified. Welcome to VantorX Client Onboarding!', 'success');
      render();
    } else {
      err.classList.add('show');
      input.focus();
    }
  }

  btn.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryUnlock();
  });
  input.focus();
}

let current = 0;
let handler = null;   // { validate, collect } returned by the active step

/* ---------------- rendering ---------------- */
function render() {
  if (!unlocked) {
    paintGate();
    return;
  }
  if (progressCard) progressCard.style.display = '';
  if (navCard) navCard.style.display = '';
  if (resetBtn) resetBtn.style.display = '';
  if (autosaveFlag) autosaveFlag.style.display = '';

  const state = getState();
  const step = STEPS[current];

  progBar.innerHTML = STEPS.map((s, i) => `<span class="${i < current ? 'done' : ''}"></span>`).join('');
  stepLabel.textContent = `Step ${current + 1} of ${STEPS.length}`;
  stepName.textContent = step.name;
  backBtn.disabled = current === 0;
  nextBtn.textContent = current === STEPS.length - 1 ? 'Done ✓' : 'Continue →';
  backBtn.style.visibility = current === STEPS.length - 1 ? 'hidden' : 'visible';

  handler = step.paint(view, state.draft, render, goLive, state.completed);
  validationMsg.textContent = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------------- navigation ---------------- */
function validateCurrent() {
  if (!handler) return true;
  const msg = handler.validate();
  validationMsg.textContent = msg;
  validationMsg.classList.toggle('show', !!msg);
  if (msg) toast(msg, 'error');
  return !msg;
}

backBtn.addEventListener('click', () => {
  if (current === 0) return;
  if (handler) handler.collect();
  current -= 1;
  render();
});

nextBtn.addEventListener('click', () => {
  if (!validateCurrent()) return;
  if (handler) handler.collect();
  if (current < STEPS.length - 1) {
    current += 1;
    render();
  } else {
    toast('Onboarding complete — you can review or start over anytime.', 'success');
  }
});

/* ---------------- go-live ---------------- */
async function goLive() {
  if (handler) handler.collect();
  await pushDraft(getState().draft);   // ensure the server has the latest draft before validating
  const res = await goLiveOnServer();
  if (res.ok) {
    setState(s => { s.completed = true; s.completedAt = new Date().toISOString(); });
    toast('🎉 ' + (res.business && res.business.name ? res.business.name : 'Business') + ' is LIVE — saved on the VantorX platform.', 'success');
  } else if (res.blocked) {
    const failed = res.checks
      ? Object.entries(res.checks).filter(([, v]) => !v).map(([k]) => k).join(', ')
      : (res.error || 'validation failed');
    toast('Go-live blocked by the server — failing checks: ' + failed, 'error');
  } else if (res.auth) {
    toast('Not signed in — open the VantorX portal to sign in, then try again.', 'error');
  } else {
    toast('Server unreachable — draft saved locally only (' + (res.error || 'offline') + ')', 'error');
  }
  flashSaved();
  render();
}

/* ---------------- autosave indicator ---------------- */
let flagTimer = null;
function flashSaved() {
  autosaveFlag.classList.add('flash');
  clearTimeout(flagTimer);
  flagTimer = setTimeout(() => autosaveFlag.classList.remove('flash'), 1400);
}

/* ---------------- reset ---------------- */
document.getElementById('resetBtn').addEventListener('click', async () => {
  const ok = await confirmDialog({
    title: 'Start over?',
    message: 'This clears the onboarding draft and starts over from step 1. The next change you make syncs the cleared draft to the platform.',
    confirmText: 'Start over',
    danger: true,
  });
  if (!ok) return;
  factoryReset();
  current = 0;
  render();
  toast('Draft cleared — fresh start.', 'success');
});

/* ---------------- backend sync ---------------- */
let pushTimer = null;
subscribe(() => {
  flashSaved();
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => { pushDraft(getState().draft); }, 800);   // debounced autosave to backend
});

/* ---------------- boot ---------------- */
probeSession().then(({ online, signedIn }) => {
  if (online && signedIn) {
    unlocked = true;
    sessionStorage.setItem('vantorx_onboard_unlocked', 'true');
    pushDraft(getState().draft);
    render();
  }
});
render();
if (unlocked) flashSaved();

