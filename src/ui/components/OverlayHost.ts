/**
 * Overlay host — backdrop + panel container for modals and drawers.
 */

import {
  animateBackdropIn,
  animateOverlayIn,
  animateOverlayOut,
} from '../motion/motionController.ts';

export type OverlayId = 'presets' | 'settings';

export interface OverlayHost {
  root: HTMLElement;
  open: (id: OverlayId) => void;
  close: () => void;
  isOpen: () => boolean;
  getActiveId: () => OverlayId | null;
  destroy: () => void;
}

/** Creates a shared overlay host mounted on the app root. */
export function createOverlayHost(): OverlayHost {
  let activeId: OverlayId | null = null;

  const root = document.createElement('div');
  root.className = 'ps-overlay-host';
  root.id = 'ps-overlay-host';
  root.hidden = true;
  root.setAttribute('aria-hidden', 'true');

  root.innerHTML = `
    <div class="ps-overlay-host__backdrop" id="ps-overlay-backdrop" tabindex="-1"></div>
    <div class="ps-overlay-host__panel" id="ps-overlay-panel" role="dialog" aria-modal="true"></div>
  `;

  const backdrop = root.querySelector<HTMLElement>('#ps-overlay-backdrop');
  const panel = root.querySelector<HTMLElement>('#ps-overlay-panel');
  if (!backdrop || !panel) {
    throw new Error('Overlay host elements missing');
  }

  const close = (): void => {
    if (!activeId) return;
    animateOverlayOut(panel, () => {
      activeId = null;
      root.hidden = true;
      root.setAttribute('aria-hidden', 'true');
      panel.innerHTML = '';
      panel.removeAttribute('aria-labelledby');
    });
  };

  const open = (id: OverlayId): void => {
    activeId = id;
    root.hidden = false;
    root.setAttribute('aria-hidden', 'false');
    animateBackdropIn(backdrop);
    animateOverlayIn(panel);
  };

  backdrop.addEventListener('click', close);

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && activeId) {
      event.preventDefault();
      close();
    }
  };
  document.addEventListener('keydown', onKeyDown);

  return {
    root,
    open,
    close,
    isOpen: () => activeId !== null,
    getActiveId: () => activeId,
    destroy: () => {
      document.removeEventListener('keydown', onKeyDown);
      root.remove();
    },
  };
}

/** Returns the overlay panel element for content injection. */
export function getOverlayPanel(): HTMLElement | null {
  return document.querySelector('#ps-overlay-panel');
}
