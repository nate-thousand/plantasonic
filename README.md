# Plantasonic

A browser-based generative audiovisual instrument that combines the **Plantasia Sound Engine** and **ASCII Visual Engine** through a shared runtime.

**Current release:** v0.2.3

**Production:** https://plantasonic.vercel.app

**Plantasonic is both a working audiovisual instrument and the first proof of a repeatable AI-assisted product system.** It is also the **first consumer** of [plantasonic-design-system](https://github.com/nate-thousand/plantasonic-design-system) v1.2.x — the public Application Shell, tokens, and Bootstrap theme come from that package, not local copies.

Plantasonic is responsible for user experience, runtime orchestration, state management, presets, performance controls, and product documentation. Engine logic, design tokens, and engineering workflow templates live in **separate repositories** — never duplicated inside this repo.

See [docs/SYSTEM_OVERVIEW.md](./docs/SYSTEM_OVERVIEW.md) for the full stack and [docs/REPO_BOUNDARIES.md](./docs/REPO_BOUNDARIES.md) for the ecosystem map.

## Vision

Plantasonic is a **living audiovisual instrument inspired by nature** — not a synthesizer with visuals attached. Users cultivate an evolving digital ecosystem rather than program a machine.

See **[docs/CREATIVE_VISION.md](./docs/CREATIVE_VISION.md)** for authoritative creative constraints, engine scope, and the decision filter for all feature work.

Plantasonic is also an instrument, not a demo: a performable interface for generative sound and ASCII visuals as a unified experience. The runtime coordinates both engines while keeping their implementations isolated behind adapter boundaries.

As the first product built with the repeatable system, Plantasonic validates the workflow documented in [docs/REPEATABLE_APP_TEMPLATE.md](./docs/REPEATABLE_APP_TEMPLATE.md) — the same process can be applied to future app concepts.

## The Product System

```text
AI Product Framework        →  process, docs, Cursor rules
Plantasonic Design System   →  tokens, CSS variables, Bootstrap theme
Reusable Engines            →  sound + ASCII capability modules
Plantasonic Runtime         →  integration layer (state, events, adapters)
Plantasonic App             →  user experience
```

**Integration status:** Phases 1–10 complete. **Design system consumer integration (Phase 3.9)** — Plantasonic is the first app to consume `plantasonic-design-system` for tokens, Bootstrap, and application shell.

| Layer | Location in Plantasonic |
| ----- | ----------------------- |
| AI Product Framework | `docs/product-framework/`, `.cursor/rules/`, `HANDOFF.md` |
| Plantasonic Design System | `plantasonic-design-system` package → `src/shell/`, `src/styles/` — see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |
| Sound Engine            | `src/audio/soundAdapter.ts` → `plantasia-sound-engine`    |
| ASCII Visual Engine     | `src/visuals/plantasiaAsciiAdapter.ts` → `ascii-visual-engine` |
| Visual Language         | `src/visuals/language/`, `docs/VISUAL_LANGUAGE.md`          |
| Runtime                 | `src/runtime/` — functional API + adapter wiring          |
| Interaction             | `src/interaction/` — unified input routing                  |
| App Experience          | `src/ui/experience/`, `docs/USER_EXPERIENCE.md`, `docs/NAVIGATION.md` |
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
| `plantasonic-design-system`                                                       | Design tokens, CSS variables, Bootstrap theme, application shell | npm dependency — `css/variables.css`, `scss/*`, `shell` API via `src/shell/` |
| `ai-native-design-system`                                                         | Generic predecessor (archived reference)      | Superseded by plantasonic-design-system                           |
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
│   ├── shell/         Design-system Application Shell integration
│   ├── shell/         Design-system application shell integration
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
│   ├── design-system/ Integration pointer (see plantasonic-design-system package)
│   └── styles/        Bootstrap + shell styles (consumes design system package)
├── docs/
│   ├── product-framework/  AI Product Framework integration
│   └── design-system/      Integration docs (package is source of truth)
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

Requires [plantasonic-design-system](https://github.com/nate-thousand/plantasonic-design-system) v1.2.1+ via npm (GitHub dependency). Local development may use a `file:` symlink at `../plantasonic-design-system` instead.

```bash
npm install
```

### Design system updates

Token and theme changes live in **plantasonic-design-system**, not this repo:

```bash
cd ../plantasonic-design-system
npm run build                    # regenerate css/variables.css
cd ../plantasonic && npm install # refresh dependency
npm run build                    # verify
```

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) and [src/design-system/README.md](./src/design-system/README.md).

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
npm run lint                    # ESLint
npm run build                   # TypeScript + Vite production bundle
npm run verify:design-system    # Design system package integration
npm run verify:performance      # Latency path invariants
npm run verify:sound            # Sound engine adapter checks
npm run verify:presets          # Preset world validation
npm run verify:runtime          # Runtime + mock adapter checks
npm run verify:state            # Runtime state validation
npm run verify:generative       # Generative control mapping
npm run verify:midi             # MIDI input module
npm run verify:keyboard         # Keyboard input module
npm run verify:interaction      # Interaction layer checks
npm run verify:visual           # Visual language checks
npm run verify:integration      # Full-stack integration (happy-dom)
npm run format:check            # Prettier check
npm run format                  # Prettier write
```

### MVP Status

**MVP-ready for demos** as of the 2026-06-28 full system bug check. See [docs/BUG_CHECK_REPORT.md](./docs/BUG_CHECK_REPORT.md) for bugs found, fixes applied, and known limitations (pause, save/randomize preset not implemented).


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
| [docs/NAVIGATION.md](./docs/NAVIGATION.md) | Navigation architecture (Perform / Sound / Visuals / Environment) |
| [docs/VISUAL_LANGUAGE.md](./docs/VISUAL_LANGUAGE.md) | Phase 10 visual language and motion |
| [docs/CREATIVE_VISION.md](./docs/CREATIVE_VISION.md) | Creative constraints and engine scope (decision filter) |
| [docs/product-framework/README.md](./docs/product-framework/README.md) | AI Product Framework integration    |
| [docs/design-system/README.md](./docs/design-system/README.md)         | Design system integration index |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)                                 | Package consumption guide       |

### Architecture and Development

| Document                               | Description                     |
| -------------------------------------- | ------------------------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md)   | System design and boundaries    |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | plantasonic-design-system package integration |
| [ENGINE_API.md](./ENGINE_API.md)       | Engine adapter contracts        |
| [RUNTIME.md](./RUNTIME.md)             | State, events, and control flow |
| [ROADMAP.md](./ROADMAP.md)             | Milestone roadmap               |
| [CONTRIBUTING.md](./CONTRIBUTING.md)   | Contribution guidelines         |
| [CHANGELOG.md](./CHANGELOG.md)         | Version history                 |
| [docs/BUG_CHECK_REPORT.md](./docs/BUG_CHECK_REPORT.md) | MVP bug check audit (2026-06-28) |
| [docs/PERFORMANCE_REPORT.md](./docs/PERFORMANCE_REPORT.md) | Performance and latency audit (2026-06-28) |

## License

MIT — see [LICENSE](./LICENSE).
