/**
 * Bottom transport bar — perform essentials and inspector category rail.
 */

import { resolvePresetWorld } from '@/presets/registry.ts';
import type { InteractionManager } from '@/interaction/interactionManager.ts';
import type { ControlName } from '@/runtime/types.ts';
import type { RuntimeState } from '@/runtime/types.ts';
import { controlValueToPercent, percentToControlValue } from '@/runtime/performanceParams.ts';
import { eventBus } from '@/runtime/events.ts';
import { animateControlFeedback } from '../motion/motionController.ts';
import { startControlMidiLearn } from './InteractionSettings.ts';
import {
  createButton,
  createPresetSelector,
  createStatus,
  setPresetSelectorName,
} from '../controls/index.ts';
import type { NavCategory } from '../navigation/types.ts';
import { openInspector } from './InspectorPanel.ts';

const CATEGORY_RAIL: readonly { id: NavCategory; label: string }[] = [
  { id: 'sound', label: 'Sound' },
  { id: 'visuals', label: 'Visuals' },
  { id: 'environment', label: 'Environment' },
];

export function createControlDock(): HTMLElement {
  const dock = document.createElement('footer');
  dock.className = 'ps-transport';
  dock.id = 'ps-control-dock';
  dock.setAttribute('role', 'toolbar');
  dock.setAttribute('aria-label', 'Perform transport');

  const perform = document.createElement('div');
  perform.className = 'ps-transport__perform';
  perform.append(
    createButton({
      id: 'ps-play-btn',
      label: 'Play',
      variant: 'primary',
      className: 'ps-transport__btn ps-transport__btn--play',
      ariaLabel: 'Play',
    }),
    createButton({
      id: 'ps-stop-btn',
      label: 'Stop',
      variant: 'outline',
      className: 'ps-transport__btn',
      ariaLabel: 'Stop',
    }),
    createStatus({ id: 'ps-playing-status', label: 'Stopped', className: 'ps-transport__status' }),
  );

  const world = document.createElement('div');
  world.className = 'ps-transport__world';
  world.append(createPresetSelector({ buttonId: 'ps-preset-browse-btn' }));

  const live = document.createElement('div');
  live.className = 'ps-transport__live';
  live.append(
    createStatus({ id: 'ps-tempo-status', label: '72 bpm', className: 'ps-transport__status' }),
    createStatus({ id: 'ps-octave-status', label: 'Oct 4', className: 'ps-transport__status' }),
    createStatus({ id: 'ps-notes-status', label: '0 active', className: 'ps-transport__status' }),
  );

  const rail = document.createElement('nav');
  rail.className = 'ps-transport__rail';
  rail.setAttribute('aria-label', 'Control categories');
  for (const cat of CATEGORY_RAIL) {
    const btn = createButton({
      id: `ps-rail-${cat.id}`,
      label: cat.label,
      variant: 'outline',
      size: 'sm',
      className: 'ps-transport__rail-btn',
      ariaLabel: `Open ${cat.label} controls`,
    });
    btn.dataset.inspectorCategory = cat.id;
    btn.addEventListener('click', () => {
      openInspector(cat.id);
      animateControlFeedback(btn);
    });
    rail.append(btn);
  }

  const focusExit = document.createElement('div');
  focusExit.className = 'ps-transport__focus-exit';
  focusExit.append(
    createButton({
      id: 'ps-focus-exit',
      label: 'Exit Focus',
      variant: 'outline-light',
      size: 'sm',
      ariaLabel: 'Exit focus mode',
    }),
  );

  dock.append(perform, world, live, rail, focusExit);
  return dock;
}

/** @deprecated Use isInspectorOpen */
export function isDockDrawerOpen(): boolean {
  return false;
}

/** @deprecated Inspector replaces dock drawer */
export function setDockDrawerOpen(_isOpen: boolean): void {
  /* no-op — inspector handles panel state */
}

