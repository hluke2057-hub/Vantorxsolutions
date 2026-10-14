/* ============================================================
   SERVICE: callService (PRODUCTION — real server rows)
   ============================================================ */

import { getState, setState, cancelAppointment, rescheduleAppointment } from '../state.js';

function adaptCallRow(row) {
  /* server rows come in two real shapes: seeded call log (from + string
     transcript) and web-test sessions (caller/phone, durationSec, array
     transcript, appointmentId). Handle both — never invent fields. */
  const from = row.from || row.caller || 'Unknown caller';
  const phone = row.phone || row.from || '';
  const transcriptBlocks = Array.isArray(row.transcript)
    ? row.transcript.map(t => ({ who: t.role === 'caller' ? 'human' : 'ai', text: t.text || '', t: t.at || '' }))
    : String(row.transcript || '').split(' / ').filter(Boolean).map(line => {
        const i = line.indexOf(':');
        return i > 0 ? { who: /^(caller|client|customer)/i.test(line.slice(0, i)) ? 'human' : 'ai', text: line.slice(i + 1).trim(), t: '' }
                     : { who: 'ai', text: line, t: '' };
      });
  const outcome = row.outcome === 'appointment-booked' ? 'booked' : (row.outcome || 'info');
  return {
    id: row.id,
    caller: from.replace(/^\+1\s*/, ''),
    phone,
    date: row.at || row.createdAt,
    duration: (row.durationSec != null) ? row.durationSec : null,   // only web-test rows carry it
    outcome,
    summary: row.summary || '',
    transcriptBlocks,
    apptId: row.appointmentId || null,
    handled: row.handledBy === 'AI' ? 'AI receptionist' : (row.handledBy || 'AI receptionist'),
    note: row.notes || '',
  };
}

export const callService = {
  getCalls() { return getState().calls.map(adaptCallRow).sort((a, b) => new Date(b.date) - new Date(a.date)); },
  getCall(id) { return this.getCalls().find(c => c.id === id) || null; },

  metrics() {
    const calls = this.getCalls();
    const today = new Date().toDateString();
    const answered = calls.filter(c => c.outcome !== 'missed');
    const booked = calls.filter(c => c.outcome === 'booked');
    return {
      total: calls.length,
      answered: answered.length,
      missed: calls.filter(c => c.outcome === 'missed').length,
      transferred: calls.filter(c => c.outcome === 'transferred').length,
      booked: booked.length,
      faq: calls.filter(c => c.outcome === 'faq' || c.outcome === 'info').length,
      answeredRate: calls.length ? Math.round((answered.length / calls.length) * 100) : 0,
      today: calls.filter(c => new Date(c.date).toDateString() === today).length,
      missedToday: calls.filter(c => c.outcome === 'missed' && new Date(c.date).toDateString() === today).length,
    };
  },
  callsToday() { const t = new Date().toDateString(); return this.getCalls().filter(c => new Date(c.date).toDateString() === t); },
  answeredToday() { return this.callsToday().filter(c => c.outcome !== 'missed').length; },
  missedToday() { return this.metrics().missedToday; },

  metrics2() { return this.metrics(); },

  async addNote(id, note) {
    // the real platform does not store call notes yet — say so instead of faking persistence
    return { ok: false, error: 'Call notes are not stored on the platform yet — notes are attached to appointments instead.' };
  },
};
