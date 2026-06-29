# Cursor Rules Reference

Plantasonic Cursor rules are adapted from `ai-product-framework/system/CURSOR_RULES.md` and installed in `.cursor/rules/`.

**Active rules:** see `.cursor/rules/` in the repository root.

---

## Before Code

- Read `README.md`, `ROADMAP.md`, `HANDOFF.md`, `CHANGELOG.md`
- Read `docs/INTEGRATION_PLAN.md` for current phase scope
- Scan relevant source before editing
- Confirm task fits current phase — do not integrate engines early

---

## During Work

- One scoped increment per session
- Touch only required files
- Reuse existing modules and patterns
- Use tools to verify — do not assume

---

## Git

- Commit and push only when explicitly asked
- Follow [CONTRIBUTING.md](../../CONTRIBUTING.md) — Conventional Commits
- Never force-push `main`

---

## Verify Before Done

```bash
npm run lint
npm run build
```

Manual check in dev server if UI changed: `npm run dev`

---

## Framework vs Product

| Repo                   | Agent behavior                       |
| ---------------------- | ------------------------------------ |
| `ai-product-framework` | Docs and templates only              |
| `plantasonic`          | Application code, adapters, UI shell |

Do not copy framework or design system repos into Plantasonic.

---

## Source

Full framework document: `ai-product-framework/system/CURSOR_RULES.md`
