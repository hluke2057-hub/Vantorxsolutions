const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
let html = fs.readFileSync(p, 'utf8');
const target = 'id="flStatClosedCount">0</div>';
const cardToAdd = `
        <div class="fl-metric-card" onclick="filterFloridaByCallback()" style="cursor:pointer" title="Click to view all scheduled callbacks">
          <div class="fl-metric-num" style="color:#f59e0b" id="flStatCallbacksCount">0</div>
          <div class="fl-metric-label">⏳ Callbacks Scheduled</div>
        </div>`;

if (html.includes(target) && !html.includes('id="flStatCallbacksCount"')) {
  const idx = html.indexOf(target);
  const cardEnd = html.indexOf('</div>', idx + target.length);
  html = html.slice(0, cardEnd + 6) + cardToAdd + html.slice(cardEnd + 6);
  console.log('✓ Added Callbacks Scheduled card');
  fs.writeFileSync(p, html, 'utf8');
} else {
  console.log('Card already present or target not found');
}
