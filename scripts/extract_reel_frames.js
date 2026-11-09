const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('--- EXTRACTING VIDEO FRAMES FROM TASKLESS REELS ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });

  const reels = [
    { name: 'uranus', file: path.join(ARTIFACTS_DIR, 'taskless_uranus_reel.mp4'), timestamps: [0.5, 2.0, 4.0, 7.0, 10.0, 14.0] },
    { name: '11pm', file: path.join(ARTIFACTS_DIR, 'taskless_11pm_reel.mp4'), timestamps: [0.5, 2.0, 4.0, 6.0, 9.0, 12.0] }
  ];

  for (const r of reels) {
    if (!fs.existsSync(r.file)) {
      console.log(`File not found: ${r.file}`);
      continue;
    }
    const stat = fs.statSync(r.file);
    console.log(`Video ${r.name} size: ${stat.size} bytes`);
    if (stat.size < 1000) {
      console.log(`Video file too small: ${stat.size}`);
      continue;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;height:100vh;">
        <video id="v" src="file:///${r.file.replace(/\\/g, '/')}" style="max-width:100%;max-height:100%;" playsinline muted></video>
      </body>
      </html>
    `;
    await page.setContent(htmlContent);
    await new Promise(res => setTimeout(res, 1000));

    for (let idx = 0; idx < r.timestamps.length; idx++) {
      const t = r.timestamps[idx];
      await page.evaluate((time) => {
        const v = document.getElementById('v');
        if (v) v.currentTime = time;
      }, t);
      await new Promise(res => setTimeout(res, 600));

      const outPath = path.join(ARTIFACTS_DIR, `frame_${r.name}_${idx}_${t}s.png`);
      const vEl = await page.$('#v');
      if (vEl) {
        await vEl.screenshot({ path: outPath });
        console.log(`Saved frame ${outPath}`);
      }
    }
  }

  await browser.close();
  console.log('FRAME EXTRACTION COMPLETE!');
})();
