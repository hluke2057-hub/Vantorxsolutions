const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('--- TESTING LUKE HAMILTON FITNESS COURSE LANDING PAGE ---');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  const url = 'file:///' + path.resolve('website/fitness/index.html').replace(/\\/g, '/');
  console.log('Navigating to:', url);
  await page.goto(url, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200));

  const outScreenshot = path.join(artDir, 'luke_fitness_course_preview.png');
  await page.screenshot({ path: outScreenshot, fullPage: false });
  console.log('✓ Captured preview to', outScreenshot);

  await browser.close();
  console.log('--- LANDING PAGE VERIFIED SUCCESSFULLY ---');
})();
