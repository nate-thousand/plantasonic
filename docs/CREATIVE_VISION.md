# Plantasonic Creative Vision and Engine Scope

**Authoritative creative constraints for the product.** Every audio engine, visual engine, preset, and interaction decision must align with this document before implementation.

Plantasonic is **not** a synthesizer with visuals attached. It is a **living, generative digital ecosystem** that encourages focus, curiosity, calm, exploration, and creativity.

If a feature does not strengthen this vision, it should not be added.

---

## Vision

Plantasonic is a living audiovisual instrument inspired by nature.

It exists somewhere between:

- ambient synthesizer
- digital terrarium
- musical ecosystem
- meditation tool
- art installation
- interactive sculpture
- procedural instrument
- generative composition system

The application should feel **alive**. It should never feel like a traditional DAW or software synthesizer.

Users should feel like they are **cultivating an evolving ecosystem** rather than programming a machine.

---

## Guiding Principles

Every sound should feel:

- organic
- imperfect
- evolving
- textured
- harmonic
- spacious
- calming
- surprising
- intentional

**Avoid:**

- harsh digital sounds
- static loops
- repetitive sequences
- mechanical behavior
- aggressive EDM aesthetics
- menu-heavy workflows
- parameter overload

---

## Audio Engine Scope

The sound engine should prioritize:

### Living Sound

Notes should breathe. Parameters should drift naturally. Voices should evolve over time. Nothing should remain perfectly static.

### Generative Harmony

Music should emerge rather than be programmed.

Use:

- probability
- constrained randomness
- evolving motifs
- melodic memory
- harmonic relationships
- gradual transformation

Avoid obvious looping.

### Organic Motion

Every parameter may move slowly — filter drift, oscillator detuning, stereo movement, envelope variation, texture evolution, effect modulation. Movement should feel like wind, water, sunlight, or growth.

### Musical Simplicity

Controls should represent **musical ideas**, not synthesis jargon.

Prefer concepts such as: Bloom, Growth, Roots, Wind, Sunlight, Rain, Moss, Canopy, Mist, Soil, Petals, Branches.

Avoid exposing dozens of technical parameters.

### Sound Character

Prioritize: warm, soft, textured, analog-inspired, tape-like, granular, airy, woody, glassy, organic noise, subtle imperfections.

Avoid sterile digital precision.

**Engine boundary:** Generative behavior, voice evolution, and ecological metaphors live in `plantasia-sound-engine`. Plantasonic maps performance controls to ecology via `src/audio/` — it does not reimplement synthesis.

---

## Visual Engine Scope

The visual engine should represent the **invisible life of the sound**. Visuals should never be decorative. Every animation should communicate something occurring within the ecosystem.

### Living Organism

Visual behavior should resemble: plants growing, spores spreading, pollen drifting, vines branching, roots expanding, fungi networking, water flowing, sunlight shifting, insects swarming, leaves responding to wind.

Avoid generic audio spectrum visualizers.

### Audio Driven

Every visible motion should relate to sound — note density, harmonic complexity, rhythm, dynamics, modulation, probability, spatial movement. Visuals should reveal musical structure.

### Slow Evolution

The world should continue changing even without interaction. Nothing should freeze completely. The application should appear alive when idle.

### Restraint

Avoid visual clutter. Negative space is important. Movement should be intentional. Calm should dominate over spectacle.

**Engine boundary:** Glyph rendering, simulation, and preset scenes live in `ascii-visual-engine`. Plantasonic defines world identity, motion language, and audio-reactive mapping via `src/visuals/` and `docs/VISUAL_LANGUAGE.md`.

---

## Interaction Philosophy

Users should **explore** rather than configure. Interactions should feel playful. Small adjustments should produce meaningful musical and visual change. Controls should encourage experimentation.

Avoid exposing unnecessary technical complexity.

### Accessibility

Reduce cognitive load. Encourage flow, curiosity, discovery, relaxation, and experimentation. Avoid overwhelming the user with dense control panels.

**App boundary:** Progressive disclosure (dock → sidebar → overlays), performance mode, and reduced-motion support live in `src/ui/` — see `docs/USER_EXPERIENCE.md`.

---

## Design Language

Everything should feel handcrafted. Inspired by:

- botanical illustration
- scientific field journals
- vintage synthesizers
- museum installations
- Japanese gardens
- terrariums
- modular instruments
- natural history collections

Minimal. Elegant. Purposeful.

