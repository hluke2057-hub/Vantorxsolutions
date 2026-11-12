const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const https = require('https');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

const reelUrl = 'https://www.instagram.com/reel/DfjYNESOhdF/?rpxt=MmhseW5yZGh6d3pw';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const audioUrls = [];

  page.on('response', async resp => {
    const url = resp.url();
    const ct = (resp.headers()['content-type'] || '').toLowerCase();
    if (ct.includes('audio') || url.includes('.m4a') || (url.includes('.mp4') && url.includes('audio'))) {
      console.log('Detected Audio stream URL:', url.slice(0, 150));
      audioUrls.push(url);
    }
  });

  await page.goto(reelUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  // Dismiss modal if present
  await page.evaluate(() => {
    const closeBtn = document.querySelector('svg[aria-label="Close"]');
    if (closeBtn && closeBtn.closest('button')) closeBtn.closest('button').click();
    const v = document.querySelector('video');
    if (v) {
      v.muted = false;
      v.play().catch(() => {});
    }
  });

  await new Promise(r => setTimeout(r, 4000));

  console.log('Total audio stream candidates found:', audioUrls.length);
  if (audioUrls.length > 0) {
    const bestUrl = audioUrls[0].replace(/&bytestart=\d+&byteend=\d+/, '');
    const outAudio = path.join(ARTIFACTS_DIR, 'cueva_reference_audio.m4a');
    const f = fs.createWriteStream(outAudio);
    https.get(bestUrl, res => {
      res.pipe(f);
      f.on('finish', () => {
        f.close();
        console.log('DOWNLOADED cueva_reference_audio.m4a! Size:', fs.statSync(outAudio).size);
      });
    });
    await new Promise(r => setTimeout(r, 5000));
  }

  await browser.close();
})();
