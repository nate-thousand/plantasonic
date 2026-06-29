/**
 * Shared performance parameter bounds — single source of truth for tempo and controls.
 * Runtime, UI, MIDI, and adapters derive clamping from these helpers.
 */

export const MIN_TEMPO = 20;
export const MAX_TEMPO = 300;
export const DEFAULT_TEMPO = 72;

/** Clamps a performance control to 0–1. */
export function clampControlValue(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Clamps transport tempo to the supported BPM range. */
export function clampTempo(bpm: number): number {
  return Math.min(MAX_TEMPO, Math.max(MIN_TEMPO, Math.round(bpm)));
}

/** Maps a normalized 0–1 value to tempo BPM. */
export function tempoFromNormalized(value: number): number {
  const normalized = clampControlValue(value);
  return clampTempo(MIN_TEMPO + normalized * (MAX_TEMPO - MIN_TEMPO));
}

/** Maps a 0–1 control value to a UI slider percentage (0–100). */
export function controlValueToPercent(value: number): number {
  return Math.round(clampControlValue(value) * 100);
}

/** Maps a UI slider percentage (0–100) to a 0–1 control value. */
export function percentToControlValue(percent: number): number {
  return clampControlValue(percent / 100);
}
