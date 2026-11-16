const fs = require("fs");
const path = require("path");

const files = [
  path.resolve(__dirname, "..", "website", "cold-call-arena", "index.html"),
  path.resolve(__dirname, "..", "website", "cold-call-arena", "international-vault.html")
];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, "utf8");

  // Add header button
  if (!content.includes('id="btnOpenDeliveryDashboard"')) {
    content = content.replace(
      /(<button class="btn btn-ghost btn-sm" id="btnSyncTeamCalls"[\s\S]*?<\/button>)/,
      `$1\n      <button class="btn btn-ghost btn-sm" id="btnOpenDeliveryDashboard" onclick="openDeliveryDashboardModal()" style="border:1.5px solid rgba(16,185,129,0.5);color:#34d399;font-size:12px;font-weight:700;display:inline-flex;align-items:center;gap:6px;background:rgba(16,185,129,0.1);cursor:pointer" title="View live Resend deliverability metrics, bounce rates, and suppression guard">\n        <span>📊</span> Resend Deliverability\n      </button>`
    );
    console.log(`Added btnOpenDeliveryDashboard to ${path.basename(filePath)}`);
  }

  fs.writeFileSync(filePath, content, "utf8");
}