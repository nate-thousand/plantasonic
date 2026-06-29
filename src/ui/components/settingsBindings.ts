/**
 * Shared settings UI bindings — used by the sidebar Setup tab.
 */

import type { InteractionManager } from '@/interaction/interactionManager.ts';
import type { AppSettingsStore } from '@/services/appSettingsStore.ts';

export type SettingsSection = 'input' | 'motion' | 'accessibility';

/** Renders settings sections into a container (sidebar Setup tab). */
export function renderSettingsSections(
  container: HTMLElement,
  interaction: InteractionManager,
  appSettings: AppSettingsStore,
): void {
  const interactionSettings = interaction.getSettings();
  const app = appSettings.getSettings();

  container.innerHTML = `
    <nav class="ps-settings-tabs ps-settings-tabs--compact" role="tablist" aria-label="Setup sections">
      <button type="button" class="ps-settings-tabs__tab ps-settings-tabs__tab--active" role="tab" data-settings-tab="input" aria-selected="true">Input</button>
      <button type="button" class="ps-settings-tabs__tab" role="tab" data-settings-tab="motion" aria-selected="false">Motion</button>
      <button type="button" class="ps-settings-tabs__tab" role="tab" data-settings-tab="accessibility" aria-selected="false">Display</button>
    </nav>
    <div class="ps-settings-content">
      <section class="ps-settings-section" data-settings-panel="input" role="tabpanel">
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
          <span>Velocity Curve</span>
          <select id="ps-settings-velocity-curve" class="form-select form-select-sm" aria-label="Velocity curve">
            <option value="linear" ${interactionSettings.velocityCurve === 'linear' ? 'selected' : ''}>Linear</option>
            <option value="soft" ${interactionSettings.velocityCurve === 'soft' ? 'selected' : ''}>Soft</option>
            <option value="hard" ${interactionSettings.velocityCurve === 'hard' ? 'selected' : ''}>Hard</option>
          </select>
        </label>
        <label class="ps-settings-row">
          <span>MIDI Channel</span>
          <select id="ps-settings-midi-channel" class="form-select form-select-sm" aria-label="MIDI channel filter">
            <option value="0" ${interactionSettings.midiChannel === 0 ? 'selected' : ''}>All channels</option>
            ${Array.from({ length: 16 }, (_, i) => {
              const ch = i + 1;
              return `<option value="${String(ch)}" ${interactionSettings.midiChannel === ch ? 'selected' : ''}>Channel ${String(ch)}</option>`;
            }).join('')}
          </select>
        </label>
        <label class="ps-settings-row">
          <span>Keyboard Velocity</span>
          <input type="range" id="ps-settings-keyboard-velocity" min="0" max="100" value="${String(Math.round(interactionSettings.keyboardVelocity * 100))}" class="form-range" />
        </label>
        <button type="button" class="btn btn-outline-secondary btn-sm" id="ps-settings-midi-reset">Reset MIDI Learn</button>
      </section>
      <section class="ps-settings-section" data-settings-panel="motion" role="tabpanel" hidden>
        <label class="ps-settings-row">
          <span>Enable animations</span>
          <input type="checkbox" id="ps-settings-motion" ${app.motionEnabled ? 'checked' : ''} />
        </label>
        <p class="ps-settings-hint">Panel transitions and control feedback.</p>
      </section>
      <section class="ps-settings-section" data-settings-panel="accessibility" role="tabpanel" hidden>
        <label class="ps-settings-row">
          <span>Color theme</span>
          <select id="ps-settings-theme" class="form-select form-select-sm">
            <option value="dark" ${app.theme === 'dark' ? 'selected' : ''}>Dark</option>
            <option value="light" ${app.theme === 'light' ? 'selected' : ''}>Light</option>
          </select>
        </label>
        <label class="ps-settings-row">
          <span>Reduce motion</span>
          <input type="checkbox" id="ps-settings-reduced-motion" ${app.reducedMotion ? 'checked' : ''} />
        </label>
        <p class="ps-settings-hint">Keyboard: A–J notes · Z/X octave · Enter play · Escape stop · P perform · / worlds · ? setup</p>
      </section>
    </div>
  `;
}

