/**
 * Status indicator component.
 */

export type StatusVariant = 'ready' | 'playing' | 'error' | 'muted';

export interface StatusOptions {
  id?: string;
  label: string;
  variant?: StatusVariant;
  live?: boolean;
  className?: string;
}

/** Creates a status text indicator. */
export function createStatus(options: StatusOptions): HTMLElement {
  const el = document.createElement('span');
  el.className = ['ps-status', `ps-status--${options.variant ?? 'ready'}`, options.className ?? '']
    .filter(Boolean)
    .join(' ');
  if (options.id) el.id = options.id;
  el.textContent = options.label;
  if (options.live) el.setAttribute('aria-live', 'polite');
  return el;
}

/** Updates status text and variant. */
export function setStatus(id: string, label: string, variant: StatusVariant = 'ready'): void {
  const el = document.querySelector(`#${id}`);
  if (!el) return;
  el.textContent = label;
  el.className = ['ps-status', `ps-status--${variant}`, 'ps-dock__status'].join(' ');
}
