# Color Rules

Reference summary from `ai-native-design-system/foundation/colors/COLORS.md`.

Plantasonic implements a **dark instrument theme** — surface values differ from the design system defaults but use the same semantic token names.

---

## Semantic Roles

| Role               | Token                       | Plantasonic value |
| ------------------ | --------------------------- | ----------------- |
| Primary action     | `$ds-color-primary`         | `#2d6a4f`         |
| Secondary action   | `$ds-color-secondary`       | `#40916c`         |
| Accent / highlight | `$ds-color-accent`          | `#95d5b2`         |
| Page surface       | `$ds-color-surface-default` | `#0d1117`         |
| Raised panel       | `$ds-color-surface-raised`  | `#161b22`         |
| Stage / sunken     | `$ds-color-surface-sunken`  | `#010409`         |
| Overlay            | `$ds-color-surface-overlay` | `#21262d`         |
| Primary text       | `$ds-color-text-primary`    | `#e6edf3`         |
| Secondary text     | `$ds-color-text-secondary`  | `#8b949e`         |
| Muted text         | `$ds-color-text-muted`      | `#6e7681`         |

---

## Rules (from design system)

- Meet WCAG AA contrast for text on surfaces
- Do not use status colors for non-status decoration
- Status colors map to Bootstrap `$success`, `$warning`, `$danger`, `$info`

---

## Implementation

`src/design-system/tokens/_colors.scss`

**Canonical source:** `ai-native-design-system/foundation/colors/COLORS.md`
