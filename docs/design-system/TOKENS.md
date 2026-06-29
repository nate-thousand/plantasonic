# Token Catalog

Semantic design tokens imported into Plantasonic from the AI Native Design System, synced via Figma Variables.

**Implementation:** `src/design-system/tokens/`  
**Figma export:** `src/design-system/tokens/figma/tokens.json`  
**Sync:** `npm run tokens:sync`

---

## Figma Pipeline

```text
Figma Variables → tokens.json → generated/_tokens.scss → category partials → Bootstrap
```

See [figma/README.md](../../src/design-system/tokens/figma/README.md) for export and naming rules.

---

## Source Map

| Token file         | Figma collection | SCSS variables                                      |
| ------------------ | ---------------- | --------------------------------------------------- |
| `figma/tokens.json`| All collections  | Primitive `$ds-*` / `$ps-*` values (generated SCSS) |
| `_colors.scss`     | Color            | `$ps-*` surface/text aliases                        |
| `_typography.scss` | Typography       | `$ps-font-*` aliases                                |
| `_spacing.scss`    | Spacing          | `$ps-space-*` aliases                               |
| `_layout.scss`     | Product          | Shell dimensions (in generated SCSS)                |
| `_shadows.scss`    | Elevation        | Documented in generated SCSS                          |
| `_motion.scss`     | Motion           | Documented in generated SCSS                          |
| `_css-vars.scss`   | —                | `--ds-*` / `--ps-*` runtime bridge                    |

---

## Color Tokens

| Semantic token              | Figma variable          | Bootstrap variable | Purpose           |
| --------------------------- | ----------------------- | ------------------ | ----------------- |
| `$ds-color-primary`         | `color-primary`         | `$primary`         | Primary actions   |
| `$ds-color-secondary`       | `color-secondary`       | `$secondary`       | Secondary actions |
| `$ds-color-surface-default` | `color-surface-default` | `$body-bg`         | Page background   |
| `$ds-color-text-primary`    | `color-text-primary`    | `$body-color`      | Body text         |
| `$ds-color-border-default`  | `color-border-default`  | `$border-color`    | Dividers          |
| `$ds-color-text-link`       | `color-text-link`       | `$link-color`      | Links             |

Full color rules: [COLORS.md](./COLORS.md)

---

## Typography Tokens

| Token                   | Figma variable   | Value                | Role               |
| ----------------------- | ---------------- | -------------------- | ------------------ |
| `$ds-font-family-sans`  | `font-family-sans` | Inter, system stack  | UI text            |
| `$ds-font-family-mono`  | `font-family-mono` | JetBrains Mono stack | Status, code       |
| `$ds-font-size-base`    | `font-size-base`   | 1rem                 | Body               |
| `$ds-font-size-caption` | `font-size-caption`| 0.75rem              | Labels, timestamps |

Full typography rules: [TYPOGRAPHY.md](./TYPOGRAPHY.md)

---

## Spacing Tokens

| Token         | Figma variable | Value   | Design system name |
| ------------- | -------------- | ------- | ------------------ |
| `$ds-space-1` | `space-1`        | 0.25rem | space/1            |
| `$ds-space-2` | `space-2`        | 0.5rem  | space/2            |
| `$ds-space-3` | `space-3`        | 1rem    | space/3            |
| `$ds-space-4` | `space-4`        | 1.5rem  | space/4            |
| `$ds-space-5` | `space-5`        | 2rem    | space/5            |

Full spacing rules: [SPACING.md](./SPACING.md)

---

## Product Layout Tokens

Plantasonic-specific — `product` collection in Figma:

| Token               | Figma variable       | Value  | Usage                   |
| ------------------- | -------------------- | ------ | ----------------------- |
| `$ps-nav-height`    | `product-nav-height` | 3.5rem | Top navigation          |
| `$ps-dock-height`   | `product-dock-height`| 4.5rem | Control dock            |
| `$ps-sidebar-width` | `product-sidebar-width` | 18rem | Collapsible menu     |
| `$ps-surface-stage` | (alias)              | `$ds-color-surface-sunken` | Visual stage |

---

## External Source

Canonical definitions: `ai-native-design-system/foundation/` and `ai-native-design-system/figma/variables/`
