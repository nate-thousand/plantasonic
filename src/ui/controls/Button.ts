/**
 * Token-driven button component.
 */

export type ButtonVariant =
  'primary' | 'secondary' | 'outline' | 'outline-light' | 'link' | 'danger';
export type ButtonSize = 'sm' | 'md';

export interface ButtonOptions {
  id?: string;
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  ariaLabel?: string;
  ariaPressed?: boolean;
  ariaHasPopup?: string;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  title?: string;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline-secondary',
  'outline-light': 'btn-outline-light',
  link: 'btn-link',
  danger: 'btn-danger',
};

/** Creates a themed button element. */
export function createButton(options: ButtonOptions): HTMLButtonElement {
  const btn = document.createElement('button');
  const variant = options.variant ?? 'outline';
  const size = options.size ?? 'sm';
  const sizeClass = size === 'sm' ? 'btn-sm' : '';

  btn.type = options.type ?? 'button';
  btn.className = ['btn', 'ps-btn', VARIANT_CLASS[variant], sizeClass, options.className ?? '']
    .filter(Boolean)
    .join(' ');
  btn.textContent = options.label;

  if (options.id) btn.id = options.id;
  if (options.ariaLabel) btn.setAttribute('aria-label', options.ariaLabel);
  if (options.ariaPressed !== undefined)
    btn.setAttribute('aria-pressed', String(options.ariaPressed));
  if (options.ariaHasPopup) btn.setAttribute('aria-haspopup', options.ariaHasPopup);
  if (options.title) btn.title = options.title;
  if (options.disabled) btn.disabled = true;

  return btn;
}
