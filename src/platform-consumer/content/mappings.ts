/**
 * Plantasonic creative mappings — documentation for audiovisual relationships.
 * Runtime mapping is owned by @plantasonic/platform (adapters + audio-reactive bridge).
 */

/** Default transport tempo for Seed World boot. */
export const PLANTASONIC_DEFAULT_TEMPO = 72;

/** Legacy world control → platform sound parameter names. */
export const WORLD_TO_SOUND_PARAMETER_MAP = {
  bloom: 'bloom',
  mold: 'mold',
  density: 'roots',
  chaos: 'bacteria',
  brightness: 'growth',
} as const;

/** Legacy world control → platform visual parameter names. */
export const WORLD_TO_VISUAL_PARAMETER_MAP = {
  bloom: 'strength',
  mold: 'glitchAmount',
  density: 'density',
  chaos: 'speed',
  brightness: 'trailAmount',
} as const;

/** Audio-reactive bridge feature targets (platform bridge vocabulary). */
export const AUDIO_REACTIVE_TARGETS = [
  'density',
  'motion',
  'brightness',
  'scale',
  'glitch',
] as const;
