# Typography Rules

**Canonical source:** [plantasonic-design-system/docs/TYPOGRAPHY.md](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/TYPOGRAPHY.md)

---

## Font families

| Role | CSS variable |
| ---- | ------------ |
| UI chrome | `--ds-font-family-sans` (Inter) |
| Status / values | `--ds-font-family-mono` (JetBrains Mono) |

---

## Type scale (common roles)

| Role | CSS variable | Size |
| ---- | ------------ | ---- |
| H2 | `--ds-font-size-h2` | 1.5rem |
| Body | `--ds-font-size-body` | 1rem |
| Body small | `--ds-font-size-body-sm` | 0.875rem |
| Caption | `--ds-font-size-caption` | 0.75rem |

---

## Bootstrap mapping

| Role | Bootstrap |
| ---- | --------- |
| Muted secondary | `.text-secondary`, `.text-muted` |
| Mono | `.font-monospace` |
| Small | `.small`, `.btn-sm` |

Use `var(--ds-font-*)` in custom styles. Do not hardcode font sizes.
