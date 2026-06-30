import type { PresetBundle } from '@plantasonic/platform-types';

import type { PresetWorld } from '@/presets/types.ts';

/** Map legacy world control names to platform sound/visual parameters */
function mapWorldControls(controls: PresetWorld['defaults']['controls']) {
  const bloom = controls?.bloom ?? 0.5;
  const mold = controls?.mold ?? 0.25;
  const density = controls?.density ?? 0.6;
  const chaos = controls?.chaos ?? 0.15;
  const brightness = controls?.brightness ?? 0.5;

  return {
    soundParameters: {
      growth: Math.min(1, bloom * 0.85),
      bloom,
      roots: Math.min(1, density * 0.9),
      mold,
      bacteria: Math.min(1, chaos * 0.8),
    },
    visualParameters: {
      density,
      speed: Math.min(1, chaos + 0.25),
      glitchAmount: chaos,
      trailAmount: Math.min(1, brightness * 0.6),
    },
  };
}

/** Convert a Plantasonic PresetWorld to a platform PresetBundle */
export function worldToPresetBundle(world: PresetWorld): PresetBundle {
  const { soundParameters, visualParameters } = mapWorldControls(world.defaults.controls);

  return {
    id: world.id,
    name: world.name,
    description: world.description,
    category: 'world',
    tags: [...world.tags, world.identity.accent],
    sound: { presetId: world.sound.presetId },
    visual: { presetId: world.visual.presetId },
    audioReactive: {
      enabled: true,
      sensitivity: 0.65,
      smoothing: 0.7,
      mappings: [
        { feature: 'bass', target: 'density', amount: 0.4, enabled: true },
        { feature: 'mids', target: 'motion', amount: 0.35, enabled: true },
        { feature: 'highs', target: 'brightness', amount: 0.3, enabled: true },
        { feature: 'amplitude', target: 'scale', amount: 0.25, enabled: true },
        { feature: 'transient', target: 'glitch', amount: chaosAmount(world), enabled: true },
      ],
    },
    workspace: {
      activeInspectorPanel: 'sound-parameters',
      regions: { stage: { visible: true }, inspector: { visible: true } },
    },
    ui: {
      audioReactiveEnabled: true,
      tempo: world.defaults.tempo ?? 72,
      soundParameters,
      visualParameters,
      bridgeSensitivity: 0.65,
      bridgeSmoothing: 0.7,
    },
  };
}

function chaosAmount(world: PresetWorld): number {
  const chaos = world.defaults.controls?.chaos ?? 0.15;
  return Math.min(0.55, chaos + 0.08);
}

export function worldsToPresetBundles(worlds: readonly PresetWorld[]): PresetBundle[] {
  return worlds.map(worldToPresetBundle);
}
