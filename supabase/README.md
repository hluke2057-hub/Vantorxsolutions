# VantorX Supabase setup

This folder starts the shared database layer for VantorX apps.

## Apply the schema

1. Open the VantorX project in the Supabase dashboard.
2. Open **SQL Editor**.
3. Open `migrations/202610100001_initial_platform_schema.sql` in this repository.
4. Paste the SQL into a new SQL Editor query and run it once.
5. Confirm the tables exist under **Table Editor**.

Do not put a database password, service-role key, or secret key in this repository or in browser JavaScript.

## Current scope

The initial migration defines shared business/user membership, receptionist settings, services, business hours, appointments, calls, leads, change requests, notifications, onboarding drafts, and audit records. Row Level Security is enabled, with business membership checks on business data.

## Important: this is the database foundation, not a finished backend

The current web apps expect same-origin `/api/*` endpoints and cookie-based sessions. Creating these tables alone does not implement those endpoints, login/session compatibility, receptionist calling/AI integrations, or go-live workflows. Those must be built and tested before the apps can safely use this database in production.

Business creation must also create the first owner membership in a trusted, atomic server-side operation. Do not solve this by allowing a browser to grant itself owner/admin privileges.

## Frontend configuration

The Supabase Project URL and publishable key are suitable for browser configuration, but the publishable key is not authorization. Access is controlled by authenticated sessions and the RLS policies. Never put a service-role/secret key in a client app.
