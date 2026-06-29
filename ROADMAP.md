# Plantasonic Roadmap

Milestone-based development plan with completion tracking. Percentages reflect current project state.

Plantasonic is both a **production audiovisual application** and the **reference implementation** for a repeatable AI-assisted product development system. This roadmap mirrors that platform architecture and preserves delivery history as phases evolve.

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

### Deferred (future platform work)

- [ ] Figma token export automation
- [ ] Token synchronization CI check
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
- [ ] Token export automation (deferred)
- [ ] Token synchronization CI check (deferred)

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

## Phase 13 — Release Candidate

**Status:** Not started  
**Completion: 0%**

**Objective:** Prepare Plantasonic for public release.

Includes:

- QA
- Documentation review
- API review
- Example content
- Versioning
- GitHub release
- Deployment validation

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

Plantasonic is the first application built on a reusable product platform:

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

Future products should reuse this architecture by replacing only:

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
| 13 | Release Candidate | 0% |

**Estimated overall completion: ~88%**

Phases 1–3, 4–10 are complete. Phases 11–13 cover export, optimization, and release.

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
