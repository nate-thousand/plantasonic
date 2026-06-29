/**
 * Settings overlay — floating panel for input, motion, and display preferences.
 */

import type { InteractionManager } from '@/interaction/interactionManager.ts';
import type { AppSettingsStore } from '@/services/appSettingsStore.ts';
import { getOverlayPanel } from './OverlayHost.ts';
import { bindSettingsPanel, renderSettingsSections } from './settingsBindings.ts';

/** Opens the settings overlay panel. */
export function openSettingsPanel(
  interaction: InteractionManager,
  appSettings: AppSettingsStore,
  onClose: () => void,
): () => void {
  const panel = getOverlayPanel();
  if (!panel) return () => undefined;

  panel.setAttribute('aria-labelledby', 'ps-settings-title');
  panel.innerHTML = `
    <header class="ps-overlay-panel__header">
      <h2 id="ps-settings-title" class="ps-overlay-panel__title">Settings</h2>
      <button type="button" class="btn btn-sm btn-outline-secondary" id="ps-settings-close" aria-label="Close settings">
        Close
      </button>
    </header>
    <div class="ps-settings-overlay" id="ps-settings-mount"></div>
  `;

  const mount = panel.querySelector('#ps-settings-mount');
  if (!(mount instanceof HTMLElement)) return () => undefined;

  renderSettingsSections(mount, interaction, appSettings);
  const unbind = bindSettingsPanel(mount, interaction, appSettings);

  const onCloseClick = (): void => {
    onClose();
  };
  panel.querySelector('#ps-settings-close')?.addEventListener('click', onCloseClick);

  return () => {
    unbind();
    panel.querySelector('#ps-settings-close')?.removeEventListener('click', onCloseClick);
  };
}
