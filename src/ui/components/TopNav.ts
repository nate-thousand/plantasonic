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
    ariaLabel: 'Toggle menu',
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
  actions.append(
    createButton({
      id: 'ps-presets-btn',
      label: 'Presets',
      variant: 'outline',
      size: 'sm',
      className: 'ps-top-nav__btn',
      ariaLabel: 'Browse presets',
      title: 'Browse presets (/)',
    }),
    createButton({
      id: 'ps-settings-btn',
      label: 'Settings',
      variant: 'outline',
      size: 'sm',
      className: 'ps-top-nav__btn',
      ariaLabel: 'Open settings',
      title: 'Settings (?)',
    }),
    createButton({
      id: 'ps-performance-toggle',
      label: 'Perform',
      variant: 'outline',
      size: 'sm',
      className: 'ps-top-nav__btn',
      ariaLabel: 'Toggle performance mode',
      title: 'Performance mode (P)',
    }),
    createStatus({
      id: 'ps-runtime-status',
      label: 'Ready',
      live: true,
      className: 'ps-nav-status',
    }),
    createButton({
      id: 'ps-fullscreen-toggle',
      label: 'Fullscreen',
      variant: 'outline',
      size: 'sm',
      className: 'ps-top-nav__btn',
      ariaLabel: 'Toggle fullscreen',
    }),
  );

  const perfBtn = actions.querySelector('#ps-performance-toggle');
  perfBtn?.setAttribute('aria-pressed', 'false');

  inner.append(menuBtn, brand, actions);
  nav.append(inner);

  menuBtn.addEventListener('click', options.onMenuToggle);
  actions
    .querySelector('#ps-fullscreen-toggle')
    ?.addEventListener('click', options.onFullscreenToggle);

  return nav;
}

/** Updates the runtime status label in the top nav. */
export function setNavStatus(status: string): void {
  const el = document.querySelector('#ps-runtime-status');
  if (el) el.textContent = status;
}
