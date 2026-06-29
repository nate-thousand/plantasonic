# Pattern Guidance

**Canonical source:** [plantasonic-design-system/docs/PATTERNS.md](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/PATTERNS.md)

---

## App shell (Plantasonic)

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

| Component | Implementation |
| --------- | -------------- |
| AppShell | `src/ui/layouts/AppShell.ts` |
| TopNav | `src/ui/components/TopNav.ts` |
| Stage | `src/ui/components/Stage.ts` |
| ControlDock | `src/ui/components/ControlDock.ts` |
| CollapsibleMenu | `src/ui/components/CollapsibleMenu.ts` |
| OverlayHost | `src/ui/components/OverlayHost.ts` |

---

## Rules

- Instrument UI uses efficient density — not marketing spacing
- Stage area stays visually quiet — chrome uses muted tokens
- Controls live in the dock and sidebar, not overlaid on the stage
- One primary button per view section for the main action

---

## Future patterns

| Pattern | Phase |
| ------- | ----- |
| Empty states | Preset list |
| Errors | Runtime error display |
| Loading states | Engine init |

Pattern specs will be added to the design system package as they are standardized.
