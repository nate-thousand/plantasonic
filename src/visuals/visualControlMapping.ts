/**
 * Maps Plantasonic runtime controls to ASCII Visual Engine parameters.
 */

import type { ControlName } from '@/runtime/types.ts';

/** Maps runtime control names to ASCII engine control names. */
export function runtimeControlToAsciiControl(name: ControlName): string {
  const map: Record<ControlName, string> = {
    bloom: 'strength',
    mold: 'glitchAmount',
    density: 'density',
    chaos: 'randomness',
    brightness: 'trailAmount',
  };
  return map[name];
}

/** Maps runtime tempo (BPM) to ASCII engine speed multiplier. */
export function tempoToAsciiSpeed(bpm: number): number {
  const clamped = Math.min(300, Math.max(20, Math.round(bpm)));
  return clamped / 72;
}
