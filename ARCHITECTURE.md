# Plantasonic Architecture

## Purpose

Plantasonic is a browser-based generative audiovisual instrument. As of v0.3.0 it is a **thin creative application** built on `@plantasonic/platform` — not a self-contained runtime.

**Creative north star:** [docs/CREATIVE_VISION.md](./docs/CREATIVE_VISION.md)

## Layer model

```text
┌─────────────────────────────────────────────────────────────┐
│                    Plantasonic App (this repo)               │
│  Creative: presets · branding · worlds · visual language    │
│  src/platform-consumer/ · src/presets/ · src/visuals/       │
└──────────────────────────┬──────────────────────────────────┘
                           │ mountInstrumentApp(content)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  @plantasonic/platform                        │
│  lifecycle · event bus · workspace · adapters · bridge ·     │
│  preset bundles · performance · plugins · persistence        │
└──────┬──────────────────┬──────────────────┬────────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
 Design System      Sound Engine       Visual Engine
 (shell + tokens)   (plantasia)        (ascii-visual)
```

## Responsibilities

### Plantasonic (this repository)

| Responsibility | Location |
| -------------- | -------- |
| App identity and copy | `src/platform-consumer/content/` |
| Preset world definitions | `src/presets/worlds/` |
| World → PresetBundle conversion | `src/platform-consumer/worldToBundle.ts` |
| Visual language taxonomy | `src/visuals/language/` |
| Theme flash prevention | `src/services/appSettingsStore.ts` |
| DS style imports | `src/styles/` |

### @plantasonic/platform (sibling repository)

| Responsibility | SDK module |
| -------------- | ---------- |
| Application lifecycle | `createApplication` |
| Event bus | `createEventBus` |
| Workspace regions | `createWorkspace` |
| Sound engine adapter | `createSoundEngineAdapter` |
| Visual engine adapter | `createVisualEngineAdapter` |
| Audio-reactive bridge | `createAudioReactiveBridge` |
| Preset bundle registry | `createPresetBundleRegistry` |
| Performance controls (MIDI, keyboard) | `createPerformanceControlManager` |
| Plugin manager | `createPluginManager` |
| Project persistence | `createWorkspacePersistence` |

### External packages (never duplicated here)

| Package | Role |
| ------- | ---- |
| `plantasonic-design-system` | Tokens, Bootstrap theme, instrument shell |
| `plantasia-sound-engine` | Sound synthesis internals |
| `ascii-visual-engine` | Visual rendering internals |
| `@plantasonic/platform-demo/instrument-app` | Mount API only (`mountInstrumentApp`) |

## Bootstrap flow

```text
index.html
  → src/main.ts
    → bootstrapDocumentTheme()        (theme flash prevention)
    → initShellTheme()                  (design system)
    → createPlantasonicPlatformApp()    (src/platform-consumer/bootstrap.ts)
      → mountInstrumentApp(container, plantasonicAppContent)
        → @plantasonic/platform orchestration
        → renderApplicationShell() via design system
        → wire adapters, bridge, presets, performance, plugins, persistence
```

## Preset worlds

Five audiovisual worlds live in `src/presets/worlds/`. Each `PresetWorld` defines:

- Sound engine preset id
- Visual engine preset id and identity (glyph families, motion, transitions)
- Default controls and tempo

At boot, `worldToBundle.ts` converts worlds to platform `PresetBundle[]` entries. The platform applies bundles to sound, visual, bridge, workspace, and UI state.

## Rules

1. Plantasonic does not import engine packages from UI code — engines are accessed through platform adapters.
2. Plantasonic does not duplicate design tokens or Bootstrap theme files.
3. Plantasonic does not implement local MIDI routing, local preset registries, or local runtime state stores.
4. Creative content (worlds, branding, mappings) stays in this repository.
5. Infrastructure changes belong in `plantasonic-platform` or `plantasonic-design-system`.

## Related documentation

- [docs/REPO_BOUNDARIES.md](./docs/REPO_BOUNDARIES.md) — ecosystem map
- [docs/CREATIVE_VISION.md](./docs/CREATIVE_VISION.md) — creative constraints
- [plantasonic-platform/docs/PLANTASONIC_APP_MIGRATION.md](../plantasonic-platform/docs/PLANTASONIC_APP_MIGRATION.md) — migration guide
