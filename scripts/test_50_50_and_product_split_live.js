const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html').replace(/\\/g, '/');
const fileUrl = `file:///${htmlPath}`;
const artifactDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

console.log('Launching headless Edge to capture focused 50/50 split view & lead queue screenshots...');

const edgeProcess = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--window-size=1680,1050',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  fileUrl
]);

function sendCDP(wsUrl, method, params = {}) {
  return new Promise((resolve, reject) => {
    const WebSocket = require('ws');
    const ws = new WebSocket(wsUrl);
    const id = Math.floor(Math.random() * 100000);
    ws.on('open', () => {
      ws.send(JSON.stringify({ id, method, params }));
    });
    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === id) {
        ws.close();
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    });
    ws.on('error', reject);
  });
}

function evaluate(wsUrl, expression) {
  return sendCDP(wsUrl, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  }).then(r => r.result ? r.result.value : r);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  await sleep(2500);

  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const pageTarget = targets.find(t => t.type === 'page');
  if (!pageTarget) throw new Error('No page target found');
  const wsUrl = pageTarget.webSocketDebuggerUrl;

  // 1. Load lead 0 (Palm Air -> Accelerate Bundle) into prompter and scroll to the 50/50 split grid
  await evaluate(wsUrl, `
    (() => {
      window.loadLeadIntoTeleprompter('pb_001');
      const activePanel = document.querySelector('.product-script-panel.active');
      const grid = activePanel ? activePanel.querySelector('.script-split-grid') : null;
      if (grid) {
        const rect = grid.getBoundingClientRect();
        window.scrollBy({ top: rect.top - 80, behavior: 'instant' });
      }
    })()
  `);
  await sleep(600);

  const prompterSplitScreenshot = await sendCDP(wsUrl, 'Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false
  });
  const prompterSplitPath = path.join(artifactDir, 'arena_prompter_50_50_split.png');
  fs.writeFileSync(prompterSplitPath, Buffer.from(prompterSplitScreenshot.data, 'base64'));
  console.log('✓ Captured focused 50/50 split view screenshot');

  // 2. Load lead 4 (Southern Coast -> Custom Website) and capture website 50/50 split
  await evaluate(wsUrl, `
    (() => {
      window.loadLeadIntoTeleprompter('pb_005');
      const activePanel = document.querySelector('.product-script-panel.active');
      const grid = activePanel ? activePanel.querySelector('.script-split-grid') : null;
      if (grid) {
        const rect = grid.getBoundingClientRect();
        window.scrollBy({ top: rect.top - 80, behavior: 'instant' });
      }
    })()
  `);
  await sleep(600);

  const websiteSplitScreenshot = await sendCDP(wsUrl, 'Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false
  });
  const websiteSplitPath = path.join(artifactDir, 'arena_prompter_website_50_50.png');
  fs.writeFileSync(websiteSplitPath, Buffer.from(websiteSplitScreenshot.data, 'base64'));
  console.log('✓ Captured website 50/50 split view screenshot');

  // 3. Switch to Tab 1 (Leads) and scroll to table showing alternating products
  await evaluate(wsUrl, `
    (() => {
      window.switchTab('tabLeads');
      const table = document.getElementById('leadTableBody');
      if (table) {
        const rect = table.getBoundingClientRect();
        window.scrollBy({ top: rect.top - 120, behavior: 'instant' });
      }
    })()
  `);
  await sleep(600);

  const queueScreenshot = await sendCDP(wsUrl, 'Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false
  });
  const queuePath = path.join(artifactDir, 'arena_queue_product_split.png');
  fs.writeFileSync(queuePath, Buffer.from(queueScreenshot.data, 'base64'));
  console.log('✓ Captured lead queue showing alternating products');

  edgeProcess.kill();
  console.log('Done capturing screenshots!');
}

run().catch(err => {
  console.error(err);
  edgeProcess.kill();
  process.exit(1);
});
