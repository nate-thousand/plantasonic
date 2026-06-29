# Plantasonic Architecture

## Purpose

Plantasonic is a browser-based generative audiovisual instrument. It unifies two independent engines — sound and ASCII visuals — into a single performable experience without duplicating engine logic inside the application repository.

**Creative north star:** [docs/CREATIVE_VISION.md](./docs/CREATIVE_VISION.md) — all engine and feature decisions must pass the decision filter defined there.

Plantasonic is the **product app**. It references four external repositories for engines, visual language, and engineering workflow. See [docs/REPO_BOUNDARIES.md](./docs/REPO_BOUNDARIES.md).

## Responsibilities

### Plantasonic (this repository)

| Responsibility        | Location                                   |
| --------------------- | ------------------------------------------ |
| User experience       | `src/ui/`                                  |
| App theme wiring      | `src/design-system/`, `src/styles/`        |
| Runtime orchestration | `src/runtime/`                             |
| State management      | `src/runtime/state.ts`                     |
| Presets               | `src/presets/`                             |
| Performance controls  | `src/ui/controls/`                         |
| Input routing         | `src/midi/`, `src/keyboard/`, `src/touch/` |
| Product documentation | Root and `docs/`                           |

### External Repositories (not in this repo)

| Repository                                                                        | Role                                | How Plantasonic uses it                             |
| --------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------- |
| [plantasia-sound-engine](https://github.com/nate-thousand/plantasia-sound-engine) | Audio synthesis library             | npm dependency → `src/audio/soundAdapter.ts`        |
| `ascii-visual-engine`                                                             | ASCII rendering library             | npm dependency → `src/visuals/plantasiaAsciiAdapter.ts` |
| [plantasia-engine-test](https://github.com/nate-thousand/plantasia-engine-test)   | Visual/integration reference        | Documentation and patterns until ASCII engine ships |
| `ai-native-design-system`                                                         | Design tokens, components, patterns | `src/design-system/`, `docs/design-system/`         |
| `ai-product-framework`                                                            | Engineering workflow and templates  | `docs/product-framework/`, `.cursor/rules/`         |

### External Engines (npm packages)

| Engine                 | Responsibility                                       |
| ---------------------- | ---------------------------------------------------- |
| Plantasia Sound Engine | Audio synthesis, Tone.js integration, sound presets  |
| Plantasia ASCII Engine | ASCII rendering, canvas/WebGL output, visual presets |

## Repository Boundaries

```text
┌─────────────────────────────────────────────────────────────────────┐
│                         Plantasonic App                              │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────────────────┐  │
│  │   UI    │  │ Runtime  │  │ Presets │  │ Styles (token wiring)│  │
│  └────┬────┘  └────┬─────┘  └────┬────┘  └──────────────────────┘  │
│       │            │              │                                  │
│       │     ┌──────┴──────┐       │                                  │
│       │     │  Adapters   │       │                                  │
│       │     ├── Sound ────┼───────┤                                  │
│       │     └── ASCII ────┼───────┘                                  │
└───────┼───────────────────┼──────────────────────────────────────────┘
        │                   │
        │    npm deps       │    docs / token imports
        ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌──────────────────┐
│ plantasia-    │   │ plantasia-    │   │ ai-native-       │
│ sound-engine  │   │ ascii-engine  │   │ design-system    │
└───────────────┘   │ (or engine-   │   └──────────────────┘
                    │  test ref)    │
                    └───────────────┘
```

**Rules:**

1. Plantasonic is the product app — do not merge sibling repositories into it.
2. UI never imports engine packages directly.
3. Adapters are the only bridge between runtime and engines.
4. Runtime is the only layer that calls both adapters.
5. Engine logic is never copied into Plantasonic source files.
6. Design tokens are defined in `ai-native-design-system` — Plantasonic imports them, it does not own them.
7. Engineering workflow templates live in `ai-product-framework` — referenced at setup, not vendored.

Full ecosystem map: [docs/REPO_BOUNDARIES.md](./docs/REPO_BOUNDARIES.md).

## Runtime Architecture

```text
User
  ↓
UI Layer
  ↓
Runtime
  ├── StateStore (shared state + subscriptions)
  ├── EventBus (typed pub/sub)
  └── Lifecycle (init → ready → running → stopped → destroy)
  ↓
Sound Adapter
  ↓
Plantasia Sound Engine
  ↓
ASCII Adapter
  ↓
Plantasia ASCII Engine
```

### Runtime Components

| Module     | File         | Role                                          |
| ---------- | ------------ | --------------------------------------------- |
| Runtime    | `runtime.ts` | Orchestrates adapters, lifecycle, presets     |
| StateStore | `state.ts`   | Immutable state with subscriber notifications |
| EventBus   | `events.ts`  | Typed event dispatch between layers           |
| Types      | `types.ts`   | Shared type definitions                       |

## Application Flow

### Initialization

```text
main.ts
  → createPlantasonicApp()
    → createRuntime()           // Mock adapters by default
    → createAppShell()          // Mount UI
    → bindRuntimeToShell()      // UI → runtime only
    → runtime.init({ container }) // Init adapters, emit ready
```

### Playback

```text
User clicks Play
  → UI calls runtime.start()
    → soundAdapter.start()
    → asciiAdapter.start()
    → stateStore.commit({ isPlaying: true })
    → syncAdapters() → applyState() on both mocks
    → eventBus.emit('runtime:start')
```

### Preset Loading

```text
User selects preset
  → runtime.setPreset(id)
    → eventBus.emit('preset:load')
    → Promise.all([
        soundAdapter.loadPreset(id),
        asciiAdapter.loadPreset(id)
      ])
    → stateStore.commit({ preset: id })
    → syncAdapters()
    → eventBus.emit('preset:loaded')
```

### Control Change

```text
User adjusts control slider
  → runtime.setControl(name, value)
    → stateStore.commit({ controls: { [name]: value } })
    → soundAdapter.setParameter(`controls.${name}`, value)
    → asciiAdapter.setParameter(`controls.${name}`, value)
    → syncAdapters()
    → eventBus.emit('control:set')
```

## Future Scalability

### Input Layers

MIDI, keyboard, mouse, and touch modules translate hardware input into runtime events through the interaction layer. See [docs/INTERACTION_LAYER.md](./docs/INTERACTION_LAYER.md).

### Application Experience

Phase 9 adds the product-facing experience layer:

```text
UI Shell (AppShell, TopNav, Stage, ControlDock)
  ↓
AppExperience (overlays, performance mode, shortcuts)
  ↓
InteractionManager → Runtime
```

See [docs/USER_EXPERIENCE.md](./docs/USER_EXPERIENCE.md).

### Visual Language

Phase 10 defines expressive visual identity per preset world:

```text
PresetWorld.visual (glyph families, patterns, motion, transitions)
  ↓
PlantasiaAsciiAdapter (audio-reactive mapping, GSAP transitions)
  ↓
ascii-visual-engine (canvas render loop)
```

- **Five distinct worlds** — seed, mold, flow, zen, nebula
- **Audio-reactive mapping** — velocity, energy, activity modulate engine controls
- **GSAP transitions** — world changes crossfade on stage canvas (not render loop)
- **Renderer abstraction** — canvas live; WebGL/Pixi/Three/terminal/SVG planned

See [docs/VISUAL_LANGUAGE.md](./docs/VISUAL_LANGUAGE.md).

### Rendering Backends

The ASCII adapter abstracts canvas/WebGL rendering. Swapping render backends requires adapter changes only — runtime and UI remain unchanged.

### PWA

Service worker and manifest configuration will live in `src/services/` and `public/`, enabling offline preset caching without affecting runtime architecture.

### Performance

The `performance` metrics in the runtime state store provide hooks for energy and activity — consumed by both adapters through `applyState()` and `setParameter()`.

## Product System Integration

Phase 2 connects Plantasonic to external framework and design system repos:

```text
AI Product Framework
  → docs/product-framework/
  → .cursor/rules/
  → HANDOFF.md

AI Native Design System
  → src/design-system/tokens/
  → src/design-system/bootstrap/
  → docs/design-system/

Plantasonic (this repo)
  → src/runtime/     integration layer
  → src/ui/          app shell wired to runtime
  → src/audio/soundAdapter.ts   PlantasiaSoundAdapter (live)
  → src/visuals/plantasiaAsciiAdapter.ts   PlantasiaAsciiAdapter (live)

External engines (npm)
  → plantasia-sound-engine@1.0.0-beta.1 (integrated)
  → ascii-visual-engine@v0.1.0 (integrated)
```

See [docs/SYSTEM_OVERVIEW.md](./docs/SYSTEM_OVERVIEW.md) and [docs/INTEGRATION_PLAN.md](./docs/INTEGRATION_PLAN.md).

## Module Dependency Graph

```text
main.ts
  └── app/
        ├── interaction/   (input modules → runtime dispatch)
        ├── ui/
        │     ├── experience/   (overlays, performance mode, motion)
        │     └── components/   (shell, preset browser, settings)
        ├── runtime/         (depends on adapter interfaces only)
        ├── audio/           (adapter interface)
        ├── visuals/         (adapter interface)
        └── services/        (settings persistence)

interaction/
  ├── interactionManager.ts
  ├── inputRouter.ts         → runtime/
  ├── keyboard/
  ├── midi/
  ├── mouse/
  ├── touch/
  └── automation/            (interface only)

runtime/
  ├── audio/soundAdapter     (interface import)
  ├── visuals/asciiAdapter   (interface import)
  ├── presets/registry       (preset world resolution)
  ├── state.ts
  ├── events.ts
  └── types.ts
```

No circular dependencies. UI and input modules dispatch through the interaction layer. Runtime is the only layer that calls adapters.
