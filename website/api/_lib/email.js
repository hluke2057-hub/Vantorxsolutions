const fs = require("fs");
const path = require("path");

function getResendKey() {
  if (process.env.RESEND_API_KEY) return process.env.RESEND_API_KEY.trim();
  const candidateDirs = [
    process.cwd(),
    path.resolve(__dirname, "..", ".."),
    path.resolve(__dirname, "..", "..", ".."),
  ];
  for (const dir of candidateDirs) {
    const envFile = path.join(dir, ".env");
    if (fs.existsSync(envFile)) {
      try {
        const content = fs.readFileSync(envFile, "utf8");
        const match = content.match(/RESEND_API_KEY\s*=\s*([^\r\n]+)/);
        if (match && match[1]) return match[1].trim();
      } catch (_) {}
    }
  }
  return null;
}

async function sendEmail({ to, subject, html, text, from = "Luke <luke@vantorxsolutions.com>", replyTo = null }) {
  const apiKey = getResendKey();
  if (!apiKey) {
    console.warn("[VantorX Email] RESEND_API_KEY environment variable is not configured. Email not sent.");
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const payload = {
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html: html || undefined,
    text: text || undefined,
  };

  if (replyTo) {
    payload.reply_to = replyTo;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("[VantorX Email Error]", data);

      // Graceful Fallback: If custom domain vantorxsolutions.com DNS is pending verification in Resend,
      // retry with Resend's verified onboarding sender so alerts to hluke2057@gmail.com are never dropped.
      const errMsg = (data.message || "").toLowerCase();
      if (from !== "onboarding@resend.dev" && (errMsg.includes("domain") || errMsg.includes("verify") || errMsg.includes("from"))) {
        console.warn("[VantorX Email] Retrying dispatch with fallback verified sender onboarding@resend.dev...");
        payload.from = "VantorX Notifications <onboarding@resend.dev>";
        const fallbackTo = (Array.isArray(payload.to) ? payload.to : [payload.to])
          .filter(addr => addr.toLowerCase().includes("hluke2057@gmail.com"));
        payload.to = fallbackTo.length ? fallbackTo : ["hluke2057@gmail.com"];
        try {
          const retryRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          const retryData = await retryRes.json();
          if (retryRes.ok) {
            console.log("[VantorX Email] Fallback dispatch succeeded:", retryData.id);
            return { ok: true, id: retryData.id, fallback: true };
          }
        } catch(retryErr) {
          console.error("[VantorX Email Fallback Exception]", retryErr.message);
        }
      }

      return { ok: false, error: data.message || "Email dispatch failed" };
    }

    return { ok: true, id: data.id };
  } catch (err) {
    console.error("[VantorX Email Exception]", err.message);
    return { ok: false, error: err.message };
  }
}

module.exports = { sendEmail };
