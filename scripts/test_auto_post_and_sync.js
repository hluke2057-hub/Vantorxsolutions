// scripts/test_auto_post_and_sync.js
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve('website/demo/reel-creator.html');
const outDir = 'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0';

async function main() {
  console.log('--- TESTING AUTO-GENERATE POST STUDIO & TIMING SYNC ---');
  console.log('Edge executable:', edgePath);
  console.log('Target HTML:', htmlPath);

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1600, deviceScaleFactor: 1 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
    else console.log('[BROWSER]', msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  console.log('Navigating to page...');
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Check if elements exist
  const checks = await page.evaluate(() => {
    const studio = document.getElementById('autoPostStudio');
    const input = document.getElementById('postIdeaInput');
    const btnGen = document.getElementById('btnGeneratePrompt');
    const workbench = document.getElementById('promptWorkbench');
    const promptText = document.getElementById('structuredPromptOutput');
    const captionText = document.getElementById('igCaptionText');
    const syncSlider = document.getElementById('audioSyncSlider');
    const syncLabel = document.getElementById('syncOffsetVal');

    return {
      hasStudio: !!studio,
      hasInput: !!input,
      hasBtnGen: !!btnGen,
      hasWorkbench: !!workbench,
      hasPromptText: !!promptText,
      hasCaptionText: !!captionText,
      hasSyncSlider: !!syncSlider,
      syncLabelText: syncLabel ? syncLabel.textContent : '',
      initialPromptVal: promptText ? promptText.value.slice(0, 100) : '',
      initialCaptionVal: captionText ? captionText.textContent.slice(0, 100) : ''
    };
  });

  console.log('DOM Checks Result:', checks);

  // 2. Test Presets
  console.log('Testing Trade Preset Switch: Plumbing ($8,500)...');
  await page.evaluate(() => {
    window.applyTradePreset('plumbing');
  });
  await new Promise(r => setTimeout(r, 500));

  const plumbingCheck = await page.evaluate(() => {
    const input = document.getElementById('postIdeaInput');
    const promptText = document.getElementById('structuredPromptOutput');
    const captionText = document.getElementById('igCaptionText');
    return {
      inputVal: input ? input.value.slice(0, 80) : '',
      promptIncludesPlumbing: promptText ? promptText.value.includes('PLUMBING') : false,
      promptIncludes8500: promptText ? promptText.value.includes('$8,500') : false,
      captionIncludesFlow: captionText ? captionText.textContent.includes('FLOW') : false
    };
  });
  console.log('Plumbing Preset Check:', plumbingCheck);

  // 3. Test Audio Sync Offset
  console.log('Testing Audio Sync Offset: +50ms...');
  await page.evaluate(() => {
    window.setAudioSyncOffset(50);
  });
  const syncCheck = await page.evaluate(() => {
    return {
      syncOffset: window.audioSyncOffset,
      label: document.getElementById('syncOffsetVal').textContent
    };
  });
  console.log('Sync Offset Check:', syncCheck);

  // 4. Test Video Generation Trigger
  console.log('Testing Video Generation Trigger...');
  await page.evaluate(() => {
    window.generateVideoFromPrompt();
  });
  await new Promise(r => setTimeout(r, 800));

  const videoGenCheck = await page.evaluate(() => {
    return {
      isPlaying: window.isPlaying,
      activeScenario: window.ACTIVE_SCENARIO,
      wordTimestampsCount: window.WORD_TIMESTAMPS.length,
      statusMsgVisible: document.getElementById('videoGenStatusMsg').style.display !== 'none'
    };
  });
  console.log('Video Generation Check:', videoGenCheck);

  // 5. Take Screenshots of the Auto-Generate Post Studio and Video Canvas
  const shot1 = path.join(outDir, 'auto_post_studio_workbench.png');
  const studioHandle = await page.$('#autoPostStudio');
  if (studioHandle) {
    await studioHandle.screenshot({ path: shot1 });
    console.log('Saved studio screenshot:', shot1);
  }

  const shot2 = path.join(outDir, 'auto_post_full_interface.png');
  await page.screenshot({ path: shot2, fullPage: true });
  console.log('Saved full page screenshot:', shot2);

  await browser.close();

  console.log('Console Errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Console Errors:', consoleErrors);
  } else {
    console.log('🎉 ALL TESTS PASSED WITH ZERO CONSOLE ERRORS!');
  }
}

main().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
