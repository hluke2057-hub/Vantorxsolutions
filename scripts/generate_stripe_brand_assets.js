const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = 'C:\\Users\\hungr\\OneDrive\\Desktop\\VANTORX_BRAND_ASSETS';

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Icon (512x512) - Exact Website Favicon Icon
  await page.setViewport({ width: 512, height: 512 });
  const iconHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 512px; height: 512px;
      background: transparent;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
    }
    .icon-box {
      width: 512px; height: 512px;
      background: radial-gradient(circle at 50% 30%, #172033 0%, #0B0F16 75%, #05070B 100%);
      border-radius: 112px;
      display: flex; align-items: center; justify-content: center;
      border: 12px solid rgba(245, 158, 11, 0.45);
      box-shadow: 0 0 60px rgba(245, 158, 11, 0.25), inset 0 0 40px rgba(56, 189, 248, 0.15);
      position: relative;
    }
    .letter-v {
      font-size: 330px;
      font-weight: 900;
      background: linear-gradient(145deg, #FDE68A 0%, #F59E0B 45%, #D97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 10px 25px rgba(245, 158, 11, 0.55));
      line-height: 1;
      margin-top: -15px;
    }
  </style>
</head>
<body>
  <div class="icon-box">
    <div class="letter-v">V</div>
  </div>
</body>
</html>`;

  await page.setContent(iconHtml, { waitUntil: 'networkidle0' });
  const iconPath = path.join(OUT_DIR, 'vantorx_website_icon.png');
  await page.screenshot({ path: iconPath, type: 'png' });
  const iconStats = fs.statSync(iconPath);
  console.log(`✅ Created: vantorx_website_icon.png (${Math.round(iconStats.size / 1024)} KB) -> Under 512 KB limit!`);

  // 2. Horizontal Logo (800x240) - For Stripe Invoices & Checkout Header
  await page.setViewport({ width: 800, height: 240 });
  const logoHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 800px; height: 240px;
      background: #0B0F16;
      display: flex; align-items: center;
      padding: 0 40px;
      gap: 28px;
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
    }
    .icon-mark {
      width: 140px; height: 140px;
      background: radial-gradient(circle at 50% 30%, #172033 0%, #0B0F16 80%);
      border-radius: 32px;
      display: flex; align-items: center; justify-content: center;
      border: 4px solid rgba(245, 158, 11, 0.5);
      box-shadow: 0 0 25px rgba(245, 158, 11, 0.35);
      flex-shrink: 0;
    }
    .mark-v {
      font-size: 96px;
      font-weight: 900;
      background: linear-gradient(145deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-top: -6px;
    }
    .text-wrap {
      display: flex; flex-direction: column; justify-content: center;
    }
    .brand-title {
      font-size: 68px;
      font-weight: 900;
      color: #FFFFFF;
      letter-spacing: -0.02em;
      line-height: 1;
    }
    .gold-x {
      background: linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 2px 10px rgba(245, 158, 11, 0.4));
    }
    .brand-sub {
      font-size: 19px;
      font-weight: 700;
      color: #38BDF8;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="icon-mark">
    <div class="mark-v">V</div>
  </div>
  <div class="text-wrap">
    <div class="brand-title">Vantor<span class="gold-x">X</span></div>
    <div class="brand-sub">SOLUTIONS</div>
  </div>
</body>
</html>`;

  await page.setContent(logoHtml, { waitUntil: 'networkidle0' });
  const logoPath = path.join(OUT_DIR, 'vantorx_website_logo.png');
  await page.screenshot({ path: logoPath, type: 'png' });
  const logoStats = fs.statSync(logoPath);
  console.log(`✅ Created: vantorx_website_logo.png (${Math.round(logoStats.size / 1024)} KB) -> Under 512 KB limit!`);

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
