# Plantasonic Roadmap

Milestone-based development plan with completion tracking. Percentages reflect current project state.

---

## 1. Project Foundation

**Objective:** Establish production-ready project structure, tooling, documentation, and application shell.

**Completion: 100%**

- [x] Initialize Vite + TypeScript + npm
- [x] Configure Bootstrap 5.0.2, GSAP, ESLint, Prettier
- [x] Create folder structure
- [x] Write architecture documentation
- [x] Scaffold runtime module (state, events, types)
- [x] Define adapter interfaces (sound, ASCII)
- [x] Build responsive application shell
- [x] Configure design token pipeline (SCSS variables)
- [x] Verify production build

---

## 2. Framework + Design System Integration

**Objective:** Connect to AI Product Framework and AI Native Design System without merging repositories.

**Completion: 100%**

- [x] Create `docs/product-framework/` with workflow, standards, templates
- [x] Install `.cursor/rules/` adapted from framework
- [x] Create `docs/design-system/` with token and guidance references
- [x] Create `src/design-system/` token module with Bootstrap mapping
- [x] Update styles pipeline to import from `src/design-system/`
- [x] Create `HANDOFF.md`
- [x] Document integration flow in SYSTEM_OVERVIEW and DESIGN_SYSTEM

---

## 3. Runtime

**Objective:** Implement full runtime orchestration with state subscriptions and lifecycle management.

**Completion: 100%**

- [x] Define state store with RuntimeState shape
- [x] Define event bus interface
- [x] Implement runtime class with full public API
- [x] createRuntime() factory with mock adapters
- [x] MockSoundAdapter and MockAsciiAdapter with applyState
- [x] Wire UI to runtime (transport, controls, status)
- [x] Demo keyboard input through runtime
- [ ] Runtime integration tests (future)

---

## 4. Engine Integration

**Objective:** Connect Plantasia Sound Engine and ASCII Engine through adapters.

**Completion: 50%** (sound complete, ASCII pending)

- [x] Install Plantasia Sound Engine package (`1.0.0-beta.1`)
- [x] Implement `PlantasiaSoundAdapter` with real engine
- [ ] Install Plantasia ASCII Engine package
- [ ] Implement `AsciiAdapter` with real engine
- [x] Verify runtime start/stop lifecycle (sound)
- [x] Verify preset loading (sound)
- [x] Document integration in ENGINE_API.md and SOUND_ENGINE_INTEGRATION.md

---

## 5. Preset Worlds

**Objective:** Author and register generative preset worlds with synchronized sound and visuals.

**Completion: 0%**

- [ ] Define preset world schema
- [ ] Create first preset world module
- [ ] Build preset selection UI
- [ ] Implement preset loading flow
- [ ] Add preset metadata to manifest
- [ ] Test preset switching during playback

---

## 6. Performance Controls

**Objective:** Build performable controls for live manipulation of engine parameters.

**Completion: 0%**

- [ ] Design control dock layout
- [ ] Implement transport controls (play/stop)
- [ ] Build parameter knobs and sliders
- [ ] Wire controls to runtime `setControl()` (demo sliders done — polish in Phase 8)
- [ ] Add performance mode (minimal UI)
- [ ] Optimize control responsiveness

---

## 7. Responsive UI

**Objective:** Ensure full functionality across desktop, tablet, and mobile viewports.

**Completion: 10%**

- [x] Responsive application shell layout
- [x] Collapsible menu for narrow viewports
- [ ] Touch-friendly control sizing
- [ ] Mobile landscape optimization
- [ ] Safe area insets for notched devices
- [ ] Test on iOS Safari and Android Chrome

---

## 8. Recording

**Objective:** Capture and export audiovisual sessions.

**Completion: 0%**

- [ ] Design recorder module architecture
- [ ] Implement audio capture via Web Audio API
- [ ] Implement visual frame capture
- [ ] Build export pipeline (video/audio)
- [ ] Add recording UI controls
- [ ] Test export quality and file sizes

---

## 9. Optimization

**Objective:** Profile and optimize performance for smooth real-time audiovisual output.

**Completion: 0%**

- [ ] Establish performance benchmarks
- [ ] Profile render loop frame times
- [ ] Optimize state update batching
- [ ] Add frame rate throttling controls
- [ ] Implement reduced-motion mode
- [ ] Bundle size analysis and tree-shaking

---

## 10. Release

**Objective:** Ship Plantasonic as a deployable PWA with documentation and onboarding.

**Completion: 0%**

- [ ] Configure PWA manifest and service worker
- [ ] Set up production deployment pipeline
- [ ] Write user-facing documentation
- [ ] Create onboarding flow
- [ ] Perform accessibility audit
- [ ] Publish v1.0.0 release

---

## Overall Progress

| Milestone                 | Completion |
| ------------------------- | ---------- |
| Project Foundation        | 100%       |
| Framework + Design System | 100%       |
| Runtime                   | 100%       |
| Engine Integration        | 50%        |
| Preset Worlds             | 0%         |
| Performance Controls      | 0%         |
| Responsive UI             | 10%        |
| Recording                 | 0%         |
| Optimization              | 0%         |
| Release                   | 0%         |

**Estimated overall completion: ~45%**
