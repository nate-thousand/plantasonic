/**
 * Top navigation bar component.
 */

export interface TopNavOptions {
  onMenuToggle: () => void;
  onFullscreenToggle: () => void;
}

export function createTopNav(options: TopNavOptions): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'navbar navbar-dark bg-dark ps-top-nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Main navigation');

  nav.innerHTML = `
    <div class="container-fluid ps-top-nav__inner">
      <button
        class="btn btn-link text-secondary p-0 ps-top-nav__menu-btn"
        type="button"
        id="ps-menu-toggle"
        aria-label="Toggle menu"
        aria-expanded="false"
        aria-controls="ps-sidebar"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
        </svg>
      </button>

      <span class="navbar-brand ps-nav-brand mb-0">Plantasonic</span>

      <div class="ps-top-nav__actions">
        <button
          class="btn btn-outline-secondary btn-sm ps-top-nav__btn"
          type="button"
          id="ps-presets-btn"
          aria-label="Browse presets"
          title="Browse presets (/)"
        >
          Presets
        </button>
        <button
          class="btn btn-outline-secondary btn-sm ps-top-nav__btn"
          type="button"
          id="ps-settings-btn"
          aria-label="Open settings"
          title="Settings (?)"
        >
          Settings
        </button>
        <button
          class="btn btn-outline-secondary btn-sm ps-top-nav__btn"
          type="button"
          id="ps-performance-toggle"
          aria-label="Toggle performance mode"
          aria-pressed="false"
          title="Performance mode (P)"
        >
          Perform
        </button>
        <span class="ps-nav-status" id="ps-runtime-status" aria-live="polite">Ready</span>
        <button
          class="btn btn-outline-secondary btn-sm ps-top-nav__btn"
          type="button"
          id="ps-fullscreen-toggle"
          aria-label="Toggle fullscreen"
        >
          Fullscreen
        </button>
      </div>
    </div>
  `;

  nav.querySelector('#ps-menu-toggle')?.addEventListener('click', options.onMenuToggle);
  nav.querySelector('#ps-fullscreen-toggle')?.addEventListener('click', options.onFullscreenToggle);

  return nav;
}

/** Updates the runtime status label in the top nav. */
export function setNavStatus(status: string): void {
  const el = document.querySelector('#ps-runtime-status');
  if (el) el.textContent = status;
}

/** Updates nav visibility for performance mode. */
export function setNavPerformanceMode(enabled: boolean): void {
  const nav = document.querySelector('.ps-top-nav');
  nav?.classList.toggle('ps-top-nav--hidden', enabled);
}
