# Color Rules

**Canonical source:** [plantasonic-design-system/docs/COLORS.md](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/COLORS.md)

This app does not define color tokens locally. All values come from the package's `css/variables.css`.

---

## Quick reference (dark theme)

| Role | CSS variable | Value |
| ---- | ------------ | ----- |
| Primary action | `--ds-color-primary` | `#00FF57` |
| Accent / highlight | `--ds-color-accent` | `#4DFF89` |
| App surface | `--ds-color-surface-app` | `#070F0A` |
| Stage | `--ds-color-surface-stage` | `#000000` |
| Raised panel | `--ds-color-surface-raised` | `#1A1A1A` |
| Primary text | `--ds-color-text-primary` | `#E5E5E5` |
| Secondary text | `--ds-color-text-secondary` | `#999999` |
| Accent text | `--ds-color-text-accent` | `#4DFF89` |

Do not use brand green for body text. Green is for actions, links, and emphasis only.

---

## In this app

Use `var(--ds-color-*)` via `_ps-aliases.scss` or directly in component styles. Never hardcode hex values.

Update tokens in `../plantasonic-design-system/tokens/`, then run `npm run build` in that repo.
