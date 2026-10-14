/* ============================================================
   VANTORX ADMIN — pages/activity.js (PRODUCTION)
   Real platform audit log: GET /api/admin/audit.
   Every privileged action on the platform is recorded server-side.
   ============================================================ */

import { esc, relTime } from '../utils.js';
import { emptyState } from '../components.js';
import { audit } from '../realapi.js';

const ACTION_ICONS = {
  'connect.import_created': '📥', 'connect.import_approved': '✅', 'connect.provisioned': '⚙️',
  'connect.golive': '🚀', 'connect.golive.blocked': '⛔', 'connect.provision_verify_failed': '⚠️',
  'business.update': '🏢', 'service.create': '➕', 'service.delete': '🗑️',
  'hours.update': '🕐', 'request.create': '📝', 'request.status': '🔁',
  'user.invite_accepted': '👤', 'rx.config_update': '☎️', 'onboarding.golive': '🚀',
};

export async function renderActivity(root, ctx) {
  root.innerHTML = `<div class="cx-loading">Loading audit trail…</div>`;
  const [a, ov] = await Promise.all([audit(), ctx.overview()]);
  if (a.error) { root.innerHTML = `<div class="card">${emptyState('⚠️', 'Could not load audit log', esc(a.error))}</div>`; return; }
  const rows = a.rows || [];

  const userEmail = {};
  ((ov && ov.users) || []).forEach(u => { userEmail[u.id] = u.email; });

  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">Audit Activity</div>
      <div class="page-sub">Server-recorded trail of every privileged platform action. Newest first (${rows.length} most recent entries).</div>
    </div>
    <div class="card">
      ${rows.length ? `<div>${rows.map(r => `
        <div class="list-row">
          <div class="row-ico" style="background:var(--bg-hover)">${ACTION_ICONS[r.action] || '•'}</div>
          <div class="row-main">
            <div class="row-title"><code>${esc(r.action)}</code> ${esc(r.detail || '')}</div>
            <div class="row-sub">${esc(userEmail[r.userId] || r.userId || 'system')}${r.orgId ? ` · org ${esc(r.orgId)}` : ''}</div>
          </div>
          <div class="row-time">${relTime(r.at)}</div>
        </div>`).join('')}</div>`
        : emptyState('◔', 'Audit log empty', 'Privileged actions will appear here as they happen.')}
    </div>`;
}
