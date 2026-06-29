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

## Phase 3 — AI Native Design System Integration

**Status:** In progress  
**Completion: ~35%**

**Objective:** Integrate the AI Native Design System as the authoritative visual and interaction specification for Plantasonic application chrome.

`DESIGN_SYSTEM.md` is the **single authoritative design specification** for this project. Do not create additional design system documents unless they cover a clearly separate topic (engine aesthetics belong in engine repos).

This is a major milestone. Initial token pipeline and shell wiring are complete; component library, motion standards, accessibility, and ASCII visual language documentation remain.

---

### 3.1 Design System Foundation

Review and expand the existing `DESIGN_SYSTEM.md`.

**Completion: ~50%**

- [x] Document integration flow (framework → design system → app)
- [x] Document token module structure (`src/design-system/`)
- [x] Document Bootstrap integration rules
- [x] Document sync workflow with `ai-native-design-system`
- [ ] Document design philosophy
- [ ] Document visual principles
- [ ] Document ownership and maintenance strategy

---

### 3.2 Figma → Token Pipeline

Document and implement the token export workflow.

**Completion: ~45%**

- [x] SCSS semantic tokens (`src/design-system/tokens/`)
- [x] Bootstrap variable mapping (`src/design-system/bootstrap/_overrides.scss`)
- [x] Styles pipeline import (`src/styles/index.scss`)
- [x] Token catalog reference (`docs/design-system/TOKENS.md`)
- [ ] Figma Variables workflow documented in `DESIGN_SYSTEM.md`
- [ ] Token export automation
- [ ] CSS custom properties layer
- [ ] Token synchronization CI check

---

### 3.3 Bootstrap Theme

Replace Bootstrap defaults using Plantasonic design tokens.

**Completion: ~40%**

- [x] Bootstrap overrides entry point
- [x] Color token mapping
- [x] Typography token mapping
- [x] Spacing token mapping
- [ ] Full typography theme (scale, weights, line heights)
- [ ] Radius and shadow tokens applied globally
- [ ] Button theme variants
- [ ] Form control theme (inputs, selects, ranges)
- [ ] Card and navigation theme
- [ ] Offcanvas theme
- [ ] Slider / range theme polish
- [ ] Utility class audit

---

### 3.4 Component Library

Build reusable UI components documented in `DESIGN_SYSTEM.md`.

**Completion: ~30%**

- [x] AppShell (`src/ui/layouts/AppShell.ts`)
- [x] VisualizerStage / Stage (`src/ui/components/Stage.ts`)
- [x] ControlDock (`src/ui/components/ControlDock.ts`)
- [x] TopNav (`src/ui/components/TopNav.ts`)
- [x] Sidebar performance sliders (demo controls)
- [x] PresetSelector (registry-driven `<select>` in ControlDock)
- [ ] Dedicated PresetSelector component
- [ ] Knob component
- [ ] Slider component (product-grade, not Bootstrap default)
- [ ] Toggle component
- [ ] Button variants (product system)
- [ ] Navigation component spec
- [ ] Dialog component
- [ ] Status components (metering, engine state)
- [ ] Per-component documentation in `DESIGN_SYSTEM.md`

---

### 3.5 Layout System

Create responsive layout behavior across viewports.

**Completion: ~15%**

- [x] Responsive application shell layout
- [x] Collapsible menu for narrow viewports
- [ ] Desktop layout refinement
- [ ] Tablet layout optimization
- [ ] Mobile layout optimization
- [ ] Landscape orientation behavior
- [ ] Fullscreen / stage-maximized layout
- [ ] Safe area insets for notched devices
- [ ] Test on iOS Safari and Android Chrome

---

### 3.6 ASCII Visual Language

Expand `DESIGN_SYSTEM.md` to define the visual language of the ASCII engine.

**Design documentation only** — engine implementation belongs in the ASCII Visual Engine repository.

**Completion: 0%**

- [ ] Glyph families taxonomy
- [ ] Pattern taxonomy
- [ ] Motion principles
- [ ] Animation language
- [ ] Density scales
- [ ] Visual hierarchy rules
- [ ] Preset identity guidelines
- [ ] Audio → visual mapping conventions
- [ ] Transition behavior between worlds
- [ ] Future WebGL direction

---

### 3.7 Motion System

Implement motion standards using GSAP.

**Completion: ~10%**

- [x] GSAP dependency installed
- [ ] Panel transitions
- [ ] Menu animation
- [ ] Preset transition choreography
- [ ] Control animation feedback
- [ ] Loading transitions
- [ ] Visual stage transitions
- [ ] Motion standards documented in `DESIGN_SYSTEM.md`

---

### 3.8 Accessibility

Document and implement accessibility standards.

**Completion: 0%**

- [ ] Keyboard navigation map
- [ ] Focus state specification
- [ ] Contrast audit against tokens
- [ ] Responsive scaling rules
- [ ] Motion reduction strategy (`prefers-reduced-motion`)
- [ ] Accessibility section in `DESIGN_SYSTEM.md`

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

## Phase 10 — Recording & Sharing

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

## Phase 11 — Performance & Optimization

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

## Phase 12 — Release Candidate

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
| 3 | AI Native Design System Integration | ~35% |
| 4 | Runtime | 100% |
| 5 | Plantasia Sound Engine Integration | 100% |
| 6 | ASCII Visual Engine Integration | 100% |
| 7 | Unified Audiovisual Preset Worlds | 100% |
| 8 | Interaction Layer | 100% |
| 9 | Application Experience | 100% |
| 10 | Recording & Sharing | 0% |
| 11 | Performance & Optimization | 0% |
| 12 | Release Candidate | 0% |

**Estimated overall completion: ~70%**

Phases 1–2, 4–9 are complete. Phase 3 (design system) remains the primary ongoing milestone. Phases 10–12 cover export, optimization, and release.

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
| 8. Recording | Phase 10 |
| 9. Optimization | Phase 11 |
| 10. Release | Phase 12 |

All completed checkboxes and completion percentages from the prior roadmap are preserved within their new phase assignments.
