# Plantasonic Design System

## Overview

The Plantasonic design system bridges Figma design decisions to Bootstrap components through a token-based pipeline. No theme values are hardcoded in application components — all visual properties flow from design tokens.

## Token Pipeline

```text
Figma
  ↓  (export variables / Code Connect)
Design Tokens
  ↓  (SCSS variables in src/styles/variables.scss)
Bootstrap Theme
  ↓  (Bootstrap SCSS variable overrides in bootstrap.scss)
UI Components
  ↓  (Bootstrap classes + ps-* utility classes)
Plantasonic Application
```

## Design Tokens

Design tokens live in `src/styles/variables.scss`. They define the visual language:

| Category   | Examples                                                 |
| ---------- | -------------------------------------------------------- |
| Brand      | `$ps-brand-primary`, `$ps-brand-accent`                  |
| Surfaces   | `$ps-surface-base`, `$ps-surface-stage`                  |
| Text       | `$ps-text-primary`, `$ps-text-muted`                     |
| Borders    | `$ps-border-subtle`, `$ps-border-strong`                 |
| Layout     | `$ps-nav-height`, `$ps-dock-height`, `$ps-sidebar-width` |
| Typography | `$ps-font-family-sans`, `$ps-font-family-mono`           |
| Spacing    | `$ps-space-xs` through `$ps-space-xl`                    |

Tokens use the `$ps-` prefix to distinguish Plantasonic-specific values from Bootstrap defaults.

## Bootstrap Integration

Bootstrap 5.0.2 consumes tokens through SCSS variable overrides:

```scss
// variables.scss
$ps-brand-primary: #2d6a4f;
$primary: $ps-brand-primary;

// bootstrap.scss
@import './variables.scss';
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
// ... component imports
```

This approach ensures:

1. Bootstrap components inherit the Plantasonic theme automatically.
2. Token changes propagate everywhere without editing component files.
3. Future Figma updates require changes in one file (`variables.scss`).

## Component Conventions

### Naming

- Layout classes use the `ps-` prefix (e.g., `ps-app`, `ps-stage`, `ps-dock`).
- Bootstrap utility classes are used for spacing and alignment where possible.
- Component-specific styles live in `globals.scss`, scoped under `ps-*` selectors.

### Structure

```text
src/ui/
├── components/    Atomic UI elements (nav, stage, dock)
├── layouts/       Page-level composition (AppShell)
└── controls/      Interactive parameter widgets (future)
```

### Accessibility

- All interactive elements include ARIA labels.
- Sidebar visibility toggles `aria-hidden` and `aria-expanded`.
- Color contrast follows WCAG AA against surface tokens.

## Figma Update Workflow

When design tokens change in Figma:

1. **Export** updated variables from Figma (via Variables API or manual export).
2. **Update** `src/styles/variables.scss` with new token values.
3. **Verify** Bootstrap variable mappings still align (check `$primary`, `$body-bg`, etc.).
4. **Review** the application shell in dev mode for visual regressions.
5. **Document** significant token changes in CHANGELOG.md.

### Future: Automated Sync

When Figma Code Connect is configured, token exports can be scripted:

```text
Figma Variables → JSON export → SCSS generation → variables.scss
```

This automation is planned for the Design System milestone (see ROADMAP.md).

## Typography

| Role | Token                  | Usage                                             |
| ---- | ---------------------- | ------------------------------------------------- |
| Sans | `$ps-font-family-sans` | UI labels, navigation, body text                  |
| Mono | `$ps-font-family-mono` | Status indicators, parameter values, stage labels |

Font files will be added to `public/fonts/` during Design System integration.

## Color Philosophy

Plantasonic uses a dark, instrument-like palette:

- **Deep surfaces** reduce visual distraction during performance.
- **Muted text** keeps focus on the visual stage.
- **Accent green** provides subtle brand identity without competing with generative output.

Colors will be refined when Figma tokens are imported in Phase 2.

## What This Document Does Not Cover

- Engine rendering aesthetics (owned by ASCII Engine)
- Audio synthesis timbres (owned by Sound Engine)
- Preset-specific visual themes (owned by preset world modules)

The design system governs the **application chrome** — navigation, controls, and layout — not generative output.
