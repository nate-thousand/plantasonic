/**
 * Collapsible sidebar — performance controls and setup in one panel.
 */

import { DEFAULT_CONTROLS } from '@/runtime/types.ts';
import { controlValueToPercent } from '@/runtime/performanceParams.ts';
import { eventBus } from '@/runtime/events.ts';
import { createButton, createSliderRow } from '../controls/index.ts';

export type SidebarTab = 'controls' | 'setup';

export interface CollapsibleMenuOptions {
  id?: string;
}

const CONTROL_DEFAULTS: Record<string, number> = {
  bloom: controlValueToPercent(DEFAULT_CONTROLS.bloom),
  mold: controlValueToPercent(DEFAULT_CONTROLS.mold),
  density: controlValueToPercent(DEFAULT_CONTROLS.density),
  chaos: controlValueToPercent(DEFAULT_CONTROLS.chaos),
  brightness: controlValueToPercent(DEFAULT_CONTROLS.brightness),
};

let sidebarOpen = false;

export function createCollapsibleMenu(options: CollapsibleMenuOptions = {}): HTMLElement {
  const sidebar = document.createElement('aside');
  sidebar.className = 'ps-sidebar';
  sidebar.id = options.id ?? 'ps-sidebar';
  sidebar.setAttribute('role', 'complementary');
  sidebar.setAttribute('aria-label', 'Performance panel');
  sidebar.setAttribute('aria-hidden', 'true');

  const tabs = document.createElement('nav');
  tabs.className = 'ps-sidebar__tabs';
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Panel sections');
  tabs.innerHTML = `
    <button type="button" class="ps-sidebar__tab ps-sidebar__tab--active" role="tab" data-sidebar-tab="controls" aria-selected="true" aria-controls="ps-sidebar-controls">Controls</button>
    <button type="button" class="ps-sidebar__tab" role="tab" data-sidebar-tab="setup" aria-selected="false" aria-controls="ps-sidebar-setup">Setup</button>
  `;

  const content = document.createElement('div');
  content.className = 'ps-sidebar__content';

  const controlsPanel = document.createElement('div');
  controlsPanel.className = 'ps-sidebar__panel';
  controlsPanel.id = 'ps-sidebar-controls';
  controlsPanel.dataset.sidebarPanel = 'controls';
  controlsPanel.setAttribute('role', 'tabpanel');

  const controls = document.createElement('div');
  controls.className = 'ps-sidebar__controls';

  for (const name of ['bloom', 'mold', 'density', 'chaos', 'brightness']) {
    const row = createSliderRow({
      id: `ps-control-${name}`,
      label: capitalize(name),
      min: 0,
      max: 100,
      value: CONTROL_DEFAULTS[name] ?? 50,
      controlName: name,
      valueId: `ps-control-${name}-val`,
    });
    row.append(
      createButton({
        id: `ps-control-${name}-learn`,
        label: 'Learn',
        variant: 'outline',
        size: 'sm',
        className: 'ps-control-learn',
        ariaLabel: `MIDI learn for ${name}`,
        title: 'Assign a MIDI CC to this control',
      }),
    );
    controls.append(row);
  }
  controlsPanel.append(controls);

  const setupPanel = document.createElement('div');
  setupPanel.className = 'ps-sidebar__panel ps-sidebar__setup';
  setupPanel.id = 'ps-sidebar-setup';
  setupPanel.dataset.sidebarPanel = 'setup';
  setupPanel.hidden = true;
  setupPanel.setAttribute('role', 'tabpanel');

  content.append(controlsPanel, setupPanel);
  sidebar.append(tabs, content);

  tabs.addEventListener('click', onSidebarTabClick);

  return sidebar;
}

/** Returns the Setup tab mount point for settings bindings. */
export function getSidebarSetupMount(): HTMLElement | null {
  return document.querySelector('#ps-sidebar-setup');
}

/** Whether the performance panel is open. */
export function isSidebarOpen(): boolean {
  return sidebarOpen;
}

/** Opens the sidebar and switches to a tab. */
export function openSidebarTab(tab: SidebarTab): void {
  setSidebarOpen(true);
  showSidebarTab(tab);
}

/** Closes the performance panel. */
export function closeCollapsibleMenu(): void {
  setSidebarOpen(false);
}

/** Opens or closes the performance panel. */
export function setSidebarOpen(isOpen: boolean): void {
  if (sidebarOpen === isOpen) return;
  sidebarOpen = isOpen;

  const sidebar = document.querySelector('#ps-sidebar');
  const toggle = document.querySelector('#ps-menu-toggle');
  const main = document.querySelector('.ps-main');
  const app = document.querySelector('#ps-app');
  const backdrop = document.querySelector('#ps-sidebar-backdrop');

  sidebar?.classList.toggle('ps-sidebar--visible', isOpen);
  main?.classList.toggle('ps-main--menu-open', isOpen);
  app?.classList.toggle('ps-app--panel-open', isOpen);
  sidebar?.setAttribute('aria-hidden', String(!isOpen));
  toggle?.setAttribute('aria-expanded', String(isOpen));
  toggle?.setAttribute('aria-label', isOpen ? 'Close performance panel' : 'Open performance panel');

  if (backdrop instanceof HTMLElement) {
    backdrop.hidden = !isOpen;
  }

  if (isOpen) {
    eventBus.emit('shell:panel-open', undefined);
  } else {
    eventBus.emit('shell:panel-close', undefined);
  }
}

/** Switches sidebar tab without changing open state. */
export function showSidebarTab(tab: SidebarTab): void {
  const sidebar = document.querySelector('#ps-sidebar');
  if (!sidebar) return;

  sidebar.querySelectorAll('[data-sidebar-tab]').forEach((el) => {
    const isActive = (el as HTMLElement).dataset.sidebarTab === tab;
    el.classList.toggle('ps-sidebar__tab--active', isActive);
    el.setAttribute('aria-selected', String(isActive));
  });

  sidebar.querySelectorAll('[data-sidebar-panel]').forEach((el) => {
    const isActive = (el as HTMLElement).dataset.sidebarPanel === tab;
    (el as HTMLElement).hidden = !isActive;
  });
}

function onSidebarTabClick(event: Event): void {
  const btn = (event.target as HTMLElement).closest<HTMLElement>('[data-sidebar-tab]');
  if (!btn?.dataset.sidebarTab) return;
  showSidebarTab(btn.dataset.sidebarTab as SidebarTab);
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
