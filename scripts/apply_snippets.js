const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('website/demo/reel-creator.html');
let html = fs.readFileSync(targetFile, 'utf8');

const engineCode = fs.readFileSync(path.resolve('scripts/snippet_engine.js'), 'utf8');
const renderFrameCode = fs.readFileSync(path.resolve('scripts/snippet_renderframe.js'), 'utf8');
const scenesCode = fs.readFileSync(path.resolve('scripts/snippet_scenes.js'), 'utf8');

// 1. Inject Section A (Engine)
const startMarkerA = '// 🎨 IMMERSIVE STICK FIGURE STORY ANIMATION ENGINE';
const endMarkerA = 'function renderFrame(time) {';

const idxA1 = html.indexOf(startMarkerA);
const idxA2 = html.indexOf(endMarkerA);

if (idxA1 === -1 || idxA2 === -1) {
  console.error('ERROR: Could not find markers for Section A!', { idxA1, idxA2 });
  process.exit(1);
}

html = html.slice(0, idxA1) + engineCode + '\n' + html.slice(idxA2);
console.log('✓ Section A successfully spliced.');

// 2. Inject Section B (renderFrame)
const startMarkerB = 'function renderFrame(time) {';
const endMarkerB = '// Helper: 3D Warp Starfield';

const idxB1 = html.indexOf(startMarkerB);
const idxB2 = html.indexOf(endMarkerB);

if (idxB1 === -1 || idxB2 === -1) {
  console.error('ERROR: Could not find markers for Section B!', { idxB1, idxB2 });
  process.exit(1);
}

html = html.slice(0, idxB1) + renderFrameCode + '\n\n' + html.slice(idxB2);
console.log('✓ Section B successfully spliced.');

// 3. Inject Section C (Scenes)
const startMarkerC = '// =========================================================================\n// 🎬 10 NARRATION-MATCHED STICK FIGURE STORY SCENES';
const endMarkerC = '// --- INITIAL HERO POSTER CARD ON PAUSE / LOAD (t === 0) ---';

const idxC1 = html.indexOf(startMarkerC);
const idxC2 = html.indexOf(endMarkerC);

if (idxC1 === -1 || idxC2 === -1) {
  console.error('ERROR: Could not find markers for Section C!', { idxC1, idxC2 });
  process.exit(1);
}

html = html.slice(0, idxC1) + scenesCode + '\n' + html.slice(idxC2);
console.log('✓ Section C successfully spliced.');

// Validate that <script> tags parse as valid JavaScript
const scriptRegex = /<script>([\s\S]*?)<\/script>/gi;
let match;
let scriptIdx = 0;
while ((match = scriptRegex.exec(html)) !== null) {
  scriptIdx++;
  const code = match[1];
  try {
    new Function(code);
    console.log(`✓ <script #${scriptIdx}> syntax is 100% VALID (${code.length} chars)`);
  } catch (err) {
    console.error(`❌ Syntax Error in <script #${scriptIdx}>:`, err.message);
    process.exit(1);
  }
}

fs.writeFileSync(targetFile, html, 'utf8');
console.log('🎉 SUCCESSFULLY APPLIED ALL CONTINUOUS KINETIC SNIPPETS TO reel-creator.html!');