/** Wires transport bar to the interaction layer. */
export function bindControlDock(interaction: InteractionManager): () => void {
  const playBtn = document.querySelector<HTMLButtonElement>('#ps-play-btn');
  const stopBtn = document.querySelector<HTMLButtonElement>('#ps-stop-btn');

  const onPlay = (): void => {
    interaction.start('ui');
    if (playBtn) animateControlFeedback(playBtn);
  };
  const onStop = (): void => {
    interaction.stop('ui');
    if (stopBtn) animateControlFeedback(stopBtn);
  };

  playBtn?.addEventListener('click', onPlay);
  stopBtn?.addEventListener('click', onStop);

  const unsubscribe = interaction.subscribe((state) => {
    updateTransportStatus(state);
  });

  const updateOctaveStatus = (octave: number): void => {
    const el = document.querySelector('#ps-octave-status');
    if (el) el.textContent = `Oct ${String(octave)}`;
  };
  updateOctaveStatus(interaction.getSettings().defaultOctave);
  const unsubOctave = eventBus.on('keyboard:octave', ({ octave }) => {
    updateOctaveStatus(octave);
  });

  return () => {
    playBtn?.removeEventListener('click', onPlay);
    stopBtn?.removeEventListener('click', onStop);
    unsubscribe();
    unsubOctave();
  };
}

function updateTransportStatus(state: Readonly<RuntimeState>): void {
  const playing = document.querySelector('#ps-playing-status');
  const tempo = document.querySelector('#ps-tempo-status');
  const notes = document.querySelector('#ps-notes-status');
  const playBtn = document.querySelector<HTMLButtonElement>('#ps-play-btn');

  if (playing) playing.textContent = state.isPlaying ? 'Playing' : 'Stopped';
  if (playBtn) playBtn.setAttribute('aria-pressed', String(state.isPlaying));

  const world = state.preset ? resolvePresetWorld(state.preset) : undefined;
  setPresetSelectorName(world?.name ?? 'Choose World');

  if (tempo) tempo.textContent = `${String(state.tempo)} bpm`;
  if (notes) notes.textContent = `${String(state.activeNotes.length)} active`;
}

/** Binds ecology sliders in the inspector panel. */
export function bindControlSliders(interaction: InteractionManager): () => void {
  const controls: ControlName[] = ['bloom', 'mold', 'density', 'chaos', 'brightness'];
  const handlers: Array<{ el: HTMLInputElement; fn: () => void }> = [];
  const learnHandlers: Array<{ el: HTMLButtonElement; fn: () => void }> = [];

  const tempoSlider = document.querySelector<HTMLInputElement>('#ps-tempo-slider');
  const onTempo = (): void => {
    const bpm = Number(tempoSlider?.value ?? 72);
    interaction.setTempo(bpm, 'ui');
    tempoSlider?.setAttribute('aria-valuenow', String(bpm));
  };
  tempoSlider?.addEventListener('input', onTempo);

  for (const name of controls) {
    const slider = document.querySelector<HTMLInputElement>(`#ps-control-${name}`);
    const label = document.querySelector(`#ps-control-${name}-val`);
    const learnBtn = document.querySelector<HTMLButtonElement>(`#ps-control-${name}-learn`);
    if (!slider) continue;

    const fn = (): void => {
      const value = percentToControlValue(Number(slider.value));
      interaction.setControl(name, value, 'ui');
      if (label) label.textContent = slider.value;
      slider.setAttribute('aria-valuenow', slider.value);
    };
    slider.addEventListener('input', fn);
    handlers.push({ el: slider, fn });

    if (learnBtn) {
      const onLearn = (): void => {
        startControlMidiLearn(interaction, name);
        learnBtn.textContent = 'Listening…';
        learnBtn.setAttribute('aria-pressed', 'true');
        window.setTimeout(() => {
          learnBtn.textContent = 'Learn';
          learnBtn.setAttribute('aria-pressed', 'false');
        }, 5000);
      };
      learnBtn.addEventListener('click', onLearn);
      learnHandlers.push({ el: learnBtn, fn: onLearn });
    }
  }

  const unsubscribe = interaction.subscribe((state) => {
    if (tempoSlider && Number(tempoSlider.value) !== state.tempo) {
      tempoSlider.value = String(state.tempo);
      tempoSlider.setAttribute('aria-valuenow', String(state.tempo));
    }
    for (const name of controls) {
      const slider = document.querySelector<HTMLInputElement>(`#ps-control-${name}`);
      const label = document.querySelector(`#ps-control-${name}-val`);
      const pct = controlValueToPercent(state.controls[name]);
      if (slider && Number(slider.value) !== pct) {
        slider.value = String(pct);
        slider.setAttribute('aria-valuenow', String(pct));
      }
      if (label) label.textContent = String(pct);
    }
  });

  return () => {
    tempoSlider?.removeEventListener('input', onTempo);
    for (const { el, fn } of handlers) {
      el.removeEventListener('input', fn);
    }
    for (const { el, fn } of learnHandlers) {
      el.removeEventListener('click', fn);
    }
    unsubscribe();
  };
}
