/**
 * Minimal instrument layout — DS class names + tokens via SCSS only.
 */

import { listPresetWorlds } from '@/presets/registry.ts';
import { MAX_TEMPO, MIN_TEMPO } from '@/runtime/performanceParams.ts';
import type { ControlName } from '@/runtime/types.ts';

const CONTROLS: { name: ControlName; label: string }[] = [
  { name: 'bloom', label: 'Bloom' },
  { name: 'mold', label: 'Mold' },
  { name: 'density', label: 'Density' },
  { name: 'chaos', label: 'Chaos' },
  { name: 'brightness', label: 'Brightness' },
];

function renderTransportBar(): string {
  return `
    <div class="ps-transport" data-ps-transport-bar role="toolbar" aria-label="Transport">
      <button type="button" class="ps-transport-btn ps-transport-btn--primary" data-ps-transport="play" aria-label="Play" title="Play">
        <span aria-hidden="true">▶</span>
      </button>
      <button type="button" class="ps-transport-btn" data-ps-transport="stop" aria-label="Stop" title="Stop">
        <span aria-hidden="true">■</span>
      </button>
    </div>
  `;
}

function renderAdvancedPanel(): string {
  const rows = CONTROLS.map(
    (c) => `
    <label class="ps-control-field" for="ps-control-${c.name}">
      <span class="ps-control-field__label">${c.label}</span>
      <input type="range" class="form-range ps-control-field__range" id="ps-control-${c.name}" data-ps-control="${c.name}" min="0" max="100" value="50" />
      <span class="ps-control-field__value" id="ps-control-${c.name}-value" aria-hidden="true">50</span>
    </label>
  `,
  ).join('');

  return `
    <section class="ps-panel ps-advanced-panel ps-panel--collapsed" id="ps-advanced-panel" aria-label="Engine controls" data-ds-panel-state="collapsed">
      <div class="ps-panel__header ds-c-panel__header" role="button" tabindex="0" aria-expanded="false" data-ds-panel-toggle>
        <span class="ds-c-panel__title">Engine controls</span>
      </div>
      <div class="ps-panel__body ds-c-panel__body">
        <label class="ps-control-field" for="ps-tempo-slider">
          <span class="ps-control-field__label">Tempo</span>
          <input type="range" class="form-range ps-control-field__range" id="ps-tempo-slider" min="${MIN_TEMPO}" max="${MAX_TEMPO}" value="72" />
          <span class="ps-control-field__value" id="ps-tempo-value" aria-hidden="true">72</span>
        </label>
        ${rows}
      </div>
    </section>
  `;
}

export function renderAppLayout(): string {
  const presetOptions = listPresetWorlds()
    .map(
      (w) =>
        `<option value="${w.id}"${w.id === 'seed-world' ? ' selected' : ''}>${w.name}</option>`,
    )
    .join('');

  return `
    <div class="ps-instrument ps-instrument-ui" data-ps-instrument-ui>
      <section class="ps-stage" id="ps-stage" role="region" aria-label="Visualizer"></section>
      <footer class="ps-app-bar" role="toolbar" aria-label="Instrument controls">
        ${renderTransportBar()}
        <div class="ps-app-bar__cluster">
          <label class="ps-app-bar__preset">
            <span class="visually-hidden">Preset</span>
            <select id="ps-preset-select" class="form-select form-select-sm ps-app-bar__select" aria-label="Preset">
              ${presetOptions}
            </select>
          </label>
          <button type="button" class="btn ds-c-btn ds-c-btn--ghost ds-c-btn--sm" id="ps-midi-toggle" data-ps-midi-toggle aria-pressed="false">MIDI</button>
          <output id="ps-status" class="ps-app-bar__status" aria-live="polite">Ready</output>
          <button type="button" class="btn ds-c-btn ds-c-btn--subtle ds-c-btn--sm" id="ps-advanced-toggle" data-ps-advanced-toggle aria-expanded="false">Controls</button>
        </div>
      </footer>
      ${renderAdvancedPanel()}
    </div>
  `;
}
