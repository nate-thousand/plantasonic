# Plantasonic Roadmap

Milestone-based development plan with completion tracking. Percentages reflect current project state.

Plantasonic XYZ is the separate **official reference/demo application** for the Plantasonic Platform — the reusable AI First Application Platform — and a production audiovisual instrument built on `@plantasonic/platform`. This roadmap mirrors platform architecture and preserves delivery history as phases evolve.

**Platform equation:** Plantasonic Platform = reusable AI First Application Platform. `plantasonic-xyz` = separate reference/demo app. `signal-9-live` = separate product app.

**Creative north star:** All future work must align with [docs/CREATIVE_VISION.md](./docs/CREATIVE_VISION.md). Plantasonic is a living ecosystem instrument — not a DAW, not a feature checklist.

---

## Development Flow

Every milestone builds on the previous one:

```text
Project Foundation
  ↓
AI Product Framework
  ↓
AI Native Design System
  ↓
Runtime
  ↓
Reusable Engines
  ↓
Application Experience
  ↓
Optimization
  ↓
Release
```

Within the engine layer, sound and ASCII integrations proceed sequentially through adapters. Preset worlds unify both engines at the application level.

---

## Phase 1 — Project Foundation ✅

**Status:** Complete  
**Completion: 100%**

**Objective:** Establish production-ready project structure, tooling, documentation, and application shell.

Includes:

- Repository setup
- Build system (Vite + TypeScript + npm)
- Documentation scaffold
- Project structure
- Architecture specification
- GitHub / CI preparation
- Deployment preparation (build pipeline)

### Delivered

- [x] Initialize Vite + TypeScript + npm
- [x] Configure Bootstrap 5.0.2, GSAP, ESLint, Prettier
- [x] Create folder structure (`src/app/`, `src/runtime/`, `src/audio/`, `src/visuals/`, `src/ui/`, `src/presets/`, `src/design-system/`)
- [x] Write architecture documentation (`ARCHITECTURE.md`, `docs/SYSTEM_OVERVIEW.md`)
- [x] Scaffold runtime module (state, events, types)
- [x] Define adapter interfaces (sound, ASCII)
- [x] Build responsive application shell
- [x] Configure design token pipeline (SCSS variables)
- [x] Verify production build (`npm run build`)
- [x] CI workflow (`.github/workflows/ci.yml`)

---

## Phase 2 — AI Product Framework Integration ✅

**Status:** Complete  
**Completion: 100%**

**Objective:** Apply the reusable product framework to Plantasonic so future applications can follow the same structure.

**Deliverable:** Plantasonic follows the same project structure, conventions, and workflow that future applications will use.

Includes:

- Cursor rules
- Coding standards
- Documentation templates
- Workflow templates
- Prompt templates
- Project conventions
- Repository standards
- Development workflow

### Delivered

- [x] Create `docs/product-framework/` with workflow, standards, templates
- [x] Install `.cursor/rules/` adapted from framework (`plantasonic-project.mdc`, `coding-standards.mdc`)
- [x] Create `HANDOFF.md` session handoff template
- [x] Document integration flow in `docs/SYSTEM_OVERVIEW.md` and `docs/REPO_BOUNDARIES.md`
- [x] Document repeatable workflow in `docs/REPEATABLE_APP_TEMPLATE.md`
- [x] Define contribution standards (`CONTRIBUTING.md`)
- [x] Phased delivery plan (`docs/INTEGRATION_PLAN.md`)

---

## Phase 3 — AI Native Design System Integration ✅

**Status:** Complete  
**Completion: 100%**

**Objective:** Integrate the AI Native Design System as the authoritative visual and interaction specification for Plantasonic application chrome.

`DESIGN_SYSTEM.md` is the **single authoritative design specification** for this project.

### Delivered

- [x] Expanded authoritative `DESIGN_SYSTEM.md` — philosophy, tokens, components, layout, motion, a11y
- [x] Complete Bootstrap 5.0.2 theming via token overrides (buttons, forms, cards, nav, modals, etc.)
- [x] CSS custom properties layer (`_css-vars.scss`)
- [x] Shadow and motion token modules
- [x] Reusable component library (`src/ui/controls/`) — Button, Slider, Toggle, Knob, PresetSelector, Status, Loading, Notification, Dialog, Toolbar, Dropdown, Tooltip
- [x] Shell components refactored to use design system factories
- [x] Layout system complete (Phase 9 responsive work reconciled)
- [x] ASCII visual language documented in DESIGN_SYSTEM.md (implementation in Phase 10)
- [x] UI motion language complete — loading, fullscreen, sidebar close transitions
- [x] Accessibility foundation — keyboard map, focus, contrast, reduced motion, touch targets
- [x] **Application Shell (v0.2.0)** — public `plantasonic-design-system/shell` API; instrument workspace inside DS shell; command palette + theme from package

