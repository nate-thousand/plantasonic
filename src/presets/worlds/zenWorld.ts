/**
 * Zen World — minimal calm audiovisual preset.
 */

import type { PresetWorld } from '../types.ts';

export const zenWorld: PresetWorld = {
  id: 'zen-world',
  name: 'Zen World',
  description: 'Minimal stillness — sparse glyphs breathing in quiet space.',
  tags: ['minimal', 'calm'],
  version: '1.0.0',
  identity: {
    icon: '🍃',
    mood: 'Layered · Bright · Living',
    motionStyle: 'Still · Breathing',
    accent: 'zen',
  },
  sound: { presetId: 'mycelium' },
  visual: {
    presetId: 'glyphMinimalZen',
    glyphFamilies: ['minimal', 'geometric'],
    patterns: ['pulse', 'grid', 'fog'],
    motion: 'silence',
    transition: 'crossfade',
    renderer: 'canvas',
    palette: 'soft white',
    animationCurve: 'linear',
    particleBehavior: 'static',
    engineControls: { symmetry: 0.8, trailAmount: 0.25 },
    quality: 'high',
  },
  defaults: {
    tempo: 60,
    controls: {
      bloom: 0.35,
      mold: 0.1,
      density: 0.3,
      chaos: 0.05,
      brightness: 0.45,
    },
  },
};
