/**
 * Wires the minimal UI to the interaction layer (never calls engines directly).
 */

import type { InteractionManager } from '@/interaction/interactionManager.ts';
import { resolvePresetWorld } from '@/presets/registry.ts';
import type { ControlName, PresetId } from '@/runtime/types.ts';
import {
  controlValueToPercent,
  percentToControlValue,
} from '@/runtime/performanceParams.ts';

export interface BindAppUiOptions {
  root: HTMLElement;
  interaction: InteractionManager;
}

function syncPlayControl(root: HTMLElement, playing: boolean): void {
  const btn = root.querySelector<HTMLElement>('[data-ps-transport="play"]');
  if (!btn) return;
  btn.setAttribute('aria-pressed', String(playing));
  btn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  btn.setAttribute('title', playing ? 'Pause' : 'Play');
  const glyph = btn.querySelector('span');
  if (glyph) glyph.textContent = playing ? '❙❙' : '▶';
}

function formatStatus(interaction: InteractionManager): string {
  const state = interaction.getState();
  const mode = state.isPlaying ? 'Playing' : 'Ready';
  const midi = interaction.getConnectionStates().midi;
  const preset = state.preset ? resolvePresetWorld(state.preset)?.name : '—';
  let midiLabel = 'MIDI off';
  if (interaction.getSettings().midiEnabled) {
    midiLabel = midi?.connected ? (midi.label ?? 'MIDI') : 'No MIDI';
  }
  return `${mode} · ${preset} · ${state.tempo} bpm · ${midiLabel}`;
}

export function bindAppUi(options: BindAppUiOptions): () => void {
  const { root, interaction } = options;
  const transportBar = root.querySelector('[data-ps-transport-bar]');

  const onTransportClick = (event: Event): void => {
    const target = (event.target as Element)?.closest?.('[data-ps-transport]');
    if (!target) return;
    const action = target.getAttribute('data-ps-transport');
    if (action === 'play') {
      const playing = interaction.getState().isPlaying;
      if (playing) void interaction.stop('ui');
      else void interaction.start('ui');
    } else if (action === 'stop') {
      void interaction.stop('ui');
    }
  };
  transportBar?.addEventListener('click', onTransportClick);

  const presetSelect = root.querySelector<HTMLSelectElement>('#ps-preset-select');
  presetSelect?.addEventListener('change', () => {
    interaction.setPreset(presetSelect.value as PresetId, 'ui');
  });

  const midiBtn = root.querySelector<HTMLElement>('[data-ps-midi-toggle]');
  const syncMidiButton = (): void => {
    const enabled = interaction.getSettings().midiEnabled;
    midiBtn?.setAttribute('aria-pressed', String(enabled));
    midiBtn?.classList.toggle('ds-c-btn--active', enabled);
  };
  syncMidiButton();
  midiBtn?.addEventListener('click', () => {
    interaction.updateSettings({ midiEnabled: !interaction.getSettings().midiEnabled });
    syncMidiButton();
    refreshStatus();
  });

  const advancedToggle = root.querySelector<HTMLElement>('[data-ps-advanced-toggle]');
  const advancedPanel = root.querySelector<HTMLElement>('#ps-advanced-panel');
  const advancedHeader = advancedPanel?.querySelector<HTMLElement>('[data-ds-panel-toggle]');

  const setAdvancedOpen = (open: boolean): void => {
    advancedPanel?.classList.toggle('ps-panel--collapsed', !open);
    advancedPanel?.setAttribute('data-ds-panel-state', open ? 'expanded' : 'collapsed');
    advancedHeader?.setAttribute('aria-expanded', String(open));
    advancedToggle?.setAttribute('aria-expanded', String(open));
  };

  advancedToggle?.addEventListener('click', () => {
    const isCollapsed = advancedPanel?.classList.contains('ps-panel--collapsed') ?? true;
    setAdvancedOpen(isCollapsed);
  });

  advancedHeader?.addEventListener('click', () => {
    const expanded = advancedHeader.getAttribute('aria-expanded') === 'true';
    setAdvancedOpen(!expanded);
  });

  const tempoSlider = root.querySelector<HTMLInputElement>('#ps-tempo-slider');
  const tempoValue = root.querySelector('#ps-tempo-value');
  tempoSlider?.addEventListener('input', () => {
    const tempo = Number(tempoSlider.value);
    if (tempoValue) tempoValue.textContent = String(tempo);
    interaction.setTempo(tempo, 'ui');
  });

  root.querySelectorAll<HTMLInputElement>('[data-ps-control]').forEach((input) => {
    input.addEventListener('input', () => {
      const name = input.dataset.psControl as ControlName;
      const valueEl = root.querySelector(`#ps-control-${name}-value`);
      if (valueEl) valueEl.textContent = input.value;
      interaction.setControl(name, percentToControlValue(Number(input.value)), 'ui');
    });
  });

  const statusEl = root.querySelector('#ps-status');
  const refreshStatus = (): void => {
    if (statusEl) statusEl.textContent = formatStatus(interaction);
  };

  const unsubState = interaction.subscribe((state) => {
    syncPlayControl(root, state.isPlaying);
    refreshStatus();
    if (presetSelect && state.preset) presetSelect.value = state.preset;
    if (tempoSlider && Number(tempoSlider.value) !== state.tempo) {
      tempoSlider.value = String(state.tempo);
      if (tempoValue) tempoValue.textContent = String(state.tempo);
    }
    for (const name of ['bloom', 'mold', 'density', 'chaos', 'brightness'] as ControlName[]) {
      const input = root.querySelector<HTMLInputElement>(`#ps-control-${name}`);
      const valueEl = root.querySelector(`#ps-control-${name}-value`);
      const pct = String(controlValueToPercent(state.controls[name]));
      if (input && input.value !== pct) input.value = pct;
      if (valueEl) valueEl.textContent = pct;
    }
  });

  const unsubSettings = interaction.onSettingsChange(() => {
    syncMidiButton();
    refreshStatus();
  });

  refreshStatus();

  return () => {
    transportBar?.removeEventListener('click', onTransportClick);
    unsubState();
    unsubSettings();
  };
}
