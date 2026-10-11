/* ============================================================
   VANTORX MARKETS INTELLIGENCE — pages/portfolio.js
   Honest by design: no broker, wallet or paper-trading book
   is connected in this build, so there are no positions —
   and none are simulated.
   ============================================================ */

import { emptyState } from '../components.js';

export function renderPortfolio(root, ctx) {
  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">Portfolio</div>
      <div class="page-sub">Positions, P/L and exposure.</div>
    </div>

    <div class="card">
      ${emptyState('💼', 'Trading is not connected',
        'This build is a read-only market viewer. No broker, wallet or paper-trading book is connected, so there are no positions to show — and none are simulated.')}
      <div style="display:flex;gap:8px;padding:0 0 12px">
        <button class="btn btn-gold" data-go="markets">Browse the market board</button>
      </div>
    </div>
  `;

  root.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => ctx.navigate(b.dataset.go)));
}
