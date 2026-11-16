const dns = require("dns").promises;
const { isSuppressed, isUnsubscribed } = require("./delivery-store");

// Common disposable / throwaway email domains
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "10minutemail.com",
  "sharklasers.com",
  "trashmail.com",
  "throwawaymail.com",
  "yopmail.com",
  "getnada.com",
  "dispostable.com",
  "fakeinbox.com",
  "mohmal.com",
  "burnermail.io",
  "mytemp.email"
]);

// Known enterprise & cloud email providers by MX signature
function identifyProvider(mxList) {
  const mxStr = (mxList || []).map(m => (m.exchange || "").toLowerCase()).join(" ");
  if (mxStr.includes("google") || mxStr.includes("aspmx") || mxStr.includes("l.google.com")) return "Google Workspace";
  if (mxStr.includes("outlook") || mxStr.includes("protection.outlook.com") || mxStr.includes("office365")) return "Microsoft 365";
  if (mxStr.includes("pphosted") || mxStr.includes("proofpoint")) return "Proofpoint Enterprise";
  if (mxStr.includes("mimecast")) return "Mimecast";
  if (mxStr.includes("cloudflare")) return "Cloudflare Email Routing";
  if (mxStr.includes("zoho")) return "Zoho Mail";
  if (mxStr.includes("secureserver.net")) return "GoDaddy Mail";
  if (mxStr.includes("barracuda")) return "Barracuda Networks";
  return "Custom Business Mail Server";
}

/**
 * Verify a single email address
 * Returns classification: 'VALID' | 'INVALID' | 'ACCEPT-ALL' | 'UNKNOWN' | 'BLOCKED'
 */
async function verifyEmail(email) {
  if (!email || typeof email !== "string") {
    return {
      status: "INVALID",
      valid: false,
      reason: "Missing or non-string email address",
      email: ""
    };
  }

  const cleanEmail = email.trim().toLowerCase();

  // 1. Syntax Validation (RFC 5322 compatible strict check)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(cleanEmail)) {
    return {
      status: "INVALID",
      valid: false,
      reason: "Invalid email syntax format",
      email: cleanEmail
    };
  }

  const [localPart, domain] = cleanEmail.split("@");
  if (!domain || domain.indexOf(".") === -1) {
    return {
      status: "INVALID",
      valid: false,
      reason: "Malformed domain name",
      email: cleanEmail
    };
  }

  // 2. Disposable Email Check
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      status: "INVALID",
      valid: false,
      reason: "Disposable / temporary email domain detected",
      email: cleanEmail,
      domain
    };
  }

  // 3. Suppression & Unsubscribe Check
  const suppressionCheck = isSuppressed(cleanEmail);
  if (suppressionCheck.suppressed) {
    return {
      status: "BLOCKED",
      valid: false,
      reason: `Blocked by suppression engine: ${suppressionCheck.reason}`,
      origin: suppressionCheck.origin,
      suppressedAt: suppressionCheck.suppressedAt,
      email: cleanEmail,
      domain
    };
  }

  if (isUnsubscribed(cleanEmail)) {
    return {
      status: "BLOCKED",
      valid: false,
      reason: "Blocked: Recipient previously unsubscribed / opted-out",
      email: cleanEmail,
      domain
    };
  }

  // 4. Hunter.io API Integration (if API key available)
  const hunterKey = process.env.HUNTER_API_KEY;
  if (hunterKey) {
    try {
      const hunterRes = await fetch(`https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(cleanEmail)}&api_key=${hunterKey}`);
      if (hunterRes.ok) {
        const hData = await hunterRes.json();
        const result = hData?.data?.result;
        if (result === "deliverable") {
          return {
            status: "VALID",
            valid: true,
            score: hData.data.score,
            source: "hunter_api",
            email: cleanEmail,
            domain
          };
        }
        if (result === "undeliverable") {
          return {
            status: "INVALID",
            valid: false,
            reason: "Hunter.io verified address as undeliverable",
            score: hData.data.score,
            source: "hunter_api",
            email: cleanEmail,
            domain
          };
        }
        if (result === "risky") {
          return {
            status: "ACCEPT-ALL",
            valid: false,
            reason: "Hunter.io classified address as risky (accept-all or low confidence)",
            score: hData.data.score,
            source: "hunter_api",
            email: cleanEmail,
            domain
          };
        }
      }
    } catch (err) {
      console.warn("[Verifier] Hunter.io API check encountered error, falling back to DNS MX:", err.message);
    }
  }

  // 5. Native DNS MX Mail Exchanger Verification
  try {
    const mxRecords = await dns.resolveMx(domain);

    if (!mxRecords || mxRecords.length === 0) {
      return {
        status: "INVALID",
        valid: false,
        reason: `Domain '${domain}' has no active MX records configured. Mail cannot be delivered.`,
        email: cleanEmail,
        domain
      };
    }

    // Sort by priority (lowest integer = highest priority)
    mxRecords.sort((a, b) => a.priority - b.priority);
    const provider = identifyProvider(mxRecords);

    // Is role-based account?
    const roleAccounts = ["info", "contact", "support", "sales", "office", "admin", "help", "billing"];
    const isRole = roleAccounts.includes(localPart);

    return {
      status: "VALID",
      valid: true,
      reason: `Active mail exchanger verified via ${provider} (${mxRecords[0].exchange})`,
      provider,
      primaryMx: mxRecords[0].exchange,
      mxCount: mxRecords.length,
      isRoleAccount: isRole,
      email: cleanEmail,
      domain
    };
  } catch (err) {
    if (err.code === "ENOTFOUND" || err.code === "NXDOMAIN" || err.code === "ENODATA") {
      return {
        status: "INVALID",
        valid: false,
        reason: `Domain '${domain}' does not exist or has no DNS mail records (${err.code})`,
        email: cleanEmail,
        domain
      };
    }

    if (err.code === "ETIMEOUT" || err.code === "ECONNREFUSED") {
      return {
        status: "UNKNOWN",
        valid: false,
        reason: `DNS lookup timed out or network error (${err.code}). Address held for retry.`,
        email: cleanEmail,
        domain
      };
    }

    return {
      status: "UNKNOWN",
      valid: false,
      reason: `DNS verification error: ${err.message}`,
      email: cleanEmail,
      domain
    };
  }
}

/**
 * Batch verify multiple email addresses
 */
async function verifyBatch(emails = []) {
  const results = [];
  for (const email of emails) {
    const res = await verifyEmail(email);
    results.push(res);
  }
  return results;
}

module.exports = {
  verifyEmail,
  verifyBatch,
  DISPOSABLE_DOMAINS
};