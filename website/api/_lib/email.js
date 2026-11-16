const fs = require("fs");
const path = require("path");
const { verifyEmail } = require("./verifier");
const {
  isSuppressed,
  isUnsubscribed,
  recordSend,
  addSuppression,
  getMetrics
} = require("./delivery-store");

// Physical business address required by CAN-SPAM Act
const CAN_SPAM_PHYSICAL_ADDRESS = "VantorX Solutions, 1200 S Federal Hwy, Boynton Beach, FL 33435";
const UNSUBSCRIBE_BASE_URL = "https://vantorxsolutions.com/api/email-delivery?action=unsubscribe";

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

/**
 * Append CAN-SPAM compliant footer with physical address and 1-click unsubscribe
 */
function appendCanSpamCompliance(html, text, recipientEmail) {
  const unsubUrl = `${UNSUBSCRIBE_BASE_URL}&email=${encodeURIComponent(recipientEmail)}`;

  const footerText = `\n\n----------------------------------------\n${CAN_SPAM_PHYSICAL_ADDRESS}\nIf you prefer not to receive commercial emails from VantorX Solutions, unsubscribe here: ${unsubUrl}\n`;

  const footerHtml = `
<div style="margin-top: 32px; padding-top: 18px; border-top: 1px solid #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; line-height: 1.5; color: #94a3b8; text-align: left;">
  <p style="margin: 0 0 6px 0;"><strong>VantorX Solutions</strong> &bull; ${CAN_SPAM_PHYSICAL_ADDRESS}</p>
  <p style="margin: 0;">
    You received this outreach because of publicly listed business services for your company.
    <a href="${unsubUrl}" style="color: #64748b; text-decoration: underline; margin-left: 6px;">Unsubscribe / Opt-Out Instantly</a>
  </p>
</div>`;

  return {
    html: html ? `${html}${footerHtml}` : undefined,
    text: text ? `${text}${footerText}` : undefined,
    unsubUrl
  };
}

/**
 * Enterprise Send Email Function
 * Includes pre-send MX verification, suppression guard, CAN-SPAM compliance, and delivery logging.
 */
