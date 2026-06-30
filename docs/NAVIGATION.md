# Plantasonic Navigation — Platform Reference Application

Authoritative navigation model for the Plantasonic reference application (v0.4.0).

---

## Dual-mode routing

| Mode | Hash route | Shell | Engines |
| ---- | ---------- | ----- | ------- |
| **Reference** | `#overview` (default), `#design-system`, … | Platform reference sidebar | Not loaded |
| **Instrument** | `#instrument` | Platform instrument shell | Lazy-loaded via `mountInstrumentApp()` |

Implementation: `src/platform-reference/router.ts`

---

## Reference sections

| Group | Sections |
| ----- | -------- |
| Platform | Overview |
| Foundation | Design System, Theme System, Components, Templates |
| Engines | Audio, ASCII, Visual, Video, MIDI |
| Workflow | AI Workflow, Developer Tools, Settings, Documentation |
| Reference | Live Instrument (launches instrument route) |

---

## Instrument mode

When the user navigates to `#instrument`:

1. Reference shell unmounts
2. `createPlantasonicPlatformApp()` boots via `@plantasonic/platform-demo/instrument-app`
3. A slim chrome bar provides **← Platform Overview** back link
4. Full instrument workspace unchanged from v0.3.0

Instrument navigation (transport, preset browser, inspector) is owned by `@plantasonic/platform` and the design system instrument shell — not reimplemented in this app.

---

## Design intent

**Reference mode** — educate visitors about the platform: inheritance model, themes, AI workflow, engines, and tooling.

**Instrument mode** — demonstrate the living digital ecosystem. Navigation feels like a hardware synthesizer control surface, not an admin dashboard.

See [docs/USER_EXPERIENCE.md](./USER_EXPERIENCE.md) for instrument interaction philosophy.

---

## Configuration

| Concern | Location |
| ------- | -------- |
| Reference nav catalog | `src/platform-reference/catalog.ts` |
| Section content | `src/platform-reference/sections/` |
| Instrument shell config | `src/platform-consumer/config/shellConfig.ts` |
| Branding copy | `src/platform-consumer/content/branding.ts` |

---

## Historical note

Prior to v0.4.0, the app booted directly into instrument mode with empty `navigation.groups`. The reference application reorganization added platform sections without changing engine or shell architecture.
