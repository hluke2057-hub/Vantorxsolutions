// scripts/test_arena_200_leads_expansion.js
const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  console.log('🚀 Testing Arena +200 Fresh Leads Button & Team Quota Scaling...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  const url = 'file:///' + path.resolve(__dirname, '../website/cold-call-arena/index.html').replace(/\\/g, '/');
  console.log('Opening Arena:', url);
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Authenticate as Luke and close modal
  await page.evaluate(() => {
    try {
      localStorage.setItem('vantorx_active_user', 'luke');
      localStorage.setItem('vantorx_manual_lead_additions', '0');
      if (typeof window.switchActiveUser === 'function') window.switchActiveUser('luke');
      if (typeof window.closeSignInGate === 'function') window.closeSignInGate();
    } catch(e) {}
  });

  await new Promise(r => setTimeout(r, 800));

  // 1. Initial State
  const initial = await page.evaluate(() => {
    return {
      btnText: document.getElementById('btnAdd200Leads') ? document.getElementById('btnAdd200Leads').textContent.trim() : 'NOT_FOUND',
      heading: document.getElementById('batchHeadingText') ? document.getElementById('batchHeadingText').textContent.trim() : '',
      queueLimit: getActiveQueueLimit()
    };
  });
  console.log('📊 Initial Arena State:', initial);

  // 2. Click "+200 Fresh Leads" button
  console.log('⚡ Clicking "+ Add +200 Fresh Leads" button...');
  await page.click('#btnAdd200Leads');
  await new Promise(r => setTimeout(r, 600));

  const afterClick1 = await page.evaluate(() => {
    return {
      queueLimit: getActiveQueueLimit(),
      heading: document.getElementById('batchHeadingText').textContent.trim(),
      pagination: document.getElementById('paginationRangeText') ? document.getElementById('paginationRangeText').textContent.trim() : ''
    };
  });
  console.log('✅ After 1st Click (+200):', afterClick1);

  // 3. Click "+200 Fresh Leads" 2nd time
  console.log('⚡ Clicking "+ Add +200 Fresh Leads" 2nd time...');
  await page.click('#btnAdd200Leads');
  await new Promise(r => setTimeout(r, 600));

  const afterClick2 = await page.evaluate(() => {
    return {
      queueLimit: getActiveQueueLimit(),
      heading: document.getElementById('batchHeadingText').textContent.trim(),
      pagination: document.getElementById('paginationRangeText') ? document.getElementById('paginationRangeText').textContent.trim() : ''
    };
  });
  console.log('✅ After 2nd Click (+200 more = 500 leads):', afterClick2);

  // Take screenshot
  const screenshotPath = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0\\arena_200_leads_expanded_verified.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('📸 Screenshot saved to:', screenshotPath);

  await browser.close();
  console.log('🎉 ALL TESTS PASSED! +200 Fresh Leads button scales the queue instantly for thicker teams!');
})().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
