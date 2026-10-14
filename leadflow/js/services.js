/* ============================================================
   VANTORX LEADFLOW — services.js (PRODUCTION)
   Honest service adapters. Lead data lives on the platform
   server. SMS, email, AI drafting and external calendars are
   NOT CONNECTED yet — they switch on when VantorX connects
   the providers (credentials held server-side, never here).
   Nothing in this file simulates a send or invents a reply.
   ============================================================ */

export const ENV = {
  SMS_PROVIDER: null,       // set server-side when VantorX connects a provider
  EMAIL_PROVIDER: null,
  AI_PROVIDER: null,
  CALENDAR_PROVIDER: 'platform-first-party'
};

export function isDemoMode() { return false; }

/* ---------- SMS ---------- */
export const smsService = {
  async send({ to, body }) {
    return { ok: false, error: 'SMS sending is not connected yet — automations switch on when your messaging provider goes live.' };
  }
};

/* ---------- Email ---------- */
export const emailService = {
  async send({ to, subject, body }) {
    return { ok: false, error: 'Email sending is not connected yet — automations switch on when your email provider goes live.' };
  }
};

/* ---------- AI message drafting ---------- */
export const aiMessageService = {
  async generate(opts) {
    return { ok: false, error: 'AI drafting is not connected yet.' };
  },
  async transform(message, kind) {
    return { ok: false, error: 'AI drafting is not connected yet.' };
  }
};

/* ---------- CSV import helper (pure parsing — creates real leads) ---------- */
const FIELD_ALIASES = {
  firstName: ['firstname', 'first', 'given', 'givenname', 'name'],
  lastName: ['lastname', 'last', 'surname', 'family', 'familyname'],
  phone: ['phone', 'mobile', 'cell', 'tel', 'telephone'],
  email: ['email', 'e-mail', 'mail'],
  company: ['company', 'business', 'organisation', 'organization'],
  source: ['source', 'origin', 'channel'],
  serviceInterest: ['service', 'serviceinterest', 'interest'],
  estimatedValue: ['value', 'estimate', 'estimatedvalue'],
  status: ['status', 'stage']
};

function normalizeHeader(h) {
  return String(h || '').toLowerCase().replace(/[^a-z]/g, '');
}

export const leadImportService = {
  import(rows, mapping, defaults = {}) {
    const leads = [];
    const errors = [];
    rows.forEach((row, i) => {
      const rec = {};
      mapping.forEach((field, col) => {
        if (!field) return;
        rec[field] = String(row[col] ?? '').trim();
      });
      /* if no mapping was chosen, try to guess from headers */
      if (!Object.keys(rec).length) {
        (rows.__headers || []).forEach((h, col) => {
          const n = normalizeHeader(h);
          for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
            if (aliases.includes(n)) rec[field] = String(row[col] ?? '').trim();
          }
        });
      }
      const name = [rec.firstName, rec.lastName].filter(Boolean).join(' ');
      if (!name) { errors.push(`Row ${i + 2}: missing name`); return; }
      if (rec.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rec.email)) { errors.push(`Row ${i + 2}: invalid email`); return; }
      leads.push({
        firstName: rec.firstName || name.split(/\s+/)[0] || '',
        lastName: rec.lastName || name.split(/\s+/).slice(1).join(' ') || '',
        phone: rec.phone || '',
        email: rec.email || '',
        company: rec.company || '',
        source: rec.source || defaults.source || 'Manual',
        serviceInterest: rec.serviceInterest || '',
        estimatedValue: rec.estimatedValue ? Number(String(rec.estimatedValue).replace(/[^0-9.]/g, '')) || null : null,
        status: rec.status || defaults.status || 'New'
      });
    });
    return { leads, errors };
  }
};
