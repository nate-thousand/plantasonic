# Interaction Layer

Phase 8 guide for the unified Plantasonic input architecture.

---

## Architecture

All input devices normalize events and dispatch through the interaction layer. The runtime remains the only bridge to engine adapters.

```text
MIDI / Keyboard / Mouse / Touch / Automation (future)
  ↓
InteractionManager
  ↓
InputRouter
  ↓
Runtime API
  ↓
Sound Adapter + ASCII Adapter
```

**Rules:**

1. No input module imports engine packages.
2. No UI component calls adapters directly.
3. All paths produce identical runtime events regardless of source.
4. Engine MIDI bypass removed — Web MIDI routes through `runtime.noteOn()` / `noteOff()`.

---

## Module structure

```text
src/interaction/
├── types.ts              Normalized event types
├── inputRouter.ts        Runtime dispatch
├── interactionManager.ts Central coordinator
├── velocity.ts           Velocity curves
└── index.ts              Factory: createInteractionManager()

src/midi/                 Web MIDI + MIDI Learn
src/keyboard/             QWERTY performance keyboard
src/mouse/                Fine adjust + double-click reset
src/touch/                Touch sliders + stage long-press
src/automation/           Interface only (Phase 8)
src/services/             SettingsStore (localStorage)
```

---

## InteractionManager

Created by `createInteractionManager(runtime)` in `src/interaction/index.ts`.

| Responsibility | Detail |
| -------------- | ------ |
| Module registration | keyboard, mouse, touch, midi |
| Event normalization | `InteractionEvent` with `source` + `action` |
| Runtime dispatch | via `InputRouter` |
| MIDI Learn | `startMidiLearn()`, `completeMidiLearn()` |
| Settings | `getSettings()`, `updateSettings()` |

### Allowed runtime methods (via router)

- `start()`, `stop()`
- `noteOn()`, `noteOff()`
- `setControl()`, `setPreset()`, `setTempo()`

---

## Input modules

### MIDI (`src/midi/midiModule.ts`)

- Web MIDI API device discovery and hot-plug
- Note on/off with velocity curve
- CC messages → learned mappings
- Sustain pedal (CC 64)
- Pitch bend → chaos control
- Channel filter from settings
- Akai MPK Mini and generic controllers supported

### Keyboard (`src/keyboard/keyboardModule.ts`)

- Chromatic QWERTY map (A–J row + sharps W/E/T/Y/U)
- Octave shift: `Z` down, `X` up
- Sustain: spacebar
- Transport: Enter = start, Escape = stop
- Configurable via settings (enable, default octave, velocity)

### Mouse (`src/mouse/mouseModule.ts`)

- Shift + drag on sliders: fine adjustment
- Double-click: reset to default
- Targets elements with `data-ps-control` attribute

### Touch (`src/touch/touchModule.ts`)

- Vertical drag on sliders for mobile
- Long-press on stage: start transport
- Respects touch sensitivity setting

### Automation (`src/automation/types.ts`)

- `AutomationProvider` interface defined
- `NullAutomationRegistry` placeholder — no implementation yet
- Future: timers, sequencers, scripts, AI agents, OSC

---

## MIDI Learn

1. Call `interaction.startMidiLearn({ type: 'control', name: 'bloom' })`
2. Move a hardware CC control
3. Mapping saved to localStorage via `SettingsStore`
4. Reset all mappings: sidebar **Reset MIDI Learn** button

Mappings persist under key `plantasonic.interaction.settings`.

---

## Settings

Persisted locally via `SettingsStore` (`src/services/settingsStore.ts`):

| Setting | Default |
| ------- | ------- |
| `midiEnabled` | true |
| `keyboardEnabled` | true |
| `touchEnabled` | true |
| `mouseSensitivity` | 1 |
| `touchSensitivity` | 1 |
| `velocityCurve` | linear |
| `defaultOctave` | 4 |
| `midiChannel` | 0 (omni) |
| `keyboardVelocity` | 0.75 |
| `midiLearnMappings` | [] |

Sidebar **Input** panel toggles MIDI, keyboard, touch and sets default octave.

---

## UI integration

- `ControlDock` and sidebar sliders dispatch through `InteractionManager` with `source: 'ui'`
- `bindRuntimeToShell(interaction, shell)` replaces direct runtime wiring
- UI reads state via `interaction.subscribe()` — same runtime snapshots
- Sliders tagged with `data-ps-control="<name>"` for mouse/touch modules

---

## Extensibility

To add a new input source:

1. Implement `InteractionModule` in a new folder under `src/`
2. Register in `createInteractionManager()`
3. Dispatch normalized `InteractionEvent` objects only
4. Never import `@/audio/` or `@/visuals/`

Future-ready for: Webcam tracking, OSC, gamepads, Bluetooth controllers, custom hardware.

---

## Verification

```bash
npm run verify:interaction
npm run verify:runtime
npm run build
npm run dev
```

Manual QA:

1. Play/Stop from dock → runtime starts both engines
2. Keyboard A–J → notes via runtime (both engines)
3. MIDI controller → notes/CC via runtime (requires browser MIDI permission)
4. Shift+drag slider → fine mouse adjust
5. Toggle MIDI off in sidebar → MIDI module disconnects
6. Refresh page → settings persist

---

## Related docs

- [RUNTIME.md](../RUNTIME.md) — runtime API
- [ARCHITECTURE.md](../ARCHITECTURE.md) — module boundaries
- [docs/SOUND_ENGINE_INTEGRATION.md](./SOUND_ENGINE_INTEGRATION.md) — sound adapter (no direct MIDI)
