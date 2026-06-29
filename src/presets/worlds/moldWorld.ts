/**
 * Mold World — corrupted broadcast audiovisual preset.
 */

import type { PresetWorld } from '../types.ts';

export const moldWorld: PresetWorld = {
  id: 'mold-world',
  name: 'Mold World',
  description: 'Corrupted broadcast — vine species with glitch-heavy ASCII decay.',
  tags: ['dark', 'chaotic'],
  version: '1.0.0',
  sound: { presetId: 'vine' },
  visual: {
    presetId: 'glyphCorruptedBroadcast',
    glyphFamilies: ['corruption', 'noise'],
    patterns: ['corruption', 'collapse', 'wave'],
    motion: 'instability',
    transition: 'collapse',
    renderer: 'canvas',
    palette: 'sick green static',
    animationCurve: 'spring',
    particleBehavior: 'burst',
    engineControls: { scanlineAmount: 0.5, glitchAmount: 0.6 },
  },
  defaults: {
    tempo: 84,
    controls: {
      bloom: 0.4,
      mold: 0.75,
      density: 0.6,
      chaos: 0.5,
      brightness: 0.35,
    },
  },
};
