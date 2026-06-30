import type { PlatformApplication } from '@plantasonic/platform';

import { APP_VERSION, DEFAULT_ROUTE, INSTRUMENT_ROUTE, NAV, NAV_GROUPS } from './catalog.ts';
import { renderSection } from './sections/index.ts';
import { PLANTASONIC_BRANDING } from '@/platform-consumer/content/branding.ts';
import { getStoredTheme, setStoredTheme } from '@/services/appSettingsStore.ts';
import { initShellTheme } from 'plantasonic-design-system/shell';

type RouteMode = 'reference' | 'instrument';

let activeMode: RouteMode = 'reference';
let platformApp: PlatformApplication | null = null;

function getRouteFromHash(): string {
  return location.hash.replace(/^#/, '') || DEFAULT_ROUTE;
}

function isInstrumentRoute(route: string): boolean {
  return route === INSTRUMENT_ROUTE;
}

function syncThemeSelect(select: HTMLSelectElement): void {
  const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  select.value = theme;
}

function applyTheme(theme: 'dark' | 'light'): void {
  setStoredTheme(theme);
  initShellTheme(theme);
}

function destroyInstrument(): void {
  if (platformApp) {
    platformApp.stop();
    platformApp = null;
  }
}

async function mountInstrument(container: HTMLElement): Promise<void> {
  const { createPlantasonicPlatformApp } = await import('@/platform-consumer/bootstrap.ts');
  container.innerHTML = `
    <div class="ps-instrument-chrome">
      <a href="#overview" class="ps-instrument-back small" id="ps-instrument-back">← Platform Overview</a>
    </div>
    <div class="ps-instrument-mount" id="ps-instrument-mount"></div>`;
  container.classList.remove('ps-reference-app');
  container.classList.add('ps-instrument-root');
  const mount = container.querySelector('#ps-instrument-mount') as HTMLElement;
  platformApp = await createPlantasonicPlatformApp(mount);
  activeMode = 'instrument';
  container.querySelector('#ps-instrument-back')?.addEventListener('click', (event) => {
    event.preventDefault();
    location.hash = DEFAULT_ROUTE;
  });
}

function renderReferenceShell(root: HTMLElement): {
  content: HTMLElement;
  navLinks: NodeListOf<HTMLAnchorElement>;
  themeSelect: HTMLSelectElement;
} {
  root.classList.remove('ps-instrument-root');
  root.classList.add('ps-reference-app');
  root.innerHTML = `
    <aside class="ps-ref-nav" aria-label="Platform navigation">
      <div class="ps-ref-brand p-3 border-bottom">
        <div class="fw-semibold">
          <span class="ps-ref-brand-accent">${PLANTASONIC_BRANDING.appTitle}</span>
        </div>
        <div class="small text-muted">${PLANTASONIC_BRANDING.platformTagline}</div>
        <div class="ps-ref-version small text-muted">Reference v${APP_VERSION}</div>
      </div>
      <nav class="ps-ref-nav-scroll p-2" id="ps-ref-nav">
        ${NAV_GROUPS.map((group) => {
          const items = NAV.filter((n) => n.group === group);
          if (!items.length) return '';
          return `<div class="mb-3">
            <div class="ps-ref-nav-group px-2 mb-1">${group}</div>
            ${items
              .map(
                (item) =>
                  `<a href="#${item.id}" class="ps-ref-nav-item" data-route="${item.id}">${item.label}</a>`,
              )
              .join('')}
          </div>`;
        }).join('')}
      </nav>
    </aside>
    <div class="ps-ref-main">
      <header class="ps-ref-header-bar d-flex flex-wrap align-items-center gap-3 p-3 border-bottom">
        <div class="ps-ref-equation-inline small fw-medium">${PLANTASONIC_BRANDING.platformEquation}</div>
        <div class="ms-auto d-flex align-items-center gap-2">
          <label class="small mb-0" for="ps-ref-theme">Theme</label>
          <select class="form-select form-select-sm" id="ps-ref-theme" style="width:auto">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
      </header>
      <main class="ps-ref-content p-4" id="ps-ref-content"></main>
    </div>`;

  return {
    content: root.querySelector('#ps-ref-content') as HTMLElement,
    navLinks: root.querySelectorAll<HTMLAnchorElement>('[data-route]'),
    themeSelect: root.querySelector('#ps-ref-theme') as HTMLSelectElement,
  };
}

function bindReferenceInteractions(
  root: HTMLElement,
  content: HTMLElement,
  navLinks: NodeListOf<HTMLAnchorElement>,
  navigate: (id: string) => void,
): void {
  content.addEventListener('click', (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('[data-route]');
    if (link && link.closest('#ps-ref-content')) {
      event.preventDefault();
      navigate(link.dataset.route ?? DEFAULT_ROUTE);
    }
    const launch = (event.target as Element).closest('#ps-launch-instrument');
    if (launch) {
      event.preventDefault();
      navigate(INSTRUMENT_ROUTE);
    }
  });

  root.querySelector('#ps-ref-nav')?.addEventListener('click', (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('[data-route]');
    if (link) {
      event.preventDefault();
      navigate(link.dataset.route ?? DEFAULT_ROUTE);
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      navigate(link.dataset.route ?? DEFAULT_ROUTE);
    });
  });
}

export function mountAppRouter(root: HTMLElement): void {
  const storedTheme = getStoredTheme();
  if (storedTheme) applyTheme(storedTheme);

  let shell: ReturnType<typeof renderReferenceShell> | null = null;

  async function showReference(route: string): Promise<void> {
    if (activeMode === 'instrument') {
      destroyInstrument();
      root.innerHTML = '';
    }

    if (!shell || !root.querySelector('.ps-ref-nav')) {
      shell = renderReferenceShell(root);
      const activeShell = shell;
      syncThemeSelect(activeShell.themeSelect);
      activeShell.themeSelect.addEventListener('change', () => {
        applyTheme(activeShell.themeSelect.value as 'dark' | 'light');
      });
      bindReferenceInteractions(root, shell.content, shell.navLinks, (id) => {
        void navigate(id);
      });
    }

    activeMode = 'reference';
    const resolved = NAV.some((n) => n.id === route) ? route : DEFAULT_ROUTE;
    if (resolved === INSTRUMENT_ROUTE) {
      await mountInstrument(root);
      location.hash = INSTRUMENT_ROUTE;
      return;
    }

    location.hash = resolved;
    shell.content.innerHTML = renderSection(resolved);
    shell.navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.route === resolved);
    });
    document.title = `${PLANTASONIC_BRANDING.appTitle} — ${NAV.find((n) => n.id === resolved)?.label ?? 'Overview'}`;
  }

  async function navigate(route: string): Promise<void> {
    if (isInstrumentRoute(route)) {
      await mountInstrument(root);
      location.hash = INSTRUMENT_ROUTE;
      document.title = `${PLANTASONIC_BRANDING.appTitle} — Live Instrument`;
      return;
    }
    await showReference(route);
  }

  window.addEventListener('hashchange', () => {
    void navigate(getRouteFromHash());
  });

  const initial = getRouteFromHash();
  if (isInstrumentRoute(initial)) {
    void mountInstrument(root);
    document.title = `${PLANTASONIC_BRANDING.appTitle} — Live Instrument`;
  } else {
    void showReference(initial);
  }
}
