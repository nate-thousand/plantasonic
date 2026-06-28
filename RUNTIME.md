# Runtime Specification

Describes the Plantasonic runtime layer: shared state, subscriptions, control flow, and lifecycle. **No implementation details for engines** — this document covers orchestration only.

Implementation files: `src/runtime/`

---

## Shared State

The runtime maintains a single `AppState` object managed by `StateStore`:

```typescript
interface AppState {
  transport: TransportState; // Phase, playback, active preset
  viewport: ViewportState; // Dimensions, DPR, fullscreen
  performance: PerformanceState; // Frame rate, latency, reduced motion
  parameters: Record<string, ParameterValue>; // Engine parameter snapshot
}
```

### Transport State

| Field            | Type             | Description                          |
| ---------------- | ---------------- | ------------------------------------ |
| `phase`          | `RuntimePhase`   | Current lifecycle phase              |
| `isPlaying`      | `boolean`        | Whether engines are actively running |
| `activePresetId` | `string \| null` | Currently loaded preset              |

### Viewport State

| Field              | Type      | Description                |
| ------------------ | --------- | -------------------------- |
| `width`            | `number`  | Stage width in CSS pixels  |
| `height`           | `number`  | Stage height in CSS pixels |
| `devicePixelRatio` | `number`  | Screen pixel density       |
| `isFullscreen`     | `boolean` | Fullscreen mode active     |

### Performance State

| Field              | Type      | Description                       |
| ------------------ | --------- | --------------------------------- |
| `targetFrameRate`  | `number`  | Desired render frame rate         |
| `audioLatencyHint` | `string`  | Web Audio latency preference      |
| `reducedMotion`    | `boolean` | Respects `prefers-reduced-motion` |

---

## Subscriptions

UI components subscribe to state changes without polling:

```typescript
const unsubscribe = stateStore.subscribe((state, patch) => {
  // React to state changes
  updateStatusDisplay(state.transport.phase);
});

// Cleanup on unmount
unsubscribe();
```

### Subscription Rules

1. Subscribers receive immutable state snapshots.
2. The `patch` argument contains only the fields that changed.
3. Subscribers must not mutate the state object.
4. Unsubscribe during component teardown to prevent leaks.

---

## Control Flow

### Layer Communication

```text
UI ──(calls)──→ Runtime ──(delegates)──→ Adapters ──→ Engines
                  │
                  ├── stateStore.patch()
                  └── eventBus.emit()
                        │
                        └── UI subscribers react
```

UI never calls adapters or engines directly. All coordination flows through the runtime.

### Event Bus

Typed events decouple layers:

| Event                 | Payload              | Trigger               |
| --------------------- | -------------------- | --------------------- |
| `runtime:init`        | `{ container }`      | Initialization begins |
| `runtime:ready`       | `undefined`          | Adapters initialized  |
| `runtime:start`       | `undefined`          | Playback started      |
| `runtime:stop`        | `undefined`          | Playback stopped      |
| `runtime:destroy`     | `undefined`          | Teardown complete     |
| `preset:load`         | `{ presetId }`       | Preset load requested |
| `preset:loaded`       | `{ presetId }`       | Preset load complete  |
| `parameter:set`       | `{ path, value }`    | Parameter changed     |
| `viewport:resize`     | `{ width, height }`  | Stage resized         |
| `viewport:fullscreen` | `{ isFullscreen }`   | Fullscreen toggled    |
| `input:noteOn`        | `{ note, velocity }` | MIDI/key press        |
| `input:noteOff`       | `{ note }`           | MIDI/key release      |
| `error`               | `{ source, error }`  | Error in any layer    |

---

## Preset Flow

```text
1. User selects preset in UI
2. UI calls runtime.loadPreset(id)
3. Runtime emits 'preset:load'
4. Runtime calls both adapters in parallel:
     soundAdapter.loadPreset(id)
     asciiAdapter.loadPreset(id)
5. On success:
     stateStore.patch({ activePresetId: id })
     eventBus.emit('preset:loaded')
6. On failure:
     eventBus.emit('error')
     stateStore.patch({ phase: 'error' })
```

Presets are loaded atomically — both engines receive the same preset ID simultaneously.

---

## Input Flow

Input modules (MIDI, keyboard, touch) translate hardware events into runtime events:

```text
Hardware Input
  ↓
Input Module (midi/keyboard/touch)
  ↓
eventBus.emit('input:noteOn', { note, velocity })
  ↓
Runtime handler
  ↓
soundAdapter.noteOn(note, velocity)
```

Visual input (touch gestures on stage) will route through the ASCII adapter via `setParameter` in future phases.

---

## Lifecycle

### Phases

```text
idle → initializing → ready → running → stopped
                              ↓
                            error
```

| Phase          | Description                                 |
| -------------- | ------------------------------------------- |
| `idle`         | Application loaded, runtime not initialized |
| `initializing` | Adapters initializing                       |
| `ready`        | Initialized, awaiting user action           |
| `running`      | Engines actively producing output           |
| `stopped`      | Engines stopped, ready to restart           |
| `error`        | Unrecoverable failure occurred              |

### Lifecycle Methods

```text
createPlantasonicApp()
  └── runtime.init({ container })
        ├── soundAdapter.init()
        ├── asciiAdapter.init()
        └── phase: ready

runtime.start()
  ├── soundAdapter.start()
  ├── asciiAdapter.start()
  └── phase: running

runtime.stop()
  ├── soundAdapter.stop()
  ├── asciiAdapter.stop()
  └── phase: stopped

runtime.destroy()
  ├── soundAdapter.destroy()
  ├── asciiAdapter.destroy()
  ├── eventBus.clear()
  └── phase: idle
```

---

## Event Model

### Synchronous Dispatch

Events are dispatched synchronously. Handlers execute in registration order within the same tick.

### Error Propagation

Errors in adapter methods are caught by the runtime and emitted as `error` events. The runtime does not throw to callers — it returns result objects or emits events.

### Future: Async Events

Long-running operations (preset loading, engine initialization) use `async/await` at the runtime method level. Completion is signaled via state patches and events, not promise returns to UI.

---

## Render Loop (Future)

When the ASCII engine is integrated, the runtime will coordinate the render loop:

```text
requestAnimationFrame loop
  ├── asciiAdapter.render()
  ├── Check performance.targetFrameRate
  └── Schedule next frame
```

The render loop will be owned by the runtime, not the adapter or UI.

---

## File Reference

| File         | Responsibility                |
| ------------ | ----------------------------- |
| `runtime.ts` | Orchestrator class            |
| `state.ts`   | StateStore with subscriptions |
| `events.ts`  | Typed EventBus                |
| `types.ts`   | Shared type definitions       |
| `index.ts`   | Barrel exports                |
