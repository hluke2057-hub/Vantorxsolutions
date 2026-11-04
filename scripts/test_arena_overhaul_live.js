const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve('website/cold-call-arena/index.html');
const brainDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

async function test() {
  console.log('Launching Edge for Arena UI Test...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  console.log('Navigating to:', htmlPath);
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  
  // Clear any old synthetic local storage calls so fresh SEED_CALL_RECORDS activate
  await page.evaluate(() => {
    localStorage.removeItem('vantorx_lead_calls_v1');
    localStorage.removeItem('vantorx_active_user_id_v2');
    location.reload();
  });
  await new Promise(r => setTimeout(r, 1200));

  // Log in as Buddy
  await page.evaluate(() => {
    if (typeof window.loginAsRep === 'function') {
      window.loginAsRep('buddy');
    }
    const gate = document.getElementById('signInGateModal');
    if (gate) { gate.classList.remove('active'); gate.style.display = 'none'; }
    const modal = document.getElementById('accountModal');
    if (modal) modal.classList.remove('active');
  });
  await new Promise(r => setTimeout(r, 800));

  // Check state
  const state = await page.evaluate(() => {
    const uncalledBadge = document.getElementById('uncalledCountBadge')?.textContent;
    const calledBadge = document.getElementById('calledCountBadge')?.textContent;
    const goldName = document.getElementById('stripGoldName')?.textContent;
    const silverName = document.getElementById('stripSilverName')?.textContent;
    const bronzeName = document.getElementById('stripBronzeName')?.textContent;
    const myDials = document.getElementById('closerBarCallsCount')?.textContent;
    const myPoints = document.getElementById('closerBarPointsCount')?.textContent;
    const myRank = document.getElementById('closerBarRankMedal')?.textContent;

    const rowsCount = document.querySelectorAll('#leadTableBody tr').length;
    const totalLeads = window.LEADS_DATA ? window.LEADS_DATA.length : 0;
    const firstRowComp = document.querySelector('#leadTableBody tr td strong')?.textContent;

    return {
      uncalledBadge,
      calledBadge,
      goldName,
      silverName,
      bronzeName,
      myDials,
      myPoints,
      myRank,
      rowsCount,
      totalLeads,
      firstRowComp
    };
  });

  console.log('Arena Live State:', state);

  // Take screenshot of main uncluttered queue
  const shot1 = await page.screenshot({ fullPage: false });
  fs.writeFileSync(path.join(brainDir, 'arena_overhaul_main_queue.png'), shot1);
  console.log('Saved screenshot: arena_overhaul_main_queue.png');

  // Now click Previously Called History toggle
  console.log('Testing switchLeadView("calledHistory")...');
  await page.evaluate(() => {
    window.switchLeadView('calledHistory');
    // Scroll lead table into view so table rows are visible in screenshot
    const el = document.getElementById('leadTableBody');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 800));

  const historyState = await page.evaluate(() => {
    const rows = document.querySelectorAll('#leadTableBody tr');
    const calledRowsCount = rows.length;
    const samples = Array.from(rows).slice(0, 6).map(r => r.innerText.replace(/\s+/g, ' ').substring(0, 100));
    return { calledRowsCount, samples };
  });

  console.log('History View State:', historyState);

  const shot2 = await page.screenshot({ fullPage: false });
  fs.writeFileSync(path.join(brainDir, 'arena_overhaul_called_history.png'), shot2);
  console.log('Saved screenshot: arena_overhaul_called_history.png');

  // Open profile modal to test rep call tracking
  console.log('Opening Account Profile Modal...');
  await page.evaluate(() => {
    window.openAccountModal();
  });
  await new Promise(r => setTimeout(r, 800));

  const shot3 = await page.screenshot({ fullPage: false });
  fs.writeFileSync(path.join(brainDir, 'arena_overhaul_profile_modal.png'), shot3);
  console.log('Saved screenshot: arena_overhaul_profile_modal.png');

  await browser.close();
}

test().catch(console.error);
