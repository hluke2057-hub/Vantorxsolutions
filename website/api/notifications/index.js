const { getSession, supabaseRequest, jsonError, methodNotAllowed } = require("../_lib/supabase");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET" && req.method !== "PUT" && req.method !== "POST") {
    return methodNotAllowed(res, ["GET", "PUT", "POST"]);
  }

  try {
    const session = await getSession(req, res);
    if (!session) {
      return res.status(401).json({ ok: false, error: "Authentication required." });
    }

    if (req.method === "GET") {
      const data = await supabaseRequest(
        "/rest/v1/notifications?order=created_at.desc&limit=50",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      const rows = (Array.isArray(data) ? data : []).map((n) => ({
        id: n.id,
        businessId: n.business_id,
        title: n.title,
        body: n.body || "",
        category: n.category || "general",
        at: n.created_at,
        createdAt: n.created_at,
        read: Boolean(n.read_at),
        readAt: n.read_at,
      }));

      return res.status(200).json({ ok: true, rows });
    }

    // PUT/POST - mark read
    const body = req.body || {};
    const notifId = body.id || (req.query && req.query.id);

    if (notifId) {
      await supabaseRequest(`/rest/v1/notifications?id=eq.${encodeURIComponent(notifId)}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ read_at: new Date().toISOString() }),
      });
    } else {
      // Mark all read for this user
      await supabaseRequest(`/rest/v1/notifications?user_id=eq.${encodeURIComponent(session.user.id)}&read_at=is.null`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ read_at: new Date().toISOString() }),
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return jsonError(res, err);
  }
};