### Deferred (future platform work)

- [ ] iOS Safari / Android Chrome device testing checklist
- [ ] Density scales (engine-controlled)

---

### 3.1 Design System Foundation — 100%

- [x] Document integration flow, token structure, Bootstrap rules, sync workflow
- [x] Document design philosophy, visual principles, maintenance strategy

### 3.2 Figma → Token Pipeline — 100%

- [x] SCSS semantic tokens, Bootstrap mapping, styles pipeline, token catalog
- [x] Figma workflow documented in `DESIGN_SYSTEM.md`
- [x] CSS custom properties layer
- [x] Figma JSON export (`src/design-system/tokens/figma/tokens.json`)
- [x] Token sync script (`npm run tokens:sync`)
- [x] Token verification CI check (`npm run tokens:verify`)

### 3.3 Bootstrap Theme — 100%

- [x] Full theme: typography, colors, buttons, forms, cards, navigation, dropdowns, modals, offcanvas, tabs, tooltips, sliders, progress, alerts, shadows, radius

### 3.4 Component Library — 100%

- [x] All shell components + reusable control factories documented in `DESIGN_SYSTEM.md`

### 3.5 Layout System — 100%

- [x] Responsive shell (completed in Phase 9, reconciled here): desktop, tablet, mobile, landscape, fullscreen, safe areas, touch targets

### 3.6 ASCII Visual Language — 100%

- [x] Documented in `DESIGN_SYSTEM.md` and `docs/VISUAL_LANGUAGE.md` (Phase 10 implementation)

### 3.7 Motion System — 100%

- [x] GSAP UI motion: overlays, menus, controls, presets, loading, fullscreen
- [x] Documented in `DESIGN_SYSTEM.md`

### 3.8 Accessibility — 100%

- [x] Keyboard navigation, focus states, contrast, reduced motion, touch targets, semantic HTML
- [x] Documented in `DESIGN_SYSTEM.md`

### 3.9 Application Consumer Integration — 100%

**Date:** 2026-06-28 (updated 2026-06-29 — minimal instrument UI)

Plantasonic is the **first official consumer** of the centralized `plantasonic-design-system` package.

- [x] npm dependency on `plantasonic-design-system` (workspace v1.0.0)
- [x] Import generated CSS variables and Bootstrap theme from package
- [x] DS instrument SCSS (`instrument.scss`, `components.scss`, tokens) — no duplicated token files
- [x] Removed local `CommandPalette`, full application shell, duplicate token entry points
- [x] `npm run verify:design-system` — package exports, no showcase imports

**2026-06-29 UI rebuild:**

- [x] Removed full application shell (`src/shell/`) and legacy UI (`AppShell`, `ControlDock`, `InspectorPanel`, `PresetBrowser`, settings overlays, 30+ components)
- [x] Removed app-specific theme duplicates (`globals.scss`, `instrument-shell.scss`)
- [x] Added minimal DS-themed instrument UI — fullscreen `#ps-stage`, bottom control bar, collapsible advanced panel
- [x] Preserved runtime, sound engine, ASCII engine, presets, MIDI, and interaction layer wiring
- [x] Updated `verify:integration` for minimal layout structure

**App-owned (by design):** layout markup in `src/ui/`, layout-only SCSS in `app-layout.scss` (uses DS tokens only).

**Remaining polish:** settings overlay, preset browser cards, performance mode, light-theme bar validation, dedicated pause transport.

---

## Phase 4 — Runtime ✅

**Status:** Complete  
**Completion: 100%**

**Objective:** Implement full runtime orchestration with state subscriptions and lifecycle management.

Includes:

- Shared state
- Event system
- Runtime lifecycle
- Runtime API
- Mock adapters (verify scripts)
- Runtime architecture

### Delivered

