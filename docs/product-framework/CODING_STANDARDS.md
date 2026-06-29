# Coding Standards

Plantasonic coding standards adapted from `ai-product-framework/system/CODING_STANDARDS.md` for the Vite + TypeScript + Bootstrap stack.

**Full framework reference:** `ai-product-framework/system/CODING_STANDARDS.md`

---

## Stack

| Layer     | Choice                                   |
| --------- | ---------------------------------------- |
| Build     | Vite                                     |
| Language  | TypeScript (strict)                      |
| UI        | Bootstrap 5.0.2 via `src/design-system/` |
| Animation | GSAP (future UI polish)                  |

Not Next.js or React — use vanilla TypeScript modules and DOM APIs unless the architecture changes.

---

## Project Structure

```text
src/
├── app/            Application bootstrap
├── runtime/        Integration layer — only layer that calls adapters
├── audio/          Sound adapter (no engine logic)
├── visuals/        ASCII adapter (no rendering logic)
├── ui/             Shell, components, controls
├── presets/        App-level preset system
├── design-system/  Token imports from ai-native-design-system
├── styles/         Bootstrap compilation entry
└── utils/          Shared utilities
```

Promote code to `utils/` when reused. Keep engine boundaries strict — no synthesis or rendering in the app.

---

## TypeScript

- Strict mode enabled — no `any` without justification
- Explicit return types on exported functions
- Prefer `interface` for object shapes
- Barrel exports via `index.ts` per module
- Path alias `@/*` maps to `src/*`

---

## UI and Design System

- Bootstrap is the rendering engine — design tokens define the visual language
- Import tokens from `src/design-system/` — never hardcode colors or spacing in components
- Follow component specs in `docs/design-system/COMPONENTS.md`
- Follow patterns in `docs/design-system/PATTERNS.md`
- Use `$ds-*` semantic token names; `$ps-*` aliases exist for the app shell

---

## Architecture Rules

1. UI never imports engine packages
2. Runtime is the only layer that calls both adapters
3. Adapters are the only bridge to external engines
4. Design system source of truth is external — sync via `src/design-system/`

---

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive shell elements
- Keyboard focus visible on controls
- WCAG 2.1 AA contrast via design system tokens

**Reference:** `ai-native-design-system/foundation/accessibility/ACCESSIBILITY.md`

---

## Done Means

- `npm run build` passes
- `npm run lint` passes
- Documentation updated if behavior or structure changed
- No engine code copied into the repository
