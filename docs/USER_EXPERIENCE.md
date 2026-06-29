# User Experience

Plantasonic Phase 9 application experience — principles, navigation, responsive behavior, motion, accessibility, performance mode, and settings.

See [CREATIVE_VISION.md](./CREATIVE_VISION.md) for interaction philosophy and accessibility intent.

---

## UX Principles

1. **Instrument-first** — The ASCII visualizer stage is always the primary focus. Chrome supports performance; it never competes with the stage.
2. **Single source of truth** — Preset metadata comes from `listPresetWorlds()` in the runtime registry. UI never duplicates preset lists.
3. **Interaction layer only** — Controls dispatch through `InteractionManager`. UI never calls adapters or engines directly.
4. **Progressive disclosure** — Transport and preset name live in the dock; detailed controls in the sidebar; full settings and preset browser in overlays.
5. **Calm motion** — GSAP transitions enhance feedback without distraction. Reduced motion is respected at every level.

---

## Navigation Model

One mental model: **play at the bottom, tune at the side, explore worlds from the dock.**

```text
Top Nav
├── Panel toggle → Sidebar (Controls | Setup tabs)
├── Status (Playing / MIDI)
├── Perform → Performance mode
└── Fullscreen

Sidebar (single panel)
├── Controls — performance sliders + MIDI Learn per control
└── Setup — Input, Motion, Display (formerly separate Settings overlay + sidebar Input)

Bottom Dock
├── Transport (Play / Stop)
├── World → preset browser overlay (only entry point for worlds)
├── Tempo slider
└── Notes count

Overlay
└── World browser — cards, search, tags, favorites, recents
```

Removed duplicate entry points: top-nav Presets/Settings buttons, sidebar Input toggles, and “All Settings…” link.

### Keyboard Shortcuts

| Key | Action |
| --- | ------ |
| `A`–`J` | Performance notes (via keyboard module) |
| `Space` | Play / stop |
| `P` | Toggle performance mode |
| `/` | Open world browser |
| `?` | Open sidebar → Setup tab |
| `Escape` | Close overlay or sidebar (browser default) |

---

## Application Shell

| Region | Component | Role |
| ------ | --------- | ---- |
| Top | `TopNav` | Brand, nav actions, runtime status |
| Left | `CollapsibleMenu` | Performance sliders, quick input toggles |
| Center | `Stage` | ASCII canvas + status overlay |
| Bottom | `ControlDock` | Transport, preset, tempo |
| Overlay | `OverlayHost` | Preset browser and settings panels |
| Banner | `ErrorBanner` | User-facing error guidance |

Performance mode (`ps-app--performance`) hides navigation and sidebar, minimizes the dock to transport + preset + exit, and maximizes stage area.

---

## Responsive Behavior

Breakpoints align with Bootstrap tiers:

| Viewport | Navigation | Panel | Dock | Overlays |
| -------- | ---------- | ----- | ---- | -------- |
| Desktop (≥768px) | Full labels + status | Sidebar **pushes** stage when open | Full layout | Centered modal |
| Tablet (768–991px) | Icon + text on nav buttons | Push layout | Notes hidden | Centered modal |
| Mobile (<768px) | Icon-only Perform / Fullscreen | **Drawer** over stage + backdrop tap to close | Two-row: transport, then world + tempo | Bottom sheet + safe areas |
| Landscape (short) | Compact nav/dock | Narrower drawer | Reduced height | 95vh max |

Mobile panel behavior:

- Tap **hamburger** → drawer with Controls | Setup tabs
- Tap **backdrop** or **Escape** → close drawer (unless world overlay is open)
- Opening **world browser** or **Perform** closes the drawer automatically
- `?` shortcut opens drawer on Setup tab

Requirements enforced in `globals.scss`:

- No horizontal scrolling on shell
- Safe-area insets on nav, dock, and overlays (`env(safe-area-inset-*)`)
- Minimum 2.75rem touch targets on interactive controls
- High-DPI canvas via runtime resize (not CSS scaling)

---

## Preset Browser

Data source: `listPresetWorlds()` from `src/presets/registry.ts`.

Features:

- Visual preset cards with name, description, tags, version
- Search across name, description, and tags
- Tag filters (categories from world `tags` field)
- Favorites — persisted in `AppSettingsStore`
- Recently used — last 5 presets, persisted locally
- Active preset highlighted

Loading a preset calls `interaction.setPreset(id, 'ui')` which routes through the interaction layer to runtime.

---

## Performance Mode

Distraction-free layout for live performance and presentation:

- Hidden top navigation and sidebar
- Minimal dock: Play/Stop, preset name, tempo, exit button
- Keyboard shortcut `P` to toggle
- Fullscreen compatible (`ps-app--fullscreen`)
- MIDI-first — all performance input unchanged

Exit via dock **Exit Perform** button or `P` again.

---

## Settings Architecture

Two persistence stores:

| Store | Key | Scope |
| ----- | --- | ----- |
| `SettingsStore` | `plantasonic.interaction.settings` | MIDI, keyboard, touch, octave, velocity, MIDI Learn |
| `AppSettingsStore` | `plantasonic.app.settings` | Motion, reduced motion, theme, favorites, recent presets |

All setup UI lives in the **sidebar Setup tab** (Input · Motion · Display sub-tabs). There is no separate Settings overlay.

---

## Motion Guidelines

Implemented in `src/ui/motion/motionController.ts` using GSAP:

| Event | Animation |
| ----- | --------- |
| Overlay open | Fade + slide up (0.28s) |
| Overlay close | Fade + slide down (0.2s) |
| Sidebar open (mobile) | Slide from left |
| Preset change | Stage opacity pulse |
| Control feedback | Brief scale pulse on Play/Stop |

Motion is disabled when:

- User enables **Reduce motion** in settings
- User disables **Enable animations**
- System `prefers-reduced-motion: reduce` is active

Document attributes: `data-ps-reduced-motion`, `data-ps-motion-off`.

---

## Error States

`ErrorBanner` listens to runtime `eventBus` `error` events and maps sources to friendly messages:

| Source | User message |
| ------ | ------------ |
| `runtime:init` | Unable to start — refresh |
| `runtime:setPreset` | Preset could not load |
| `soundAdapter:init` | Audio unavailable |
| `asciiAdapter:init` | Visual engine unavailable |
| MIDI-related | MIDI unavailable — use keyboard |

Messages avoid implementation details. Dismissible via banner button.

---

## Accessibility

- Semantic landmarks: `nav`, `aside`, `section`, `footer`
- ARIA on overlays: `role="dialog"`, `aria-modal`, `aria-labelledby`
- Focus-visible outlines on interactive elements
- `aria-live="polite"` on runtime status
- Range inputs expose `aria-valuenow`
- Reduced motion CSS overrides when motion disabled
- Keyboard navigation for preset cards (Enter/Space to activate)

---

## Related Documentation

- [INTERACTION_LAYER.md](./INTERACTION_LAYER.md) — input routing
- [PRESETS.md](./PRESETS.md) — preset world schema
- [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) — tokens and layout classes
- [ARCHITECTURE.md](../ARCHITECTURE.md) — system layers
