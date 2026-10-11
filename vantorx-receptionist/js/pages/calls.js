/* ============================================================
   VANTORX AI RECEPTIONIST — pages/calls.js
   Call history straight from the platform DB, transcript modal.
   web-test records are clearly labeled and never shown as
   production telephony calls.
   ============================================================ */

import { esc, relTime, fmtTime } from '../utils.js';
import { modal } from '../components.js';
import { api } from '../api.js';

let filter = 'all';
let query = '';

function outcomeTag(o, testMode) {
  const map = {
    'appointment-booked': 'status-green',
    rescheduled: 'status-green',
    cancelled: 'status-orange',
    transferred: 'status-blue',
    'transfer-preview': 'status-blue',
    'message-taken': 'status-gold',
    answered: 'status-dim',
    missed: 'status-dim',
  };
  const cls = map[o] || 'status-dim';
  const label = (o || 'answered').replace('appointment-booked', 'booked').replace('message-taken', 'message') + (testMode ? ' · TEST' : '');
  return `<span class="status-pill ${cls}"><span class="sdot"></span>${esc(label)}</span>`;
}

export function renderCalls(root, ctx) {
  const { store } = ctx;
  const calls = store.calls || [];
  const shown = calls.filter((c) => {
    const okF = filter === 'all' || (filter === 'booked' ? c.outcome === 'appointment-booked' : c.outcome === filter);
    const okQ = !query || [c.caller, c.phone, c.summary].join(' ').toLowerCase().includes(query);
    return okF && okQ;
  });
  root.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Total calls</div><div class="kpi-value">${calls.length}</div></div>
      <div class="kpi"><div class="kpi-label">Booked</div><div class="kpi-value">${calls.filter((c) => c.outcome === 'appointment-booked').length}</div></div>
      <div class="kpi"><div class="kpi-label">Transfers</div><div class="kpi-value">${calls.filter((c) => /transfer/.test(c.outcome)).length}</div></div>
      <div class="kpi"><div class="kpi-label">Test-mode calls</div><div class="kpi-value">${calls.filter((c) => c.testMode).length}</div><div class="kpi-hint">channel: web-test</div></div>
    </div>
    <section class="card">
      <div class="row between wrap" style="margin-bottom:10px">
        <div class="row gap wrap">
          ${['all', 'booked', 'transferred', 'message-taken'].map((f) => `<button class="chip${filter === f ? ' active' : ''}" data-filter="${f}">${f === 'all' ? 'All' : f.replace('-', ' ')}</button>`).join('')}
        </div>
        <input class="input" id="q" placeholder="Search calls…" value="${esc(query)}" style="max-width:220px" />
      </div>
      ${shown.length ? `
      <div class="table-wrap"><table>
        <thead><tr><th>Caller</th><th>Phone</th><th>When</th><th>Channel</th><th>Outcome</th><th>Summary</th><th></th></tr></thead>
        <tbody>${shown.map((c) => `
          <tr>
            <td><b>${esc(c.caller || c.from || '—')}</b></td>
            <td class="dim">${esc(c.phone || '')}</td>
            <td class="dim">${fmtTime(c.at)}</td>
            <td class="dim">${esc(c.channel || 'telephony')}</td>
            <td>${outcomeTag(c.outcome, c.testMode)}</td>
            <td class="dim small">${esc(c.summary || '')}</td>
            <td><button class="btn ghost small" data-open="${c.id}">View</button></td>
          </tr>`).join('')}</tbody>
      </table></div>` : '<div class="dim">No calls match. Run the test console to generate a real backend record.</div>'}
    </section>`;
  wireCalls(root, ctx);
}

function wireCalls(root, ctx) {
  root.querySelectorAll('[data-filter]').forEach((b) => b.addEventListener('click', () => { filter = b.dataset.filter; renderCalls(root, ctx); }));
  const q = root.querySelector('#q');
  q.addEventListener('input', () => { query = q.value.toLowerCase().trim(); renderCalls(root, ctx); const q2 = root.querySelector('#q'); q2.focus(); q2.setSelectionRange(q2.value.length, q2.value.length); });
  root.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => openDetail(b.dataset.open, ctx)));
}

function openDetail(id, ctx) {
  const c = ((ctx && ctx.store) || { calls: [] }).calls.find((x) => x.id === id);
  if (!c) return;
  modal({
    title: `Call — ${c.caller || c.from}`,
    wide: true,
    body: `
      <div class="kv-list" style="margin-bottom:10px">
        <div class="kv-row"><span>Channel</span><b>${esc(c.channel || 'telephony')}${c.testMode ? ' (TEST MODE)' : ''}</b></div>
        <div class="kv-row"><span>Phone</span><b>${esc(c.phone || '—')}</b></div>
        <div class="kv-row"><span>When</span><b>${fmtTime(c.at)} (${relTime(c.at)})</b></div>
        <div class="kv-row"><span>Outcome</span><b>${esc(c.outcome || 'answered')}</b></div>
        <div class="kv-row"><span>Summary</span><b>${esc(c.summary || '—')}</b></div>
      </div>
      <h4 style="margin:6px 0">Transcript</h4>
      <div class="transcript" style="max-height:300px">
        ${Array.isArray(c.transcript)
          ? (c.transcript.map((m) => `
            <div class="tr ${m.role === 'caller' ? 'tr-caller' : m.role === 'ai' ? 'tr-ai' : 'tr-sys'}">
              ${m.role !== 'sys' ? `<div class="tr-who">${m.role === 'caller' ? 'Caller' : 'AI Receptionist'}</div>` : ''}
              <div class="tr-text">${esc(m.text)}</div>
            </div>`).join('') || '<div class="dim">No transcript recorded.</div>')
          : (c.transcript
            ? `<div class="tr tr-sys"><div class="tr-text">${esc(String(c.transcript))}</div></div>`
            : '<div class="dim">No transcript recorded.</div>')}
      </div>`,
    actions: [{ label: 'Close', kind: 'primary', fn: () => {} }],
  });
}
