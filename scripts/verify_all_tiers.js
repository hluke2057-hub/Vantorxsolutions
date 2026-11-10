const puppeteer = require('puppeteer-core');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ executablePath: edgePath, headless: 'new' });
  const page = await browser.newPage();
  await page.goto('file:///C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/website/cold-call-arena/index.html', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200));

  const tiers = ['crew1to4', 'crew5to10', 'crew11to50', 'crew50Plus'];
  for (const t of tiers) {
    const res = await page.evaluate((tier) => {
      const btn = document.querySelector(`[data-emp-filter="${tier}"]`);
      if (btn) btn.click();
      const rows = document.querySelectorAll('#leadTableBody tr');
      const first = rows[0] ? rows[0].querySelectorAll('td')[1].innerText.split('\n')[0] : 'none';
      const emp = rows[0] ? rows[0].querySelectorAll('td')[4].innerText.replace(/\n/g, ' · ') : 'none';
      return { tier, count: rows.length, firstCompany: first, firstEmp: emp };
    }, t);
    console.log(res);
  }
  await browser.close();
})();
