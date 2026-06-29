/**
 * Application settings overlay — input, motion, accessibility.
 */

import type { InteractionManager } from '@/interaction/interactionManager.ts';
import type { AppSettingsStore } from '@/services/appSettingsStore.ts';
import { getOverlayPanel } from './OverlayHost.ts';

type SettingsTab = 'input' | 'motion' | 'accessibility';

/** Opens the settings panel overlay. */
export function openSettingsPanel(
  interaction: InteractionManager,
  appSettings: AppSettingsStore,
  onClose: () => void,
): () => void {
  const panel = getOverlayPanel();
  if (!panel) return () => undefined;

  const interactionSettings = interaction.getSettings();
  const app = appSettings.getSettings();

  panel.setAttribute('aria-labelledby', 'ps-settings-title');
  panel.innerHTML = `
    <header class="ps-overlay-panel__header">
      <h2 id="ps-settings-title" class="ps-overlay-panel__title">Settings</h2>
      <button type="button" class="btn btn-sm btn-outline-secondary" id="ps-settings-close" aria-label="Close settings">
        Close
      </button>
    </header>
    <nav class="ps-settings-tabs" role="tablist" aria-label="Settings sections">
      <button type="button" class="ps-settings-tabs__tab ps-settings-tabs__tab--active" role="tab" data-tab="input" aria-selected="true">Input</button>
      <button type="button" class="ps-settings-tabs__tab" role="tab" data-tab="motion" aria-selected="false">Motion</button>
      <button type="button" class="ps-settings-tabs__tab" role="tab" data-tab="accessibility" aria-selected="false">Accessibility</button>
    </nav>
    <div class="ps-settings-content">
      <section class="ps-settings-section" data-panel="input" role="tabpanel">
        <h3 class="ps-settings-section__title">Input Devices</h3>
        <label class="ps-settings-row">
          <span>MIDI</span>
          <input type="checkbox" id="ps-settings-midi" ${interactionSettings.midiEnabled ? 'checked' : ''} />
        </label>
        <label class="ps-settings-row">
          <span>Keyboard</span>
          <input type="checkbox" id="ps-settings-keyboard" ${interactionSettings.keyboardEnabled ? 'checked' : ''} />
        </label>
        <label class="ps-settings-row">
          <span>Touch</span>
          <input type="checkbox" id="ps-settings-touch" ${interactionSettings.touchEnabled ? 'checked' : ''} />
        </label>
        <label class="ps-settings-row">
          <span>Default Octave</span>
          <input type="number" id="ps-settings-octave" min="0" max="8" value="${String(interactionSettings.defaultOctave)}" class="form-control form-control-sm" />
        </label>
        <label class="ps-settings-row">
          <span>Keyboard Velocity</span>
          <input type="range" id="ps-settings-keyboard-velocity" min="0" max="100" value="${String(Math.round(interactionSettings.keyboardVelocity * 100))}" class="form-range" />
        </label>
        <button type="button" class="btn btn-outline-secondary btn-sm" id="ps-settings-midi-reset">Reset MIDI Learn</button>
      </section>
      <section class="ps-settings-section" data-panel="motion" role="tabpanel" hidden>
        <h3 class="ps-settings-section__title">Motion</h3>
        <label class="ps-settings-row">
          <span>Enable animations</span>
          <input type="checkbox" id="ps-settings-motion" ${app.motionEnabled ? 'checked' : ''} />
        </label>
        <p class="ps-settings-hint">Panel transitions, preset changes, and control feedback.</p>
      </section>
      <section class="ps-settings-section" data-panel="accessibility" role="tabpanel" hidden>
        <h3 class="ps-settings-section__title">Accessibility</h3>
        <label class="ps-settings-row">
          <span>Reduce motion</span>
          <input type="checkbox" id="ps-settings-reduced-motion" ${app.reducedMotion ? 'checked' : ''} />
        </label>
        <p class="ps-settings-hint">Overrides animations regardless of system preference.</p>
        <p class="ps-settings-hint">Keyboard: A–J notes, Space play/stop, P performance mode, / presets, ? settings.</p>
      </section>
    </div>
  `;

  const showTab = (tab: SettingsTab): void => {
    panel.querySelectorAll('.ps-settings-tabs__tab').forEach((el) => {
      const isActive = (el as HTMLElement).dataset.tab === tab;
      el.classList.toggle('ps-settings-tabs__tab--active', isActive);
      el.setAttribute('aria-selected', String(isActive));
    });
    panel.querySelectorAll('.ps-settings-section').forEach((el) => {
      const isActive = (el as HTMLElement).dataset.panel === tab;
      (el as HTMLElement).hidden = !isActive;
    });
  };

  const onTabClick = (event: Event): void => {
    const btn = (event.target as HTMLElement).closest<HTMLElement>('[data-tab]');
    if (!btn?.dataset.tab) return;
    showTab(btn.dataset.tab as SettingsTab);
  };

  const onMidi = (): void => {
    const el = panel.querySelector<HTMLInputElement>('#ps-settings-midi');
    interaction.updateSettings({ midiEnabled: el?.checked ?? true });
    syncSidebarToggles();
  };
  const onKeyboard = (): void => {
    const el = panel.querySelector<HTMLInputElement>('#ps-settings-keyboard');
    interaction.updateSettings({ keyboardEnabled: el?.checked ?? true });
    syncSidebarToggles();
  };
  const onTouch = (): void => {
    const el = panel.querySelector<HTMLInputElement>('#ps-settings-touch');
    interaction.updateSettings({ touchEnabled: el?.checked ?? true });
    syncSidebarToggles();
  };
  const onOctave = (): void => {
    const el = panel.querySelector<HTMLInputElement>('#ps-settings-octave');
    interaction.updateSettings({
      defaultOctave: Math.min(8, Math.max(0, Math.round(Number(el?.value ?? 4)))),
    });
    syncSidebarToggles();
  };
  const onKeyboardVelocity = (): void => {
    const el = panel.querySelector<HTMLInputElement>('#ps-settings-keyboard-velocity');
    interaction.updateSettings({ keyboardVelocity: Number(el?.value ?? 75) / 100 });
  };
  const onMidiReset = (): void => {
    interaction.resetMidiLearnMappings();
  };
  const onMotion = (): void => {
    const el = panel.querySelector<HTMLInputElement>('#ps-settings-motion');
    appSettings.update({ motionEnabled: el?.checked ?? true });
  };
  const onReducedMotion = (): void => {
    const el = panel.querySelector<HTMLInputElement>('#ps-settings-reduced-motion');
    appSettings.update({ reducedMotion: el?.checked ?? false });
  };
  const onCloseClick = (): void => {
    onClose();
  };

  const syncSidebarToggles = (): void => {
    const s = interaction.getSettings();
    const midi = document.querySelector<HTMLInputElement>('#ps-setting-midi');
    const keyboard = document.querySelector<HTMLInputElement>('#ps-setting-keyboard');
    const touch = document.querySelector<HTMLInputElement>('#ps-setting-touch');
    const octave = document.querySelector<HTMLInputElement>('#ps-setting-octave');
    if (midi) midi.checked = s.midiEnabled;
    if (keyboard) keyboard.checked = s.keyboardEnabled;
    if (touch) touch.checked = s.touchEnabled;
    if (octave) octave.value = String(s.defaultOctave);
  };

  panel.querySelector('.ps-settings-tabs')?.addEventListener('click', onTabClick);
  panel.querySelector('#ps-settings-midi')?.addEventListener('change', onMidi);
  panel.querySelector('#ps-settings-keyboard')?.addEventListener('change', onKeyboard);
  panel.querySelector('#ps-settings-touch')?.addEventListener('change', onTouch);
  panel.querySelector('#ps-settings-octave')?.addEventListener('change', onOctave);
  panel
    .querySelector('#ps-settings-keyboard-velocity')
    ?.addEventListener('input', onKeyboardVelocity);
  panel.querySelector('#ps-settings-midi-reset')?.addEventListener('click', onMidiReset);
  panel.querySelector('#ps-settings-motion')?.addEventListener('change', onMotion);
  panel.querySelector('#ps-settings-reduced-motion')?.addEventListener('change', onReducedMotion);
  panel.querySelector('#ps-settings-close')?.addEventListener('click', onCloseClick);

  return () => {
    panel.querySelector('.ps-settings-tabs')?.removeEventListener('click', onTabClick);
    panel.querySelector('#ps-settings-midi')?.removeEventListener('change', onMidi);
    panel.querySelector('#ps-settings-keyboard')?.removeEventListener('change', onKeyboard);
    panel.querySelector('#ps-settings-touch')?.removeEventListener('change', onTouch);
    panel.querySelector('#ps-settings-octave')?.removeEventListener('change', onOctave);
    panel
      .querySelector('#ps-settings-keyboard-velocity')
      ?.removeEventListener('input', onKeyboardVelocity);
    panel.querySelector('#ps-settings-midi-reset')?.removeEventListener('click', onMidiReset);
    panel.querySelector('#ps-settings-motion')?.removeEventListener('change', onMotion);
    panel
      .querySelector('#ps-settings-reduced-motion')
      ?.removeEventListener('change', onReducedMotion);
    panel.querySelector('#ps-settings-close')?.removeEventListener('click', onCloseClick);
  };
}
