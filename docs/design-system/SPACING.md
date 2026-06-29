# Spacing Rules

Reference summary from `ai-native-design-system/foundation/spacing/SPACING.md`.

---

## Scale (4px base grid)

| Token         | Value         | Bootstrap utility |
| ------------- | ------------- | ----------------- |
| `$ds-space-1` | 0.25rem (4px) | `*-1`             |
| `$ds-space-2` | 0.5rem (8px)  | `*-2`             |
| `$ds-space-3` | 1rem (16px)   | `*-3`             |
| `$ds-space-4` | 1.5rem (24px) | `*-4`             |
| `$ds-space-5` | 2rem (32px)   | `*-5`             |

Bootstrap `$spacer` = `$ds-space-3` (1rem).

---

## Plantasonic Usage

| Context                     | Token         |
| --------------------------- | ------------- |
| Dock section gap            | `$ds-space-2` |
| Sidebar padding             | `$ds-space-3` |
| Stage placeholder padding   | `$ds-space-5` |
| Nav/dock horizontal padding | `$ds-space-4` |

Prefer Bootstrap utilities (`gap-2`, `p-3`, `px-4`) backed by this scale.

---

## Rules (from design system)

- Use spacing tokens — avoid arbitrary pixel values
- Single-direction spacing in vertical stacks
- Reduce section spacing on mobile

---

## Implementation

`src/design-system/tokens/_spacing.scss`

**Canonical source:** `ai-native-design-system/foundation/spacing/SPACING.md`
