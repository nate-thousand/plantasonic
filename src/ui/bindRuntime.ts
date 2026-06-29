/**
 * Binds runtime and interaction layer to UI shell components.
 * UI dispatches through the interaction layer — never adapters directly.
 */

import type { InteractionManager } from '@/interaction/interactionManager.ts';
import type { AppShell } from './layouts/AppShell.ts';
import { bindControlDock, bindControlSliders } from './components/ControlDock.ts';
import { bindInteractionSettings } from './components/InteractionSettings.ts';
import { updateStageStatus } from './components/Stage.ts';
import { setNavStatus } from './components/TopNav.ts';
import { createAppExperience } from './experience/appExperience.ts';

/** Connects interaction layer and runtime state to the application shell. */
export function bindRuntimeToShell(interaction: InteractionManager, shell: AppShell): () => void {
  const unbindDock = bindControlDock(interaction);
  const unbindSliders = bindControlSliders(interaction);
  const unbindSettings = bindInteractionSettings(interaction);
  const experience = createAppExperience({ root: shell.root, interaction });

  const unsubscribe = interaction.subscribe((state) => {
    setNavStatus(state.isPlaying ? 'Playing' : 'Ready');
    updateStageStatus(state);
  });

  return () => {
    unbindDock();
    unbindSliders();
    unbindSettings();
    experience.destroy();
    unsubscribe();
  };
}
