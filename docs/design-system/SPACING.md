# Spacing Rules

**Canonical source:** [plantasonic-design-system/docs/SPACING.md](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/SPACING.md)

---

## Scale

| Token | CSS variable | Value |
| ----- | ------------ | ----- |
| `space.1` | `--ds-space-1` | 0.25rem |
| `space.2` | `--ds-space-2` | 0.5rem |
| `space.3` | `--ds-space-3` | 1rem |
| `space.4` | `--ds-space-4` | 1.5rem |
| `space.5` | `--ds-space-5` | 2rem |

Bootstrap `$spacer` = `--ds-space-3` (1rem).

---

## Plantasonic shell usage

| Context | Token |
| ------- | ----- |
| Dock section gap | `--ds-space-2` |
| Sidebar padding | `--ds-space-3` |
| Stage placeholder padding | `--ds-space-5` |
| Nav/dock horizontal padding | `--ds-space-4` |

Prefer Bootstrap utilities (`gap-2`, `p-3`, `px-4`) backed by this scale.
