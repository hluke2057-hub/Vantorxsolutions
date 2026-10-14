# VantorX LeadFlow

**Never Let a Lead Go Cold.**

A client-facing lead follow-up system: CRM, pipeline, automated follow-up sequences, an AI message assistant (demo), appointment tracking, and analytics — in a premium dark/gold SaaS interface.

---

## Running it

Open `index.html` in a modern browser. That's it — no build step, no server required.

> Because the app uses ES modules, it must be served over `http(s)://` (any static server works, e.g. `npx serve`, `python -m http.server`), or opened directly in most browsers. If your browser blocks module loading from `file://`, use the Freebuff preview or a one-line static server.

All data persists in your browser's `localStorage` under the key `vantorx_leadflow_v1`. Nothing leaves your machine.

## Demo mode (honest by design)

- 18 realistic sample leads with notes, activities, scores, follow-ups, and appointments
- SMS/email/AI/calendar **service adapters are simulated locally** and labeled "Demo Mode" everywhere
- No integration is ever shown as live when it is not
- `Settings → Data → Reset demo data` restores the original sample dataset
- `Settings → Data → Export all data (JSON)` dumps the full state

## Project structure

```
leadflow/
├── index.html            # app shell (sidebar, topbar, router root)
├── styles.css            # design system (tokens, components, pages, responsive)
└── js/
    ├── app.js            # router, shell wiring, notifications, shortcuts
    ├── store.js          # state + localStorage persistence + mutations
    ├── seed.js           # demo dataset (leads, activities, automations, …)
    ├── services.js       # future-ready adapters (SMS/email/AI/calendar/import/webhooks)
    ├── components.js     # modal, confirm, toast, empty states, SVG charts, fields
    ├── utils.js          # dates, scoring, CSV, template variables
    └── pages/
        ├── dashboard.js  # metrics, performance chart, follow-ups, hot leads
        ├── leads.js      # CRM table, filters, bulk actions, import/export
        ├── profile.js    # lead profile, notes, timeline, AI assistant, booking
        ├── pipeline.js   # drag-and-drop kanban + follow-up queue
        ├── automations.js# sequence builder + templates with live preview
        ├── insights.js   # activity log, analytics, appointments
        └── config.js     # integrations, settings, onboarding wizard
```

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus global search |
| `N` | Quick add lead |
| `Esc` | Close dialogs |
| `Tab` | Navigate (visible focus rings throughout) |

## Going live later (architecture notes)

Service adapters already isolate every external touchpoint in `js/services.js`:

```js
smsService.send()             // → Twilio
emailService.send()           // → Resend / SendGrid / Gmail
aiMessageService.generate()   // → Claude / OpenAI
calendarService.createBooking() // → Cal.com / Google Calendar
leadImportService.import()    // → CSV / webhook payloads
webhookService.handle()       // → website forms, lead ads, Zapier
```

**Rules for the live version:**

1. **Never put API keys in frontend code.** Provision a small backend (or serverless functions) that holds credentials and exposes narrow endpoints like `POST /api/sms`.
2. Set provider credentials as **environment variables on the server**: `TWILIO_AUTH_TOKEN`, `RESEND_API_KEY`, `AI_API_KEY`, `CAL_API_KEY`, etc. The frontend reads only a non-secret provider name (`VITE_SMS_PROVIDER=twilio`) to pick an adapter.
3. Replace each `demo` branch with a `fetch` to your backend endpoint. The demo branches stay as a fallback so the UI never breaks during rollout.
4. Calendar: implement `calendarService.createBooking` against Cal.com or Google Calendar; the appointments page and data model (`Appointment`) are already shaped for it.
5. Webhooks: point website forms / lead ads at `POST /api/webhooks/lead`; `webhookService.handle()` normalizes payloads into leads.
6. Persistence: swap `store.js`'s `localStorage` layer for API calls — the mutation API (`addLead`, `changeStatus`, `saveAutomation`, …) is already the seam.

## Sales demo flow (60 seconds)

1. **Dashboard** — "Here's what's happening with your leads."
2. Open **Marcus Reed** in Leads.
3. Generate an **AI follow-up message** on his profile.
4. Show **Automations** — the 5-touch sequence.
5. Drag a lead in **Pipeline**.
6. Show **Appointments** and **Analytics** (source conversion).
7. Close: "This system captures every lead, follows up consistently, and shows you exactly what converts."
