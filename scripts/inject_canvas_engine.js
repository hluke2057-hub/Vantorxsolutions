const fs = require('fs');
const path = require('path');
const vm = require('vm');

const reelHtmlPath = path.resolve('website/demo/reel-creator.html');
const enginePath = path.resolve('scripts/canvas_movie_engine.js');

let html = fs.readFileSync(reelHtmlPath, 'utf8');
const engineCode = fs.readFileSync(enginePath, 'utf8');

const startIdx = html.indexOf('const SCRIPT_CUES = [');
const endIdx = html.indexOf('window.switchStageView = function');

if (startIdx === -1 || endIdx === -1) {
  console.error('Boundaries not found!');
  process.exit(1);
}

// Inject
const newHtml = html.substring(0, startIdx) + engineCode + '\n  ' + html.substring(endIdx);
fs.writeFileSync(reelHtmlPath, newHtml, 'utf8');
console.log('Successfully injected canvas_movie_engine.js into website/demo/reel-creator.html!');

// Validate syntax of the entire HTML script
const scriptStart = newHtml.indexOf('<script>');
const scriptEnd = newHtml.lastIndexOf('</script>');
const fullScript = newHtml.substring(scriptStart + 8, scriptEnd);
new vm.Script(fullScript);
console.log('Entire reel-creator.html script syntax verified 100% OK!');
