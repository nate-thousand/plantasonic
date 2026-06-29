# Plantasonic

A browser-based generative audiovisual instrument that combines the **Plantasia Sound Engine** and **ASCII Visual Engine** through a shared runtime.

**Plantasonic is both a working audiovisual instrument and the first proof of a repeatable AI-assisted product system.** It demonstrates how independent repositories — process framework, design system, capability engines, and a product app — compose into a shippable application without merging codebases or duplicating logic.

Plantasonic is responsible for user experience, runtime orchestration, state management, presets, performance controls, and product documentation. Engine logic, design tokens, and engineering workflow templates live in **separate repositories** — never duplicated inside this repo.

See [docs/SYSTEM_OVERVIEW.md](./docs/SYSTEM_OVERVIEW.md) for the full stack and [docs/REPO_BOUNDARIES.md](./docs/REPO_BOUNDARIES.md) for the ecosystem map.

## Vision

Plantasonic is an instrument, not a demo. It provides a performable, responsive interface for exploring generative sound and ASCII visuals as a unified experience. The runtime coordinates both engines while keeping their implementations isolated behind adapter boundaries.

As the first product built with the repeatable system, Plantasonic validates the workflow documented in [docs/REPEATABLE_APP_TEMPLATE.md](./docs/REPEATABLE_APP_TEMPLATE.md) — the same process can be applied to future app concepts.

## The Product System

```text
AI Product Framework        →  process, docs, Cursor rules
AI Native Design System     →  tokens, Bootstrap theme, UI rules
Reusable Engines            →  sound + ASCII capability modules
Plantasonic Runtime         →  integration layer (state, events, adapters)
Plantasonic App             →  user experience
```

**Integration status:** Phases 1–10 complete — engines, preset worlds, interaction layer, application experience, and expressive visual language.

| Layer                   | Location in Plantasonic                                   |
| ----------------------- | --------------------------------------------------------- |
| AI Product Framework    | `docs/product-framework/`, `.cursor/rules/`, `HANDOFF.md` |
| AI Native Design System | `src/design-system/`, `DESIGN_SYSTEM.md`, `docs/design-system/` |
| Sound Engine            | `src/audio/soundAdapter.ts` → `plantasia-sound-engine`    |
| ASCII Visual Engine     | `src/visuals/plantasiaAsciiAdapter.ts` → `ascii-visual-engine` |
| Visual Language         | `src/visuals/language/`, `docs/VISUAL_LANGUAGE.md`          |
| Runtime                 | `src/runtime/` — functional API + adapter wiring          |
| Interaction             | `src/interaction/` — unified input routing                  |
| App Experience          | `src/ui/experience/`, `docs/USER_EXPERIENCE.md`             |
| App                     | `src/app/`, `src/ui/`, `src/presets/` (world registry)    |

See [docs/SYSTEM_OVERVIEW.md](./docs/SYSTEM_OVERVIEW.md) for layer detail and [docs/INTEGRATION_PLAN.md](./docs/INTEGRATION_PLAN.md) for the phased build plan.

## Architecture

```text
User
  ↓
UI Layer (Bootstrap shell, controls, layouts)
  ↓
Runtime (state, events, lifecycle)
  ↓
Sound Adapter ──→ Plantasia Sound Engine
  ↓
ASCII Adapter ──→ Plantasia ASCII Engine
```

The **runtime is the only layer** permitted to communicate with both engines. UI components never call engine APIs directly.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full system design.

## Related Repositories

Plantasonic is the product app at the center of an independent repository ecosystem. It references — but does not contain — these external projects:

