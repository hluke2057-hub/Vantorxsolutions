/* ============================================================
   VANTORX LEADFLOW — pages/config.js
   Integrations · Settings · Onboarding wizard.
   ============================================================ */

import {
  getState, saveSettings, saveAutomation, resetDemoData, setOnboarded,
  addLead, updateLead, startAutomation, markAllNotificationsRead, platformLogout
} from '../store.js';
import { escapeHTML as esc, uid, SOURCES } from '../utils.js';
import { openModal, confirmDialog, toast, field, readForm, toggle, emptyState } from '../components.js';
import { isDemoMode } from '../services.js';

/* ============================================================
   INTEGRATIONS
   ============================================================ */
const INTEGRATIONS = [
  { cat: 'Communication', name: 'Twilio', icon: '📞', desc: 'SMS messaging for follow-ups and text-back.', status: 'Not connected' },
  { cat: 'Communication', name: 'SendGrid', icon: '✉️', desc: 'Transactional email delivery.', status: 'Not connected' },
  { cat: 'Communication', name: 'Resend', icon: '📨', desc: 'Modern email API for follow-up sequences.', status: 'Not connected' },
  { cat: 'Communication', name: 'Gmail', icon: '📧', desc: 'Send follow-ups from your Gmail account.', status: 'Not connected' },
  { cat: 'Communication', name: 'Outlook', icon: '📤', desc: 'Send follow-ups from your Outlook account.', status: 'Not connected' },
  { cat: 'Calendars', name: 'Cal.com', icon: '🗓️', desc: 'Real availability and instant booking links.', status: 'Not connected' },
  { cat: 'Calendars', name: 'Google Calendar', icon: '📆', desc: 'Two-way sync for booked appointments.', status: 'Not connected' },
  { cat: 'Calendars', name: 'Outlook Calendar', icon: '🕐', desc: 'Book into Outlook-hosted calendars.', status: 'Not connected' },
  { cat: 'Lead Sources', name: 'Website Forms', icon: '🌐', desc: 'Capture form submissions as leads via webhook.', status: 'Not connected' },
  { cat: 'Lead Sources', name: 'Meta Lead Ads', icon: '📣', desc: 'Facebook & Instagram lead forms.', status: 'Not connected' },
  { cat: 'Lead Sources', name: 'TikTok Lead Ads', icon: '🎵', desc: 'TikTok instant form capture.', status: 'Not connected' },
  { cat: 'Lead Sources', name: 'Google Ads', icon: '🔍', desc: 'Search lead extensions and forms.', status: 'Not connected' },
  { cat: 'Lead Sources', name: 'Zapier', icon: '⚡', desc: 'Connect thousands of apps to LeadFlow.', status: 'Not connected' },
  { cat: 'Lead Sources', name: 'Webhooks', icon: '🪝', desc: 'Custom inbound webhooks for any source.', status: 'Not connected' },
  { cat: 'CRM / Data', name: 'HubSpot', icon: '🧭', desc: 'Two-way contact sync.', status: 'Not connected' },
  { cat: 'CRM / Data', name: 'GoHighLevel', icon: '🎯', desc: 'Sync leads and conversations.', status: 'Not connected' },
  { cat: 'CRM / Data', name: 'Salesforce', icon: '☁️', desc: 'Enterprise CRM synchronization.', status: 'Not connected' },
  { cat: 'CRM / Data', name: 'CSV Import', icon: '📄', desc: 'Import leads from any spreadsheet.', status: 'Connected' }
];

