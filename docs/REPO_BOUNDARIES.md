# Repository Boundaries

Plantasonic is the **product application**. It orchestrates user experience, runtime state, presets, and performance controls. It does **not** own synthesis, ASCII rendering, design tokens, or engineering workflow templates.

This document defines what each repository owns and how Plantasonic may reference external work **without merging repositories or copying source code**.

For the full stack explanation, see [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md). For phased delivery, see [INTEGRATION_PLAN.md](./INTEGRATION_PLAN.md).

---

## Ownership Summary

| Repository                                         | Owns                                                  | Does not own                                         |
| -------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| **ai-product-framework**                           | Process, prompts, docs, standards, workflows          | App code, UI, engines, design tokens                 |
| **ai-native-design-system**                        | Tokens, Bootstrap mapping, visual language, UI rules  | Application layout, runtime, engine logic            |
| **plantasia-sound-engine**                         | Audio engine only                                     | UI, visuals, runtime, presets at app level           |
| **ASCII Visual Engine** (`plantasia-ascii-engine`) | Visual rendering only                                 | UI, audio, runtime, presets at app level             |
| **plantasonic**                                    | Runtime, UI, presets, integration, product experience | Engine logic, token definitions, framework templates |

Until `plantasia-ascii-engine` ships as a standalone package, [plantasia-engine-test](https://github.com/nate-thousand/plantasia-engine-test) serves as a **reference app** for visual grammar and integration patterns — not a dependency to embed.

---

## Ecosystem Overview

```text
┌─────────────────────────────────────────────────────────────────────┐
│                         Plantasonic                                  │
│              (product app — this repository)                         │
│  UX · runtime · presets · adapters · app shell · app documentation  │
└──────────┬──────────────┬──────────────┬──────────────┬─────────────┘
           │              │              │              │
     npm dependency  npm dependency   token/docs    templates/docs
           │              │           reference       reference
           ▼              ▼              ▼              ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  plantasia-  │  │  plantasia-  │  │ ai-native-   │  │ ai-product-  │
│ sound-engine │  │ ascii-engine │  │ design-      │  │ framework    │
│              │  │ (future) or  │  │ system       │  │              │
│              │  │ engine-test  │  │              │  │              │
│              │  │ (reference)  │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
   audio library     visual library     visual language    engineering
```

**Plantasonic sits at the center.** Every other repository listed here remains independent. Do not merge them into Plantasonic. Do not move unrelated projects into this repository.

---

## Repository Roles

### Plantasonic (this repository)

|                |                                                                           |
| -------------- | ------------------------------------------------------------------------- |
| **Role**       | Product application                                                       |
| **GitHub**     | [nate-thousand/plantasonic](https://github.com/nate-thousand/plantasonic) |
| **Local path** | `synth-design/plantasonic/`                                               |

**Owns:**

- Application shell and responsive UI (`src/ui/`)
- Runtime orchestration, shared state, and event bus (`src/runtime/`)
- Preset manifest and preset world registration (`src/presets/`)
- Adapter interfaces that wrap external engines (`src/audio/`, `src/visuals/`)
- Input routing scaffolding (`src/midi/`, `src/keyboard/`, `src/touch/`)
- App-level Bootstrap theme wiring (`src/styles/`) — consumes tokens, does not define the design system
- Product documentation (`README.md`, `ARCHITECTURE.md`, `RUNTIME.md`, etc.)

**Does not own:**

- Audio synthesis or Tone.js graph logic
- ASCII rendering algorithms or canvas/WebGL output
- Design token definitions, component specs, or Figma libraries
- Engineering workflow templates, Cursor rules, or project kickoff scaffolds

---

### plantasia-sound-engine

|                |                                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------------- |
| **Role**       | Audio engine library                                                                            |
| **GitHub**     | [nate-thousand/plantasia-sound-engine](https://github.com/nate-thousand/plantasia-sound-engine) |
| **Local path** | `synth-design/plantasia-sound-engine/`                                                          |

**Owns:**

- Sound synthesis, species/preset definitions, Tone.js integration
- Generative composition and performance routing
- Public engine API (`createPlantasiaEngine`, species registry, etc.)
- Engine tests, examples, and engine-specific documentation

**Plantasonic integration:**

- Install as an **npm dependency** when engine integration begins
- Wire through `src/audio/soundAdapter.ts` — the only layer that imports the package
- Never copy engine source into Plantasonic

```json
// Future package.json reference (example)
"plantasia-sound-engine": "github:nate-thousand/plantasia-sound-engine#<tag>"
```

See [ENGINE_API.md](../ENGINE_API.md) for the adapter contract Plantasonic expects.

---

### plantasia-ascii-engine / plantasia-engine-test

|                            |                                                                                               |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| **Role**                   | ASCII / visual engine library (target) and integration reference (current)                    |
| **ASCII engine GitHub**    | _Dedicated package — not yet published_                                                       |
| **Reference app GitHub**   | [nate-thousand/plantasia-engine-test](https://github.com/nate-thousand/plantasia-engine-test) |
| **Local path (reference)** | `synth-design/plantasia-engine-test/`                                                         |

**Target: `plantasia-ascii-engine`**

When extracted as a standalone package, it will own:

- ASCII organism rendering and visual grammar
- Canvas/WebGL render loop and resize handling
- Visual preset configuration
- Public visual engine API

**Current: `plantasia-engine-test`**

Until a dedicated ASCII engine package exists, `plantasia-engine-test` serves as the **reference playground** for visual and integration patterns. It is a separate React application — not a library Plantasonic should embed or merge.

**Owns (in engine-test today):**

- Procedural ASCII visuals (`src/ascii/`, `src/visuals/`)
- Integration patterns for sound + visuals (adapter, transport, MIDI)
- Architecture and brand grammar documentation (`docs/brand/ASCII_GRAMMAR.md`)

**Plantasonic integration:**

- When `plantasia-ascii-engine` ships: install as an **npm dependency**, wire through `src/visuals/asciiAdapter.ts`
- Until then: treat `plantasia-engine-test` as a **documentation and pattern reference only** — read its architecture docs, do not copy its React components or visual code into Plantasonic
- Never copy ASCII rendering source into Plantasonic

---

### ai-native-design-system

|                |                                                                  |
| -------------- | ---------------------------------------------------------------- |
| **Role**       | Visual language and design system source of truth                |
| **Local path** | `ai-native-design-system/` (workspace sibling — not a submodule) |

**Owns:**

- Design tokens (colors, typography, spacing, motion, elevation)
- Component specifications and interaction patterns
- Bootstrap 5.0.2 theme mapping and SCSS token exports
- Figma libraries, variables, and Code Connect mappings
- AI generation rules for consistent UI output
- Accessibility standards (WCAG 2.1 AA baseline)

**Plantasonic integration:**

- **Import tokens** into `src/styles/variables.scss` from `ai-native-design-system/tokens/scss/`
- **Follow component specs** when building UI in `src/ui/`
- **Reference pattern docs** (app shell, control dock, navigation) from `ai-native-design-system/patterns/`
- Do **not** copy the entire design system repository into Plantasonic
- Do **not** redefine tokens in Plantasonic that already exist in the design system

See [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) for the Figma → tokens → Bootstrap flow inside Plantasonic.

---

### ai-product-framework

|                |                                                               |
| -------------- | ------------------------------------------------------------- |
| **Role**       | Engineering workflow, templates, and AI agent configuration   |
| **Local path** | `ai-product-framework/` (workspace sibling — not a submodule) |

**Owns:**

- Project kickoff, feature, roadmap, and handoff templates
- Cursor rules and coding standards
- Development workflow documentation (Cursor, GitHub, Vercel)
- Design OS methodology

**Plantasonic integration:**

- **Copy templates** into Plantasonic at project initialization (README, ROADMAP, CONTRIBUTING structure already derived from this pattern)
- **Reference workflow docs** when setting up CI, branching, or agent behavior
- Do **not** copy the entire framework repository into Plantasonic
- Do **not** treat framework templates as runtime dependencies

Plantasonic already contains product-specific documentation adapted from framework templates. Future updates should cherry-pick relevant templates, not vendor the whole framework.

---

## Boundary Rules

These rules apply to all contributors and AI agents working on Plantasonic:

| #   | Rule                                                                                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Plantasonic is the product app.** All user-facing instrument features ship here.                                                                                                    |
| 2   | **Sound engine stays external.** Import `plantasia-sound-engine` via npm; use `SoundAdapter` only.                                                                                    |
| 3   | **ASCII engine stays external.** Import `plantasia-ascii-engine` when available; use `AsciiAdapter` only. Until then, reference `plantasia-engine-test` docs — do not embed its code. |
| 4   | **Design system stays external.** Consume tokens and specs from `ai-native-design-system`; do not duplicate the token source of truth.                                                |
| 5   | **Product framework stays external.** Use templates and workflow docs from `ai-product-framework`; do not vendor the framework repo.                                                  |
| 6   | **No repository merging.** Sibling folders in the workspace are independent git repositories.                                                                                         |
| 7   | **No code copying.** Engine logic, visual rendering, and framework scaffolding are referenced or installed — never pasted into Plantasonic source.                                    |
| 8   | **Adapters are the only engine bridge.** UI and runtime never import engine packages directly (see [ARCHITECTURE.md](../ARCHITECTURE.md)).                                            |

---

## What Lives in Plantasonic vs. External Repos

| Concern                     | Owner                               | Plantasonic contains                               |
| --------------------------- | ----------------------------------- | -------------------------------------------------- |
| Audio synthesis             | `plantasia-sound-engine`            | Adapter interface + null impl                      |
| ASCII rendering             | `plantasia-ascii-engine` (future)   | Adapter interface + null impl                      |
| Visual integration patterns | `plantasia-engine-test` (reference) | Documentation links only                           |
| Design tokens               | `ai-native-design-system`           | Bootstrap overrides in `src/styles/variables.scss` |
| Component specs             | `ai-native-design-system`           | Bootstrap UI shell implementing specs              |
| Engineering workflow        | `ai-product-framework`              | Product docs adapted from templates                |
| Runtime orchestration       | **Plantasonic**                     | Full implementation                                |
| Preset worlds (app-level)   | **Plantasonic**                     | Manifest + world modules                           |
| User experience             | **Plantasonic**                     | UI shell, controls, layouts                        |

---

## Workspace Layout (local development)

Sibling repositories may exist on disk for co-development. This layout is a **workspace convenience**, not a monorepo:

```text
AI-Projects/
├── ai-native-design-system/     ← design tokens & specs
├── ai-product-framework/        ← engineering templates & workflow
└── synth-design/
    ├── plantasonic/             ← product app (this repo)
    ├── plantasia-sound-engine/  ← audio engine
    └── plantasia-engine-test/   ← visual/integration reference
```

Each directory has its own `.git` history and remote. Commit and push from within each repository independently.

---

## Related Documentation

| Document                                                   | Description                        |
| ---------------------------------------------------------- | ---------------------------------- |
| [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md)                 | Stack layers and data flow         |
| [REPO_BOUNDARIES.md](./REPO_BOUNDARIES.md)                 | Repository ownership rules         |
| [REPEATABLE_APP_TEMPLATE.md](./REPEATABLE_APP_TEMPLATE.md) | Reusable workflow for future apps  |
| [INTEGRATION_PLAN.md](./INTEGRATION_PLAN.md)               | Phased delivery plan               |
| [ARCHITECTURE.md](../ARCHITECTURE.md)                      | Module design and dependency graph |
| [ENGINE_API.md](../ENGINE_API.md)                          | Adapter contracts for both engines |
| [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md)                    | Token pipeline inside Plantasonic  |
| [CONTRIBUTING.md](../CONTRIBUTING.md)                      | Contribution standards             |
