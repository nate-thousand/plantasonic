# Component Guidance

**Authoritative specification:** [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md)

This index maps design system components to Plantasonic implementations. Full specs remain in `ai-native-design-system/components/`.

---

## Reusable Controls (`src/ui/controls/`)

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

## Shell Components

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
- All interactive elements need visible focus states
- Minimum 2.75rem touch targets on controls
- Use `$ds-*` tokens — no hardcoded colors

**Canonical index:** `ai-native-design-system/components/README.md`
