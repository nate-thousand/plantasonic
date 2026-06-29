# Sound Engine Integration

Phase 5 integration guide for **Plantasia Sound Engine** in Plantasonic.

---

## Engine version

| Field | Value |
| ----- | ----- |
| Package | `plantasia-sound-engine` |
| Pinned tag | `1.0.0-beta.1` |
| npm spec | `github:nate-thousand/plantasia-sound-engine#1.0.0-beta.1` |
| Entry point | `createPlantasiaEngine()` from package root |
| Engine docs | [plantasia-sound-engine/docs/API.md](https://github.com/nate-thousand/plantasia-sound-engine/blob/v2-sound-world-engine/docs/API.md) |

---

## Integration architecture

```text
UI (unchanged)
  ↓  runtime.start(), setControl(), setPreset(), noteOn/Off
Runtime (source of truth)
  ↓  SoundAdapter interface
PlantasiaSoundAdapter (src/audio/soundAdapter.ts)
  ↓  createPlantasiaEngine() facade
Plantasia Sound Engine v2
  ↓  SpeciesManager → active Sound World
Audio output (Tone.js / Web Audio — internal to engine)
```

**Rules:**

1. UI never imports `plantasia-sound-engine` or `tone`.
2. Runtime never imports the engine directly — only the adapter interface.
3. `PlantasiaSoundAdapter` is the sole bridge to the engine package.
4. Runtime state remains authoritative; the adapter applies runtime snapshots to the engine via `setParameter()` and `applyState()`.

---

## Adapter responsibilities

`PlantasiaSoundAdapter` in `src/audio/soundAdapter.ts`:

| Method | Engine call | Notes |
| ------ | ----------- | ----- |
| `init()` | `createPlantasiaEngine()` | Does not unlock audio context (requires user gesture) |
| `start()` | `initialize()` → `loadDefaultSpecies()` if needed → `start()` | Audio context unlocks on Play |
| `stop()` | `allNotesOff()` → `stopSpecies()` | Idempotent |
| `loadPreset(id)` | `resolvePresetToSpecies()` → `loadPreset()` | Returns preset default controls to runtime |
| `noteOn(midi, vel)` | `noteOn(midiToNoteName(midi), vel)` | Velocity 0–1 |
| `noteOff(midi)` | `noteOff(midiToNoteName(midi))` | |
| `setParameter(path, value)` | `setControl()` or `setTempo()` | Deduped via control cache |
| `applyState(state)` | Sync controls + tempo when changed | Avoids duplicate engine calls |
| `destroy()` | `engine.dispose()` | Releases MIDI, scheduler, species |

Errors are caught, logged with `[PlantasiaSound]` prefix, and emitted on the runtime event bus as `error` — the app does not crash.

---

## Runtime mapping

### Lifecycle

| Runtime | Adapter | Engine |
| ------- | ------- | ------ |
| `runtime.init()` | `adapter.init()` | `createPlantasiaEngine()` |
| `runtime.start()` | `adapter.start()` | `initialize()` + `start()` |
| `runtime.stop()` | `adapter.stop()` | `allNotesOff()` + `stopSpecies()` |
| `runtime.destroy()` | `adapter.destroy()` | `dispose()` |

### Performance

| Runtime | Adapter | Engine |
| ------- | ------- | ------ |
| `noteOn(note, velocity)` | `noteOn()` | `engine.noteOn(noteName, velocity)` |
| `noteOff(note)` | `noteOff()` | `engine.noteOff(noteName)` |

### Presets

| Runtime | Adapter | Engine |
| ------- | ------- | ------ |
| `setPreset(worldId)` | `loadPreset(world.sound.presetId)` | `engine.loadPreset(enginePresetId)` |

Runtime resolves app-level world ids via `src/presets/registry.ts` before calling adapters. See [PRESETS.md](./PRESETS.md).

When a preset loads successfully, the adapter returns `{ controls }` derived from engine ecology defaults. Runtime merges world defaults over engine defaults before committing state.

### Control mapping

Plantasonic runtime controls (0–1) map to engine ecological controls:

| Runtime control | Engine ecological control | Typical meaning |
| --------------- | ------------------------- | --------------- |
| `bloom` | `bloom` | Harmonic / spatial opening |
| `mold` | `mold` | Degradation / tape wear |
| `density` | `growth` | Temporal / generative density |
| `chaos` | `bacteria` | Particle / stochastic motion |
| `brightness` | `roots` | Foundation / body weight |

Runtime sends `controls.{name}` paths; adapter translates to `engine.setControl()`.

### Tempo

| Runtime | Engine |
| ------- | ------ |
| `setTempo(bpm)` | `engine.setTempo(bpm)` + transport BPM |

---

## Supported engine capabilities (Phase 5)

Exposed through the adapter:

- v2 Sound World lifecycle (Seed, Flowers, Mold, Bacteria species)
- Bundled preset loading with ecology defaults
- Real-time note input via interaction layer (keyboard, MIDI → runtime → adapter)
- Ecological performance controls (mapped from runtime sliders)
- Transport tempo (20–300 BPM)
- Graceful error handling and console diagnostics

**Not yet exposed to UI** (available on engine for future adapter extension):

- `getWaveform()` / `getLevel()` metering
- Semantic engine events (`notePlayed`, `densityChanged`, etc.)
- v1 `playPreset()` legacy path
- MIDI Learn mode

---

## Known limitations

1. **Both engines integrated** — sound and ASCII visuals run through adapters (Phases 5–6 complete).
2. **Audio context requires user gesture** — first `Play` click initializes audio; silent until then is expected browser behavior.
3. **Preset worlds are app-scoped** — use world ids (`seed-world`, `mold-world`) with `runtime.setPreset()`; engine preset ids are resolved by the world registry.
4. **MIDI input** — handled by `src/midi/` interaction module, not the sound adapter. See [INTERACTION_LAYER.md](./INTERACTION_LAYER.md).
5. **Runtime controls ≠ engine ecology names** — mapping is adapter-owned; do not assume 1:1 naming in UI copy.

---

## Future extension points

| Extension | Location | Notes |
| --------- | -------- | ----- |
| Metering → UI | Adapter + runtime subscriber | `engine.getLevel()` |
| Visual event bridge | Adapter forwards `engine.on()` | Optional Phase 7+ UI sync |
| Full preset manifest | `src/presets/registry.ts` | Complete — see PRESETS.md |
| Species metadata in UI | World name/description in Stage | Complete |
| Dedicated MIDI module | `src/midi/` | Phase 8 input layer |

---

## Verification

```bash
npm run build
npm run lint
npm run verify:runtime   # runtime contract (mock sound + mock ASCII)
npm run dev              # browser: Play, presets, sliders, A–G keys
```

Browser smoke test:

1. Click **Play** — audio context initializes, Seed species starts generative output
2. Select **Seed World** — `plantasonic` preset loads
3. Select **Mold World** — `vine` species loads with decay character
4. Move sidebar sliders — ecological controls affect sound in real time
5. Press **A–G** while playing — notes trigger through engine
6. Connect MIDI controller — notes route when engine is running

---

## Related documentation

- [ENGINE_API.md](../ENGINE_API.md) — adapter contracts and parameter paths
- [RUNTIME.md](../RUNTIME.md) — runtime public API
- [ARCHITECTURE.md](../ARCHITECTURE.md) — system boundaries
- [docs/INTEGRATION_PLAN.md](./INTEGRATION_PLAN.md) — Phase 5 checklist
