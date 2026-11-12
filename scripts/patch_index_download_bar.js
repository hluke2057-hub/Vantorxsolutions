const fs = require('fs');
const p = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/website/instagram-package/index.html';
let content = fs.readFileSync(p, 'utf8');

const oldBlock = `  <!-- MASTER DOWNLOAD BAR -->
  <div class="master-download-card">
    <div class="master-info">
      <h2>
        <span>📥</span>
        <span>Download Complete 15-Picture Package</span>
      </h2>
      <p>Includes all 5 Highlight categories (Packages, AVA, Custom Website, AEO Engine, LeadFlow) in 1080×1920 HD PNG format.</p>
    </div>
    <div class="master-actions">
      <a href="VantorX_Instagram_Highlights_Complete_Package.zip" download="VantorX_Instagram_Highlights_Complete_Package.zip" class="btn btn-gold">
        <span>📦</span>
        <span>Download Complete Package (.ZIP — 7.1 MB)</span>
      </a>
      <button type="button" onclick="downloadAll15Sequentially()" class="btn btn-emerald">
        <span>📲</span>
        <span>Download All 15 PNGs Directly</span>
      </button>
      <button type="button" onclick="shareOrSendPackage()" class="btn btn-outline" id="btnNativeShare">
        <span>📤</span>
        <span>Send / Share to Phone</span>
      </button>
    </div>
  </div>`;

const newBlock = `  <!-- MASTER DOWNLOAD BAR -->
  <div class="master-download-card">
    <div class="master-info">
      <h2>
        <span>📥</span>
        <span>Download Complete Instagram Bundle</span>
      </h2>
      <p>Includes all 8 Clean Circle-Safe Covers (1080×1080), all 15 Core Story Highlights (1080×1920), 21 Product Carousels, and Brand Logos in uncompressed HD PNG format.</p>
    </div>
    <div class="master-actions">
      <a href="VantorX_Instagram_Highlights_Complete_Package.zip" download="VantorX_Instagram_Highlights_Complete_Package.zip" class="btn btn-gold">
        <span>📦</span>
        <span>Download Complete Master Bundle (.ZIP — 20.8 MB)</span>
      </a>
      <a href="VantorX_Clean_IG_Highlight_Covers.zip" download="VantorX_Clean_IG_Highlight_Covers.zip" class="btn btn-emerald" style="border:1.5px solid rgba(16,185,129,0.7);background:rgba(16,185,129,0.22);color:#34d399">
        <span>🎨</span>
        <span>Download 8 Clean Covers Only (.ZIP — 3.2 MB)</span>
      </a>
      <button type="button" onclick="downloadAll15Sequentially()" class="btn btn-outline">
        <span>📲</span>
        <span>Save All 15 Story PNGs</span>
      </button>
      <button type="button" onclick="downloadAllCovers()" class="btn btn-outline">
        <span>✨</span>
        <span>Save All 8 Covers PNGs</span>
      </button>
    </div>
  </div>`;

// Normalize CRLF to LF for match
const normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedOld = oldBlock.replace(/\r\n/g, '\n');
const normalizedNew = newBlock.replace(/\r\n/g, '\n');

if (normalizedContent.includes(normalizedOld)) {
  const updated = normalizedContent.replace(normalizedOld, normalizedNew);
  fs.writeFileSync(p, updated, 'utf8');
  console.log('Successfully updated index.html!');
} else {
  console.error('Could not find old block in index.html');
}
