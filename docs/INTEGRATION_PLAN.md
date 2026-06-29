# Integration Plan

Phased delivery plan for Plantasonic. Each phase builds on the previous one. Phases marked **complete** reflect current repository state.

This plan follows the repeatable product system defined in [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md) and [REPEATABLE_APP_TEMPLATE.md](./REPEATABLE_APP_TEMPLATE.md).

---

## Phase Overview

| Phase | Name                                  | Status       |
| ----- | ------------------------------------- | ------------ |
| 1     | Foundation and documentation          | **Complete** |
| 2     | Framework + design system integration | **Complete** |
| 3     | Runtime scaffold + mock adapters      | **Complete** |
| 4     | Mock engine adapters                  | **Complete** |
| 5     | Sound engine integration              | **Complete** |
| 6     | ASCII engine integration              | Not started  |
| 7     | Unified preset system                 | Not started  |
| 8     | MIDI, keyboard, touch controls        | Not started  |
| 9     | Responsive app polish                 | **Partial**  |
| 10    | Release                               | Not started  |

---

## Phase 1: Foundation and Documentation

**Objective:** Establish project structure, tooling, boundary docs, and integration plan.

**Status: Complete**

### Deliverables

- [x] Vite + TypeScript + npm project initialized
- [x] Bootstrap 5.0.2, GSAP, ESLint, Prettier configured
- [x] Folder structure (`src/app`, `runtime`, `audio`, `visuals`, `ui`, `presets`, etc.)
- [x] README, ARCHITECTURE, RUNTIME, ENGINE_API, DESIGN_SYSTEM, ROADMAP, CONTRIBUTING, CHANGELOG
- [x] `docs/SYSTEM_OVERVIEW.md` — stack explanation
- [x] `docs/REPO_BOUNDARIES.md` — repository ownership
- [x] `docs/REPEATABLE_APP_TEMPLATE.md` — reusable workflow
- [x] `docs/INTEGRATION_PLAN.md` — this document
- [x] GitHub Actions CI workflow
- [x] Production build verified

### External references applied

- **AI Product Framework:** Documentation structure, contribution standards, CI pattern
- **AI Native Design System:** Token pipeline prepared in `src/styles/`
- **Engines:** Not imported — adapter contracts defined only

### Exit criteria

- Project builds successfully
- All boundary and system docs exist
- No engine code in repository

---

## Phase 2: Framework + Design System Integration

**Objective:** Connect Plantasonic to AI Product Framework and AI Native Design System without merging repositories.

**Status: Complete**

### Deliverables

- [x] `docs/product-framework/` — workflow, standards, templates, Cursor rules reference
- [x] `docs/design-system/` — tokens, colors, typography, spacing, Bootstrap mapping, component/pattern guidance
- [x] `.cursor/rules/` — adapted framework and design system agent rules
- [x] `src/design-system/` — token SCSS and Bootstrap overrides from design system semantics
- [x] `HANDOFF.md` — session handoff document
- [x] Styles pipeline imports from `src/design-system/`

### Framework integration

- [x] Cursor rules (project, workflow, coding standards, pre-prompt)
- [x] Coding standards adapted for Vite + TypeScript
- [x] Prompt, roadmap, changelog, handoff templates in `docs/product-framework/templates/`
- [x] Workflow reference index

### Design system integration

- [x] Semantic color, typography, spacing tokens in `src/design-system/tokens/`
- [x] Bootstrap overrides mapped in `src/design-system/bootstrap/`
- [x] Component and pattern guidance indexed in `docs/design-system/`
- [x] Token sync workflow documented in `DESIGN_SYSTEM.md`

### External references

- **AI Product Framework:** Process, templates, Cursor rules — referenced, not vendored
- **AI Native Design System:** Tokens and Bootstrap mapping — imported into `src/design-system/`

### Exit criteria

- [x] Framework docs and Cursor rules active
- [x] Design tokens flow through `src/design-system/` to Bootstrap
- [x] No full repository copies; no engine code
- [x] Build passes

### Do not (still applies)

- Do not build final UI controls yet
- Do not integrate engines

---

## Phase 3: Runtime Scaffold + Mock Adapters

**Objective:** Build functional runtime with shared state, public API, mock adapters, and UI wiring.

**Status: Complete**

### Deliverables

