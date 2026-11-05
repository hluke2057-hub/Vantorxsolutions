// scripts/patch_dynamic_scene_variables.js
const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('website/demo/reel-creator.html');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Scene 6 Dynamic ticket & trade tag
content = content.replace(
  "ctx.fillText('🚨 BURST PIPE EMERGENCY REPIPE', dossX + 14, dossY + 24);",
  "const emTag = (window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.trade) ? ('🚨 ' + window.ACTIVE_SCENARIO.trade + ' EMERGENCY CALL') : '🚨 BURST PIPE EMERGENCY REPIPE'; ctx.fillText(emTag, dossX + 14, dossY + 24);"
);

content = content.replace(
  "ctx.fillText('VALUE: $8,500.00', dossX + 14, dossY + 55);",
  "const valStr = (window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.ticket) ? ('VALUE: ' + window.ACTIVE_SCENARIO.ticket + '.00') : 'VALUE: $8,500.00'; ctx.fillText(valStr, dossX + 14, dossY + 55);"
);

// 2. Scene 8 Dynamic burn card
content = content.replace(
  "renderTopPill('💸 $8,500 HANDED TO YOUR COMPETITOR');",
  "const burnTop = (window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.ticket) ? ('💸 ' + window.ACTIVE_SCENARIO.ticket + ' HANDED TO YOUR COMPETITOR') : '💸 $8,500 HANDED TO YOUR COMPETITOR'; renderTopPill(burnTop);"
);

content = content.replace(
  "ctx.fillText('-$8,500.00 REVENUE', W / 2, cardY + 50);",
  "const burnRev = (window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.ticket) ? ('-' + window.ACTIVE_SCENARIO.ticket + '.00 REVENUE') : '-$8,500.00 REVENUE'; ctx.fillText(burnRev, W / 2, cardY + 50);"
);

// 3. Scene 11 Dynamic SMS dispatch
content = content.replace(
  "ctx.fillText('482 Ocean Drive, Palm Beach FL · Burst Pipe ($8,500)', notifX + 20, notifY + 92);",
  "const dispStr = (window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.ticket) ? ('482 Ocean Drive, Palm Beach FL · ' + window.ACTIVE_SCENARIO.trade + ' (' + window.ACTIVE_SCENARIO.ticket + ')') : '482 Ocean Drive, Palm Beach FL · Burst Pipe ($8,500)'; ctx.fillText(dispStr, notifX + 20, notifY + 92);"
);

// 4. Scene 15 Dynamic keyword
content = content.replace(
  "renderTopPill('💬 COMMENT \"AVA\" BELOW FOR FREE INSTANT ACCESS');",
  "const kwPill = (window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.keyword) ? ('💬 COMMENT \"' + window.ACTIVE_SCENARIO.keyword + '\" BELOW FOR FREE INSTANT ACCESS') : '💬 COMMENT \"AVA\" BELOW FOR FREE INSTANT ACCESS'; renderTopPill(kwPill);"
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('✓ Successfully patched dynamic scenario variables into scenes 6, 8, 11, 15.');
