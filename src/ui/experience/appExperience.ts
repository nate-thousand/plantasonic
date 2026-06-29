/**
 * Application experience controller — performance mode, overlays, shortcuts, session.
 */

import type { InteractionManager } from '@/interaction/interactionManager.ts';
import { AppSettingsStore } from '@/services/appSettingsStore.ts';
import { createOverlayHost } from '../components/OverlayHost.ts';
import { openPresetBrowser } from '../components/PresetBrowser.ts';
import { bindSettingsPanel, renderSettingsSections } from '../components/settingsBindings.ts';
import { bindErrorBanner } from '../components/ErrorBanner.ts';
import { animatePresetChange } from '../motion/motionController.ts';
import {
  closeCollapsibleMenu,
  getSidebarSetupMount,
  openSidebarTab,
} from '../components/CollapsibleMenu.ts';
import { getStageElement } from '../components/Stage.ts';
import { eventBus } from '@/runtime/events.ts';

export interface AppExperience {
  appSettings: AppSettingsStore;
  destroy: () => void;
}

export interface AppExperienceOptions {
  root: HTMLElement;
  interaction: InteractionManager;
}

/** Creates and wires the application experience layer. */
export function createAppExperience(options: AppExperienceOptions): AppExperience {
  const { root, interaction } = options;
  const appSettings = new AppSettingsStore();
  const overlay = createOverlayHost();
  root.appendChild(overlay.root);

  let performanceMode = false;
  let overlayCleanup: (() => void) | null = null;
  let lastPreset: string | null = null;

  const unbindError = bindErrorBanner(root);

  const setupMount = getSidebarSetupMount();
  if (setupMount) {
    renderSettingsSections(setupMount, interaction, appSettings);
  }
  const unbindSettings = setupMount
    ? bindSettingsPanel(setupMount, interaction, appSettings)
    : () => undefined;

  const closeOverlay = (): void => {
    overlayCleanup?.();
    overlayCleanup = null;
    overlay.close();
  };

  const openPresetOverlay = (): void => {
    closeCollapsibleMenu();
    closeOverlay();
    overlay.open('presets');
    overlayCleanup = openPresetBrowser(interaction, appSettings, closeOverlay);
  };

  const unsubPanelOpen = eventBus.on('shell:panel-open', () => {
    closeOverlay();
  });

  const setPerformanceMode = (enabled: boolean): void => {
    performanceMode = enabled;
    root.classList.toggle('ps-app--performance', enabled);
    document.documentElement.toggleAttribute('data-ps-performance', enabled);

    if (enabled) {
      closeCollapsibleMenu();
      closeOverlay();
    }

    const btn = document.querySelector('#ps-performance-toggle');
    btn?.setAttribute('aria-pressed', String(enabled));
    btn?.classList.toggle('active', enabled);
  };

  const togglePerformanceMode = (): void => {
    setPerformanceMode(!performanceMode);
  };

  document.querySelector('#ps-preset-browse-btn')?.addEventListener('click', openPresetOverlay);
  document
    .querySelector('#ps-performance-toggle')
    ?.addEventListener('click', togglePerformanceMode);
  document.querySelector('#ps-performance-exit')?.addEventListener('click', () => {
    setPerformanceMode(false);
  });

  const onKeyDown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    if (event.key === 'p' || event.key === 'P') {
      if (!event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        togglePerformanceMode();
      }
    }
    if (event.key === '/' && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      openPresetOverlay();
    }
    if ((event.key === '?' || (event.shiftKey && event.key === '/')) && !event.metaKey) {
      event.preventDefault();
      openSidebarTab('setup');
    }
  };
  document.addEventListener('keydown', onKeyDown);

  const unsubscribe = interaction.subscribe((state) => {
    if (state.preset && state.preset !== lastPreset) {
      lastPreset = state.preset;
      appSettings.recordRecentPreset(state.preset);
      const stage = getStageElement();
      if (stage) animatePresetChange(stage);
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
      overlay.destroy();
    },
  };
}
