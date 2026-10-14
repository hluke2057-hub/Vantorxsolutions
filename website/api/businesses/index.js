const { getSession, supabaseRequest, jsonError, methodNotAllowed } = require("../_lib/supabase");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET" && req.method !== "POST") {
    return methodNotAllowed(res, ["GET", "POST"]);
  }

  try {
    const session = await getSession(req, res);
    if (!session) {
      return res.status(401).json({ ok: false, error: "Authentication required." });
    }

    if (req.method === "GET") {
      const data = await supabaseRequest(
        "/rest/v1/businesses?select=id,name,slug,timezone,phone,email,website,created_at,business_members(role,user_id)&order=created_at.desc",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      const rows = (Array.isArray(data) ? data : []).map((b) => {
        const members = Array.isArray(b.business_members) ? b.business_members : [];
        const myMember = members.find((m) => m.user_id === session.user.id) || members[0] || {};
        return {
          id: b.id,
          name: b.name,
          slug: b.slug,
          timezone: b.timezone,
          phone: b.phone || "",
          email: b.email || "",
          website: b.website || "",
          role: myMember.role || "owner",
          createdAt: b.created_at,
        };
      });

      return res.status(200).json({ ok: true, rows });
    }

    // POST - create business
    const body = req.body || {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    const timezone = typeof body.timezone === "string" ? body.timezone.trim() : "America/New_York";
    if (name.length < 2 || name.length > 160) {
      return res.status(400).json({ ok: false, error: "Business name must be between 2 and 160 characters." });
    }
    if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return res.status(400).json({ ok: false, error: "Slug may contain lowercase letters, numbers, and single hyphens." });
    }
    if (timezone.length > 80) {
      return res.status(400).json({ ok: false, error: "Invalid timezone." });
    }

    const businessId = await supabaseRequest("/rest/v1/rpc/create_business_with_owner", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.accessToken}` },
      body: JSON.stringify({ business_name: name, business_slug: slug || null, business_timezone: timezone }),
    });

    return res.status(201).json({ ok: true, businessId });
  } catch (err) {
    return jsonError(res, err);
  }
};
