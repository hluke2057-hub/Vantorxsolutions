const puppeteer = require('puppeteer-core');
const https = require('https');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const u = 'https://www.instagram.com/reel/DfER2bzxQJj/';
  console.log('Fetching reel video url from:', u);
  await page.goto(u, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  const videoSrc = await page.evaluate(() => {
    const video = document.querySelector('video');
    return video ? video.src : null;
  });

  console.log('Found videoSrc:', videoSrc);

  if (videoSrc) {
    const dest = path.join(artDir, 'taskless_uranus_reel.mp4');
    const file = fs.createWriteStream(dest);
    https.get(videoSrc, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Downloaded taskless_uranus_reel.mp4, size:', fs.statSync(dest).size);
      });
    });
  }

  await browser.close();
})();
