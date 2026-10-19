/**
 * Resend Email Dispatch Helper for VantorX Solutions
 */

async function sendEmail({ to, subject, html, text, from = "Luke <luke@vantorxsolutions.com>", replyTo = null }) {
  const apiKey = process.env.RESEND_API_KEY;
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
      return { ok: false, error: data.message || "Email dispatch failed" };
    }

    return { ok: true, id: data.id };
  } catch (err) {
    console.error("[VantorX Email Exception]", err.message);
    return { ok: false, error: err.message };
  }
}

module.exports = { sendEmail };
