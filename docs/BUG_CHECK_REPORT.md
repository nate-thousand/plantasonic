# Plantasonic Full System Bug Check Report

**Date:** 2026-06-28  
**Scope:** MVP stabilization — audio, visual, design system, interaction, cross-system sync, stress scenarios.

## Confirmed Working

| Area | Status |
|------|--------|
| Engine initialization + audio unlock | Pass (`verify:sound`, `verify:runtime`) |
| Play / Stop transport | Pass — end-to-end via interaction layer |
| Preset loading (5 worlds) | Pass — sound + visual sync (`verify:presets`, `verify:integration`) |
| Performance sliders + tempo | Pass — audio + visual routing |
| MIDI input + learn | Pass (`verify:midi`) |
| Keyboard input | Pass (`verify:keyboard`) |
| Generative mapping | Pass (`verify:generative`) |
| Runtime state sync | Pass (`verify:state`) |
| Visual language + adapter | Pass (`verify:visual`) |
| Design system package import | Pass (`verify:design-system`) |
| Error banner + event bus | Pass |

## Issues Found and Fixed

| ID | Severity | Issue | Fix |
|----|----------|-------|-----|
| BUILD-1 | Critical | `npm run build` failed — `GenerativePreferences` not exported from sound engine root | Use `ConstructorParameters<typeof Generator>[0]` in `generativeValidation.ts` |
| X-1 | Medium | Fullscreen exit overwrote nav status with `Ready` while playing | Emit `viewport:fullscreen`; restore status from runtime on exit |
| A-1 | Medium | Visual `loadPreset` swallowed errors | Rethrow after report; runtime propagates failure |
| T-1 | Medium | No theme switcher — hardcoded `data-theme="dark"` | `AppSettingsStore.theme`, settings UI, `bootstrapDocumentTheme()` |
| STRESS-1 | Medium | Play/stop spam could re-enter transport | Idempotent guards in `runtime.start()` / `runtime.stop()` |
| LINT-1 | Low | ESLint/prettier failures in validation + adapter files | Fixed via code changes + `npm run lint:fix` |

## Known Limitations (Not Fixed — Out of MVP Scope)

| ID | Issue | Notes |
|----|-------|-------|
| P-1 | **Pause not implemented** | Transport is play/stop only; no engine pause API wired |
| PR-1 | **Save preset** | No UI or persistence for user-authored presets |
| PR-2 | **Randomize** | No randomize control in UI |
| W-1 | **6 engine presets unreachable** | Only 5 worlds in browser; engine bundles more species |
| S-1 | **Notes ignored until playing** | By design — `noteOn` requires engine `running` state |
| P-2 | **Play while playing** | Play button remains enabled; runtime now no-ops duplicate start |

## Files Involved in Fixes

- `src/audio/generativeValidation.ts`
- `src/runtime/runtime.ts`
- `src/visuals/plantasiaAsciiAdapter.ts`
- `src/ui/layouts/AppShell.ts`
- `src/ui/bindRuntime.ts`
- `src/services/appSettingsStore.ts`
- `src/ui/components/SettingsPanel.ts`
- `src/main.ts`
- `scripts/verify-design-system.ts`

## Recommended Fix Order (Applied)

1. Build failure (BUILD-1)
2. Transport idempotency (STRESS-1)
3. Preset visual error propagation (A-1)
4. Fullscreen nav sync (X-1)
5. Theme switcher (T-1)
6. Design system verify script
7. Documentation updates

## Test Commands

```bash
npm run lint
npm run build
npm run verify:design-system
npm run verify:sound
npm run verify:presets
npm run verify:runtime
npm run verify:state
npm run verify:generative
npm run verify:midi
npm run verify:keyboard
npm run verify:interaction
npm run verify:visual
npm run verify:integration
```

## MVP Readiness

**Status: Ready for demo** with documented limitations above.

- Sound plays reliably after user gesture (Play)
- Visuals render and react to audio/MIDI/keyboard
- Presets change both sound and visuals
- Sliders affect correct systems
- Play / Stop work; Pause not available
- MIDI and keyboard work
- Design system loads from centralized package
- Light/dark theme switchable in Settings → Accessibility
- Production build passes type check + Vite bundle
