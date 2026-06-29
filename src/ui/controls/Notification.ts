/**
 * Notification / toast component.
 */

export type NotificationVariant = 'info' | 'success' | 'warning' | 'error';

export interface NotificationOptions {
  id?: string;
  message: string;
  variant?: NotificationVariant;
  dismissible?: boolean;
}

/** Creates a dismissible notification banner. */
export function createNotification(options: NotificationOptions): HTMLElement {
  const variant = options.variant ?? 'info';
  const alertClass =
    variant === 'error'
      ? 'alert-danger'
      : variant === 'warning'
        ? 'alert-warning'
        : variant === 'success'
          ? 'alert-success'
          : 'alert-info';

  const el = document.createElement('div');
  el.className = `alert ${alertClass} ps-notification`;
  el.setAttribute('role', 'alert');
  if (options.id) el.id = options.id;

  el.innerHTML = `
    <p class="ps-notification__text mb-0">${options.message}</p>
    ${options.dismissible !== false ? '<button type="button" class="btn-close btn-close-white ps-notification__close" aria-label="Dismiss"></button>' : ''}
  `;

  el.querySelector('.ps-notification__close')?.addEventListener('click', () => {
    el.remove();
  });

  return el;
}
