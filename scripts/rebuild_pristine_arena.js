const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. Get raw base from commit a9fa3c8
const raw = execSync('git show a9fa3c8:website/cold-call-arena/index.html', { maxBuffer: 50 * 1024 * 1024, encoding: 'utf8' });
console.log('1. Got raw base HTML, length:', raw.length);

// 2. Truncate at first </html>
const endTag = '</html>';
const firstEndIdx = raw.indexOf(endTag);
if (firstEndIdx === -1) {
  throw new Error('No </html> found in base HTML');
}
let cleanHtml = raw.substring(0, firstEndIdx + endTag.length);
console.log('2. Truncated at first </html>, length:', cleanHtml.length);

// 3. Ensure delivery-dashboard.js is included
if (!cleanHtml.includes('delivery-dashboard.js')) {
  if (cleanHtml.includes('</body>\r\n</html>')) {
    cleanHtml = cleanHtml.replace('</body>\r\n</html>', '<script src="delivery-dashboard.js"></script>\r\n</body>\r\n</html>');
  } else {
    cleanHtml = cleanHtml.replace('</body>\n</html>', '<script src="delivery-dashboard.js"></script>\n</body>\n</html>');
  }
  console.log('3. Injected delivery-dashboard.js script tag');
}

// 4. Load the 50 verified leads
const leads = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'verified_100pct_florida_leads.json'), 'utf8'));
leads.forEach(l => {
  l.batch = 1; // South Florida Hub
});
console.log(`4. Loaded ${leads.length} verified leads`);

// 5. Replace LEADS_DATA using exact markers
const startMarker = 'const LEADS_DATA = [';
const endMarker = '];\n  // Sound Engine';
const startIdx = cleanHtml.indexOf(startMarker);
let endIdx = cleanHtml.indexOf(endMarker, startIdx);

if (startIdx === -1) {
  throw new Error('Could not find startMarker: ' + startMarker);
}
if (endIdx === -1) {
  // Try CRLF
  const endMarkerCRLF = '];\r\n  // Sound Engine';
  endIdx = cleanHtml.indexOf(endMarkerCRLF, startIdx);
  if (endIdx === -1) {
    throw new Error('Could not find endMarker: ' + endMarker);
  }
}

const before = cleanHtml.substring(0, startIdx);
const after = cleanHtml.substring(endIdx + 2); // after ];

cleanHtml = before + `const LEADS_DATA = ${JSON.stringify(leads, null, 2)};` + after;
console.log('5. Injected clean LEADS_DATA array successfully');

// 6. Update batchSelect dropdown
const oldBatchSelectRegex = /<select id="batchSelect"[\s\S]*?<\/select>/;
const newBatchSelectHtml = `<select id="batchSelect" class="custom-select" style="font-weight:700">
                <option value="all" selected>📋 All 50 Verified Contractors (1–10 Employees · Real Phones)</option>
                <option value="1">☀️ Batch 1: South Florida Hub (Palm Beach & Broward · 50 Verified Leads)</option>
                <option value="today100">🔥 Priority Uncalled Dispatch Queue</option>
              </select>`;

if (oldBatchSelectRegex.test(cleanHtml)) {
  cleanHtml = cleanHtml.replace(oldBatchSelectRegex, newBatchSelectHtml);
  console.log('6. Updated batchSelect dropdown');
}

// 7. Ensure defaults: currentBatch = 'all', leadPageSize = 50
cleanHtml = cleanHtml.replace("let currentBatch = 'today100';", "let currentBatch = 'all';");
cleanHtml = cleanHtml.replace("let leadPageSize = 15;", "let leadPageSize = 50;");
cleanHtml = cleanHtml.replace("let leadPageSize = 25;", "let leadPageSize = 50;");

// 8. Validate all <script> blocks
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptCount = 0;
while ((match = scriptRegex.exec(cleanHtml)) !== null) {
  scriptCount++;
  const code = match[1].trim();
  if (!code) continue;
  try {
    new Function(code);
    console.log(`Script ${scriptCount}: VALID SYNTAX (length: ${code.length})`);
  } catch (err) {
    console.error(`Script ${scriptCount} SYNTAX ERROR: ${err.message}`);
    throw err;
  }
}

// 9. Write to file
const outPath = path.join(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
fs.writeFileSync(outPath, cleanHtml, 'utf8');
console.log(`Saved pristine website/cold-call-arena/index.html (length: ${cleanHtml.length})`);
