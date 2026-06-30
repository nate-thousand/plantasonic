# Platform Manifest — Plantasonic

Plantasonic is the **official reference application** for the Plantasonic AI First Application Platform. It is a lightweight client that inherits platform capabilities — it does not duplicate design-system or engine infrastructure.

## Application modes

| Mode | Route | Description |
| ---- | ----- | ----------- |
| Reference | `#overview` (default) | Platform sections — no engines loaded |
| Instrument | `#instrument` | Live audiovisual demo via `mountInstrumentApp()` |

## Engines

| ID | Package | Integration |
| --- | --- | --- |
| `engine.sound` | `plantasia-sound-engine` | `@plantasonic/platform` adapter |
| `engine.visual` | `ascii-visual-engine` | `@plantasonic/platform` adapter |
| `engine.midi` | Web MIDI | `@plantasonic/platform` |
| `engine.video` | (roadmap) | Platform manifest slot |

Engines initialize **only** on the instrument route.

## Services

- `logging` — structured platform logging
- `settings` — generic key-value persistence
- `autosave` — debounced save hook
- `notifications` — shell notification bridge

## Workflows

Official AI workflow (see in-app **AI Workflow** section):

```text
Figma → Figma MCP → Plantasonic Design System → v0 → Cursor → GitHub → Vercel → Application
```

Ecosystem tooling workflows:

- `workflow.import-assets`
- `workflow.generate-documentation`
- `workflow.generate-visual-presets`

## Themes

Platform supports theme inheritance. This reference app runs **Default** (dark/light). **Signal 9**, **Plantasia**, and **Future Theme** are demonstrated as supported slots — not built in this repository.

## Authoritative manifest

See [`platform.json`](../platform.json) at repository root.
