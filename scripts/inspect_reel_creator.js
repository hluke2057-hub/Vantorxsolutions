const fs = require('fs');
const lines = fs.readFileSync('website/demo/reel-creator.html', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('id="promptWorkbench"') || 
      l.includes('applyTradePreset =') || 
      l.includes('generateViralPromptFromIdea =') || 
      l.includes('generatePromptAndMakeReel =') ||
      l.includes('TRADE_PRESETS =')) {
    console.log(i + 1, l.trim().substring(0, 80));
  }
});
