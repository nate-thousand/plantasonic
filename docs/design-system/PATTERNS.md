# Pattern Guidance

Index of design system interaction patterns relevant to Plantasonic.

---

## Patterns Used

| Pattern      | Spec source                                                     | Plantasonic implementation   |
| ------------ | --------------------------------------------------------------- | ---------------------------- |
| App shell    | `ai-native-design-system/patterns/page-layouts/PAGE_LAYOUTS.md` | `src/ui/layouts/AppShell.ts` |
| Page layouts | Same                                                            | Nav + stage + dock grid      |

---

## App Shell Pattern (from design system)

- Persistent header with brand and primary actions
- Optional sidebar for settings and presets
- Main content area (`<main>` or stage region)
- Mobile: collapse nav to toggler; full-width content with horizontal padding

Plantasonic adaptation:

```text
┌─────────────────────────────────┐
│ TopNav (navbar)                 │
├──────────┬──────────────────────┤
│ Sidebar  │ Stage (visual area)  │
│ (menu)   │                      │
├──────────┴──────────────────────┤
│ ControlDock (footer)            │
└─────────────────────────────────┘
```

---

## Future Patterns

| Pattern        | Spec source                               | Phase                 |
| -------------- | ----------------------------------------- | --------------------- |
| Empty states   | `patterns/empty-states/EMPTY_STATES.md`   | Preset list           |
| Errors         | `patterns/errors/ERRORS.md`               | Runtime error display |
| Loading states | `patterns/empty-states/LOADING_STATES.md` | Engine init           |

---

## Rules

- Instrument UI uses efficient density — not marketing spacing
- Stage area stays visually quiet — chrome uses muted tokens
- Controls live in the dock, not overlaid on the stage

**Canonical index:** `ai-native-design-system/patterns/README.md`
