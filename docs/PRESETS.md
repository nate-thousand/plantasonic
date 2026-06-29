# Preset Worlds

Phase 7 guide for unified audiovisual preset worlds in Plantasonic.

---

## Concept

Each **preset world** defines one complete audiovisual identity:

```text
Preset World (app id, e.g. seed-world)
  ↓
Sound identity   → engine preset id (e.g. plantasonic)
Visual identity  → engine preset id (e.g. glyphOrganicBloom)
Default controls → runtime ControlValues
Default tempo    → runtime BPM
  ↓
runtime.setPreset(worldId)
  ↓
Both adapters load engine presets + runtime state syncs
```

World definitions live in `src/presets/`. The runtime resolves worlds and passes **engine preset ids** to adapters. UI reads metadata from the registry — it never hardcodes engine mappings or default values.

---

## Schema

```typescript
interface PresetWorld {
  id: string;              // App-level id (seed-world)
  name: string;            // Display name
  description: string;     // Short description for stage overlay
  tags: readonly string[];
  version: string;
  sound: { presetId: string };   // plantasia-sound-engine bundled preset
  visual: PresetVisualConfig;    // engine preset + visual identity (Phase 10)
  defaults: {
    controls?: Partial<ControlValues>;
    tempo?: number;
  };
}

interface PresetVisualConfig {
  presetId: string;
  glyphFamilies: readonly GlyphFamily[];
  patterns: readonly VisualPattern[];
  motion: MotionProfile;
  transition: VisualTransition;
  renderer: RendererId;
  palette: string;
  animationCurve: AnimationCurve;
  particleBehavior: ParticleBehavior;
  engineControls?: Readonly<Record<string, number>>;
  quality?: 'ultra' | 'high' | 'medium' | 'low' | 'batterySaver';
}
```

Types: `src/presets/types.ts`

---

## File layout

```text
src/presets/
├── types.ts           Schema
├── registry.ts        resolvePresetWorld(), listPresetWorlds(), mergeWorldDefaults()
├── manifest.ts        Backward-compatible re-exports
├── index.ts           Barrel exports
└── worlds/
    ├── index.ts       PRESET_WORLDS array (registration order = UI order)
    ├── seedWorld.ts
    ├── moldWorld.ts
    ├── flowWorld.ts
    ├── zenWorld.ts
    └── nebulaWorld.ts
```

See [VISUAL_LANGUAGE.md](./VISUAL_LANGUAGE.md) for glyph families, patterns, and motion profiles.

---

## Authoring a new world

1. Create `src/presets/worlds/myWorld.ts`:

```typescript
import type { PresetWorld } from '../types.ts';

export const myWorld: PresetWorld = {
  id: 'my-world',
  name: 'My World',
  description: 'One-line audiovisual identity.',
  tags: ['experimental'],
  version: '1.0.0',
  sound: { presetId: 'plantasonic' },
  visual: {
    presetId: 'glyphOrganicBloom',
    glyphFamilies: ['organic', 'growth'],
    patterns: ['growth', 'bloom'],
    motion: 'growth',
    transition: 'bloom',
    renderer: 'canvas',
    palette: 'warm green',
    animationCurve: 'easeOut',
    particleBehavior: 'drift',
  },
  defaults: {
    tempo: 90,
    controls: { bloom: 0.5, mold: 0.4, density: 0.6, chaos: 0.3, brightness: 0.5 },
  },
};
```

2. Register in `src/presets/worlds/index.ts`:

```typescript
import { myWorld } from './myWorld.ts';

export const PRESET_WORLDS = [seedWorld, moldWorld, myWorld];
```

3. No UI changes required — ControlDock builds options from `listPresetWorlds()`.

---

## Runtime flow

`runtime.setPreset(presetId)` in `src/runtime/runtime.ts`:

1. Resolve world via `resolvePresetWorld(presetId)` — throws if unknown
2. Load sound: `soundAdapter.loadPreset(world.sound.presetId)`
3. Load visual: `asciiAdapter.loadPreset(world.visual.presetId)`
4. Merge defaults: `mergeWorldDefaults(world, soundResult.controls)`
5. Commit runtime state: `{ preset: world.id, controls, tempo }`
6. `syncAdapters()` applies full state to both engines

World defaults override engine ecology defaults. Sound load failure aborts before state commit.

---

## UI integration

| Component | Integration |
| --------- | ----------- |
| `ControlDock.ts` | Options from `listPresetWorlds()`; status shows world name |
| `Stage.ts` | Title + description from `resolvePresetWorld(state.preset)` |
| `bindRuntime.ts` | Unchanged — calls runtime only |

UI imports `@/presets/registry` for **display metadata only**. All load behavior goes through `runtime.setPreset()`.

---

## Registered worlds

| World id | Name | Sound preset | Species | Visual preset | Tempo |
| -------- | ---- | ------------ | ------- | ------------- | ----- |
| `seed-world` | Seed World | `plantasonic` | seed | `glyphOrganicBloom` | 72 |
| `mold-world` | Mold World | `vine` | mold | `glyphCorruptedBroadcast` | 84 |
| `flow-world` | Flow World | `bloom` | flowers | `glyphFlowField` | 96 |
| `zen-world` | Zen World | `mycelium` | bacteria | `glyphMinimalZen` | 60 |
| `nebula-world` | Nebula World | `mutation` | mold | `glyphParticleNebula` | 108 |

Engine presets not mapped to a world (`seed`, `root`, `fern`, `coral`, `crystal`, `juno-flowers`) remain loadable via the engine API for future worlds or debugging.

---

## Verification

```bash
npm run verify:presets   # engine + world preset validation
npm run verify:sound     # real adapter preset loading
npm run verify:runtime   # world load, defaults merge, unknown preset rejection
npm run dev              # select worlds from dock preset dropdown
```

---

## Related docs

- [INTEGRATION_PLAN.md](./INTEGRATION_PLAN.md) — Phase 7 exit criteria
- [SOUND_ENGINE_INTEGRATION.md](./SOUND_ENGINE_INTEGRATION.md) — sound adapter control mapping
- [ASCII_VISUAL_ENGINE_INTEGRATION.md](./ASCII_VISUAL_ENGINE_INTEGRATION.md) — visual adapter control mapping
