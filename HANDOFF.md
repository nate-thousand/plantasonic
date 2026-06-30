# Handoff

**Date:** 2026-06-30  
**Phase:** Platform reference application (v0.4.0)

---

## What was done

### Platform reference application

- [x] Repositioned Plantasonic XYZ as the **official reference application** for the AI First Application Platform
- [x] `src/platform-reference/` — hash router, nav catalog, section renderers
- [x] Default landing `#overview` — platform inheritance, AI workflow, theme demonstration
- [x] Lazy instrument boot on `#instrument` — engines unchanged, `mountInstrumentApp()` preserved
- [x] Sections: Overview, Design System, Theme System, Components, Templates, engines (Audio, ASCII, Visual, Video, MIDI), AI Workflow, Developer Tools, Settings, Documentation, Live Instrument
- [x] Theme slots demonstrated: Default (active), Signal 9, Plantasia, Future Theme — not built
- [x] Updated README, docs/REFERENCE_APP.md, docs/PLATFORM.md, platform.json
- [x] Version bump to 0.4.0

### Prior (v0.3.0)

- [x] Platform SDK migration — thin creative app on `@plantasonic/platform`
- [x] `src/platform-consumer/` — config, branding, preset bundles
- [x] `npm run validate:app` — thin-app architecture guard

---

## Try it

```bash
npm install
npm run dev
```

1. Open http://localhost:5173 — **Platform Overview** loads
2. Browse sections in the sidebar
3. Navigate to **Live Instrument** or `#instrument` for the audiovisual demo
4. Click **← Platform Overview** to return

---

## Verify

```bash
npm run validate:app
npm run verify:integration
npm run lint
npm run build
```

---

## Next steps

- Phase 13 (Release Candidate) — PWA, quickstart polish, v1.0.0
- Phase 11 (Recording & Sharing) — when aligned with creative vision
- Embed or link DS showcase sections for deeper component exploration

---

## Architecture reminder

```text
#overview, #design-system, …  →  platform-reference (no engines)
#instrument                   →  mountInstrumentApp() via platform-consumer
```

Do not reintroduce `src/runtime/`, `src/ui/`, or local engine adapters.
