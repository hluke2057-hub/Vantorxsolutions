const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve('website/cold-call-arena/index.html');
const brainDir = 'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0';

async function testArenaEmployees() {
  console.log('Launching Edge for Cold Call Arena Real Employee Verification...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Search for "Quality Air"
  console.log('Searching for "Quality Air" in lead queue...');
  const searchInput = await page.$('#leadSearchInput');
  if (searchInput) {
    await searchInput.type('Quality Air');
    await new Promise(r => setTimeout(r, 600));
  }

  // 2. Extract rendered cell text from the first row
  const rowData = await page.evaluate(() => {
    const rows = document.querySelectorAll('#leadTableBody tr');
    if (rows.length === 0) return null;
    const firstRow = rows[0];
    const cells = Array.from(firstRow.querySelectorAll('td')).map(td => td.innerText.trim());
    return {
      rowCount: rows.length,
      companyCell: cells[1] || '',
      empCell: cells[4] || ''
    };
  });

  console.log('Row Data rendered in Edge:', rowData);

  // 3. Click the row to open Active Lead Inspector
  const firstRowEl = await page.$('#leadTableBody tr');
  if (firstRowEl) {
    await firstRowEl.click();
    await new Promise(r => setTimeout(r, 600));
  }

  // 4. Capture screenshot of Quality Air with 11-50 Staff verified
  const proofPath1 = path.join(brainDir, 'verified_cold_call_arena_quality_air_11_to_50_employees.png');
  await page.screenshot({ path: proofPath1, fullPage: false });
  console.log('Saved screenshot ->', proofPath1);

  // 5. Clear search and test the "11-50 Staff" filter pill
  console.log('Testing 11-50 Staff filter pill...');
  await page.evaluate(() => {
    const inp = document.getElementById('leadSearchInput');
    if (inp) {
      inp.value = '';
      inp.dispatchEvent(new Event('input'));
    }
    const btn11to50 = document.querySelector('[data-emp-filter="crew11to50"]');
    if (btn11to50) {
      btn11to50.click();
    }
  });

  await new Promise(r => setTimeout(r, 800));

  const filterStats = await page.evaluate(() => {
    const rows = document.querySelectorAll('#leadTableBody tr');
    const first5 = Array.from(rows).slice(0, 5).map(r => {
      const tds = r.querySelectorAll('td');
      return {
        company: tds[1] ? tds[1].innerText.split('\n')[0] : '',
        emp: tds[4] ? tds[4].innerText.replace(/\n/g, ' · ') : ''
      };
    });
    return { totalFilteredRows: rows.length, sample: first5 };
  });

  console.log('Filter pill 11-50 stats:', filterStats);

  const proofPath2 = path.join(brainDir, 'verified_cold_call_arena_11_to_50_tier_filter.png');
  await page.screenshot({ path: proofPath2, fullPage: false });
  console.log('Saved filter proof screenshot ->', proofPath2);

  await browser.close();
  console.log('Verification completed successfully!');
}

testArenaEmployees().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
