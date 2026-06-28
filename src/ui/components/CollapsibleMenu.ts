/**
 * Collapsible sidebar menu area.
 * Will host preset selection and settings in future phases.
 */

export interface CollapsibleMenuOptions {
  id?: string;
}

export function createCollapsibleMenu(options: CollapsibleMenuOptions = {}): HTMLElement {
  const sidebar = document.createElement('aside');
  sidebar.className = 'ps-sidebar';
  sidebar.id = options.id ?? 'ps-sidebar';
  sidebar.setAttribute('role', 'complementary');
  sidebar.setAttribute('aria-label', 'Menu panel');
  sidebar.setAttribute('aria-hidden', 'true');

  sidebar.innerHTML = `
    <div class="ps-sidebar__header">Menu</div>
    <div class="ps-sidebar__content">
      <div class="ps-sidebar__placeholder">
        Preset worlds, settings, and documentation links will appear here.
      </div>
    </div>
  `;

  return sidebar;
}

/** Toggles sidebar visibility and updates ARIA attributes. */
export function toggleCollapsibleMenu(isOpen: boolean): void {
  const sidebar = document.querySelector('#ps-sidebar');
  const toggle = document.querySelector('#ps-menu-toggle');
  const main = document.querySelector('.ps-main');

  sidebar?.classList.toggle('ps-sidebar--visible', isOpen);
  main?.classList.toggle('ps-main--menu-open', isOpen);
  sidebar?.setAttribute('aria-hidden', String(!isOpen));
  toggle?.setAttribute('aria-expanded', String(isOpen));
}
