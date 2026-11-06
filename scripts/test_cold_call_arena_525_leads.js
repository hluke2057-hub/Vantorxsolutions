// scripts/test_cold_call_arena_525_leads.js
const puppeteer = require('puppeteer-core');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve('website/cold-call-arena/index.html');
const brainDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

async function testArenaLeads() {
  console.log('🚀 Testing Cold Call Arena 525 Leads & Add +100 Fresh Leads in Edge...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1100 });

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
  });
  page.on('pageerror', err => console.log('PAGE CRASH:', err.message));

  // Reset localStorage manual lead additions for clean test
  await page.evaluateOnNewDocument(() => {
    localStorage.removeItem('vantorx_manual_lead_additions');
  });

  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200));

  // Authenticate as Founder Luke & close sign-in gate modal so buttons are accessible
  await page.evaluate(() => {
    localStorage.setItem('vantorx_active_user_id_v2', 'luke');
    if (typeof window.closeSignInGate === 'function') window.closeSignInGate();
    if (typeof window.switchTab === 'function') window.switchTab('tabLeads');
  });
  await new Promise(r => setTimeout(r, 600));

  // 1. Initial State Check
  const initialState = await page.evaluate(() => {
    const totalLeads = window.LEADS_DATA ? window.LEADS_DATA.length : 0;
    const activeLimit = window.getActiveQueueLimit ? window.getActiveQueueLimit() : 0;
    const rangeText = document.getElementById('leadPageRangeText')?.innerText || '';
    const headingText = document.getElementById('batchHeadingText')?.innerText || '';
    const quotaTotal = document.getElementById('quotaTotal')?.innerText || '';
    
    // Team size chips
    const chipAll = document.getElementById('empCountAll2to10')?.innerText || '';
    const chip2to4 = document.getElementById('empCountCrew2to4')?.innerText || '';
    const chip5to7 = document.getElementById('empCountCrew5to7')?.innerText || '';
    const chip8to10 = document.getElementById('empCountCrew8to10')?.innerText || '';

    // Batch options
    const batchOptions = Array.from(document.querySelectorAll('#batchSelect option')).map(o => ({
      value: o.value,
      text: o.text
    }));

    return {
      totalLeads,
      activeLimit,
      rangeText,
      headingText,
      quotaTotal,
      chipAll,
      chip2to4,
      chip5to7,
      chip8to10,
      batchCount: batchOptions.length,
      batchOptions
    };
  });

  console.log('📊 Initial Leads State:');
  console.log('   - Total LEADS_DATA in DB:', initialState.totalLeads);
  console.log('   - Active Queue Limit on load:', initialState.activeLimit);
  console.log('   - Pagination Range Text:', initialState.rangeText);
  console.log('   - Heading Text:', initialState.headingText);
  console.log('   - Quota Total:', initialState.quotaTotal);
  console.log('   - Team Size Chips:');
  console.log('     * All 2-10 Staff:', initialState.chipAll);
  console.log('     * 2-4 Staff:', initialState.chip2to4);
  console.log('     * 5-7 Staff:', initialState.chip5to7);
  console.log('     * 8-10 Staff:', initialState.chip8to10);
  console.log('   - Available Batch Dropdown Options:', initialState.batchCount);

  if (initialState.totalLeads !== 525) {
    throw new Error(`❌ FAILED: Expected 525 total leads, found ${initialState.totalLeads}`);
  }
  if (initialState.chipAll === '0' || initialState.chip2to4 === '0') {
    throw new Error('❌ FAILED: Team size chips still showing 0!');
  }

  // 2. Click "Add +100 Fresh Leads" Button!
  console.log('\n⚡ Clicking "Add +100 Fresh Leads" button...');
  await page.click('#btnAdd100Leads');
  await new Promise(r => setTimeout(r, 600));

  const afterClick1 = await page.evaluate(() => {
    const activeLimit = window.getActiveQueueLimit ? window.getActiveQueueLimit() : 0;
    const rangeText = document.getElementById('leadPageRangeText')?.innerText || '';
    const headingText = document.getElementById('batchHeadingText')?.innerText || '';
    const quotaTotal = document.getElementById('quotaTotal')?.innerText || '';
    const chipAll = document.getElementById('empCountAll2to10')?.innerText || '';
    const rowsRendered = document.querySelectorAll('#leadTableBody tr').length;
    return { activeLimit, rangeText, headingText, quotaTotal, chipAll, rowsRendered };
  });

  console.log('   - After 1st Click:');
  console.log('     * Active Queue Limit:', afterClick1.activeLimit);
  console.log('     * Pagination Range Text:', afterClick1.rangeText);
  console.log('     * Heading Text:', afterClick1.headingText);
  console.log('     * Quota Total:', afterClick1.quotaTotal);
  console.log('     * All 2-10 Staff Count:', afterClick1.chipAll);
  console.log('     * Rows Rendered on Page 1 (Page size 50):', afterClick1.rowsRendered);

  if (afterClick1.activeLimit !== 200 || !afterClick1.rangeText.includes('200')) {
    throw new Error('❌ FAILED: Active queue did not expand to 200 leads on first click!');
  }

  // 3. Click again to expand to 300 leads
  console.log('\n⚡ Clicking "Add +100 Fresh Leads" button 2nd time...');
  await page.click('#btnAdd100Leads');
  await new Promise(r => setTimeout(r, 600));

  const afterClick2 = await page.evaluate(() => {
    const activeLimit = window.getActiveQueueLimit ? window.getActiveQueueLimit() : 0;
    const rangeText = document.getElementById('leadPageRangeText')?.innerText || '';
    return { activeLimit, rangeText };
  });

  console.log('   - After 2nd Click:');
  console.log('     * Active Queue Limit:', afterClick2.activeLimit);
  console.log('     * Pagination Range Text:', afterClick2.rangeText);

  if (afterClick2.activeLimit !== 300 || !afterClick2.rangeText.includes('300')) {
    throw new Error('❌ FAILED: Active queue did not expand to 300 leads on second click!');
  }

  // 4. Test selecting "All 525 Real Verified Leads"
  console.log('\n📁 Testing dropdown switch to "All 525 Real Verified Leads"...');
  await page.select('#batchSelect', 'all');
  await new Promise(r => setTimeout(r, 600));

  const allState = await page.evaluate(() => {
    const rangeText = document.getElementById('leadPageRangeText')?.innerText || '';
    const chipAll = document.getElementById('empCountAll2to10')?.innerText || '';
    const rowsRendered = document.querySelectorAll('#leadTableBody tr').length;
    return { rangeText, chipAll, rowsRendered };
  });

  console.log('   - Directory Range Text:', allState.rangeText);
  console.log('   - All 2-10 Staff in Directory:', allState.chipAll);

  if (!allState.rangeText.includes('506') && !allState.rangeText.includes('525')) {
    throw new Error('❌ FAILED: "All" view did not show expected uncalled/total leads!');
  }

  // Take screenshot of the fixed Cold Call Arena table with 525 leads and working queue
  const ssPath = path.join(brainDir, 'arena_525_leads_fixed_verification.png');
  await page.screenshot({ path: ssPath, fullPage: false });
  console.log(`\n📸 Verification screenshot saved to: ${ssPath}`);

  await browser.close();
  console.log('\n✨ ALL TESTS PASSED! 525 legitimate leads active & Add +100 Fresh Leads button is 100% working!');
}

testArenaLeads().catch(err => {
  console.error('\n❌ TEST RUNNER FAILED:', err);
  process.exit(1);
});
