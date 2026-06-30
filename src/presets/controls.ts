/**
 * Plantasonic performance control names — creative layer vocabulary.
 * Platform adapters map these to engine parameters via PresetBundle conversion.
 */

/** Unique identifier for a preset world. */
export type PresetId = string;

/** Named performance controls used in Plantasonic preset worlds. */
export type ControlName = 'bloom' | 'mold' | 'density' | 'chaos' | 'brightness';

/** Performance control values (0–1). */
export type ControlValues = Record<ControlName, number>;

/** Default control values for worlds without explicit defaults. */
export const DEFAULT_CONTROLS: ControlValues = {
  bloom: 0.5,
  mold: 0.5,
  density: 0.5,
  chaos: 0.25,
  brightness: 0.5,
};
