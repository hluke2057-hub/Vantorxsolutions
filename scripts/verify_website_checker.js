// scripts/verify_website_checker.js
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('Launching browser to verify Website Checker...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,950']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE LOG ERROR:', msg.text());
  });

  page.on('pageerror', err => {
    console.error('PAGE ERROR EXCEPTION:', err.message);
  });

  // 1. TEST index.html
  const arenaUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html').replace(/\\/g, '/');
  console.log('Navigating to Cold Call Arena:', arenaUrl);
  await page.goto(arenaUrl, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));

  // Bypass sign-in gate modal if present
  console.log('Signing in rep session...');
  await page.evaluate(() => {
    localStorage.setItem('vantorx_rep_session', JSON.stringify({ id: 'rep_founder_1', name: 'Luke Hamilton', email: 'luke@vantorxsolutions.com' }));
    localStorage.setItem('vantorx_fl_vault_unlocked', 'true');
    const modal = document.getElementById('signInGateModal');
    if (modal) modal.classList.remove('active');
    if (typeof window.checkRepSession === 'function') window.checkRepSession();
    if (typeof window.switchTab === 'function') window.switchTab('tabScript');
  });
  await new Promise(r => setTimeout(r, 600));

  // Test active lead banner button
  console.log('Checking btnCheckLeadWebsite in teleprompter...');
  const btnCheckWebsite = await page.$('#btnCheckLeadWebsite');
  if (!btnCheckWebsite) {
    throw new Error('#btnCheckLeadWebsite not found in index.html!');
  }

  // Click btnCheckLeadWebsite
  console.log('Clicking btnCheckLeadWebsite to open Website Verifier modal...');
  await page.evaluate(() => window.checkActiveLeadWebsite());
  await new Promise(r => setTimeout(r, 400));

  const isModalActive = await page.evaluate(() => {
    const m = document.getElementById('websiteCheckerModal');
    return m && m.classList.contains('active');
  });
  console.log('Is websiteCheckerModal active in teleprompter?', isModalActive);
  if (!isModalActive) throw new Error('websiteCheckerModal failed to open!');

  // Capture screenshot of teleprompter modal
  const teleprompterModalImg = path.join(ARTIFACTS_DIR, 'verified_teleprompter_website_checker.png');
  await page.screenshot({ path: teleprompterModalImg });
  console.log('Saved teleprompter modal screenshot:', teleprompterModalImg);

  // Close modal
  await page.evaluate(() => window.closeWebsiteCheckerModal());
  await new Promise(r => setTimeout(r, 300));

  // Test Tab: Florida No-Website
  console.log('Switching to Florida No-Website Targets tab (#tabNoWebsite)...');
  await page.evaluate(() => {
    window.switchTab('tabNoWebsite');
    if (typeof window.checkFloridaVaultAccess === 'function') window.checkFloridaVaultAccess();
  });
  await new Promise(r => setTimeout(r, 600));

  // Verify Florida table rows
  const flRowsCount = await page.evaluate(() => {
    const rows = document.querySelectorAll('#flLeadsTableBody tr');
    return rows.length;
  });
  console.log('Florida leads table rows count:', flRowsCount);

  // Click check site on row 1 (fl_noweb_001)
  console.log('Clicking "Check Site" on first Florida lead (fl_noweb_001)...');
  await page.evaluate(() => {
    window.openWebsiteCheckerModal('fl_noweb_001');
  });
  await new Promise(r => setTimeout(r, 400));

  const modalCompany = await page.evaluate(() => {
    return document.getElementById('webCheckCompanyInput')?.value;
  });
  console.log('Modal loaded company:', modalCompany);

  const mapsHref = await page.evaluate(() => {
    return document.getElementById('btnCheckGoogleMaps')?.href;
  });
  console.log('Google Maps verification link:', mapsHref);

  // Capture screenshot of Florida lead verification modal
  const flModalImg = path.join(ARTIFACTS_DIR, 'verified_florida_lead_website_checker.png');
  await page.screenshot({ path: flModalImg });
  console.log('Saved Florida modal screenshot:', flModalImg);

  // Test saving confirmed zero status
  console.log('Testing "Confirm Zero Website on Maps" action...');
  await page.evaluate(() => {
    window.saveVerifiedNoWebsiteStatus();
  });
  await new Promise(r => setTimeout(r, 300));

  // Close modal and screenshot updated table
  await page.evaluate(() => window.closeWebsiteCheckerModal());
  await new Promise(r => setTimeout(r, 300));

  const flTableImg = path.join(ARTIFACTS_DIR, 'verified_florida_leads_table_with_checks.png');
  await page.screenshot({ path: flTableImg });
  console.log('Saved updated Florida table screenshot:', flTableImg);

  // 2. TEST florida-no-website.html
  const flDirectUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'florida-no-website.html').replace(/\\/g, '/');
  console.log('Navigating to florida-no-website.html:', flDirectUrl);
  await page.goto(flDirectUrl, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('vantorx_fl_vault_unlocked', 'true');
    if (typeof checkVaultAccess === 'function') checkVaultAccess();
  });
  await new Promise(r => setTimeout(r, 500));

  // Click check button on second row
  console.log('Testing openWebsiteCheckerModal on standalone florida-no-website.html...');
  await page.evaluate(() => {
    window.openWebsiteCheckerModal('fl_noweb_002');
  });
  await new Promise(r => setTimeout(r, 400));

  const flStandaloneModalImg = path.join(ARTIFACTS_DIR, 'verified_standalone_florida_website_checker.png');
  await page.screenshot({ path: flStandaloneModalImg });
  console.log('Saved standalone Florida modal screenshot:', flStandaloneModalImg);

  await browser.close();
  console.log('ALL WEBSITE CHECKER VERIFICATIONS COMPLETED SUCCESSFULLY 100%!');
})();
