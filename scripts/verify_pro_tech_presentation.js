const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  console.log('🚀 Launching Edge browser to verify PRO-TECH AIR presentation...');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1050']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1050 });

  const realErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR:', msg.text());
      realErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    console.log('UNCAUGHT EXCEPTION:', err.message);
    realErrors.push(err.message);
  });

  const deckPath = path.resolve(__dirname, '..', 'website', 'demo', 'pro-tech-presentation.html');
  const fileUrl = 'file:///' + deckPath.replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);

  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

  const artifactDir = 'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0';

  // Screenshot Slide 1: Cover
  await page.screenshot({ path: path.join(artifactDir, 'pro_tech_slide_1_cover.png') });
  console.log('📸 Captured Slide 1');

  // Next to Slide 2: The Math / Bleed
  await page.click('#nextBtn');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(artifactDir, 'pro_tech_slide_2_math.png') });
  console.log('📸 Captured Slide 2');

  // Next to Slide 3: Website Mockup
  await page.click('#nextBtn');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(artifactDir, 'pro_tech_slide_3_website.png') });
  console.log('📸 Captured Slide 3');

  // Next to Slide 4: Ava Voice AI
  await page.click('#nextBtn');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(artifactDir, 'pro_tech_slide_4_ava.png') });
  console.log('📸 Captured Slide 4');

  // Next to Slide 7: Pricing & Bundle
  await page.evaluate(() => window.updateSlide(7));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(artifactDir, 'pro_tech_slide_7_pricing.png') });
  console.log('📸 Captured Slide 7 (Pricing)');

  await browser.close();
  console.log('🎉 Verification and slide stills completed successfully!');
})().catch(err => {
  console.error('❌ Error verifying presentation:', err);
  process.exit(1);
});
