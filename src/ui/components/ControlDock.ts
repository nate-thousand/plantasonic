/**
 * Bottom control dock — transport, preset, tempo, and status display.
 */

import { resolvePresetWorld } from '@/presets/registry.ts';
import type { InteractionManager } from '@/interaction/interactionManager.ts';
import type { ControlName } from '@/runtime/types.ts';
import type { RuntimeState } from '@/runtime/types.ts';
import { animateControlFeedback } from '../motion/motionController.ts';
import {
  createButton,
  createPresetSelector,
  createSlider,
  createStatus,
  setPresetSelectorName,
} from '../controls/index.ts';

export function createControlDock(): HTMLElement {
  const dock = document.createElement('footer');
  dock.className = 'ps-dock';
  dock.id = 'ps-control-dock';
  dock.setAttribute('role', 'contentinfo');
  dock.setAttribute('aria-label', 'Control dock');

  const transport = document.createElement('div');
  transport.className = 'ps-dock__section ps-dock__section--transport';
  const transportLabel = document.createElement('span');
  transportLabel.className = 'ps-dock__label';
  transportLabel.textContent = 'Transport';
  transport.append(
    transportLabel,
    createButton({
      id: 'ps-play-btn',
      label: 'Play',
      variant: 'primary',
      size: 'sm',
      className: 'ps-dock__btn',
      ariaLabel: 'Play',
    }),
    createButton({
      id: 'ps-stop-btn',
      label: 'Stop',
      variant: 'outline',
      size: 'sm',
      className: 'ps-dock__btn',
      ariaLabel: 'Stop',
    }),
    createStatus({ id: 'ps-playing-status', label: 'Stopped', className: 'ps-dock__status' }),
  );

  const preset = document.createElement('div');
  preset.className = 'ps-dock__section ps-dock__section--preset';
  const presetLabel = document.createElement('span');
  presetLabel.className = 'ps-dock__label';
  presetLabel.textContent = 'Preset';
  preset.append(presetLabel, createPresetSelector());

  const tempo = document.createElement('div');
  tempo.className = 'ps-dock__section ps-dock__section--tempo';
  const tempoLabel = document.createElement('span');
  tempoLabel.className = 'ps-dock__label';
  tempoLabel.textContent = 'Tempo';
  tempo.append(
    tempoLabel,
    createSlider({
      id: 'ps-tempo-slider',
      label: 'Tempo',
      min: 40,
      max: 180,
      value: 72,
      controlName: 'tempo',
      className: 'ps-dock__range',
    }),
    createStatus({ id: 'ps-tempo-status', label: '72 bpm', className: 'ps-dock__status' }),
  );

  const notes = document.createElement('div');
  notes.className = 'ps-dock__section ps-dock__section--notes';
  const notesLabel = document.createElement('span');
  notesLabel.className = 'ps-dock__label';
  notesLabel.textContent = 'Notes';
  notes.append(
    notesLabel,
    createStatus({ id: 'ps-notes-status', label: '0 active', className: 'ps-dock__status' }),
  );

  const perfExit = document.createElement('div');
  perfExit.className = 'ps-dock__section ps-dock__section--performance-exit';
  perfExit.append(
    createButton({
      id: 'ps-performance-exit',
      label: 'Exit Perform',
      variant: 'outline-light',
      size: 'sm',
      ariaLabel: 'Exit performance mode',
    }),
  );

  dock.append(transport, preset, tempo, notes, perfExit);
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
  const tempo = document.querySelector('#ps-tempo-status');
  const notes = document.querySelector('#ps-notes-status');
  const tempoSlider = document.querySelector<HTMLInputElement>('#ps-tempo-slider');
  const playBtn = document.querySelector<HTMLButtonElement>('#ps-play-btn');

  if (playing) playing.textContent = state.isPlaying ? 'Playing' : 'Stopped';
  if (playBtn) playBtn.setAttribute('aria-pressed', String(state.isPlaying));

  const world = state.preset ? resolvePresetWorld(state.preset) : undefined;
  setPresetSelectorName(world?.name ?? 'None');

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
