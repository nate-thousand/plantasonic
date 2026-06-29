# Workflow Reference

Plantasonic follows the AI Product Framework development workflow. Canonical docs live in the framework repository — this file indexes them and notes Plantasonic-specific adaptations.

**Source:** `ai-product-framework/docs/`

---

## End-to-End Process

1. **Read context** — README, ROADMAP, HANDOFF, CHANGELOG before coding
2. **Scope one increment** — one feature or doc task per session
3. **Implement** — match existing patterns; touch only required files
4. **Verify** — `npm run lint`, `npm run build`, manual check if UI changed
5. **Document** — update CHANGELOG, ROADMAP percentages, HANDOFF if needed
6. **Commit** — only when explicitly requested

---

## Framework Workflow Docs

| Topic            | Framework source                               | Plantasonic notes                  |
| ---------------- | ---------------------------------------------- | ---------------------------------- |
| General workflow | `ai-product-framework/docs/WORKFLOW.md`        | Vite app, not Next.js              |
| Cursor sessions  | `ai-product-framework/docs/CURSOR_WORKFLOW.md` | Use `.cursor/rules/`               |
| GitHub           | `ai-product-framework/docs/GITHUB_WORKFLOW.md` | CI in `.github/workflows/ci.yml`   |
| Vercel deploy    | `ai-product-framework/docs/VERCEL_WORKFLOW.md` | Future — Phase 10                  |
| AI prompts       | `ai-product-framework/docs/AI_PROMPT_GUIDE.md` | Use `templates/PROMPT_TEMPLATE.md` |

---

## Plantasonic Git Conventions

Plantasonic uses [Conventional Commits](../CONTRIBUTING.md) rather than the framework's `Feature NN:` format. Either is acceptable; prefer Conventional Commits for this repo.

---

## Phase Alignment

| Framework phase | Plantasonic equivalent            |
| --------------- | --------------------------------- |
| Kickoff         | Phase 1 — Foundation              |
| Feature         | Phases 3–9 — Runtime, engines, UI |
| Ship            | Phase 10 — Release                |

See [../INTEGRATION_PLAN.md](../INTEGRATION_PLAN.md) for the full phased plan.
