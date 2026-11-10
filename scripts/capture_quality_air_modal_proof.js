const puppeteer = require('puppeteer-core');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ executablePath: edgePath, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });
  await page.goto('file:///C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/website/cold-call-arena/index.html', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200));

  // Search Quality Air
  const searchInput = await page.$('#leadSearchInput');
  await searchInput.type('Quality Air');
  await new Promise(r => setTimeout(r, 600));

  // Click the row to select Quality Air
  const row = await page.$('#leadTableBody tr');
  if (row) await row.click();
  await new Promise(r => setTimeout(r, 800));

  // Extract inspector details
  const details = await page.evaluate(() => {
    return {
      name: document.getElementById('activeLeadName') ? document.getElementById('activeLeadName').innerText : '',
      company: document.getElementById('activeLeadCompany') ? document.getElementById('activeLeadCompany').innerText : '',
      empVal: document.getElementById('activeLeadEmpVal') ? document.getElementById('activeLeadEmpVal').innerText : '',
      empPitch: document.getElementById('activeLeadEmpPitchAngle') ? document.getElementById('activeLeadEmpPitchAngle').innerText : '',
      smallBizText: document.getElementById('activeLeadSmallBizText') ? document.getElementById('activeLeadSmallBizText').innerText : ''
    };
  });
  console.log('Active Lead Details in Modal/Cockpit:', details);

  const proofModal = 'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0/verified_quality_air_modal_inspector.png';
  await page.screenshot({ path: proofModal, fullPage: false });
  console.log('Saved modal inspector proof ->', proofModal);

  await browser.close();
})();
