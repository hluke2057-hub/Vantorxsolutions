const { getSession, jsonError, methodNotAllowed } = require("../_lib/supabase");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try {
    const session = await getSession(req, res);
    if (!session) return res.status(401).json({ ok: false, authenticated: false, user: null });
    return res.status(200).json({
      ok: true,
      authenticated: true,
      user: { id: session.user.id, email: session.user.email, lastSignInAt: session.user.last_sign_in_at || null },
    });
  } catch (err) { return jsonError(res, err); }
};
