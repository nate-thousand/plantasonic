# Runtime Specification

The Plantasonic runtime is the **integration layer** between UI, engine adapters, and future input modules (MIDI, keyboard, touch). Phases 5–6 integrate the real sound and ASCII visual engines.

Implementation: `src/runtime/`

---

## Public API

```typescript
import { createRuntime } from '@/runtime';

const runtime = createRuntime();
await runtime.init({ container: stageElement });

runtime.start();
runtime.stop();
runtime.setPreset('seed-world');
runtime.noteOn(60, 0.8);
runtime.noteOff(60);
runtime.setControl('bloom', 0.65);
runtime.setTempo(96);

const state = runtime.getState();
const unsubscribe = runtime.subscribe((state) => {
  // React to state changes
});
```

| Method                    | Description                                       |
| ------------------------- | ------------------------------------------------- |
| `init(config)`            | Initialize adapters, optional initial preset      |
| `start()`                 | Start both adapters, set `isPlaying: true`        |
| `stop()`                  | Stop both adapters, clear active notes            |
| `setPreset(id)`           | Load preset world into both adapters (resolves world registry) |
| `noteOn(note, velocity?)` | Trigger note, update active notes and performance |
| `noteOff(note)`           | Release note                                      |
| `setControl(name, value)` | Set performance control (0–1)                     |
| `setTempo(bpm)`           | Set tempo (20–300)                                |
| `getState()`              | Return immutable state snapshot                   |
| `subscribe(callback)`     | Register state change listener                    |
| `resize(w, h)`            | Forward viewport size to ASCII adapter            |
| `destroy()`               | Tear down adapters and reset state                |

Factory: `createRuntime()` in `src/runtime/createRuntime.ts` — defaults to `PlantasiaSoundAdapter` and `PlantasiaAsciiAdapter`.

---

## Shared State

```typescript
interface RuntimeState {
  isPlaying: boolean;
  preset: string | null;
  activeNotes: number[];
  tempo: number;
  controls: {
    bloom: number;
    mold: number;
    density: number;
    chaos: number;
    brightness: number;
  };
  performance: {
    lastNote: number | null;
    velocity: number;
    energy: number;
    activity: number;
  };
}
```

Default values: `tempo: 72`, controls at `0.5` (chaos `0.25`), `isPlaying: false`, empty `activeNotes`.

### Single source of truth

| Layer | Owns | Sync path |
| ----- | ---- | --------- |
| **Runtime** (`StateStore`) | Transport, preset, controls, active notes, performance metrics | Authoritative |
| **SettingsStore** | MIDI/keyboard/touch prefs, octave, CC mappings | `interaction.updateSettings()` |
| **Adapters** | Derived caches for deduplicated engine calls | `runtime.syncAdapters()` → `applyState()` |
| **UI** | DOM control values | `interaction.subscribe()` reflects runtime |

Performance changes (`setControl`, `setTempo`, `setPreset`, transport) commit to runtime first, then `syncAdapters()` pushes snapshots to both engines. UI and MIDI route through `InteractionManager` → `InputRouter` → runtime — never adapters directly.

Clamping and tempo bounds live in `src/runtime/performanceParams.ts` (20–300 BPM, controls 0–1).

---

## Integration Rule

**UI components must only call runtime methods.**

```text
UI (ControlDock, Stage, Sidebar)
  ↓  runtime.start(), setControl(), etc.
Runtime
  ↓  adapter methods + applyState()
PlantasiaSoundAdapter / PlantasiaAsciiAdapter
  ↓  plantasia-sound-engine / ascii-visual-engine
```

UI must **not** import or call `src/audio/` or `src/visuals/` adapters directly.

Binding: `src/ui/bindRuntime.ts` → `bindRuntimeToShell(runtime, shell)`

---

## Sound Adapter (Phase 5)

| Adapter               | File                        | Behavior                                      |
| --------------------- | --------------------------- | --------------------------------------------- |
| PlantasiaSoundAdapter | `src/audio/soundAdapter.ts` | Wraps `createPlantasiaEngine()` — live audio  |

Sound adapter implements `applyState()` with deduplicated control/tempo sync. Console diagnostics use `[PlantasiaSound]` prefix.

See [docs/SOUND_ENGINE_INTEGRATION.md](./docs/SOUND_ENGINE_INTEGRATION.md).

---

## ASCII Adapter (Phase 6)

