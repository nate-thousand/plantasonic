# Design System Module

Plantasonic consumes the [AI Native Design System](https://github.com/nate-thousand/ai-native-design-system) through this module. Token definitions and Bootstrap mapping live here — not in individual component files.

## Structure

```text
src/design-system/
├── tokens/
│   ├── _colors.scss       ← foundation/colors/COLORS.md
│   ├── _typography.scss   ← foundation/typography/TYPE_SCALE.md
│   ├── _spacing.scss      ← foundation/spacing/SPACING.md
│   ├── _layout.scss       ← patterns/page-layouts + product shell
│   └── index.scss
├── bootstrap/
│   ├── _overrides.scss    ← bootstrap/bootstrap-overrides.scss
│   └── index.scss
└── index.scss             ← import this from src/styles/
```

## Usage

```scss
// src/styles/variables.scss
@import '../design-system/index.scss';
```

## Rules

1. **Semantic tokens first** — use `$ds-*` names from the design system
2. **Bootstrap via overrides** — map tokens in `bootstrap/_overrides.scss`, never edit Bootstrap source
3. **Product aliases** — `$ps-*` aliases exist for the app shell; prefer `$ds-*` in new code
4. **Sync from source** — when design system tokens change, update the corresponding `_*.scss` file

## Documentation

| Document                                                           | Description                      |
| ------------------------------------------------------------------ | -------------------------------- |
| [docs/design-system/README.md](../../docs/design-system/README.md) | Integration index and source map |
| [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md)                         | Token pipeline overview          |

## External Source

Workspace path: `ai-native-design-system/` (sibling repository — not a npm dependency)
