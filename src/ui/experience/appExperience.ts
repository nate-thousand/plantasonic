/**
 * Application experience — overlays, focus mode, and shell events.
 * Command palette is owned by plantasonic-design-system/shell.
 */

import type { InteractionManager } from '@/interaction/interactionManager.ts';
import { AppSettingsStore } from '@/services/appSettingsStore.ts';
import { registerAppCommands } from '@/shell/registerAppCommands.ts';
import { createOverlayHost } from '../components/OverlayHost.ts';
import { openPresetBrowser } from '../components/PresetBrowser.ts';
import { openSettingsPanel } from '../components/SettingsOverlay.ts';
import { openInfoPanel } from '../components/InfoPanel.ts';
import { bindErrorBanner } from '../components/ErrorBanner.ts';
import { animatePresetChange } from '../motion/motionController.ts';
import { closeCollapsibleMenu } from '../components/ShellNavigation.ts';
import {
  closeInspector,
  getInspectorSettingsMount,
  openInspector,
} from '../components/InspectorPanel.ts';
import { getStageElement } from '../components/Stage.ts';
import { eventBus } from '@/runtime/events.ts';
import { renderSettingsSections, bindSettingsPanel } from '../components/settingsBindings.ts';

export interface AppExperience {
  appSettings: AppSettingsStore;
  destroy: () => void;
}

export interface AppExperienceOptions {
  root: HTMLElement;
  instrumentRoot: HTMLElement;
  interaction: InteractionManager;
}

/** Creates and wires the application experience layer. */
export function createAppExperience(options: AppExperienceOptions): AppExperience {
  const { root, instrumentRoot, interaction } = options;
  const appSettings = new AppSettingsStore();
  const overlay = createOverlayHost();
  root.appendChild(overlay.root);

  let focusMode = false;
  let overlayCleanup: (() => void) | null = null;
  let lastPreset: string | null = null;

  const unbindError = bindErrorBanner(root);

  const settingsMount = getInspectorSettingsMount();
  if (settingsMount) {
    renderSettingsSections(settingsMount, interaction, appSettings);
  }
  const unbindSettings = settingsMount
    ? bindSettingsPanel(settingsMount, interaction, appSettings)
    : () => undefined;

  const setFocusMode = (enabled: boolean): void => {
    focusMode = enabled;
    instrumentRoot.classList.toggle('ps-app--performance', enabled);
    root.classList.toggle('ps-app-shell--performance', enabled);
    document.documentElement.toggleAttribute('data-ps-performance', enabled);

    if (enabled) {
      closeCollapsibleMenu();
      closeOverlay();
    }

    const btn = document.querySelector('#ps-focus-mode-toggle');
    btn?.setAttribute('aria-pressed', String(enabled));
    btn?.classList.toggle('active', enabled);
  };

  const toggleFocusMode = (): void => {
    setFocusMode(!focusMode);
  };

  registerAppCommands({
    interaction,
    toggleFocusMode,
    isFocusMode: () => focusMode,
  });

  const closeOverlay = (): void => {
    overlayCleanup?.();
    overlayCleanup = null;
    overlay.close();
  };

  const openPresetOverlay = (): void => {
    closeCollapsibleMenu();
    closeOverlay();
    overlay.open('presets');
    overlay.root.classList.add('ps-overlay-host--presets');
    overlayCleanup = openPresetBrowser(interaction, appSettings, closeOverlay);
  };

  const openSettingsOverlay = (): void => {
    closeCollapsibleMenu();
    closeOverlay();
    overlay.open('settings');
    overlay.root.classList.remove('ps-overlay-host--presets');
    overlayCleanup = openSettingsPanel(interaction, appSettings, closeOverlay);
  };

  const openAboutOverlay = (): void => {
    closeCollapsibleMenu();
    closeOverlay();
    overlay.open('settings');
    overlayCleanup = openInfoPanel('about', closeOverlay);
  };

  const openHelpOverlay = (): void => {
    closeCollapsibleMenu();
    closeOverlay();
    overlay.open('settings');
    overlayCleanup = openInfoPanel('help', closeOverlay);
  };

  document.querySelector('#ps-preset-browse-btn')?.addEventListener('click', openPresetOverlay);
  document.querySelector('#ps-focus-mode-toggle')?.addEventListener('click', toggleFocusMode);
  document.querySelector('#ps-focus-exit')?.addEventListener('click', () => {
    setFocusMode(false);
  });

  const unsubPanelOpen = eventBus.on('shell:panel-open', () => {
    closeOverlay();
  });
  const unsubOpenSettings = eventBus.on('shell:open-settings', openSettingsOverlay);
  const unsubOpenPresets = eventBus.on('shell:open-presets', openPresetOverlay);
  const unsubOpenHelp = eventBus.on('shell:open-help', openHelpOverlay);
  const unsubOpenAbout = eventBus.on('shell:open-about', openAboutOverlay);
  const unsubCloseInspector = eventBus.on('shell:close-inspector', () => {
    closeInspector();
  });
  const unsubOpenInspector = eventBus.on('shell:open-inspector', ({ category }) => {
    closeOverlay();
    openInspector(category);
  });
  const unsubToggleFocus = eventBus.on('shell:toggle-focus-mode', toggleFocusMode);

  const onKeyDown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    if (event.key === 'p' || event.key === 'P') {
      if (!event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        toggleFocusMode();
      }
    }
  };
  document.addEventListener('keydown', onKeyDown);

  const unsubscribe = interaction.subscribe((state) => {
    if (state.preset && state.preset !== lastPreset) {
      lastPreset = state.preset;
      appSettings.recordRecentPreset(state.preset);
      const stage = getStageElement();
      if (stage) animatePresetChange(stage);
      instrumentRoot.dataset.activeWorld = state.preset;
    }
  });

  return {
    appSettings,
    destroy: () => {
      closeOverlay();
      unbindSettings();
      unbindError();
      unsubscribe();
      document.removeEventListener('keydown', onKeyDown);
      unsubPanelOpen();
      unsubOpenSettings();
      unsubOpenPresets();
      unsubOpenHelp();
      unsubOpenAbout();
      unsubCloseInspector();
      unsubOpenInspector();
      unsubToggleFocus();
      overlay.destroy();
    },
  };
}
