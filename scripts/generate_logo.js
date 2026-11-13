const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 180 });
  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0B0F16;display:flex;align-items:center;height:180px;padding-left:36px;font-family:Arial,sans-serif;">
  <div style="width:108px;height:108px;border-radius:24px;background:#172033;border:4px solid #F59E0B;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(245,158,11,0.4)">
    <span style="font-size:74px;font-weight:900;color:#F59E0B;line-height:1;margin-top:-4px">V</span>
  </div>
  <div style="margin-left:26px;">
    <div style="font-size:56px;font-weight:900;color:#fff;letter-spacing:-1px;line-height:1">Vantor<span style="color:#F59E0B">X</span></div>
    <div style="font-size:16px;font-weight:700;color:#38BDF8;letter-spacing:5px;margin-top:8px">SOLUTIONS</div>
  </div>
</body>
</html>`;
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  const outPath = 'C:/Users/hungr/OneDrive/Desktop/VANTORX_BRAND_ASSETS/vantorx_website_logo.png';
  await page.screenshot({ path: outPath });
  const stats = fs.statSync(outPath);
  console.log('vantorx_website_logo.png size:', Math.round(stats.size / 1024), 'KB');
  await browser.close();
}

run().catch(console.error);
