# Design System Integration

Plantasonic consumes the [AI Native Design System](https://github.com/nate-thousand/ai-native-design-system) through `src/design-system/` without copying the full repository.

**Workspace source:** `../../ai-native-design-system/` (sibling — not a submodule)

---

## Integration Flow

```text
ai-native-design-system (source of truth)
  ↓  semantic token definitions
src/design-system/tokens/
  ↓  Bootstrap variable mapping
src/design-system/bootstrap/
  ↓  compilation
src/styles/ → Bootstrap components → UI shell
```

---

## What Was Imported

| Design system source                  | Plantasonic location                           | Method                              |
| ------------------------------------- | ---------------------------------------------- | ----------------------------------- |
| `foundation/colors/COLORS.md`         | `src/design-system/tokens/_colors.scss`        | Semantic tokens + dark theme values |
| `foundation/typography/TYPE_SCALE.md` | `src/design-system/tokens/_typography.scss`    | Font families and scale             |
| `foundation/spacing/SPACING.md`       | `src/design-system/tokens/_spacing.scss`       | 4px grid scale                      |
| `foundation/radius/RADIUS.md`         | `src/design-system/tokens/_layout.scss`        | Radius tokens                       |
| `bootstrap/bootstrap-overrides.scss`  | `src/design-system/bootstrap/_overrides.scss`  | Bootstrap mapping                   |
| `bootstrap/bootstrap-mapping.md`      | [BOOTSTRAP_MAPPING.md](./BOOTSTRAP_MAPPING.md) | Reference table                     |
| `components/*/`                       | [COMPONENTS.md](./COMPONENTS.md)               | Guidance index                      |
| `patterns/*/`                         | [PATTERNS.md](./PATTERNS.md)                   | Guidance index                      |

## What Was Not Copied

- `_archive/` folder
- `examples/` (except reference links)
- Duplicate READMEs from every subfolder
- Figma library files
- AI prompt libraries (engineering belongs in product framework)
- Full token JSON/CSS exports (SCSS semantics only)

---

## Token Naming

| Prefix  | Usage                                                 |
| ------- | ----------------------------------------------------- |
| `$ds-*` | Design system semantic tokens — preferred in new code |
| `$ps-*` | Plantasonic product aliases — app shell compatibility |

---

## Sync Workflow

When design system tokens change:

1. Update the canonical file in `ai-native-design-system`
2. Sync the corresponding `src/design-system/tokens/_*.scss` file
3. Verify Bootstrap overrides in `bootstrap/_overrides.scss`
4. Run `npm run build` and visual check
5. Note change in CHANGELOG.md

---

## Related

| Document                                       | Description                     |
| ---------------------------------------------- | ------------------------------- |
| [TOKENS.md](./TOKENS.md)                       | Token catalog and source map    |
| [COLORS.md](./COLORS.md)                       | Color rules reference           |
| [TYPOGRAPHY.md](./TYPOGRAPHY.md)               | Typography rules reference      |
| [SPACING.md](./SPACING.md)                     | Spacing rules reference         |
| [BOOTSTRAP_MAPPING.md](./BOOTSTRAP_MAPPING.md) | Component → Bootstrap class map |
| [COMPONENTS.md](./COMPONENTS.md)               | Component guidance index        |
| [PATTERNS.md](./PATTERNS.md)                   | Pattern guidance index          |
| [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md)     | Pipeline overview               |
