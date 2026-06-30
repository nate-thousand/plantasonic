# Changelog

All notable changes to Plantasonic will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] — 2026-06-29

### Added

- **Platform SDK migration** — Plantasonic is now a thin creative application on `@plantasonic/platform`
- `src/platform-consumer/` — app config, shell config, branding, preset bundles, plugins
- `mountInstrumentApp()` bootstrap via `@plantasonic/platform-demo/instrument-app`
- Platform dependencies: `@plantasonic/platform`, `@plantasonic/platform-types`, `@plantasonic/platform-demo`
- `npm run validate:app` — asserts thin-app architecture with no legacy infrastructure
- `src/presets/controls.ts` — creative control vocabulary decoupled from runtime
- `src/platform-consumer/content/mappings.ts` — documented world → platform parameter mappings

### Changed

- **Bootstrap** — `main.ts` uses `createPlantasonicPlatformApp()` instead of legacy `createPlantasonicApp()`
- **Preset worlds** — converted to platform `PresetBundle[]` via `worldToBundle.ts`
- **CI** — checks out `plantasonic-platform`, runs platform-focused verification
- **Documentation** — README, ARCHITECTURE, ROADMAP updated for platform architecture
- **Build** — `vite build` (platform packages resolved via sibling repo + Vite aliases)

### Removed

- Legacy runtime (`src/runtime/`), UI shell (`src/ui/`), interaction layer (`src/interaction/`)
- Local engine adapters (`src/audio/`, `src/visuals/plantasiaAsciiAdapter.ts`)
- Local MIDI/keyboard/mouse/touch routing (`src/midi/`, `src/keyboard/`, etc.)
- Transitional platform client mirror (`src/platform/`)
- Local preset registry orchestration and legacy verify scripts
- `gsap` dependency (visual transitions now owned by platform/visual engine)
- Duplicated app layout styles (`src/styles/app-layout.scss`)

### Infrastructure now owned by platform

- Application lifecycle and event bus
- Design System instrument shell rendering
- Sound and visual engine adapters
- Audio-reactive bridge
- Preset bundle registry
- Performance controls (MIDI, keyboard)
- Plugin manager
- Project state persistence (save/load/export/import)

## [0.2.4] — 2026-06-28

### Fixed

- **Shell layout** — remove duplicate DS dock/inspector chrome; apply `no-dock` + `inspector-hidden` modifiers
- **Instrument workspace** — full-height layout, no workspace padding, edge-to-edge shell (no card border)
- **Bootstrap styling** — import design-system `bootstrap-components` and `bootstrap-utilities` layers
- **`.ps-app` grid** — remove legacy nav row that reserved empty space above the stage
- Depends on `plantasonic-design-system` v1.2.2

## [0.2.3] — 2026-06-28

### Fixed

- **Vercel build** — removed `ascii-visual-engine` tsconfig path from production `tsc`; verify scripts use `tsconfig.verify.json` instead

## [0.2.2] — 2026-06-28

Release pass — documentation, lint, and production deployment validation.

### Fixed

- ESLint/Prettier formatting in `ascii-visual-engine.d.ts`
- `verify:integration` resolves `ascii-visual-engine` from GitHub source via tsconfig paths (no dist in package)

### Changed

- README production URL updated to canonical Vercel domain
- ROADMAP Phase 13 release candidate status updated

## [0.2.1] — 2026-06-28

### Fixed

- **Vercel deployment** — GitHub dependencies for `ascii-visual-engine` and design system; source alias when engine dist is unavailable

## [0.2.0] — 2026-06-28

First release integrating [plantasonic-design-system](https://github.com/nate-thousand/plantasonic-design-system) v1.2.x as the authoritative UI infrastructure.

### Added

- **Application Shell integration** — `renderApplicationShell()` + `bindApplicationShell()` from `plantasonic-design-system/shell`
- **`src/shell/` module** — shell config, install, navigation bridge, command registration, status injection
- **Design-system command palette** — instrument commands register via `registerShellCommands()`
- **Full DS style stack** — `css-theme-bridge`, `navigation-framework`, `application-shell`, `instrument-shell.scss`
- **Vercel deployment** — `vercel.json` for production app hosting

### Changed

- **Outer app chrome** — design-system Application Shell replaces local `InstrumentChrome` header
- **Theme sync** — `AppSettingsStore` uses shell `setShellTheme()` API
- **App bootstrap** — instrument workspace (stage, inspector, transport) mounts inside shell workspace slot
- **Sidebar navigation** — Sound, Visuals, Environment, Worlds, Settings wired via `ps-shell-navigate`

### Removed

- Local instrument header layout (`InstrumentChrome` no longer mounted in app shell)
- Duplicate command palette ownership (shell owns ⌘K; app registers commands)

### Preserved

- Stage, inspector, transport dock, preset browser, settings overlays
- Play/stop, sliders, MIDI, keyboard, preset worlds, ASCII visuals
- Focus mode, fullscreen, runtime orchestration

### Known issues

- Production bundle > 500 kB (sound + visual engines); code-splitting deferred
- Audio requires user gesture before playback (browser policy)
- Light theme less validated than dark in instrument UI

## [0.1.0] — prior releases

See git history for MVP navigation redesign, preset worlds, interaction layer, and expressive visual language milestones.
