const fs = require('fs');
const filePath = 'website/demo/reel-creator.html';
let content = fs.readFileSync(filePath, 'utf8');

const target = "if (time >= 48.0 && !playedSfxMap['chaching']) { playSfx('chaching'); playedSfxMap['chaching'] = true; }";
const idx = content.indexOf(target);
if (idx !== -1) {
  const after = content.slice(idx, idx + 250);
  console.log('Found target! Following chars:', JSON.stringify(after));
  // Replace the double brace after target
  const fixed = content.replace(
    /if \(time >= 48\.0 && !playedSfxMap\['chaching'\]\) \{ playSfx\('chaching'\); playedSfxMap\['chaching'\] = true; \}\s*\}\s*\}/,
    "if (time >= 48.0 && !playedSfxMap['chaching']) { playSfx('chaching'); playedSfxMap['chaching'] = true; }\n  }"
  );
  fs.writeFileSync(filePath, fixed, 'utf8');
  console.log('Successfully fixed extra brace!');
} else {
  console.log('Target not found!');
}