- [x] Define state store with `RuntimeState` shape
- [x] Define event bus interface
- [x] Implement runtime class with full public API
- [x] `createRuntime()` factory with adapter injection
- [x] `MockSoundAdapter` and `MockAsciiAdapter` with `applyState()` (moved to `scripts/mocks/`)
- [x] Wire UI to runtime (transport, controls, status)
- [x] Demo keyboard input through runtime (`Stage.ts`)
- [x] Runtime verification script (`npm run verify:runtime`)
- [x] Runtime specification (`RUNTIME.md`)
- [ ] Runtime integration tests (future — Phase 11)

---

## Phase 5 — Plantasia Sound Engine Integration ✅

**Status:** Complete  
**Completion: 100%**

**Objective:** Integrate the real Plantasia Sound Engine through the adapter layer without bypassing the runtime.

Includes:

- Adapter implementation
- Runtime integration
- Control mapping
- Preset routing (engine-level, before unified worlds)
- Audio verification
- Documentation

### Delivered

- [x] Pin `plantasia-sound-engine@1.0.0-beta.1`
- [x] Implement `PlantasiaSoundAdapter` (`src/audio/soundAdapter.ts`)
- [x] Control mapping (`src/audio/controlMapping.ts`)
- [x] Wire `createRuntime()` to production sound adapter
- [x] Runtime `setPreset()` syncs control defaults from adapter
- [x] Web MIDI enabled on start when browser supports it
- [x] Error handling via runtime event bus
- [x] Mock sound adapter moved to `scripts/mocks/` for verify script
- [x] Documentation: `docs/SOUND_ENGINE_INTEGRATION.md`

---

## Phase 6 — ASCII Visual Engine Integration ✅

**Status:** Complete  
**Completion: 100%**

**Objective:** Integrate the real ASCII Visual Engine through the adapter layer without bypassing the runtime.

Includes:

- Adapter implementation
- Runtime integration
- Fullscreen renderer
- Resize handling
- Performance validation
- Visual verification

### Delivered

- [x] Pin `ascii-visual-engine@v0.1.0` (`file:../ascii-visual-engine`)
- [x] Implement `PlantasiaAsciiAdapter` (`src/visuals/plantasiaAsciiAdapter.ts`)
- [x] Visual control mapping (`src/visuals/visualControlMapping.ts`)
- [x] Mount full-bleed canvas in `#ps-stage`
- [x] Runtime passes container to `asciiAdapter.init()`
- [x] Resize forwarded via `runtime.resize()` and app shell observer
- [x] CI builds sibling ASCII engine before Plantasonic build
- [x] Mock ASCII adapter moved to `scripts/mocks/`
- [x] Documentation: `docs/ASCII_VISUAL_ENGINE_INTEGRATION.md`

---

## Phase 7 — Unified Audiovisual Preset Worlds ✅

**Status:** Complete  
**Completion: 100%**

**Objective:** Create preset worlds that define a complete audiovisual identity and load both engines atomically through the runtime.

Each preset world defines:

- Audio identity (sound engine preset id)
- Visual identity (ASCII engine preset id)
- Default controls
- Runtime defaults (tempo)
- Metadata for UI display

### Delivered

- [x] Define `PresetWorld` schema (`src/presets/types.ts`)
- [x] Create preset world modules (`seed-world`, `mold-world`)
- [x] Registry as single source of truth (`src/presets/registry.ts`)
- [x] Wire `runtime.setPreset()` to resolve worlds before adapter calls
- [x] Remove hardcoded preset maps from adapters
- [x] Build preset selection UI from `listPresetWorlds()` (ControlDock)
- [x] Preset metadata in Stage overlay
- [x] Atomic load with sound failure guard
- [x] Test preset switching during playback
- [x] Documentation: `docs/PRESETS.md`
- [ ] Interaction behavior per world (Phase 8)
- [x] Preset browser UI (Phase 9)

---

## Phase 8 — Interaction Layer ✅

**Status:** Complete  
**Completion: 100%**

**Objective:** Unified input architecture — all devices dispatch normalized events through the interaction layer to the runtime.

### Delivered

- [x] `InteractionManager` + `InputRouter` (`src/interaction/`)
- [x] MIDI module — Web MIDI discovery, hot-plug, note/CC/sustain/pitch bend
- [x] MIDI Learn with localStorage persistence
- [x] Keyboard module — QWERTY performance, octave shift, sustain, transport shortcuts
- [x] Mouse module — fine adjust (shift+drag), double-click reset
- [x] Touch module — slider drag, stage long-press start
- [x] Automation hook interface (`src/automation/` — no implementation)
- [x] SettingsStore — local persistence for input preferences
- [x] UI wired through interaction layer (ControlDock, sliders, settings panel)
- [x] Removed engine-direct MIDI from sound adapter
- [x] Documentation: `docs/INTERACTION_LAYER.md`
- [x] Verification: `npm run verify:interaction`