| Repository                                                                        | Role                                | Integration                                                  |
| --------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------ |
| [plantasonic](https://github.com/nate-thousand/plantasonic)                       | **Product app** (this repo)         | —                                                            |
| [plantasia-sound-engine](https://github.com/nate-thousand/plantasia-sound-engine) | Audio engine library                | npm dependency via `src/audio/soundAdapter.ts`               |
| `ascii-visual-engine`                                                             | ASCII engine library                | npm dependency via `src/visuals/plantasiaAsciiAdapter.ts`      |
| [plantasia-engine-test](https://github.com/nate-thousand/plantasia-engine-test)   | Visual/integration reference        | Documentation and pattern reference until ASCII engine ships |
| `ai-native-design-system`                                                         | Design tokens, components, patterns | Token imports into `src/styles/`                             |
| `ai-product-framework`                                                            | Engineering workflow and templates  | Docs and templates at project setup                          |

Do not merge these repositories into Plantasonic. Do not copy their source code. See [docs/REPO_BOUNDARIES.md](./docs/REPO_BOUNDARIES.md).

## Folder Structure

```text
plantasonic/
├── src/
│   ├── app/           Application bootstrap and lifecycle
│   ├── runtime/       State, events, orchestration
│   ├── audio/         Sound engine adapter
│   ├── visuals/       ASCII engine adapter
│   ├── ui/            Components, layouts, controls, experience layer
│   ├── presets/       Preset manifest and worlds
│   ├── interaction/   Unified input routing (MIDI, keyboard, mouse, touch)
│   ├── midi/          Web MIDI input module
│   ├── keyboard/      Keyboard mapping module
│   ├── touch/         Touch gesture module
│   ├── mouse/         Mouse fine-adjust module
│   ├── automation/    Automation hook interface
│   ├── services/      Settings persistence (interaction + app)
│   ├── utils/         Shared utilities
│   ├── design-system/ Design tokens (from ai-native-design-system)
│   └── styles/        Bootstrap compilation entry
├── docs/
│   ├── product-framework/  AI Product Framework integration
│   └── design-system/      AI Native Design System integration
├── .cursor/rules/     Cursor agent rules (from framework)
├── HANDOFF.md         Session handoff (framework template)
├── public/            Static assets
└── .github/           CI and contribution templates
```

## Tech Stack

| Category        | Technology          |
| --------------- | ------------------- |
| Build           | Vite                |
| Language        | TypeScript (strict) |
| Package manager | npm                 |
| UI framework    | Bootstrap 5.0.2     |
| Animation       | GSAP                |
| Linting         | ESLint              |
| Formatting      | Prettier            |

### Prepared for Future Integration

- Tone.js (via Sound Engine)
- Web MIDI
- Fullscreen API
- Canvas / WebGL
- Touch and mobile
- PWA

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open the local URL shown in the terminal (typically `http://localhost:5173`).

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Code Quality

```bash
npm run lint          # ESLint
npm run verify:runtime # Runtime + mock adapter checks
npm run verify:interaction # Interaction layer checks
npm run verify:visual      # Visual language checks
npm run format:check  # Prettier check
npm run format        # Prettier write
```

## Development Workflow

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) and [RUNTIME.md](./RUNTIME.md) before adding features.
2. Follow [CONTRIBUTING.md](./CONTRIBUTING.md) for branch naming, commits, and documentation requirements.
3. Update [CHANGELOG.md](./CHANGELOG.md) for user-facing changes.
4. Track progress in [ROADMAP.md](./ROADMAP.md).

Sound and ASCII engines integrated. See integration docs:

- [docs/SOUND_ENGINE_INTEGRATION.md](./docs/SOUND_ENGINE_INTEGRATION.md)
- [docs/ASCII_VISUAL_ENGINE_INTEGRATION.md](./docs/ASCII_VISUAL_ENGINE_INTEGRATION.md)

The runtime API is stable — swap adapter implementations only. See [RUNTIME.md](./RUNTIME.md) and [ENGINE_API.md](./ENGINE_API.md).

## Documentation

### Product System

| Document                                                               | Description                         |
| ---------------------------------------------------------------------- | ----------------------------------- |
| [docs/SYSTEM_OVERVIEW.md](./docs/SYSTEM_OVERVIEW.md)                   | Stack layers and data flow          |
| [docs/REPO_BOUNDARIES.md](./docs/REPO_BOUNDARIES.md)                   | Ecosystem repos and ownership       |
| [docs/REPEATABLE_APP_TEMPLATE.md](./docs/REPEATABLE_APP_TEMPLATE.md)   | Reusable workflow for future apps   |
| [docs/INTEGRATION_PLAN.md](./docs/INTEGRATION_PLAN.md)                 | Phased delivery plan                |
| [docs/SOUND_ENGINE_INTEGRATION.md](./docs/SOUND_ENGINE_INTEGRATION.md) | Phase 5 sound engine integration    |
| [docs/ASCII_VISUAL_ENGINE_INTEGRATION.md](./docs/ASCII_VISUAL_ENGINE_INTEGRATION.md) | Phase 6 ASCII engine integration |
| [docs/PRESETS.md](./docs/PRESETS.md) | Phase 7 unified preset worlds |
| [docs/INTERACTION_LAYER.md](./docs/INTERACTION_LAYER.md) | Phase 8 interaction architecture |
| [docs/USER_EXPERIENCE.md](./docs/USER_EXPERIENCE.md) | Phase 9 application experience |
| [docs/VISUAL_LANGUAGE.md](./docs/VISUAL_LANGUAGE.md) | Phase 10 visual language and motion |
| [docs/product-framework/README.md](./docs/product-framework/README.md) | AI Product Framework integration    |
| [docs/design-system/README.md](./docs/design-system/README.md)         | AI Native Design System integration |
| [HANDOFF.md](./HANDOFF.md)                                             | Current session handoff             |

### Architecture and Development

| Document                               | Description                     |
| -------------------------------------- | ------------------------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md)   | System design and boundaries    |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Figma → tokens → Bootstrap flow |
| [ENGINE_API.md](./ENGINE_API.md)       | Engine adapter contracts        |
| [RUNTIME.md](./RUNTIME.md)             | State, events, and control flow |
| [ROADMAP.md](./ROADMAP.md)             | Milestone roadmap               |
| [CONTRIBUTING.md](./CONTRIBUTING.md)   | Contribution guidelines         |
| [CHANGELOG.md](./CHANGELOG.md)         | Version history                 |

## License

MIT — see [LICENSE](./LICENSE).
