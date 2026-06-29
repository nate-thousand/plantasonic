/**
 * Nebula World — particle nebula audiovisual preset.
 */

import type { PresetWorld } from '../types.ts';

export const nebulaWorld: PresetWorld = {
  id: 'nebula-world',
  name: 'Nebula World',
  description: 'Particle nebula — orbiting glyphs with glitch-toned cosmic drift.',
  tags: ['particles', 'energy'],
  version: '1.0.0',
  identity: {
    icon: '✦',
    mood: 'Dense · Cosmic · Energy',
    motionStyle: 'Orbiting · Drift',
    accent: 'nebula',
  },
  sound: { presetId: 'mutation' },
  visual: {
    presetId: 'glyphParticleNebula',
    glyphFamilies: ['atmospheric', 'fractal'],
    patterns: ['particles', 'orbit', 'pulse', 'rain'],
    motion: 'energy',
    transition: 'bloom',
    renderer: 'canvas',
    palette: 'violet haze',
    animationCurve: 'easeOut',
    particleBehavior: 'orbit',
    engineControls: { density: 0.7, simSpawnRate: 0.5 },
  },
  defaults: {
    tempo: 108,
    controls: {
      bloom: 0.45,
      mold: 0.55,
      density: 0.7,
      chaos: 0.65,
      brightness: 0.5,
    },
  },
};
