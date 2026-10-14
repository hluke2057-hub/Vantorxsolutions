/* ============================================================
   VANTORX LEADFLOW — app.js
   Router, shell wiring, notifications, global search.
   ============================================================ */

import { loadState, getState, subscribe, clearSelection, addLead, markAllNotificationsRead, markNotificationRead, clearNotifications, emit, boot, platformLogin, platformLogout } from './store.js';
import { escapeHTML as esc, relTime } from './utils.js';
import { openModal, toast, confirmDialog } from './components.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderLeads, openLeadForm, openImport } from './pages/leads.js';
import { renderProfile } from './pages/profile.js';
import { renderPipeline, renderQueue } from './pages/pipeline.js';
import { renderAutomations, renderTemplates } from './pages/automations.js';
import { renderActivity, renderAnalytics, renderAppointments } from './pages/insights.js';
import { renderIntegrations, renderSettings, maybeShowOnboarding } from './pages/config.js';

/* ---------- router ---------- */
let currentPage = 'dashboard';
const TITLES = {
  dashboard: 'Dashboard', leads: 'Leads', pipeline: 'Pipeline', queue: 'Follow-Up Queue',
  automations: 'Automations', templates: 'Templates', appointments: 'Appointments',
  activity: 'Activity', analytics: 'Analytics', integrations: 'Integrations', settings: 'Settings'
};

function navigate(page, opts = {}) {
  if (!TITLES[page]) page = 'dashboard';
  currentPage = page;
  clearSelection();
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  const view = document.getElementById('viewRoot');
  const pageEl = document.getElementById('pageRoot');
  pageEl.scrollTop = 0;
  closeMobileNav();

  switch (page) {
    case 'dashboard': renderDashboard(view); break;
    case 'leads': renderLeads(view); break;
    case 'pipeline': renderPipeline(view); break;
    case 'queue': renderQueue(view); break;
    case 'automations': renderAutomations(view); break;
    case 'templates': renderTemplates(view); break;
    case 'appointments': renderAppointments(view); break;
    case 'activity': renderActivity(view); break;
    case 'analytics': renderAnalytics(view); break;
    case 'integrations': renderIntegrations(view); break;
    case 'settings': renderSettings(view); break;
  }
  /* re-scroll + focus main region for a11y */
  pageEl.setAttribute('tabindex', '-1');
}

function renderCurrent() {
  navigate(currentPage);
}

/* ---------- global API for cross-page actions ---------- */
window.LeadFlow = {
  navigate,
  openLead(leadId) {
    currentPage = 'lead-profile';
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    const view = document.getElementById('viewRoot');
    document.getElementById('pageRoot').scrollTop = 0;
    renderProfile(view, leadId);
  },
  openAIAssistant(leadId) {
    window.LeadFlow.openLead(leadId);
    setTimeout(() => document.querySelector('[data-ai="generate"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
  },
  openImport() {
    currentPage = 'leads';
    renderLeads(document.getElementById('viewRoot'));
    setTimeout(() => openImport(), 250);
  },
  openQuickAdd() {
    openLeadForm(null, () => renderCurrent());
  },
  render: renderCurrent
};

/* ---------- shell wiring ---------- */
function wireShell() {
  /* nav */
  document.querySelectorAll('.nav-item').forEach(btn =>
    btn.addEventListener('click', () => navigate(btn.dataset.page)));

  /* delegated nav buttons rendered inside pages (data-nav) */
  document.getElementById('viewRoot').addEventListener('click', (e) => {
    const nav = e.target.closest('[data-nav]');
    if (nav) { navigate(nav.dataset.nav); return; }
    const quick = e.target.closest('[data-action="quick-add"]');
    if (quick) { window.LeadFlow.openQuickAdd(); }
  });

  /* badges */
  refreshBadges();

  /* quick add */
  document.getElementById('quickAddBtn').addEventListener('click', () => window.LeadFlow.openQuickAdd());

  /* global search — jumps to leads with query applied */
  const gs = document.getElementById('globalSearch');
  gs.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && gs.value.trim()) {
      navigate('leads');
      setTimeout(() => {
        const inp = document.getElementById('leadSearch');
        if (inp) {
          inp.value = gs.value.trim();
          inp.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, 60);
    }
  });
  gs.addEventListener('input', () => {
    if (!gs.value && currentPage === 'leads') {
      const inp = document.getElementById('leadSearch');
      if (inp) { inp.value = ''; inp.dispatchEvent(new Event('input', { bubbles: true })); }
    }
  });

  /* notifications dropdown */
  document.getElementById('notifBtn').addEventListener('click', openNotificationCenter);

  /* business switcher */
  document.getElementById('bizSwitcher').addEventListener('click', () => {
    toast('Multi-business workspaces arrive with the team backend.', 'info');
  });

  /* help dialog */
  document.getElementById('helpBtn').addEventListener('click', openHelp);

  /* mobile drawer */
  document.getElementById('mobileMenuBtn').addEventListener('click', openMobileNav);
  document.getElementById('mobileOverlay').addEventListener('click', closeMobileNav);

  /* keyboard shortcuts */
  document.addEventListener('keydown', (e) => {
    const inField = /input|textarea|select/i.test(e.target.tagName);
    if (e.key === '/' && !inField) { e.preventDefault(); gs.focus(); }
    if (inField) return;
    if (e.key === 'n' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); window.LeadFlow.openQuickAdd(); }
  });

  /* store subscription: refresh badges + live-render current page */
  subscribe((state) => {
    refreshBadges();
    /* live update current view (except forms which manage their own re-renders) */
  });
}