export function renderIntegrations(root) {
  const cats = ['Communication', 'Calendars', 'Lead Sources', 'CRM / Data'];
  root.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Integrations</div>
        <div class="page-subtitle">Statuses are honest — nothing is marked live until its provider is actually connected.</div>
      </div>
      <span class="badge badge-connected">LEADS: LIVE</span>
    </div>
    ${cats.map(cat => `
      <div class="int-cat-label">${cat}</div>
      <div class="int-grid">
        ${INTEGRATIONS.filter(i => i.cat === cat).map(i => `
          <div class="card card-hover int-card">
            <div class="int-head">
              <div class="int-logo">${i.icon}</div>
              <div><div class="int-name">${esc(i.name)}</div></div>
            </div>
            <div class="int-desc">${esc(i.desc)}</div>
            <div class="int-foot">
              <span class="badge ${i.status === 'Connected' ? 'badge-connected' : i.status === 'Demo mode' ? 'badge-demo' : 'badge-not-connected'}">${esc(i.status)}</span>
              <div style="display:flex;gap:6px">
                ${i.status === 'Not connected' ? `<button class="btn btn-ghost btn-sm" data-int-connect="${esc(i.name)}">Connect</button>` : `<button class="btn btn-ghost btn-sm" data-int-settings="${esc(i.name)}">Settings</button>`}
              </div>
            </div>
          </div>`).join('')}
      </div>`).join('')}
  `;

  root.querySelectorAll('[data-int-connect]').forEach(b =>
    b.addEventListener('click', () => {
      openModal({
        title: `Connect ${b.dataset.intConnect}`,
        body: `      <p style="color:var(--text-soft);font-size:0.88rem">This provider is not connected yet. Your VantorX team connects providers with credentials held server-side — nothing is ever stored in the app itself.</p>
          <div class="form-hint" style="margin-top:12px">Request the connection any time via the Hub's “Request Changes”.</p>`,
        footer: `<button class="btn btn-ghost" data-cancel>Close</button>`,
        onOpen(modal) { modal.querySelector('[data-cancel]').addEventListener('click', modal.querySelector('.modal-close').onclick); }
      });
    }));
  root.querySelectorAll('[data-int-settings]').forEach(b =>
    b.addEventListener('click', () => toast(`${b.dataset.intSettings} is ${INTEGRATIONS.find(i => i.name === b.dataset.intSettings)?.status}`, 'info')));
}

/* ============================================================
   SETTINGS
   ============================================================ */
