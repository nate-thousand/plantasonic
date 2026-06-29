# Plantasonic Design System

**Authoritative specification** for Plantasonic application chrome. Plantasonic is the reference implementation of the [AI Native Design System](../../frameworks/ai-native-design-system/).

Engine aesthetics (ASCII visuals, audio timbres) are documented separately — see [docs/VISUAL_LANGUAGE.md](./docs/VISUAL_LANGUAGE.md).

---

## Design Philosophy

1. **Instrument-first** — The visualizer stage is the primary focus. Chrome supports performance without competing for attention.
2. **Token-driven** — All colors, spacing, typography, and motion derive from `$ds-*` semantic tokens. No hardcoded values in components.
3. **Bootstrap as implementation** — Bootstrap 5.0.2 provides component behavior; Plantasonic tokens provide identity. Never edit `node_modules/bootstrap/`.
4. **Reusable platform** — Components in `src/ui/controls/` are factory functions usable by future applications.
5. **Accessible by default** — Keyboard navigation, focus visibility, reduced motion, and touch targets are non-negotiable.

---

## Integration Flow

```text
AI Product Framework          → docs/product-framework/, .cursor/rules/
AI Native Design System       → src/design-system/, docs/design-system/ (index)
Plantasonic Application       → src/ui/, src/app/, src/runtime/
External Engines              → npm dependencies (sound, ASCII)
```

```text
Figma Variables (export)
  ↓
src/design-system/tokens/figma/tokens.json   W3C Design Tokens JSON
  ↓  npm run tokens:sync
src/design-system/tokens/figma/generated/      SCSS primitives
  ↓
src/design-system/tokens/                      Aliases + CSS custom properties
  ↓
src/design-system/bootstrap/                   Bootstrap variable overrides
  ↓
src/styles/bootstrap.scss                      Bootstrap partial imports
  ↓
src/styles/globals.scss                        ps-* layout and app shell
  ↓
src/ui/controls/                               Reusable component factories
  ↓
src/ui/components/                             Shell composition
```

---

## Figma Workflow

**Recommended — paste a link in Cursor (no JSON export):**

1. Copy your Figma file URL
2. Paste in chat: *"Pull my Figma tokens from [URL]"*
3. Cursor reads variables via Figma MCP → imports → syncs SCSS

**Optional — CLI (Figma Enterprise + access token):**

```bash
FIGMA_ACCESS_TOKEN=figd_... npm run tokens:pull -- "https://www.figma.com/design/FILEKEY/..."
```

```bash
npm run tokens:import   # apply figma.snapshot.json
npm run tokens:sync     # regenerate SCSS
npm run tokens:verify   # CI check
```

See [src/design-system/tokens/figma/README.md](./src/design-system/tokens/figma/README.md).

---

## Token Pipeline

### Naming

| Prefix  | Usage |
| ------- | ----- |
| `$ds-*` | Design system semantic tokens — preferred in new code |
| `$ps-*` | Plantasonic product aliases — app shell compatibility |
| `--ds-*` | CSS custom properties — runtime theming bridge |

### Token Modules

| File | Contents |
| ---- | -------- |
| `_colors.scss` | Surfaces, text, borders, status, brand |
| `_typography.scss` | Font families, scale, weights |
| `_spacing.scss` | 4px grid spacing scale |
| `_layout.scss` | Shell dimensions, radius |
| `_shadows.scss` | Elevation shadows |
| `_motion.scss` | Transition durations and easing |
| `_css-vars.scss` | CSS custom property exports |

### Color System

Dark instrument theme optimized for long sessions:

| Token | Value role |
| ----- | ---------- |
| `$ds-color-surface-default` | App background |
| `$ds-color-surface-raised` | Nav, dock, sidebar, cards |
| `$ds-color-surface-sunken` | Stage background |
| `$ds-color-surface-overlay` | Inputs, dropdowns, modals |
| `$ds-color-text-primary` | Primary text |
| `$ds-color-text-secondary` | Labels, secondary text |
| `$ds-color-text-muted` | Hints, captions |
| `$ds-color-primary` | Primary actions (Play) |
| `$ds-color-accent` | Focus, active states, slider thumbs |

