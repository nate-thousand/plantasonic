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

## 2. Design System

**Objective:** Integrate Figma design tokens into Bootstrap theme and build reusable UI components.

**Completion: 0%**

- [ ] Import Figma design tokens into `variables.scss`
- [ ] Map tokens to Bootstrap SCSS variables
- [ ] Define typography scale and spacing system
- [ ] Create base component library (buttons, knobs, sliders)
- [ ] Document token update workflow in DESIGN_SYSTEM.md
- [ ] Establish visual regression baseline

---

## 3. Runtime

**Objective:** Implement full runtime orchestration with state subscriptions and lifecycle management.

**Completion: 15%**

- [x] Define state store interface
- [x] Define event bus interface
- [x] Scaffold runtime class with adapter coordination
- [ ] Wire viewport resize to render loop
- [ ] Implement parameter synchronization
- [ ] Add error recovery and retry logic
- [ ] Write runtime integration tests

---

## 4. Engine Integration

**Objective:** Connect Plantasia Sound Engine and ASCII Engine through adapters.

**Completion: 0%**

- [ ] Install Plantasia Sound Engine package
- [ ] Implement `SoundAdapter` with real engine
- [ ] Install Plantasia ASCII Engine package
- [ ] Implement `AsciiAdapter` with real engine
- [ ] Verify runtime start/stop lifecycle
- [ ] Verify preset loading across both engines
- [ ] Document integration in ENGINE_API.md

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
- [ ] Wire controls to runtime `setParameter`
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

| Milestone            | Completion |
| -------------------- | ---------- |
| Project Foundation   | 100%       |
| Design System        | 0%         |
| Runtime              | 15%        |
| Engine Integration   | 0%         |
| Preset Worlds        | 0%         |
| Performance Controls | 0%         |
| Responsive UI        | 10%        |
| Recording            | 0%         |
| Optimization         | 0%         |
| Release              | 0%         |

**Estimated overall completion: ~12%**
