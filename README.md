# Plantasonic

A browser-based generative audiovisual instrument — a living digital ecosystem powered by **@plantasonic/platform**.

**Current release:** v0.3.0

**Production:** https://www.plantasonic.xyz

Plantasonic is a **thin creative application**. It owns presets, branding, copy, and audiovisual world definitions. All infrastructure — lifecycle, event bus, Design System shell, engine adapters, audio-reactive bridge, preset bundles, performance controls, plugins, and project persistence — is provided by `@plantasonic/platform`.

See [docs/CREATIVE_VISION.md](./docs/CREATIVE_VISION.md) for creative constraints and [docs/REPO_BOUNDARIES.md](./docs/REPO_BOUNDARIES.md) for the ecosystem map.

## Architecture

```text
Plantasonic App (creative layer)
  src/platform-consumer/   — app config, branding, preset bundles
  src/presets/worlds/      — five audiovisual worlds
  src/visuals/language/    — visual identity taxonomy
        ↓ mountInstrumentApp()
@plantasonic/platform      — orchestration SDK
        ↓
plantasonic-design-system  — tokens, Bootstrap theme, instrument shell
plantasia-sound-engine     — sound synthesis (via platform adapter)
ascii-visual-engine        — ASCII visuals (via platform adapter)
```

Plantasonic does **not** own runtime orchestration, local MIDI routing, local adapters, or duplicated design tokens. See [ARCHITECTURE.md](./ARCHITECTURE.md).

## What Plantasonic owns

| Concern | Location |
| ------- | -------- |
| App name, copy, branding | `src/platform-consumer/content/branding.ts` |
| Preset worlds | `src/presets/worlds/` |
| World → platform bundle mapping | `src/platform-consumer/worldToBundle.ts` |
| Creative mappings (documentation) | `src/platform-consumer/content/mappings.ts` |
| Visual language taxonomy | `src/visuals/language/` |
| Theme bootstrap (flash prevention) | `src/services/appSettingsStore.ts` |
| Styles (DS imports only) | `src/styles/` |

## Quick start

Requires the sibling [plantasonic-platform](https://github.com/nate-thousand/plantasonic-platform) repository at `../plantasonic-platform`.

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Scripts

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run validate:app` | Assert thin-app architecture (no legacy infrastructure) |
| `npm run verify:integration` | Boot platform shell in happy-dom |
| `npm run verify:presets` | Validate worlds map to engine presets |
| `npm run verify:platform-sdk` | Verify platform dependency wiring |
| `npm run verify:design-system` | Verify DS integration |
| `npm run lint` | ESLint |

## Related repositories

| Repository | Role |
| ---------- | ---- |
| [plantasonic-platform](https://github.com/nate-thousand/plantasonic-platform) | Orchestration SDK, mount API |
| [plantasonic-design-system](https://github.com/nate-thousand/plantasonic-design-system) | Design tokens, shell, instrument UI |
| [plantasia-sound-engine](https://github.com/nate-thousand/plantasia-sound-engine) | Sound synthesis |
| [ascii-visual-engine](https://github.com/nate-thousand/ascii-visual-engine) | ASCII rendering |

Do not copy engine or design system source into this repository.

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — system design
- [ROADMAP.md](./ROADMAP.md) — development milestones
- [CHANGELOG.md](./CHANGELOG.md) — release history
- [docs/CREATIVE_VISION.md](./docs/CREATIVE_VISION.md) — creative north star
