/**
 * Toolbar container component.
 */

export interface ToolbarOptions {
  id?: string;
  ariaLabel?: string;
  className?: string;
}

/** Creates a horizontal toolbar container. */
export function createToolbar(options: ToolbarOptions = {}): HTMLElement {
  const toolbar = document.createElement('div');
  toolbar.className = ['ps-toolbar', options.className ?? ''].filter(Boolean).join(' ');
  toolbar.setAttribute('role', 'toolbar');
  if (options.ariaLabel) toolbar.setAttribute('aria-label', options.ariaLabel);
  if (options.id) toolbar.id = options.id;
  return toolbar;
}
