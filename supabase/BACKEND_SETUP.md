# VantorX API foundation

The Vercel project uses `website/` as its Root Directory, so serverless functions must live under `website/api/`. This keeps the existing website entry point intact while adding API routes at the same origin.

## First endpoint

- `GET /api/health` reports whether the required Supabase environment variables are configured.
- It never returns key values.
- It returns HTTP 503 until both variables are set; this is expected before configuration.

## Configure Vercel

In the Vercel project **Vantorxsolutions**, open **Settings → Environment Variables** and add these variables for Preview and Production (and Development if desired):

- `SUPABASE_URL` = your Supabase project URL, e.g. `https://YOUR_PROJECT_REF.supabase.co`
- `SUPABASE_PUBLISHABLE_KEY` = the Supabase publishable key (safe for server configuration; do not commit it)

Use the publishable key, not a service-role/secret key. Never put service-role keys in browser JavaScript. Redeploy after saving environment variables, then visit `/api/health`.

## Current scope

This is only the backend deployment/readiness foundation. It does not yet implement authentication, cookie sessions, or the app-specific API routes. Those must be added and tested before the apps can be considered connected to Supabase or production-ready.
