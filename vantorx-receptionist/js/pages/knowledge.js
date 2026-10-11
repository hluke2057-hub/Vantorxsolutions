/* ============================================================
   VANTORX AI RECEPTIONIST — pages/knowledge.js
   Canonical business data (services, hours, location) comes
   from the platform records — shown read-only here with a
   pointer to where it's managed. FAQs + receptionist policies
   are receptionist-scoped and editable (persisted server-side).
   ============================================================ */

import { esc } from '../utils.js';
import { toast } from '../components.js';
import { api } from '../api.js';

export function renderKnowledge(root, ctx) {
  const { store, refresh } = ctx;
  const cfg = store.config;
  const hours = store.hours || (store.business && null);
  const k = cfg ? cfg.knowledge : { faqs: [], policies: {} };

  const dayRow = (d, label) => {
    if (!hours || !hours[d]) return '';
    const r = hours[d];
    return `<div class="kv-row"><span>${label}</span><b>${r.closed ? 'Closed' : `${esc(r.open)} – ${esc(r.close)}`}</b></div>`;
  };

  root.innerHTML = `
    <div class="grid-2">
      <section class="card">
        <h3>Canonical business data <span class="dim small">— managed in Onboarding/Admin</span></h3>
        <div class="kv-list">
          <div class="kv-row"><span>Business</span><b>${esc(store.business ? store.business.name : '')}</b></div>
          <div class="kv-row"><span>Location</span><b>${esc([store.business && store.business.city].filter(Boolean).join('') || '—')}</b></div>
          <div class="kv-row"><span>Timezone</span><b>${esc((store.business && store.business.timezone) || 'local')}</b></div>
        </div>
        <h4 style="margin:12px 0 4px">Services (price · duration)</h4>
        <div class="list">
          ${(store.services || []).map((s) => `<div class="list-row"><div>${esc(s.name)}</div><b>$${esc(s.price)} · ${esc(s.minutes)} min</b></div>`).join('') || '<div class="dim">No services configured.</div>'}
        </div>
        <h4 style="margin:12px 0 4px">Hours</h4>
        <div class="kv-list">
          ${dayRow('mon', 'Monday')}${dayRow('tue', 'Tuesday')}${dayRow('wed', 'Wednesday')}${dayRow('thu', 'Thursday')}${dayRow('fri', 'Friday')}${dayRow('sat', 'Saturday')}${dayRow('sun', 'Sunday')}
          ${!hours ? '<div class="dim small">Hours record not loaded.</div>' : ''}
        </div>
      </section>
      <section class="card">
        <h3>Receptionist knowledge <span class="dim small">— saved to the platform</span></h3>
        <h4 style="margin:8px 0 4px">FAQs</h4>
        <div id="faqList" class="list">
          ${(k.faqs || []).map((f) => `
            <div class="list-row">
              <div><div>${esc(f.q)}</div><div class="dim small">${esc(f.a)}</div></div>
              <button class="btn ghost small" data-del="${esc(f.q)}">Remove</button>
            </div>`).join('') || '<div class="dim">No FAQs yet.</div>'}
        </div>
        <div class="row gap wrap" style="margin-top:8px">
          <input class="input" id="faqQ" placeholder="Question" style="max-width:220px" />
          <input class="input grow" id="faqA" placeholder="Answer" />
          <button class="btn primary" id="faqAdd">Add FAQ</button>
        </div>
        <h4 style="margin:14px 0 4px">Policies</h4>
        <div class="field"><label class="label">Cancellation</label><input class="input" id="polC" value="${esc((k.policies || {}).cancellation || '')}" /></div>
        <div class="field"><label class="label">Walk-ins</label><input class="input" id="polW" value="${esc((k.policies || {}).walkins || '')}" /></div>
        <div class="field"><label class="label">Payment</label><input class="input" id="polP" value="${esc((k.policies || {}).payment || '')}" /></div>
        <button class="btn primary" id="polSave" style="margin-top:10px">Save policies</button>
      </section>
    </div>`;

  const bid = store.business.id;
  const saveFaqs = async (faqs) => {
    try {
      await api.saveConfig(bid, { knowledge: { faqs } });
      toast('Saved to platform', 'success');
      await ctx.refreshAll(); refresh();
    } catch (e) { toast(e.message, 'error'); }
  };

  root.querySelector('#faqAdd').addEventListener('click', () => {
    const q = root.querySelector('#faqQ').value.trim();
    const a = root.querySelector('#faqA').value.trim();
    if (!q || !a) { toast('Question and answer required', 'error'); return; }
    saveFaqs([...(store.config.knowledge.faqs || []), { q, a }]);
  });
  root.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => {
    saveFaqs((store.config.knowledge.faqs || []).filter((f) => f.q !== b.dataset.del));
  }));
  root.querySelector('#polSave').addEventListener('click', async () => {
    try {
      await api.saveConfig(bid, { knowledge: { policies: {
        cancellation: root.querySelector('#polC').value.trim(),
        walkins: root.querySelector('#polW').value.trim(),
        payment: root.querySelector('#polP').value.trim(),
      } } });
      toast('Policies saved', 'success');
      await ctx.refreshAll(); refresh();
    } catch (e) { toast(e.message, 'error'); }
  });
}
