/* ============================================================
   VANTORX ADMIN — pages/providers.js (PRODUCTION)
   Real provider registry from the server environment. Every
   status is evaluated server-side from actual env vars — this
   page never guesses and never fakes a connection.
   ============================================================ */

import { esc, relTime } from '../utils.js';
import { toast, confirmDialog } from '../components.js';
import { api } from '../realapi.js';

const CAPS = [
  { key: 'telephony', label: 'Telephony (real inbound calls)' },
  { key: 'llm', label: 'LLM (conversation brain)' },
  { key: 'stt', label: 'Speech-to-text' },
  { key: 'tts', label: 'Text-to-speech' },
  { key: 'calendar', label: 'Calendar / booking' },
  { key: 'crm', label: 'CRM / LeadFlow' },
  { key: 'email', label: 'Email delivery' },
  { key: 'sms', label: 'SMS delivery' },
  { key: 'payments', label: 'Payments / billing' },
];

function pill(status) {
  if (status === 'connected' || status === 'CONNECTED') return `<span class="status-pill status-green"><span class="sdot"></span>connected</span>`;
  if (status === 'BLOCKED') return `<span class="status-pill status-red"><span class="sdot"></span>blocked</span>`;
  return `<span class="status-pill status-orange"><span class="sdot"></span>not connected</span>`;
}