**Design boundary:** Tokens and Bootstrap theme come from `plantasonic-design-system`. Shell layout and ASCII visual language are documented in `DESIGN_SYSTEM.md` and `docs/VISUAL_LANGUAGE.md`.

---

## Performance Goals

The application should feel **immediate**. Audio should respond instantly. Visuals should remain smooth. Interactions should feel tactile.

**Performance always takes priority over decorative effects.** See `docs/PERFORMANCE_REPORT.md`.

---

## Scope Boundaries

Plantasonic is **not**:

- a DAW
- a workstation
- a tracker
- a modular patch editor
- a clone of existing synthesizers
- a feature checklist

It is a **focused audiovisual instrument**.

---

## Decision Filter

Before implementing any feature — especially engine or preset changes — ask:

1. Does this make Plantasonic feel more alive?
2. Does it strengthen the connection between sound and visuals?
3. Does it encourage exploration instead of configuration?
4. Does it reduce complexity rather than increase it?
5. Does it support the feeling of cultivating a living ecosystem?
6. Would this still make sense if the UI disappeared and only the experience remained?

If the answer to any of these is **no**, reconsider the implementation.

---

## Success Criteria

Plantasonic succeeds when:

- the audio feels alive rather than programmed
- the visuals reveal the behavior of the sound rather than merely reacting to it
- the interface disappears behind the experience
- every interaction encourages curiosity
- users feel they are nurturing a living digital ecosystem instead of operating software
- the experience remains coherent, calming, expressive, and unmistakably Plantasonic

---

## Current Implementation Alignment

How the existing product maps to this vision (as of 2026-06-28):

| Vision element | Current expression | Location |
| -------------- | ------------------ | -------- |
| Musical simplicity | Five ecological controls: Bloom, Mold, Density, Chaos, Brightness | `src/runtime/types.ts`, sidebar |
| Living worlds | Five preset worlds (Seed, Mold, Flow, Zen, Nebula) as distinct ecosystems | `src/presets/worlds/` |
| Generative harmony | Sound engine Generator + ecology mapping | `plantasia-sound-engine`, `src/audio/generativeMapping.ts` |
| Audio-driven visuals | Performance metrics modulate glyph controls | `src/visuals/language/audioReactiveMapping.ts` |
| Living organism visuals | Glyph families, motion profiles, organic patterns | `docs/VISUAL_LANGUAGE.md` |
| Exploration over configuration | Preset browser, minimal dock, performance mode | `docs/USER_EXPERIENCE.md` |
| Calm / restraint | Reduced motion, theme support, negative space in stage-first layout | Settings, `globals.scss` |
| Immediate response | Audio-first note path, UI control coalescing | `docs/PERFORMANCE_REPORT.md` |

### Guardrails — do not drift toward

| Risk | Why it conflicts | Preferred direction |
| ---- | ---------------- | ------------------- |
| Adding OSC/filter/ADSR panels | Parameter overload, DAW aesthetics | Extend ecological metaphors or hide complexity in presets |
| Spectrum/bar visualizers | Decorative, not organism-like | Map musical structure to glyph motion and density |
| Randomize without musical memory | Mechanical, not evolving | Constrained randomness with motif continuity (engine) |
| Feature parity checklists | Scope creep | Run every proposal through the decision filter |
| Aggressive transitions | Spectacle over calm | Prefer bloom/crossfade; honor reduced motion |
| Idle freeze | Dead ecosystem | Engine-level drift and slow evolution when idle |

### Known gaps (vision-aligned backlog, not blockers)

- Pause transport — only if it serves calm listening, not DAW workflow
- Additional engine species as worlds — only when each feels like a distinct ecosystem
- Save/randomize preset — only if it supports cultivation, not patch editing

---

## Related Documentation

| Document | Role |
| -------- | ---- |
| [VISUAL_LANGUAGE.md](./VISUAL_LANGUAGE.md) | Visual identity and motion implementation |
| [USER_EXPERIENCE.md](./USER_EXPERIENCE.md) | Interaction and progressive disclosure |
| [PRESETS.md](./PRESETS.md) | World registry and audiovisual pairing |
| [SOUND_ENGINE_INTEGRATION.md](./SOUND_ENGINE_INTEGRATION.md) | Audio adapter contract |
| [ASCII_VISUAL_ENGINE_INTEGRATION.md](./ASCII_VISUAL_ENGINE_INTEGRATION.md) | Visual adapter contract |
| [PERFORMANCE_REPORT.md](./PERFORMANCE_REPORT.md) | Latency and responsiveness constraints |
| [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) | Handcrafted UI language |