### Typography

| Token | Size | Use |
| ----- | ---- | --- |
| `$ds-font-size-display` | 2.5rem | Marketing (future) |
| `$ds-font-size-h1`–`h4` | 2rem–1.125rem | Headings |
| `$ds-font-size-body` | 1rem | Body text |
| `$ds-font-size-body-sm` | 0.875rem | Controls, descriptions |
| `$ds-font-size-caption` | 0.75rem | Labels, dock status |
| `$ds-font-family-mono` | JetBrains Mono | Status, tempo, values |

### Spacing

4px base grid: `$ds-space-1` (4px) through `$ds-space-8` (64px). Bootstrap `$spacer` aligns with `$ds-space-3` (16px).

### Shadows

| Token | Use |
| ----- | --- |
| `$ds-shadow-sm` | Cards, tooltips |
| `$ds-shadow-md` | Default elevation |
| `$ds-shadow-lg` | Modals, overlays, dropdowns |
| `$ds-shadow-focus` | Focus rings |
| `$ps-shadow-sidebar` | Mobile sidebar drawer |

---

## Bootstrap Mapping

All Bootstrap variables overridden in `src/design-system/bootstrap/_overrides.scss`:

| Category | Status |
| -------- | ------ |
| Theme colors | Complete |
| Typography | Complete |
| Buttons | Complete |
| Forms (input, select, checkbox, range) | Complete |
| Cards | Complete |
| Navigation / navbar | Complete |
| Nav tabs | Complete |
| Dropdowns | Complete |
| Modals | Complete |
| Offcanvas | Complete |
| Tooltips | Complete |
| Progress | Complete |
| Alerts | Complete |
| Badges | Complete |
| Spinners | Complete |
| Tables | Complete |
| List group | Complete |
| Close button | Complete |
| Shadows / radius | Complete |

Post-Bootstrap polish in `src/design-system/bootstrap/_components.scss` — slider thumbs, button touch targets, form transitions.

Import entry: `src/styles/bootstrap.scss`

---

## Layout System

### Shell Grid

```text
┌─────────────────────────────────────┐
│ TopNav ($ps-nav-height)             │
├──────────┬──────────────────────────┤
│ Sidebar  │ Stage (primary focus)    │
│ (opt.)   │                          │
├──────────┴──────────────────────────┤
│ ControlDock ($ps-dock-height)       │
└─────────────────────────────────────┘
```

| Token | Value | Element |
| ----- | ----- | ------- |
| `$ps-nav-height` | 3.5rem | Top navigation |
| `$ps-dock-height` | 4.5rem | Control dock |
| `$ps-sidebar-width` | 18rem | Collapsible menu |

### Responsive Behavior (Phase 9 + 3.5)

| Viewport | Behavior |
| -------- | -------- |
| Desktop (≥992px) | Full nav; sidebar pushes stage when open |
| Tablet (768–991px) | Dock wraps; notes section hidden |
| Mobile (<768px) | Sidebar overlays; dock stacks transport row |
| Landscape (short) | Reduced dock height |
| Fullscreen | `ps-app--fullscreen`; GSAP transition |
| Performance mode | `ps-app--performance`; minimal chrome |

Completed in Phase 9: safe-area insets, touch targets (2.75rem), no horizontal scroll, overlay system.

### Layout Classes

| Class | Purpose |
| ----- | ------- |
| `ps-app` | Root grid shell |
| `ps-main` | Stage + sidebar grid |
| `ps-sidebar` | Collapsible control panel |
| `ps-stage` | Visualizer region |
| `ps-dock` | Bottom transport dock |
| `ps-overlay-host` | Modal overlay container |
| `ps-app--performance` | Performance mode |
| `ps-app--fullscreen` | Fullscreen adjustments |

