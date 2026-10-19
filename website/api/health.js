/**
 * VantorX backend readiness probe.
 *
 * Vercel serves this function at /api/health because the Vercel project root
 * is the website/ directory. It deliberately reports only whether required
 * environment variables exist; it never returns their values.
 */
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  let validUrl = false;
  if (supabaseUrl) {
    try {
      const parsed = new URL(supabaseUrl);
      validUrl = parsed.protocol === "https:" && parsed.hostname.endsWith(".supabase.co");
    } catch (_) {
      validUrl = false;
    }
  }

  const configured = Boolean(validUrl && publishableKey);
  const payload = {
    ok: configured,
    service: "vantorx-api",
    checks: {
      supabase_url_configured: validUrl,
      supabase_publishable_key_configured: Boolean(publishableKey),
      resend_api_key_configured: Boolean(process.env.RESEND_API_KEY),
    },
    message: configured
      ? "Backend environment is configured."
      : "Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in Vercel Project Settings.",
  };

  return res.status(configured ? 200 : 503).json(payload);
};
