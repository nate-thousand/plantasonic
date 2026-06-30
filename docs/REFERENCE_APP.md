# Plantasonic Reference Application

Plantasonic XYZ is the **official reference implementation** of the Plantasonic AI First Application Platform.

## Mission

When someone opens this application they should immediately understand:

- what Plantasonic is
- how applications are built
- how themes work
- how the design system works
- how AI workflows fit together
- what engines are available
- how reusable components work

## Platform equation

**Plantasonic = AI First Application Platform**

This message is reflected throughout the UI and documentation.

## Demo philosophy

This application exists to test and demonstrate:

- engines (audio, ASCII, visual, video slot, MIDI)
- design system integration
- theme inheritance
- AI workflows
- templates and CLI scaffolds
- shared components
- future platform features

It is **not** a stripped-down engine demo. It is the showcase application for the platform.

## Application sections

| Section | Purpose |
| ------- | ------- |
| Overview | Platform inheritance model and quick links |
| Design System | Token and shell consumption patterns |
| Theme System | Supported themes (Default active; Signal 9, Plantasia, Future demonstrated) |
| Components | Shared UI from design system and platform |
| Templates | CLI archetypes for new applications |
| Audio Engine | plantasia-sound-engine via platform |
| ASCII Engine | ascii-visual-engine via platform |
| Visual Engine | Application visual language taxonomy |
| Video Engine | Platform video slot (roadmap) |
| MIDI | Web MIDI via platform |
| AI Workflow | Figma → MCP → DS → v0 → Cursor → GitHub → Vercel → App |
| Developer Tools | validate, verify, lint, build scripts |
| Settings | Persistence and theme patterns |
| Documentation | Doc index |
| Live Instrument | Full audiovisual demo (engines lazy-loaded) |

## What applications inherit

- Design System
- Theme
- Shared Components
- Audio Engine
- ASCII Engine
- Visual Engine
- Video Engine
- MIDI
- AI Services
- Templates

## Routing

Hash-based navigation (`#overview`, `#design-system`, …, `#instrument`).

- **Default landing:** `#overview` (platform reference home)
- **Instrument:** `#instrument` — `mountInstrumentApp()` runs only on this route

## What we do not do here

- Build Signal 9 or Plantasia themes (demonstrate support only)
- Rewrite engine behavior or architecture
- Remove existing instrument functionality

## Related docs

- [PLATFORM.md](./PLATFORM.md) — manifest and services
- [CREATIVE_VISION.md](./CREATIVE_VISION.md) — creative constraints
- [REPO_BOUNDARIES.md](./REPO_BOUNDARIES.md) — ecosystem ownership
