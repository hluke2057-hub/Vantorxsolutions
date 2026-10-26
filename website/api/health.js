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
  let supabaseActive = false;
  let supabaseLatencyMs = null;
  let supabaseError = null;

  if (validUrl && publishableKey) {
    const startTime = Date.now();
    try {
      const targetUrl = supabaseUrl.replace(/\/+$/, "") + "/rest/v1/";
      const headers = { apikey: publishableKey };
      if (publishableKey.startsWith("ey")) {
        headers.Authorization = `Bearer ${publishableKey}`;
      }
      const sbRes = await fetch(targetUrl, {
        method: "GET",
        headers,
      });
      supabaseLatencyMs = Date.now() - startTime;
      supabaseActive = sbRes.ok;
      if (!sbRes.ok) {
        const text = await sbRes.text().catch(() => "");
        supabaseError = `HTTP ${sbRes.status} ${sbRes.statusText}${text ? ': ' + text.slice(0, 120) : ''}`;
      }
    } catch (err) {
      supabaseLatencyMs = Date.now() - startTime;
      supabaseActive = false;
      supabaseError = err.message;
    }
  }

  const payload = {
    ok: configured,
    service: "vantorx-api",
    checks: {
      supabase_url_configured: validUrl,
      supabase_publishable_key_configured: Boolean(publishableKey),
      supabase_active: supabaseActive,
      supabase_latency_ms: supabaseLatencyMs,
      supabase_error: supabaseError,
      resend_api_key_configured: Boolean(process.env.RESEND_API_KEY),
    },
    message: configured
      ? (supabaseActive ? "Backend environment and Supabase database are fully operational." : "Backend configured; Supabase database may be sleeping or restoring.")
      : "Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in Vercel Project Settings.",
  };

  return res.status(configured ? 200 : 503).json(payload);
};
