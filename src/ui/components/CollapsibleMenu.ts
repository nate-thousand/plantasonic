/**
 * Collapsible sidebar menu area with performance controls.
 */

import { createButton, createSliderRow, createToggle } from '../controls/index.ts';

export interface CollapsibleMenuOptions {
  id?: string;
}

const CONTROL_DEFAULTS: Record<string, number> = {
  bloom: 50,
  mold: 50,
  density: 50,
  chaos: 25,
  brightness: 50,
};

export function createCollapsibleMenu(options: CollapsibleMenuOptions = {}): HTMLElement {
  const sidebar = document.createElement('aside');
  sidebar.className = 'ps-sidebar';
  sidebar.id = options.id ?? 'ps-sidebar';
  sidebar.setAttribute('role', 'complementary');
  sidebar.setAttribute('aria-label', 'Menu panel');
  sidebar.setAttribute('aria-hidden', 'true');

  const header = document.createElement('div');
  header.className = 'ps-sidebar__header';
  header.textContent = 'Controls';

  const content = document.createElement('div');
  content.className = 'ps-sidebar__content';

  const controls = document.createElement('div');
  controls.className = 'ps-sidebar__controls';

  for (const name of ['bloom', 'mold', 'density', 'chaos', 'brightness']) {
    controls.append(
      createSliderRow({
        id: `ps-control-${name}`,
        label: capitalize(name),
        min: 0,
        max: 100,
        value: CONTROL_DEFAULTS[name] ?? 50,
        controlName: name,
        valueId: `ps-control-${name}-val`,
      }),
    );
  }

  const settings = document.createElement('div');
  settings.className = 'ps-sidebar__settings';

  const settingsHeader = document.createElement('div');
  settingsHeader.className = 'ps-sidebar__header';
  settingsHeader.textContent = 'Input';

  settings.append(
    settingsHeader,
    createToggle({ id: 'ps-setting-midi', label: 'MIDI', checked: true }),
    createToggle({ id: 'ps-setting-keyboard', label: 'Keyboard', checked: true }),
    createToggle({ id: 'ps-setting-touch', label: 'Touch', checked: true }),
  );

  const octaveRow = document.createElement('label');
  octaveRow.className = 'ps-settings-row';
  octaveRow.innerHTML = `
    <span>Octave</span>
    <input type="number" id="ps-setting-octave" min="0" max="8" value="4" class="form-control form-control-sm" aria-label="Default octave" />
  `;
  settings.append(octaveRow);

  settings.append(
    createButton({
      id: 'ps-midi-learn-reset',
      label: 'Reset MIDI Learn',
      variant: 'outline',
      size: 'sm',
      className: 'ps-sidebar__btn',
    }),
    createButton({
      id: 'ps-sidebar-settings-btn',
      label: 'All Settings…',
      variant: 'outline',
      size: 'sm',
      className: 'ps-sidebar__btn',
    }),
  );

  content.append(controls, settings);
  sidebar.append(header, content);

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
