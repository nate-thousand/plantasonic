/**
 * Application bootstrap and lifecycle management.
 */

import { createRuntime, eventBus } from '@/runtime/index.ts';
import { createAppShell, bindRuntimeToShell, setNavStatus } from '@/ui/index.ts';

export interface PlantasonicApp {
  destroy: () => Promise<void>;
}

/** Initializes and mounts the Plantasonic application. */
export async function createPlantasonicApp(container: HTMLElement): Promise<PlantasonicApp> {
  const runtime = createRuntime();

  const shell = createAppShell({
    onResize: (width, height) => {
      if (width > 0 && height > 0) {
        runtime.resize(width, height);
      }
    },
  });

  container.appendChild(shell.root);

  const unbindUi = bindRuntimeToShell(runtime, shell);

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
      unbindUi();
      await runtime.destroy();
      shell.destroy();
    },
  };
}
