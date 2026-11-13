const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.toString()));

  // 1. Verify reel2.html
  const reel2Url = 'file:///' + path.join(root, 'website/demo/reel2.html').replace(/\\/g, '/');
  await page.goto(reel2Url, { waitUntil: 'load' });
  const title = await page.title();
  const badgeText = await page.$eval('.badge', el => el.innerText);
  console.log('reel2.html Title:', title);
  console.log('reel2.html Badge:', badgeText);

  // 2. Verify reel-creator.html
  const creatorUrl = 'file:///' + path.join(root, 'website/demo/reel-creator.html').replace(/\\/g, '/');
  await page.goto(creatorUrl, { waitUntil: 'load' });
  const activeTitle = await page.$eval('#activeReelStageTitle', el => el.innerText).catch(() => 'N/A');
  console.log('reel-creator.html Active Title:', activeTitle);

  await browser.close();

  if (errors.length > 0) {
    console.error('Errors found:', errors);
    process.exit(1);
  } else {
    console.log('✅ UI verification passed cleanly with 0 console errors!');
  }
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
