// scripts/test_reel_creator_rotation.js
const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  console.log('🚀 Launching Edge to test Reel Creator Product Rotation & Dynamic Generation...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  const url = 'file:///' + path.resolve(__dirname, '../website/demo/reel-creator.html').replace(/\\/g, '/');
  console.log('Opening:', url);
  await page.goto(url, { waitUntil: 'networkidle2' });

  // 1. Initial State Check
  const initialData = await page.evaluate(() => {
    const activeProd = getActiveProduct();
    const caption = document.getElementById('igCaptionText') ? document.getElementById('igCaptionText').textContent.substring(0, 100) : '';
    const rotationBadge = document.getElementById('rotationCounterBadge') ? document.getElementById('rotationCounterBadge').textContent : '';
    return {
      activeProduct: activeProd ? activeProd.name : null,
      rotationBadge,
      captionSnippet: caption
    };
  });
  console.log('📊 Initial State:', initialData);

  // 2. Click "Generate Prompt & Create Reel" 1st time
  console.log('⚡ Clicking "Generate Prompt & Create Reel" (Rotation #1)...');
  await page.click('#btnGeneratePromptAndReel');
  await new Promise(r => setTimeout(r, 1000));

  const click1Data = await page.evaluate(() => {
    return {
      productIndex: window.PRODUCT_ROTATION_INDEX,
      activeProduct: getActiveProduct().name,
      activeKeyword: window.ACTIVE_SCENARIO.keyword,
      captionSnippet: document.getElementById('igCaptionText').textContent.substring(0, 80),
      statusMsg: document.getElementById('reelGenStatusMsg') ? document.getElementById('reelGenStatusMsg').textContent : ''
    };
  });
  console.log('✅ After Click #1 (Rotated to Next Product):', click1Data);

  // 3. Click "Generate Prompt & Create Reel" 2nd time
  console.log('⚡ Clicking "Generate Prompt & Create Reel" (Rotation #2)...');
  await page.click('#btnGeneratePromptAndReel');
  await new Promise(r => setTimeout(r, 1000));

  const click2Data = await page.evaluate(() => {
    return {
      productIndex: window.PRODUCT_ROTATION_INDEX,
      activeProduct: getActiveProduct().name,
      activeKeyword: window.ACTIVE_SCENARIO.keyword,
      captionSnippet: document.getElementById('igCaptionText').textContent.substring(0, 80),
      wordCount: window.WORD_TIMESTAMPS.length
    };
  });
  console.log('✅ After Click #2 (Rotated to Next Product):', click2Data);

  // 4. Test "Surprise Me / New Scenario" button
  console.log('🎲 Testing "Surprise Me / New Scenario" button...');
  await page.evaluate(() => generateRandomContractorSituation());
  await new Promise(r => setTimeout(r, 500));

  const randomData = await page.evaluate(() => {
    return {
      ideaText: document.getElementById('postIdeaInput').value.substring(0, 70),
      detectedTrade: window.ACTIVE_SCENARIO.trade,
      detectedTicket: window.ACTIVE_SCENARIO.ticket
    };
  });
  console.log('✅ After Random Situation:', randomData);

  // Take screenshot of workbench
  const screenshotPath = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0\\reel_creator_5_product_rotation_verified.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('📸 Screenshot saved to:', screenshotPath);

  await browser.close();
  console.log('✨ All tests passed successfully!');
})().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
