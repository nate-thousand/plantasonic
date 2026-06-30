import type { PlatformPlugin } from '@plantasonic/platform-types';

/** Platform plugins — adapter metadata and documentation only */
export const PLANTASONIC_PLUGINS: PlatformPlugin[] = [
  {
    manifest: {
      id: 'plantasonic.sound',
      name: 'Plantasonic Sound',
      version: '1.0.0',
      description: 'Plantasia sound engine via platform adapter.',
      capabilities: ['sound-adapter', 'documentation'],
      defaultEnabled: true,
    },
    register(context) {
      if (context.sound) {
        context.declareSoundAdapter({
          adapterId: context.sound.id,
          engineName: context.sound.engineName,
          description: 'Plantasonic generative audio',
        });
      }
    },
  },
  {
    manifest: {
      id: 'plantasonic.visual',
      name: 'Plantasonic Visual',
      version: '1.0.0',
      description: 'ASCII visual engine via platform adapter.',
      capabilities: ['visual-adapter', 'documentation'],
      defaultEnabled: true,
    },
    register(context) {
      if (context.visual) {
        context.declareVisualAdapter({
          adapterId: context.visual.id,
          engineName: context.visual.engineName,
          description: 'Plantasonic ASCII visuals',
        });
      }
    },
  },
];
