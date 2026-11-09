const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const https = require('https');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  let videoUrl = null;
  // Intercept network requests to catch the .mp4 stream!
  page.on('response', async resp => {
    const url = resp.url();
    if (url.includes('.mp4') || (resp.headers()['content-type'] && resp.headers()['content-type'].includes('video/mp4'))) {
      if (!videoUrl && url.includes('cdninstagram.com')) {
        videoUrl = url;
        console.log('FOUND INSTAGRAM REEL MP4 STREAM:', url);
      }
    }
  });

  // Navigate to the Uranus laser reel: https://www.instagram.com/trytaskless.ai/reel/DfER2bzxQJj/
  console.log('Navigating to Uranus reel...');
  await page.goto('https://www.instagram.com/trytaskless.ai/reel/DfER2bzxQJj/', { waitUntil: 'networkidle2', timeout: 25000 });
  await new Promise(r => setTimeout(r, 4000));

  if (videoUrl) {
    console.log('Downloading MP4 video sample...');
    const file = fs.createWriteStream(path.join(ARTIFACTS_DIR, 'taskless_uranus_reel.mp4'));
    https.get(videoUrl, res => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('DOWNLOADED taskless_uranus_reel.mp4 successfully!');
      });
    });
  } else {
    console.log('Could not capture direct MP4 stream via network listener.');
  }

  // Also navigate to the 11:04 PM night phone reel: https://www.instagram.com/trytaskless.ai/reel/DfVJ5ZHNWLl/
  console.log('Navigating to 11:04 PM night reel...');
  videoUrl = null;
  await page.goto('https://www.instagram.com/trytaskless.ai/reel/DfVJ5ZHNWLl/', { waitUntil: 'networkidle2', timeout: 25000 });
  await new Promise(r => setTimeout(r, 4000));

  if (videoUrl) {
    console.log('Downloading 11:04 PM reel...');
    const file2 = fs.createWriteStream(path.join(ARTIFACTS_DIR, 'taskless_11pm_reel.mp4'));
    https.get(videoUrl, res => {
      res.pipe(file2);
      file2.on('finish', () => {
        file2.close();
        console.log('DOWNLOADED taskless_11pm_reel.mp4 successfully!');
      });
    });
  }

  await new Promise(r => setTimeout(r, 6000));
  await browser.close();
})();
