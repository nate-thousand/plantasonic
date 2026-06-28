/**
 * Application bootstrap and lifecycle management.
 */

import { NullSoundAdapter } from '@/audio/index.ts';
import { NullAsciiAdapter } from '@/visuals/index.ts';
import { Runtime, eventBus, stateStore } from '@/runtime/index.ts';
import { createAppShell, setNavStatus } from '@/ui/index.ts';

export interface PlantasonicApp {
  destroy: () => Promise<void>;
}

/** Initializes and mounts the Plantasonic application. */
export async function createPlantasonicApp(container: HTMLElement): Promise<PlantasonicApp> {
  const runtime = new Runtime({
    soundAdapter: new NullSoundAdapter(),
    asciiAdapter: new NullAsciiAdapter(),
  });

  const shell = createAppShell({
    onResize: (width, height) => {
      if (width > 0 && height > 0) {
        runtime.resize(width, height);
      }
    },
  });

  container.appendChild(shell.root);

  const unsubscribe = stateStore.subscribe((state) => {
    setNavStatus(formatPhase(state.transport.phase));
  });

  eventBus.on('error', ({ source, error }) => {
    console.error(`[Plantasonic] ${source}:`, error);
    setNavStatus('Error');
  });

  const result = await runtime.init({ container: shell.stage });

  if (!result.success) {
    setNavStatus('Error');
  }

  return {
    destroy: async () => {
      unsubscribe();
      await runtime.destroy();
      shell.destroy();
    },
  };
}

function formatPhase(phase: string): string {
  return phase.charAt(0).toUpperCase() + phase.slice(1);
}
