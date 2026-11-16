const fs = require("fs");
const path = require("path");

const files = [
  path.resolve(__dirname, "..", "website", "cold-call-arena", "index.html"),
  path.resolve(__dirname, "..", "website", "cold-call-arena", "international-vault.html")
];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, "utf8");

  // 1. Add Delivery Dashboard button next to Domain Info in the modal
  const domainBtn = `<button type="button" class="btn btn-ghost btn-xs" onclick="openVantorXEmailInfoModal()" style="font-size:11px;padding:3px 8px;color:#38bdf8;border:1px solid rgba(56,189,248,0.3);cursor:pointer">🛡️ Domain Info</button>`;
  const dashBtn = `<button type="button" class="btn btn-ghost btn-xs" onclick="openDeliveryDashboardModal()" style="font-size:11px;padding:3px 8px;color:#34d399;border:1px solid rgba(52,211,153,0.3);background:rgba(16,185,129,0.08);cursor:pointer">📊 Delivery Dashboard</button>`;
  
  if (content.includes(domainBtn) && !content.includes("openDeliveryDashboardModal")) {
    content = content.replaceAll(domainBtn, `${domainBtn}\n          ${dashBtn}`);
    console.log(`Added Delivery Dashboard button to modal in ${path.basename(filePath)}`);
  }

  // 2. Add Resend Deliverability button in top header bar
  const syncBtnSnippet = `🔄 Sync Cloud Calls\n      </button>`;
  const headerDeliveryBtn = `🔄 Sync Cloud Calls\n      </button>\n      <button class="btn btn-ghost btn-sm" id="btnOpenDeliveryDashboard" onclick="openDeliveryDashboardModal()" style="border:1.5px solid rgba(16,185,129,0.5);color:#34d399;font-size:12px;font-weight:700;display:inline-flex;align-items:center;gap:6px;background:rgba(16,185,129,0.1);cursor:pointer" title="View live Resend deliverability metrics, bounce rates, and suppression guard">\n        <span>📊</span> Resend Deliverability\n      </button>`;
  
  if (content.includes(syncBtnSnippet) && !content.includes('id="btnOpenDeliveryDashboard"')) {
    content = content.replace(syncBtnSnippet, headerDeliveryBtn);
    console.log(`Added Delivery Dashboard button to header in ${path.basename(filePath)}`);
  }

  // 3. Inject delivery-dashboard.js script tag before the final </body>
  const scriptTag = `<script src="delivery-dashboard.js"></script>\n</body>`;
  if (!content.includes('src="delivery-dashboard.js"')) {
    // Find last </body>
    const lastBodyIdx = content.lastIndexOf("</body>");
    if (lastBodyIdx !== -1) {
      content = content.slice(0, lastBodyIdx) + `<script src="delivery-dashboard.js"></script>\n` + content.slice(lastBodyIdx);
      console.log(`Injected delivery-dashboard.js into ${path.basename(filePath)}`);
    }
  }

  fs.writeFileSync(filePath, content, "utf8");
}