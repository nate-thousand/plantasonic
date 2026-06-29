/**
 * Loading state component.
 */

export interface LoadingOptions {
  id?: string;
  label?: string;
  size?: 'sm' | 'md';
  overlay?: boolean;
}

/** Creates a loading spinner with optional label. */
export function createLoading(options: LoadingOptions = {}): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = options.overlay ? 'ps-loading ps-loading--overlay' : 'ps-loading';
  if (options.id) wrapper.id = options.id;
  wrapper.setAttribute('role', 'status');
  wrapper.setAttribute('aria-live', 'polite');

  const sizeClass = options.size === 'sm' ? 'spinner-border-sm' : '';
  wrapper.innerHTML = `
    <div class="spinner-border ${sizeClass} ps-loading__spinner" aria-hidden="true"></div>
    ${options.label ? `<span class="ps-loading__label">${options.label}</span>` : ''}
  `;

  return wrapper;
}

/** Shows or hides a loading element by id. */
export function setLoadingVisible(id: string, visible: boolean): void {
  const el = document.querySelector(`#${id}`);
  if (el) (el as HTMLElement).hidden = !visible;
}
