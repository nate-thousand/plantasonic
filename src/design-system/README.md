# Design System Integration

Plantasonic consumes **[plantasonic-design-system](https://github.com/nate-thousand/plantasonic-design-system)** v1.0 as a workspace package. Token source lives in the design system — not in this folder.

## Runtime imports (TypeScript)

| Package export | Used in |
| -------------- | ------- |
| `css/variables.css` | `src/main.ts` — runtime CSS custom properties |
| `shell` | `src/shell/*` — application shell render, theme, navigation |
| `platform/services` | `src/platform/services.ts` — logging, settings, autosave, notifications |
| `platform/engines` | `src/platform/engines.ts` — engine catalog + `installEngine()` |
| `platform/types` | `src/platform/manifest.ts` — `ProjectManifest` typing |

Browser-safe platform subpaths are resolved via Vite/tsconfig aliases so Node-only SDK helpers (`createProject`, file I/O) are never bundled.

## Style imports (SCSS)

| Package export | Role |
| -------------- | ---- |
| `scss/bootstrap-theme.scss` | Bootstrap 5.0.2 token overrides |
| `scss/css-theme-bridge.scss` | `--ds-*` → Bootstrap bridge |
| `scss/bootstrap-components.scss` | Themed Bootstrap components |
| `scss/bootstrap-utilities.scss` | Bootstrap utilities |
| `scss/plantasonic-components.scss` | Plantasonic `.ps-*` surfaces |
| `scss/primitives.scss` | Layout primitives (`.ds-l-*`) |
| `scss/components.scss` | Component library (`.ds-c-*`) |
| `scss/motion.scss` | Motion utility classes |
| `scss/navigation-framework.scss` | Navigation shell |
| `scss/application-shell.scss` | Application shell chrome |
| `scss/instrument.scss` | Instrument / stage-first layout |

Entry: `src/styles/index.scss`

## App-specific styles (not duplicated in DS)

| Path | Role |
| ---- | ---- |
| `src/styles/_ps-aliases.scss` | `var(--ds-*)` aliases for legacy `ps-*` SCSS |
| `src/styles/instrument-shell.scss` | Stage-first shell bridge (icon rail, focus mode) |
| `src/styles/globals.scss` | Plantasonic stage, transport, inspector layout |

## Platform manifest

Root `platform.json` is the authoritative project manifest. Validated by `npm run verify:platform`.

## Verification

```bash
npm run verify:design-system   # SCSS + shell + platform client wiring
npm run verify:platform        # manifest, engines, AI context
npm run build                  # full compile
```

## Updating tokens

Token changes happen in **plantasonic-design-system**:

```bash
npm run ds:tokens    # from repo root — rebuild CSS + SCSS in workspace
npm run build        # verify app still compiles
```
