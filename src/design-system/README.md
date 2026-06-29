# Design System Integration

Plantasonic consumes the centralized **[plantasonic-design-system](https://github.com/nate-thousand/plantasonic-design-system)** package. This folder does not contain token source files.

## What the app imports

| Package export | Used in |
| -------------- | ------- |
| `css/variables.css` | `src/main.ts` — runtime CSS custom properties |
| `scss/bootstrap-theme.scss` | `src/styles/index.scss` — Bootstrap 5.0.2 overrides |

## App-specific styles

| Path | Role |
| ---- | ---- |
| `src/styles/index.scss` | Style entry (package theme + Bootstrap + shell) |
| `src/styles/_ps-aliases.scss` | `var(--ds-*)` aliases for shell SCSS (no duplicated values) |
| `src/styles/_bootstrap-components.scss` | Post-Bootstrap polish (sliders, touch targets) |
| `src/styles/globals.scss` | Plantasonic shell layout (`ps-*` classes) |

## Updating tokens

Token changes happen in **plantasonic-design-system**, not in this repo:

```bash
cd ../plantasonic-design-system
# edit tokens/*.json
npm run build          # regenerates css/variables.css
cd ../plantasonic
npm install            # refresh file: dependency
npm run build          # verify app still compiles
```

See the [design system README](https://github.com/nate-thousand/plantasonic-design-system) for full documentation.
