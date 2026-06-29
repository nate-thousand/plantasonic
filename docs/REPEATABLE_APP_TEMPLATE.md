# Repeatable App Template

This document describes the **repeatable workflow** for creating any new product using the AI-assisted product system. Plantasonic is the first application built with this process.

Follow these steps in order. Each step references external repositories without merging or copying them wholesale.

---

## Prerequisites

Before starting a new app, ensure these repositories exist and are accessible:

| Repository                  | Purpose                                         |
| --------------------------- | ----------------------------------------------- |
| `ai-product-framework`      | Process, templates, Cursor rules                |
| `ai-native-design-system`   | Tokens, components, Bootstrap mapping           |
| One or more engine packages | Capability modules (audio, visuals, data, etc.) |

---

## The 10-Step Workflow

### 1. Create New GitHub Repository

Create a dedicated repository for the product app.

```bash
# Example
gh repo create my-new-app --private --clone
cd my-new-app
```

**Rules:**

- One product = one repository
- Do not add engine or design system repos as submodules
- Do not create a monorepo containing all layers

---

### 2. Apply AI Product Framework

Copy and adapt framework templates — do not vendor the entire framework repo.

**From `ai-product-framework/templates/`:**

| Template                | Becomes            |
| ----------------------- | ------------------ |
| `README_TEMPLATE.md`    | `README.md`        |
| `ROADMAP_TEMPLATE.md`   | `ROADMAP.md`       |
| `CHANGELOG_TEMPLATE.md` | `CHANGELOG.md`     |
| `PROJECT_CHECKLIST.md`  | Setup verification |

**From `ai-product-framework/system/`:**

| File                  | Action                                   |
| --------------------- | ---------------------------------------- |
| `CODING_STANDARDS.md` | Reference in `CONTRIBUTING.md`           |
| `CURSOR_RULES.md`     | Copy relevant rules to `.cursor/rules/`  |
| `PRE_PROMPT.md`       | Adapt for product-specific agent context |

**From `ai-product-framework/docs/`:**

- Follow `WORKFLOW.md` for GitHub + Vercel setup
- Follow `CURSOR_WORKFLOW.md` for day-to-day development

**Also create:**

- `CONTRIBUTING.md` — branch naming, commits, doc requirements
- `ARCHITECTURE.md` — system design
- `.github/workflows/ci.yml` — lint, format, build
- `docs/REPO_BOUNDARIES.md` — ecosystem map
- `docs/SYSTEM_OVERVIEW.md` — stack explanation
- `docs/INTEGRATION_PLAN.md` — phased delivery plan
- `docs/product-framework/` — framework integration index
- `HANDOFF.md` — session handoff

**Plantasonic example:** see [docs/product-framework/README.md](./product-framework/README.md)

---

### 3. Apply AI Native Design System

Wire the visual system without copying the design system repository.

**Token import:**

1. Read semantics from `ai-native-design-system/foundation/` (colors, typography, spacing)
2. Create `src/design-system/tokens/` with `$ds-*` semantic variables
3. Map to Bootstrap in `src/design-system/bootstrap/_overrides.scss`
4. Import via `src/styles/index.scss`

**Documentation mirror:**

- Create `docs/design-system/` with token catalog, color/typography/spacing rules, Bootstrap mapping, component and pattern indexes

**Component rules:**

- Follow specs in `ai-native-design-system/components/`
- Follow layout patterns in `ai-native-design-system/patterns/`
- Use Bootstrap 5.0.2 as the rendering engine (per design system rules)

**Document:**

- Create `DESIGN_SYSTEM.md` describing the Figma → tokens → Bootstrap flow inside the app
- Link back to `ai-native-design-system` as the source of truth

**Do not:**

- Redefine tokens that already exist in the design system
- Copy Figma files or component libraries into the app repo

---

### 4. Define App Concept

Write a clear product definition before writing feature code.

**Document in README.md:**

- What the app does (one paragraph)
- Who it is for
- What makes it different from engines and reference apps

**Document in ARCHITECTURE.md:**

- Responsibilities of the app vs. external repos
- Module dependency graph
- Application flow (init, playback, presets, teardown)

**Document in docs/REPO_BOUNDARIES.md:**

- Which engines this app uses
- What the app owns vs. what stays external

Plantasonic example: _"A browser-based generative audiovisual instrument combining sound and ASCII visuals through a shared runtime."_

---

### 5. Define Engine Dependencies

Identify which capability modules the app needs. Document contracts before installing packages.

**For each engine, create:**

- Adapter interface in `src/<capability>/` (e.g., `src/audio/soundAdapter.ts`)
- Contract documentation in `ENGINE_API.md`
- Null/stub adapter for development before real integration

**Dependency rules:**

| Rule                                   | Rationale                           |
| -------------------------------------- | ----------------------------------- |
| Engines install via npm only           | Clean versioning, no source copying |
| Adapters are the only import point     | UI and runtime stay decoupled       |
| No engine imports until phase is ready | Avoid unstable API coupling         |
| One adapter per engine                 | Single responsibility               |

**package.json example (future):**

```json
{
  "dependencies": {
    "plantasia-sound-engine": "github:nate-thousand/plantasia-sound-engine#v1.0.0"
  }
}
```

---

### 6. Create Runtime

Build the integration layer that coordinates engines and state.

**Scaffold `src/runtime/`:**

| File         | Purpose                                               |
| ------------ | ----------------------------------------------------- |
| `types.ts`   | Shared state and config types                         |
| `state.ts`   | Immutable state store with subscriptions              |
| `events.ts`  | Typed event bus                                       |
| `runtime.ts` | Orchestrator — init, start, stop, presets, parameters |
| `index.ts`   | Barrel exports                                        |

**Runtime rules:**

