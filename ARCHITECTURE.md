# Plantasonic Architecture

## Purpose

Plantasonic is a browser-based generative audiovisual instrument. It unifies two independent engines — sound and ASCII visuals — into a single performable experience without duplicating engine logic inside the application repository.

## Responsibilities

### Plantasonic (this repository)

| Responsibility        | Location                                   |
| --------------------- | ------------------------------------------ |
| User experience       | `src/ui/`                                  |
| Design system         | `src/styles/`                              |
| Runtime orchestration | `src/runtime/`                             |
| State management      | `src/runtime/state.ts`                     |
| Presets               | `src/presets/`                             |
| Performance controls  | `src/ui/controls/`                         |
| Input routing         | `src/midi/`, `src/keyboard/`, `src/touch/` |
| Documentation         | Root and `docs/`                           |

### External Engines (separate packages)

| Engine                 | Responsibility                                       |
| ---------------------- | ---------------------------------------------------- |
| Plantasia Sound Engine | Audio synthesis, Tone.js integration, sound presets  |
| Plantasia ASCII Engine | ASCII rendering, canvas/WebGL output, visual presets |

## Repository Boundaries

```text
┌─────────────────────────────────────────────────────────┐
│                    Plantasonic App                       │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐  │
│  │   UI    │  │ Runtime  │  │ Presets │  │  Styles  │  │
│  └────┬────┘  └────┬─────┘  └────┬────┘  └──────────┘  │
│       │            │              │                      │
│       │     ┌──────┴──────┐       │                      │
│       │     │  Adapters   │       │                      │
│       │     ├── Sound ────┼───────┤                      │
│       │     └── ASCII ────┼───────┘                      │
└───────┼───────────────────┼──────────────────────────────┘
        │                   │
        ▼                   ▼
┌───────────────┐   ┌───────────────┐
│ Plantasia     │   │ Plantasia     │
│ Sound Engine  │   │ ASCII Engine  │
└───────────────┘   └───────────────┘
```

**Rules:**

1. UI never imports engine packages directly.
2. Adapters are the only bridge between runtime and engines.
3. Runtime is the only layer that calls both adapters.
4. Engine logic is never copied into Plantasonic source files.

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
    → createAppShell()          // Mount UI
    → new Runtime(adapters)     // Create orchestrator
    → runtime.init({ container }) // Init adapters, emit ready
```

### Playback

```text
User clicks Play
  → UI dispatches action
    → runtime.start()
      → soundAdapter.start()
      → asciiAdapter.start()
      → stateStore.patch({ isPlaying: true })
      → eventBus.emit('runtime:start')
```

### Preset Loading

```text
User selects preset
  → runtime.loadPreset(id)
    → eventBus.emit('preset:load')
    → Promise.all([
        soundAdapter.loadPreset(id),
        asciiAdapter.loadPreset(id)
      ])
    → stateStore.patch({ activePresetId: id })
    → eventBus.emit('preset:loaded')
```

### Parameter Change

```text
User adjusts control
  → runtime.setParameter(path, value)
    → soundAdapter.setParameter(path, value)
    → asciiAdapter.setParameter(path, value)
    → stateStore.patch({ parameters })
    → eventBus.emit('parameter:set')
```

## Future Scalability

### Input Layers

MIDI, keyboard, and touch modules will translate hardware input into runtime events (`input:noteOn`, `input:noteOff`) without knowing about engine internals.

### Rendering Backends

The ASCII adapter abstracts canvas/WebGL rendering. Swapping render backends requires adapter changes only — runtime and UI remain unchanged.

### PWA

Service worker and manifest configuration will live in `src/services/` and `public/`, enabling offline preset caching without affecting runtime architecture.

### Performance

The `PerformanceState` in the runtime state store provides hooks for frame rate throttling, audio latency hints, and reduced-motion preferences — consumed by both adapters through `setParameter`.

## Module Dependency Graph

```text
main.ts
  └── app/
        ├── ui/          (no engine deps)
        ├── runtime/     (depends on adapter interfaces only)
        ├── audio/       (adapter interface)
        └── visuals/     (adapter interface)

runtime/
  ├── audio/soundAdapter   (interface import)
  ├── visuals/asciiAdapter (interface import)
  ├── state.ts
  ├── events.ts
  └── types.ts
```

No circular dependencies. UI depends on runtime types for display state only.