### Deferred to Phase 9

- [x] Performance mode (minimal UI)
- [ ] Product-grade knob components
- [ ] Full automation provider implementations

---

## Phase 9 — Application Experience ✅

**Status:** Complete  
**Completion: 100%**

**Objective:** Complete the product-facing experience across devices and session contexts.

### Delivered

- [x] Responsive application shell layout (desktop, tablet, mobile, landscape)
- [x] Safe-area support and touch-friendly control sizing (2.75rem minimum)
- [x] Fullscreen stage experience
- [x] Preset browser — visual cards, search, tag filters, favorites, recents
- [x] Settings overlay — Input, Motion, Accessibility tabs
- [x] Performance mode — minimal chrome, keyboard shortcut (`P`)
- [x] GSAP motion language — overlays, preset changes, control feedback
- [x] Error banner — user-facing states for audio, MIDI, engine failures
- [x] App settings persistence (`AppSettingsStore` — favorites, recents, motion)
- [x] Documentation: `docs/USER_EXPERIENCE.md`
- [x] **Navigation redesign (2026-06):** Instrument IA — Perform / Sound / Visuals / Environment; command palette; contextual inspector; [docs/NAVIGATION.md](./docs/NAVIGATION.md)
- [x] **UI concept implementation** — immersive instrument layout per product vision:
  - Edge-to-edge ASCII stage as hero; chrome floats over the visualizer
  - Header: Presets · Performance · Settings (+ Fullscreen · About · Help)
  - Floating glass control dock with collapsible Sound / Motion / Visual / Performance / Global groups
  - World identity on preset cards (thumbnail, icon, mood, motion style)
  - Cinematic GSAP transitions for overlays, preset changes, and card entrance

### Deferred

- [ ] Onboarding / first-run flow
- [ ] Product-grade knob components (sliders remain primary)
- [ ] Full automation provider implementations

---

## Phase 10 — Expressive Visual Language & Motion System ✅

**Status:** Complete  
**Completion: 100%**

**Objective:** Transform the ASCII engine into a signature visual identity inseparable from sound.

### Delivered

- [x] Expanded `PresetVisualConfig` — glyph families, patterns, motion, transitions, palette
- [x] Five distinct preset worlds (seed, mold, flow, zen, nebula)
- [x] Glyph family taxonomy (`src/visuals/language/glyphFamilies.ts`)
- [x] Pattern library (`src/visuals/language/patterns.ts`)
- [x] Motion language profiles (`src/visuals/language/motionLanguage.ts`)
- [x] Audio-reactive mapping — velocity, energy, activity, sustain modulations
- [x] GSAP visual world transitions (crossfade, bloom, collapse, dissolve)
- [x] Renderer abstraction and future backend roadmap
- [x] Responsive quality presets by viewport
- [x] Visual performance profiler and diff-based control sync
- [x] Documentation: `docs/VISUAL_LANGUAGE.md`
- [x] Verification: `npm run verify:visual`

---

## MVP Stabilization — Full System Bug Check ✅

**Status:** Complete  
**Completion: 100%**  
**Date:** 2026-06-28

**Objective:** Verify the app is fully usable as an MVP demo — no redesign, no feature removal.

### Delivered

- [x] Full system audit — audio, visual, design system, interaction, cross-system sync
- [x] Bug report: [docs/BUG_CHECK_REPORT.md](./docs/BUG_CHECK_REPORT.md)
- [x] Build fix — `generativeValidation.ts` type import
- [x] Transport idempotency — play/stop spam safe
- [x] Visual preset load error propagation
- [x] Fullscreen nav status sync
- [x] Theme switcher (dark/light) in Settings
- [x] `npm run verify:design-system`
- [x] All `verify:*` scripts passing; production build passing

### Known MVP Gaps (documented, not blocking demo)

- [ ] Pause transport
- [ ] Save / randomize preset UI
- [ ] Additional engine species exposed as preset worlds

### Performance & Latency ✅

**Date:** 2026-06-28

