# Token Catalog

Semantic design tokens imported into Plantasonic from the AI Native Design System.

**Implementation:** `src/design-system/tokens/`

---

## Source Map

| Token file         | Design system source                              | Variables                                           |
| ------------------ | ------------------------------------------------- | --------------------------------------------------- |
| `_colors.scss`     | `foundation/colors/COLORS.md`                     | `$ds-color-*`, `$ps-*` surface/text aliases         |
| `_typography.scss` | `foundation/typography/TYPE_SCALE.md`             | `$ds-font-*`                                        |
| `_spacing.scss`    | `foundation/spacing/SPACING.md`                   | `$ds-space-*`, `$ds-spacer`                         |
| `_layout.scss`     | `patterns/page-layouts/PAGE_LAYOUTS.md` + product | `$ps-nav-height`, `$ps-dock-height`, `$ds-radius-*` |

---

## Color Tokens

| Semantic token              | Bootstrap variable | Purpose           |
| --------------------------- | ------------------ | ----------------- |
| `$ds-color-primary`         | `$primary`         | Primary actions   |
| `$ds-color-secondary`       | `$secondary`       | Secondary actions |
| `$ds-color-surface-default` | `$body-bg`         | Page background   |
| `$ds-color-text-primary`    | `$body-color`      | Body text         |
| `$ds-color-border-default`  | `$border-color`    | Dividers          |
| `$ds-color-text-link`       | `$link-color`      | Links             |

Full color rules: [COLORS.md](./COLORS.md)

---

## Typography Tokens

| Token                   | Value                | Role               |
| ----------------------- | -------------------- | ------------------ |
| `$ds-font-family-sans`  | Inter, system stack  | UI text            |
| `$ds-font-family-mono`  | JetBrains Mono stack | Status, code       |
| `$ds-font-size-base`    | 1rem                 | Body               |
| `$ds-font-size-caption` | 0.75rem              | Labels, timestamps |

Full typography rules: [TYPOGRAPHY.md](./TYPOGRAPHY.md)

---

## Spacing Tokens

| Token         | Value   | Design system name |
| ------------- | ------- | ------------------ |
| `$ds-space-1` | 0.25rem | space/1            |
| `$ds-space-2` | 0.5rem  | space/2            |
| `$ds-space-3` | 1rem    | space/3            |
| `$ds-space-4` | 1.5rem  | space/4            |
| `$ds-space-5` | 2rem    | space/5            |

Full spacing rules: [SPACING.md](./SPACING.md)

---

## Product Layout Tokens

Plantasonic-specific — not in the global design system:

| Token               | Value                      | Usage                   |
| ------------------- | -------------------------- | ----------------------- |
| `$ps-nav-height`    | 3.5rem                     | Top navigation          |
| `$ps-dock-height`   | 4.5rem                     | Control dock            |
| `$ps-sidebar-width` | 18rem                      | Collapsible menu        |
| `$ps-surface-stage` | `$ds-color-surface-sunken` | Visual stage background |

---

## External Source

Canonical definitions: `ai-native-design-system/foundation/` and `ai-native-design-system/tokens/`
