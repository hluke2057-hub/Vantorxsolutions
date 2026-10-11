/* ============================================================
   SERVICE: appointmentService (PRODUCTION — real server rows)
   Reschedule + cancel write through to the platform server.
   ============================================================ */

import { getState, setState, cancelAppointment, rescheduleAppointment } from '../state.js';

function adaptApptRow(row) {
  return {
    id: row.id,
    customer: row.customer,
    service: row.service,
    date: row.at,
    status: row.status,
    bookedBy: row.bookedBy || 'Owner',
    notes: row.notes || '',
    wasRescheduled: row.status === 'Rescheduled',
  };
}

export const appointmentService = {
  getAppointments() { return getState().appointments.map(adaptApptRow).sort((a, b) => new Date(a.date) - new Date(b.date)); },
  getAppointment(id) { return this.getAppointments().find(a => a.id === id) || null; },

  metrics() {
    const now = Date.now();
    const appts = this.getAppointments();
    return {
      upcoming: appts.filter(a => new Date(a.date) > now && a.status !== 'Cancelled').length,
      bookedByAI: appts.filter(a => a.bookedBy === 'AI Receptionist').length,
      rescheduled: appts.filter(a => a.status === 'Rescheduled').length,
      cancelled: appts.filter(a => a.status === 'Cancelled').length,
    };
  },
  todaysAppointments() {
    const today = new Date().toDateString();
    return this.getAppointments().filter(a => new Date(a.date).toDateString() === today);
  },

  async reschedule(id, newDate) {
    return rescheduleAppointment(id, newDate.toISOString ? newDate.toISOString() : newDate);
  },
  async cancel(id) {
    return cancelAppointment(id);
  },
};
