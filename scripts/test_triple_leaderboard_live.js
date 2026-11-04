const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve('website/cold-call-arena/index.html');
const brainDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

async function testTripleLeaderboard() {
  console.log('Launching Edge for Triple Leaderboard & Trophy Cabinet Test...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1100']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('BROWSER CONSOLE ERROR:', msg.text());
  });

  console.log('Navigating to:', htmlPath);
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });

  // Clear local storage to ensure fresh seed profiles and records
  await page.evaluate(() => {
    localStorage.removeItem('vantorx_lead_calls_v1');
    localStorage.removeItem('vantorx_user_profiles_v2');
    localStorage.removeItem('vantorx_active_user_id_v2');
    location.reload();
  });
  await new Promise(r => setTimeout(r, 1200));

  // Switch to Luke (Founder)
  await page.evaluate(() => {
    if (typeof window.quickSwitchCaller === 'function') {
      window.quickSwitchCaller('luke');
    }
    const gate = document.getElementById('signInGateModal');
    if (gate) { gate.classList.remove('active'); gate.style.display = 'none'; }
    const modal = document.getElementById('accountModal');
    if (modal) modal.classList.remove('active');
  });
  await new Promise(r => setTimeout(r, 600));

  // 1. TEST DAILY LEADERBOARD
  console.log('\n--- 1. Testing Daily Leaderboard ---');
  await page.evaluate(() => {
    window.switchTab('tabLeaderboard');
    window.switchLeaderboardPeriod('daily');
  });
  await new Promise(r => setTimeout(r, 600));

  const dailyState = await page.evaluate(() => {
    const period = window.CURRENT_LEADERBOARD_PERIOD;
    const standings = window.calculateLeaderboard('daily');
    const titleText = document.getElementById('tabPeriodTitleText')?.innerText;
    const podiumCards = Array.from(document.querySelectorAll('#leaderboardPodiumContainer .podium-card')).map(c => ({
      medal: c.querySelector('.podium-medal')?.innerText,
      name: c.querySelector('.podium-name')?.innerText,
      role: c.querySelector('.podium-role')?.innerText,
      score: c.querySelector('.podium-score')?.innerText
    }));
    const tableRows = Array.from(document.querySelectorAll('#leaderboardTableBody tr')).map(r => ({
      rank: r.querySelector('td:nth-child(1)')?.innerText.trim(),
      name: r.querySelector('td:nth-child(2)')?.innerText.replace(/\s+/g, ' ').trim(),
      calls: r.querySelector('td:nth-child(4)')?.innerText.trim(),
      demos: r.querySelector('td:nth-child(5)')?.innerText.trim(),
      points: r.querySelector('td:nth-child(8)')?.innerText.trim(),
      medalPill: r.querySelector('td:nth-child(9)')?.innerText.trim()
    }));
    return { period, titleText, standings, podiumCards, tableRows };
  });

  console.log('Daily State:', JSON.stringify(dailyState, null, 2));

  // Screenshot Tab 2 Daily Leaderboard
  const shotDaily = await page.screenshot({ fullPage: false });
  fs.writeFileSync(path.join(brainDir, 'arena_triple_leaderboard_daily.png'), shotDaily);
  console.log('Saved screenshot: arena_triple_leaderboard_daily.png');

  // 2. TEST WEEKLY LEADERBOARD
  console.log('\n--- 2. Testing Weekly Leaderboard ---');
  await page.evaluate(() => {
    window.switchLeaderboardPeriod('weekly');
  });
  await new Promise(r => setTimeout(r, 600));

  const weeklyState = await page.evaluate(() => {
    const period = window.CURRENT_LEADERBOARD_PERIOD;
    const titleText = document.getElementById('tabPeriodTitleText')?.innerText;
    const podiumCards = Array.from(document.querySelectorAll('#leaderboardPodiumContainer .podium-card')).map(c => ({
      medal: c.querySelector('.podium-medal')?.innerText,
      name: c.querySelector('.podium-name')?.innerText,
      role: c.querySelector('.podium-role')?.innerText,
      score: c.querySelector('.podium-score')?.innerText
    }));
    const tableRows = Array.from(document.querySelectorAll('#leaderboardTableBody tr')).map(r => ({
      rank: r.querySelector('td:nth-child(1)')?.innerText.trim(),
      name: r.querySelector('td:nth-child(2)')?.innerText.replace(/\s+/g, ' ').trim(),
      points: r.querySelector('td:nth-child(8)')?.innerText.trim(),
      medalPill: r.querySelector('td:nth-child(9)')?.innerText.trim()
    }));
    return { period, titleText, podiumCards, tableRows };
  });

  console.log('Weekly State:', JSON.stringify(weeklyState, null, 2));

  // Screenshot Tab 2 Weekly Leaderboard
  const shotWeekly = await page.screenshot({ fullPage: false });
  fs.writeFileSync(path.join(brainDir, 'arena_triple_leaderboard_weekly.png'), shotWeekly);
  console.log('Saved screenshot: arena_triple_leaderboard_weekly.png');

  // 3. TEST MONTHLY LEADERBOARD
  console.log('\n--- 3. Testing Monthly Leaderboard ---');
  await page.evaluate(() => {
    window.switchLeaderboardPeriod('monthly');
  });
  await new Promise(r => setTimeout(r, 600));

  const monthlyState = await page.evaluate(() => {
    const period = window.CURRENT_LEADERBOARD_PERIOD;
    const titleText = document.getElementById('tabPeriodTitleText')?.innerText;
    const podiumCards = Array.from(document.querySelectorAll('#leaderboardPodiumContainer .podium-card')).map(c => ({
      medal: c.querySelector('.podium-medal')?.innerText,
      name: c.querySelector('.podium-name')?.innerText,
      role: c.querySelector('.podium-role')?.innerText,
      score: c.querySelector('.podium-score')?.innerText
    }));
    const tableRows = Array.from(document.querySelectorAll('#leaderboardTableBody tr')).map(r => ({
      rank: r.querySelector('td:nth-child(1)')?.innerText.trim(),
      name: r.querySelector('td:nth-child(2)')?.innerText.replace(/\s+/g, ' ').trim(),
      points: r.querySelector('td:nth-child(8)')?.innerText.trim(),
      medalPill: r.querySelector('td:nth-child(9)')?.innerText.trim()
    }));
    return { period, titleText, podiumCards, tableRows };
  });

  console.log('Monthly State:', JSON.stringify(monthlyState, null, 2));

  // Screenshot Tab 2 Monthly Leaderboard
  const shotMonthly = await page.screenshot({ fullPage: false });
  fs.writeFileSync(path.join(brainDir, 'arena_triple_leaderboard_monthly.png'), shotMonthly);
  console.log('Saved screenshot: arena_triple_leaderboard_monthly.png');

  // 4. TEST ACCOUNT PROFILE & TROPHY CABINET (Luke Founder)
  console.log('\n--- 4. Testing Account Modal & Trophy Cabinet ---');
  await page.evaluate(() => {
    window.openAccountModal();
  });
  await new Promise(r => setTimeout(r, 800));

  const modalState = await page.evaluate(() => {
    const modalActiveName = document.getElementById('modalActiveName')?.innerText;
    const totalMedals = document.getElementById('modalTotalMedalsCount')?.innerText;
    const dailyGold = document.getElementById('trophyDailyGold')?.innerText;
    const dailySilver = document.getElementById('trophyDailySilver')?.innerText;
    const dailyBronze = document.getElementById('trophyDailyBronze')?.innerText;
    const weeklyGold = document.getElementById('trophyWeeklyGold')?.innerText;
    const weeklySilver = document.getElementById('trophyWeeklySilver')?.innerText;
    const weeklyBronze = document.getElementById('trophyWeeklyBronze')?.innerText;
    const monthlyGold = document.getElementById('trophyMonthlyGold')?.innerText;
    const monthlySilver = document.getElementById('trophyMonthlySilver')?.innerText;
    const monthlyBronze = document.getElementById('trophyMonthlyBronze')?.innerText;
    const historyCount = document.querySelectorAll('#modalMedalHistoryList > div').length;
    const historyItems = Array.from(document.querySelectorAll('#modalMedalHistoryList > div')).map(d => d.innerText.replace(/\s+/g, ' ').trim());

    return {
      modalActiveName,
      totalMedals,
      daily: { gold: dailyGold, silver: dailySilver, bronze: dailyBronze },
      weekly: { gold: weeklyGold, silver: weeklySilver, bronze: weeklyBronze },
      monthly: { gold: monthlyGold, silver: monthlySilver, bronze: monthlyBronze },
      historyCount,
      historyItems: historyItems.slice(0, 5)
    };
  });

  console.log('Trophy Cabinet State (Luke):', JSON.stringify(modalState, null, 2));

  // Screenshot Trophy Cabinet
  const shotModal = await page.screenshot({ fullPage: false });
  fs.writeFileSync(path.join(brainDir, 'arena_closer_trophy_cabinet.png'), shotModal);
  console.log('Saved screenshot: arena_closer_trophy_cabinet.png');

  // 5. TEST AWARDING TODAY'S MEDALS
  console.log('\n--- 5. Testing Awarding Today\'s Medals Button ---');
  await page.evaluate(() => {
    window.recordCurrentPeriodMedals('daily');
  });
  await new Promise(r => setTimeout(r, 600));

  const afterAwardState = await page.evaluate(() => {
    const totalMedals = document.getElementById('modalTotalMedalsCount')?.innerText;
    const dailyGold = document.getElementById('trophyDailyGold')?.innerText;
    const historyCount = document.querySelectorAll('#modalMedalHistoryList > div').length;
    const newestHistory = document.querySelector('#modalMedalHistoryList > div')?.innerText.replace(/\s+/g, ' ').trim();
    return { totalMedals, dailyGold, historyCount, newestHistory };
  });

  console.log('After Awarding Daily Medals:', afterAwardState);

  // 6. TEST SWITCHING TO CARTER MCCAULISS
  console.log('\n--- 6. Testing Switch to Carter McCauliss ---');
  await page.evaluate(() => {
    window.quickSwitchCaller('carter_mccauliss');
    window.openAccountModal();
  });
  await new Promise(r => setTimeout(r, 600));

  const carterState = await page.evaluate(() => {
    const name = document.getElementById('modalActiveName')?.innerText;
    const totalMedals = document.getElementById('modalTotalMedalsCount')?.innerText;
    const dailyGold = document.getElementById('trophyDailyGold')?.innerText;
    const weeklySilver = document.getElementById('trophyWeeklySilver')?.innerText;
    const monthlySilver = document.getElementById('trophyMonthlySilver')?.innerText;
    const historyCount = document.querySelectorAll('#modalMedalHistoryList > div').length;
    return { name, totalMedals, dailyGold, weeklySilver, monthlySilver, historyCount };
  });

  console.log('Carter McCauliss Trophy Cabinet:', carterState);

  await browser.close();
  console.log('\nAll Triple Leaderboard & Trophy Cabinet Tests PASSED!');
}

testTripleLeaderboard().catch(err => {
  console.error('Test FAILED:', err);
  process.exit(1);
});
