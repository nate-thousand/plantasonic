# Plantasonic Design System

## Overview

Plantasonic consumes the [AI Native Design System](../../ai-native-design-system/) through `src/design-system/`. Token definitions, Bootstrap mapping, and UI rules come from the external repository — Plantasonic holds product imports and app-shell wiring only.

See [docs/design-system/README.md](./docs/design-system/README.md) for the full integration map.

## Integration Flow

```text
AI Product Framework
  → project process (docs/product-framework/, .cursor/rules/)

AI Native Design System
  → tokens and Bootstrap UI (src/design-system/, docs/design-system/)

Plantasonic
  → app shell, runtime, presets, integration (src/ui/, src/runtime/, src/app/)

Sound Engine
  → external npm dependency (src/audio/soundAdapter.ts — not yet installed)

ASCII Visual Engine
  → external npm dependency (src/visuals/asciiAdapter.ts — not yet installed)
```

## Token Pipeline

```text
ai-native-design-system (source of truth)
  ↓  foundation/colors, typography, spacing semantics
src/design-system/tokens/
  ↓  _colors.scss, _typography.scss, _spacing.scss, _layout.scss
src/design-system/bootstrap/_overrides.scss
  ↓  Bootstrap 5.0.2 variable mapping
src/styles/bootstrap.scss
  ↓  Bootstrap partials
src/styles/globals.scss
  ↓  ps-* layout classes
UI shell (src/ui/)
```

## Module Structure

```text
src/design-system/
├── tokens/           Semantic tokens ($ds-*) + product aliases ($ps-*)
├── bootstrap/        Bootstrap 5.0.2 overrides
└── index.scss        Import entry for styles pipeline
```

Documentation mirror:

```text
docs/design-system/
├── TOKENS.md         Token catalog and source map
├── COLORS.md         Color rules reference
├── TYPOGRAPHY.md     Type scale reference
├── SPACING.md        Spacing scale reference
├── BOOTSTRAP_MAPPING.md  Component → Bootstrap classes
├── COMPONENTS.md     Component guidance index
└── PATTERNS.md       Pattern guidance index
```

## Token Naming

| Prefix  | Usage                                                 |
| ------- | ----------------------------------------------------- |
| `$ds-*` | Design system semantic tokens — preferred in new code |
| `$ps-*` | Plantasonic product aliases — app shell compatibility |

## Bootstrap Integration

Bootstrap 5.0.2 consumes tokens through `src/design-system/bootstrap/_overrides.scss`:

```scss
// src/styles/index.scss
@import '../design-system/index.scss';
@import './bootstrap.scss';
@import './globals.scss';
```

Rules:

1. Never edit Bootstrap source in `node_modules/`
2. Map semantic tokens to Bootstrap variables in `_overrides.scss` only
3. Use Bootstrap utilities for spacing and alignment where possible
4. Custom layout classes use `ps-` prefix in `globals.scss`

## Component and Pattern Guidance

When building UI, read the indexed specs before implementing:

- [docs/design-system/COMPONENTS.md](./docs/design-system/COMPONENTS.md)
- [docs/design-system/PATTERNS.md](./docs/design-system/PATTERNS.md)
- [docs/design-system/BOOTSTRAP_MAPPING.md](./docs/design-system/BOOTSTRAP_MAPPING.md)

Full specifications remain in `ai-native-design-system/components/` and `ai-native-design-system/patterns/`.

## Sync Workflow

When design system tokens change:

1. Update the canonical file in `ai-native-design-system`
2. Sync the corresponding file in `src/design-system/tokens/`
3. Verify Bootstrap overrides in `src/design-system/bootstrap/_overrides.scss`
4. Run `npm run build` and visual check
5. Document in CHANGELOG.md

## What This Document Does Not Cover

- Engine rendering aesthetics (ASCII Visual Engine)
- Audio synthesis timbres (Plantasia Sound Engine)
- Preset-specific visual themes (preset world modules)
- Engineering workflow (see `docs/product-framework/`)

The design system governs **application chrome** — navigation, controls, and layout.

## Interaction Controls

Performance sliders use `data-ps-control="<name>"` attributes for mouse and touch module binding. Input settings (MIDI, keyboard, touch toggles) live in the sidebar **Input** panel and the settings overlay. See [docs/INTERACTION_LAYER.md](./docs/INTERACTION_LAYER.md).

## Application Experience (Phase 9)

Layout classes in `globals.scss`:

| Class | Purpose |
| ----- | ------- |
| `ps-app--performance` | Minimal chrome for live performance |
| `ps-app--fullscreen` | Fullscreen layout adjustments |
| `ps-overlay-host` | Modal overlay container |
| `ps-preset-card` | Preset browser card |
| `ps-error-banner` | User-facing error state |

Motion uses GSAP through `src/ui/motion/motionController.ts`. Respects `prefers-reduced-motion` and user settings (`data-ps-reduced-motion`, `data-ps-motion-off`).

Touch targets: minimum 2.75rem on dock buttons, nav actions, and preset cards. Safe-area padding on nav and dock via `env(safe-area-inset-*)`.

See [docs/USER_EXPERIENCE.md](./docs/USER_EXPERIENCE.md).
