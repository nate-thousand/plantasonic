# Component Guidance

Index of design system component specs relevant to Plantasonic. Full specifications live in the external repository.

**When building UI:** read the linked spec before implementing a component.

---

## Shell Components (current)

| Component  | Spec source                                                   | Plantasonic file              |
| ---------- | ------------------------------------------------------------- | ----------------------------- |
| Navigation | `ai-native-design-system/components/navigation/NAVIGATION.md` | `src/ui/components/TopNav.ts` |
| Buttons    | `ai-native-design-system/components/buttons/BUTTONS.md`       | Dock transport placeholders   |

---

## Future Controls (Phase 8)

| Component | Spec source                                           | Planned location   |
| --------- | ----------------------------------------------------- | ------------------ |
| Forms     | `ai-native-design-system/components/forms/FORMS.md`   | `src/ui/controls/` |
| Modals    | `ai-native-design-system/components/modals/MODALS.md` | Preset selector    |
| Tags      | `ai-native-design-system/components/tags/TAGS.md`     | Preset labels      |

---

## Rules (from design system)

- One primary button per view section for the main action
- Destructive actions use danger variant with confirmation
- All interactive elements need visible focus states
- Disabled controls use `disabled` and `aria-disabled`

---

## Bootstrap Implementation

All components render via Bootstrap 5.0.2 classes mapped in [BOOTSTRAP_MAPPING.md](./BOOTSTRAP_MAPPING.md).

**Canonical index:** `ai-native-design-system/components/README.md`
