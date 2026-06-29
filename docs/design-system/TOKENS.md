# Token Catalog

**Canonical source:** [plantasonic-design-system](https://github.com/nate-thousand/plantasonic-design-system)

This app does not maintain local token JSON or generated SCSS. All tokens live in the design system package.

---

## Package structure

```text
plantasonic-design-system/tokens/
  foundation.tokens.json     Primitives — palette, spacing, typography, motion
  theme.dark.tokens.json     Dark semantic + product tokens (default)
  theme.light.tokens.json    Light semantic overrides
        ↓ npm run build
  css/variables.css            Runtime --ds-* / --ps-* CSS custom properties
  scss/bootstrap-theme.scss    Bootstrap 5.0.2 SCSS overrides
  scss/css-theme-bridge.scss   Runtime Bootstrap ↔ CSS variable bridge
```

---

## CSS variable prefixes

| Prefix | Usage |
| ------ | ----- |
| `--ds-*` | Design system semantic tokens |
| `--ps-*` | Product layout tokens (nav height, dock, touch targets) |

Full architecture: [TOKEN_ARCHITECTURE.md](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/TOKEN_ARCHITECTURE.md)

---

## Common tokens

| Need | CSS variable |
| ---- | ------------ |
| App background | `--ds-color-surface-app` |
| Stage background | `--ds-color-surface-stage` |
| Panel background | `--ds-color-surface-raised` |
| Primary text | `--ds-color-text-primary` |
| Secondary text | `--ds-color-text-secondary` |
| Primary action | `--ds-color-primary` |
| Focus ring | `--ds-shadow-focus` |
| Default spacing | `--ds-space-3` |
| Nav height | `--ps-nav-height` |
| Dock height | `--ps-dock-height` |
| Touch target | `--ps-touch-target` |

---

## Updating tokens

```bash
cd ../plantasonic-design-system
# Edit tokens/*.tokens.json
npm run build
cd ../plantasonic
npm run build
```

See [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md) for full integration workflow.
