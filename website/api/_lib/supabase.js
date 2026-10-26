const COOKIE_ACCESS = "vx_access";
const COOKIE_REFRESH = "vx_refresh";

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    const err = new Error("Backend is not configured");
    err.status = 503;
    throw err;
  }
  return { url: url.replace(/\/+$/, ""), key };
}

function parseCookies(req) {
  const raw = req.headers.cookie || "";
  return Object.fromEntries(raw.split(";").map((part) => {
    const i = part.indexOf("=");
    return i < 0 ? ["", ""] : [part.slice(0, i).trim(), decodeURIComponent(part.slice(i + 1).trim())];
  }).filter(([k]) => k));
}

function cookie(name, value, maxAge) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${name}=${encodeURIComponent(value || "")}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function setSessionCookies(res, session) {
  const access = session.access_token || "";
  const refresh = session.refresh_token || "";
  const expires = Math.max(0, Number(session.expires_in) || 3600);
  res.setHeader("Set-Cookie", [
    cookie(COOKIE_ACCESS, access, expires),
    cookie(COOKIE_REFRESH, refresh, 60 * 60 * 24 * 30),
  ]);
}

function clearSessionCookies(res) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", [
    `${COOKIE_ACCESS}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`,
    `${COOKIE_REFRESH}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`,
  ]);
}

async function supabaseRequest(path, options = {}) {
  const { url, key } = config();
  const fetchOptions = {
    ...options,
    headers: {
      apikey: key,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };
  if (fetchOptions.body && typeof fetchOptions.body === "object") {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }
  const response = await fetch(url + path, fetchOptions);
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch (_) { data = { message: "Invalid response from authentication service" }; }
  if (!response.ok) {
    const err = new Error(data.msg || data.message || data.error_description || data.error || "Supabase request failed");
    err.status = response.status;
    throw err;
  }
  return data;
}

async function getSession(req, res) {
  const cookies = parseCookies(req);
  let access = cookies[COOKIE_ACCESS];
  if (access) {
    try {
      const user = await supabaseRequest("/auth/v1/user", { headers: { Authorization: `Bearer ${access}` } });
      return { accessToken: access, user };
    } catch (err) {
      if (![401, 403].includes(err.status)) throw err;
    }
  }

  const refresh = cookies[COOKIE_REFRESH];
  if (!refresh) return null;
  try {
    const session = await supabaseRequest("/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refresh }),
    });
    setSessionCookies(res, session);
    return { accessToken: session.access_token, user: session.user };
  } catch (_) {
    clearSessionCookies(res);
    return null;
  }
}

function jsonError(res, err) {
  const status = Number(err.status) >= 400 && Number(err.status) < 600 ? Number(err.status) : 500;
  const message = status === 500 ? "Unexpected server error" : err.message;
  return res.status(status).json({ ok: false, error: message });
}

function methodNotAllowed(res, allowed) {
  res.setHeader("Allow", allowed.join(", "));
  return res.status(405).json({ ok: false, error: "Method not allowed" });
}

module.exports = { config, supabaseRequest, parseCookies, setSessionCookies, clearSessionCookies, getSession, jsonError, methodNotAllowed };
