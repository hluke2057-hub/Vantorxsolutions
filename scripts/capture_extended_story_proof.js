const puppeteer = require('puppeteer-core');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1080, deviceScaleFactor: 2 });

  const htmlPath = path.resolve(__dirname, '../website/demo/reel-creator.html');
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 800));

  const checkpoints = [
    { t: 14.6, file: 'proof_v2_01_planetary_relay_jupiter.png', desc: 'Scene 2: Planetary Laser Relay (Moon -> Mars -> Jupiter -> Uranus)' },
    { t: 31.2, file: 'proof_v2_02_meet_bob_attic_ladder.png', desc: 'Scene 4: Meet Bob 20ft up Ladder in 130°F Attic' },
    { t: 39.5, file: 'proof_v2_03_sarah_burst_pipe.png', desc: 'Scene 5: Sarah Burst Ceiling Pipe Emergency Across Town' },
    { t: 46.8, file: 'proof_v2_04_phone_buzz_voicemail.png', desc: 'Scene 6: Bob Pocket Phone Buzzing 3 Times -> Voicemail' },
    { t: 62.2, file: 'proof_v2_05_competitor_steals_8k_check.png', desc: 'Scene 8: Competitor Truck Steals $8,000 Check with Bob Name Crossed Out' },
    { t: 70.5, file: 'proof_v2_06_ava_08s_dispatch.png', desc: 'Scene 9: Ava 0.8s Autonomous Answer & SMS Dispatch to Bob' }
  ];

  for (const cp of checkpoints) {
    const b64 = await page.evaluate((time) => {
      window.renderFrame(time);
      const cvs = document.getElementById('reelCanvas');
      return cvs.toDataURL('image/png').slice(22);
    }, cp.t);

    const outPath = path.join(artifactDir, cp.file);
    require('fs').writeFileSync(outPath, Buffer.from(b64, 'base64'));
    console.log(`Captured ${cp.file} at t=${cp.t}s (${cp.desc})`);
  }

  await browser.close();
})();