- [x] `Runtime` public API: `start`, `stop`, `setPreset`, `noteOn`, `noteOff`, `setControl`, `setTempo`, `subscribe`, `getState`
- [x] `RuntimeState` with controls, performance metrics, active notes
- [x] `StateStore` with immutable snapshots and subscribers
- [x] `createRuntime()` factory with mock adapter defaults
- [x] `MockSoundAdapter` and `MockAsciiAdapter` with `applyState()` logging
- [x] UI bound via `bindRuntimeToShell()` — dock, sidebar controls, stage status
- [x] Demo keyboard input (A–J) routed through runtime
- [x] No real engine packages imported

### Exit criteria

- [x] App builds and runs
- [x] Play/Stop toggles `isPlaying` and mock adapter logs
- [x] Controls update shared state and mock adapters receive `applyState`
- [x] Subscribers update dock and stage status
- [x] UI never calls adapters directly

### Remaining (future phases)

- [ ] Error recovery and retry logic
- [ ] Runtime integration tests
- [ ] MIDI/keyboard modules as dedicated input layers (Phase 8)

---

## Phase 4: Mock Engine Adapters

**Objective:** Define adapter interfaces and mock implementations for development.

**Status: Complete** (delivered with Phase 3)

### Deliverables

- [x] `SoundAdapter` / `AsciiAdapter` interfaces
- [x] `MockSoundAdapter` — logs + `applyState`
- [x] `MockAsciiAdapter` — logs + `applyState`
- [x] `NullSoundAdapter` / `NullAsciiAdapter` retained for reference
- [x] Runtime wired to mocks via `createRuntime()`

### Exit criteria

- [x] App runs with mock adapters — no audio, no visuals, no errors
- [x] Adapter interfaces match expected engine APIs
- [x] No engine packages in `package.json`

---

## Phase 5: Sound Engine Integration

**Objective:** Connect `plantasia-sound-engine` through `SoundAdapter`.

**Status: Complete**

### Tasks

- [x] Pin stable engine version in `package.json` (`1.0.0-beta.1`)
- [x] Implement `PlantasiaSoundAdapter` wrapping engine API
- [x] Replace mock sound adapter default in `createRuntime()`
- [x] Verify lifecycle: `init → start → stop → destroy`
- [x] Verify `noteOn`, `noteOff`, `setParameter` / control mapping
- [x] Wire transport Play/Stop to runtime (unchanged UI)
- [x] Document engine-specific parameter paths in `ENGINE_API.md`
- [x] Add `docs/SOUND_ENGINE_INTEGRATION.md`

### Exit criteria

- [x] Audio plays through adapter when user presses Play
- [x] No direct engine imports outside `src/audio/`
- [x] Engine version pinned and documented

### Do not

- Import unstable engine code or unpinned branches
- Copy synthesis logic into Plantasonic

---

## Phase 6: ASCII Engine Integration

**Objective:** Connect ASCII Visual Engine through `AsciiAdapter`.

**Status: Complete**

### Tasks

- [x] Pin stable visual engine version in `package.json` (`ascii-visual-engine@v0.1.0`)
- [x] Implement `PlantasiaAsciiAdapter` wrapping engine API
- [x] Replace mock adapter in `createRuntime()`
- [x] Mount render surface in `#ps-stage`
- [x] Wire resize observer to `runtime.resize()` (via app shell)
- [x] Verify lifecycle and preset loading

### External references

