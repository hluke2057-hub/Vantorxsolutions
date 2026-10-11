/* ============================================================
   SERVICE: requestService (PRODUCTION — real change-request queue)
   Requests post to /api/change-requests and appear in the real
   VantorX Admin console (_advance via PATCH by staff).
   ============================================================ */

import { getState, setState, createChangeRequest } from '../state.js';

export const REQUEST_TYPES = [
  'Business Information', 'Services', 'Pricing', 'Business Hours', 'AI Behavior',
  'Call Transfers', 'Calendar', 'LeadFlow', 'Phone Number', 'Other',
];

function adaptReqRow(row) {
  return {
    id: row.id,
    requestId: row.id,
    client: getState().business.name,
    business: getState().business.name,
    type: row.type,
    priority: null,                    // not tracked server-side — not invented
    description: row.detail,
    attachmentName: null,
    status: row.status === 'Open' ? 'Submitted' : row.status === 'In Progress' ? 'In Progress' : 'Completed',
    assignedTo: null,
    createdAt: row.at,
    updatedAt: row.at,
  };
}

export const requestService = {
  getRequests() { return getState().requests.map(adaptReqRow).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); },

  async createRequest({ type, priority, description }) {
    const r = await createChangeRequest(type, description);
    if (!r.ok) return r;
    const row = r.row || {};
    return {
      ok: true,
      request: {
        id: row.id, requestId: row.id, type, priority, description,
        status: 'Submitted', createdAt: row.at, updatedAt: row.at,
      },
    };
  },

  updateStatus() {
    // status changes are made by VantorX staff in the Admin console — not by the client
    return { ok: false, error: 'Status changes are made by your VantorX team.' };
  },
};
