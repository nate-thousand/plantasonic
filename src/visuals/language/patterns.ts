/**
 * Visual pattern library — combinable behaviors for preset worlds.
 */

import type { VisualPattern } from './types.ts';

export interface PatternDefinition {
  id: VisualPattern;
  label: string;
  description: string;
  /** Primary engine control influenced by this pattern. */
  primaryControl?: string;
}

/** Registered visual behavior patterns. */
export const VISUAL_PATTERNS: Record<VisualPattern, PatternDefinition> = {
  growth: {
    id: 'growth',
    label: 'Growth',
    description: 'Expanding structures from seed points.',
    primaryControl: 'strength',
  },
  bloom: {
    id: 'bloom',
    label: 'Bloom',
    description: 'Radial expansion and petal-like bursts.',
    primaryControl: 'strength',
  },
  roots: {
    id: 'roots',
    label: 'Roots',
    description: 'Downward branching tendrils.',
    primaryControl: 'flowStrength',
  },
  branches: {
    id: 'branches',
    label: 'Branches',
    description: 'Fractal tree-like splits.',
    primaryControl: 'randomness',
  },
  ripples: {
    id: 'ripples',
    label: 'Ripples',
    description: 'Concentric wave propagation.',
    primaryControl: 'frequency',
  },
  rain: {
    id: 'rain',
    label: 'Rain',
    description: 'Vertical particle fall.',
    primaryControl: 'simSpawnRate',
  },
  wind: {
    id: 'wind',
    label: 'Wind',
    description: 'Directional flow fields.',
    primaryControl: 'flowStrength',
  },
  fog: {
    id: 'fog',
    label: 'Fog',
    description: 'Soft atmospheric diffusion.',
    primaryControl: 'trailAmount',
  },
  particles: {
    id: 'particles',
    label: 'Particles',
    description: 'Independent glyph particles.',
    primaryControl: 'density',
  },
  spiral: {
    id: 'spiral',
    label: 'Spiral',
    description: 'Rotating arm structures.',
    primaryControl: 'spiralAmount',
  },
  grid: {
    id: 'grid',
    label: 'Grid',
    description: 'Regular lattice placement.',
    primaryControl: 'symmetry',
  },
  wave: {
    id: 'wave',
    label: 'Wave',
    description: 'Oscillating sine-based motion.',
    primaryControl: 'frequency',
  },
  corruption: {
    id: 'corruption',
    label: 'Corruption',
    description: 'Glitch displacement and artifacting.',
    primaryControl: 'glitchAmount',
  },
  collapse: {
    id: 'collapse',
    label: 'Collapse',
    description: 'Inward decay and implosion.',
    primaryControl: 'decay',
  },
  pulse: {
    id: 'pulse',
    label: 'Pulse',
    description: 'Rhythmic amplitude breathing.',
    primaryControl: 'amplitude',
  },
  orbit: {
    id: 'orbit',
    label: 'Orbit',
    description: 'Circular particle paths.',
    primaryControl: 'flowStrength',
  },
};

/** Returns pattern definitions for the given ids. */
export function resolvePatterns(ids: readonly VisualPattern[]): PatternDefinition[] {
  return ids.map((id) => VISUAL_PATTERNS[id]);
}
