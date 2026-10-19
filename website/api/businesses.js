const { getSession, supabaseRequest, jsonError, methodNotAllowed } = require("./_lib/supabase");

async function resolveBusinessId(session, requestedId) {
  if (requestedId && typeof requestedId === "string" && requestedId.trim()) {
    return requestedId.trim();
  }
  try {
    const members = await supabaseRequest(
      `/rest/v1/business_members?select=business_id&user_id=eq.${encodeURIComponent(session.user.id)}&order=created_at.desc&limit=1`,
      { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return Array.isArray(members) && members[0] && members[0].business_id ? members[0].business_id : null;
  } catch (_) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET" && req.method !== "POST" && req.method !== "PATCH") {
    return methodNotAllowed(res, ["GET", "POST", "PATCH"]);
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
    }

    if (req.method === "PATCH") {
      const body = req.body || {};
      const bizId = req.query && req.query.id ? req.query.id : (await resolveBusinessId(session, body.id));
      if (!bizId) {
        return res.status(400).json({ ok: false, error: "Business ID is required." });
      }
      const patch = {};
      if (typeof body.name === "string") patch.name = body.name.trim();
      if (typeof body.phone === "string") patch.phone = body.phone.trim();
      if (typeof body.email === "string") patch.email = body.email.trim();
      if (typeof body.website === "string") patch.website = body.website.trim();
      if (typeof body.timezone === "string") patch.timezone = body.timezone.trim();

      try {
        await supabaseRequest(`/rest/v1/businesses?id=eq.${encodeURIComponent(bizId)}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${session.accessToken}` },
          body: JSON.stringify(patch),
        });
      } catch (_) {}

      return res.status(200).json({ ok: true, id: bizId, ...patch });
    }
  } catch (err) {
    return jsonError(res, err);
  }
};