function refreshBadges() {
  const s = getState();
  const leads = s.leads.filter(l => !l.archived).length;
  const overdue = s.tasks.filter(t => !t.completed && new Date(t.dueAt) < new Date()).length;
  const queue = s.tasks.filter(t => !t.completed).length;
  const bl = document.getElementById('badgeLeads');
  const bq = document.getElementById('badgeQueue');
  if (bl) bl.textContent = leads;
  if (bq) { bq.textContent = queue + (overdue ? '!' : ''); bq.classList.toggle('urgent', overdue > 0); }
  const dot = document.getElementById('notifDot');
  const unread = s.notifications.filter(n => !n.read).length;
  if (dot) dot.style.display = unread ? 'block' : 'none';
}

/* ---------- notification center ---------- */
function openNotificationCenter() {
  const draw = (close) => {
    const s = getState();
    const items = s.notifications;
    const closeRef = close;
    const body = items.length ? items.map(n => `
      <div class="toggle-row" style="gap:12px;cursor:pointer" data-ntf="${n.id}">
        <div style="display:flex;gap:11px;align-items:flex-start">
          <span style="font-size:1.05rem">${{ new_lead: '✨', reply: '⚡', followup: '⏰', booking: '📅', automation: '⚙️', status: '🔀', info: '✦' }[n.type] || '🔔'}</span>
          <div>
            <div class="toggle-label" style="${n.read ? 'color:var(--text-soft);font-weight:500' : ''}">${esc(n.title)}</div>
            <div class="toggle-sub">${esc(n.body)}</div>
            <div class="toggle-sub" style="margin-top:2px">${relTime(n.createdAt)}</div>
          </div>
        </div>
        ${!n.read ? '<span class="dot" style="position:static;width:8px;height:8px;border-radius:50%;background:var(--gold-bright);flex-shrink:0"></span>' : ''}
      </div>`).join('')
      : '<div style="color:var(--text-dim);text-align:center;padding:30px 0">You\'re all caught up.</div>';

    const modal = openModal({
      title: 'Notifications',
      body: body,
      footer: `<button class="btn btn-ghost btn-sm" data-markall>Mark all read</button><button class="btn btn-ghost btn-sm" data-clear>Clear all</button><button class="btn btn-gold btn-sm" data-close2>Close</button>`,
      onOpen(m) {
        m.querySelector('[data-close2]').addEventListener('click', closeRef);
        m.querySelector('[data-markall]').addEventListener('click', () => { markAllNotificationsRead(); closeRef(); openNotificationCenter(); });
        m.querySelector('[data-clear]').addEventListener('click', () => { clearNotifications(); closeRef(); });
        m.querySelectorAll('[data-ntf]').forEach(row => row.addEventListener('click', () => {
          markNotificationRead(row.dataset.ntf);
          closeRef();
        }));
      }
    });
  };
  draw(() => {});
}

/* ---------- help dialog ---------- */
function openHelp() {
  openModal({
    title: 'Help & Shortcuts',
    body: `
      <div class="panel-title" style="margin-bottom:8px">Keyboard shortcuts</div>
      <div class="stat-row"><span><kbd>/</kbd> focus search</span></div>
      <div class="stat-row"><span><kbd>N</kbd> quick add lead</span></div>
      <div class="stat-row"><span><kbd>Esc</kbd> close dialogs</span></div>
      <div class="panel-title" style="margin:16px 0 8px">About this build</div>
      <p style="color:var(--text-soft);font-size:0.86rem">LeadFlow runs on the <strong>live VantorX platform</strong>: leads, activity, appointments and notifications are stored server-side and every change saves immediately. SMS/email automations and AI drafting are shown honestly as not connected until their providers go live.</p>
      <div class="panel-title" style="margin:16px 0 8px">Quick tour</div>
      <p style="color:var(--text-soft);font-size:0.86rem">1. Dashboard → 2. open a lead → 3. change status or book an appointment → 4. Pipeline drag & drop → 5. Appointments → 6. Analytics → 7. Integrations.</p>`,
    footer: `<button class="btn btn-gold btn-sm" data-close2>Got it</button>`,
    onOpen(m) { m.querySelector('[data-close2]').addEventListener('click', m.querySelector('.modal-close').onclick); }
  });
}

/* ---------- mobile nav ---------- */
function openMobileNav() {
  document.getElementById('sidebar').classList.add('mobile-open');
  document.getElementById('mobileOverlay').style.display = 'block';
}
function closeMobileNav() {
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('mobileOverlay').style.display = 'none';
}

