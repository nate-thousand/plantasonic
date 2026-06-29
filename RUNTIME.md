# Runtime Specification

The Plantasonic runtime is the **integration layer** between UI, engine adapters, and future input modules (MIDI, keyboard, touch). Phase 5 integrates the real sound engine; ASCII remains mock until Phase 6.

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
| `setPreset(id)`           | Load preset into both adapters                    |
| `noteOn(note, velocity?)` | Trigger note, update active notes and performance |
| `noteOff(note)`           | Release note                                      |
| `setControl(name, value)` | Set performance control (0–1)                     |
| `setTempo(bpm)`           | Set tempo (20–300)                                |
| `getState()`              | Return immutable state snapshot                   |
| `subscribe(callback)`     | Register state change listener                    |
| `resize(w, h)`            | Forward viewport size to ASCII adapter            |
| `destroy()`               | Tear down adapters and reset state                |

Factory: `createRuntime()` in `src/runtime/createRuntime.ts` — defaults to `PlantasiaSoundAdapter` and `MockAsciiAdapter`.

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

---

## Integration Rule

**UI components must only call runtime methods.**

```text
UI (ControlDock, Stage, Sidebar)
  ↓  runtime.start(), setControl(), etc.
Runtime
  ↓  adapter methods + applyState()
PlantasiaSoundAdapter (Phase 5) / MockAsciiAdapter (Phase 6 pending)
  ↓  plantasia-sound-engine / future ASCII Visual Engine
```

UI must **not** import or call `src/audio/` or `src/visuals/` adapters directly.

Binding: `src/ui/bindRuntime.ts` → `bindRuntimeToShell(runtime, shell)`

---

## Sound Adapter (Phase 5)

| Adapter               | File                        | Behavior                                      |
| --------------------- | --------------------------- | --------------------------------------------- |
| PlantasiaSoundAdapter | `src/audio/soundAdapter.ts` | Wraps `createPlantasiaEngine()` — live audio  |
| MockAsciiAdapter      | `src/visuals/mockAsciiAdapter.ts` | Logs only until Phase 6               |

Sound adapter implements `applyState()` with deduplicated control/tempo sync. Console diagnostics use `[PlantasiaSound]` prefix.

See [docs/SOUND_ENGINE_INTEGRATION.md](./docs/SOUND_ENGINE_INTEGRATION.md).

---

## Mock ASCII Adapter (Phase 3 — until Phase 6)

| Adapter          | File                              | Behavior                                     |
| ---------------- | --------------------------------- | -------------------------------------------- |
| MockAsciiAdapter | `src/visuals/mockAsciiAdapter.ts` | Logs all calls; `applyState()` logs snapshot |

Console output uses `[MockAscii]` prefix.

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

1. Click **Play** — `[PlantasiaSound] audio context initialized`; generative audio starts
2. Select a preset — engine loads species; dock reflects preset and control defaults
3. Move sidebar sliders — sound changes in real time; dock updates values
4. Press **A–G** while playing — notes trigger through engine; active note count updates

---

## Ready for ASCII Engine Integration (Phase 6)

Replace mock ASCII adapter in `createRuntime()`:

```typescript
createRuntime({
  asciiAdapter: new AsciiVisualAdapter(),
});
```

Sound adapter is production-ready — no further runtime API changes required.

The runtime API and state shape remain stable — only adapter implementations change.
