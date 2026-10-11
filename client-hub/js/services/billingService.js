/* ============================================================
   SERVICE: billingService (PRODUCTION — honest billing state)
   ============================================================ */

import { getState } from '../state.js';

export const billingService = {
  getPlan() {
    // The platform records plan + consent at Business Connect import time.
    // Card processing is NOT CONNECTED — therefore no next-billing date and
    // no manage-billing portal exist. The UI states this plainly.
    return {
      plan: 'Receptionist (via VantorX)',
      price: null,
      status: 'active — billed by your VantorX agreement',
      nextBilling: null,             // no card processor connected — no invented date
      features: [
        'AI Receptionist on your business line',
        'Real appointment booking into your calendar',
        'Call transcripts + outcomes',
        'LeadFlow lead capture & follow-up CRM',
        'Unlimited change requests via your Hub',
      ],
      paymentsConnected: false,
    };
  },
  openManageBilling() {
    return { message: 'Card payments are not connected yet — your VantorX team handles billing directly for now.' };
  },
};
