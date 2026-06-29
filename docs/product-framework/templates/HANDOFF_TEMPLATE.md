# Handoff Template

Adapted from `ai-product-framework/templates/HANDOFF_TEMPLATE.md`.

Copy sections into [HANDOFF.md](../../../HANDOFF.md) at the end of each session or phase.

---

# Handoff — {{DATE}}

## Current Phase

{{PHASE_NAME}} — see [docs/INTEGRATION_PLAN.md](../INTEGRATION_PLAN.md)

## Completed This Session

- {{COMPLETED_ITEM}}

## State of the Application

- Build: {{passing / failing}}
- Current phase deliverables: {{status}}

## Key Files Modified

| File       | Change      |
| ---------- | ----------- |
| `{{path}}` | {{summary}} |

## Decisions Made

- {{DECISION}}

## Known Limitations

- {{LIMITATION}}

## Do Not Do Next

- {{ANTI_PATTERN}} (e.g., integrate sound engine before Phase 5)

## Recommended Next Step

{{NEXT_STEP}} — aligns with INTEGRATION_PLAN Phase {{N}}

## External Dependencies

| Dependency              | Status               |
| ----------------------- | -------------------- |
| ai-product-framework    | Referenced           |
| ai-native-design-system | {{synced / pending}} |
| plantasia-sound-engine  | Not integrated       |
| ASCII Visual Engine     | Not integrated       |

---

## Reference

Plantasonic instance: [HANDOFF.md](../../../HANDOFF.md)
