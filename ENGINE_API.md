# Engine API Contracts

Interface definitions for the Plantasia Sound Engine and Plantasia ASCII Engine. These are **contracts only** — no implementations exist in Plantasonic.

Adapters in `src/audio/` and `src/visuals/` implement these interfaces and wrap external engine packages.

---

## Sound Engine

External package: **Plantasia Sound Engine** (future dependency)

### Interface

```typescript
interface SoundEngineContract {
  /** Starts audio output and internal processing. */
  start(): Promise<void>;

  /** Stops audio output and releases active voices. */
  stop(): Promise<void>;

  /** Loads a sound preset by identifier. */
  loadPreset(presetId: string): Promise<void>;

  /** Triggers a note-on event with optional velocity (0–127). */
  noteOn(note: number, velocity?: number): void;

  /** Triggers a note-off event for the given MIDI note. */
  noteOff(note: number): void;

  /** Sets a sound parameter by dot-notation path. */
  setParameter(path: string, value: number | string | boolean): void;
}
```

### Adapter Boundary

```typescript
interface SoundAdapter {
  init(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  loadPreset(presetId: string): Promise<void>;
  noteOn(note: number, velocity?: number): void;
  noteOff(note: number): void;
  setParameter(path: string, value: number | string | boolean): void;
  destroy(): Promise<void>;
}
```

Implementation: `src/audio/soundAdapter.ts`

### Expected Parameter Paths (examples)

| Path            | Type   | Description                     |
| --------------- | ------ | ------------------------------- |
| `osc.frequency` | number | Oscillator frequency in Hz      |
| `filter.cutoff` | number | Filter cutoff frequency         |
| `env.attack`    | number | Envelope attack time in seconds |
| `master.volume` | number | Master output gain (0–1)        |

Exact parameter schemas will be defined by the Sound Engine package.

### Lifecycle

```text
init() → start() → [noteOn/noteOff/setParameter]* → stop() → destroy()
                ↕
           loadPreset() (any time after init)
```

---

## ASCII Engine

External package: **Plantasia ASCII Engine** (future dependency)

### Interface

```typescript
interface AsciiEngineContract {
  /** Starts the render loop. */
  start(): Promise<void>;

  /** Stops the render loop. */
  stop(): Promise<void>;

  /** Renders a single frame to the output surface. */
  render(): void;

  /** Resizes the render surface to the given dimensions. */
  resize(width: number, height: number): void;

  /** Loads a visual preset by identifier. */
  loadPreset(presetId: string): Promise<void>;

  /** Sets a visual parameter by dot-notation path. */
  setParameter(path: string, value: number | string | boolean): void;
}
```

### Adapter Boundary

```typescript
interface AsciiAdapter {
  init(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  render(): void;
  resize(width: number, height: number): void;
  loadPreset(presetId: string): Promise<void>;
  setParameter(path: string, value: number | string | boolean): void;
  destroy(): Promise<void>;
}
```

Implementation: `src/visuals/asciiAdapter.ts`

### Expected Parameter Paths (examples)

| Path              | Type   | Description                    |
| ----------------- | ------ | ------------------------------ |
| `grid.columns`    | number | ASCII grid column count        |
| `grid.rows`       | number | ASCII grid row count           |
| `color.palette`   | string | Named color palette identifier |
| `animation.speed` | number | Animation speed multiplier     |

Exact parameter schemas will be defined by the ASCII Engine package.

### Lifecycle

```text
init() → start() → [render/setParameter]* → stop() → destroy()
                ↕                    ↕
           loadPreset()          resize() (on viewport change)
```

---

## Shared Conventions

### Preset IDs

Both engines use the same preset identifier strings. A preset world in Plantasonic maps one ID to coordinated sound and visual configurations.

### Parameter Values

| Type      | Usage                                             |
| --------- | ------------------------------------------------- |
| `number`  | Continuous parameters (frequency, speed, opacity) |
| `string`  | Discrete selections (palette name, wave shape)    |
| `boolean` | Toggle states (enabled, muted)                    |

### Error Handling

Adapters should catch engine errors and re-emit them via the runtime event bus:

```typescript
eventBus.emit('error', { source: 'soundAdapter', error });
```

The runtime transitions to `error` phase and surfaces the failure to the UI.

---

## Integration Checklist

When connecting real engines:

- [ ] Install engine packages as npm dependencies
- [ ] Replace `NullSoundAdapter` with concrete implementation
- [ ] Replace `NullAsciiAdapter` with concrete implementation
- [ ] Verify all interface methods delegate correctly
- [ ] Test preset loading synchronizes both engines
- [ ] Test parameter changes propagate to both engines
- [ ] Document engine-specific parameter schemas here
