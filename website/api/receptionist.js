const { getSession, supabaseRequest, jsonError, methodNotAllowed } = require("./_lib/supabase");

async function resolveBusinessId(session, requestedId) {
  if (requestedId && typeof requestedId === "string" && requestedId.trim()) {
    return requestedId.trim();
  }
  const members = await supabaseRequest(
    `/rest/v1/business_members?select=business_id&user_id=eq.${encodeURIComponent(session.user.id)}&order=created_at.desc&limit=1`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } }
  );
  return Array.isArray(members) && members[0] && members[0].business_id ? members[0].business_id : null;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET" && req.method !== "PUT" && req.method !== "PATCH") {
    return methodNotAllowed(res, ["GET", "PUT", "PATCH"]);
  }

  try {
    const session = await getSession(req, res);
    if (!session) {
      return res.status(401).json({ ok: false, error: "Authentication required." });
    }

    const bizId = await resolveBusinessId(session, (req.query && req.query.businessId) || (req.body && req.body.businessId));
    if (!bizId) {
      return res.status(400).json({ ok: false, error: "Business ID is required." });
    }

    if (req.method === "GET") {
      const data = await supabaseRequest(
        `/rest/v1/receptionist_configs?business_id=eq.${encodeURIComponent(bizId)}&limit=1`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      const cfg = Array.isArray(data) && data[0] ? data[0] : null;
      return res.status(200).json({
        ok: true,
        businessId: bizId,
        config: cfg || {
          business_id: bizId,
          enabled: false,
          agent_name: "Ava",
          greeting: "Hello, thank you for calling. How can I help you today?",
          instructions: "Help customers book appointments and take messages.",
          voice: "alloy",
          transfer_number: "",
          settings: {},
        },
      });
    }

    // PUT/PATCH - update config
    const body = req.body || {};
    const patch = {};
    if (typeof body.enabled === "boolean") patch.enabled = body.enabled;
    if (typeof body.agent_name === "string") patch.agent_name = body.agent_name.trim();
    if (typeof body.greeting === "string") patch.greeting = body.greeting.trim();
    if (typeof body.instructions === "string") patch.instructions = body.instructions.trim();
    if (typeof body.voice === "string") patch.voice = body.voice.trim();
    if (typeof body.transfer_number === "string") patch.transfer_number = body.transfer_number.trim();
    if (body.settings && typeof body.settings === "object") patch.settings = body.settings;
    patch.updated_by = session.user.id;

    const updated = await supabaseRequest(
      `/rest/v1/receptionist_configs?business_id=eq.${encodeURIComponent(bizId)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(patch),
      }
    );

    return res.status(200).json({ ok: true, config: Array.isArray(updated) ? updated[0] : updated });
  } catch (err) {
    return jsonError(res, err);
  }
};
