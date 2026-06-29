/**
 * Contextual inspector — Sound, Visuals, and Environment control surfaces.
 */

import { DEFAULT_CONTROLS } from '@/runtime/types.ts';
import type { ControlName } from '@/runtime/types.ts';
import { controlValueToPercent } from '@/runtime/performanceParams.ts';
import { DEFAULT_TEMPO, MAX_TEMPO, MIN_TEMPO } from '@/runtime/performanceParams.ts';
import { eventBus } from '@/runtime/events.ts';
import { animateSidebarIn, animateSidebarOut } from '../motion/motionController.ts';
import { createButton, createSlider, createSliderRow } from '../controls/index.ts';
import type { NavCategory } from '../navigation/types.ts';

const CONTROL_DEFAULTS: Record<string, number> = {
  bloom: controlValueToPercent(DEFAULT_CONTROLS.bloom),
  mold: controlValueToPercent(DEFAULT_CONTROLS.mold),
  density: controlValueToPercent(DEFAULT_CONTROLS.density),
  chaos: controlValueToPercent(DEFAULT_CONTROLS.chaos),
  brightness: controlValueToPercent(DEFAULT_CONTROLS.brightness),
};

const CATEGORIES: readonly { id: NavCategory; label: string; hint: string }[] = [
  { id: 'sound', label: 'Sound', hint: 'Tempo and sonic ecology' },
  { id: 'visuals', label: 'Visuals', hint: 'ASCII appearance and density' },
  { id: 'environment', label: 'Environment', hint: 'Theme and preferences' },
];

