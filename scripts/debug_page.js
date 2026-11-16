// scripts/debug_page.js
const fs = require('fs');
const puppeteer = require('puppeteer-core');
const path = require('path');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlSource = fs.readFileSync('scripts/render_nvidia_3d_reel.js', 'utf8');

const tsJsonPath = 'website/demo/audio/reel-nvidia-timestamps.json';
const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));

const startIdx = htmlSource.indexOf('const htmlContent = `') + 'const htmlContent = `'.length;
const endIdx = htmlSource.indexOf('`;\n\nconst tmpHtmlPath');
let html = htmlSource.substring(startIdx, endIdx);
html = html.replace('${JSON.stringify(tsData.words)}', JSON.stringify(tsData.words));
fs.writeFileSync('scripts/debug.html', html, 'utf8');

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new' });
  const page = await browser.newPage();
  page.on('pageerror', err => {
    console.error('PAGE ERROR MESSAGE:', err.message);
    console.error('STACK:', err.stack);
  });
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('file:///' + process.cwd().replace(/\\/g, '/') + '/scripts/debug.html');
  await browser.close();
  // fs.unlinkSync('scripts/debug.html');
})().catch(console.error);
