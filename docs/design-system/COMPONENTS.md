# Component Guidance

**Authoritative specification:** [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md)

**Bootstrap mapping:** [plantasonic-design-system/docs/COMPONENT_MAPPING.md](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/COMPONENT_MAPPING.md)

This index maps design system components to Plantasonic implementations in this app.

---

## Reusable controls (`src/ui/controls/`)

| Component | Factory | Bootstrap base |
| --------- | ------- | -------------- |
| Button | `createButton()` | `.btn` |
| Slider | `createSlider()`, `createSliderRow()` | `.form-range` |
| Toggle | `createToggle()` | `.form-check-input` |
| Knob | `createKnob()` | `.form-range.ps-knob` |
| PresetSelector | `createPresetSelector()` | `.btn` |
| Status | `createStatus()` | `.ps-status` |
| Loading | `createLoading()` | `.spinner-border` |
| Notification | `createNotification()` | `.alert` |
| Dialog | `createDialogShell()` | overlay pattern |
| Toolbar | `createToolbar()` | `.ps-toolbar` |
| Dropdown | `createDropdown()` | `.dropdown` |
| Tooltip | `applyTooltip()` | `title` + ARIA |

---

## Shell components

| Component | File |
| --------- | ---- |
| AppShell | `src/ui/layouts/AppShell.ts` |
| TopNav | `src/ui/components/TopNav.ts` |
| Stage | `src/ui/components/Stage.ts` |
| ControlDock | `src/ui/components/ControlDock.ts` |
| CollapsibleMenu | `src/ui/components/CollapsibleMenu.ts` |
| OverlayHost | `src/ui/components/OverlayHost.ts` |
| PresetBrowser | `src/ui/components/PresetBrowser.ts` |
| SettingsPanel | `src/ui/components/SettingsPanel.ts` |
| ErrorBanner | `src/ui/components/ErrorBanner.ts` |

---

## Rules

- One primary button per view section for the main action
- All interactive elements need visible focus states (`--ds-shadow-focus`)
- Minimum `--ps-touch-target` (2.75rem) on controls
- Use `var(--ds-*)` / `var(--ps-*)` — no hardcoded colors

---

## Reference implementations

The design system showcase (`plantasonic-design-system/showcase/`) provides reference implementations for Bootstrap and Plantasonic patterns. Match token usage and layout when building new UI.