- [x] Full performance audit — [docs/PERFORMANCE_REPORT.md](./docs/PERFORMANCE_REPORT.md)
- [x] Audio note path — sound before state commit
- [x] Visual note deduplication — single `applyState` path
- [x] UI control RAF coalescing (`ControlCoalescer`)
- [x] Parallel sound + visual preset load
- [x] Resize coalescing; GSAP cancel on rapid preset switch
- [x] Shallow state snapshots for subscribers
- [x] `npm run verify:performance`

---

## Phase 11 — Recording & Sharing

**Status:** Not started  
**Completion: 0%**

**Objective:** Capture and export audiovisual sessions.

Implement:

- Audio recording
- Screenshot export
- ASCII export
- Video capture
- Preset import/export
- Session sharing

### Planned

- [ ] Design recorder module architecture
- [ ] Implement audio capture via Web Audio API
- [ ] Screenshot export (visual stage)
- [ ] ASCII frame / sequence export (via engine export API)
- [ ] Video capture pipeline
- [ ] Preset world import/export (JSON)
- [ ] Session sharing (export bundle)
- [ ] Recording UI controls in ControlDock
- [ ] Test export quality and file sizes

---

## Phase 12 — Performance & Optimization

**Status:** Not started  
**Completion: 0%**

**Objective:** Profile and optimize performance for smooth real-time audiovisual output.

Complete:

- Rendering optimization
- Audio optimization
- Runtime optimization
- Bundle optimization
- Memory profiling
- Accessibility audit

### Planned

- [ ] Establish performance benchmarks
- [ ] Profile ASCII render loop frame times
- [ ] Optimize state update batching
- [ ] Add frame rate / quality controls
- [ ] Implement reduced-motion mode
- [ ] Bundle size analysis and code splitting
- [ ] Memory profiling (long sessions)
- [ ] Runtime integration tests
- [ ] Full accessibility audit (extends Phase 3.8)

---

---

## Phase 14 — Platform SDK Migration ✅

**Status:** Complete  
**Completion: 100%**

**Objective:** Migrate Plantasonic from a self-contained runtime to a thin creative application on `@plantasonic/platform`.

### Delivered (v0.3.0)

- [x] Add `@plantasonic/platform`, `@plantasonic/platform-types`, `@plantasonic/platform-demo` dependencies
- [x] Replace local runtime, UI shell, interaction layer, and adapters with platform orchestration
- [x] Bootstrap via `mountInstrumentApp()` and `src/platform-consumer/`
- [x] Convert five preset worlds to platform `PresetBundle[]`
- [x] Remove duplicated infrastructure (runtime, MIDI routing, local adapters, local platform mirror)
- [x] Platform-focused CI and verification scripts
- [x] Update README, ARCHITECTURE, CHANGELOG

### Remaining creative work

- [ ] Re-introduce world-specific visual identity (glyph transitions) via platform plugins
- [ ] Settings overlay and favorites using platform project persistence
- [ ] Preset browser cards with world identity metadata

---

## Phase 13 — Release Candidate

**Status:** In progress  
**Completion: 60%**

**Objective:** Prepare Plantasonic for public release.

### Delivered (v0.2.4)

- [x] Minimal DS-themed instrument UI (2026-06-29) — fullscreen visualizer, bottom bar, collapsible advanced controls
- [x] Removed legacy application shell and developer control panel UI
- [x] Design-system Application Shell integration (first consumer of `plantasonic-design-system` v1.0)
- [x] Vercel deployment configuration and production URL
- [x] Version tagging and CHANGELOG release notes (v0.2.0–v0.2.4)
- [x] `npm run verify:design-system` and `npm run verify:integration` passing

### Known issues (v0.2.4)

- Production bundle > 500 kB (sound + visual engines); code-splitting deferred
- Audio requires user gesture before playback (browser policy)
- Light theme less validated than dark in instrument UI
- Settings overlay and preset browser removed with legacy shell — to be re-added minimally if needed
- Pause transport, save/randomize preset UI not implemented

### Next milestone

Phase 11 — Recording & Sharing, or Phase 13 completion (PWA, quickstart, GitHub release artifacts)

### Planned

- [ ] Configure PWA manifest and service worker
- [ ] Set up production deployment pipeline
- [ ] User-facing documentation and quickstart
- [ ] Example preset worlds and demo content
- [ ] API stability review (`RUNTIME.md`, `ENGINE_API.md`)
- [ ] Version tagging and CHANGELOG release notes
- [ ] GitHub release with artifacts
- [ ] Deployment validation (preview + production)
- [ ] Publish v1.0.0

---

## Documentation Policy

Every phase must conclude with synchronized documentation.

