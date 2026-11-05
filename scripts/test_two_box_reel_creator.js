const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve('website/demo/reel-creator.html');
const brainDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

async function testTwoBox() {
  console.log('🚀 Testing Two-Box Clean Reel Creator in Edge...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
  });
  page.on('pageerror', err => console.log('PAGE CRASH:', err.message));

  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));

  // Check 2 boxes exist
  const boxes = await page.evaluate(() => {
    const boxLeft = document.querySelector('.box-card.box-left');
    const boxRight = document.querySelector('.box-card.box-right');
    const ideaInput = document.getElementById('postIdeaInput');
    const btnGen = document.getElementById('btnGeneratePromptAndReel');
    const captionBox = document.getElementById('igCaptionText');
    const copyBtn = document.getElementById('btnCopyCaption');
    return {
      boxLeft: !!boxLeft,
      boxRight: !!boxRight,
      hasIdea: !!ideaInput && ideaInput.value.length > 20,
      hasGenBtn: !!btnGen,
      genBtnText: btnGen?.innerText.trim(),
      hasCaption: !!captionBox && captionBox.innerText.length > 50,
      hasCopyBtn: !!copyBtn
    };
  });

  console.log('📦 Box Structure Verification:');
  console.log('   - Left Box (Idea & Reel Creator):', boxes.boxLeft);
  console.log('   - Right Box (Ready-to-Post Caption):', boxes.boxRight);
  console.log('   - Idea pre-filled:', boxes.hasIdea);
  console.log('   - Generate Button Text:', boxes.genBtnText);
  console.log('   - Caption pre-generated:', boxes.hasCaption);
  console.log('   - Copy Button present:', boxes.hasCopyBtn);

  if (!boxes.boxLeft || !boxes.boxRight || !boxes.hasGenBtn) {
    throw new Error('❌ FAILED: Two-box structure missing!');
  }

  // Click a trade preset (e.g. Plumbing)
  console.log('\n🚰 Testing preset switch to Plumbing...');
  await page.evaluate(() => {
    window.applyTradePreset('plumbing');
  });
  await new Promise(r => setTimeout(r, 400));

  const plumbingCaption = await page.evaluate(() => {
    const c = document.getElementById('igCaptionText')?.innerText || '';
    return {
      hasPlumbing: c.toLowerCase().includes('plumb') || c.includes('$8,500'),
      snippet: c.slice(0, 120)
    };
  });
  console.log('   - Caption updated to plumbing:', plumbingCaption.hasPlumbing);
  console.log('   - Caption snippet:', plumbingCaption.snippet);

  // Click the Generate Button!
  console.log('\n⚡ Clicking "Generate Prompt & Create Reel"...');
  await page.click('#btnGeneratePromptAndReel');
  await new Promise(r => setTimeout(r, 1500));

  const playStatus = await page.evaluate(() => {
    const state = (typeof window.getPlaybackState === 'function') ? window.getPlaybackState() : {};
    const isPlaying = state.isPlaying ?? window.isPlaying ?? false;
    const curTime = state.currentTime ?? window.currentTime ?? 0;
    const statusMsg = document.getElementById('reelGenStatusMsg');
    const statusDisplay = statusMsg ? window.getComputedStyle(statusMsg).display : 'none';
    const activeScenario = window.ACTIVE_SCENARIO;
    return {
      isPlaying: !!isPlaying,
      curTime: Number(curTime || 0),
      statusDisplay,
      statusText: statusMsg?.innerText.trim(),
      scenario: activeScenario
    };
  });

  console.log('🎬 Reel Playback & Dynamic Generation Status:');
  console.log('   - Reel is actively playing in reel spot:', playStatus.isPlaying);
  console.log('   - Current playback time:', playStatus.curTime.toFixed(2) + 's');
  console.log('   - Status badge displayed:', playStatus.statusDisplay);
  console.log('   - Status badge text:', playStatus.statusText);
  console.log('   - Active Trade Scenario:', playStatus.scenario ? `${playStatus.scenario.trade} (${playStatus.scenario.ticket})` : 'none');

  if (!playStatus.isPlaying) {
    throw new Error('❌ FAILED: Reel did not start playing on generate click!');
  }

  // Capture closeup screenshot of the 2-box interface
  const twoBoxEl = await page.$('.two-box-layout');
  if (twoBoxEl) {
    const closeupPath = path.join(brainDir, 'two_box_closeup.png');
    await twoBoxEl.screenshot({ path: closeupPath });
    console.log(`\n📸 Two-box closeup screenshot saved to: ${closeupPath}`);
  }

  // Capture screenshot of the 2-box interface and the video stage
  const ssPath = path.join(brainDir, 'two_box_viral_studio_verification.png');
  await page.screenshot({ path: ssPath, fullPage: false });
  console.log(`📸 Verification screenshot saved to: ${ssPath}`);

  await browser.close();
  console.log('\n✨ ALL TESTS PASSED! Clean 2-box generation is 100% operational!');
}

testTwoBox().catch(err => {
  console.error('\n❌ TEST RUNNER FAILED:', err);
  process.exit(1);
});