export async function renderProviders(root, ctx) {
  root.innerHTML = `<div class="page-head"><div class="page-title">Providers</div><div class="page-sub">Live status from server environment variables. Secrets never leave the server.</div></div><div id="pvBody"><div class="card">Loading…</div></div>`;

  const r = await api('GET', '/api/admin/providers');
  const e = await api('GET', '/api/admin/env-status');
  const body = root.querySelector('#pvBody');
  if (r.status !== 200) {
    body.innerHTML = `<div class="card"><div class="cx-error">✕ ${esc(r.error || 'Failed to load provider status')}</div></div>`;
    return;
  }
  const pv = r.providers || {};
  const testsDone = {};

  const capRow = (c) => {
    const st = pv[c.key] || { status: 'NOT_CONNECTED', note: '' };
    return `<tr>
      <td><strong>${esc(c.label)}</strong><div class="cell-dim" style="font-size:0.78rem">${esc(st.note || '')}</div>
        <div class="cell-dim" style="font-size:0.75rem;margin-top:2px">env: ${((st.envPresent || []).length ? '✓ ' + esc((st.envPresent || []).join(', ')) + ' ' : '') + ((st.envMissing || []).length ? '✗ ' + esc((st.envMissing || []).join(', ')) : '')}</div></td>
      <td>${esc(st.provider || '—')}</td>
      <td>${pill(st.status)}</td>
      <td><button class="btn btn-ghost btn-sm" data-test="${esc(c.key)}" ${st.status === 'NOT_CONNECTED' ? 'disabled' : ''}>Test</button><div class="cell-dim" style="font-size:0.75rem;margin-top:4px;max-width:280px" data-testout="${esc(c.key)}"></div></td>
    </tr>`;
  };

  const numRow = (n) => `<tr><td><code>${esc(n.number)}</code></td><td>${esc(n.provider || '')}</td><td>${esc(n.businessId)}</td><td><button class="btn btn-ghost btn-sm" data-unmapnum="${esc(n.id)}" style="color:var(--red)">Unmap</button></td></tr>`;
  const agentRow = (a) => `<tr><td><code>${esc(a.agentId)}</code></td><td>${esc(a.businessId)}</td><td><button class="btn btn-ghost btn-sm" data-unmapagent="${esc(a.id)}" style="color:var(--red)">Unmap</button></td></tr>`;

  const businesses = (ctx.overviewData ? ctx.overviewData.businesses : []) || [];
  const bizOpts = businesses.map(b => `<option value="${esc(b.id)}">${esc(b.name)} (${esc(b.id)})</option>`).join('');

  body.innerHTML = `
    <div class="card">
      <div class="card-title">🔌 Provider registry <span class="dim small">— connected = required env vars present in the SERVER environment</span></div>
      <div class="table-wrap"><table>
        <thead><tr><th>Capability</th><th>Provider</th><th>Status</th><th>Live test</th></tr></thead>
        <tbody>${CAPS.map(capRow).join('')}</tbody>
      </table></div>
    </div>

    <div class="card">
      <div class="card-title">📞 Voice number mapping <span class="dim small">— which business answers each phone number (Twilio)</span></div>
      ${r.voiceNumbers && r.voiceNumbers.length ? `<div class="table-wrap"><table><thead><tr><th>Number</th><th>Provider</th><th>Business</th><th></th></tr></thead><tbody>${r.voiceNumbers.map(numRow).join('')}</tbody></table></div>` : '<p class="cell-dim" style="margin:0 0 10px">No numbers mapped. A real caller dialing an unmapped number gets a "not in service" response — never a fake receptionist.</p>'}
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:end;margin-top:10px">
        <div><label class="cell-dim small">Number (E.164)</label><br><input id="vnNum" placeholder="+13125550142" style="min-width:180px"></div>
        <div><label class="cell-dim small">Business</label><br><select id="vnBiz" style="min-width:220px">${bizOpts}</select></div>
        <button class="btn btn-gold btn-sm" id="vnAdd">Map number</button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🤖 Retell agent mapping <span class="dim small">— Retell agent → business (voice pipeline mode)</span></div>
      ${r.voiceAgents && r.voiceAgents.length ? `<div class="table-wrap"><table><thead><tr><th>Agent ID</th><th>Business</th><th></th></tr></thead><tbody>${r.voiceAgents.map(agentRow).join('')}</tbody></table></div>` : '<p class="cell-dim" style="margin:0 0 10px">No Retell agents mapped.</p>'}
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:end;margin-top:10px">
        <div><label class="cell-dim small">Agent ID</label><br><input id="vaId" placeholder="agent_..." style="min-width:180px"></div>
        <div><label class="cell-dim small">Business</label><br><select id="vaBiz" style="min-width:220px">${bizOpts}</select></div>
        <button class="btn btn-gold btn-sm" id="vaAdd">Map agent</button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🔐 Server environment variables <span class="dim small">— names and presence only, never values</span></div>
      ${e.status === 200 ? `<div class="table-wrap"><table><thead><tr><th>Variable</th><th>Present</th></tr></thead><tbody>
        ${(e.rows || []).map(v => `<tr><td><code>${esc(v.name)}</code></td><td>${v.present ? '<span class="status-pill status-green"><span class="sdot"></span>yes</span>' : '<span class="status-pill status-orange"><span class="sdot"></span>no</span>'}</td></tr>`).join('')}
      </tbody></table></div><p class="cell-dim small" style="margin:8px 0 0">Set secrets in the server environment or <code>platform/.env</code> (git-ignored), then restart the server.</p>` : `<div class="cx-error">✕ ${esc(e.error || 'env status unavailable')}</div>`}
    </div>`;

  body.querySelectorAll('[data-test]').forEach(btn => btn.addEventListener('click', async function () {
    const cap = this.dataset.test;
    this.disabled = true;
    const out = body.querySelector(`[data-testout="${cap}"]`);
    out.textContent = 'testing…';
    const t = await api('POST', '/api/admin/providers/test', { capability: cap });
    this.disabled = false;
    testsDone[cap] = true;
    out.textContent = t.status ? `${t.status} — ${t.detail || ''}` : (t.error || 'test failed');
    toast(`${cap}: ${t.status || 'error'}`, t.status === 'CONNECTED' ? 'success' : 'info');
  }));

  body.querySelector('#vnAdd').addEventListener('click', async () => {
    const number = body.querySelector('#vnNum').value.trim();
    const businessId = body.querySelector('#vnBiz').value;
    if (!number) { toast('Enter a phone number', 'info'); return; }
    const res = await api('POST', '/api/admin/voice/numbers', { number, businessId });
    if (res.status === 201) { toast('Number mapped', 'success'); renderProviders(root, ctx); }
    else toast(res.error || 'Mapping failed', 'info');
  });
  body.querySelector('#vaAdd').addEventListener('click', async () => {
    const agentId = body.querySelector('#vaId').value.trim();
    const businessId = body.querySelector('#vaBiz').value;
    if (!agentId) { toast('Enter an agent ID', 'info'); return; }
    const res = await api('POST', '/api/admin/voice/agents', { agentId, businessId });
    if (res.status === 201) { toast('Agent mapped', 'success'); renderProviders(root, ctx); }
    else toast(res.error || 'Mapping failed', 'info');
  });
  body.querySelectorAll('[data-unmapnum]').forEach(btn => btn.addEventListener('click', async function () {
    if (!(await confirmDialog({ title: 'Unmap number?', message: 'Callers to this number will no longer reach a receptionist.', confirmText: 'Unmap' }))) return;
    const res = await api('DELETE', `/api/admin/voice/numbers/${encodeURIComponent(this.dataset.unmapnum)}`);
    if (res.status === 200) { toast('Unmapped', 'success'); renderProviders(root, ctx); } else toast(res.error || 'Failed', 'info');
  }));
  body.querySelectorAll('[data-unmapagent]').forEach(btn => btn.addEventListener('click', async function () {
    if (!(await confirmDialog({ title: 'Unmap agent?', message: 'This Retell agent will no longer route to a business.', confirmText: 'Unmap' }))) return;
    const res = await api('DELETE', `/api/admin/voice/agents/${encodeURIComponent(this.dataset.unmapagent)}`);
    if (res.status === 200) { toast('Unmapped', 'success'); renderProviders(root, ctx); } else toast(res.error || 'Failed', 'info');
  }));
}
