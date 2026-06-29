/**
 * Application experience controller — performance mode, overlays, shortcuts, session.
 */

import type { InteractionManager } from '@/interaction/interactionManager.ts';
import { AppSettingsStore } from '@/services/appSettingsStore.ts';
import { createOverlayHost } from '../components/OverlayHost.ts';
import { openPresetBrowser } from '../components/PresetBrowser.ts';
import { openSettingsPanel } from '../components/SettingsPanel.ts';
import { bindErrorBanner } from '../components/ErrorBanner.ts';
import { animateSidebarIn, animatePresetChange } from '../motion/motionController.ts';
import { toggleCollapsibleMenu } from '../components/CollapsibleMenu.ts';
import { getStageElement } from '../components/Stage.ts';

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

  const closeOverlay = (): void => {
    overlayCleanup?.();
    overlayCleanup = null;
    overlay.close();
  };

  const openOverlay = (id: 'presets' | 'settings'): void => {
    closeOverlay();
    overlay.open(id);
    if (id === 'presets') {
      overlayCleanup = openPresetBrowser(interaction, appSettings, closeOverlay);
    } else {
      overlayCleanup = openSettingsPanel(interaction, appSettings, closeOverlay);
    }
  };

  const setPerformanceMode = (enabled: boolean): void => {
    performanceMode = enabled;
    root.classList.toggle('ps-app--performance', enabled);
    document.documentElement.toggleAttribute('data-ps-performance', enabled);

    if (enabled) {
      toggleCollapsibleMenu(false);
      closeOverlay();
    }

    const btn = document.querySelector('#ps-performance-toggle');
    btn?.setAttribute('aria-pressed', String(enabled));
    btn?.classList.toggle('active', enabled);
  };

  const togglePerformanceMode = (): void => {
    setPerformanceMode(!performanceMode);
  };

  document.querySelector('#ps-presets-btn')?.addEventListener('click', () => {
    openOverlay('presets');
  });
  document.querySelector('#ps-settings-btn')?.addEventListener('click', () => {
    openOverlay('settings');
  });
  document.querySelector('#ps-sidebar-settings-btn')?.addEventListener('click', () => {
    openOverlay('settings');
  });
  document.querySelector('#ps-preset-browse-btn')?.addEventListener('click', () => {
    openOverlay('presets');
  });
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
      openOverlay('presets');
    }
    if ((event.key === '?' || (event.shiftKey && event.key === '/')) && !event.metaKey) {
      event.preventDefault();
      openOverlay('settings');
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

  const menuToggle = document.querySelector('#ps-menu-toggle');
  menuToggle?.addEventListener('click', () => {
    const sidebar = document.querySelector('#ps-sidebar');
    if (sidebar?.classList.contains('ps-sidebar--visible')) {
      animateSidebarIn(sidebar as HTMLElement);
    }
  });

  return {
    appSettings,
    destroy: () => {
      closeOverlay();
      unbindError();
      unsubscribe();
      document.removeEventListener('keydown', onKeyDown);
      overlay.destroy();
    },
  };
}