async function sendEmail({
  to,
  subject,
  html,
  text,
  from = "Luke Hamilton <luke@vantorxsolutions.com>",
  replyTo = "Luke Hamilton <luke@vantorxsolutions.com>",
  businessName = null,
  source = "manual",
  bypassVerification = false
}) {
  const apiKey = getResendKey();
  if (!apiKey) {
    console.warn("[VantorX Email] RESEND_API_KEY environment variable is not configured. Email not sent.");
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  // Handle single recipient or array
  const rawRecipient = Array.isArray(to) ? to[0] : to;
  const recipient = (typeof rawRecipient === "string" ? rawRecipient.trim().toLowerCase() : "");

  if (!recipient || !recipient.includes("@")) {
    console.warn("[VantorX Email] Invalid recipient syntax:", to);
    return { ok: false, error: "Invalid recipient email address syntax" };
  }

  // ============================================================
  // 1. SUPPRESSION & OPT-OUT GUARD (CRITICAL: NEVER RETRY SUPPRESSED)
  // ============================================================
  const suppressionCheck = isSuppressed(recipient);
  if (suppressionCheck.suppressed) {
    console.error(`[VantorX Email Guard] SEND BLOCKED for ${recipient}: ${suppressionCheck.reason}`);
    recordSend({
      id: `suppressed_${Date.now()}`,
      recipient,
      businessName,
      subject,
      sender: from,
      status: "suppressed",
      verificationStatus: "BLOCKED",
      failureReason: suppressionCheck.reason,
      suppressionOrigin: suppressionCheck.origin,
      source
    });
    return {
      ok: false,
      suppressed: true,
      error: `Recipient is in suppression list: ${suppressionCheck.reason}. Send strictly aborted to protect sender reputation.`
    };
  }

  if (isUnsubscribed(recipient)) {
    console.warn(`[VantorX Email Guard] SEND BLOCKED for ${recipient}: Recipient unsubscribed`);
    return {
      ok: false,
      unsubscribed: true,
      error: "Recipient has unsubscribed / opted-out of outreach."
    };
  }

  // ============================================================
  // 2. DELIVERABILITY TRIPWIRE CHECK (BOUNCE / COMPLAINT CIRCUIT BREAKER)
  // ============================================================
  const metrics = getMetrics();
  const isInternalRecipient = recipient.includes("vantorxsolutions.com") || recipient.includes("hluke2057@gmail.com") || recipient.endsWith("@resend.dev");

  if (metrics.tripwireTriggered && !isInternalRecipient) {
    console.error(`[VantorX Email Guard] CIRCUIT BREAKER ACTIVE: High bounce/complaint rate. Sending blocked for ${recipient}`);
    return {
      ok: false,
      circuitBreaker: true,
      error: "Outbound sending paused: Deliverability tripwire triggered (Bounce rate >= 3% or Complaint rate >= 0.1%). Check dashboard."
    };
  }

  // ============================================================
  // 3. PRE-SEND VERIFICATION (SYNTAX, MX RECORD, DISPOSABLE CHECK)
  // ============================================================
  let verificationStatus = "VALID";
  if (!bypassVerification && !recipient.endsWith("@resend.dev") && !isInternalRecipient) {
    const ver = await verifyEmail(recipient);
    verificationStatus = ver.status;

    if (ver.status === "INVALID" || ver.status === "BLOCKED") {
      console.warn(`[VantorX Email Verifier] Pre-send check rejected ${recipient}: ${ver.reason}`);
      recordSend({
        id: `unverified_${Date.now()}`,
        recipient,
        businessName,
        subject,
        sender: from,
        status: "failed",
        verificationStatus: ver.status,
        failureReason: ver.reason,
        source
      });
      return {
        ok: false,
        unverified: true,
        error: `Pre-send verification failed: ${ver.reason}`
      };
    }
  }

  // ============================================================
  // 4. CAN-SPAM COMPLIANCE (PHYSICAL ADDRESS & LIST-UNSUBSCRIBE)
  // ============================================================
  const complianceData = appendCanSpamCompliance(html, text, recipient);
  const unsubUrl = complianceData.unsubUrl;

  const payload = {
    from,
    to: [recipient],
    subject,
    html: complianceData.html,
    text: complianceData.text,
    headers: {
      "List-Unsubscribe": `<${unsubUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
    }
  };

  if (replyTo) {
    payload.reply_to = replyTo;
  }

  // ============================================================
  // 5. RESEND DISPATCH VIA API
  // ============================================================
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
      const errMsg = (data.message || "").toLowerCase();

      // Check if Resend reported address as suppressed or rejected
      const isSuppressedByResend = errMsg.includes("suppressed") || errMsg.includes("suppression") || errMsg.includes("blacklist");
      if (isSuppressedByResend) {
        addSuppression({
          email: recipient,
          reason: `Resend API returned suppression: ${data.message}`,
          origin: "bounce"
        });
      }

      // Record failed attempt
      recordSend({
        id: `fail_${Date.now()}`,
        recipient,
        businessName,
        subject,
        sender: from,
        status: isSuppressedByResend ? "suppressed" : "failed",
        verificationStatus,
        failureReason: data.message || "Resend dispatch rejected",
        suppressionOrigin: isSuppressedByResend ? "bounce" : null,
        source
      });

      return {
        ok: false,
        error: data.message || "Email dispatch failed",
        suppressed: isSuppressedByResend
      };
    }

    // ============================================================
    // 6. RECORD SUCCESSFUL SEND IN DELIVERY STORE
    // ============================================================
    const emailId = data.id;
    recordSend({
      id: emailId,
      recipient,
      businessName,
      subject,
      sender: from,
      status: "sent",
      verificationStatus,
      failureReason: null,
      suppressionOrigin: null,
      source
    });

    return {
      ok: true,
      id: emailId,
      recipient,
      sender: from,
      verificationStatus
    };
  } catch (err) {
    console.error("[VantorX Email Exception]", err.message);
    recordSend({
      id: `err_${Date.now()}`,
      recipient,
      businessName,
      subject,
      sender: from,
      status: "failed",
      verificationStatus,
      failureReason: err.message,
      source
    });
    return { ok: false, error: err.message };
  }
}

module.exports = {
  sendEmail,
  appendCanSpamCompliance,
  CAN_SPAM_PHYSICAL_ADDRESS
};