# Plantasonic Performance and Latency Report

**Date:** 2026-06-28  
**Scope:** Audio, MIDI, keyboard, control responsiveness, visual engine, preset switching, mobile.

## Executive Summary

Plantasonic is a **vanilla TypeScript/DOM** app (no React). Performance work focused on measured hot paths: duplicate visual note dispatch, uncoalesced slider updates, sequential preset loading, unbounded resize churn, and redundant state cloning.

**Result:** Targeted optimizations applied without UI redesign or feature removal. Audio note paths now fire the sound engine before state commit; MIDI and keyboard remain uncoalesced.

---

## Measured Problems

### Critical / High

| ID | Area | Problem | Impact |
|----|------|---------|--------|
| P-1 | Visual notes | `noteOn`/`noteOff` called `setParameter` **and** `applyState` note diff | 2× visual engine note events per keystroke/MIDI note |
| P-2 | Audio notes | Sound engine called **after** state `commit` + subscriber clones | Extra main-thread work before audio `noteOn` |
| P-3 | UI controls | Every slider `input` → full `syncAdapters` | Dozens of `applyState` calls per second during drag |
| P-4 | State store | `structuredClone` on every `getState` / subscriber notify | Heavy allocation on notes, sliders, preset changes |
| P-5 | Preset load | Sound then visual loaded **sequentially** | Added wall-clock delay (visual GSAP up to ~550ms on top) |
| P-6 | Rapid presets | GSAP transitions queued without cancel | Visual freeze / stacked animations on fast switching |
| P-7 | Resize | `ResizeObserver` fired uncoalesced | Repeated quality preset + engine resize per layout frame |

### Medium

| ID | Area | Problem | Impact |
|----|------|---------|--------|
| P-8 | Preset UI | `PresetBrowser` + adapter both ran GSAP preset animations | Double animation (~350ms + ~450ms) |
| P-9 | Quality | Per-preset quality overwrote viewport quality | Mobile could get wrong density after preset load |
| P-10 | `applyState` | Note diff ran on every control-only update | Unnecessary note reconciliation loops |

### Low / Documented

| ID | Area | Problem | Notes |
|----|------|---------|-------|
| P-11 | Transport | Notes ignored until engine running | By design; requires Play first |
| P-12 | Pause | Not implemented | Out of scope |
| P-13 | Visual FPS | No in-app FPS overlay | Engine has adaptive quality; `VisualProfiler` is DEV-only |

---

## Fixes Applied

| ID | Fix | Files |
|----|-----|-------|
| P-1 | Removed duplicate `asciiAdapter.setParameter('note'/'noteOff')`; visuals sync via `applyState` only | `runtime.ts` |
| P-2 | `soundAdapter.noteOn/noteOff` called **before** state commit | `runtime.ts` |
| P-3 | RAF coalescing for `ui` / `mouse` / `touch` `setControl` and `setTempo`; MIDI/keyboard flush immediately | `controlCoalescer.ts`, `inputRouter.ts` |
| P-4 | Shallow state snapshots; `syncAdapters` uses internal mutable reference | `state.ts`, `runtime.ts` |
| P-5 | Parallel `loadPreset` for sound + visual adapters | `runtime.ts` |
| P-6 | `gsap.killTweensOf(canvas)` + load generation guard on superseded loads | `plantasiaAsciiAdapter.ts` |
| P-7 | ResizeObserver coalesced to one update per animation frame | `AppShell.ts` |
| P-8 | Removed redundant `animatePresetChange` from preset browser (adapter transition remains) | `PresetBrowser.ts` |
| P-9 | Re-apply viewport quality after preset identity load | `plantasiaAsciiAdapter.ts` |
| P-10 | Skip note diff when active note set unchanged | `plantasiaAsciiAdapter.ts` |
| — | Single `syncAdapters` at end of preset load (removed duplicate) | `runtime.ts` |
| — | Resize dimensions rounded consistently | `plantasiaAsciiAdapter.ts` |

---

## Before / After (Expected)

| Metric | Before | After |
|--------|--------|-------|
| Visual note events per key press | 2 | 1 |
| `applyState` calls per slider drag (60 events) | ~60 | ~1 per frame (~16ms) |
| State clone per `syncAdapters` | `structuredClone` full tree | Shallow copy for UI; zero clone for adapter sync |
| Preset load wall time | sound_ms + visual_ms | max(sound_ms, visual_ms) |
| Rapid preset switch | Queued GSAP timelines | Prior tween killed; superseded loads ignored |
| Resize handler calls per window drag | Many per frame | 1 per animation frame |
| Preset pick animation layers | 2 (browser + adapter) | 1 (adapter) |

*Browser-specific FPS and audio latency numbers require manual profiling in Chrome Performance panel — not automated in CI.*

---

## Architecture Notes

### Audio priority preserved

- MIDI, keyboard, automation: **no coalescing**
- Coalescer **flushes** before notes, transport, and preset changes
- Sound engine receives notes before UI subscriber notification

### Visual engine

- rAF loop owned by `ascii-visual-engine` (unchanged)
- Plantasonic pushes state via `applyState` with 0.005 control diff threshold
- Engine adaptive quality lowers density when FPS drops (medium/low presets)

### State model (not React)

- No React re-renders; UI uses imperative subscribers
- Subscriber count ~4; shallow snapshots reduce notify cost

---

## Remaining Bottlenecks

1. **GSAP preset transitions** — still 400–550ms when motion enabled; use reduced motion or `cut` transition style for fastest switches
2. **Notes require Play** — pre-transport key presses are silent by design
3. **Main-thread contention** — heavy visual density on low-end mobile may still affect input responsiveness; viewport quality maps small screens to `low`
4. **Bundle size** — 744KB JS may affect cold start (separate from runtime latency)
5. **No AudioContext latency measurement** — recommend `baseLatency + outputLatency` logging in DEV if needed

---

## Recommended Next Steps

1. Add optional DEV overlay: FPS from engine + `VisualProfiler.getSnapshot()`
2. Expose `transition: 'cut'` for worlds intended for live performance switching
3. Device testing on iOS Safari / Android Chrome (touch latency, audio unlock)
4. Consider `requestAnimationFrame` batching for UI subscriber DOM updates if profiling shows layout thrash
5. Export `GenerativePreferences` from sound engine package root (build hygiene, not latency)

---

## Test Commands

```bash
npm run lint
npm run build
npm run verify:performance
npm run verify:integration
npm run verify:sound
npm run verify:midi
npm run verify:keyboard
```

### Manual smoke test

1. `npm run build && npm run preview`
2. Play → immediate keyboard/MIDI response
3. Drag performance sliders — smooth visuals, no audio lag
4. Rapid preset switching — no stacked freezes
5. Resize window — visuals reflow without stutter
6. Mobile viewport (DevTools) — touch sliders, play, preset switch

---

## MVP Performance Status

**Pass** for demo/playability with documented limitations above.
