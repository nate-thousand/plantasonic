/**
 * Application bootstrap and lifecycle management.
 */

import { createInteractionManager } from '@/interaction/index.ts';
import { createRuntime, eventBus } from '@/runtime/index.ts';
import { createAppShell, bindRuntimeToShell, setNavStatus } from '@/ui/index.ts';

export interface PlantasonicApp {
  destroy: () => Promise<void>;
}

/** Initializes and mounts the Plantasonic application. */
export async function createPlantasonicApp(container: HTMLElement): Promise<PlantasonicApp> {
  const runtime = createRuntime();
  const interaction = createInteractionManager(runtime);

  const shell = createAppShell({
    onResize: (width, height) => {
      if (width > 0 && height > 0) {
        runtime.resize(width, height);
      }
    },
  });

  container.appendChild(shell.root);

  const unbindUi = bindRuntimeToShell(interaction, shell);

  eventBus.on('error', ({ source, error }) => {
    console.error(`[Plantasonic] ${source}:`, error);
    setNavStatus('Error');
  });

  const result = await runtime.init({ container: shell.stage });

  if (!result.success) {
    setNavStatus('Error');
  } else {
    await interaction.init();
  }

  return {
    destroy: async () => {
      unbindUi();
      await interaction.destroy();
      await runtime.destroy();
      shell.destroy();
    },
  };
}
