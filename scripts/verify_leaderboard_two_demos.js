// scripts/verify_leaderboard_two_demos.js
const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('Testing Cold Call Arena Leaderboard for 2 Demos Total Logged...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const htmlUrl = 'file:///' + path.resolve('website/cold-call-arena/index.html').replace(/\\/g, '/');
  await page.goto(htmlUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Get standings across all 3 periods
  const results = await page.evaluate(() => {
    // Clear localStorage to simulate fresh clean boot, then reload data
    const daily = window.calculateLeaderboard('daily');
    const weekly = window.calculateLeaderboard('weekly');
    const monthly = window.calculateLeaderboard('monthly');
    const lukeDaily = daily.find(c => (c.name || '').includes('Luke'));
    const lukeWeekly = weekly.find(c => (c.name || '').includes('Luke'));
    const lukeMonthly = monthly.find(c => (c.name || '').includes('Luke'));

    // Switch to Leaderboard tab
    window.switchTab('tabLeaderboard');

    return {
      daily: lukeDaily,
      weekly: lukeWeekly,
      monthly: lukeMonthly,
      totalDemosInRecords: Object.values(window.CALL_RECORDS || {}).filter(r => r && r.called && (r.outcome === 'Success' || r.outcome === 'Booked Demo') && (r.caller || '').toLowerCase().includes('luke')).length
    };
  });

  console.log('\n==============================================================================');
  console.log('   LEADERBOARD VERIFICATION RESULTS FOR LUKE:                                 ');
  console.log('==============================================================================');
  console.log('Daily Demos Logged:  ', results.daily?.demos, `(Rank #${results.daily?.rank}, ${results.daily?.points} pts)`);
  console.log('Weekly Demos Logged: ', results.weekly?.demos, `(Rank #${results.weekly?.rank}, ${results.weekly?.points} pts)`);
  console.log('Monthly Demos Logged:', results.monthly?.demos, `(Rank #${results.monthly?.rank}, ${results.monthly?.points} pts)`);
  console.log('Total Luke Demos in CALL_RECORDS:', results.totalDemosInRecords);
  console.log('==============================================================================\n');

  await new Promise(r => setTimeout(r, 800));

  // Screenshot Tab 2: Dedicated Leaderboard 3D Podium & Standings Table
  const podiumScreenshot = path.join(ARTIFACT_DIR, 'verified_leaderboard_two_demos_podium.png');
  await page.screenshot({ path: podiumScreenshot });
  console.log('✓ Leaderboard Tab screenshot saved to:', podiumScreenshot);

  // Switch to Tab 1 (Leads) to screenshot top strip
  await page.evaluate(() => {
    window.switchTab('tabLeads');
  });
  await new Promise(r => setTimeout(r, 600));

  const stripScreenshot = path.join(ARTIFACT_DIR, 'verified_leaderboard_two_demos_strip.png');
  await page.screenshot({ path: stripScreenshot });
  console.log('✓ Leads Tab Strip screenshot saved to:', stripScreenshot);

  await browser.close();
  console.log('Finished Leaderboard verification successfully!');
})();
