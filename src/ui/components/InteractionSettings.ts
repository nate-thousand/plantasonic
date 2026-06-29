/**
 * Interaction settings panel — persists input preferences locally.
 */

import type { InteractionManager } from '@/interaction/interactionManager.ts';

/** Binds sidebar interaction settings to the interaction manager. */
export function bindInteractionSettings(interaction: InteractionManager): () => void {
  const midiToggle = document.querySelector<HTMLInputElement>('#ps-setting-midi');
  const keyboardToggle = document.querySelector<HTMLInputElement>('#ps-setting-keyboard');
  const touchToggle = document.querySelector<HTMLInputElement>('#ps-setting-touch');
  const octaveInput = document.querySelector<HTMLInputElement>('#ps-setting-octave');
  const learnReset = document.querySelector<HTMLButtonElement>('#ps-midi-learn-reset');

  const settings = interaction.getSettings();
  if (midiToggle) midiToggle.checked = settings.midiEnabled;
  if (keyboardToggle) keyboardToggle.checked = settings.keyboardEnabled;
  if (touchToggle) touchToggle.checked = settings.touchEnabled;
  if (octaveInput) octaveInput.value = String(settings.defaultOctave);

  const onMidi = (): void => {
    interaction.updateSettings({ midiEnabled: midiToggle?.checked ?? true });
  };
  const onKeyboard = (): void => {
    interaction.updateSettings({ keyboardEnabled: keyboardToggle?.checked ?? true });
  };
  const onTouch = (): void => {
    interaction.updateSettings({ touchEnabled: touchToggle?.checked ?? true });
  };
  const onOctave = (): void => {
    const octave = Number(octaveInput?.value ?? 4);
    interaction.updateSettings({
      defaultOctave: Math.min(8, Math.max(0, Math.round(octave))),
    });
  };
  const onLearnReset = (): void => {
    interaction.resetMidiLearnMappings();
  };

  midiToggle?.addEventListener('change', onMidi);
  keyboardToggle?.addEventListener('change', onKeyboard);
  touchToggle?.addEventListener('change', onTouch);
  octaveInput?.addEventListener('change', onOctave);
  learnReset?.addEventListener('click', onLearnReset);

  return () => {
    midiToggle?.removeEventListener('change', onMidi);
    keyboardToggle?.removeEventListener('change', onKeyboard);
    touchToggle?.removeEventListener('change', onTouch);
    octaveInput?.removeEventListener('change', onOctave);
    learnReset?.removeEventListener('click', onLearnReset);
  };
}

/** Starts MIDI Learn for a performance control (call from control UI). */
export function startControlMidiLearn(
  interaction: InteractionManager,
  controlName: 'bloom' | 'mold' | 'density' | 'chaos' | 'brightness',
): void {
  interaction.startMidiLearn({ type: 'control', name: controlName });
}
