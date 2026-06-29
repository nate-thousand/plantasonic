# ASCII Visual Engine Integration

Phase 6 integration guide for **ASCII Visual Engine** in Plantasonic.

---

## Engine version

| Field | Value |
| ----- | ----- |
| Package | `ascii-visual-engine` |
| Pinned tag | `v0.1.0` |
| Local spec | `file:../ascii-visual-engine` (build `dist/` before install) |
| Repository | [github.com/nate-thousand/ascii-visual-engine](https://github.com/nate-thousand/ascii-visual-engine) |
| Entry point | `AsciiEngine` from package root |
| Engine docs | [ascii-visual-engine/API.md](https://github.com/nate-thousand/ascii-visual-engine/blob/v0.1.0/API.md) |

> **Note:** The package is not published to npm yet. Clone the engine repo as a sibling directory, run `npm install && npm run build`, then `npm install` in Plantasonic. CI checks out and builds the engine automatically.

---

## Integration architecture

```text
UI (unchanged)
  ↓  runtime.start(), setControl(), setPreset(), noteOn/Off
Runtime (source of truth)
  ↓  AsciiAdapter interface
PlantasiaAsciiAdapter (src/visuals/plantasiaAsciiAdapter.ts)
  ↓  new AsciiEngine({ canvas, autoStart: false })
ASCII Visual Engine
  ↓  Canvas renderer + plugin pipeline
Fullscreen visual stage (#ps-stage canvas)
```

**Rules:**

1. UI never imports `ascii-visual-engine`.
2. Runtime never imports the engine directly — only the adapter interface.
3. `PlantasiaAsciiAdapter` is the sole bridge to the engine package.
4. Runtime state remains authoritative; the adapter applies runtime snapshots via `setParameter()` and `applyState()`.

---

## Adapter responsibilities

`PlantasiaAsciiAdapter` in `src/visuals/plantasiaAsciiAdapter.ts`:

| Method | Engine call | Notes |
| ------ | ----------- | ----- |
| `init(mount)` | `new AsciiEngine({ canvas, autoStart: false })` | Creates canvas in `#ps-stage`, hides placeholder |
| `start()` | `disableKeyboardInput()` → `start()` | Runtime-controlled lifecycle; keyboard input disabled (Stage A–J demo owns keys) |
| `stop()` | `inputPanic()` → `stop()` | Clears held notes |
| `loadPreset(id)` | `setPresetById(mappedId)` | Maps Plantasonic ids via `visualControlMapping.ts` |
| `setParameter(path, value)` | `setControl()`, `noteOn()`, `noteOff()` | Handles `controls.*`, `tempo`, `note`, `noteOff` |
| `applyState(state)` | Sync controls, tempo, active notes | Deduped via control cache |
| `resize(w, h)` | `engine.resize(w, h)` | Called from app shell resize observer |
| `render()` | no-op | Engine owns its rAF loop |
| `destroy()` | `engine.destroy()` | Removes canvas, restores placeholder |

Errors are caught, logged with `[PlantasiaAscii]` prefix, and emitted on the runtime event bus as `error`.

---

## Runtime mapping

### Lifecycle

| Runtime | Adapter | Engine |
| ------- | ------- | ------ |
| `runtime.init({ container })` | `adapter.init(container)` | Creates canvas + engine |
| `runtime.start()` | `adapter.start()` | `start()` render loop |
| `runtime.stop()` | `adapter.stop()` | `inputPanic()` + `stop()` |
| `runtime.destroy()` | `adapter.destroy()` | `destroy()` |

### Performance

| Runtime | Adapter | Engine |
| ------- | ------- | ------ |
| `noteOn(note, velocity)` | `setParameter('note', note)` + `applyState` | `noteOn({ id, intensity, x, y })` |
| `noteOff(note)` | `setParameter('noteOff', note)` + `applyState` | `noteOff({ id })` |

### Presets

App-level preset world ids resolve to ASCII engine preset ids in `src/presets/worlds/`. See [PRESETS.md](./PRESETS.md).

| World id | ASCII engine preset |
| -------- | ------------------- |
| `seed-world` | `glyphOrganicBloom` |
| `mold-world` | `glyphCorruptedBroadcast` |

Adapters receive engine preset ids directly from the runtime — no mapping in `visualControlMapping.ts`.

### Controls

| Runtime control | ASCII engine control |
| --------------- | -------------------- |
| `bloom` | `strength` |
| `mold` | `glitchAmount` |
| `density` | `density` |
| `chaos` | `randomness` |
| `brightness` | `trailAmount` |
| `tempo` (BPM) | `speed` (BPM / 72) |

---

## Stage mounting

The app passes `shell.stage` (`#ps-stage`) to `runtime.init({ container })`. The adapter:

1. Appends a full-bleed `<canvas class="ps-stage__canvas">` to the stage.
2. Hides `.ps-stage__placeholder` while the engine is active.
3. Restores the placeholder on `destroy()`.

The UI `Stage.ts` component is unchanged — status overlay text still updates from runtime state.

---

## Development setup

```bash
# Sibling checkout (recommended)
git clone https://github.com/nate-thousand/ascii-visual-engine.git ../ascii-visual-engine
cd ../ascii-visual-engine && git checkout v0.1.0 && npm install && npm run build

cd ../plantasonic && npm install && npm run dev
```

---

## Verification

```bash
npm run build
npm run lint
npm run verify:runtime   # uses mock adapters (headless)
npm run dev              # manual: Play → ASCII renders in stage
```

---

## Mock adapter (tests only)

`scripts/mocks/mockAsciiAdapter.ts` logs adapter calls for `scripts/verify-runtime.ts`. It is not used in production `createRuntime()`.
