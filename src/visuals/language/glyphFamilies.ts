/**
 * Glyph family taxonomy — reusable visual character sets.
 */

import type { GlyphFamily } from './types.ts';

export interface GlyphFamilyDefinition {
  id: GlyphFamily;
  label: string;
  description: string;
  character: string;
}

/** Registered glyph families available to preset worlds. */
export const GLYPH_FAMILIES: Record<GlyphFamily, GlyphFamilyDefinition> = {
  organic: {
    id: 'organic',
    label: 'Organic',
    description: 'Curved, living forms — vines, petals, cellular growth.',
    character: 'warm, breathing',
  },
  geometric: {
    id: 'geometric',
    label: 'Geometric',
    description: 'Grids, angles, symmetry — structured mathematical forms.',
    character: 'precise, ordered',
  },
  minimal: {
    id: 'minimal',
    label: 'Minimal',
    description: 'Sparse glyphs with negative space — zen-like restraint.',
    character: 'quiet, focused',
  },
  noise: {
    id: 'noise',
    label: 'Noise',
    description: 'Static, grain, entropy fields.',
    character: 'unstable, raw',
  },
  fractal: {
    id: 'fractal',
    label: 'Fractal',
    description: 'Self-similar branching at multiple scales.',
    character: 'recursive, deep',
  },
  circuit: {
    id: 'circuit',
    label: 'Circuit',
    description: 'Traces, nodes, digital pathways.',
    character: 'electric, connected',
  },
  water: {
    id: 'water',
    label: 'Water',
    description: 'Flow, ripples, fluid motion.',
    character: 'fluid, reflective',
  },
  growth: {
    id: 'growth',
    label: 'Growth',
    description: 'Sprouting, expanding, reaching outward.',
    character: 'expansive, alive',
  },
  corruption: {
    id: 'corruption',
    label: 'Corruption',
    description: 'Glitch, decay, signal breakdown.',
    character: 'broken, volatile',
  },
  atmospheric: {
    id: 'atmospheric',
    label: 'Atmospheric',
    description: 'Fog, haze, ambient drift.',
    character: 'ambient, diffuse',
  },
};

/** Returns glyph family definitions for the given ids. */
export function resolveGlyphFamilies(ids: readonly GlyphFamily[]): GlyphFamilyDefinition[] {
  return ids.map((id) => GLYPH_FAMILIES[id]);
}
