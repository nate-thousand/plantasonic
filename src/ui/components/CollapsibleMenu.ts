/**
 * Collapsible sidebar menu area with performance controls.
 */

export interface CollapsibleMenuOptions {
  id?: string;
}

export function createCollapsibleMenu(options: CollapsibleMenuOptions = {}): HTMLElement {
  const sidebar = document.createElement('aside');
  sidebar.className = 'ps-sidebar';
  sidebar.id = options.id ?? 'ps-sidebar';
  sidebar.setAttribute('role', 'complementary');
  sidebar.setAttribute('aria-label', 'Menu panel');
  sidebar.setAttribute('aria-hidden', 'true');

  const controlDefaults: Record<string, number> = {
    bloom: 50,
    mold: 50,
    density: 50,
    chaos: 25,
    brightness: 50,
  };

  const controlRows = ['bloom', 'mold', 'density', 'chaos', 'brightness']
    .map(
      (name) => `
      <div class="ps-control-row">
        <label class="ps-control-row__label" for="ps-control-${name}">${capitalize(name)}</label>
        <input
          type="range"
          class="form-range"
          id="ps-control-${name}"
          data-ps-control="${name}"
          min="0"
          max="100"
          value="${String(controlDefaults[name] ?? 50)}"
          aria-label="${name} control"
        />
        <span class="ps-control-row__value" id="ps-control-${name}-val">${String(controlDefaults[name] ?? 50)}</span>
      </div>
    `,
    )
    .join('');

  sidebar.innerHTML = `
    <div class="ps-sidebar__header">Controls</div>
    <div class="ps-sidebar__content">
      <div class="ps-sidebar__controls">
        ${controlRows}
      </div>
      <div class="ps-sidebar__settings">
        <div class="ps-sidebar__header">Input</div>
        <label class="ps-settings-row">
          <input type="checkbox" id="ps-setting-midi" checked /> MIDI
        </label>
        <label class="ps-settings-row">
          <input type="checkbox" id="ps-setting-keyboard" checked /> Keyboard
        </label>
        <label class="ps-settings-row">
          <input type="checkbox" id="ps-setting-touch" checked /> Touch
        </label>
        <label class="ps-settings-row">
          <span>Octave</span>
          <input type="number" id="ps-setting-octave" min="0" max="8" value="4" class="form-control form-control-sm" />
        </label>
        <button type="button" class="btn btn-outline-secondary btn-sm" id="ps-midi-learn-reset">
          Reset MIDI Learn
        </button>
      </div>
    </div>
  `;

  return sidebar;
}

/** Toggles sidebar visibility and updates ARIA attributes. */
export function toggleCollapsibleMenu(isOpen: boolean): void {
  const sidebar = document.querySelector('#ps-sidebar');
  const toggle = document.querySelector('#ps-menu-toggle');
  const main = document.querySelector('.ps-main');

  sidebar?.classList.toggle('ps-sidebar--visible', isOpen);
  main?.classList.toggle('ps-main--menu-open', isOpen);
  sidebar?.setAttribute('aria-hidden', String(!isOpen));
  toggle?.setAttribute('aria-expanded', String(isOpen));
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
