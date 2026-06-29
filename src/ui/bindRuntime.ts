/**
 * Binds runtime and interaction layer to UI shell components.
 * UI dispatches through the interaction layer — never adapters directly.
 */

import type { InteractionManager } from '@/interaction/interactionManager.ts';
import type { AppShell } from './layouts/AppShell.ts';
import { bindControlDock, bindControlSliders } from './components/ControlDock.ts';
import { updateStageStatus } from './components/Stage.ts';
import { setNavStatus } from './components/TopNav.ts';
import { createAppExperience } from './experience/appExperience.ts';
import { eventBus } from '@/runtime/events.ts';

/** Connects interaction layer and runtime state to the application shell. */
export function bindRuntimeToShell(interaction: InteractionManager, shell: AppShell): () => void {
  const unbindDock = bindControlDock(interaction);
  const unbindSliders = bindControlSliders(interaction);
  const experience = createAppExperience({ root: shell.root, interaction });

  const unsubscribe = interaction.subscribe((state) => {
    setNavStatus(formatNavStatus(state, interaction));
    updateStageStatus(state);
  });

  const unsubMidi = eventBus.on('midi:connection', () => {
    setNavStatus(formatNavStatus(interaction.getState(), interaction));
  });

  const unsubFullscreen = eventBus.on('viewport:fullscreen', ({ isFullscreen }) => {
    if (!isFullscreen) {
      setNavStatus(formatNavStatus(interaction.getState(), interaction));
    }
  });

  return () => {
    unbindDock();
    unbindSliders();
    experience.destroy();
    unsubscribe();
    unsubMidi();
    unsubFullscreen();
  };
}

function formatNavStatus(
  state: ReturnType<InteractionManager['getState']>,
  interaction: InteractionManager,
): string {
  const base = state.isPlaying ? 'Playing' : 'Ready';
  const midi = interaction.getConnectionStates().midi;
  if (midi?.connected) {
    const label = midi.label ?? 'MIDI';
    return `${base} · ${label}`;
  }
  if (interaction.getSettings().midiEnabled) {
    return `${base} · No MIDI`;
  }
  return base;
}
