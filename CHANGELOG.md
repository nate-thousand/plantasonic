# Changelog

All notable changes to Plantasonic will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
