# Pattern Guidance

**Navigation:** [docs/NAVIGATION.md](../NAVIGATION.md)  
**Canonical source:** [plantasonic-design-system/docs/PATTERNS.md](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/PATTERNS.md)

---

## App shell (Plantasonic)

```text
Design System Shell (sidebar + topbar + command palette)
  └─ Instrument workspace (AppShell)
       ASCII Stage (hero)
       Inspector (contextual, left / mobile bottom)
       Transport Bar (Perform, bottom)
```

| Component | Implementation |
| --------- | -------------- |
| Application shell | `plantasonic-design-system/shell` via `src/shell/` |
| Shell config | `src/shell/shell-config.ts` |
| AppShell | `src/ui/layouts/AppShell.ts` |
| Transport bar | `src/ui/components/ControlDock.ts` |
| Inspector | `src/ui/components/InspectorPanel.ts` |
| Commands | `src/ui/navigation/commandRegistry.ts` → `registerAppCommands()` |
| Stage | `src/ui/components/Stage.ts` |
| OverlayHost | `src/ui/components/OverlayHost.ts` |

---

## Rules

- Perform essentials stay on the transport bar; everything else is progressive disclosure
- Command palette is the primary discovery path — avoid crowded top-nav button rows
- Inspector categories: Sound, Visuals, Environment
- Developer tools never appear in primary chrome
