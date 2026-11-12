// scripts/verify_all_deliverables_browser.js
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 920 });

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  // 1. Verify Cold Call Arena Main Table + Teleprompter
  const arenaUrl = 'file:///' + path.resolve('website/cold-call-arena/index.html').replace(/\\/g, '/');
  await page.goto(arenaUrl, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem('vantorx_fl_vault_unlocked', 'true');
    // Click the Founder Direct Sign In button cleanly
    const founderBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Founder Direct Sign In'));
    if (founderBtn) founderBtn.click();
    if (typeof window.activateFounderOverride === 'function') window.activateFounderOverride();
    const modal = document.getElementById('repSigninGateModal');
    if (modal) modal.style.display = 'none';
    if (typeof window.loadLeadIntoTeleprompter === 'function' && window.LEADS_DATA?.length) {
      window.loadLeadIntoTeleprompter(window.LEADS_DATA[0].id);
    }
    if (typeof window.renderLeadsTable === 'function') window.renderLeadsTable();
    if (typeof window.renderFloridaLeadsTable === 'function') window.renderFloridaLeadsTable();
  });
  await new Promise(r => setTimeout(r, 500));

  const arenaCheck = await page.evaluate(() => {
    const leadsLen = window.LEADS_DATA ? window.LEADS_DATA.length : 0;
    const flLen = window.FLORIDA_100_NO_WEBSITE_LEADS ? window.FLORIDA_100_NO_WEBSITE_LEADS.length : 0;
    const rowCount = document.querySelectorAll('#leadTableBody tr').length;
    const firstCompany = document.querySelector('#leadTableBody .lead-company-name')?.innerText || '';
    const sunbizLink = document.querySelector('#leadTableBody a[href*="sunbiz.org"]')?.href || '';
    const activeSunbizHref = document.getElementById('btnActiveLeadSunbiz')?.href || '';
    const activeOwner = document.getElementById('activeLeadOwner')?.innerText || '';
    return { leadsLen, flLen, rowCount, firstCompany, sunbizLink, activeSunbizHref, activeOwner };
  });
  console.log('Arena Check:', arenaCheck);
  // Click Lead Queue tab so screenshot captures the Lead Table with Sunbiz links & real License Holders
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button, .tab-btn')).find(el => el.innerText.includes('Lead Queue'));
    if (btn) btn.click();
    // Dismiss PIN/SignIn modals for visual inspection screenshot
    document.querySelectorAll('.modal-overlay, [id*="pinModal"], [id*="PinModal"], [id*="Sign"]').forEach(el => el.style.display = 'none');
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_arena_sunbiz_leads.png'), fullPage: false });

  // 2. Verify Florida No-Website Vault Tab inside Arena
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button, .tab-btn')).find(el => el.innerText.includes('Florida No-Website') || el.getAttribute('onclick')?.includes('tabFlorida'));
    if (btn) btn.click();
    if (typeof window.renderFloridaLeadsTable === 'function') window.renderFloridaLeadsTable();
    document.querySelectorAll('.modal-overlay, [id*="pinModal"], [id*="PinModal"], [id*="Sign"]').forEach(el => el.style.display = 'none');
  });
  await new Promise(r => setTimeout(r, 400));
  const flTabCheck = await page.evaluate(() => {
    const rows = document.querySelectorAll('#flLeadsTableBody tr').length;
    const flSunbiz = document.querySelector('#flLeadsTableBody a[href*="sunbiz.org"]')?.href || '';
    return { rows, flSunbiz };
  });
  console.log('Florida Tab Check:', flTabCheck);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_florida_vault_sunbiz.png'), fullPage: false });

  // 3. Verify Instagram Highlights & 8 Clean Covers page
  const igUrl = 'file:///' + path.resolve('website/instagram-package/index.html').replace(/\\/g, '/');
  await page.goto(igUrl, { waitUntil: 'networkidle2' });
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => img.removeAttribute('loading'));
    await new Promise(r => setTimeout(r, 600));
  });
  const igCheck = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const broken = imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
    return { totalImages: imgs.length, broken };
  });
  console.log('IG Package Check:', igCheck);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_instagram_clean_covers_gallery.png'), fullPage: false });

  // 4. Verify Reel Creator page
  const reelUrl = 'file:///' + path.resolve('website/demo/reel-creator.html').replace(/\\/g, '/');
  await page.goto(reelUrl, { waitUntil: 'networkidle2' });
  const reelCheck = await page.evaluate(() => {
    const r2 = document.querySelector('a[href*="vantorx-30s-reel-2.mp4"]')?.getAttribute('href') || '';
    return { reel2Href: r2 };
  });
  console.log('Reel Creator Check:', reelCheck);

  console.log('Total pageerrors across all pages:', errors.length, errors);
  await browser.close();
  if (errors.length > 0 || igCheck.broken.length > 0) process.exit(1);
})();
