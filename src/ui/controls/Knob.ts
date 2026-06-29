/**
 * Circular knob control — range input with knob styling.
 */

export interface KnobOptions {
  id: string;
  label: string;
  min?: number;
  max?: number;
  value?: number;
  controlName?: string;
}

/** Creates a knob-style range control. */
export function createKnob(options: KnobOptions): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'ps-knob';

  const label = document.createElement('label');
  label.className = 'ps-knob__label';
  label.htmlFor = options.id;
  label.textContent = options.label;

  const input = document.createElement('input');
  input.type = 'range';
  input.id = options.id;
  input.className = 'form-range ps-knob__input';
  input.min = String(options.min ?? 0);
  input.max = String(options.max ?? 100);
  input.value = String(options.value ?? 50);
  if (options.controlName) input.dataset.psControl = options.controlName;
  input.setAttribute('aria-label', options.label);
  input.setAttribute('aria-valuenow', input.value);

  const value = document.createElement('span');
  value.className = 'ps-knob__value';
  value.id = `${options.id}-val`;
  value.textContent = input.value;

  input.addEventListener('input', () => {
    value.textContent = input.value;
    input.setAttribute('aria-valuenow', input.value);
  });

  wrapper.append(label, input, value);
  return wrapper;
}
