# Platform Manifest — Plantasonic

Plantasonic is a **lightweight client** of the Plantasonic Creative Ecosystem. It installs shared engines and consumes platform services — it does not duplicate design-system infrastructure.

## Engines

| ID | Package | Adapter |
| --- | --- | --- |
| `engine.sound` | `plantasia-sound-engine` | `src/audio/soundAdapter.ts` |
| `engine.visual` | `ascii-visual-engine` | `src/visuals/plantasiaAsciiAdapter.ts` |
| `engine.midi` | (Web MIDI in-app) | `src/midi/` |

Runtime resolves adapters via `src/platform/engines.ts` from `platform.json`.

## Services

- `logging` — structured platform logging
- `settings` — generic key-value persistence (`platformServices.settings`)
- `autosave` — debounced save hook (domain stores handle interaction settings)
- `notifications` — shell notification bridge

Bootstrap: `bootstrapPlatform()` in `src/platform/services.ts`.

## Workflows

Invoked from ecosystem tooling (not reimplemented locally):

- `workflow.import-assets`
- `workflow.generate-documentation`
- `workflow.generate-visual-presets`

## Authoritative manifest

See [`platform.json`](../platform.json) at repository root.
