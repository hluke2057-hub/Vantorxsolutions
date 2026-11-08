const fs = require('fs');
const html = fs.readFileSync('website/demo/reel-creator.html', 'utf8');
const lines = html.split('\n');

const idxStick = html.indexOf('function drawStickFigure(ctx, x, y, opts) {');
const idxHook = html.indexOf('function renderDynamicStoryHookPhase(t) {');
const idxScenes = html.indexOf('function renderScene5_Stat78PercentSlam(t) {');
const idxEndScenes = html.indexOf('function renderKineticSubtitles(t) {');

console.log('drawStickFigure index:', idxStick);
console.log('renderDynamicStoryHookPhase index:', idxHook);
console.log('renderScene5 index:', idxScenes);
console.log('renderKineticSubtitles index:', idxEndScenes);