---

## Component Library

Reusable factories in `src/ui/controls/`:

| Component | Factory | Used by |
| --------- | ------- | ------- |
| Button | `createButton()` | TopNav, ControlDock, CollapsibleMenu |
| Slider | `createSlider()`, `createSliderRow()` | ControlDock, CollapsibleMenu |
| Toggle | `createToggle()` | CollapsibleMenu, Settings |
| Knob | `createKnob()` | Available for future dense controls |
| PresetSelector | `createPresetSelector()` | ControlDock |
| Status | `createStatus()` | TopNav, ControlDock |
| Loading | `createLoading()` | Available for init/export states |
| Notification | `createNotification()` | Available for toast messages |
| Dialog | `createDialogShell()` | Overlay pattern |
| Toolbar | `createToolbar()` | TopNav actions |
| Dropdown | `createDropdown()` | Available for future menus |
| Tooltip | `applyTooltip()` | Title + aria-describedby helper |

### Shell Components

| Component | File | Role |
| --------- | ---- | ---- |
| AppShell | `src/ui/layouts/AppShell.ts` | Root layout orchestration |
| TopNav | `src/ui/components/TopNav.ts` | Navigation bar |
| Stage | `src/ui/components/Stage.ts` | Visualizer region |
| ControlDock | `src/ui/components/ControlDock.ts` | Transport + preset + tempo |
| CollapsibleMenu | `src/ui/components/CollapsibleMenu.ts` | Performance controls |
| OverlayHost | `src/ui/components/OverlayHost.ts` | Modal system |
| PresetBrowser | `src/ui/components/PresetBrowser.ts` | Preset overlay |
| SettingsPanel | `src/ui/components/SettingsPanel.ts` | Settings overlay |
| ErrorBanner | `src/ui/components/ErrorBanner.ts` | Error states |

### Interaction States

| State | Treatment |
| ----- | --------- |
| Default | Token colors, no shadow |
| Hover | Lighter background, slider thumb scale |
| Focus | `$ds-shadow-focus` outline |
| Active/pressed | Scale 0.98 on buttons, `aria-pressed` |
| Disabled | `$btn-disabled-opacity` (0.45) |
| Error | `$ds-color-error`, alert-danger |

---

## Motion Language

GSAP for UI transitions only — ASCII render loop is engine-owned.

| Interaction | Implementation | Duration |
| ----------- | -------------- | -------- |
| Overlay open/close | `motionController.ts` | 0.2–0.28s |
| Sidebar open | `animateSidebarIn()` | 0.25s |
| Sidebar close | `animateSidebarOut()` | 0.2s |
| Preset change (UI) | `animatePresetChange()` | 0.35s |
| Control feedback | `animateControlFeedback()` | 0.18s |
| Fullscreen | `animateFullscreenTransition()` | 0.35s |
| Loading | `animateLoadingIn/Out()` | 0.2–0.25s |
| Visual world change | `visualTransition.ts` (Phase 10) | 0.4–0.55s |

### Reduced Motion

Disabled when:
- User setting: `data-ps-reduced-motion`
- User setting: `data-ps-motion-off`
- System: `prefers-reduced-motion: reduce`

CSS fallback in `globals.scss` sets animation/transition duration to 0.01ms.

Token durations: `$ds-transition-fast` (150ms), `$ds-transition-base` (250ms), `$ds-transition-slow` (400ms).

---

## ASCII Visual Language (Documentation)

Implementation lives in `src/visuals/language/` and [docs/VISUAL_LANGUAGE.md](./docs/VISUAL_LANGUAGE.md). Design system documents the philosophy:

### Glyph Families

Organic, geometric, minimal, noise, fractal, circuit, water, growth, corruption, atmospheric — each preset world selects one or more.

