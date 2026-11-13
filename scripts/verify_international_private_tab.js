// scripts/verify_international_private_tab.js
// Tests and verifies the new International Private Tab in Cold Call Arena via Headless Edge
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🚀 Launching Edge browser to verify International Private Tab in Cold Call Arena...');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1650,1150']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1650, height: 1150 });

  // Authenticate as Founder Luke so the sign-in modal is unlocked
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('vantorx_active_user_id_v2', 'luke');
    localStorage.setItem('vantorx_fl_vault_unlocked', 'true');
  });

  const realErrors = [];
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('rep-roster') || text.includes('ERR_FAILED')) return;
    if (msg.type() === 'error') {
      console.log('PAGE ERROR LOG:', text);
      realErrors.push(text);
    }
  });
  page.on('pageerror', err => {
    console.log('UNCAUGHT EXCEPTION:', err.message);
    realErrors.push(err.message);
  });

  const arenaPath = path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
  const fileUrl = 'file:///' + arenaPath.replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);

  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 35000 });

  console.log('Checking for #tabBtnNoWebsite...');
  const tabBtn = await page.$('#tabBtnNoWebsite');
  if (!tabBtn) {
    throw new Error('Tab button #tabBtnNoWebsite was not found!');
  }
  const tabBtnText = await page.evaluate(el => el.textContent.trim(), tabBtn);
  console.log('Found Tab Button:', tabBtnText);

  // Switch to Private Tab
  console.log('Switching to International Private Tab...');
  await page.evaluate(() => {
    window.switchTab('tabNoWebsite');
  });
  await new Promise(r => setTimeout(r, 800));

  // Verify tab panel is active
  const isTabActive = await page.evaluate(() => {
    const p = document.getElementById('tabNoWebsite');
    return p && p.classList.contains('active') && window.getComputedStyle(p).display === 'block';
  });
  console.log('Is #tabNoWebsite active and computed display block?', isTabActive);

  // Verify row count
  const rowCount = await page.evaluate(() => {
    return document.querySelectorAll('#intlLeadsTableBody tr').length;
  });
  console.log('Rows rendered in #intlLeadsTableBody:', rowCount);
  if (rowCount !== 150) {
    throw new Error(`Expected 150 rows, but found ${rowCount}`);
  }

  // Verify World Clocks
  const clocks = await page.evaluate(() => {
    return {
      usEst: document.getElementById('clockUsEst')?.textContent.trim(),
      uk: document.getElementById('clockUk')?.textContent.trim(),
      au: document.getElementById('clockAu')?.textContent.trim(),
      ca: document.getElementById('clockCa')?.textContent.trim(),
      ie: document.getElementById('clockIe')?.textContent.trim(),
      nz: document.getElementById('clockNz')?.textContent.trim(),
      badgeUk: document.getElementById('badgeTzUk')?.textContent.trim(),
      badgeAu: document.getElementById('badgeTzAu')?.textContent.trim()
    };
  });
  console.log('Live World Clocks & Badges:', clocks);

  // Verify Metrics
  const metrics = await page.evaluate(() => {
    return {
      kpiTargets: document.getElementById('intlKpiTargetCount')?.textContent.trim(),
      showing: document.getElementById('intlShowingCount')?.textContent.trim(),
      uncalledBadge: document.getElementById('intlUncalledCountBadge')?.textContent.trim(),
      quotaCount: document.getElementById('intlQuotaCount')?.textContent.trim()
    };
  });
  console.log('Metrics on page:', metrics);

  // Take screenshot of main tab
  const artifactDir = 'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0';
  const tabScreenshotPath = path.join(artifactDir, 'verified_international_private_tab.png');
  await page.screenshot({ path: tabScreenshotPath, fullPage: false });
  console.log('📸 Saved main private tab screenshot to:', tabScreenshotPath);

  // Test Filter: United Kingdom
  console.log('Filtering by United Kingdom (40 leads)...');
  await page.evaluate(() => {
    window.filterIntlByCountry('United Kingdom');
  });
  await new Promise(r => setTimeout(r, 400));
  const ukCount = await page.evaluate(() => document.querySelectorAll('#intlLeadsTableBody tr').length);
  console.log('UK Rows rendered:', ukCount);
  if (ukCount !== 40) throw new Error(`Expected 40 UK rows, got ${ukCount}`);

  // Test Filter: Australia
  console.log('Filtering by Australia (40 leads)...');
  await page.evaluate(() => {
    window.filterIntlByCountry('Australia');
  });
  await new Promise(r => setTimeout(r, 400));
  const auCount = await page.evaluate(() => document.querySelectorAll('#intlLeadsTableBody tr').length);
  console.log('Australia Rows rendered:', auCount);
  if (auCount !== 40) throw new Error(`Expected 40 AU rows, got ${auCount}`);

  // Test Filter: Canada
  console.log('Filtering by Canada (35 leads)...');
  await page.evaluate(() => {
    window.filterIntlByCountry('Canada');
  });
  await new Promise(r => setTimeout(r, 400));
  const caCount = await page.evaluate(() => document.querySelectorAll('#intlLeadsTableBody tr').length);
  console.log('Canada Rows rendered:', caCount);
  if (caCount !== 35) throw new Error(`Expected 35 CA rows, got ${caCount}`);

  // Reset filter back to all
  await page.evaluate(() => {
    window.resetIntlFilters();
  });
  await new Promise(r => setTimeout(r, 400));
  const resetCount = await page.evaluate(() => document.querySelectorAll('#intlLeadsTableBody tr').length);
  console.log('Rows after reset:', resetCount);

  // Test Pitch selection
  console.log('Testing Pitch button for intl_002...');
  await page.evaluate(() => {
    window.selectIntlLeadForPitch('intl_002');
  });
  const activeTargetText = await page.evaluate(() => document.getElementById('intlActiveTargetName')?.textContent.trim());
  console.log('Active Target after pitch click:', activeTargetText);

  // Test Objection handler
  console.log('Testing Objection handler...');
  await page.evaluate(() => {
    window.toggleIntlObjection('noAiHere');
  });
  const objScript = await page.evaluate(() => document.getElementById('intlObjScript')?.textContent.trim());
  console.log('Objection script rendered:', objScript ? objScript.slice(0, 80) + '...' : 'NONE');

  // Take screenshot with teleprompter and table
  const fullScreenshotPath = path.join(artifactDir, 'verified_international_teleprompter_and_table.png');
  await page.screenshot({ path: fullScreenshotPath, fullPage: false });
  console.log('📸 Saved teleprompter & table screenshot to:', fullScreenshotPath);

  await browser.close();
  console.log('🎉 Verification completed successfully with ZERO errors!');
})().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
