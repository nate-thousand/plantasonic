# Engine API Contracts

Interface definitions for the Plantasia Sound Engine and Plantasia ASCII Engine. Adapters in `src/audio/` and `src/visuals/` implement these interfaces and wrap external engine packages.

**Phase 5:** Sound engine integrated via `PlantasiaSoundAdapter`. See [docs/SOUND_ENGINE_INTEGRATION.md](./docs/SOUND_ENGINE_INTEGRATION.md).

---

## Sound Engine

External package: **plantasia-sound-engine** `1.0.0-beta.1`

Implementation: `src/audio/soundAdapter.ts` → `PlantasiaSoundAdapter`

### Engine public API (actual)

```typescript
import { createPlantasiaEngine, resolvePresetToSpecies } from 'plantasia-sound-engine';

const engine = createPlantasiaEngine();

await engine.initialize();       // unlock AudioContext (user gesture)
await engine.loadPreset('plantasonic');
await engine.start();

engine.noteOn('C4', 0.85);         // note string + velocity 0–1
engine.noteOff('C4');
engine.allNotesOff();

engine.setControl('bloom', 0.65);  // ecological controls, 0–1
engine.setTempo(96);

engine.stopSpecies();
engine.dispose();

await engine.enableMidi();         // Web MIDI when available
```

Ecological controls: `growth`, `bloom`, `roots`, `mold`, `bacteria`.

Species: `seed`, `flowers`, `mold`, `bacteria`.

### Adapter Boundary

```typescript
interface SoundAdapter {
  init(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  loadPreset(presetId: string): Promise<PresetLoadResult | undefined>;
  noteOn(note: number, velocity?: number): void;
  noteOff(note: number): void;
  setParameter(path: string, value: number | string | boolean): void;
  destroy(): Promise<void>;
}

interface PresetLoadResult {
  controls: ControlValues;
}
```

### Runtime → Engine parameter paths

| Runtime path | Adapter maps to | Type |
| ------------ | --------------- | ---- |
| `controls.bloom` | `setControl('bloom', value)` | number 0–1 |
| `controls.mold` | `setControl('mold', value)` | number 0–1 |
| `controls.density` | `setControl('growth', value)` | number 0–1 |
| `controls.chaos` | `setControl('bacteria', value)` | number 0–1 |
| `controls.brightness` | `setControl('roots', value)` | number 0–1 |
| `tempo` | `setTempo(bpm)` | number 20–300 |

### Lifecycle

```text
init() → start() → [noteOn/noteOff/setParameter]* → stop() → destroy()
                ↕
           loadPreset() (any time after init; returns default controls)
```

### Error handling

Adapters catch engine errors and emit via the runtime event bus:

```typescript
eventBus.emit('error', { source: 'soundAdapter:loadPreset', error });
```

---

## ASCII Engine

External package: **Plantasia ASCII Engine** (future dependency — Phase 6)

Implementation: `src/visuals/mockAsciiAdapter.ts` (mock until Phase 6)

### Interface

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

---

## Shared Conventions

### Preset IDs

Plantasonic UI demo ids (`seed-world`, `mold-world`) map to engine bundled presets via `PLANTASONIC_PRESET_MAP` in `src/audio/controlMapping.ts`.

### Parameter Values

| Type      | Usage                                             |
| --------- | ------------------------------------------------- |
| `number`  | Continuous parameters (controls, tempo)           |
| `string`  | Discrete selections (future)                      |
| `boolean` | Toggle states (future)                            |

---

## Integration Checklist

- [x] Install `plantasia-sound-engine@1.0.0-beta.1`
- [x] Implement `PlantasiaSoundAdapter`
- [x] Wire `createRuntime()` to real sound adapter
- [x] Document engine parameter mapping
- [ ] Replace `MockAsciiAdapter` with real ASCII engine (Phase 6)
- [ ] Test preset loading synchronizes both engines (Phase 6+)
