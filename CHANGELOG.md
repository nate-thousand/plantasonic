# Changelog

All notable changes to Plantasonic will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Phase 3 completion:** AI Native Design System integration
- Comprehensive Bootstrap 5.0.2 theming — buttons, forms, cards, nav, modals, dropdowns, tooltips, progress, alerts
- Token modules: shadows, motion durations, CSS custom properties
- Reusable component library (`src/ui/controls/`) — Button, Slider, Toggle, Knob, PresetSelector, Status, Loading, Notification, Dialog, Toolbar, Dropdown, Tooltip
- UI motion: loading transitions, fullscreen transitions, sidebar close animation
- Authoritative `DESIGN_SYSTEM.md` — philosophy, tokens, components, layout, motion, accessibility, ASCII visual language

### Changed

- Shell components (TopNav, ControlDock, CollapsibleMenu) refactored to use design system control factories
- Bootstrap bundle expanded with cards, modals, dropdowns, tooltips, progress, alerts, spinners, offcanvas
- ROADMAP Phase 3 marked complete; Phase 9 layout items reconciled

### Added

- **Phase 10:** Expressive visual language and motion system
- Expanded `PresetVisualConfig` — glyph families, patterns, motion profiles, transitions, palette
- Three new preset worlds: Flow World, Zen World, Nebula World
- Visual language modules — glyph taxonomy, pattern library, motion language, audio-reactive mapping
- GSAP visual world transitions (crossfade, bloom, collapse, dissolve)
- Renderer abstraction with future backend roadmap (WebGL, PixiJS, Three.js, terminal, SVG)
- Responsive engine quality presets by viewport
- `VisualProfiler` — diff-based control sync for performance
- `docs/VISUAL_LANGUAGE.md`
- `npm run verify:visual`

### Changed

- `PlantasiaAsciiAdapter` — performance metrics modulate engine controls; preset transitions on load
- Seed World and Mold World — full visual identity configuration
- Runtime passes visual config to adapter on preset load

### Added

- **Phase 9:** Application experience layer
- Preset browser overlay — visual cards, search, tag filters, favorites, recently used
- Settings overlay — Input, Motion, Accessibility tabs
- Performance mode — distraction-free layout with keyboard shortcut (`P`)
- GSAP motion controller — overlay, sidebar, preset, and control feedback animations
- Error banner — user-facing messages for audio, MIDI, and engine failures
- `AppSettingsStore` — motion preferences, favorites, recent presets (localStorage)
- `docs/USER_EXPERIENCE.md` — UX principles, navigation, responsive, motion, accessibility

### Changed

- Control dock preset `<select>` replaced with browse button + preset name display
- Top nav expanded with Presets, Settings, and Perform actions
- Responsive shell styles — safe areas, touch targets, mobile/tablet/landscape breakpoints
- Reduced motion support via settings and `prefers-reduced-motion`

### Added

- **Phase 8:** Unified interaction layer (`src/interaction/`)
- Input modules: MIDI, keyboard, mouse, touch
- `InteractionManager` + `InputRouter` — all input normalizes to runtime events
- MIDI Learn with localStorage persistence (`SettingsStore`)
- Automation provider interface (`src/automation/` — no implementation)
- Sidebar input settings panel (MIDI/keyboard/touch toggles, octave, learn reset)
- `docs/INTERACTION_LAYER.md`
- `npm run verify:interaction`

### Changed

- UI (ControlDock, sliders) dispatches through interaction layer, not runtime directly
- Keyboard input moved from `Stage.ts` to `src/keyboard/keyboardModule.ts`
- Web MIDI removed from sound adapter — routes through interaction → runtime
- Sliders tagged with `data-ps-control` for mouse/touch modules

### Added

- **Phase 7:** Unified preset world system (`src/presets/`)
- `PresetWorld` schema with sound/visual engine refs and default controls/tempo
- World modules: `seed-world`, `mold-world`
- `docs/PRESETS.md` — authoring guide
- Runtime resolves worlds before loading adapters; rejects unknown preset ids

### Changed

- `runtime.setPreset()` loads engine presets from world definitions atomically
- ControlDock preset dropdown driven by `listPresetWorlds()` (no hardcoded ids)
- Stage overlay shows world name and description from registry
- Removed adapter-level preset id maps (worlds own engine mappings)

### Added

- **Phase 6:** ASCII Visual Engine integration via `PlantasiaAsciiAdapter`
- `ascii-visual-engine@v0.1.0` dependency (`file:../ascii-visual-engine`)
- `docs/ASCII_VISUAL_ENGINE_INTEGRATION.md` — visual mapping, stage mounting, verification
- Visual control mapping (`src/visuals/visualControlMapping.ts`)
- Full-bleed canvas mount in `#ps-stage`

### Changed

- `createRuntime()` defaults to `PlantasiaAsciiAdapter` (mock ASCII moved to `scripts/mocks/`)
- `runtime.init()` passes container to ASCII adapter for stage mounting
- `runtime.noteOff()` forwards `noteOff` to ASCII adapter
- CI builds sibling `ascii-visual-engine` before Plantasonic build

### Added

- **Phase 5:** Plantasia Sound Engine integration via `PlantasiaSoundAdapter`
- `plantasia-sound-engine@1.0.0-beta.1` npm dependency
- `docs/SOUND_ENGINE_INTEGRATION.md` — runtime mapping, control translation, verification
- Control mapping (`src/audio/controlMapping.ts`) and MIDI note helpers (`src/audio/midiNote.ts`)
- Preset load returns default controls to runtime state

### Changed

- `createRuntime()` defaults to `PlantasiaSoundAdapter` (mock sound removed from production)
- `runtime.setPreset()` syncs control defaults from sound adapter preset load
- ENGINE_API.md updated with actual engine API and parameter paths

### Added (Phase 3)

- Functional runtime with full public API (`start`, `stop`, `setPreset`, `noteOn`, `noteOff`, `setControl`, `setTempo`, `subscribe`, `getState`)
- `createRuntime()` factory in `src/runtime/createRuntime.ts`
- `MockAsciiAdapter` with `applyState()` logging
- UI runtime binding: transport, preset select, tempo, sidebar controls, stage status
- Demo keyboard input (A–J) routed through runtime

### Changed (Phase 3)

- Runtime state model replaced with `RuntimeState` (controls, performance, activeNotes)
- App bootstrap uses `createRuntime()` with adapters
- RUNTIME.md rewritten for runtime API

### Added (Phase 2)

## [0.1.0] - 2026-06-28

### Added

- Project foundation with Vite, TypeScript, and npm
- Bootstrap 5.0.2 with SCSS design token pipeline
- GSAP dependency for future animations
- ESLint and Prettier configuration with strict TypeScript
- Runtime scaffold (state store, event bus, orchestrator)
- Sound and ASCII adapter interfaces with null implementations
- Preset manifest structure
- Responsive application shell (top nav, stage placeholder, control dock, collapsible menu)
- Fullscreen API support in application shell
- Architecture documentation (ARCHITECTURE.md, RUNTIME.md, ENGINE_API.md)
- Design system documentation (DESIGN_SYSTEM.md)
- Milestone roadmap (ROADMAP.md)
- Contributing guidelines (CONTRIBUTING.md)
- MIT License
- GitHub Actions CI workflow

[Unreleased]: https://github.com/nate-thousand/plantasonic/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/nate-thousand/plantasonic/releases/tag/v0.1.0
