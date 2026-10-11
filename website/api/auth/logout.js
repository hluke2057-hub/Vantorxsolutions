const { clearSessionCookies, jsonError, methodNotAllowed } = require("../_lib/supabase");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    clearSessionCookies(res);
    return res.status(200).json({ ok: true });
  } catch (err) { return jsonError(res, err); }
};
