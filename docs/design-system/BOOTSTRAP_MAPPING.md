# Bootstrap Mapping

**Canonical source:** [plantasonic-design-system/docs/COMPONENT_MAPPING.md](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/COMPONENT_MAPPING.md)

Maps design system component names to Bootstrap 5.0.2 classes. Use these when building UI — do not invent parallel class systems.

---

## Components used by Plantasonic shell

| Design system component | Bootstrap 5.0.2 | Plantasonic usage |
| ----------------------- | --------------- | ----------------- |
| Navbar | `.navbar`, `.navbar-dark`, `.bg-dark` | Top navigation |
| Button — primary | `.btn .btn-primary` | Transport play |
| Button — outline | `.btn .btn-outline-secondary` | Fullscreen, stop |
| Button — link | `.btn .btn-link` | Menu toggle |
| Button — small | `.btn-sm` | Dock controls |
| Nav | `.nav`, `.nav-link` | Menu items |
| Offcanvas | `.offcanvas` | Mobile sidebar |
| Form — range | `.form-range` | Sliders |
| Card | `.card`, `.card-body` | Preset cards |
| Alert | `.alert` | Error banners |

---

## Override rules

1. Import `plantasonic-design-system/scss/bootstrap-theme` before Bootstrap SCSS
2. Import `plantasonic-design-system/scss/css-theme-bridge` after Bootstrap when switching themes at runtime
3. Never edit files in `node_modules/bootstrap/`
4. Custom layout classes use `ps-` prefix in `src/styles/globals.scss`

---

## In this app

```scss
// src/styles/index.scss
@import 'plantasonic-design-system/scss/bootstrap-theme';
@import 'bootstrap/scss/bootstrap';
```

```typescript
// src/main.ts
import 'plantasonic-design-system/css/variables.css';
```

See [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md) for the full style pipeline.
