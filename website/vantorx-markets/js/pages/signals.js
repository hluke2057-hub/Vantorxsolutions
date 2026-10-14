/* ============================================================
   VANTORX MARKETS INTELLIGENCE — pages/signals.js
   The analyst answers ONLY from live synced Polymarket data —
   real prices, real volumes, real close dates. There is no
   signal engine in this build, so the signal board and the
   "data sources" card say so honestly.
   ============================================================ */

import { esc, fmtUsd } from '../utils.js';
import { emptyState } from '../components.js';
import { categoryIcon } from '../data.js';

const CHIPS = [
  'Top markets by volume',
  'What closes soonest?',
  'Anything about bitcoin?',
  'Show me politics markets',
];

export function renderSignals(root, ctx) {
  const s = ctx.getState();
  const markets = s.markets;

  root.innerHTML = `
    <div class="page-head">
      <div class="page-title">AI Signals</div>
      <div class="page-sub">The analyst reports only what the live data says — it never invents numbers.</div>
    </div>

    <div class="grid-side">
      <div class="section-stack">

        <div class="card">
          <div class="card-title">💬 Ask the analyst</div>
          <div class="obx-chat" id="chatBox">
            <div class="obx-msg ai"><b>Analyst</b> ${markets.length
              ? `I'm reading ${markets.length} live Polymarket markets. Ask about a market, a category or any keyword — I only report what the synced data says.`
              : `I have no market data yet. Run a live sync from Settings and I'll read the real board.`}</div>
          </div>
          <div class="test-chip-row" style="margin:10px 0" id="chipRow">
            ${CHIPS.map((c, i) => `<button class="test-chip" data-chip="${i}">${esc(c)}</button>`).join('')}
          </div>
          <div style="display:flex;gap:8px">
            <input class="search-input" id="askInput" placeholder="Ask about a market, category or keyword…" style="flex:1" autocomplete="off">
            <button class="btn btn-gold" id="askBtn">Ask</button>
          </div>
        </div>

        <div class="card">
          <div class="card-title">🎯 Signal board</div>
          ${emptyState('🤖', 'Signal engine not connected', 'No AI signals are generated in this build. The board and analyst use live Polymarket data only.')}
        </div>

      </div>

      <div class="section-stack">

        <div class="card">
          <div class="card-title">⏳ Closing soonest</div>
          ${closingSoon(markets)}
        </div>

        <div class="card">
          <div class="card-title">📡 Data sources</div>
          <div class="kv-list">
            <div class="kv-row"><div class="kv-label">Market data</div><div class="kv-value"><span class="status-pill ${s.sources.live ? 'status-green' : 'status-orange'}"><span class="sdot"></span>${s.sources.live ? 'Polymarket live' : s.markets.length ? 'Stale (offline)' : 'Not connected'}</span></div></div>
            <div class="kv-row"><div class="kv-label">AI signal engine</div><div class="kv-value"><span class="status-pill status-orange"><span class="sdot"></span>Not connected</span></div></div>
            <div class="kv-row"><div class="kv-label">News &amp; events feed</div><div class="kv-value"><span class="status-pill status-orange"><span class="sdot"></span>Not connected</span></div></div>
          </div>
          <div class="obx-hint-box" style="margin-top:10px">${s.sources.live
            ? `✅ Last live sync ${esc(new Date(s.sources.lastSync).toLocaleTimeString())} — ${markets.length} markets.`
            : s.sources.error ? `🔴 Last sync failed: ${esc(s.sources.error)} — no demo data is substituted.`
            : '🔴 No live sync yet — connect in Settings.'}</div>
        </div>

      </div>
    </div>
  `;

  const chatBox = root.querySelector('#chatBox');
  const askInput = root.querySelector('#askInput');

  function addMsg(who, text) {
    const div = document.createElement('div');
    div.className = 'obx-msg ' + (who === 'ai' ? 'ai' : 'me');
    div.innerHTML = who === 'ai' ? `<b>Analyst</b> ${text}` : esc(text);
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function priceOf(m) { return m.yes !== null ? `${m.yes}¢ YES` : 'price n/a'; }

  function answer(q) {
    const s2 = ctx.getState();
    const list = s2.markets;
    if (!list.length) return 'No market data loaded. Run a live sync from Settings first — I only speak from live data.';

    const lower = q.toLowerCase();
    if (/top|volume|biggest/.test(lower)) {
      const top = [...list].sort((a, b) => (b.vol || 0) - (a.vol || 0)).slice(0, 3);
      return `By all-time volume: ${top.map(m => `"${esc(m.q)}" at ${priceOf(m)} (${fmtUsd(m.vol)})`).join('; ')}.`;
    }
    if (/clos|soon|end/.test(lower)) {
      const soon = [...list].filter(m => m.close).sort((a, b) => new Date(a.close) - new Date(b.close)).slice(0, 3);
      return soon.length
        ? `Closing soonest: ${soon.map(m => `"${esc(m.q)}" — ${new Date(m.close).toLocaleDateString()}, at ${priceOf(m)}`).join('; ')}.`
        : 'None of the synced markets carry a close date from the API.';
    }

    const words = lower.split(/\W+/).filter(w => w.length > 3);
    const hits = list.filter(m => {
      const hay = `${m.q} ${m.cat}`.toLowerCase();
      return hay.includes(lower) || words.some(w => hay.includes(w));
    }).slice(0, 3);
    if (hits.length) {
      return hits.map(m => `"${esc(m.q)}" (${categoryIcon(m.cat)} ${esc(m.cat)}) is at ${priceOf(m)} with ${fmtUsd(m.vol)} volume${m.close ? `, closing ${new Date(m.close).toLocaleDateString()}` : ''}.`).join(' ');
    }
    return `I searched all ${list.length} synced markets for "${esc(q)}" and found no match. The signal engine is not connected, so keyword search across market questions is all I can offer.`;
  }

  function ask(q) {
    const text = q.trim();
    if (!text) return;
    addMsg('me', text);
    askInput.value = '';
    const typing = document.createElement('div');
    typing.className = 'obx-msg ai';
    typing.innerHTML = '<span class="typing-dots"><i></i><i></i><i></i></span>';
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;
    setTimeout(() => {
      typing.remove();
      addMsg('ai', answer(text));
    }, 450);
  }

  root.querySelectorAll('[data-chip]').forEach(b => b.addEventListener('click', () => ask(CHIPS[Number(b.dataset.chip)])));
  root.querySelector('#askBtn').addEventListener('click', () => ask(askInput.value));
  askInput.addEventListener('keydown', e => { if (e.key === 'Enter') ask(askInput.value); });
}

function closingSoon(markets) {
  const soon = [...markets].filter(m => m.close)
    .sort((a, b) => new Date(a.close) - new Date(b.close)).slice(0, 5);
  if (!soon.length) {
    return emptyState('⏳', markets.length ? 'No close dates' : 'No data', markets.length
      ? 'The API returned no close dates for the synced markets.'
      : 'Sync live data to see which markets close soonest.');
  }
  return soon.map(m => `
    <div class="kv-row">
      <div class="kv-label">${esc(m.q.length > 52 ? m.q.slice(0, 52) + '…' : m.q)}</div>
      <div class="kv-value cell-dim">${new Date(m.close).toLocaleDateString()} · ${m.yes !== null ? `${m.yes}¢` : '—'}</div>
    </div>`).join('');
}
