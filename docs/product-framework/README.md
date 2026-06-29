# Product Framework Integration

Plantasonic adopts process, standards, and templates from the [AI Product Framework](https://github.com/nate-thousand/ai-product-framework) without vendoring the full repository.

**Workspace source:** `../../ai-product-framework/` (sibling — not a submodule)

---

## What Was Adopted

| Framework source                  | Plantasonic location                                     | Method                              |
| --------------------------------- | -------------------------------------------------------- | ----------------------------------- |
| `.cursor/rules/*.mdc`             | `.cursor/rules/`                                         | Adapted for Vite + TypeScript stack |
| `system/CODING_STANDARDS.md`      | `docs/product-framework/CODING_STANDARDS.md`             | Adapted summary + source link       |
| `system/CURSOR_RULES.md`          | `docs/product-framework/CURSOR_RULES.md`                 | Reference + Plantasonic notes       |
| `system/PRE_PROMPT.md`            | `.cursor/rules/pre-prompt.mdc`                           | Adapted                             |
| `docs/WORKFLOW.md`                | `docs/product-framework/WORKFLOW.md`                     | Reference index                     |
| `docs/CURSOR_WORKFLOW.md`         | Linked from WORKFLOW.md                                  | Reference                           |
| `docs/GITHUB_WORKFLOW.md`         | Linked from WORKFLOW.md                                  | Reference                           |
| `templates/PROMPT_TEMPLATE.md`    | `docs/product-framework/templates/PROMPT_TEMPLATE.md`    | Copied                              |
| `templates/ROADMAP_TEMPLATE.md`   | `docs/product-framework/templates/ROADMAP_TEMPLATE.md`   | Adapted                             |
| `templates/CHANGELOG_TEMPLATE.md` | `docs/product-framework/templates/CHANGELOG_TEMPLATE.md` | Adapted                             |
| `templates/HANDOFF_TEMPLATE.md`   | `docs/product-framework/templates/HANDOFF_TEMPLATE.md`   | Adapted                             |
| `templates/PROJECT_CHECKLIST.md`  | `docs/product-framework/templates/PROJECT_CHECKLIST.md`  | Adapted                             |

## What Was Not Copied

- `foundation/` (redirects to design system — use `ai-native-design-system` instead)
- `_legacy/` archive
- `examples/` (reference only)
- Full `design-os/` methodology docs (linked when needed)
- Entire framework README

---

## Cursor Rules

Active rules in `.cursor/rules/`:

| Rule file                 | Purpose                                                 |
| ------------------------- | ------------------------------------------------------- |
| `plantasonic-project.mdc` | Project context, stack, boundaries — always on          |
| `cursor-workflow.mdc`     | Read docs first, verify builds, git discipline          |
| `coding-standards.mdc`    | TypeScript, Bootstrap, structure standards              |
| `pre-prompt.mdc`          | Global AI behavior and scope discipline                 |
| `design-system.mdc`       | Visual generation rules — references design system docs |

---

## Workflow

```text
AI Product Framework
  ↓  (templates, Cursor rules, workflow docs)
Plantasonic docs/product-framework/
  ↓  (adapted for this product)
Development sessions
  ↓
README · ROADMAP · HANDOFF · CHANGELOG updated per feature
```

See [WORKFLOW.md](./WORKFLOW.md) for day-to-day process.

---

## Related

| Document                                       | Description                                   |
| ---------------------------------------------- | --------------------------------------------- |
| [WORKFLOW.md](./WORKFLOW.md)                   | Development workflow reference                |
| [CODING_STANDARDS.md](./CODING_STANDARDS.md)   | Plantasonic coding standards                  |
| [templates/](./templates/)                     | Prompt, roadmap, changelog, handoff templates |
| [../SYSTEM_OVERVIEW.md](../SYSTEM_OVERVIEW.md) | Full stack overview                           |
