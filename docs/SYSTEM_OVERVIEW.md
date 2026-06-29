# System Overview

Plantasonic is the first proof of a **repeatable AI-assisted product system**. It demonstrates how independent repositories — process framework, design system, capability engines, and a product app — compose into a shippable application without merging codebases or duplicating logic.

This document explains the stack, how each layer contributes, and where responsibility stops.

---

## The Stack

```text
AI Product Framework
  → project process

AI Native Design System
  → visual system

Reusable Engines
  → capability modules

Runtime
  → integration layer

App
  → final user experience
```

Each layer is a **separate repository or module boundary**. Plantasonic imports, references, or adapts external work — it does not absorb it.

---

## Layer by Layer

### 1. AI Product Framework → Project Process

**Repository:** `ai-product-framework` (workspace sibling)

**Provides:**

- Project kickoff, roadmap, and handoff templates
- Cursor rules and coding standards
- Development workflow (Cursor, GitHub, Vercel)
- Design OS methodology for starting and shipping products

**How Plantasonic uses it:**

- `docs/product-framework/` — workflow, standards, templates
- `.cursor/rules/` — adapted Cursor agent rules
- `HANDOFF.md` — session handoff from framework template
- Documentation structure (README, ROADMAP, CONTRIBUTING, CHANGELOG)

**Does not provide:** Application code, UI, engines, or design tokens.

---

### 2. AI Native Design System → Visual System

**Repository:** `ai-native-design-system` (workspace sibling)

**Provides:**

- Design tokens (colors, typography, spacing, motion)
- Bootstrap 5.0.2 theme mapping and SCSS exports
- Component specifications and interaction patterns
- Figma libraries and AI generation rules
- Accessibility standards (WCAG 2.1 AA)

**How Plantasonic uses it:**

- `src/design-system/` — token SCSS and Bootstrap overrides
- `docs/design-system/` — color, typography, spacing, component, and pattern guidance
- Component and pattern specs when building `src/ui/`

**Does not provide:** Application layout, runtime logic, or engine integration.

---

### 3. Reusable Engines → Capability Modules

Engines are **npm packages** that deliver a single capability. They have no knowledge of Plantasonic, React, or the UI shell.

| Engine                 | Repository                           | Capability                        |
| ---------------------- | ------------------------------------ | --------------------------------- |
| Plantasia Sound Engine | `plantasia-sound-engine`             | Audio synthesis, presets, Tone.js |
| ASCII Visual Engine    | `plantasia-ascii-engine` _(planned)_ | ASCII rendering, canvas/WebGL     |

**Reference until ASCII engine ships:** `plantasia-engine-test` documents visual grammar and integration patterns — read only, do not embed.

**How Plantasonic uses them:**

- Install as npm dependencies when integration phases begin
- Connect exclusively through adapter interfaces (`src/audio/`, `src/visuals/`)
- Never import engine packages from UI or copy engine source

**Does not provide:** User experience, presets at the app level, or cross-engine coordination.

---

### 4. Runtime → Integration Layer

**Location:** `src/runtime/` (inside Plantasonic)

**Provides:**

- Shared application state (`StateStore`)
- Typed event bus (`EventBus`)
- Lifecycle orchestration (`Runtime` class)
- Coordination of both engine adapters
- Preset loading, parameter sync, viewport resize

**Rules:**

- Runtime is the **only layer** that calls both adapters
- UI never talks to engines directly
- Adapters never talk to each other directly

See [RUNTIME.md](../RUNTIME.md) for the full specification.

---

### 5. App → Final User Experience

**Location:** `src/app/`, `src/ui/`, `src/presets/`, `src/styles/` (inside Plantasonic)

**Provides:**

- Application bootstrap and shell
- Top navigation, stage, control dock, collapsible menu
- Preset manifest and world registration
- Input routing scaffolding (MIDI, keyboard, touch)
- Product documentation

**This is what ships to users.** Everything above exists to make the app buildable, consistent, and maintainable.

---

## Data Flow

```text
User interaction
  ↓
App (UI shell)
  ↓
Runtime (state + events + lifecycle)
  ↓
├── Sound Adapter ──→ plantasia-sound-engine
└── ASCII Adapter ──→ plantasia-ascii-engine
```

Design tokens flow separately:

```text
ai-native-design-system
  ↓ (SCSS token import)
src/styles/variables.scss
  ↓ (Bootstrap overrides)
src/ui/ components
```

Process and standards flow at project setup:

```text
ai-product-framework
  ↓ (templates + workflow docs)
Plantasonic docs + .github/ + CONTRIBUTING.md
```

---

## Why This Structure Is Repeatable

The same five-layer pattern applies to any future product concept:

| Layer                   | Reusable?          | Example for a different app                |
| ----------------------- | ------------------ | ------------------------------------------ |
| AI Product Framework    | Yes — same repo    | Same kickoff, same Cursor rules            |
| AI Native Design System | Yes — same repo    | Same tokens, different layout              |
| Engines                 | Swap per concept   | Data viz engine instead of ASCII           |
| Runtime                 | Pattern reusable   | New `src/runtime/` with same adapter model |
| App                     | Unique per product | Different UI, presets, and docs            |

Plantasonic proves the pattern with audiovisual engines. The next product reuses framework + design system, defines new engine dependencies, scaffolds a new runtime, and builds a new app shell.

See [REPEATABLE_APP_TEMPLATE.md](./REPEATABLE_APP_TEMPLATE.md) for the step-by-step workflow.

---

## Current State

| Layer                   | Status         | Plantasonic location                         |
| ----------------------- | -------------- | -------------------------------------------- |
| AI Product Framework    | **Integrated** | `docs/product-framework/`, `.cursor/rules/`  |
| AI Native Design System | **Integrated** | `src/design-system/`, `docs/design-system/`  |
| Sound Engine            | **Integrated** | `src/audio/soundAdapter.ts` → `plantasia-sound-engine` |
| ASCII Visual Engine     | Mock (Phase 6) | `src/visuals/mockAsciiAdapter.ts`          |
| Runtime                 | **Functional** | `src/runtime/`                             |
| App                     | Wired to runtime | `src/ui/`, `src/app/`                    |

Phases 1–5 complete. Sound engine live. See [INTEGRATION_PLAN.md](./INTEGRATION_PLAN.md) Phase 6 next.

---

## Related Documentation

| Document                                                   | Description                        |
| ---------------------------------------------------------- | ---------------------------------- |
| [REPO_BOUNDARIES.md](./REPO_BOUNDARIES.md)                 | What each repository owns          |
| [REPEATABLE_APP_TEMPLATE.md](./REPEATABLE_APP_TEMPLATE.md) | Workflow for future products       |
| [INTEGRATION_PLAN.md](./INTEGRATION_PLAN.md)               | Phased build plan for Plantasonic  |
| [ARCHITECTURE.md](../ARCHITECTURE.md)                      | Module design and dependency graph |
