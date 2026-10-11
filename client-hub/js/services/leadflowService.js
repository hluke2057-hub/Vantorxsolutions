/* ============================================================
   SERVICE: leadflowService (PRODUCTION — real lead rows)
   Read-only overview; full CRM in the LeadFlow app.
   Fields the platform doesn't track are null — never invented.
   ============================================================ */

import { getState } from '../state.js';

function adaptLeadRow(row) {
  return {
    id: row.id,
    name: row.name,
    service: null,
    source: row.source || '—',
    status: row.status || 'New',
    score: null,
    lastContact: row.updatedAt || row.createdAt || null,
    nextFollowUp: null,
    phone: row.phone || '',
    email: row.email || '',
    notes: row.notes || '',
  };
}

export const leadflowService = {
  getLeads() { return getState().leads.map(adaptLeadRow).sort((a, b) => new Date(b.lastContact) - new Date(a.lastContact)); },

  getMetrics() {
    const leads = this.getLeads();
    const total = leads.length;
    const count = st => leads.filter(l => l.status === st).length;
    const booked = count('Booked');
    return {
      total, new: count('New'), contacted: count('Contacted'), responded: count('Responded'), booked,
      conversion: total ? Math.round((booked / total) * 100) : 0,
      responded2: count('Responded'),
    };
  },

  pipelineCounts() {
    const leads = this.getLeads();
    return ['New', 'Contacted', 'Responded', 'Booked', 'Lost'].map(stage => ({
      stage, count: leads.filter(l => l.status === stage).length,
    }));
  },

  needsAttention() { return this.getLeads().filter(l => l.status === 'New' || l.status === 'Contacted').map(l => ({ ...l, attention: 'due' })); },
  followUpQueue() { return []; },   // real queue lives in the LeadFlow CRM
  markTaskDone() { return { ok: false, error: 'Follow-up tasks live in the LeadFlow CRM.' }; },
};
