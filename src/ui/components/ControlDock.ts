/**
 * Bottom control dock — transport, preset, tempo, and status display.
 * All actions delegate to the interaction layer; no direct adapter access.
 */

import { resolvePresetWorld } from '@/presets/registry.ts';
import type { InteractionManager } from '@/interaction/interactionManager.ts';
import type { ControlName } from '@/runtime/types.ts';
import type { RuntimeState } from '@/runtime/types.ts';
import { animateControlFeedback } from '../motion/motionController.ts';

export function createControlDock(): HTMLElement {
  const dock = document.createElement('footer');
  dock.className = 'ps-dock';
  dock.id = 'ps-control-dock';
  dock.setAttribute('role', 'contentinfo');
  dock.setAttribute('aria-label', 'Control dock');

  dock.innerHTML = `
    <div class="ps-dock__section ps-dock__section--transport">
      <span class="ps-dock__label">Transport</span>
      <button class="btn btn-primary btn-sm ps-dock__btn" type="button" id="ps-play-btn" aria-label="Play">
        Play
      </button>
      <button class="btn btn-outline-secondary btn-sm ps-dock__btn" type="button" id="ps-stop-btn" aria-label="Stop">
        Stop
      </button>
      <span class="ps-dock__status" id="ps-playing-status">Stopped</span>
    </div>

    <div class="ps-dock__section ps-dock__section--preset">
      <span class="ps-dock__label">Preset</span>
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm ps-dock__preset-btn"
        id="ps-preset-browse-btn"
        aria-label="Browse presets"
        aria-haspopup="dialog"
      >
        <span id="ps-preset-name">None</span>
        <span class="ps-dock__preset-chevron" aria-hidden="true">▾</span>
      </button>
    </div>

    <div class="ps-dock__section ps-dock__section--tempo">
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
        aria-valuemin="40"
        aria-valuemax="180"
        aria-valuenow="72"
      />
      <span class="ps-dock__status" id="ps-tempo-status">72 bpm</span>
    </div>

    <div class="ps-dock__section ps-dock__section--notes">
      <span class="ps-dock__label">Notes</span>
      <span class="ps-dock__status" id="ps-notes-status">0 active</span>
    </div>

    <div class="ps-dock__section ps-dock__section--performance-exit">
      <button
        type="button"
        class="btn btn-outline-light btn-sm"
        id="ps-performance-exit"
        aria-label="Exit performance mode"
      >
        Exit Perform
      </button>
    </div>
  `;

  return dock;
}

/** Wires control dock interactions to the interaction layer. */
export function bindControlDock(interaction: InteractionManager): () => void {
  const playBtn = document.querySelector<HTMLButtonElement>('#ps-play-btn');
  const stopBtn = document.querySelector<HTMLButtonElement>('#ps-stop-btn');
  const tempoSlider = document.querySelector<HTMLInputElement>('#ps-tempo-slider');

  const onPlay = (): void => {
    interaction.start('ui');
    if (playBtn) animateControlFeedback(playBtn);
  };
  const onStop = (): void => {
    interaction.stop('ui');
    if (stopBtn) animateControlFeedback(stopBtn);
  };
  const onTempo = (): void => {
    const bpm = Number(tempoSlider?.value ?? 72);
    interaction.setTempo(bpm, 'ui');
    tempoSlider?.setAttribute('aria-valuenow', String(bpm));
  };

  playBtn?.addEventListener('click', onPlay);
  stopBtn?.addEventListener('click', onStop);
  tempoSlider?.addEventListener('input', onTempo);

  const unsubscribe = interaction.subscribe((state) => {
    updateDockStatus(state);
  });

  return () => {
    playBtn?.removeEventListener('click', onPlay);
    stopBtn?.removeEventListener('click', onStop);
    tempoSlider?.removeEventListener('input', onTempo);
    unsubscribe();
  };
}

function updateDockStatus(state: Readonly<RuntimeState>): void {
  const playing = document.querySelector('#ps-playing-status');
  const presetName = document.querySelector('#ps-preset-name');
  const tempo = document.querySelector('#ps-tempo-status');
  const notes = document.querySelector('#ps-notes-status');
  const tempoSlider = document.querySelector<HTMLInputElement>('#ps-tempo-slider');
  const playBtn = document.querySelector<HTMLButtonElement>('#ps-play-btn');

  if (playing) playing.textContent = state.isPlaying ? 'Playing' : 'Stopped';
  if (playBtn) playBtn.setAttribute('aria-pressed', String(state.isPlaying));

  const world = state.preset ? resolvePresetWorld(state.preset) : undefined;
  if (presetName) presetName.textContent = world?.name ?? 'None';

  if (tempo) tempo.textContent = `${String(state.tempo)} bpm`;
  if (notes) notes.textContent = `${String(state.activeNotes.length)} active`;
  if (tempoSlider && Number(tempoSlider.value) !== state.tempo) {
    tempoSlider.value = String(state.tempo);
    tempoSlider.setAttribute('aria-valuenow', String(state.tempo));
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
      slider.setAttribute('aria-valuenow', slider.value);
    };
    slider.addEventListener('input', fn);
    handlers.push({ el: slider, fn });
  }

  const unsubscribe = interaction.subscribe((state) => {
    for (const name of controls) {
      const slider = document.querySelector<HTMLInputElement>(`#ps-control-${name}`);
      const label = document.querySelector(`#ps-control-${name}-val`);
      const pct = Math.round(state.controls[name] * 100);
      if (slider && Number(slider.value) !== pct) {
        slider.value = String(pct);
        slider.setAttribute('aria-valuenow', String(pct));
      }
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
