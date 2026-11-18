const fs = require('fs');
const path = require('path');

const arenaPath = path.join(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
let html = fs.readFileSync(arenaPath, 'utf8');

// 1. Truncate at the first </html>
const endTag = '</html>';
const firstEndIdx = html.indexOf(endTag);
if (firstEndIdx === -1) {
  console.error('No </html> tag found!');
  process.exit(1);
}

let cleanHtml = html.substring(0, firstEndIdx + endTag.length);
console.log('Original length:', html.length);
console.log('Cleaned length before dashboard tag check:', cleanHtml.length);

// 2. Ensure delivery-dashboard.js is included right before </body></html>
if (!cleanHtml.includes('delivery-dashboard.js')) {
  cleanHtml = cleanHtml.replace('</body>\r\n</html>', '<script src="delivery-dashboard.js"></script>\r\n</body>\r\n</html>');
  if (!cleanHtml.includes('delivery-dashboard.js')) {
    cleanHtml = cleanHtml.replace('</body>\n</html>', '<script src="delivery-dashboard.js"></script>\n</body>\n</html>');
  }
  console.log('Injected delivery-dashboard.js script tag');
}

// 3. Fix the batch assignment inside LEADS_DATA:
// All 50 verified South Florida leads should belong to Batch 1 (Palm Beach & Broward / South FL) so picking Batch 1 displays all 50!
const leadsRegex = /const\s+LEADS_DATA\s*=\s*(\[[\s\S]*?\]);\s*\n/;
const match = cleanHtml.match(leadsRegex);
if (match) {
  const leads = JSON.parse(match[1]);
  leads.forEach((l, idx) => {
    l.batch = 1; // All verified Florida leads are in Batch 1: South Florida
  });
  cleanHtml = cleanHtml.replace(leadsRegex, `const LEADS_DATA = ${JSON.stringify(leads, null, 2)};\n`);
  console.log(`Updated all ${leads.length} leads to batch = 1`);
} else {
  console.error('Could not find LEADS_DATA in cleanHtml');
}

// 4. Update the batchSelect dropdown options to accurately describe the leads
const oldBatchSelectRegex = /<select id="batchSelect"[\s\S]*?<\/select>/;
const newBatchSelectHtml = `<select id="batchSelect" class="custom-select" style="font-weight:700">
                <option value="all" selected>📋 All 50 Verified Contractors (1–10 Employees · Real Phones)</option>
                <option value="1">☀️ Batch 1: South Florida Hub (Palm Beach & Broward · 50 Verified Leads)</option>
                <option value="today100">🔥 Priority Uncalled Dispatch Queue</option>
              </select>`;

if (oldBatchSelectRegex.test(cleanHtml)) {
  cleanHtml = cleanHtml.replace(oldBatchSelectRegex, newBatchSelectHtml);
  console.log('Updated batchSelect dropdown HTML');
}

// 5. Ensure default currentBatch is 'all' so all leads show immediately without clipping
cleanHtml = cleanHtml.replace("let currentBatch = 'today100';", "let currentBatch = 'all';");
cleanHtml = cleanHtml.replace("let leadPageSize = 15;", "let leadPageSize = 50;");
cleanHtml = cleanHtml.replace("let leadPageSize = 25;", "let leadPageSize = 50;");

fs.writeFileSync(arenaPath, cleanHtml, 'utf8');
console.log(`Cleaned and saved ${arenaPath}. New length: ${cleanHtml.length}`);