/** Binds settings controls within a container. */
export function bindSettingsPanel(
  root: ParentNode,
  interaction: InteractionManager,
  appSettings: AppSettingsStore,
): () => void {
  const showTab = (tab: SettingsSection): void => {
    root.querySelectorAll('[data-settings-tab]').forEach((el) => {
      const isActive = (el as HTMLElement).dataset.settingsTab === tab;
      el.classList.toggle('ps-settings-tabs__tab--active', isActive);
      el.setAttribute('aria-selected', String(isActive));
    });
    root.querySelectorAll('[data-settings-panel]').forEach((el) => {
      const isActive = (el as HTMLElement).dataset.settingsPanel === tab;
      (el as HTMLElement).hidden = !isActive;
    });
  };

  const onTabClick = (event: Event): void => {
    const btn = (event.target as HTMLElement).closest<HTMLElement>('[data-settings-tab]');
    if (!btn?.dataset.settingsTab) return;
    showTab(btn.dataset.settingsTab as SettingsSection);
  };

  const onMidi = (): void => {
    const el = root.querySelector<HTMLInputElement>('#ps-settings-midi');
    interaction.updateSettings({ midiEnabled: el?.checked ?? true });
  };
  const onKeyboard = (): void => {
    const el = root.querySelector<HTMLInputElement>('#ps-settings-keyboard');
    interaction.updateSettings({ keyboardEnabled: el?.checked ?? true });
  };
  const onTouch = (): void => {
    const el = root.querySelector<HTMLInputElement>('#ps-settings-touch');
    interaction.updateSettings({ touchEnabled: el?.checked ?? true });
  };
  const onOctave = (): void => {
    const el = root.querySelector<HTMLInputElement>('#ps-settings-octave');
    interaction.updateSettings({
      defaultOctave: Math.min(8, Math.max(0, Math.round(Number(el?.value ?? 4)))),
    });
  };
  const onVelocityCurve = (): void => {
    const el = root.querySelector<HTMLSelectElement>('#ps-settings-velocity-curve');
    const curve = el?.value ?? 'linear';
    if (curve === 'linear' || curve === 'soft' || curve === 'hard') {
      interaction.updateSettings({ velocityCurve: curve });
    }
  };
  const onMidiChannel = (): void => {
    const el = root.querySelector<HTMLSelectElement>('#ps-settings-midi-channel');
    interaction.updateSettings({
      midiChannel: Math.min(16, Math.max(0, Math.round(Number(el?.value ?? 0)))),
    });
  };
  const onKeyboardVelocity = (): void => {
    const el = root.querySelector<HTMLInputElement>('#ps-settings-keyboard-velocity');
    interaction.updateSettings({ keyboardVelocity: Number(el?.value ?? 75) / 100 });
  };
  const onMidiReset = (): void => {
    interaction.resetMidiLearnMappings();
  };
  const onMotion = (): void => {
    const el = root.querySelector<HTMLInputElement>('#ps-settings-motion');
    appSettings.update({ motionEnabled: el?.checked ?? true });
  };
  const onReducedMotion = (): void => {
    const el = root.querySelector<HTMLInputElement>('#ps-settings-reduced-motion');
    appSettings.update({ reducedMotion: el?.checked ?? false });
  };
  const onTheme = (): void => {
    const el = root.querySelector<HTMLSelectElement>('#ps-settings-theme');
    const theme = el?.value === 'light' ? 'light' : 'dark';
    appSettings.update({ theme });
  };

  const syncFromSettings = (): void => {
    const s = interaction.getSettings();
    const midi = root.querySelector<HTMLInputElement>('#ps-settings-midi');
    const keyboard = root.querySelector<HTMLInputElement>('#ps-settings-keyboard');
    const touch = root.querySelector<HTMLInputElement>('#ps-settings-touch');
    const octave = root.querySelector<HTMLInputElement>('#ps-settings-octave');
    if (midi) midi.checked = s.midiEnabled;
    if (keyboard) keyboard.checked = s.keyboardEnabled;
    if (touch) touch.checked = s.touchEnabled;
    if (octave) octave.value = String(s.defaultOctave);
  };

  root.querySelector('.ps-settings-tabs')?.addEventListener('click', onTabClick);
  root.querySelector('#ps-settings-midi')?.addEventListener('change', onMidi);
  root.querySelector('#ps-settings-keyboard')?.addEventListener('change', onKeyboard);
  root.querySelector('#ps-settings-touch')?.addEventListener('change', onTouch);
  root.querySelector('#ps-settings-octave')?.addEventListener('change', onOctave);
  root.querySelector('#ps-settings-velocity-curve')?.addEventListener('change', onVelocityCurve);
  root.querySelector('#ps-settings-midi-channel')?.addEventListener('change', onMidiChannel);
  root
    .querySelector('#ps-settings-keyboard-velocity')
    ?.addEventListener('input', onKeyboardVelocity);
  root.querySelector('#ps-settings-midi-reset')?.addEventListener('click', onMidiReset);
  root.querySelector('#ps-settings-motion')?.addEventListener('change', onMotion);
  root.querySelector('#ps-settings-reduced-motion')?.addEventListener('change', onReducedMotion);
  root.querySelector('#ps-settings-theme')?.addEventListener('change', onTheme);

  const unsubSettings = interaction.onSettingsChange(syncFromSettings);

  return () => {
    unsubSettings();
    root.querySelector('.ps-settings-tabs')?.removeEventListener('click', onTabClick);
    root.querySelector('#ps-settings-midi')?.removeEventListener('change', onMidi);
    root.querySelector('#ps-settings-keyboard')?.removeEventListener('change', onKeyboard);
    root.querySelector('#ps-settings-touch')?.removeEventListener('change', onTouch);
    root.querySelector('#ps-settings-octave')?.removeEventListener('change', onOctave);
    root
      .querySelector('#ps-settings-velocity-curve')
      ?.removeEventListener('change', onVelocityCurve);
    root.querySelector('#ps-settings-midi-channel')?.removeEventListener('change', onMidiChannel);
    root
      .querySelector('#ps-settings-keyboard-velocity')
      ?.removeEventListener('input', onKeyboardVelocity);
    root.querySelector('#ps-settings-midi-reset')?.removeEventListener('click', onMidiReset);
    root.querySelector('#ps-settings-motion')?.removeEventListener('change', onMotion);
    root
      .querySelector('#ps-settings-reduced-motion')
      ?.removeEventListener('change', onReducedMotion);
    root.querySelector('#ps-settings-theme')?.removeEventListener('change', onTheme);
  };
}
