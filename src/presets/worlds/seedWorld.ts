/**
 * Seed World — organic growth audiovisual preset.
 */

import type { PresetWorld } from '../types.ts';

export const seedWorld: PresetWorld = {
  id: 'seed-world',
  name: 'Seed World',
  description: 'Organic growth — blooming glyphs and generative plantasia tones.',
  tags: ['organic', 'calm'],
  version: '1.0.0',
  sound: { presetId: 'plantasonic' },
  visual: { presetId: 'glyphOrganicBloom' },
  defaults: {
    tempo: 72,
    controls: {
      bloom: 0.65,
      mold: 0.25,
      density: 0.55,
      chaos: 0.15,
      brightness: 0.6,
    },
  },
};
