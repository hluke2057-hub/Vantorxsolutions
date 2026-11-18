// scripts/patch_arena_website_links.js
const fs = require('fs');
const path = require('path');

const arenaPath = path.join(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
let html = fs.readFileSync(arenaPath, 'utf8');

// 1. Add btnActiveLeadWebsite in teleprompter header
const targetBtnHtml = 'id="btnActiveLeadSunbiz" style="border:1.5px solid rgba(168,85,247,0.65);color:#d8b4fe;font-weight:800;background:rgba(168,85,247,0.12);text-decoration:none" title="Open Official Florida Sunbiz Corporate Filing & License Holder Record">🏛️ Check Sunbiz Filing ↗</a>';
const replacementBtnHtml = targetBtnHtml + '\n            <a href="#" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm" id="btnActiveLeadWebsite" style="border:1.5px solid #10b981;color:#6ee7b7;font-weight:800;background:rgba(16,185,129,0.12);text-decoration:none;display:none" title="Visit Verified Official Company Website">🌐 Official Website ↗</a>';

if (html.includes(targetBtnHtml)) {
  html = html.replace(targetBtnHtml, replacementBtnHtml);
  console.log('1. Added btnActiveLeadWebsite to teleprompter header');
} else {
  console.log('1. Target btn html not found');
}

// 2. In loadLeadIntoTeleprompter, update btnActiveLeadWebsite
const teleprompterSnippet = "sbBtn.textContent = lead.sunbizDocNum ? `🏛️ Sunbiz #${lead.sunbizDocNum} ↗` : '🏛️ Sunbiz Official ↗';\r\n    }";
const teleprompterReplacement = teleprompterSnippet + "\r\n    const webBtn = document.getElementById('btnActiveLeadWebsite');\r\n    if (webBtn) {\r\n      if (lead.website) {\r\n        webBtn.href = lead.website;\r\n        webBtn.style.display = 'inline-flex';\r\n        webBtn.textContent = '🌐 Official Website ↗';\r\n      } else {\r\n        webBtn.style.display = 'none';\r\n      }\r\n    }";

if (html.includes(teleprompterSnippet)) {
  html = html.replaceAll(teleprompterSnippet, teleprompterReplacement);
  console.log('2. Updated loadLeadIntoTeleprompter with website hook');
} else {
  const teleprompterSnippetNoR = "sbBtn.textContent = lead.sunbizDocNum ? `🏛️ Sunbiz #${lead.sunbizDocNum} ↗` : '🏛️ Sunbiz Official ↗';\n    }";
  const teleprompterReplacementNoR = teleprompterSnippetNoR + "\n    const webBtn = document.getElementById('btnActiveLeadWebsite');\n    if (webBtn) {\n      if (lead.website) {\n        webBtn.href = lead.website;\n        webBtn.style.display = 'inline-flex';\n        webBtn.textContent = '🌐 Official Website ↗';\n      } else {\n        webBtn.style.display = 'none';\n      }\n    }";
  html = html.replaceAll(teleprompterSnippetNoR, teleprompterReplacementNoR);
  console.log('2. Updated loadLeadIntoTeleprompter with website hook (no \\r)');
}

fs.writeFileSync(arenaPath, html, 'utf8');
console.log('Finished updating arena website links!');
