/**
 * Bottom control dock — transport, preset, tempo, and status display.
 * All actions delegate to the interaction layer; no direct adapter access.
 */

import { listPresetWorlds, resolvePresetWorld } from '@/presets/registry.ts';
import type { InteractionManager } from '@/interaction/interactionManager.ts';
import type { ControlName } from '@/runtime/types.ts';
import type { RuntimeState } from '@/runtime/types.ts';

function buildPresetOptions(): string {
  const empty = '<option value="">No preset</option>';
  const worlds = listPresetWorlds();
  const options = worlds
    .map((world) => `<option value="${world.id}">${world.name}</option>`)
    .join('');
  return empty + options;
}

export function createControlDock(): HTMLElement {
  const dock = document.createElement('footer');
  dock.className = 'ps-dock';
  dock.id = 'ps-control-dock';
  dock.setAttribute('role', 'contentinfo');
  dock.setAttribute('aria-label', 'Control dock');

  dock.innerHTML = `
    <div class="ps-dock__section">
      <span class="ps-dock__label">Transport</span>
      <button class="btn btn-primary btn-sm" type="button" id="ps-play-btn" aria-label="Play">
        Play
      </button>
      <button class="btn btn-outline-secondary btn-sm" type="button" id="ps-stop-btn" aria-label="Stop">
        Stop
      </button>
      <span class="ps-dock__status small" id="ps-playing-status">Stopped</span>
    </div>

    <div class="ps-dock__section">
      <span class="ps-dock__label">Preset</span>
      <select class="form-select form-select-sm" id="ps-preset-select" aria-label="Select preset">
        ${buildPresetOptions()}
      </select>
      <span class="ps-dock__status small" id="ps-preset-status">None</span>
    </div>

    <div class="ps-dock__section">
      <span class="ps-dock__label">Tempo</span>
      <input
        type="range"
        class="form-range ps-dock__range"
        id="ps-tempo-slider"
        data-ps-control="tempo"
        min="40"
        max="180"
        value="72"
        aria-label="Tempo"
      />
      <span class="ps-dock__status small" id="ps-tempo-status">72 bpm</span>
    </div>

    <div class="ps-dock__section ms-auto">
      <span class="ps-dock__label">Notes</span>
      <span class="ps-dock__status small" id="ps-notes-status">0 active</span>
    </div>
  `;

  return dock;
}

/** Wires control dock interactions to the interaction layer. */
export function bindControlDock(interaction: InteractionManager): () => void {
  const playBtn = document.querySelector<HTMLButtonElement>('#ps-play-btn');
  const stopBtn = document.querySelector<HTMLButtonElement>('#ps-stop-btn');
  const presetSelect = document.querySelector<HTMLSelectElement>('#ps-preset-select');
  const tempoSlider = document.querySelector<HTMLInputElement>('#ps-tempo-slider');

  const onPlay = (): void => {
    interaction.start('ui');
  };
  const onStop = (): void => {
    interaction.stop('ui');
  };
  const onPreset = (): void => {
    const id = presetSelect?.value ?? '';
    if (id) {
      interaction.setPreset(id, 'ui');
    }
  };
  const onTempo = (): void => {
    const bpm = Number(tempoSlider?.value ?? 72);
    interaction.setTempo(bpm, 'ui');
  };

  playBtn?.addEventListener('click', onPlay);
  stopBtn?.addEventListener('click', onStop);
  presetSelect?.addEventListener('change', onPreset);
  tempoSlider?.addEventListener('input', onTempo);

  const unsubscribe = interaction.subscribe((state) => {
    updateDockStatus(state);
  });

  return () => {
    playBtn?.removeEventListener('click', onPlay);
    stopBtn?.removeEventListener('click', onStop);
    presetSelect?.removeEventListener('change', onPreset);
    tempoSlider?.removeEventListener('input', onTempo);
    unsubscribe();
  };
}

function updateDockStatus(state: Readonly<RuntimeState>): void {
  const playing = document.querySelector('#ps-playing-status');
  const preset = document.querySelector('#ps-preset-status');
  const tempo = document.querySelector('#ps-tempo-status');
  const notes = document.querySelector('#ps-notes-status');
  const tempoSlider = document.querySelector<HTMLInputElement>('#ps-tempo-slider');
  const presetSelect = document.querySelector<HTMLSelectElement>('#ps-preset-select');

  if (playing) playing.textContent = state.isPlaying ? 'Playing' : 'Stopped';

  const world = state.preset ? resolvePresetWorld(state.preset) : undefined;
  if (preset) preset.textContent = world?.name ?? 'None';
  if (presetSelect && presetSelect.value !== (state.preset ?? '')) {
    presetSelect.value = state.preset ?? '';
  }

  if (tempo) tempo.textContent = `${String(state.tempo)} bpm`;
  if (notes) notes.textContent = `${String(state.activeNotes.length)} active`;
  if (tempoSlider && Number(tempoSlider.value) !== state.tempo) {
    tempoSlider.value = String(state.tempo);
  }
}

/** Binds performance control sliders in the sidebar menu. */
export function bindControlSliders(interaction: InteractionManager): () => void {
  const controls: ControlName[] = ['bloom', 'mold', 'density', 'chaos', 'brightness'];
  const handlers: Array<{ el: HTMLInputElement; fn: () => void }> = [];

  for (const name of controls) {
    const slider = document.querySelector<HTMLInputElement>(`#ps-control-${name}`);
    const label = document.querySelector(`#ps-control-${name}-val`);
    if (!slider) continue;

    const fn = (): void => {
      const value = Number(slider.value) / 100;
      interaction.setControl(name, value, 'ui');
      if (label) label.textContent = slider.value;
    };
    slider.addEventListener('input', fn);
    handlers.push({ el: slider, fn });
  }

  const unsubscribe = interaction.subscribe((state) => {
    for (const name of controls) {
      const slider = document.querySelector<HTMLInputElement>(`#ps-control-${name}`);
      const label = document.querySelector(`#ps-control-${name}-val`);
      const pct = Math.round(state.controls[name] * 100);
      if (slider && Number(slider.value) !== pct) slider.value = String(pct);
      if (label) label.textContent = String(pct);
    }
  });

  return () => {
    for (const { el, fn } of handlers) {
      el.removeEventListener('input', fn);
    }
    unsubscribe();
  };
}