Review and update, when applicable:

| Document | Scope |
| -------- | ----- |
| `README.md` | Product overview, setup, integration status |
| `ROADMAP.md` | Milestone tracking (this document) |
| `ARCHITECTURE.md` | Module design and dependency graph |
| `DESIGN_SYSTEM.md` | Authoritative design specification |
| `RUNTIME.md` | Runtime API and adapter contracts |
| `ENGINE_API.md` | Engine adapter parameter mapping |
| `CHANGELOG.md` | User-facing change history |
| `HANDOFF.md` | Session handoff for next contributor |
| `docs/INTEGRATION_PLAN.md` | Phased delivery detail |
| Phase integration guides | `docs/SOUND_ENGINE_INTEGRATION.md`, `docs/ASCII_VISUAL_ENGINE_INTEGRATION.md`, `docs/PRESETS.md` |

**No milestone is considered complete until both the implementation and documentation are updated together.**

---

## Product Philosophy

Plantasonic XYZ is the reference/demo application built on the reusable Plantasonic Platform:

```text
AI Product Framework
  ↓
AI Native Design System
  ↓
Reusable Runtime
  ↓
Reusable Engines
  ↓
Plantasonic Application
  ↓
Deployment
```

Product applications such as `signal-9-live` should reuse this architecture by replacing only:

- Product-specific runtime configuration
- Engine integrations (adapters)
- Preset worlds
- User experience layer

The runtime API, adapter boundaries, design token pipeline, and project framework remain stable across products.

See [docs/REPEATABLE_APP_TEMPLATE.md](./docs/REPEATABLE_APP_TEMPLATE.md) and [docs/SYSTEM_OVERVIEW.md](./docs/SYSTEM_OVERVIEW.md).

---

## Overall Progress

| Phase | Milestone | Completion |
| ----- | --------- | ---------- |
| 1 | Project Foundation | 100% |
| 2 | AI Product Framework Integration | 100% |
| 3 | AI Native Design System Integration | 100% |
| 4 | Runtime | 100% |
| 5 | Plantasia Sound Engine Integration | 100% |
| 6 | ASCII Visual Engine Integration | 100% |
| 7 | Unified Audiovisual Preset Worlds | 100% |
| 8 | Interaction Layer | 100% |
| 9 | Application Experience | 100% |
| 10 | Expressive Visual Language | 100% |
| 11 | Recording & Sharing | 0% |
| 12 | Performance & Optimization | 0% |
| 13 | Release Candidate | 60% |
| 14 | Platform SDK Migration | 100% |
| 15 | Platform Reference Application | 100% |

**Estimated overall completion: ~92%**

Phases 1–10, 14, and 15 are complete. Phases 11–13 cover export, optimization, and release.

---

## Phase 15 — Platform Reference Application ✅

**Status:** Complete  
**Completion: 100%**

**Objective:** Transform Plantasonic XYZ into the official separate reference/demo application for the AI First Application Platform.

### Delivered

- [x] Hash-routed platform overview with logical sections (Design System, Theme System, engines, AI Workflow, Templates, Components, Developer Tools, Settings, Documentation)
- [x] Default landing on Platform Overview — not direct instrument boot
- [x] Lazy instrument route (`#instrument`) — engines unchanged
- [x] Theme system demonstration (Default, Signal 9, Plantasia, Future Theme slots)
- [x] AI workflow documentation (Figma → MCP → DS → v0 → Cursor → GitHub → Vercel → App)
- [x] `docs/REFERENCE_APP.md`, updated README, PLATFORM.md, HANDOFF.md
- [x] v0.4.0 release


---

## Historical Note

This roadmap was reorganized in 2026-06 to align with the platform architecture (framework → design system → runtime → engines → application → release). Earlier numbering mapped roughly as follows:

| Previous section | Current phase |
| ---------------- | ------------- |
| 1. Project Foundation | Phase 1 |
| 2. Framework + Design System | Phases 2 + 3 |
| 3. Runtime | Phase 4 |
| 4. Engine Integration | Phases 5 + 6 |
| 5. Preset Worlds | Phase 7 |
| 6. Performance Controls | Phase 8 (+ Phase 9) |
| 7. Responsive UI | Phase 3.5 + Phase 9 |
| 8. Recording | Phase 11 |
| 9. Optimization | Phase 12 |
| 10. Release | Phase 13 |

All completed checkboxes and completion percentages from the prior roadmap are preserved within their new phase assignments.
