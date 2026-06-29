/**
 * Application bootstrap and lifecycle management.
 */

import { createInteractionManager } from '@/interaction/index.ts';
import { createRuntime, eventBus } from '@/runtime/index.ts';
import { installApplicationShell } from '@/shell/index.ts';
import { createAppShell, bindRuntimeToShell, setNavStatus } from '@/ui/index.ts';

export interface PlantasonicApp {
  destroy: () => Promise<void>;
}

/** Initializes and mounts the Plantasonic application. */
export async function createPlantasonicApp(container: HTMLElement): Promise<PlantasonicApp> {
  const runtime = createRuntime();
  const interaction = createInteractionManager(runtime);

  const shellHost = installApplicationShell(container);

  const shell = createAppShell({
    mountTarget: shellHost.workspace,
    onResize: (width, height) => {
      if (width > 0 && height > 0) {
        runtime.resize(width, height);
      }
    },
  });

  const unbindUi = bindRuntimeToShell(interaction, shell, shellHost.root);

  eventBus.on('error', ({ source, error }) => {
    console.error(`[Plantasonic] ${source}:`, error);
    setNavStatus('Error');
  });

  const result = await runtime.init({
    container: shell.stage,
    initialPresetId: 'seed-world',
  });

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
      shellHost.destroy();
    },
  };
}
