const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve('website/cold-call-arena/index.html');

async function testFixes() {
  console.log('🚀 Starting Edge Puppeteer automated verification...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();

  // 1. Pre-seed localStorage with dirty legacy state (like user had in browser: duplicate Luke + Sign In Required)
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    const dirtyProfiles = {
      luke: { id: 'luke', name: 'Luke (Founder)', role: 'Founder & Closer', avatar: '👑', isFounder: true },
      founder_luke: { id: 'founder_luke', name: 'Luke Hamilton', role: 'Founder & Closer', avatar: '👑' },
      rep_luke_hamilton: { id: 'rep_luke_hamilton', name: 'Luke Hamilton', role: 'Outbound Closer', avatar: '👑' },
      guest: { id: 'guest', name: 'Sign In Required', role: 'Outbound Closer', avatar: '⚔️' },
      carter_mccauliss: { id: 'carter_mccauliss', name: 'Carter McCauliss', role: 'Certified Closer', avatar: '⚔️' },
      lucas: { id: 'lucas', name: 'Lucas', role: 'Certified Closer', avatar: '🎯' }
    };
    localStorage.setItem('vantorx_user_profiles_v2', JSON.stringify(dirtyProfiles));
    localStorage.setItem('vantorx_active_user_id_v2', 'luke');
  });

  // Reload to test migration and auto-purging
  await page.reload({ waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200));

  // TEST 1: Leads Queue Count
  const leadsCount = await page.evaluate(() => {
    const rows = document.querySelectorAll('#leadTableBody tr');
    const rangeText = document.getElementById('leadPageRangeText')?.innerText || '';
    const batchSelectVal = document.getElementById('batchSelect')?.value || '';
    return { rowCount: rows.length, rangeText, batchSelectVal };
  });

  console.log('📊 Test 1 (Leads Queue Display):');
  console.log('   - Batch Select value:', leadsCount.batchSelectVal);
  console.log('   - Rendered table rows:', leadsCount.rowCount);
  console.log('   - Range text:', leadsCount.rangeText);

  if (leadsCount.rowCount === 0) {
    throw new Error('❌ FAILED: Leads queue rendered 0 rows!');
  } else {
    console.log(`✅ PASSED: Leads queue successfully rendered ${leadsCount.rowCount} targets on initial load!`);
  }

  // TEST 2: Leaderboard Accounts Cleanliness
  const leaderboardState = await page.evaluate(() => {
    const standings = window.calculateLeaderboard('daily');
    const renderedNames = Array.from(document.querySelectorAll('.leaderboard-table tr td:nth-child(2)')).map(td => td.innerText.trim());
    const podiumGold = document.getElementById('stripGoldName')?.innerText || '';
    const podiumSilver = document.getElementById('stripSilverName')?.innerText || '';
    const podiumBronze = document.getElementById('stripBronzeName')?.innerText || '';
    return {
      standings: standings.map(s => ({ id: s.id, name: s.name, points: s.points })),
      renderedNames,
      podium: { gold: podiumGold, silver: podiumSilver, bronze: podiumBronze }
    };
  });

  console.log('\n🏆 Test 2 (Leaderboard Standings & Podium):');
  console.log('   - Standings count:', leaderboardState.standings.length);
  leaderboardState.standings.forEach((s, idx) => {
    console.log(`     #${idx+1}: [${s.id}] "${s.name}" (${s.points} pts)`);
  });

  const hasSignInRequired = leaderboardState.standings.some(s => s.name.toLowerCase().includes('sign in required') || s.id === 'guest');
  const lukeEntries = leaderboardState.standings.filter(s => s.name.toLowerCase().includes('luke'));

  if (hasSignInRequired) {
    throw new Error('❌ FAILED: "Sign In Required" is present on the leaderboard!');
  } else {
    console.log('✅ PASSED: "Sign In Required" has been completely removed from leaderboard!');
  }

  if (lukeEntries.length > 1) {
    throw new Error(`❌ FAILED: Duplicate Luke found! Found ${lukeEntries.length} entries for Luke.`);
  } else if (lukeEntries.length === 1) {
    console.log(`✅ PASSED: Exactly 1 single Luke on leaderboard: "${lukeEntries[0].name}" [${lukeEntries[0].id}]!`);
  } else {
    throw new Error('❌ FAILED: Luke is missing from leaderboard!');
  }

  // TEST 3: Instagram ZIP Package Download Button
  const instagramDownloadLink = await page.evaluate(() => {
    const btn = document.getElementById('btnDownloadInstagramPack');
    return {
      exists: !!btn,
      href: btn?.getAttribute('href'),
      text: btn?.innerText.trim()
    };
  });

  console.log('\n📦 Test 3 (Instagram Download Link):');
  console.log('   - Button exists:', instagramDownloadLink.exists);
  console.log('   - Button href:', instagramDownloadLink.href);
  console.log('   - Button text:', instagramDownloadLink.text);

  if (!instagramDownloadLink.exists || !instagramDownloadLink.href.includes('vantorx_instagram_complete_package.zip')) {
    throw new Error('❌ FAILED: Instagram ZIP download button missing or invalid href!');
  } else {
    console.log('✅ PASSED: Instagram ZIP download button is active and linked to package!');
  }

  // Take confirmation screenshot
  const screenshotPath = path.resolve('website/downloads/test_verification_screenshot.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`\n📸 Verification screenshot saved to: ${screenshotPath}`);

  await browser.close();
  console.log('\n✨ ALL 3 VERIFICATIONS PASSED WITH 100% SUCCESS!');
}

testFixes().catch(err => {
  console.error('\n❌ TEST RUNNER FAILED:', err);
  process.exit(1);
});
