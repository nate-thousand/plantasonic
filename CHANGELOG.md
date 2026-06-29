# Changelog

All notable changes to Plantasonic will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **Phase 6 consumer pass complete** — removed dead local shell files (`CommandPalette.ts`, `InstrumentChrome.ts`, `TopNav.ts`, `variables.scss` redirect)
- **`shell-config.ts`** — documents routes, docks, panels, theme, persistence; instrument transport/inspector remain workspace-owned
- **`verify:design-system`** — expanded checks for shell API, CSS imports, forbidden duplication/showcase imports

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
