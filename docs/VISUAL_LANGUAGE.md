# Visual Language

Plantasonic Phase 10 — expressive visual identity, motion system, and audio-reactive mapping.

The ASCII Visual Engine renders glyphs. Plantasonic defines **what each world means visually** — glyph families, patterns, motion quality, transitions, and how runtime state drives the scene.

---

## Visual Philosophy

1. **Every interaction produces audiovisual response** — notes, controls, tempo, and performance metrics all reach the visual engine.
2. **Motion communicates state** — animation is never decorative noise; it reflects energy, calm, growth, decay, rhythm, or instability.
3. **Each preset world is visually distinct** — no two worlds share the same glyph family + pattern + motion fingerprint.
4. **GSAP for transitions, engine for rendering** — world changes use GSAP crossfades on the stage canvas; the ASCII engine owns the render loop.
5. **Performance first** — only changed engine controls are updated; viewport quality adapts to device size.

---

## Architecture

```text
PresetWorld.visual (Plantasonic)
  ├── presetId → ascii-visual-engine bundled preset
  ├── glyphFamilies, patterns, motion, transition
  └── engineControls (optional overrides)

RuntimeState
  ├── controls (bloom, mold, density, chaos, brightness)
  ├── tempo, activeNotes
  └── performance (velocity, energy, activity)

PlantasiaAsciiAdapter
  ├── loadPreset(id, visual) → GSAP transition + applyVisualIdentity
  ├── applyState(state) → resolveEngineControls + diff sync
  └── resize → responsive quality preset

ascii-visual-engine (external)
  └── Canvas renderer, glyph presets, render loop
```

---

## Preset Visual Identity

Each world defines a `PresetVisualConfig` in `src/presets/types.ts`:

```typescript
visual: {
  presetId: 'glyphOrganicBloom',      // engine bundled preset
  glyphFamilies: ['organic', 'growth'],
  patterns: ['growth', 'bloom', 'roots'],
  motion: 'growth',
  transition: 'bloom',
  renderer: 'canvas',
  palette: 'warm green',
  animationCurve: 'easeOut',
  particleBehavior: 'drift',
  engineControls: { petals: 0.6 },    // optional overrides
  quality: 'high',                     // optional quality preset
}
```

### Registered Worlds

| World | Engine Preset | Motion | Transition | Character |
| ----- | ------------- | ------ | ---------- | --------- |
| Seed World | `glyphOrganicBloom` | growth | bloom | Organic expansion |
| Mold World | `glyphCorruptedBroadcast` | instability | collapse | Glitch decay |
| Flow World | `glyphFlowField` | rhythm | dissolve | Wind spirals |
| Zen World | `glyphMinimalZen` | silence | crossfade | Minimal stillness |
| Nebula World | `glyphParticleNebula` | energy | bloom | Particle orbit |

---

## Glyph Taxonomy

Defined in `src/visuals/language/glyphFamilies.ts`:

| Family | Character |
| ------ | --------- |
| organic | Curved, living forms |
| geometric | Grids, symmetry |
| minimal | Sparse, zen restraint |
| noise | Static, entropy |
| fractal | Self-similar branching |
| circuit | Digital pathways |
| water | Flow, ripples |
| growth | Outward expansion |
| corruption | Glitch, decay |
| atmospheric | Fog, ambient drift |

Worlds select one or more families to define visual character.

---

## Pattern Library

Defined in `src/visuals/language/patterns.ts`:

Growth, bloom, roots, branches, ripples, rain, wind, fog, particles, spiral, grid, wave, corruption, collapse, pulse, orbit.

Each pattern maps to a primary engine control (e.g. wind → `flowStrength`, corruption → `glitchAmount`).

Worlds combine multiple patterns for unique behavior.

---

## Motion Language

Defined in `src/visuals/language/motionLanguage.ts`:

| Profile | Communicates | Baseline tendency |
| ------- | ------------ | ----------------- |
| energy | High amplitude | ↑ amplitude, flowStrength |
| calm | Slow drift | ↓ randomness, moderate trails |
| growth | Outward expansion | ↑ strength, ↓ decay |
| decay | Collapse | ↑ decay, ↓ strength |
| rhythm | Tempo-synced pulse | ↑ frequency, amplitude |
| instability | Unpredictable | ↑ randomness, glitch |
| harmony | Balanced flow | ↑ symmetry, ↓ chaos |
| silence | Near-static | ↓ amplitude, trails |

On preset load, motion baselines are applied via `applyVisualIdentity()`.

---

## Audio → Visual Mapping

Defined in `src/visuals/language/audioReactiveMapping.ts`:

| Runtime signal | Visual effect | Engine control |
| -------------- | --------------- | -------------- |
| Velocity | Brightness, motion intensity | `trailAmount`, `amplitude`, note intensity |
| Pitch | Note position | `noteOn` x/y |
| Tempo | Animation timing | `speed` |
| Density (control) | Particle count | `density` |
| Bloom (control) | Expansion | `strength` |
| Mold (control) | Corruption | `glitchAmount` |
| Chaos (control) | Distortion | `randomness` |
| Sustain (active notes) | Persistence | `trailAmount` boost |
| Energy | Overall amplitude | `strength`, `amplitude`, `flowStrength` |
| Activity | Motion turbulence | `randomness`, `glitchAmount`, `density` |

Base slider values are modulated by live performance metrics in `resolveEngineControls()`. Only controls that change beyond a 0.005 threshold are sent to the engine.

---

## GSAP Transitions

World changes use `src/visuals/transitions/visualTransition.ts`:

| Transition | Effect |
| ---------- | ------ |
| crossfade | Opacity fade out/in |
| dissolve | Same as crossfade (extended duration) |
| bloom | Scale up, swap, scale down |
| collapse | Scale down, swap, restore |
| cut | Instant (reduced motion) |

Transition style and easing curve come from each world's `visual.transition` and `visual.animationCurve`.

GSAP is **not** used in the ASCII render loop.

---

## Renderer Architecture

Defined in `src/visuals/renderer/rendererAbstraction.ts`:

| Renderer | Status |
| -------- | ------ |
| canvas | **Live** — via ascii-visual-engine |
| webgl | Planned |
| pixi | Planned |
| three | Planned |
| terminal | Planned |
| svg | Planned |

`VisualRendererAdapter` interface documents the contract for future backends. Plantasonic does not implement alternate renderers in Phase 10.

### Responsive Quality

`resolveQualityForViewport(width, height)` selects engine quality:

- Mobile (<768px): `medium` or `low`
- Desktop: `medium`
- Large displays (>1080p): `high`

Applied on init and resize.

---

## Performance

- **Diff sync** — `diffEngineControls()` sends only changed values
- **VisualProfiler** — tracks `applyState` duration in dev mode
- **Threshold updates** — 0.005 minimum delta prevents redundant `setControl` calls
- **Engine owns rAF** — adapter `render()` is a no-op

Run `npm run verify:visual` to validate world uniqueness and mapping logic.

---

## Related Documentation

- [PRESETS.md](./PRESETS.md) — preset world authoring
- [ASCII_VISUAL_ENGINE_INTEGRATION.md](./ASCII_VISUAL_ENGINE_INTEGRATION.md) — adapter wiring
- [USER_EXPERIENCE.md](./USER_EXPERIENCE.md) — UI motion (overlays, panels)
- [ARCHITECTURE.md](../ARCHITECTURE.md) — system layers
