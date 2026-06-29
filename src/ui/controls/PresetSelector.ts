/**
 * Preset selector — opens preset browser, displays current world name.
 */

import { createButton } from './Button.ts';

export interface PresetSelectorOptions {
  id?: string;
  buttonId?: string;
  nameId?: string;
  initialName?: string;
}

/** Creates a preset selector button showing the current world name. */
export function createPresetSelector(options: PresetSelectorOptions = {}): HTMLButtonElement {
  const buttonId = options.buttonId ?? 'ps-preset-browse-btn';
  const nameId = options.nameId ?? 'ps-preset-name';

  const btn = createButton({
    id: buttonId,
    label: options.initialName ?? 'None',
    variant: 'outline',
    size: 'sm',
    ariaLabel: 'Browse presets',
    ariaHasPopup: 'dialog',
    className: 'ps-dock__preset-btn',
  });

  btn.innerHTML = `
    <span id="${nameId}">${options.initialName ?? 'None'}</span>
    <span class="ps-dock__preset-chevron" aria-hidden="true">▾</span>
  `;

  return btn;
}

/** Updates the displayed preset name. */
export function setPresetSelectorName(name: string, nameId = 'ps-preset-name'): void {
  const el = document.querySelector(`#${nameId}`);
  if (el) el.textContent = name;
}
