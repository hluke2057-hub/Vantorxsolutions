const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';

async function inspectSlides() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  const url = 'file:///' + path.join(root, 'website/demo/pro-tech-presentation.html').replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'networkidle0' });

  const slideCount = await page.evaluate(() => {
    const slides = document.querySelectorAll('.slide');
    return Array.from(slides).map((s, idx) => {
      const tag = s.querySelector('.slide-tag')?.innerText || '';
      const title = s.querySelector('.slide-title')?.innerText || '';
      return { idx: idx + 1, id: s.id, tag, title };
    });
  });

  console.log('Found slides:', slideCount);
  await browser.close();
}

inspectSlides().catch(console.error);
