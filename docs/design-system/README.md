# Design System Integration

Plantasonic consumes the centralized **[plantasonic-design-system](https://github.com/nate-thousand/plantasonic-design-system)** package.

**Do not maintain local token files in this repo.** See [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md) for consumption details.

---

## Canonical source

All token definitions, color values, typography, spacing, and Bootstrap mapping live in the design system package:

| Package doc | Contents |
| ----------- | -------- |
| [VISION_AND_SCOPE.md](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/VISION_AND_SCOPE.md) | **Start here** — purpose, boundaries, decision filter |
| [COLORS.md](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/COLORS.md) | Semantic color roles and values |
| [TYPOGRAPHY.md](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/TYPOGRAPHY.md) | Font families and type scale |
| [SPACING.md](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/SPACING.md) | Spacing scale and product layout tokens |
| [PATTERNS.md](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/PATTERNS.md) | App shell and interaction patterns |
| [TOKEN_ARCHITECTURE.md](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/TOKEN_ARCHITECTURE.md) | Token layers, naming, build pipeline |
| [COMPONENT_MAPPING.md](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/COMPONENT_MAPPING.md) | Bootstrap 5.0.2 class mapping |

Token JSON: [plantasonic-design-system/tokens/](https://github.com/nate-thousand/plantasonic-design-system/tree/main/tokens)

---

## Package exports used by this app

| Export | Role |
| ------ | ---- |
| `css/variables.css` | Runtime CSS custom properties (`--ds-*`, `--ps-*`) |
| `scss/bootstrap-theme.scss` | Bootstrap 5.0.2 theme overrides |
| `scss/css-theme-bridge.scss` | Runtime Bootstrap ↔ CSS variable bridge (when switching themes) |

---

## App-specific styles

Shell layout and post-Bootstrap polish remain in `src/styles/`:

- `globals.scss` — `ps-*` layout classes
- `_ps-aliases.scss` — `var()` references to package CSS variables
- `_bootstrap-components.scss` — slider, button, form polish

---

## Local guidance indexes

These files in this folder are **app integration indexes** — they link to the package and document Plantasonic-specific implementations:

- [VISION_AND_SCOPE.md](./VISION_AND_SCOPE.md) — north star (pointer to package)
- [COMPONENTS.md](./COMPONENTS.md) — factory and shell component map
- [PATTERNS.md](./PATTERNS.md) — app shell implementation pointer
- [BOOTSTRAP_MAPPING.md](./BOOTSTRAP_MAPPING.md) — quick Bootstrap reference
- [COLORS.md](./COLORS.md), [TYPOGRAPHY.md](./TYPOGRAPHY.md), [SPACING.md](./SPACING.md), [TOKENS.md](./TOKENS.md) — pointers to canonical package docs
