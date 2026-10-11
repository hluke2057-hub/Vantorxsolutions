/* ============================================================
   VANTORX AI RECEPTIONIST — pages/appointments.js
   Real appointments from the platform DB. Source is shown
   honestly (ai-receptionist / owner / client-hub / seed).
   ============================================================ */

import { esc, fmtTime, relTime } from '../utils.js';
import { toast, confirmDialog } from '../components.js';
import { api } from '../api.js';

export function renderAppointments(root, ctx) {
  const { store, refresh } = ctx;
  const rows = (store.appointments || []).slice().sort((a, b) => new Date(a.at) - new Date(b.at));
  const now = Date.now();
  const upcoming = rows.filter((a) => a.status !== 'Cancelled' && new Date(a.at).getTime() >= now - 36e5);
  const past = rows.filter((a) => !(a.status !== 'Cancelled' && new Date(a.at).getTime() >= now - 36e5)).reverse();

  const row = (a) => `
    <tr>
      <td><b>${fmtTime(a.at)}</b></td>
      <td>${esc(a.customer || '—')}</td>
      <td>${esc(a.service || '')}</td>
      <td class="dim">${a.status === 'Cancelled' ? '<span class="status-pill status-dim"><span class="sdot"></span>cancelled</span>' : esc(a.status)}</td>
      <td class="dim small">${esc(a.bookedBy || a.source || '—')}${a.source === 'ai-receptionist' ? ' 🤖' : ''}</td>
      <td class="dim small">${relTime(a.at)}</td>
      <td>${a.status !== 'Cancelled' && new Date(a.at).getTime() >= now ? `<button class="btn ghost small" data-cancel="${a.id}">Cancel</button>` : ''}</td>
    </tr>`;

  root.innerHTML = `
    <section class="card">
      <h3>Upcoming</h3>
      ${upcoming.length ? `<div class="table-wrap"><table>
        <thead><tr><th>When</th><th>Customer</th><th>Service</th><th>Status</th><th>Booked by</th><th></th><th></th></tr></thead>
        <tbody>${upcoming.map(row).join('')}</tbody></table></div>`
      : '<div class="dim">No upcoming appointments. Book one via the test console — applies are real.</div>'}
    </section>
    <section class="card" style="margin-top:18px">
      <h3>History</h3>
      ${past.length ? `<div class="table-wrap"><table>
        <thead><tr><th>When</th><th>Customer</th><th>Service</th><th>Status</th><th>Booked by</th><th></th><th></th></tr></thead>
        <tbody>${past.slice(0, 25).map(row).join('')}</tbody></table></div>`
      : '<div class="dim">Nothing yet.</div>'}
    </section>`;

  root.querySelectorAll('[data-cancel]').forEach((b) => b.addEventListener('click', async () => {
    const ok = await confirmDialog({ title: 'Cancel appointment?', message: 'This updates the real calendar record.', confirmText: 'Cancel appointment', danger: true });
    if (!ok) return;
    try {
      await fetch(`/api/appointments/${b.dataset.cancel}`, {
        method: 'PATCH', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' }),
      });
      toast('Appointment cancelled', 'success');
      await ctx.refreshAll();
      refresh();
    } catch (e) { toast(e.message, 'error'); }
  }));
}
