/**
 * Token-driven toggle (checkbox) component.
 */

export interface ToggleOptions {
  id: string;
  label: string;
  checked?: boolean;
  className?: string;
}

/** Creates a labeled toggle row. */
export function createToggle(options: ToggleOptions): HTMLLabelElement {
  const label = document.createElement('label');
  label.className = ['ps-settings-row', 'ps-toggle', options.className ?? '']
    .filter(Boolean)
    .join(' ');

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = options.id;
  input.className = 'form-check-input ps-toggle__input';
  input.checked = options.checked ?? false;
  input.setAttribute('role', 'switch');
  input.setAttribute('aria-label', options.label);

  const text = document.createElement('span');
  text.className = 'ps-toggle__label';
  text.textContent = options.label;

  label.append(text, input);
  return label;
}
