const fs = require('fs');
const path = require('path');

// 1. UPDATE website/cold-call-arena/index.html
const arenaPath = path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
let arenaHtml = fs.readFileSync(arenaPath, 'utf8');

if (arenaHtml.includes('let soundEnabled = true;')) {
  arenaHtml = arenaHtml.replace('let soundEnabled = true;', 'let soundEnabled = false;');
  console.log('✓ Cold Call Arena: Set soundEnabled = false (muted default)');
}

if (arenaHtml.includes('function playSound(type) {\n    if (!soundEnabled) return;')) {
  arenaHtml = arenaHtml.replace(
    'function playSound(type) {\n    if (!soundEnabled) return;',
    'function playSound(type) {\n    if (!soundEnabled || (typeof document !== "undefined" && document.hidden)) return;'
  );
  console.log('✓ Cold Call Arena: Guarded playSound against hidden tabs');
}

if (!arenaHtml.includes('// 🛡️ VISIBILITY AUDIO SAFETY GUARD (COLD CALL ARENA)')) {
  const arenaGuard = `
  // 🛡️ VISIBILITY AUDIO SAFETY GUARD (COLD CALL ARENA)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && audioCtx && audioCtx.state === 'running') {
      try { audioCtx.suspend(); } catch(_) {}
    }
  });
`;
  arenaHtml = arenaHtml.replace('const soundBtn = document.getElementById(\'soundToggleBtn\');', arenaGuard + '\n  const soundBtn = document.getElementById(\'soundToggleBtn\');');
  console.log('✓ Cold Call Arena: Injected visibility safety guard');
}
fs.writeFileSync(arenaPath, arenaHtml, 'utf8');

// 2. UPDATE website/cold-call-quest/index.html
const questPath = path.resolve(__dirname, '..', 'website', 'cold-call-quest', 'index.html');
let questHtml = fs.readFileSync(questPath, 'utf8');

if (!questHtml.includes('// 🛡️ VISIBILITY AUDIO SAFETY GUARD (COLD CALL QUEST)')) {
  const questGuard = `
  // 🛡️ VISIBILITY AUDIO SAFETY GUARD (COLD CALL QUEST)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); } catch(_) {}
      }
      if (audioCtx && audioCtx.state === 'running') {
        try { audioCtx.suspend(); } catch(_) {}
      }
    }
  });

  window.addEventListener('beforeunload', () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch(_) {}
    }
  });
`;
  questHtml = questHtml.replace("window.toggleVoice = function() {", questGuard + "\n  window.toggleVoice = function() {");
  console.log('✓ Cold Call Quest: Injected visibility safety guard');
}
fs.writeFileSync(questPath, questHtml, 'utf8');

// 3. UPDATE website/demo/index.html
const demoPath = path.resolve(__dirname, '..', 'website', 'demo', 'index.html');
let demoHtml = fs.readFileSync(demoPath, 'utf8');

if (!demoHtml.includes('// 🛡️ VISIBILITY AUDIO SAFETY GUARD (AVA DEMO)')) {
  const demoGuard = `
// 🛡️ VISIBILITY AUDIO SAFETY GUARD (AVA DEMO)
document.addEventListener('visibilitychange', () => {
  if (document.hidden && isPlayingCall) {
    stopPlayback();
  }
});

window.addEventListener('beforeunload', () => {
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch(_) {}
  }
});
`;
  demoHtml = demoHtml.replace('function startPlayback() {', demoGuard + '\nfunction startPlayback() {');
  console.log('✓ Ava Demo: Injected visibility safety guard');
}
fs.writeFileSync(demoPath, demoHtml, 'utf8');

console.log('All tab audio safety guards successfully installed!');
