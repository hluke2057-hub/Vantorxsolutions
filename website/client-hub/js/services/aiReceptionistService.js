/* ============================================================
   SERVICE: aiReceptionistService (PRODUCTION — real config API)
   Status/toggle/knowledge come from /api/receptionist/config.
   Activation is fail-closed server-side (readiness blockers
   surfaced honestly). Test console uses the real talk API.
   ============================================================ */

import { getState, setState, saveRxProfile, rxActivate, rxDeactivate, runAiTest, runAiTurn } from '../state.js';
import { api } from '../live.js';

export const aiReceptionistService = {
  getStatus() {
    const s = getState();
    const ai = s.ai;
    return {
      online: ai.status === 'online',
      label: ai.status === 'online' ? 'ONLINE' : 'OFFLINE',
      name: ai.name,
      voice: 'Web test console',       // no paid voice provider — the honest answer
      phone: s.business.phone,
      calendar: ai.calendar,
      transferNumber: ai.transferNumber,
    };
  },

  getBusinessInfo() {
    const s = getState();
    return {
      name: s.business.name,
      services: [],                    // real services come from /api/services — fetched where used
      hours: null,                     // hours editor is server-backed via /api/hours — edited there
      location: s.business.address,
      policies: null, payments: null,  // knowledge endpoints below carry the real text
    };
  },

  async updateBusinessInfo(patch) {
    // business profile fields → businesses PATCH (name/phone/city are the
    // writable fields); knowledge text → receptionist config PUT, which
    // expects knowledge.policies = { cancellation, payment, walkins }.
    const profile = {};
    if (patch.name != null) profile.name = patch.name;
    if (patch.phone != null) profile.phone = patch.phone;
    if (patch.address != null) profile.city = patch.address;
    if (Object.keys(profile).length) {
      const r = await api('PATCH', `/api/businesses/${encodeURIComponent(getState().__bizId || '')}`, profile);
      if (!r.ok) return r;
    }
    const kb = {};
    if (patch.policies != null) kb.policies = { ...(kb.policies || {}), cancellation: patch.policies };
    if (patch.payments != null) kb.policies = { ...(kb.policies || {}), payment: patch.payments };
    if (Object.keys(kb).length) return saveRxProfile({ knowledge: kb });
    return { ok: true };
  },

  async fetchServices() {
    const r = await api('GET', '/api/services');
    return (r.rows || []).filter(x => x.businessId === getState().__bizId);
  },

  async fetchHours() {
    return api('GET', `/api/hours/${encodeURIComponent(getState().__bizId || '')}`);
  },

  async setStatus(online) {
    const r = online ? await rxActivate() : await rxDeactivate();
    if (!r.ok) {
      // fail-closed: surface the server's real blockers
      const blockers = (r.blockers || []).join(', ').replace(/,\s+/g, ', ');
      return { ok: false, error: blockers ? `Cannot go online — not ready: ${blockers}` : (r.error || 'Activation refused') };
    }
    return { ok: true };
  },

  async setTransferNumber(num) {
    return saveRxProfile({ profile: { transferNumber: num } });
  },

  async startTest() {
    return runAiTest();
  },
  async turn(sessionId, text) {
    return runAiTurn(sessionId, text);
  },
};
