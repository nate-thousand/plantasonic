/**
 * Visual language type definitions — glyph families, patterns, motion profiles.
 */

/** Reusable glyph family taxonomy. */
export type GlyphFamily =
  | 'organic'
  | 'geometric'
  | 'minimal'
  | 'noise'
  | 'fractal'
  | 'circuit'
  | 'water'
  | 'growth'
  | 'corruption'
  | 'atmospheric';

/** Supported visual behavior patterns. */
export type VisualPattern =
  | 'growth'
  | 'bloom'
  | 'roots'
  | 'branches'
  | 'ripples'
  | 'rain'
  | 'wind'
  | 'fog'
  | 'particles'
  | 'spiral'
  | 'grid'
  | 'wave'
  | 'corruption'
  | 'collapse'
  | 'pulse'
  | 'orbit';

/** Motion communicates emotional/state quality. */
export type MotionProfile =
  'energy' | 'calm' | 'growth' | 'decay' | 'rhythm' | 'instability' | 'harmony' | 'silence';

/** Preset-to-preset transition style. */
export type VisualTransition = 'crossfade' | 'dissolve' | 'cut' | 'bloom' | 'collapse';

/** Easing curve for visual transitions. */
export type AnimationCurve = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring';

/** Supported renderer backends (canvas is live; others are future). */
export type RendererId = 'canvas' | 'webgl' | 'pixi' | 'three' | 'terminal' | 'svg';

/** Particle behavior descriptor for preset identity. */
export type ParticleBehavior = 'drift' | 'burst' | 'orbit' | 'fall' | 'static' | 'swarm';
