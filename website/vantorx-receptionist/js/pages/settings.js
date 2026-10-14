/* ============================================================
   VANTORX AI RECEPTIONIST — pages/settings.js
   Profile settings (persisted server-side), provider matrix,
   and activation gated by the server's fail-closed readiness.
   A 422 from activate shows the exact blockers; nothing is
   activated client-side.
   ============================================================ */

import { esc } from '../utils.js';
import { toast, confirmDialog } from '../components.js';
import { api } from '../api.js';

export function renderSettings(root, ctx) {
  const { store, refresh } = ctx;
  const cfg = store.config;
  if (!cfg) { root.innerHTML = '<div class="dim">Config not loaded.</div>'; return; }
  const p = cfg.profile;
  const rdy = store.readiness || { checks: [], ready: false, blockers: [] };

  root.innerHTML = `
    <div class="grid-2">
      <section class="card">
        <h3>Receptionist profile</h3>
        <div class="field"><label class="label">Greeting ({business} is replaced automatically)</label><input class="input" id="greeting" value="${esc(p.greeting || '')}" placeholder="Thank you for calling {business}…" /></div>
        <div class="field"><label class="label">Personality</label>
          <select class="input" id="personality">
            ${['warm-professional', 'crisp-efficient', 'friendly-casual'].map((x) => `<option ${p.personality === x ? 'selected' : ''}>${x}</option>`).join('')}
          </select></div>
        <div class="field"><label class="label">Transfer number (human fallback)</label><input class="input" id="transfer" value="${esc(p.transferNumber || '')}" placeholder="+1 …" /></div>
        <div class="field"><label class="label">After hours</label>
          <select class="input" id="afterHours">
            ${['message', 'voicemail', 'transfer'].map((x) => `<option ${p.afterHours === x ? 'selected' : ''}>${x}</option>`).join('')}
          </select></div>
        <div class="row gap wrap" style="margin-top:6px">
          <label class="row gap" style="align-items:center"><input type="checkbox" id="allowBooking" ${p.allowBooking ? 'checked' : ''}/> Allow booking</label>
          <label class="row gap" style="align-items:center"><input type="checkbox" id="allowTransfer" ${p.allowTransfer ? 'checked' : ''}/> Allow transfer</label>
          <label class="row gap" style="align-items:center"><input type="checkbox" id="allowMessages" ${p.allowMessages ? 'checked' : ''}/> Take messages</label>
        </div>
        <button class="btn primary" id="saveProfile" style="margin-top:12px">Save profile</button>
      </section>

      <section class="card">
        <h3>Activation</h3>
        <p class="dim small">The server decides. Activation fails closed (HTTP 422) while any required check below is unmet.</p>
        <div class="list">
          ${rdy.checks.map((c) => `
            <div class="list-row">
              <div>${esc(c.label)}${c.required ? ' <span class="dim small">(required)</span>' : ''}</div>
              <span class="status-pill ${c.pass ? 'status-green' : 'status-dim'}"><span class="sdot"></span>${c.pass ? 'pass' : c.required ? 'BLOCKER' : 'todo'}</span>
            </div>`).join('')}
        </div>
        <div class="row gap" style="margin-top:12px">
          ${cfg.active
            ? `<button class="btn danger" id="deact">■ Deactivate receptionist</button>`
            : `<button class="btn gold" id="act">▲ Activate receptionist</button>`}
        </div>
        <div id="blockerMsg" class="dim small" style="margin-top:8px">${rdy.ready ? '' : `Blockers: ${esc(rdy.blockers.join(', '))}`}</div>
      </section>
    </div>

    <section class="card" style="margin-top:18px">
      <h3>Provider matrix <span class="dim small">— honest integration status</span></h3>
      <div class="table-wrap"><table>
        <thead><tr><th>Capability</th><th>Provider</th><th>Status</th><th>What's needed</th></tr></thead>
        <tbody>
          ${(store.providers || []).map((x) => `
            <tr>
              <td><b>${esc(x.capability)}</b></td>
              <td class="dim">${esc(x.provider || '—')}</td>
              <td>${x.status === 'connected' ? '<span class="status-pill status-green"><span class="sdot"></span>connected</span>' : x.status === 'first-party' ? '<span class="status-pill status-gold"><span class="sdot"></span>first-party</span>' : '<span class="status-pill status-dim"><span class="sdot"></span>NOT CONNECTED</span>'}</td>
              <td class="dim small">${esc(x.note || '')}</td>
            </tr>`).join('')}
        </tbody></table></div>
      <p class="dim small" style="margin-top:8px">Until telephony + LLM + STT + TTS are connected to real providers, voice answering is unavailable — the test console remains the way to exercise the full conversation/booking logic against the real calendar.</p>
    </section>`;

  root.querySelector('#saveProfile').addEventListener('click', async () => {
    try {
      await api.saveConfig(store.business.id, { profile: {
        greeting: root.querySelector('#greeting').value.trim(),
        personality: root.querySelector('#personality').value,
        transferNumber: root.querySelector('#transfer').value.trim(),
        afterHours: root.querySelector('#afterHours').value,
        allowBooking: root.querySelector('#allowBooking').checked,
        allowTransfer: root.querySelector('#allowTransfer').checked,
        allowMessages: root.querySelector('#allowMessages').checked,
      } });
      toast('Profile saved to platform', 'success');
      await ctx.refreshAll(); refresh();
    } catch (e) { toast(e.message, 'error'); }
  });

  const actBtn = root.querySelector('#act');
  if (actBtn) actBtn.addEventListener('click', async () => {
    try {
      await api.activate(store.business.id);
      toast('Receptionist ACTIVATED (server-verified readiness)', 'success');
      await ctx.refreshAll(); refresh();
    } catch (e) {
      if (e.status === 422 && e.data && e.data.blockers) {
        toast(`Blocked by server: ${e.data.blockers.join(', ')}`, 'error');
        const box = root.querySelector('#blockerMsg');
        if (box) box.textContent = `Blockers: ${e.data.blockers.join(', ')}`;
      } else { toast(e.message, 'error'); }
    }
  });
  const deactBtn = root.querySelector('#deact');
  if (deactBtn) deactBtn.addEventListener('click', async () => {
    const ok = await confirmDialog({ title: 'Deactivate receptionist?', message: 'Real callers will no longer be answered; the test console stays available.', confirmText: 'Deactivate', danger: true });
    if (!ok) return;
    try {
      await api.deactivate(store.business.id);
      toast('Receptionist deactivated', 'success');
      await ctx.refreshAll(); refresh();
    } catch (e) { toast(e.message, 'error'); }
  });
}
