# Plantasonic

**Plantasonic = AI First Application Platform**

The official **reference application** for the Plantasonic AI First Application Platform — and a living generative audiovisual instrument powered by **@plantasonic/platform**.

**Current release:** v0.4.0

**Production:** https://www.plantasonic.xyz

Opening the app lands on the **Platform Overview**. Navigate sections to learn how applications inherit design system, themes, engines, AI workflows, templates, and components. Launch **Live Instrument** (`#instrument`) for the full audiovisual demo.

See [docs/REFERENCE_APP.md](./docs/REFERENCE_APP.md) for the reference application philosophy and [docs/CREATIVE_VISION.md](./docs/CREATIVE_VISION.md) for creative constraints.

## What this application demonstrates

| Area | Section |
| ---- | ------- |
| Platform inheritance | Overview |
| Design tokens & shell | Design System |
| Theme manifests | Theme System (Default, Signal 9, Plantasia, Future) |
| Shared UI | Components |
| CLI scaffolds | Templates |
| Sound synthesis | Audio Engine → Live Instrument |
| ASCII rendering | ASCII Engine → Live Instrument |
| Visual identity | Visual Engine |
| Video slot | Video Engine |
| Performance input | MIDI → Live Instrument |
| AI toolchain | AI Workflow |
| Quality gates | Developer Tools |

## Architecture

```text
Plantasonic Reference App
  src/platform-reference/  — overview, sections, hash router
  src/platform-consumer/   — instrument config, branding, preset bundles
  src/presets/worlds/      — five audiovisual worlds
  src/visuals/language/    — visual identity taxonomy
        ↓ mountInstrumentApp() on #instrument only
@plantasonic/platform      — orchestration SDK
        ↓
plantasonic-design-system  — tokens, Bootstrap theme, shell
plantasia-sound-engine     — sound (via platform adapter)
ascii-visual-engine        — ASCII visuals (via platform adapter)
```

Plantasonic does **not** own runtime orchestration, local adapters, or duplicated design tokens. See [ARCHITECTURE.md](./ARCHITECTURE.md).

## Quick start

Requires the sibling [plantasonic-platform](https://github.com/nate-thousand/plantasonic-platform) repository at `../plantasonic-platform`.

```bash
npm install
npm run dev
```

Open http://localhost:5173 — Platform Overview loads by default. Use `#instrument` for the live demo.

## Scripts

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run validate:app` | Assert thin-app architecture |
| `npm run verify:integration` | Boot instrument shell in happy-dom |
| `npm run verify:presets` | Validate worlds map to engine presets |
| `npm run verify:platform-sdk` | Verify platform dependency wiring |
| `npm run verify:design-system` | Verify DS integration |
| `npm run lint` | ESLint |

## Related repositories

| Repository | Role |
| ---------- | ---- |
| [plantasonic-platform](https://github.com/nate-thousand/plantasonic-platform) | Orchestration SDK, mount API |
| [plantasonic-design-system](https://github.com/nate-thousand/plantasonic-design-system) | Design tokens, shell, showcase |
| [plantasia-sound-engine](https://github.com/nate-thousand/plantasia-sound-engine) | Sound synthesis |
| [ascii-visual-engine](https://github.com/nate-thousand/ascii-visual-engine) | ASCII rendering |

## Documentation

- [docs/REFERENCE_APP.md](./docs/REFERENCE_APP.md) — reference application mission
- [ARCHITECTURE.md](./ARCHITECTURE.md) — system design
- [ROADMAP.md](./ROADMAP.md) — development milestones
- [CHANGELOG.md](./CHANGELOG.md) — release history
- [docs/PLATFORM.md](./docs/PLATFORM.md) — platform manifest
- [docs/CREATIVE_VISION.md](./docs/CREATIVE_VISION.md) — creative north star
