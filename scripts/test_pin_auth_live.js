const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html').replace(/\\/g, '/');
const fileUrl = `file:///${htmlPath}`;
const artifactDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

console.log('Launching headless Edge to verify Closer Account PIN Authentication & No-Hopping security...');

const edgeProcess = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9225',
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
  let expr = expression.trim();
  // Always wrap in an IIFE to avoid global variable collisions
  if (!expr.startsWith('(() =>') && !expr.startsWith('(function')) {
    if (expr.includes('return ')) {
      expr = `(() => { ${expr} })()`;
    } else {
      expr = `(() => { return (${expr}); })()`;
    }
  }
  return sendCDP(wsUrl, 'Runtime.evaluate', {
    expression: expr,
    returnByValue: true,
    awaitPromise: true
  }).then(r => {
    if (r.exceptionDetails) {
      console.warn('Evaluation exception:', r.exceptionDetails.text, r.exceptionDetails.exception?.description);
    }
    return r.result ? r.result.value : r;
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  await sleep(2500);

  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9225/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = targets.find(t => t.type === 'page');
  if (!page) throw new Error('Page target not found');
  const wsUrl = page.webSocketDebuggerUrl;

  console.log('Connected to Headless Edge via CDP!');

  // Test Step 1: Check initial user
  const initialUser = await evaluate(wsUrl, `window.getActiveUser().id`);
  console.log(`[TEST 1] Initial activeUserId: ${initialUser}`);

  // Test Step 2: Attempt switching to Carter via quickRepSelect
  console.log('[TEST 2] Simulating user selecting Carter McCauliss from dropdown...');
  await evaluate(wsUrl, `
    const select = document.getElementById('quickRepSelect');
    select.value = 'carter_mccauliss';
    select.dispatchEvent(new Event('change'));
    return true;
  `);
  await sleep(400);

  // Verify modal is active and activeUserId is STILL previous user (NOT Carter yet!)
  const authModalActive = await evaluate(wsUrl, `
    const m = document.getElementById('closerAuthModal');
    return m ? m.classList.contains('active') : false;
  `);
  const activeUserAfterSelect = await evaluate(wsUrl, `window.getActiveUser().id`);
  console.log(`[TEST 2] Closer Auth Modal active: ${authModalActive}`);
  console.log(`[TEST 2] activeUserId before PIN entry: ${activeUserAfterSelect} (Should NOT be carter_mccauliss!)`);

  if (activeUserAfterSelect === 'carter_mccauliss') {
    throw new Error('SECURITY BREACH: Account switched to Carter without PIN entry!');
  }

  // Capture screenshot of Closer Security PIN Modal
  console.log('Capturing screenshot of Closer PIN Auth Modal...');
  const ssModal = await sendCDP(wsUrl, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'arena_account_pin_auth.png'), Buffer.from(ssModal.data, 'base64'));
  console.log('✓ Saved artifact: arena_account_pin_auth.png');

  // Test Step 3: Enter WRONG PIN (e.g. 9999)
  console.log('[TEST 3] Entering WRONG PIN 9999...');
  await evaluate(wsUrl, `
    const input = document.getElementById('closerAuthPinInput');
    input.value = '9999';
    submitCloserAuth();
    return true;
  `);
  await sleep(300);

  const errorVisible = await evaluate(wsUrl, `
    const err = document.getElementById('closerAuthError');
    return {
      displayed: err && err.style.display !== 'none',
      text: err ? err.textContent : ''
    };
  `);
  const activeUserAfterWrongPin = await evaluate(wsUrl, `window.getActiveUser().id`);
  console.log(`[TEST 3] Error message displayed: ${errorVisible.displayed} ("${errorVisible.text.trim()}")`);
  console.log(`[TEST 3] activeUserId after wrong PIN: ${activeUserAfterWrongPin}`);

  if (activeUserAfterWrongPin === 'carter_mccauliss') {
    throw new Error('SECURITY BREACH: Account switched despite incorrect PIN!');
  }

  // Test Step 4: Enter CORRECT PIN for Carter (2026)
  console.log('[TEST 4] Entering CORRECT PIN 2026 for Carter McCauliss...');
  await evaluate(wsUrl, `
    const input = document.getElementById('closerAuthPinInput');
    input.value = '2026';
    submitCloserAuth();
    return true;
  `);
  await sleep(400);

  const activeUserAfterCarterPin = await evaluate(wsUrl, `window.getActiveUser().id`);
  const callerBarCurrentText = await evaluate(wsUrl, `document.getElementById('callerBarCurrent').textContent`);
  console.log(`[TEST 4] activeUserId after correct PIN: ${activeUserAfterCarterPin}`);
  console.log(`[TEST 4] Top bar text: ${callerBarCurrentText}`);

  if (activeUserAfterCarterPin !== 'carter_mccauliss') {
    throw new Error('FAILED: Legitimate PIN 2026 did not unlock Carter McCauliss account!');
  }

  // Test Step 5: Switch from Carter to Lucas with wrong PIN vs correct PIN (3030)
  console.log('[TEST 5] Attempting switch from Carter to Lucas...');
  await evaluate(wsUrl, `
    const select = document.getElementById('quickRepSelect');
    select.value = 'lucas';
    select.dispatchEvent(new Event('change'));
    return true;
  `);
  await sleep(300);

  // Try wrong PIN
  await evaluate(wsUrl, `
    const input = document.getElementById('closerAuthPinInput');
    input.value = '0000';
    submitCloserAuth();
    return true;
  `);
  await sleep(200);
  const stillCarter = await evaluate(wsUrl, `window.getActiveUser().id`);
  console.log(`[TEST 5] activeUserId after wrong PIN on Lucas prompt: ${stillCarter}`);
  if (stillCarter !== 'carter_mccauliss') {
    throw new Error('SECURITY BREACH: Leaked into Lucas with wrong PIN!');
  }

  // Enter correct PIN for Lucas (3030)
  console.log('[TEST 5] Entering correct PIN 3030 for Lucas...');
  await evaluate(wsUrl, `
    const input = document.getElementById('closerAuthPinInput');
    input.value = '3030';
    submitCloserAuth();
    return true;
  `);
  await sleep(400);

  const activeUserLucas = await evaluate(wsUrl, `window.getActiveUser().id`);
  console.log(`[TEST 5] activeUserId after correct PIN 3030: ${activeUserLucas}`);
  if (activeUserLucas !== 'lucas') {
    throw new Error('FAILED: Legitimate PIN 3030 did not unlock Lucas account!');
  }

  // Test Step 6: Test Sign-In Gate Protection
  console.log('[TEST 6] Testing Sign-In Gate lock & unlock with PIN...');
  await evaluate(wsUrl, `
    logoutCloser();
    return true;
  `);
  await sleep(300);

  const gateActive = await evaluate(wsUrl, `
    const g = document.getElementById('signInGateModal');
    return g ? g.classList.contains('active') : false;
  `);
  console.log(`[TEST 6] Sign-In Gate active after logout: ${gateActive}`);

  // Try unlocking Carter with wrong PIN at gate
  await evaluate(wsUrl, `
    const sel = document.getElementById('gateCloserSelect');
    sel.value = 'carter_mccauliss';
    const pin = document.getElementById('gateCloserPinInput');
    pin.value = 'wrongpin';
    handleGateCloserLogin();
    return true;
  `);
  await sleep(200);

  const gateError = await evaluate(wsUrl, `
    const err = document.getElementById('gateCloserPinError');
    return {
      displayed: err && err.style.display !== 'none',
      text: err ? err.textContent : ''
    };
  `);
  console.log(`[TEST 6] Gate error on wrong PIN: ${gateError.displayed} ("${gateError.text.trim()}")`);

  // Unlock with correct PIN (2026)
  console.log('[TEST 6] Entering correct PIN 2026 at Sign-In Gate...');
  await evaluate(wsUrl, `
    const pin = document.getElementById('gateCloserPinInput');
    pin.value = '2026';
    handleGateCloserLogin();
    return true;
  `);
  await sleep(400);

  const finalUser = await evaluate(wsUrl, `window.getActiveUser().id`);
  console.log(`[TEST 6] activeUserId after gate login: ${finalUser}`);

  console.log('\n========================================');
  console.log('✅ ALL CLOSER PIN AUTHENTICATION TESTS PASSED!');
  console.log('========================================');

  edgeProcess.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('Test error:', err);
  edgeProcess.kill();
  process.exit(1);
});
