/**
 * Flow World — wind-driven flow field audiovisual preset.
 */

import type { PresetWorld } from '../types.ts';

export const flowWorld: PresetWorld = {
  id: 'flow-world',
  name: 'Flow World',
  description: 'Wind currents — spiraling flow fields with rhythmic plantasia tones.',
  tags: ['fluid', 'rhythm'],
  version: '1.0.0',
  identity: {
    icon: '🌊',
    mood: 'Floating · Slow · Deep',
    motionStyle: 'Atmospheric · Rhythm',
    accent: 'flow',
  },
  sound: { presetId: 'bloom' },
  visual: {
    presetId: 'glyphFlowField',
    glyphFamilies: ['water', 'atmospheric'],
    patterns: ['wind', 'spiral', 'wave', 'ripples'],
    motion: 'rhythm',
    transition: 'dissolve',
    renderer: 'canvas',
    palette: 'deep cyan',
    animationCurve: 'easeInOut',
    particleBehavior: 'drift',
    engineControls: { flowStrength: 0.65, spiralAmount: 0.4 },
  },
  defaults: {
    tempo: 96,
    controls: {
      bloom: 0.55,
      mold: 0.2,
      density: 0.5,
      chaos: 0.3,
      brightness: 0.55,
    },
  },
};
