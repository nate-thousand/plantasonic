/**
 * Applies velocity curves to raw 0–1 input values.
 */

import type { VelocityCurve } from '@/interaction/types.ts';

/** Maps a normalized input through the configured velocity curve. */
export function applyVelocityCurve(value: number, curve: VelocityCurve): number {
  const clamped = Math.min(1, Math.max(0, value));
  switch (curve) {
    case 'soft':
      return clamped * clamped;
    case 'hard':
      return Math.sqrt(clamped);
    default:
      return clamped;
  }
}

/** Converts MIDI velocity (0–127) to runtime velocity (0–1) with curve applied. */
export function midiVelocityToRuntime(velocity: number, curve: VelocityCurve): number {
  return applyVelocityCurve(velocity / 127, curve);
}
