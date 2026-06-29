/**
 * Bottom control dock — transport, preset, tempo, and status display.
 * All actions delegate to the runtime; no direct adapter access.
 */

import type { Runtime } from '@/runtime/runtime.ts';
import type { ControlName, RuntimeState } from '@/runtime/types.ts';

const DEMO_PRESETS = [
  { id: '', label: 'No preset' },
  { id: 'seed-world', label: 'Seed World' },
  { id: 'mold-world', label: 'Mold World' },
];

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
        ${DEMO_PRESETS.map((p) => `<option value="${p.id}">${p.label}</option>`).join('')}
      </select>
      <span class="ps-dock__status small" id="ps-preset-status">None</span>
    </div>

    <div class="ps-dock__section">
      <span class="ps-dock__label">Tempo</span>
      <input
        type="range"
        class="form-range ps-dock__range"
        id="ps-tempo-slider"
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

/** Wires control dock interactions to the runtime and reflects state changes. */
export function bindControlDock(runtime: Runtime): () => void {
  const playBtn = document.querySelector<HTMLButtonElement>('#ps-play-btn');
  const stopBtn = document.querySelector<HTMLButtonElement>('#ps-stop-btn');
  const presetSelect = document.querySelector<HTMLSelectElement>('#ps-preset-select');
  const tempoSlider = document.querySelector<HTMLInputElement>('#ps-tempo-slider');

  const onPlay = (): void => {
    void runtime.start();
  };
  const onStop = (): void => {
    void runtime.stop();
  };
  const onPreset = (): void => {
    const id = presetSelect?.value ?? '';
    if (id) {
      void runtime.setPreset(id);
    }
  };
  const onTempo = (): void => {
    const bpm = Number(tempoSlider?.value ?? 72);
    runtime.setTempo(bpm);
  };

  playBtn?.addEventListener('click', onPlay);
  stopBtn?.addEventListener('click', onStop);
  presetSelect?.addEventListener('change', onPreset);
  tempoSlider?.addEventListener('input', onTempo);

  const unsubscribe = runtime.subscribe((state) => {
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

  if (playing) playing.textContent = state.isPlaying ? 'Playing' : 'Stopped';
  if (preset) preset.textContent = state.preset ?? 'None';
  if (tempo) tempo.textContent = `${String(state.tempo)} bpm`;
  if (notes) notes.textContent = `${String(state.activeNotes.length)} active`;
  if (tempoSlider && Number(tempoSlider.value) !== state.tempo) {
    tempoSlider.value = String(state.tempo);
  }
}

/** Binds performance control sliders in the sidebar menu. */
export function bindControlSliders(runtime: Runtime): () => void {
  const controls: ControlName[] = ['bloom', 'mold', 'density', 'chaos', 'brightness'];
  const handlers: Array<{ el: HTMLInputElement; name: ControlName; fn: () => void }> = [];

  for (const name of controls) {
    const slider = document.querySelector<HTMLInputElement>(`#ps-control-${name}`);
    const label = document.querySelector(`#ps-control-${name}-val`);
    if (!slider) continue;

    const fn = (): void => {
      const value = Number(slider.value) / 100;
      runtime.setControl(name, value);
      if (label) label.textContent = slider.value;
    };
    slider.addEventListener('input', fn);
    handlers.push({ el: slider, name, fn });
  }

  const unsubscribe = runtime.subscribe((state) => {
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
