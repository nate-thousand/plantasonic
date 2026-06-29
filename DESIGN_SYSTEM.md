# Design System Integration

Plantasonic consumes the centralized **[plantasonic-design-system](https://github.com/nate-thousand/plantasonic-design-system)** package. This app does not maintain local token JSON, SCSS primitives, or CSS variable definitions.

---

## Package dependency

```json
"plantasonic-design-system": "file:../plantasonic-design-system"
```

CI checks out the design system repo as a sibling directory. Local development uses the same path (symlink or clone at `../plantasonic-design-system`).

---

## What the app imports

| Package export | Import location | Purpose |
| -------------- | --------------- | ------- |
| `css/variables.css` | `src/main.ts` | Runtime `--ds-*` / `--ps-*` custom properties, dark/light themes |
| `scss/bootstrap-theme.scss` | `src/styles/index.scss` | Bootstrap 5.0.2 variable overrides |
| `scss/css-theme-bridge.scss` | `src/styles/index.scss` (after Bootstrap) | Runtime Bootstrap ↔ CSS variable bridge |

---

## App style pipeline

```text
src/main.ts
  → plantasonic-design-system/css/variables.css

src/styles/index.scss
  → plantasonic-design-system/scss/bootstrap-theme.scss
  → bootstrap.scss (Bootstrap partials)
  → plantasonic-design-system/scss/css-theme-bridge.scss (runtime theme bridge)
  → _ps-aliases.scss (var() references only — no duplicated values)
  → globals.scss (Plantasonic shell ps-* layout)
```

Post-Bootstrap polish lives in `src/styles/_bootstrap-components.scss` (sliders, touch targets, transitions).

---

## Theme switching

Set on the root element:

```html
<html data-theme="dark">   <!-- default -->
<html data-theme="light">
```

CSS variables update via `[data-theme="dark"]` and `[data-theme="light"]` blocks in the package's `variables.css`.

---

## Updating tokens

All token changes happen in **plantasonic-design-system**:

```bash
cd ../plantasonic-design-system
# Edit tokens/foundation.tokens.json, tokens/theme.dark.tokens.json, tokens/theme.light.tokens.json
npm run build              # regenerates css/variables.css + validates
cd ../plantasonic
npm install                # refresh file: dependency if needed
npm run build              # verify app compiles
```

Do not copy token JSON into this repo. Do not edit `css/variables.css` manually.

---

## For future Plantasonic apps

1. Add `"plantasonic-design-system": "file:../plantasonic-design-system"` (or publish to npm/registry).
2. Import `plantasonic-design-system/css/variables.css` in the app entry.
3. Import `plantasonic-design-system/scss/bootstrap-theme` before Bootstrap SCSS.
4. Use `var(--ds-*)` / `var(--ps-*)` in app-specific styles — never hardcode colors or spacing.
5. Set `data-theme="dark"` or `data-theme="light"` on `<html>`.
6. Follow [COMPONENT_MAPPING.md](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/COMPONENT_MAPPING.md) for Bootstrap class usage.

---

## Related documentation

| Location | Contents |
| -------- | -------- |
| [plantasonic-design-system](https://github.com/nate-thousand/plantasonic-design-system) | Token source, CSS output, Bootstrap theme, foundation docs |
| [plantasonic-design-system/docs/COLORS.md](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/COLORS.md) | Canonical color roles and values |
| [docs/design-system/README.md](./docs/design-system/README.md) | App integration index (pointers to package) |
