const { verifyEmail } = require("./verifier");

// Decision-maker title patterns to search for
const EXECUTIVE_ROLES = [
  "owner",
  "founder",
  "co-founder",
  "president",
  "vice president",
  "ceo",
  "coo",
  "general manager",
  "gm",
  "operations manager",
  "managing partner",
  "principal",
  "director"
];

// Regex for extracting emails from HTML
const EMAIL_REGEX = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+/g;

// Clean and normalize URLs
function normalizeUrl(url) {
  if (!url) return null;
  let clean = url.trim();
  if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
    clean = "https://" + clean;
  }
  return clean;
}

/**
 * Extract legitimate email addresses and decision makers from official business website
 */
async function discoverFromWebsite(websiteUrl) {
  const normUrl = normalizeUrl(websiteUrl);
  if (!normUrl) return { found: false, candidates: [] };

  const candidates = [];
  const visitedUrls = new Set();
  const domain = new URL(normUrl).hostname.replace(/^www\./, "");

  const pagesToScrape = [
    normUrl,
    `${normUrl.replace(/\/$/, "")}/contact`,
    `${normUrl.replace(/\/$/, "")}/contact-us`,
    `${normUrl.replace(/\/$/, "")}/about`,
    `${normUrl.replace(/\/$/, "")}/about-us`,
    `${normUrl.replace(/\/$/, "")}/team`,
    `${normUrl.replace(/\/$/, "")}/our-team`
  ];

  for (const pageUrl of pagesToScrape) {
    if (visitedUrls.has(pageUrl)) continue;
    visitedUrls.add(pageUrl);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(pageUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) continue;
      const html = await res.text();

      // Extract mailto: links first (highest confidence)
      const mailtoMatches = html.matchAll(/href=["']mailto:([^"?#\s]+)["']/gi);
      for (const match of mailtoMatches) {
        const rawEmail = match[1].trim().toLowerCase();
        if (rawEmail && !candidates.some(c => c.email === rawEmail)) {
          candidates.push({
            email: rawEmail,
            sourceUrl: pageUrl,
            method: "mailto_link",
            confidence: rawEmail.endsWith(domain) ? "High" : "Medium"
          });
        }
      }

      // Extract standard emails from text
      const textMatches = html.match(EMAIL_REGEX) || [];
      for (const rawEmail of textMatches) {
        const clean = rawEmail.toLowerCase().trim();
        // Ignore assets/images/fonts
        if (clean.endsWith(".png") || clean.endsWith(".jpg") || clean.endsWith(".svg") || clean.endsWith(".webp") || clean.endsWith(".js") || clean.endsWith(".css")) {
          continue;
        }
        if (!candidates.some(c => c.email === clean)) {
          candidates.push({
            email: clean,
            sourceUrl: pageUrl,
            method: "page_text_extraction",
            confidence: clean.endsWith(domain) ? "High" : "Medium"
          });
        }
      }

      // If we found candidates from this primary page, we can break or continue checking
      if (candidates.length >= 3) break;
    } catch (_) {
      // Ignore network errors on individual subpages
    }
  }

  // Verify discovered candidates
  const verifiedCandidates = [];
  for (const c of candidates) {
    const ver = await verifyEmail(c.email);
    if (ver.status === "VALID") {
      verifiedCandidates.push({
        ...c,
        verification: ver,
        decisionMakerTitle: c.isRole ? "Company Desk" : "Public Representative"
      });
    }
  }

  return {
    found: verifiedCandidates.length > 0,
    domain,
    website: normUrl,
    candidates: verifiedCandidates
  };
}

/**
 * Discover emails via Hunter.io Domain Search API (if HUNTER_API_KEY is configured)
 */
async function discoverFromHunter(domain) {
  const hunterKey = process.env.HUNTER_API_KEY;
  if (!hunterKey || !domain) return { found: false, candidates: [] };

  try {
    const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    const res = await fetch(`https://api.hunter.io/v2/domain-search?domain=${encodeURIComponent(cleanDomain)}&api_key=${hunterKey}&limit=10`);
    if (!res.ok) return { found: false, candidates: [] };

    const data = await res.json();
    const emails = data?.data?.emails || [];
    const candidates = [];

    for (const item of emails) {
      if (!item.value) continue;
      const title = (item.position || "").toLowerCase();
      const isExec = EXECUTIVE_ROLES.some(r => title.includes(r));

      candidates.push({
        email: item.value.toLowerCase(),
        firstName: item.first_name || "",
        lastName: item.last_name || "",
        fullName: [item.first_name, item.last_name].filter(Boolean).join(" "),
        position: item.position || "Staff",
        isDecisionMaker: isExec,
        confidence: item.confidence,
        sourceUrl: item.sources?.[0]?.uri || `https://hunter.io/domain-search/${cleanDomain}`,
        method: "hunter_domain_search"
      });
    }

    // Sort decision makers first
    candidates.sort((a, b) => (b.isDecisionMaker ? 1 : 0) - (a.isDecisionMaker ? 1 : 0));

    return {
      found: candidates.length > 0,
      candidates
    };
  } catch (err) {
    console.warn("[Discovery] Hunter.io domain search error:", err.message);
    return { found: false, candidates: [] };
  }
}

/**
 * Unified discovery pipeline: checks Hunter first (if key configured), then scrapes website
 */
async function discoverBusinessEmail({ website, domain, companyName }) {
  const targetDomain = domain || (website ? website.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] : "");

  // 1. Check Hunter.io Domain Search
  if (targetDomain && process.env.HUNTER_API_KEY) {
    const hunterResult = await discoverFromHunter(targetDomain);
    if (hunterResult.found && hunterResult.candidates.length > 0) {
      for (const cand of hunterResult.candidates) {
        const ver = await verifyEmail(cand.email);
        if (ver.status === "VALID") {
          return {
            found: true,
            email: cand.email,
            contactName: cand.fullName,
            title: cand.position,
            source: cand.method,
            sourceUrl: cand.sourceUrl,
            verificationStatus: "VALID",
            company: companyName
          };
        }
      }
    }
  }

  // 2. Direct Website Discovery & Verification
  if (website) {
    const webResult = await discoverFromWebsite(website);
    if (webResult.found && webResult.candidates.length > 0) {
      const best = webResult.candidates[0];
      return {
        found: true,
        email: best.email,
        contactName: best.fullName || "",
        title: best.decisionMakerTitle || "Contact Representative",
        source: "official_website",
        sourceUrl: best.sourceUrl,
        verificationStatus: "VALID",
        company: companyName
      };
    }
  }

  // Never fabricate
  return {
    found: false,
    email: null,
    reason: "No verified public business email discovered. Synthetic fallback prevented."
  };
}

module.exports = {
  discoverFromWebsite,
  discoverFromHunter,
  discoverBusinessEmail,
  EXECUTIVE_ROLES
};