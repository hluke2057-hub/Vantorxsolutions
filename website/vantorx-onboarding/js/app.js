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

let current = 0;
let handler = null;   // { validate, collect } returned by the active step

/* ---------------- rendering ---------------- */
function render() {
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
  window.scrollTo({ top: 0 });
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
    pushDraft(getState().draft);                                          // initial push
  } else if (online && !signedIn) {
    toast('Not signed in — progress saves locally. Sign in at the portal to sync to the platform.', 'info');
  } else {
    toast('Platform server not reachable — progress saves locally only.', 'info');
  }
});
render();
flashSaved();
