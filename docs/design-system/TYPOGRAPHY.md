# Typography Rules

Reference summary from `ai-native-design-system/foundation/typography/TYPE_SCALE.md`.

---

## Font Families

| Role | Token                  | Stack                              |
| ---- | ---------------------- | ---------------------------------- |
| Sans | `$ds-font-family-sans` | Inter, system-ui, Segoe UI, Roboto |
| Mono | `$ds-font-family-mono` | JetBrains Mono, Cascadia Code      |

Font files will be added to `public/fonts/` when Inter and JetBrains Mono are self-hosted.

---

## Type Scale

| Role         | Size     | Use in Plantasonic           |
| ------------ | -------- | ---------------------------- |
| H2           | 1.5rem   | Stage title                  |
| Body         | 1rem     | Dock labels, menu content    |
| Body small   | 0.875rem | Placeholder text             |
| Caption      | 0.75rem  | Status labels, dock sections |
| Mono caption | 0.75rem  | Runtime status in nav        |

---

## Rules (from design system)

- One H1 per page (not used in instrument shell — stage uses H2)
- Minimum 16px body on all viewports
- Prefer spacing over smaller headings for separation
- Use `.text-muted` for secondary text via Bootstrap utilities

---

## Bootstrap Mapping

| Role            | Bootstrap                        |
| --------------- | -------------------------------- |
| Muted secondary | `.text-secondary`, `.text-muted` |
| Mono            | `.font-monospace`                |
| Small           | `.small`, `.btn-sm`              |

---

## Implementation

`src/design-system/tokens/_typography.scss`

**Canonical source:** `ai-native-design-system/foundation/typography/`
