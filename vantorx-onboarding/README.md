# VantorX Onboarding

The client-setup wizard for the VantorX suite — rebuilt to the same standard as LeadFlow, Client Hub, and Admin.

**Main file:** `onboarding-app.html` — fully self-contained (no server, no internet). Double-click to run, email it, or host it anywhere.

## The 8 steps

1. **Business** — contact details + industry picker (presets load sample services)
2. **Services & pricing** — editable rows, tap-to-add industry suggestions
3. **Hours & policies** — per-day open/close with toggles, cancellation/walk-in/payment policies
4. **Knowledge** — FAQ editor with one-tap starter questions per industry
5. **AI setup** — name, personality, greeting (auto-generator), transfer rules + a **live test-call simulator** that answers from the real draft data
6. **Connections** — Calendar, phone, LeadFlow, Client Hub toggles (demo only)
7. **Pre-launch checklist** — six go-live tests with progress counter
8. **Review & go live** — summary cards + "Mark ready for launch"

## Notes

- **Autosave** — every field persists to localStorage as you type; close the tab and resume anytime.
- **Reset demo** — header button wipes the draft back to step 1 (with confirmation).
- **Demo only** — nothing is provisioned or sent anywhere.

## Rebuilding after edits

```
powershell -ExecutionPolicy Bypass -File build-bundle.ps1
```

Edit the source in `js/` (`state.js` = data model, `js/steps/` = one file per wizard section), then rebuild. The bundler inlines the CSS and JS into `onboarding-app.html` with UTF-8 encoding.