- **ascii-visual-engine:** [github.com/nate-thousand/ascii-visual-engine](https://github.com/nate-thousand/ascii-visual-engine) — visual rendering only
- **Integration guide:** [docs/ASCII_VISUAL_ENGINE_INTEGRATION.md](./ASCII_VISUAL_ENGINE_INTEGRATION.md)

### Exit criteria

- [x] ASCII visuals render in stage when runtime starts
- [x] Resize updates render surface
- [x] No direct engine imports outside `src/visuals/`

### Do not

- Copy ASCII rendering code from engine-test into Plantasonic
- Build rendering logic in the app — delegate to engine

---

## Phase 7: Unified Preset System

**Objective:** App-level preset worlds that coordinate sound and visual engines.

**Status: Complete**

### Tasks

- [x] Define preset world schema (metadata + engine configs)
- [x] Author preset world modules in `src/presets/worlds/`
- [x] Wire preset selection UI to manifest (`ControlDock`)
- [x] Wire `runtime.setPreset()` to preset world registry
- [x] Verify atomic loading across both adapters
- [x] Document preset authoring in `docs/PRESETS.md`

### Exit criteria

- [x] User can select a preset and both engines load synchronously
- [x] Preset metadata displays in UI
- [x] Two complete preset worlds exist (`seed-world`, `mold-world`)

---

## Phase 8: MIDI, Keyboard, Touch Controls

**Objective:** Input layers that translate hardware interaction into runtime events.

**Status: Not started**

### Prerequisites

- Phase 5 sound engine integrated (for note input)
- Phase 7 presets working

### Tasks

- [ ] Extract demo keyboard from `Stage.ts` into `src/keyboard/` module
- [ ] Implement Web MIDI input in `src/midi/`
- [ ] Implement touch gestures in `src/touch/`
- [ ] Route input through runtime (`noteOn`, `noteOff`, event bus)
- [ ] Build dedicated performance controls in `src/ui/controls/`
- [ ] Wire controls to `runtime.setControl()` (demo sliders done in Phase 3)
- [ ] MIDI Learn mode (reference engine-test patterns)

### External references

- **plantasia-engine-test:** MIDI routing and Learn mode patterns — reference only
- **AI Native Design System:** Control component specs

### Exit criteria

- Keyboard and MIDI trigger notes through runtime
- Parameter controls update both engines
- Touch gestures work on mobile

---

## Phase 9: Responsive App Polish

**Objective:** Production-quality responsive UI across all viewports.

**Status: Partial (~10%)**

### Completed

- [x] Responsive app shell layout
- [x] Collapsible menu for narrow viewports
- [x] Fullscreen API support

### Remaining

- [ ] Touch-friendly control sizing
- [ ] Mobile landscape optimization
- [ ] Safe area insets for notched devices
- [ ] Performance mode (minimal UI)
- [ ] GSAP transitions for menu and dock
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Test on iOS Safari and Android Chrome

### External references

- **AI Native Design System:** Responsive patterns, accessibility standards

### Exit criteria

- App usable on phone, tablet, and desktop
- Accessibility audit passes
- Animations respect `prefers-reduced-motion`

---

## Phase 10: Release

**Objective:** Ship Plantasonic as a deployable product.

**Status: Not started**

### Prerequisites

- Phases 1–9 complete

### Tasks

- [ ] Configure PWA manifest and service worker
- [ ] Set up production deployment (Vercel)
- [ ] Write user-facing getting started guide
- [ ] Create onboarding flow for first visit
- [ ] Performance profiling and bundle optimization
- [ ] Tag v1.0.0 release
- [ ] Update CHANGELOG and ROADMAP to 100%

### External references

- **AI Product Framework:** Deployment workflow docs

### Exit criteria

- Production URL live
- v1.0.0 tagged on GitHub
- All documentation current

---

## Dependency Graph

```text
Phase 1 (Foundation)
  ↓
Phase 2 (Design System) ──────────────────────┐
  ↓                                           │
Phase 3 (Runtime) ← Phase 4 (Mock Adapters)   │
  ↓                                           │
Phase 5 (Sound Engine)                        │
  ↓                                           │
Phase 6 (ASCII Engine)                        │
  ↓                                           │
Phase 7 (Presets)                             │
  ↓                                           │
Phase 8 (Input + Controls) ←──────────────────┘
  ↓
Phase 9 (Polish)
  ↓
Phase 10 (Release)
```

Phases 2 and 3 can proceed in parallel after Phase 1. Engine integration (5, 6) requires stable external packages.

---

## Rules for All Phases

| Rule                                         | Applies to  |
| -------------------------------------------- | ----------- |
| No engine code in Plantasonic                | Phases 5, 6 |
| No copying entire external repos             | All phases  |
| Adapters are the only engine bridge          | Phases 4–8  |
| Design tokens from design system only        | Phase 2, 9  |
| Framework templates referenced, not vendored | Phase 1, 10 |
| Document before implementing                 | All phases  |

---

## Related Documentation

| Document                                                   | Description                          |
| ---------------------------------------------------------- | ------------------------------------ |
| [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md)                 | Stack layers                         |
| [REPO_BOUNDARIES.md](./REPO_BOUNDARIES.md)                 | Repository ownership                 |
| [REPEATABLE_APP_TEMPLATE.md](./REPEATABLE_APP_TEMPLATE.md) | Reusable workflow                    |
| [ROADMAP.md](../ROADMAP.md)                                | Milestone checklist with percentages |