export function renderSettings(root) {
  let tab = 'Business';
  const TABS = ['Business', 'Team', 'Leads', 'Pipeline', 'Automation', 'Notifications', 'Branding', 'Data'];

  root.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Settings</div>
        <div class="page-subtitle">Configure LeadFlow for your business.</div>
      </div>
    </div>
    <div class="settings-tabs" id="setTabs">
      ${TABS.map(t => `<button class="settings-tab ${t === tab ? 'active' : ''}" data-tab="${t}">${t}</button>`).join('')}
    </div>
    <div class="settings-section" id="setBody"></div>`;

  const body = root.querySelector('#setBody');

  function draw() {
    const st = getState();
    if (tab === 'Business') {
      const b = st.settings.business;
      body.innerHTML = `<div class="card card-pad">
        ${field({ label: 'Business name', name: 'bizName', value: b.name, full: true })}
        <div class="form-row">
          ${field({ label: 'Website', name: 'bizSite', value: b.website })}
          ${field({ label: 'Phone', name: 'bizPhone', value: b.phone })}
        </div>
        <div class="form-row">
          ${field({ label: 'Email', name: 'bizEmail', value: b.email })}
          ${field({ label: 'Time zone', name: 'bizTZ', type: 'select', options: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles'], value: b.timeZone })}
        </div>
        <button class="btn btn-gold btn-sm" id="saveBiz">Save business info</button>
        <div class="form-hint" style="margin-top:10px">Name, phone and time zone save to the platform server. Website and email are display-only until the platform tracks them.</div>
      </div>`;
      body.querySelector('#saveBiz').addEventListener('click', async () => {
        const r = await saveSettings({ business: { ...b, name: body.querySelector('[name="bizName"]').value, website: body.querySelector('[name="bizSite"]').value, phone: body.querySelector('[name="bizPhone"]').value, email: body.querySelector('[name="bizEmail"]').value, timeZone: body.querySelector('[name="bizTZ"]').value } });
        if (!r || r.ok === false) return;
        toast('Business info saved to the platform server');
      });
    }
    if (tab === 'Team') {
      body.innerHTML = `<div class="card card-pad">
        <div class="table-wrap"><table>
          <thead><tr><th>Name</th><th>Role</th><th>Initials</th></tr></thead>
          <tbody>${st.settings.team.map(m => `<tr>
            <td>${esc(m.name)}</td>
            <td><select class="select-input" data-role="${esc(m.name)}" style="width:140px">${['Admin', 'Manager', 'Sales Rep', 'Viewer'].map(r => `<option ${m.role === r ? 'selected' : ''}>${r}</option>`).join('')}</select></td>
            <td><span class="user-avatar">${esc(m.initials)}</span></td>
          </tr>`).join('')}</tbody>
        </table></div>
        <div class="form-hint" style="margin-top:12px">Roles: Admin manages everything · Manager manages leads + automations · Sales Rep owns their leads · Viewer has read-only access.</div>
      </div>`;
      body.querySelectorAll('[data-role]').forEach(sel => sel.addEventListener('change', () => {
        const member = st.settings.team.find(m => m.name === sel.dataset.role);
        if (member) member.role = sel.value;
        saveSettings({ team: st.settings.team }); toast('Role kept for this session — team accounts arrive with the team backend', 'info');
      }));
    }
    if (tab === 'Leads') {
      const ls = st.settings.leadSettings;
      body.innerHTML = `<div class="card card-pad">
        <div class="form-row">
          ${field({ label: 'Default owner', name: 'defOwner', type: 'select', options: st.settings.team.map(m => m.name), value: ls.defaultOwner })}
          ${field({ label: 'Default status', name: 'defStatus', type: 'select', options: st.settings.pipeline.stages, value: ls.defaultStatus })}
        </div>
        <div class="form-label" style="margin-bottom:8px">Lead sources</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
          ${SOURCES.map(sr => `<span class="chip">${esc(sr)}</span>`).join('')}
          <button class="btn btn-ghost btn-sm" id="addSource">+ Custom source</button>
        </div>
        ${toggle('quietHours', ls.quietHours.enabled, 'Quiet hours', 'Pause automated sends overnight')}
        ${ls.quietHours.enabled ? `<div class="form-row" style="margin-top:12px">
          ${field({ label: 'From', name: 'qhFrom', type: 'time', value: ls.quietHours.from })}
          ${field({ label: 'To', name: 'qhTo', type: 'time', value: ls.quietHours.to })}
        </div>` : ''}
        <button class="btn btn-gold btn-sm" id="saveLeadSet" style="margin-top:14px">Save lead settings</button>
      </div>`;
      body.querySelector('#addSource').addEventListener('click', () => toast('Custom sources can be typed when adding a lead', 'info'));
      body.querySelector('#saveLeadSet').addEventListener('click', () => {
        saveSettings({ leadSettings: { ...ls, defaultOwner: body.querySelector('[name="defOwner"]').value, defaultStatus: body.querySelector('[name="defStatus"]').value, quietHours: { ...ls.quietHours, enabled: body.querySelector('[name="quietHours"]').checked, from: body.querySelector('[name="qhFrom"]')?.value || ls.quietHours.from, to: body.querySelector('[name="qhTo"]')?.value || ls.quietHours.to } } });
        toast('Lead settings kept for this session — server-side preferences arrive with the team backend', 'info');
      });
    }
    if (tab === 'Pipeline') {
      body.innerHTML = `<div class="card card-pad">
        <div class="form-label" style="margin-bottom:10px">Pipeline stages (reorder)</div>
        <div id="stageList">${st.settings.pipeline.stages.map((s2, i) => `
          <div class="auto-step-row"><span class="auto-step-num">${i + 1}</span>
            <input class="form-input" data-stage="${i}" value="${esc(s2)}" style="flex:1"/>
            <div class="step-up-down">
              <button data-up="${i}" ${i === 0 ? 'disabled' : ''}>▲</button>
              <button data-down="${i}" ${i === st.settings.pipeline.stages.length - 1 ? 'disabled' : ''}>▼</button>
            </div>
          </div>`).join('')}</div>
        <div style="display:flex;gap:8px;margin-top:14px">
          <button class="btn btn-ghost btn-sm" id="addStage">+ Add stage</button>
          <button class="btn btn-gold btn-sm" id="saveStages">Save stages</button>
        </div>
        <div class="form-hint" style="margin-top:10px">Stage names apply across the board, table, and kanban.</div>
      </div>`;
      const stages = [...st.settings.pipeline.stages];
      body.querySelectorAll('[data-stage]').forEach(inp => inp.addEventListener('change', () => { stages[Number(inp.dataset.stage)] = inp.value; }));
      body.querySelectorAll('[data-up]').forEach(b => b.addEventListener('click', () => {
        const i = Number(b.dataset.up);
        if (i > 0) { [stages[i - 1], stages[i]] = [stages[i], stages[i - 1]]; saveSettings({ pipeline: { stages: [...stages] } }); draw(); }
      }));
      body.querySelectorAll('[data-down]').forEach(b => b.addEventListener('click', () => {
        const i = Number(b.dataset.down);
        if (i < stages.length - 1) { [stages[i + 1], stages[i]] = [stages[i], stages[i + 1]]; saveSettings({ pipeline: { stages: [...stages] } }); draw(); }
      }));
      body.querySelector('#addStage').addEventListener('click', () => { stages.push('New Stage'); saveSettings({ pipeline: { stages } }); draw(); });
      body.querySelector('#saveStages').addEventListener('click', () => { saveSettings({ pipeline: { stages } }); toast('Stage names kept for this session', 'info'); });
    }
    if (tab === 'Automation') {
      const ls = st.settings.leadSettings;
      body.innerHTML = `<div class="card card-pad">
        ${toggle('autoEnabled', true, 'Follow-up automations', 'Master switch for all sequences')}
        ${toggle('quiet', ls.quietHours.enabled, 'Respect quiet hours', 'Hold SMS/email during quiet hours')}
        <div class="form-label" style="margin:14px 0 8px">Default delays for new sequences</div>
        <div class="form-row">
          ${field({ label: 'First message', name: 'd1', value: 'Immediately' })}
          ${field({ label: 'Second touch', name: 'd2', value: '4 hours' })}
        </div>
        <div class="form-row">
          ${field({ label: 'Third touch', name: 'd3', value: '1 day' })}
          ${field({ label: 'Final touch', name: 'd4', value: '3 days' })}
        </div>
        <div class="form-hint">Stop rules are configured per sequence: reply, booking, opt-out, or lost status.</div>
      </div>`;
    }
    if (tab === 'Notifications') {
      const n = st.settings.notifications;
      body.innerHTML = `<div class="card card-pad">
        ${toggle('nNewLead', n.newLead, 'New lead', 'When a lead is captured from any source')}
        ${toggle('nReply', n.reply, 'Lead replied')}
        ${toggle('nBooking', n.booking, 'Appointment booked')}
        ${toggle('nFollowup', n.followupDue, 'Follow-up due')}
        <button class="btn btn-gold btn-sm" id="saveNotif" style="margin-top:14px">Save notification settings</button>
      </div>`;
      body.querySelector('#saveNotif').addEventListener('click', () => {
        saveSettings({ notifications: { newLead: body.querySelector('[name="nNewLead"]').checked, reply: body.querySelector('[name="nReply"]').checked, booking: body.querySelector('[name="nBooking"]').checked, followupDue: body.querySelector('[name="nFollowup"]').checked } });
        toast('Notification preferences kept for this session', 'info');
      });
    }
    if (tab === 'Branding') {
      const br = st.settings.branding;
      body.innerHTML = `<div class="card card-pad">
        ${field({ label: 'Display name', name: 'brandName', value: br.displayName, full: true })}
        <div class="form-group">
          <label class="form-label">Accent color</label>
          <input type="color" name="brandAccent" value="${br.accent}" style="width:64px;height:38px;border:1px solid var(--border);border-radius:9px;background:var(--bg);padding:4px;cursor:pointer"/>
        </div>
        <button class="btn btn-gold btn-sm" id="saveBrand">Save branding</button>
      </div>`;
      body.querySelector('#saveBrand').addEventListener('click', () => {
        const accent = body.querySelector('[name="brandAccent"]').value;
        saveSettings({ branding: { ...br, displayName: body.querySelector('[name="brandName"]').value, accent } });
        document.documentElement.style.setProperty('--gold', accent);
        toast('Branding kept for this session', 'info');
      });
    }
    if (tab === 'Data') {
      body.innerHTML = `<div class="card card-pad">
        <div class="panel-title" style="margin-bottom:8px">Your data</div>
        <p style="color:var(--text-soft);font-size:0.86rem;margin-bottom:16px">Leads, notes, activity and appointments live on the VantorX platform server — not in your browser. Export pulls a snapshot of what is on the server right now.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-ghost btn-sm" id="exportData">⬇ Export data (JSON)</button>
          <button class="btn btn-ghost btn-sm" id="lfSignOut" style="color:var(--red)">Sign out</button>
        </div>
      </div>`;
      body.querySelector('#exportData').addEventListener('click', () => {
        const blob = JSON.stringify(getState(), null, 2);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([blob], { type: 'application/json' }));
        a.download = 'leadflow-data.json'; a.click();
        toast('Data exported');
      });
      body.querySelector('#lfSignOut').addEventListener('click', async () => {
        const ok = await confirmDialog({ title: 'Sign out?', message: 'End your LeadFlow session.', confirmText: 'Sign out', danger: true });
        if (!ok) return;
        await platformLogout();
        location.reload();
      });
    }
  }

  root.querySelector('#setTabs').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    root.querySelectorAll('.settings-tab').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); tab = b.dataset.tab; draw();
  });
  draw();
}

/* ============================================================
   ONBOARDING WIZARD
   ============================================================ */
export function maybeShowOnboarding(rootEl) {
  const st = getState();
  if (st.onboarded) return;
  showOnboarding();
}

export function showOnboarding() {
  const data = { industry: null, sources: [], providers: [], bizName: getState().settings.business.name };
  const steps = ['Welcome', 'Business', 'Industry', 'Sources', 'Providers', 'Automation', 'Leads', 'Finish'];
  let step = 0;

  const overlay = document.createElement('div');
  overlay.className = 'onboard-overlay';
  document.body.appendChild(overlay);

  function draw() {
    const progress = steps.map((s, i) => `<span class="${i <= step ? 'done' : ''}"></span>`).join('');
    let content = '';
    if (step === 0) content = `
      <div class="onboard-title">Welcome to VantorX LeadFlow</div>
      <div class="onboard-sub">Never let a lead go cold. Let's set you up in about a minute.</div>
      <div class="onboard-option selected"><span class="onboard-ico">✨</span><div><strong>Everything is wired for demo</strong><div style="font-size:0.76rem;color:var(--text-dim)">Sample data is loaded so you can explore immediately.</div></div></div>`;
    if (step === 1) content = `
      <div class="onboard-title">Business information</div>
      <div class="onboard-sub">Used across templates as {{business_name}}.</div>
      ${field({ label: 'Business name', name: 'obName', value: data.bizName, required: true, full: true })}
      ${field({ label: 'Owner name', name: 'obOwner', value: getState().settings.ownerName, full: true })}`;
    if (step === 2) content = `
      <div class="onboard-title">What industry are you in?</div>
      <div class="onboard-sub">We tune sample services and message tone.</div>
      ${['Barbershop', 'Tattoo Studio', 'Salon / Med Spa', 'Gym / Fitness', 'Auto Services', 'Home Services', 'Dental', 'Real Estate', 'Other'].map(ind =>
        `<button class="onboard-option ${data.industry === ind ? 'selected' : ''}" data-ind="${ind}"><span class="onboard-ico">${industryIcon(ind)}</span>${ind}</button>`).join('')}`;
    if (step === 3) content = `
      <div class="onboard-title">Where do your leads come from?</div>
      <div class="onboard-sub">Pick all that apply.</div>
      ${['Phone', 'Website', 'Instagram', 'Facebook', 'TikTok', 'Google', 'Walk-in', 'Referral'].map(src =>
        `<button class="onboard-option ${data.sources.includes(src) ? 'selected' : ''}" data-src="${src}"><span class="onboard-ico">${industryIcon(src)}</span>${src}</button>`).join('')}`;
    if (step === 4) content = `
      <div class="onboard-title">Communication providers</div>
      <div class="onboard-sub">These stay in demo mode until a backend is connected.</div>
      <div class="onboard-option selected"><span class="onboard-ico">💬</span><div><strong>SMS — demo adapter</strong><div style="font-size:0.76rem;color:var(--text-dim)">Simulated delivery, honest labeling.</div></div></div>
      <div class="onboard-option selected"><span class="onboard-ico">📧</span><div><strong>Email — demo adapter</strong><div style="font-size:0.76rem;color:var(--text-dim)">Simulated delivery, honest labeling.</div></div></div>`;
    if (step === 5) content = `
      <div class="onboard-title">Create your first automation</div>
      <div class="onboard-sub">The classic 5-touch follow-up, pre-built for you.</div>
      <div class="onboard-option selected"><span class="onboard-ico">⚡</span><div><strong>“New Lead Follow-Up” — 5 steps</strong><div style="font-size:0.76rem;color:var(--text-dim)">SMS immediately → Email 4h → SMS 1d → Email 2d → Final SMS 3d. Stops on reply or booking.</div></div></div>`;
    if (step === 6) content = `
      <div class="onboard-title">Add your leads</div>
      <div class="onboard-sub">Sample leads are already loaded — or import your own anytime.</div>
      <button class="onboard-option" data-ob="import"><span class="onboard-ico">📄</span>Import a CSV now</button>
      <button class="onboard-option selected" data-ob="sample"><span class="onboard-ico">✅</span>Start with sample leads</button>`;
    if (step === 7) content = `
      <div class="onboard-title">You're all set 🎉</div>
      <div class="onboard-sub">Your dashboard is live with ${getState().leads.filter(l => !l.archived).length} leads. Explore freely — nothing here is sent to anyone.</div>
      <div class="onboard-option selected"><span class="onboard-ico">🚀</span><div><strong>Open LeadFlow</strong><div style="font-size:0.76rem;color:var(--text-dim)">Dashboard → Leads → Pipeline → Automations → Analytics</div></div></div>`;

    overlay.innerHTML = `
      <div class="onboard-card">
        <div class="onboard-progress">${progress}</div>
        ${content}
        <div style="display:flex;justify-content:space-between;margin-top:24px">
          <button class="btn btn-ghost btn-sm" id="obBack" ${step === 0 ? 'disabled' : ''}>← Back</button>
          <div style="display:flex;gap:8px">
            <button class="btn btn-ghost btn-sm" id="obSkip">Skip</button>
            ${step < 7 ? '<button class="btn btn-gold btn-sm" id="obNext">Continue →</button>' : '<button class="btn btn-gold btn-sm" id="obDone">Finish setup</button>'}
          </div>
        </div>
      </div>`;

    /* wiring */
    overlay.querySelectorAll('[data-ind]').forEach(b => b.addEventListener('click', () => { data.industry = b.dataset.ind; draw(); }));
    overlay.querySelectorAll('[data-src]').forEach(b => b.addEventListener('click', () => {
      const src = b.dataset.src;
      data.sources = data.sources.includes(src) ? data.sources.filter(x => x !== src) : [...data.sources, src];
      draw();
    }));
    overlay.querySelector('[data-ob="import"]')?.addEventListener('click', () => { finish(); window.LeadFlow.navigate('leads'); setTimeout(() => window.LeadFlow.openImport(), 300); });
    overlay.querySelector('#obBack').addEventListener('click', () => { if (step > 0) { step--; draw(); } });
    overlay.querySelector('#obSkip').addEventListener('click', finish);
    overlay.querySelector('#obNext')?.addEventListener('click', () => {
      if (step === 1) {
        const name = overlay.querySelector('[name="obName"]')?.value.trim();
        const owner = overlay.querySelector('[name="obOwner"]')?.value.trim();
        if (name) saveSettings({ business: { ...getState().settings.business, name } });
        if (owner) saveSettings({ ownerName: owner });
      }
      step++; draw();
    });
    overlay.querySelector('#obDone')?.addEventListener('click', finish);
  }

  function finish() {
    setOnboarded();
    overlay.remove();
    toast('Setup complete — welcome to LeadFlow');
    window.LeadFlow.render();
  }

  draw();
}

function industryIcon(ind) {
  const map = {
    Barbershop: '💈', 'Tattoo Studio': '🖋️', 'Salon / Med Spa': '💅', 'Gym / Fitness': '🏋️',
    'Auto Services': '🚗', 'Home Services': '🏠', Dental: '🦷', 'Real Estate': '🏡', Other: '🏢',
    Phone: '📞', Website: '🌐', Instagram: '📸', Facebook: '📘', TikTok: '🎵', Google: '🔍',
    'Walk-in': '🚶', Referral: '🤝'
  };
  return map[ind] || '•';
}