| Adapter               | File                                   | Behavior                                      |
| --------------------- | -------------------------------------- | --------------------------------------------- |
| PlantasiaAsciiAdapter | `src/visuals/plantasiaAsciiAdapter.ts` | Wraps `AsciiEngine` — live canvas visuals     |

ASCII adapter mounts a full-bleed canvas in `#ps-stage`, implements `applyState()` with deduplicated control/tempo/note sync. Console diagnostics use `[PlantasiaAscii]` prefix.

See [docs/ASCII_VISUAL_ENGINE_INTEGRATION.md](./docs/ASCII_VISUAL_ENGINE_INTEGRATION.md).

---

## Mock Adapters (verify script only)

| Adapter          | File                              | Behavior                                     |
| ---------------- | --------------------------------- | -------------------------------------------- |
| MockSoundAdapter | `scripts/mocks/mockSoundAdapter.ts` | Logs all calls for headless verification   |
| MockAsciiAdapter | `scripts/mocks/mockAsciiAdapter.ts` | Logs all calls for headless verification   |

Used by `scripts/verify-runtime.ts` only — not wired in production `createRuntime()`.

---

## Subscriptions

```typescript
const unsubscribe = runtime.subscribe((state) => {
  updateDock(state.isPlaying, state.preset);
  updateNoteCount(state.activeNotes.length);
});

// Cleanup
unsubscribe();
```

Rules:

1. Subscribers receive immutable snapshots via `structuredClone`
2. Initial callback fires immediately on subscribe
3. Unsubscribe during teardown to prevent leaks

---

## Event Bus

Typed events in `src/runtime/events.ts` fire alongside state updates:

| Event                            | When                    |
| -------------------------------- | ----------------------- |
| `runtime:start`                  | Playback started        |
| `runtime:stop`                   | Playback stopped        |
| `preset:load` / `preset:loaded`  | Preset change           |
| `control:set`                    | Control value changed   |
| `tempo:set`                      | Tempo changed           |
| `input:noteOn` / `input:noteOff` | Note input              |
| `viewport:resize`                | Stage resized           |
| `error`                          | Adapter or init failure |

---

## Control Flow

### Start / Stop

```text
User clicks Play
  → runtime.start()
    → soundAdapter.start()
    → asciiAdapter.start()
    → state.isPlaying = true
    → applyState() on both mocks
    → subscribers notified
```

### Control Change

```text
User moves bloom slider
  → runtime.setControl('bloom', 0.7)
    → state.controls.bloom = 0.7
    → soundAdapter.setParameter('controls.bloom', 0.7)
    → asciiAdapter.setParameter('controls.bloom', 0.7)
    → applyState()
    → subscribers notified
```

### Note Input

```text
User presses key A
  → runtime.noteOn(60, 0.75)
    → activeNotes updated
    → performance metrics updated
    → soundAdapter.noteOn(60, 0.75)
    → applyState()
```

---

## File Reference

| File               | Responsibility                     |
| ------------------ | ---------------------------------- |
| `createRuntime.ts` | Factory with mock adapter defaults |
| `runtime.ts`       | Orchestrator — public API          |
| `state.ts`         | StateStore with subscribe/commit   |
| `events.ts`        | Typed EventBus                     |
| `types.ts`         | RuntimeState, ControlName, etc.    |
| `index.ts`         | Barrel exports                     |

---

## Verification (Phase 3)

Automated check for runtime API, centralized state, mock adapter sync, and subscribers:

```bash
npm run verify:runtime
```

Manual smoke test:

```bash
npm run dev
```

1. Click **Play** — audio and ASCII visuals start
2. Select a preset — both engines load mapped presets; dock reflects control defaults
3. Move sidebar sliders — sound and visuals update in real time
4. Press **A–J** while playing — keyboard routes through interaction layer to both engines
5. Connect MIDI controller — Web MIDI via interaction layer (enable in sidebar Input settings)

---

## Interaction Layer (Phase 8)

All user input dispatches through `InteractionManager` before reaching the runtime. UI components never call adapters directly.

```text
UI / MIDI / Keyboard / Mouse / Touch
  ↓
InteractionManager → InputRouter
  ↓
Runtime → Adapters → Engines
```

See [docs/INTERACTION_LAYER.md](./docs/INTERACTION_LAYER.md).

---

## Phase 9: Application Experience

Next step: responsive polish, preset browser, performance mode, session persistence.
