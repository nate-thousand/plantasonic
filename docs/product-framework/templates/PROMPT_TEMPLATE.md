# Prompt Template

Adapted from `ai-product-framework/templates/PROMPT_TEMPLATE.md`.

Use for every feature implementation. Replace placeholders before sending to Cursor.

---

# Feature: {{FEATURE_NAME}}

## Objective

Implement **{{FEATURE_NAME}}** while preserving existing architecture and boundaries.

Before making changes:

- Read project documentation (README, ROADMAP, HANDOFF, INTEGRATION_PLAN)
- Confirm the task aligns with the current integration phase
- Implement only the requested scope
- Do not integrate engines unless the phase explicitly requires it

---

## Required Context

Review before writing code:

- [README.md](../../README.md)
- [ROADMAP.md](../../ROADMAP.md)
- [HANDOFF.md](../../HANDOFF.md)
- [docs/INTEGRATION_PLAN.md](../INTEGRATION_PLAN.md)
- [docs/REPO_BOUNDARIES.md](../REPO_BOUNDARIES.md)

Follow [docs/product-framework/CODING_STANDARDS.md](./CODING_STANDARDS.md).

---

## Functional Requirements

{{FUNCTIONAL_REQUIREMENTS}}

---

## Constraints

- Do not merge external repositories
- Do not copy engine code into Plantasonic
- Do not hardcode theme values — use `src/design-system/` tokens
- Do not redesign unrelated UI
- Do not refactor unrelated code

---

## Acceptance Criteria

- Requirements complete within stated phase scope
- Existing functionality continues to work
- `npm run lint` and `npm run build` pass
- Documentation updated if structure changed

---

## Completion

Summarize: files created/modified, decisions, limitations, recommended next step — then stop.
