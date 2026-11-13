const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';

async function testPdf() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @page { size: 1920px 1080px; margin: 0; }
        body { margin: 0; padding: 0; background: #060911; color: #fff; font-family: sans-serif; }
        .page { width: 1920px; height: 1080px; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: bold; page-break-after: always; break-after: page; }
        .p1 { background: #0d1322; color: #fbbf24; }
        .p2 { background: #064e3b; color: #34d399; }
      </style>
    </head>
    <body>
      <div class="page p1">Slide 1: Executive Overview</div>
      <div class="page p2">Slide 2: HVAC Math Breakdown</div>
    </body>
    </html>
  `);

  const pdfBuf = await page.pdf({
    width: '1920px',
    height: '1080px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  console.log('Generated test PDF bytes:', pdfBuf.length);
  await browser.close();
}

testPdf().catch(console.error);