### Pattern Taxonomy

Growth, bloom, roots, branches, ripples, rain, wind, fog, particles, spiral, grid, wave, corruption, collapse, pulse, orbit — combinable per world.

### Motion Profiles

Energy, calm, growth, decay, rhythm, instability, harmony, silence — communicate state quality, not decoration.

### Visual Hierarchy

1. **Stage** — full bleed ASCII canvas, darkest surface
2. **Active controls** — dock transport, current preset
3. **Secondary chrome** — nav, sidebar sliders
4. **Overlays** — preset browser, settings (elevated, `$ds-shadow-lg`)

### Density Scales

Runtime controls (0–1) map to engine density, strength, and particle count. User sliders are primary; performance metrics modulate on top.

### Audio → Visual Philosophy

Every interaction produces audiovisual response. Velocity drives brightness; energy drives amplitude; sustain extends trails; pitch maps to note position. See [docs/VISUAL_LANGUAGE.md](./docs/VISUAL_LANGUAGE.md) for mapping table.

### Future Renderer Strategy

Canvas is live. WebGL, PixiJS, Three.js, terminal, and SVG renderers are documented in `src/visuals/renderer/rendererAbstraction.ts` — not implemented in Plantasonic.

---

## Accessibility

### Keyboard Navigation

| Key | Action |
| --- | ------ |
| Tab / Shift+Tab | Move focus between controls |
| Enter / Space | Activate buttons, preset cards |
| Escape | Close overlays |
| A–J | Performance notes |
| P | Performance mode |
| / | Preset browser |
| ? | Settings |

### Focus

- `:focus-visible` outline using `$ds-shadow-focus`
- All interactive elements reachable by keyboard
- Overlay traps focus via `aria-modal`

### Semantic HTML

- `nav`, `aside`, `section`, `footer` landmarks
- `role="dialog"` on overlays
- `aria-live="polite"` on runtime status
- `aria-valuenow` on range inputs

### Contrast

Text on dark surfaces meets WCAG AA:
- Primary text `#e6edf3` on `#0d1117` — sufficient
- Muted text `#6e7681` — used for labels only, not body content

### Touch Targets

Minimum 2.75rem (`--ps-touch-target`) on buttons, nav actions, preset cards.

### Scalable Typography

Relative rem units throughout. Browser zoom supported.

---

## Maintenance

### Sync Workflow

1. Update canonical file in `ai-native-design-system`
2. Sync `src/design-system/tokens/`
3. Verify `_overrides.scss`
4. Run `npm run build && npm run lint`
5. Update CHANGELOG.md

### What This Document Does Not Cover

- ASCII engine rendering (see `ascii-visual-engine` repo)
- Audio synthesis (see `plantasia-sound-engine` repo)
- Preset world content (see [docs/PRESETS.md](./docs/PRESETS.md))
- Engineering workflow (see `docs/product-framework/`)

### Future Evolution

- CSS custom properties as primary runtime theming layer
- Product-grade knob components with MIDI learn UI
- Theme variants (light mode) via token swap
- Component Storybook or visual regression tests
- Direct Figma MCP pull when file key is configured

---

## Reference Index

Detailed token catalogs remain in `docs/design-system/` as supplements:

- [TOKENS.md](./docs/design-system/TOKENS.md)
- [COLORS.md](./docs/design-system/COLORS.md)
- [TYPOGRAPHY.md](./docs/design-system/TYPOGRAPHY.md)
- [SPACING.md](./docs/design-system/SPACING.md)
- [BOOTSTRAP_MAPPING.md](./docs/design-system/BOOTSTRAP_MAPPING.md)
- [COMPONENTS.md](./docs/design-system/COMPONENTS.md) — index pointing here
- [PATTERNS.md](./docs/design-system/PATTERNS.md)

**This file is the authoritative specification.** Supplement docs provide quick-reference catalogs.
