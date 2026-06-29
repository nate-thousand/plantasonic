/**
 * Top navigation bar component.
 */

import { createButton, createStatus, createToolbar } from '../controls/index.ts';

export interface TopNavOptions {
  onMenuToggle: () => void;
  onFullscreenToggle: () => void;
}

export function createTopNav(options: TopNavOptions): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'navbar navbar-dark bg-dark ps-top-nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Main navigation');

  const inner = document.createElement('div');
  inner.className = 'container-fluid ps-top-nav__inner';

  const menuBtn = createButton({
    id: 'ps-menu-toggle',
    label: '',
    variant: 'link',
    className: 'ps-top-nav__menu-btn text-secondary p-0',
    ariaLabel: 'Open performance panel',
  });
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-controls', 'ps-sidebar');
  menuBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
    </svg>
  `;

  const brand = document.createElement('span');
  brand.className = 'navbar-brand ps-nav-brand mb-0';
  brand.textContent = 'Plantasonic';

  const actions = createToolbar({
    className: 'ps-top-nav__actions',
    ariaLabel: 'Navigation actions',
  });

  const performBtn = createButton({
    id: 'ps-performance-toggle',
    label: '',
    variant: 'outline',
    size: 'sm',
    className: 'ps-top-nav__btn ps-top-nav__btn--icon',
    ariaLabel: 'Toggle performance mode',
    title: 'Performance mode (P)',
  });
  performBtn.innerHTML = `
    <svg class="ps-top-nav__icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M6.271 5.055a.5.5 0 0 1 .458 0l4.25 2.1a.5.5 0 0 1 0 .89l-4.25 2.1A.5.5 0 0 1 6 10.1V5.9a.5.5 0 0 1 .271-.845z"/>
    </svg>
    <span class="ps-top-nav__btn-text">Perform</span>
  `;

  const fullscreenBtn = createButton({
    id: 'ps-fullscreen-toggle',
    label: '',
    variant: 'outline',
    size: 'sm',
    className: 'ps-top-nav__btn ps-top-nav__btn--icon',
    ariaLabel: 'Toggle fullscreen',
  });
  fullscreenBtn.innerHTML = `
    <svg class="ps-top-nav__icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
    </svg>
    <span class="ps-top-nav__btn-text">Fullscreen</span>
  `;

  actions.append(
    performBtn,
    createStatus({
      id: 'ps-runtime-status',
      label: 'Ready',
      live: true,
      className: 'ps-nav-status',
    }),
    fullscreenBtn,
  );

  performBtn.setAttribute('aria-pressed', 'false');

  inner.append(menuBtn, brand, actions);
  nav.append(inner);

  menuBtn.addEventListener('click', options.onMenuToggle);
  fullscreenBtn.addEventListener('click', options.onFullscreenToggle);

  return nav;
}

/** Updates the runtime status label in the top nav. */
export function setNavStatus(status: string): void {
  const el = document.querySelector('#ps-runtime-status');
  if (el) el.textContent = status;
}