/* ---------- session gate ---------- */
function showGate(mode, errText) {
  const existing = document.getElementById('lfGate');
  if (existing) existing.remove();
  const gate = document.createElement('div');
  gate.id = 'lfGate';
  gate.style.cssText = 'position:fixed;inset:0;background:rgba(8,8,10,0.92);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px';
  if (mode === 'admin') {
    gate.innerHTML = `<div class="card card-pad" style="width:min(480px,100%);text-align:center">
      <div style="font-size:2rem">🛡️</div>
      <div class="panel-title" style="margin:10px 0 6px">Platform admin account</div>
      <p style="color:var(--text-soft);font-size:0.86rem;margin-bottom:16px">LeadFlow is for business owner and staff accounts. Use the VantorX Admin console to manage tenants.</p>
      <div style="display:flex;gap:9px;justify-content:center;flex-wrap:wrap">
        <a class="btn btn-gold btn-sm" href="/vantorx-admin/admin-app.html" style="text-decoration:none">Open Admin console →</a>
        <button class="btn btn-ghost btn-sm" id="lfGateOut" style="color:var(--red)">Sign out</button>
      </div>
    </div>`;
  } else if (mode === 'onboard') {
    gate.innerHTML = `<div class="card card-pad" style="width:min(480px,100%);text-align:center">
      <div style="font-size:2rem">🚀</div>
      <div class="panel-title" style="margin:10px 0 6px">Your business is being set up</div>
      <p style="color:var(--text-soft);font-size:0.86rem;margin-bottom:16px">Your VantorX team is building and configuring LeadFlow for you. You will get access here as soon as it is ready.</p>
      <div style="display:flex;gap:9px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" id="lfGateOut" style="color:var(--red)">Sign out</button>
      </div>
    </div>`;
  } else if (mode === 'error') {
    gate.innerHTML = `<div class="card card-pad" style="width:min(480px,100%);text-align:center">
      <div style="font-size:2rem">📡</div>
      <div class="panel-title" style="margin:10px 0 6px">Platform server not reachable</div>
      <p style="color:var(--text-soft);font-size:0.86rem;margin-bottom:16px">${esc(errText || 'The server did not respond.')} LeadFlow only shows real platform data — it stays empty until the server responds.</p>
      <div style="display:flex;gap:9px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-gold btn-sm" id="lfGateRetry">Retry</button>
        <a class="btn btn-ghost btn-sm" href="/" style="text-decoration:none">← Portal home</a>
      </div>
    </div>`;
  } else {
    gate.innerHTML = `<div class="card card-pad" style="width:min(430px,100%)">
      <div class="panel-title" style="margin-bottom:6px">🔐 Sign in to LeadFlow</div>
      <p style="color:var(--text-soft);font-size:0.84rem;margin-bottom:14px">Your CRM data lives on the VantorX platform — sign in to see your live leads.</p>
      <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="lfEmail" type="email" autocomplete="username"/></div>
      <div class="form-group"><label class="form-label">Password</label><input class="form-input" id="lfPass" type="password" autocomplete="current-password"/></div>
      <div id="lfErr"></div>
      <div style="display:flex;gap:9px;margin-top:14px">
        <button class="btn btn-gold" id="lfGo">Sign in</button>
        <a class="btn btn-ghost" href="/" style="text-decoration:none;display:inline-flex;align-items:center">← Portal home</a>
      </div>
    </div>`;
  }
  document.body.appendChild(gate);

  gate.querySelector('#lfGateOut')?.addEventListener('click', async () => { await platformLogout(); gate.remove(); showGate('signin'); });
  gate.querySelector('#lfGateRetry')?.addEventListener('click', () => start());
  const go = gate.querySelector('#lfGo');
  if (go) {
    const submit = async () => {
      const email = gate.querySelector('#lfEmail').value.trim();
      const pass = gate.querySelector('#lfPass').value;
      gate.querySelector('#lfErr').innerHTML = '';
      const r = await platformLogin(email, pass);
      if (!r.ok) { gate.querySelector('#lfErr').innerHTML = `<div class="form-error">✕ ${esc(r.error)}</div>`; return; }
      gate.remove();
      if (r.mode !== 'ready') { showGate(r.mode); return; }
      navigate('dashboard');
    };
    go.addEventListener('click', submit);
    gate.querySelector('#lfPass').addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  }
}

/* ---------- identity (sidebar business + user) ---------- */
function paintIdentity() {
  const s = getState();
  if (s.settings) document.getElementById('bizName').textContent = s.settings.business.name || 'VantorX';
  const u = getState().settings && document.getElementById('lfUserName');
  if (u) {
    const name = s.settings.ownerName || '';
    u.textContent = name;
    document.getElementById('lfUserInitials').textContent = name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';
    const role = s.settings.team[0] && s.settings.team[0].role;
    document.getElementById('lfUserRole').textContent = role || 'Owner';
  }
}

/* ---------- boot ---------- */
async function start() {
  wireShell();
  const mode = await boot();
  if (mode !== 'ready') { showGate(mode); return; }
  paintIdentity();
  navigate('dashboard');
}
start();
