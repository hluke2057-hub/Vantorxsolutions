// scripts/test_employee_filters.js
const puppeteer = require('puppeteer-core');
const path = require('path');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve('website/cold-call-arena/index.html');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1100 });
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => {
    localStorage.setItem('vantorx_active_user_id_v2', 'luke');
    if (typeof window.closeSignInGate === 'function') window.closeSignInGate();
    if (typeof window.switchTab === 'function') window.switchTab('tabLeads');
  });
  await new Promise(r => setTimeout(r, 500));

  const results = {};

  // 1. Click 2-4 Staff
  await page.click('[data-emp-filter="crew2to4"]');
  await new Promise(r => setTimeout(r, 400));
  results.crew2to4 = await page.evaluate(() => {
    const range = document.getElementById('leadPageRangeText')?.innerText || '';
    const rows = Array.from(document.querySelectorAll('#leadTableBody tr')).slice(0, 5).map(tr => tr.children[4]?.innerText.replace(/\n/g, ' '));
    return { range, sampleEmpCells: rows };
  });

  // 2. Click 5-7 Staff
  await page.click('[data-emp-filter="crew5to7"]');
  await new Promise(r => setTimeout(r, 400));
  results.crew5to7 = await page.evaluate(() => {
    const range = document.getElementById('leadPageRangeText')?.innerText || '';
    const rows = Array.from(document.querySelectorAll('#leadTableBody tr')).slice(0, 5).map(tr => tr.children[4]?.innerText.replace(/\n/g, ' '));
    return { range, sampleEmpCells: rows };
  });

  // 3. Click 8-10 Staff
  await page.click('[data-emp-filter="crew8to10"]');
  await new Promise(r => setTimeout(r, 400));
  results.crew8to10 = await page.evaluate(() => {
    const range = document.getElementById('leadPageRangeText')?.innerText || '';
    const rows = Array.from(document.querySelectorAll('#leadTableBody tr')).slice(0, 5).map(tr => tr.children[4]?.innerText.replace(/\n/g, ' '));
    return { range, sampleEmpCells: rows };
  });

  console.log('Results of Employee Filtering:');
  console.log(JSON.stringify(results, null, 2));

  await browser.close();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
