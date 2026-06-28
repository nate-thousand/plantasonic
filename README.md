# Plantasonic

A browser-based generative audiovisual instrument that combines the **Plantasia Sound Engine** and **Plantasia ASCII Engine** through a shared runtime.

Plantasonic is responsible for user experience, design system, runtime orchestration, state management, presets, performance controls, and documentation. Engine logic lives in separate packages — never duplicated inside this repository.

## Vision

Plantasonic is an instrument, not a demo. It provides a performable, responsive interface for exploring generative sound and ASCII visuals as a unified experience. The runtime coordinates both engines while keeping their implementations isolated behind adapter boundaries.

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

## Folder Structure

```text
plantasonic/
├── src/
│   ├── app/           Application bootstrap and lifecycle
│   ├── runtime/       State, events, orchestration
│   ├── audio/         Sound engine adapter
│   ├── visuals/       ASCII engine adapter
│   ├── ui/            Components, layouts, controls
│   ├── presets/       Preset manifest and worlds
│   ├── midi/          Web MIDI input (future)
│   ├── keyboard/      Keyboard mapping (future)
│   ├── touch/         Touch gestures (future)
│   ├── recorder/      Session recording (future)
│   ├── services/      Cross-cutting services (future)
│   ├── utils/         Shared utilities
│   └── styles/        Bootstrap theme and design tokens
├── docs/              Extended documentation
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
npm run format:check  # Prettier check
npm run format        # Prettier write
```

## Development Workflow

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) and [RUNTIME.md](./RUNTIME.md) before adding features.
2. Follow [CONTRIBUTING.md](./CONTRIBUTING.md) for branch naming, commits, and documentation requirements.
3. Update [CHANGELOG.md](./CHANGELOG.md) for user-facing changes.
4. Track progress in [ROADMAP.md](./ROADMAP.md).

## Future Engine Integration

Engine packages will be installed as dependencies and wired through adapter interfaces:

- `src/audio/soundAdapter.ts` — Sound Engine contract
- `src/visuals/asciiAdapter.ts` — ASCII Engine contract

The runtime (`src/runtime/runtime.ts`) coordinates both adapters. See [ENGINE_API.md](./ENGINE_API.md) for interface definitions.

## Documentation

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
