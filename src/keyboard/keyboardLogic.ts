/**
 * Pure keyboard note layout helpers (testable without DOM).
 */

import type { VelocityCurve } from '@/interaction/types.ts';
import { applyVelocityCurve } from '@/interaction/velocity.ts';

export const MIN_OCTAVE = 0;
export const MAX_OCTAVE = 8;

/** Default chromatic key map (white keys row + extensions). */
export const DEFAULT_KEY_MAP: Readonly<Record<string, number>> = {
  a: 0,
  w: 1,
  s: 2,
  e: 3,
  d: 4,
  f: 5,
  t: 6,
  g: 7,
  y: 8,
  h: 9,
  u: 10,
  j: 11,
};

/** Clamps keyboard octave to the playable range. */
export function clampOctave(octave: number): number {
  return Math.min(MAX_OCTAVE, Math.max(MIN_OCTAVE, Math.round(octave)));
}

/** Returns true when the key is mapped to a chromatic note offset. */
export function isPlayableKey(key: string, keyMap: Readonly<Record<string, number>>): boolean {
  return keyMap[key.toLowerCase()] !== undefined;
}

/** Computes MIDI note number from key map offset and octave (Z/X range 0–8). */
export function noteFromKey(
  key: string,
  octave: number,
  keyMap: Readonly<Record<string, number>>,
): number | undefined {
  const offset = keyMap[key.toLowerCase()];
  if (offset === undefined) return undefined;
  return 12 * (clampOctave(octave) + 1) + offset;
}

/** Resolves keyboard note velocity from settings. */
export function keyboardNoteVelocity(
  keyboardVelocity: number,
  velocityCurve: VelocityCurve,
): number {
  return applyVelocityCurve(keyboardVelocity, velocityCurve);
}
