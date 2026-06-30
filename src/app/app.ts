/**
 * Application bootstrap — minimal DS-themed UI + runtime engines.
 */

import { createInteractionManager } from '@/interaction/index.ts';
import { bootstrapPlatform, platformServices } from '@/platform/index.ts';
import { createRuntime, eventBus } from '@/runtime/index.ts';
import { bindAppUi, renderAppLayout } from '@/ui/index.ts';

export interface PlantasonicApp {
  destroy: () => Promise<void>;
}

/** Initializes engines and mounts the design-system instrument UI. */
export async function createPlantasonicApp(container: HTMLElement): Promise<PlantasonicApp> {
  bootstrapPlatform();
  const runtime = createRuntime();
  const interaction = createInteractionManager(runtime);

  container.innerHTML = renderAppLayout();
  const root = container.querySelector<HTMLElement>('[data-ps-instrument-ui]');
  const stage = container.querySelector<HTMLElement>('#ps-stage');

  if (!root || !stage) {
    throw new Error('Instrument layout mount failed');
  }

  const unbindUi = bindAppUi({ root, interaction });

  let resizeObserver: ResizeObserver | undefined;
  let resizeRaf = 0;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        const { width, height } = stage.getBoundingClientRect();
        if (width > 0 && height > 0) runtime.resize(width, height);
      });
    });
    resizeObserver.observe(stage);
  }

  eventBus.on('error', ({ source, error }) => {
    platformServices.logging.error(`[${source}]`, error);
  });

  const result = await runtime.init({
    container: stage,
    initialPresetId: 'seed-world',
  });

  if (result.success) {
    await interaction.init();
    const { width, height } = stage.getBoundingClientRect();
    if (width > 0 && height > 0) runtime.resize(width, height);
  }

  return {
    destroy: async () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeObserver?.disconnect();
      unbindUi();
      await interaction.destroy();
      await runtime.destroy();
      container.replaceChildren();
    },
  };
}
