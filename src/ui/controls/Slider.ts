/**
 * Token-driven range slider component.
 */

export interface SliderOptions {
  id: string;
  label: string;
  min?: number;
  max?: number;
  value?: number;
  step?: number;
  controlName?: string;
  className?: string;
}

export interface SliderRowOptions extends SliderOptions {
  valueId?: string;
  showValue?: boolean;
}

/** Creates a range input slider. */
export function createSlider(options: SliderOptions): HTMLInputElement {
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.id = options.id;
  slider.className = ['form-range', 'ps-slider', options.className ?? ''].filter(Boolean).join(' ');
  slider.min = String(options.min ?? 0);
  slider.max = String(options.max ?? 100);
  slider.value = String(options.value ?? 50);
  if (options.step) slider.step = String(options.step);
  if (options.controlName) slider.dataset.psControl = options.controlName;
  slider.setAttribute('aria-label', options.label);
  slider.setAttribute('aria-valuemin', slider.min);
  slider.setAttribute('aria-valuemax', slider.max);
  slider.setAttribute('aria-valuenow', slider.value);
  return slider;
}

/** Creates a labeled slider row with optional value display. */
export function createSliderRow(options: SliderRowOptions): HTMLElement {
  const row = document.createElement('div');
  row.className = 'ps-control-row';

  const label = document.createElement('label');
  label.className = 'ps-control-row__label';
  label.htmlFor = options.id;
  label.textContent = options.label;

  const slider = createSlider(options);

  row.append(label, slider);

  if (options.showValue !== false) {
    const valueId = options.valueId ?? `${options.id}-val`;
    const value = document.createElement('span');
    value.className = 'ps-control-row__value';
    value.id = valueId;
    value.textContent = slider.value;
    row.append(value);
  }

  return row;
}
