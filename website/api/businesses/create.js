const { getSession, supabaseRequest, jsonError, methodNotAllowed } = require("../_lib/supabase");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    const session = await getSession(req, res);
    if (!session) return res.status(401).json({ ok: false, error: "Sign in before creating a business." });

    const body = req.body || {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    const timezone = typeof body.timezone === "string" ? body.timezone.trim() : "America/New_York";
    if (name.length < 2 || name.length > 160) return res.status(400).json({ ok: false, error: "Business name must be between 2 and 160 characters." });
    if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return res.status(400).json({ ok: false, error: "Slug may contain lowercase letters, numbers, and single hyphens." });
    if (timezone.length > 80) return res.status(400).json({ ok: false, error: "Invalid timezone." });

    const data = await supabaseRequest("/rest/v1/rpc/create_business_with_owner", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.accessToken}` },
      body: JSON.stringify({ business_name: name, business_slug: slug || null, business_timezone: timezone }),
    });
    return res.status(201).json({ ok: true, businessId: data });
  } catch (err) { return jsonError(res, err); }
};
