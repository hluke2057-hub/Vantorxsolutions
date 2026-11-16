const fs = require("fs");
const path = require("path");

const notifPath = path.resolve(__dirname, "..", "website", "api", "notifications.js");
let content = fs.readFileSync(notifPath, "utf8");

content = content.replace(
  /const result = await sendEmail\(\{[\s\S]*?replyTo: "Luke Hamilton <luke@vantorxsolutions\.com>"[\s\S]*?\}\);[\s\S]*?if \(!result\.ok\) \{[\s\S]*?return res\.status\(502\)\.json\(\{[\s\S]*?error: result\.error \|\| "Failed to dispatch email through VantorX email gateway\."[\s\S]*?\}\);[\s\S]*?\}/m,
  `const result = await sendEmail({
        to,
        subject,
        text: emailBody,
        html: htmlFormatted,
        from: fromAddress,
        replyTo: "Luke Hamilton <luke@vantorxsolutions.com>",
        businessName: businessName || null,
        source: source || "arena_app"
      });

      if (!result.ok) {
        const statusCode = result.suppressed ? 403 : (result.unverified ? 422 : 502);
        return res.status(statusCode).json({
          ok: false,
          error: result.error || "Failed to dispatch email through VantorX email gateway.",
          suppressed: Boolean(result.suppressed),
          unverified: Boolean(result.unverified)
        });
      }`
);

fs.writeFileSync(notifPath, content, "utf8");
console.log("Successfully patched website/api/notifications.js");