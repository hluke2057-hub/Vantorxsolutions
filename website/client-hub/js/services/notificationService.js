/* ============================================================
   SERVICE: notificationService (PRODUCTION — real server rows)
   ============================================================ */

import { getState, setState, markNotificationsRead } from '../state.js';

function adaptNotif(row) {
  return {
    id: row.id,
    title: row.title || '',
    body: row.body || '',
    at: row.at,
    read: !!row.read,
    link: null,
    icon: '•',
  };
}

export const notificationService = {
  getNotifications() { return getState().notifications.map(adaptNotif).sort((a, b) => new Date(b.at) - new Date(a.at)); },
  unreadCount() { return this.getNotifications().filter(n => !n.read).length; },
  async markRead(id) { return markNotificationsRead(id); },
  async markAllRead() { return markNotificationsRead(null); },
};
