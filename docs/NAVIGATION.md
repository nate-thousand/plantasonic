# Plantasonic Navigation Architecture

Authoritative navigation model for the audiovisual instrument shell. This document explains **why** the architecture is structured this way and how it maps to user tasks.

---

## Design intent

Plantasonic is not application software — it is a **digital instrument**. Navigation should feel like the control surface of hardware synthesizer or an art installation, not an admin dashboard.

Principles:

- **Calm by default** — only Perform essentials are always visible; the sidebar recedes to a slim icon rail so the stage stays the hero
- **Progressive disclosure** — the rail expands to labels on hover/focus; Sound, Visuals, and Environment open the inspector on demand
- **Single source per task** — each task has one canonical entry point; navigation is not duplicated across surfaces
- **Keyboard-first** — command palette for power users
- **Spatial consistency** — transport at bottom, inspector from left, commands from center
- **No developer chrome** — debug and diagnostics are not in the primary IA

---

## Information architecture

| Category | Purpose | Always visible | Inspector / palette |
| -------- | ------- | -------------- | ------------------- |
| **Perform** | Playing the instrument | Transport bar | Play, Stop, world, live status, Focus mode |
| **Sound** | Sonic ecology and tempo | — | Tempo, Bloom, Mold, Chaos |
| **Visuals** | ASCII appearance | — | Brightness, Density |
| **Environment** | Preferences and worlds | — | Settings embed, world browser shortcuts |
| **Developer** | Diagnostics | Hidden | Not exposed in MVP shell |

Ecology controls map to engine parameters without exposing engine APIs in the UI.

---

## Shell layout

```text
┌─ Design System Shell (icon rail + minimal topbar) ─────────┐
│ Topbar: title · runtime status · Focus · ⌘K commands      │
├───┬────────────────────────────────────────────────────────┤
│ ◉ │  Instrument workspace (AppShell)                       │
│ ♪ │  ┌──────────────────────────────────────────────────┐  │
│ ◐ │  │             ASCII Stage (hero)                    │  │
│ ⚙ │  └──────────────────────────────────────────────────┘  │
│ ✦ │  Inspector (slides from left) · Transport (bottom)     │
└───┴────────────────────────────────────────────────────────┘
   ↑ icon rail expands to labels on hover / keyboard focus
```

The **outer frame** (icon rail, topbar, command palette, theme, persistence) is owned by `plantasonic-design-system` via `renderApplicationShell()` / `bindApplicationShell()`. On desktop the app styles the sidebar as a slim icon rail that expands to a labelled flyout on hover/focus (without reflowing the stage). The **instrument workspace** (stage, inspector, transport) lives inside the shell workspace slot.

---

## Navigation surfaces

### 1. Application shell (`src/shell/`)

Design-system shell configured in `shell-config.ts`:

- Sidebar routes → `bindShellNavigation.ts` → `eventBus` shell events
- Command palette (⌘K, /) — owned by design system; app commands via `registerAppCommands()`
- Runtime status + Focus toggle — injected in `injectInstrumentStatus.ts`
- Theme toggle — `cycleShellTheme()` + `AppSettingsStore` sync
- `persistState: true` — sidebar collapse and shell preferences

### 2. Transport bar (`ControlDock.ts` → `.ps-transport`)

Bottom Perform surface:

- Play / Stop (large touch targets)
- Current world selector
- Live readouts: tempo, octave, active notes
- Single **Controls** toggle → opens/closes the inspector (its tabs switch Sound · Visuals · Environment)
- Exit Focus (visible only in focus mode)

The transport no longer duplicates the three control categories; the sidebar rail and inspector tabs are the canonical category navigation, with the transport offering one quick Controls entry point.

### 3. Contextual inspector (`InspectorPanel.ts`)

Slide-in panel with tabbed categories. Opens from transport rail or command palette. Closes via backdrop, Close button, or Escape.

Environment tab embeds compact settings (Input, Motion, Display) plus shortcuts to full settings overlay and world browser.

### 4. Command palette (design system shell)

Universal search provided by `plantasonic-design-system/shell`. App commands register at runtime via `registerAppCommands()` from `src/ui/navigation/commandRegistry.ts`:

- Worlds (all presets)
- Actions (Play, Stop, Focus, Fullscreen)
- Navigation (open Sound / Visuals / Environment)
- Parameters (jump to slider in inspector)

Shortcuts: **⌘K / Ctrl+K** and **/** (focuses shell search input)

### 5. Overlays (`OverlayHost.ts`)

Full-screen modal layers for:

- World browser (visual cards)
- Settings (full panel)
- About / Help

---

## Focus mode

Formerly “performance mode.” Hides chrome and inspector; keeps transport essentials. Trigger: **P**, command palette, or Focus button.

---

## Keyboard reference

| Key | Action |
| --- | ------ |
| ⌘K / Ctrl+K | Command palette |
| / | Command palette |
| P | Toggle focus mode |
| Enter | Play |
| Esc | Stop / close panel |
| Space | Sustain |
| A–J | Notes |
| Z / X | Octave |

---

## Event bus

Shell coordination via typed events in `src/runtime/events.ts`:

- `shell:open-presets` — world browser
- `shell:open-inspector` — `{ category }`
- `shell:open-settings` — settings overlay
- `shell:open-command-palette`
- `shell:toggle-fullscreen`
- `shell:panel-open` / `shell:panel-close` — mutual exclusion with overlays

---

## Implementation map

| File | Role |
| ---- | ---- |
| `src/shell/shell-config.ts` | Routes, nav, theme, persistence |
| `src/shell/installApplicationShell.ts` | `renderApplicationShell` + `bindApplicationShell` |
| `src/shell/registerAppCommands.ts` | Wires command palette to app actions |
| `src/shell/bindShellNavigation.ts` | Sidebar → instrument events |
| `src/ui/layouts/AppShell.ts` | Stage, inspector, transport inside workspace |
| `src/ui/components/ControlDock.ts` | Transport bar + bindings |
| `src/ui/components/InspectorPanel.ts` | Category inspector |
| `src/ui/navigation/commandRegistry.ts` | Searchable command list |
| `src/ui/experience/appExperience.ts` | Wires events, shortcuts, overlays |

---

## Migration from prior navigation

| Removed | Replaced by |
| ------- | ----------- |
| Top nav button row (Presets, Settings, About…) | Command palette + inspector |
| Dock drawer with Motion/Performance groups | Inspector tabs (Sound/Visuals/Environment) |
| Left sidebar (CollapsibleMenu) | Inspector panel |
| “Performance mode” label | **Focus mode** (avoids collision with ecology controls) |
| Duplicate world entry points | World in transport + palette |
| Triplicated category nav (sidebar + transport rail + palette) | Sidebar rail + inspector tabs canonical; transport has one Controls toggle |
| Full-width text sidebar | Calm icon rail that expands on hover/focus |

---

## Future Plantasonic apps

Reuse this IA for any app built on the Plantasonic Design System:

1. Perform bar always visible at bottom
2. Three inspector categories minimum (adapt labels to product)
3. Command palette as primary discovery mechanism
4. Developer tools behind feature flags or separate routes — never in primary chrome
