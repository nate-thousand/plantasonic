/**
 * Dropdown menu component (static markup — Bootstrap styles).
 */

import { createButton } from './Button.ts';

export interface DropdownItem {
  id?: string;
  label: string;
  value?: string;
}

export interface DropdownOptions {
  id: string;
  label: string;
  items: DropdownItem[];
}

/** Creates a Bootstrap-styled dropdown menu. */
export function createDropdown(options: DropdownOptions): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'dropdown ps-dropdown';
  wrapper.id = options.id;

  const toggle = createButton({
    label: options.label,
    variant: 'outline',
    size: 'sm',
    ariaHasPopup: 'true',
    className: 'dropdown-toggle',
  });
  toggle.dataset.bsToggle = 'dropdown';

  const menu = document.createElement('ul');
  menu.className = 'dropdown-menu';
  menu.setAttribute('role', 'menu');

  for (const item of options.items) {
    const li = document.createElement('li');
    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'dropdown-item';
    link.textContent = item.label;
    link.setAttribute('role', 'menuitem');
    if (item.id) link.id = item.id;
    if (item.value) link.dataset.value = item.value;
    li.append(link);
    menu.append(li);
  }

  wrapper.append(toggle, menu);
  return wrapper;
}
