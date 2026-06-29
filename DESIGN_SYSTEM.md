# Design System Integration

Plantasonic is the **first consumer** of [plantasonic-design-system](https://github.com/nate-thousand/plantasonic-design-system) v1.2.0+. The app does not maintain local token JSON, SCSS primitives, or CSS variable definitions.

---

## Package dependency

```json
"plantasonic-design-system": "github:nate-thousand/plantasonic-design-system#v1.2.1"
```

CI checks out the design system repo as a sibling directory for integration tests. Vercel and production installs use the GitHub tag. Local development may symlink `../plantasonic-design-system` via `file:` override.

---

## Application Shell (public API)

The app uses the design-system Application Shell as its outer frame:

```typescript
import {
  renderApplicationShell,
  bindApplicationShell,
  initShellTheme,
  registerShellCommands,
} from 'plantasonic-design-system/shell';
```

| File | Role |
|------|------|
| `src/shell/shell-config.ts` | Navigation, routes, commands, theme, `persistState` |
| `src/shell/installApplicationShell.ts` | Renders and binds the shell into `#app` |
| `src/shell/bindShellNavigation.ts` | Maps sidebar routes → instrument events |
| `src/shell/registerAppCommands.ts` | Registers instrument commands in shell palette |
| `src/ui/layouts/AppShell.ts` | Instrument workspace (stage, inspector, transport) inside shell |

Command palette (⌘K) and theme switching are owned by the design system. Instrument-specific commands register at runtime via `registerShellCommands()`.

### Integration approach

1. **Design system owns:** CSS variables, Bootstrap theme, application shell markup, sidebar navigation, command palette, theme API, shell persistence.
2. **App owns:** sound/visual engines, runtime, presets, interaction, instrument workspace (stage, inspector, transport), control factories, overlays.
3. **Bridge layer (`src/shell/`):** configures the shell, maps sidebar routes to `eventBus` events, registers app commands, injects runtime status into the DS topbar.
4. **App-specific styling:** `globals.scss` (instrument layout), `instrument-shell.scss` (workspace ↔ shell bridge), `_bootstrap-components.scss` (form-range/button polish using DS variables). Legacy `.ps-chrome` / `.ps-top-nav` rules remain for focus-mode responsive behavior until consolidated.

### Remaining UI migration gaps

| Gap | Why it remains |
| --- | --- |
| Transport dock in workspace | DS `regions.dock` disabled; instrument transport needs engine bindings in `ControlDock.ts` |
| Inspector in workspace | DS `regions.inspector` disabled; contextual panel is app-specific |
| `_bootstrap-components.scss` | App-level Bootstrap polish (sliders, touch targets) atop DS theme |
| Theme dual persistence | Shell window state + `AppSettingsStore` both write `data-theme` — synced via `setShellTheme()` |

---

## What the app imports

| Package export | Import location | Purpose |
| -------------- | --------------- | ------- |
| `css/variables.css` | `src/main.ts` | Runtime `--ds-*` / `--ps-*` custom properties |
| `shell` | `src/shell/*`, `src/main.ts`, `src/services/appSettingsStore.ts` | Application Shell API |
| `scss/bootstrap-theme.scss` | `src/styles/index.scss` | Bootstrap 5.0.2 variable overrides |
| `scss/css-theme-bridge.scss` | `src/styles/index.scss` | Runtime Bootstrap ↔ CSS variable bridge |
| `scss/navigation-framework.scss` | `src/styles/index.scss` | Shell navigation styles |
| `scss/application-shell.scss` | `src/styles/index.scss` | Application shell styles |

---

## App style pipeline

```text
src/main.ts
  → plantasonic-design-system/css/variables.css
  → initShellTheme()

src/styles/index.scss
  → bootstrap-theme.scss
  → bootstrap.scss (Bootstrap partials)
  → css-theme-bridge.scss
  → plantasonic-components.scss
  → navigation-framework.scss
  → application-shell.scss
  → instrument-shell.scss (instrument ↔ shell bridge)
  → globals.scss (instrument layout ps-* classes)
```

App-specific styles use `_ps-aliases.scss` (`var(--ds-*)` only — no duplicated token values).

---

## Theme switching

Theme is synchronized between `AppSettingsStore` and the shell `setShellTheme()` API. Both write `data-theme` on `<html>`.

---

## Verification

```bash
npm run verify:design-system   # package exports + shell API wiring
npm run verify:integration     # full instrument + shell integration
npm run build
```

---

## Updating the design system

```bash
cd ../plantasonic-design-system
npm run build
cd ../plantasonic
npm install
npm run build
```

Do not copy token JSON or shell source into this repo.