- Runtime calls adapters — never engines directly from UI
- Runtime owns shared state — engines do not share state with each other
- Runtime emits events — UI subscribes, does not poll

Document the runtime in `RUNTIME.md`.

---

### 7. Build UI Shell

Create the application chrome before building controls or engine features.

**Scaffold `src/ui/`:**

| Directory     | Purpose                           |
| ------------- | --------------------------------- |
| `layouts/`    | Page-level composition (AppShell) |
| `components/` | Nav, stage, dock, menu            |
| `controls/`   | Parameter widgets (future)        |

**Shell checklist:**

- [ ] Top navigation
- [ ] Main content / stage area
- [ ] Bottom control dock (placeholders OK)
- [ ] Collapsible menu or sidebar
- [ ] Responsive layout
- [ ] Fullscreen support (if applicable)

Use Bootstrap classes and design system tokens. No hardcoded theme values.

Wire shell to runtime via `src/app/app.ts` — bootstrap only, no engine features yet.

---

### 8. Connect Engines Through Adapters

Replace null adapters with real implementations when engine packages are stable.

**Per engine:**

1. Install npm package
2. Implement adapter interface wrapping engine API
3. Register adapter in runtime constructor
4. Verify lifecycle: `init → start → stop → destroy`
5. Verify preset loading and parameter setting
6. Document any engine-specific parameter paths in `ENGINE_API.md`

**Integration order (recommended):**

1. One engine at a time — do not integrate both simultaneously on day one
2. Sound engine first (establishes transport and preset flow)
3. Visual engine second (establishes resize and render loop)
4. Cross-engine preset sync last

**Do not:**

- Import unstable engine code or unpinned branches
- Call engine APIs from UI components
- Copy engine source into adapter files

---

### 9. Add Presets

Build the app-level preset system that coordinates engines.

**Scaffold `src/presets/`:**

| File          | Purpose                   |
| ------------- | ------------------------- |
| `manifest.ts` | Registry of preset worlds |
| `worlds/`     | Individual preset modules |

**Preset rules:**

- One preset ID maps to both sound and visual configurations
- Runtime loads presets atomically across adapters
- Preset metadata (name, description, tags) lives in the app, not engines

Document preset authoring in `docs/PRESETS.md` when the system is implemented.

---

### 10. Test, Document, Deploy

Verify the product before shipping.

**Testing checklist:**

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npm run format:check` passes
- [ ] Runtime lifecycle works end-to-end
- [ ] Preset switching works during playback
- [ ] Responsive layout on mobile and desktop
- [ ] Input layers work (keyboard, MIDI, touch — as applicable)

**Documentation checklist:**

- [ ] README reflects current state
- [ ] CHANGELOG updated
- [ ] ROADMAP percentages updated
- [ ] INTEGRATION_PLAN phases marked complete
- [ ] REPO_BOUNDARIES accurate

**Deploy:**

- Follow `ai-product-framework/docs/` workflow for GitHub + Vercel
- Configure CI in `.github/workflows/`
- Tag release version

---

## Folder Structure Template

Every app following this system should use a similar layout:

```text
my-app/
├── src/
│   ├── app/           Bootstrap and lifecycle
│   ├── runtime/       Integration layer
│   ├── audio/         Sound adapter
│   ├── visuals/       Visual adapter
│   ├── ui/            Shell, components, controls
│   ├── presets/       App-level preset system
│   ├── design-system/ Token imports from ai-native-design-system
│   ├── styles/        Bootstrap compilation entry
│   └── utils/         Shared utilities
├── docs/
│   ├── product-framework/  AI Product Framework integration
│   ├── design-system/      AI Native Design System integration
│   ├── SYSTEM_OVERVIEW.md
│   ├── REPO_BOUNDARIES.md
│   ├── REPEATABLE_APP_TEMPLATE.md
│   └── INTEGRATION_PLAN.md
├── .cursor/rules/     Cursor agent rules
├── HANDOFF.md
├── README.md
├── ARCHITECTURE.md
├── ROADMAP.md
├── CONTRIBUTING.md
└── CHANGELOG.md
```

Adapt adapter directory names to match the engines your app uses.

---

## What Changes Per Product vs. What Stays the Same

| Stays the same                  | Changes per product              |
| ------------------------------- | -------------------------------- |
| AI Product Framework repo       | App concept and README           |
| AI Native Design System repo    | Layout and component choices     |
| Workflow steps 1–3, 6–7, 10     | Engine dependencies (step 5)     |
| Runtime pattern (adapter model) | Adapter implementations (step 8) |
| Documentation structure         | Preset content (step 9)          |

---

## Plantasonic as Reference

Plantasonic is the canonical first implementation. When starting a new app, compare your repo against Plantasonic:

| Check                 | Plantasonic location                        |
| --------------------- | ------------------------------------------- |
| Framework integration | `docs/product-framework/`, `.cursor/rules/` |
| Design system module  | `src/design-system/`                        |
| Design system docs    | `docs/design-system/`                       |
| Runtime scaffold      | `src/runtime/`                              |
| Adapter interfaces    | `src/audio/`, `src/visuals/`                |
| UI shell              | `src/ui/layouts/AppShell.ts`                |
| Boundary docs         | `docs/REPO_BOUNDARIES.md`                   |
| Integration phases    | `docs/INTEGRATION_PLAN.md`                  |

---

## Related Documentation

| Document                                     | Description                 |
| -------------------------------------------- | --------------------------- |
| [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md)   | Stack layers explained      |
| [REPO_BOUNDARIES.md](./REPO_BOUNDARIES.md)   | Repository ownership        |
| [INTEGRATION_PLAN.md](./INTEGRATION_PLAN.md) | Plantasonic phased delivery |
