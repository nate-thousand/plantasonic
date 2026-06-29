/**
 * Dialog wrapper — complements OverlayHost with semantic structure.
 */

export interface DialogOptions {
  id?: string;
  title: string;
  titleId?: string;
  labelledBy?: string;
}

/** Creates a dialog panel structure for overlay content. */
export function createDialogShell(options: DialogOptions): HTMLElement {
  const panel = document.createElement('div');
  panel.className = 'ps-dialog';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');

  const titleId = options.titleId ?? options.labelledBy ?? 'ps-dialog-title';
  panel.setAttribute('aria-labelledby', titleId);

  const header = document.createElement('header');
  header.className = 'ps-overlay-panel__header ps-dialog__header';
  header.innerHTML = `
    <h2 id="${titleId}" class="ps-overlay-panel__title">${options.title}</h2>
    <button type="button" class="btn btn-sm btn-outline-secondary ps-dialog__close" aria-label="Close">Close</button>
  `;

  const body = document.createElement('div');
  body.className = 'ps-dialog__body';

  panel.append(header, body);
  if (options.id) panel.id = options.id;

  return panel;
}

/** Returns the dialog body container for content injection. */
export function getDialogBody(dialog: HTMLElement): HTMLElement | null {
  return dialog.querySelector('.ps-dialog__body');
}
