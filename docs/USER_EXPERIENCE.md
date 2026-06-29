# User Experience

See **[NAVIGATION.md](./NAVIGATION.md)** for the authoritative navigation architecture (Perform / Sound / Visuals / Environment, command palette, inspector).

See [CREATIVE_VISION.md](./CREATIVE_VISION.md) for interaction philosophy.

---

## UX Principles

1. **Instrument-first** — The ASCII stage is the hero; chrome recedes to a calm icon rail and minimal topbar, and appears only when reached for.
2. **Progressive disclosure** — Perform essentials on the transport bar; the sidebar rail expands on hover; Sound, Visuals, and Environment open in the inspector.
3. **Keyboard-first discovery** — Command palette (⌘K, /) for worlds, controls, and actions.
4. **Interaction layer only** — UI dispatches through `InteractionManager`; never touches engines directly.
5. **Calm motion** — GSAP transitions respect reduced motion at every level.

---

## Quick reference

| Surface | Purpose |
| ------- | ------- |
| Design system shell | Icon-rail nav (expands on hover), topbar status, ⌘K search, Focus mode |
| Transport bar | Play, Stop, world, live readouts, single Controls toggle |
| Inspector | Sound · Visuals · Environment tabs |
| Command palette | Universal search (design system) |
| Overlays | World browser, settings, help |

| Key | Action |
| --- | ------ |
| ⌘K / / | Command palette |
| P | Focus mode |
| Enter / Esc | Play / Stop |

---

## Related files

| File | Role |
| ---- | ---- |
| `docs/NAVIGATION.md` | Full IA documentation |
| `src/shell/` | Design-system application shell integration |
| `src/ui/components/ControlDock.ts` | Transport bar |
| `src/ui/components/InspectorPanel.ts` | Contextual inspector |
| `src/ui/experience/appExperience.ts` | Shell wiring |
