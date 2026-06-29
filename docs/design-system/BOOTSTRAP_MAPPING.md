# Bootstrap Mapping

Reference from `ai-native-design-system/bootstrap/bootstrap-mapping.md`.

Maps design system component names to Bootstrap 5.0.2 classes. Use these when building UI — do not invent parallel class systems.

---

## Components Used by Plantasonic Shell

| Design system component | Bootstrap 5.0.2                       | Plantasonic usage          |
| ----------------------- | ------------------------------------- | -------------------------- |
| Navbar                  | `.navbar`, `.navbar-dark`, `.bg-dark` | Top navigation             |
| Button — primary        | `.btn .btn-primary`                   | Transport play (future)    |
| Button — outline        | `.btn .btn-outline-secondary`         | Fullscreen, stop           |
| Button — link           | `.btn .btn-link`                      | Menu toggle                |
| Button — small          | `.btn-sm`                             | Dock controls              |
| Nav                     | `.nav`, `.nav-link`                   | Future menu items          |
| Offcanvas               | `.offcanvas`                          | Future mobile menu upgrade |

---

## Full Component Map

| Design system component | Bootstrap 5.0.2               |
| ----------------------- | ----------------------------- |
| Button — primary        | `.btn .btn-primary`           |
| Button — secondary      | `.btn .btn-secondary`         |
| Button — outline        | `.btn .btn-outline-*`         |
| Button — link           | `.btn .btn-link`              |
| Card                    | `.card`, `.card-body`         |
| Form — text input       | `.form-control`               |
| Form — select           | `.form-select`                |
| Navbar                  | `.navbar`, `.navbar-expand-*` |
| Modal                   | `.modal`, `.modal-dialog`     |
| Badge / Tag             | `.badge`, `.bg-*`             |
| Spinner                 | `.spinner-border`             |
| Offcanvas               | `.offcanvas`                  |

---

## Override Rules

1. Import `src/design-system/bootstrap/_overrides.scss` before Bootstrap SCSS
2. Never edit files in `node_modules/bootstrap/`
3. Custom layout classes use `ps-` prefix in `src/styles/globals.scss`

---

## Implementation

`src/design-system/bootstrap/_overrides.scss`

**Canonical source:** `ai-native-design-system/bootstrap/bootstrap-mapping.md`