function createControlRow(name: ControlName, label: string): HTMLElement {
  const row = createSliderRow({
    id: `ps-control-${name}`,
    label,
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
  return row;
}

export function createInspectorPanel(): HTMLElement {
  const panel = document.createElement('aside');
  panel.className = 'ps-inspector';
  panel.id = 'ps-inspector';
  panel.hidden = true;
  panel.setAttribute('role', 'complementary');
  panel.setAttribute('aria-label', 'Control inspector');

  const header = document.createElement('header');
  header.className = 'ps-inspector__header';

  const tabs = document.createElement('nav');
  tabs.className = 'ps-inspector__tabs';
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Control categories');
  tabs.innerHTML = CATEGORIES.map(
    (cat, i) =>
      `<button type="button" class="ps-inspector__tab${i === 0 ? ' ps-inspector__tab--active' : ''}" role="tab" data-inspector-tab="${cat.id}" aria-selected="${String(i === 0)}" aria-controls="ps-inspector-${cat.id}">${cat.label}</button>`,
  ).join('');

  const closeBtn = createButton({
    id: 'ps-inspector-close',
    label: 'Close',
    variant: 'link',
    className: 'ps-inspector__close',
    ariaLabel: 'Close inspector',
  });

  header.append(tabs, closeBtn);

  const content = document.createElement('div');
  content.className = 'ps-inspector__content';

  const soundPanel = document.createElement('section');
  soundPanel.className = 'ps-inspector__panel';
  soundPanel.id = 'ps-inspector-sound';
  soundPanel.dataset.inspectorPanel = 'sound';
  soundPanel.setAttribute('role', 'tabpanel');
  soundPanel.innerHTML = `<p class="ps-inspector__hint">Tempo and sonic ecology parameters.</p>`;
  const soundBody = document.createElement('div');
  soundBody.className = 'ps-inspector__controls';
  soundBody.append(
    createSlider({
      id: 'ps-tempo-slider',
      label: 'Tempo',
      min: MIN_TEMPO,
      max: MAX_TEMPO,
      value: DEFAULT_TEMPO,
      controlName: 'tempo',
      className: 'ps-inspector__range',
    }),
    createControlRow('bloom', 'Bloom'),
    createControlRow('mold', 'Mold'),
    createControlRow('chaos', 'Chaos'),
  );
  soundPanel.append(soundBody);

  const visualsPanel = document.createElement('section');
  visualsPanel.className = 'ps-inspector__panel';
  visualsPanel.id = 'ps-inspector-visuals';
  visualsPanel.dataset.inspectorPanel = 'visuals';
  visualsPanel.hidden = true;
  visualsPanel.setAttribute('role', 'tabpanel');
  visualsPanel.innerHTML = `<p class="ps-inspector__hint">Visual engine appearance.</p>`;
  const visualsBody = document.createElement('div');
  visualsBody.className = 'ps-inspector__controls';
  visualsBody.append(
    createControlRow('brightness', 'Brightness'),
    createControlRow('density', 'Density'),
  );
  visualsPanel.append(visualsBody);

  const environmentPanel = document.createElement('section');
  environmentPanel.className = 'ps-inspector__panel';
  environmentPanel.id = 'ps-inspector-environment';
  environmentPanel.dataset.inspectorPanel = 'environment';
  environmentPanel.hidden = true;
  environmentPanel.setAttribute('role', 'tabpanel');
  environmentPanel.innerHTML = `
    <p class="ps-inspector__hint">Theme, motion, and input preferences.</p>
    <div class="ps-inspector__actions">
      <button type="button" class="btn btn-outline-secondary ps-inspector__action" id="ps-inspector-open-settings">
        Open Settings
      </button>
      <button type="button" class="btn btn-outline-secondary ps-inspector__action" id="ps-inspector-open-worlds">
        Browse Worlds
      </button>
    </div>
    <div class="ps-inspector__settings-mount" id="ps-inspector-settings-mount"></div>
  `;

  content.append(soundPanel, visualsPanel, environmentPanel);
  panel.append(header, content);

  tabs.addEventListener('click', onTabClick);
  closeBtn.addEventListener('click', () => {
    closeInspector();
  });

  environmentPanel.querySelector('#ps-inspector-open-settings')?.addEventListener('click', () => {
    eventBus.emit('shell:open-settings', undefined);
  });
  environmentPanel.querySelector('#ps-inspector-open-worlds')?.addEventListener('click', () => {
    eventBus.emit('shell:open-presets', undefined);
  });

  return panel;
}

let inspectorOpen = false;

export function isInspectorOpen(): boolean {
  return inspectorOpen;
}

export function openInspector(category: NavCategory = 'sound'): void {
  const panel = document.querySelector('#ps-inspector');
  const app = document.querySelector('#ps-app');
  const backdrop = document.querySelector('#ps-inspector-backdrop');
  if (!(panel instanceof HTMLElement)) return;

  inspectorOpen = true;
  panel.hidden = false;
  app?.classList.add('ps-app--inspector-open');
  if (backdrop instanceof HTMLElement) backdrop.hidden = false;
  showInspectorTab(category);
  animateSidebarIn(panel);
  eventBus.emit('shell:panel-open', undefined);
}

export function closeInspector(): void {
  const panel = document.querySelector('#ps-inspector');
  const app = document.querySelector('#ps-app');
  const backdrop = document.querySelector('#ps-inspector-backdrop');
  if (!(panel instanceof HTMLElement)) return;

  if (!inspectorOpen) return;
  inspectorOpen = false;

  animateSidebarOut(panel, () => {
    panel.hidden = true;
    app?.classList.remove('ps-app--inspector-open');
    if (backdrop instanceof HTMLElement) backdrop.hidden = true;
  });
  eventBus.emit('shell:panel-close', undefined);
}

export function showInspectorTab(category: NavCategory): void {
  const panel = document.querySelector('#ps-inspector');
  if (!panel) return;

  panel.querySelectorAll('[data-inspector-tab]').forEach((el) => {
    const active = (el as HTMLElement).dataset.inspectorTab === category;
    el.classList.toggle('ps-inspector__tab--active', active);
    el.setAttribute('aria-selected', String(active));
  });

  panel.querySelectorAll('[data-inspector-panel]').forEach((el) => {
    const active = (el as HTMLElement).dataset.inspectorPanel === category;
    (el as HTMLElement).hidden = !active;
  });
}

/** Mount point for environment settings sections. */
export function getInspectorSettingsMount(): HTMLElement | null {
  return document.querySelector('#ps-inspector-settings-mount');
}

function onTabClick(event: Event): void {
  const btn = (event.target as HTMLElement).closest<HTMLElement>('[data-inspector-tab]');
  if (!btn?.dataset.inspectorTab) return;
  showInspectorTab(btn.dataset.inspectorTab as NavCategory);
}
