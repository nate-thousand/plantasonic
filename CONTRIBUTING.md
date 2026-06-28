# Contributing to Plantasonic

Thank you for contributing to Plantasonic. This document defines project standards to keep the codebase consistent and maintainable.

## Getting Started

1. Fork the repository and clone your fork.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Read [ARCHITECTURE.md](./ARCHITECTURE.md) before making changes.

## Project Standards

### Architecture Rules

1. **No engine logic in Plantasonic.** Sound and visual generation belong in external engine packages.
2. **Runtime is the coordination layer.** UI never calls adapters or engines directly.
3. **Adapters are the boundary.** All engine communication flows through `SoundAdapter` and `AsciiAdapter`.
4. **No duplicated logic.** Shared behavior belongs in `src/utils/` or the runtime.

### TypeScript

- Strict mode is enabled — no `any` types without justification.
- Use explicit return types on exported functions.
- Prefer interfaces over type aliases for object shapes.
- Use barrel exports (`index.ts`) for each module directory.

### Naming Conventions

| Item           | Convention                    | Example                        |
| -------------- | ----------------------------- | ------------------------------ |
| Files          | camelCase                     | `soundAdapter.ts`              |
| Classes        | PascalCase                    | `StateStore`                   |
| Interfaces     | PascalCase                    | `SoundAdapter`                 |
| Functions      | camelCase                     | `createAppShell`               |
| Constants      | camelCase or UPPER_SNAKE      | `presetManifest`               |
| CSS classes    | kebab-case with `ps-` prefix  | `ps-stage__placeholder`        |
| SCSS variables | kebab-case with `$ps-` prefix | `$ps-brand-primary`            |
| Events         | namespace:action              | `runtime:start`, `preset:load` |

### Module Structure

Each feature directory should contain:

```text
feature/
├── index.ts       Barrel exports
├── feature.ts     Main implementation
└── types.ts       Types (if substantial)
```

## Formatting

### Prettier

Run before committing:

```bash
npm run format
```

Configuration: `.prettierrc` (single quotes, trailing commas, 100 char width).

### ESLint

Run before committing:

```bash
npm run lint
```

Fix auto-fixable issues:

```bash
npm run lint:fix
```

## Branch Naming

Use descriptive branch names with a type prefix:

| Prefix      | Usage              | Example                    |
| ----------- | ------------------ | -------------------------- |
| `feat/`     | New feature        | `feat/preset-selector`     |
| `fix/`      | Bug fix            | `fix/resize-observer-leak` |
| `docs/`     | Documentation      | `docs/runtime-spec`        |
| `refactor/` | Code restructuring | `refactor/state-store`     |
| `chore/`    | Tooling, deps      | `chore/upgrade-vite`       |

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
type(scope): description

[optional body]

[optional footer]
```

### Types

| Type       | Usage                       |
| ---------- | --------------------------- |
| `feat`     | New feature                 |
| `fix`      | Bug fix                     |
| `docs`     | Documentation only          |
| `style`    | Formatting, no logic change |
| `refactor` | Code change, no feature/fix |
| `chore`    | Tooling, dependencies       |
| `test`     | Adding or updating tests    |

### Examples

```text
feat(ui): add preset selection dropdown
fix(runtime): prevent double initialization
docs: update ENGINE_API with parameter schemas
chore: upgrade bootstrap to 5.0.2
```

## Documentation Requirements

When adding or changing features:

1. Update relevant documentation files (ARCHITECTURE.md, RUNTIME.md, etc.).
2. Add an entry to CHANGELOG.md under `[Unreleased]`.
3. Update ROADMAP.md completion percentages if applicable.
4. Add JSDoc comments to exported functions and interfaces.

## Pull Request Process

1. Create a branch from `main`.
2. Make changes following the standards above.
3. Ensure `npm run build`, `npm run lint`, and `npm run format:check` pass.
4. Update documentation as needed.
5. Open a pull request with a clear description of changes.
6. Link related issues if applicable.

## Code Review

Reviewers check for:

- Architecture boundary compliance (no engine logic in app)
- TypeScript strictness
- Documentation updates
- Consistent naming and formatting
- No hardcoded theme values (use design tokens)

## Questions

Open a GitHub issue for architectural questions or feature proposals before starting significant work.
