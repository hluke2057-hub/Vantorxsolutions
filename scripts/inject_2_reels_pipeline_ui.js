const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetFile = path.resolve('website/demo/reel-creator.html');
let html = fs.readFileSync(targetFile, 'utf8');

const schedulerHtml = `
  <!-- 📅 DAILY 2-REELS VIRAL PIPELINE CONTROLLER -->
  <div class="daily-reels-pipeline-banner" style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9)); border: 1px solid rgba(245, 158, 11, 0.45); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); border-radius: 14px; padding: 14px 20px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); display: flex; align-items: center; justify-content: center; font-size: 20px;">📅</div>
      <div>
        <div style="font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.06em; display: flex; align-items: center; gap: 8px;">
          DAILY 2-REELS OUTREACH PIPELINE
          <span style="font-size: 11px; font-weight: 700; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #34d399; padding: 2px 8px; border-radius: 999px;">0 REPEATED REELS</span>
        </div>
        <div style="font-size: 12.5px; color: #94a3b8; margin-top: 2px;">Post 2 animated reels daily to maximize local contractor reach. Select today's drop:</div>
      </div>
    </div>

    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
      <button type="button" id="btnMorningSlot" class="btn-slot-drop active" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0.12)); border: 1.5px solid #f59e0b; color: #fbbf24; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 0 16px rgba(245, 158, 11, 0.25); transition: all 0.2s;">
        <span>🌞 Drop #1: Morning (9:00 AM)</span>
      </button>
      <button type="button" id="btnEveningSlot" class="btn-slot-drop" style="background: rgba(30, 41, 59, 0.8); border: 1.5px solid rgba(255, 255, 255, 0.15); color: #94a3b8; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;">
        <span>🌙 Drop #2: Evening (5:00 PM)</span>
      </button>
    </div>
  </div>
`;

// Insert schedulerHtml right inside .two-box-layout or right before it
const twoBoxLayoutTarget = '<div class="two-box-layout" id="promptWorkbench">';
if (html.includes(twoBoxLayoutTarget) && !html.includes('daily-reels-pipeline-banner')) {
  html = html.replace(twoBoxLayoutTarget, schedulerHtml + '\n  ' + twoBoxLayoutTarget);
  console.log('✅ Injected 2-Reels Pipeline Banner above two-box-layout');
}

// Wire the scheduler buttons in JS
const schedulerJs = `
  // -----------------------------------------------------------
  // 📅 WIRE DAILY 2-REELS OUTREACH PIPELINE (MORNING & EVENING)
  // -----------------------------------------------------------
  const btnMorningSlot = document.getElementById('btnMorningSlot');
  const btnEveningSlot = document.getElementById('btnEveningSlot');

  function activateDropSlot(slotType) {
    if (slotType === 'morning') {
      if (btnMorningSlot) {
        btnMorningSlot.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0.12))';
        btnMorningSlot.style.borderColor = '#f59e0b';
        btnMorningSlot.style.color = '#fbbf24';
        btnMorningSlot.style.boxShadow = '0 0 16px rgba(245, 158, 11, 0.25)';
      }
      if (btnEveningSlot) {
        btnEveningSlot.style.background = 'rgba(30, 41, 59, 0.8)';
        btnEveningSlot.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        btnEveningSlot.style.color = '#94a3b8';
        btnEveningSlot.style.boxShadow = 'none';
      }
      window.PRODUCT_ROTATION_INDEX = 0;
      const targetProd = window.PRODUCTS_MIND_QUEUE[0];
      buildReelAssetsForProduct(targetProd);
      updateGiantButtonMindState(targetProd);
    } else {
      if (btnEveningSlot) {
        btnEveningSlot.style.background = 'linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(56, 189, 248, 0.12))';
        btnEveningSlot.style.borderColor = '#38bdf8';
        btnEveningSlot.style.color = '#38bdf8';
        btnEveningSlot.style.boxShadow = '0 0 16px rgba(56, 189, 248, 0.25)';
      }
      if (btnMorningSlot) {
        btnMorningSlot.style.background = 'rgba(30, 41, 59, 0.8)';
        btnMorningSlot.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        btnMorningSlot.style.color = '#94a3b8';
        btnMorningSlot.style.boxShadow = 'none';
      }
      window.PRODUCT_ROTATION_INDEX = 1;
      const targetProd = window.PRODUCTS_MIND_QUEUE[1];
      buildReelAssetsForProduct(targetProd);
      updateGiantButtonMindState(targetProd);
    }
  }

  if (btnMorningSlot) btnMorningSlot.addEventListener('click', () => activateDropSlot('morning'));
  if (btnEveningSlot) btnEveningSlot.addEventListener('click', () => activateDropSlot('evening'));
`;

const jsInitTarget = 'updateGiantButtonMindState(window.PRODUCTS_MIND_QUEUE[0]);';
if (html.includes(jsInitTarget) && !html.includes('activateDropSlot')) {
  html = html.replace(jsInitTarget, () => jsInitTarget + '\n' + schedulerJs);
  console.log('✅ Injected activateDropSlot JS handler');
}

// Test syntax with vm.Script
const sIdx = html.indexOf('<script>');
const eIdx = html.lastIndexOf('</script>');
const jsCode = html.slice(sIdx + 8, eIdx);

try {
  new vm.Script(jsCode);
  console.log('🎉 SCRIPT COMPILES WITH ZERO SYNTAX ERRORS!');
  fs.writeFileSync(targetFile, html, 'utf8');
  console.log('✅ Saved updated reel-creator.html!');
} catch (e) {
  console.error('❌ SYNTAX ERROR:', e.message);
  process.exit(1);
}
