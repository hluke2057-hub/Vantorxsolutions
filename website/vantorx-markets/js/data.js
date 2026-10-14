/* ============================================================
   VANTORX MARKETS INTELLIGENCE — data.js
   UI constants only. This build has NO synthetic market
   universe: every market row comes from the live Polymarket
   sync (see app.js). Nothing here contains invented data.
   ============================================================ */

export const CATEGORY_ICON = {
  Politics: '🏛️', Sports: '⚽', Crypto: '₿', Economics: '📈', 'Tech & AI': '🤖', Culture: '🎬',
};

/* icon for any category string, including live ones Polymarket returns */
export function categoryIcon(cat) {
  return CATEGORY_ICON[cat] || '🎯';
}
