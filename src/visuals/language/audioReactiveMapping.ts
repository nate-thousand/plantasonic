/**
 * Audio-reactive mapping — runtime state to ASCII engine control values.
 *
 * Base controls come from user sliders; performance metrics modulate on top.
 */

import type { ControlValues, RuntimeState } from '@/runtime/types.ts';
import { runtimeControlToAsciiControl, tempoToAsciiSpeed } from '../visualControlMapping.ts';

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/** Maps pitch to normalized vertical position (0–1). */
export function pitchToVerticalPosition(note: number): number {
  return clamp(0.35 + ((Math.floor(note / 12) - 4) / 8) * 0.3);
}

/** Maps pitch class to normalized horizontal position (0–1). */
export function pitchToHorizontalPosition(note: number): number {
  return clamp((note % 12) / 11);
}

/** Sustain factor from active note count (0–1). */
export function sustainFromActiveNotes(activeNotes: number[]): number {
  return clamp(activeNotes.length / 8);
}

/**
 * Computes modulated engine control values from runtime state.
 * Combines user controls with live performance metrics.
 */
export function resolveEngineControls(state: Readonly<RuntimeState>): Record<string, number> {
  const { controls, tempo, performance, activeNotes } = state;
  const sustain = sustainFromActiveNotes(activeNotes);

  const base: Record<string, number> = {
    [runtimeControlToAsciiControl('bloom')]: controls.bloom,
    [runtimeControlToAsciiControl('mold')]: controls.mold,
    [runtimeControlToAsciiControl('density')]: controls.density,
    [runtimeControlToAsciiControl('chaos')]: controls.chaos,
    [runtimeControlToAsciiControl('brightness')]: controls.brightness,
    speed: tempoToAsciiSpeed(tempo),
  };

  // Performance modulations layered on base controls
  base.strength = clamp(controls.bloom + performance.energy * 0.25);
  base.trailAmount = clamp(controls.brightness + performance.velocity * 0.3 + sustain * 0.15);
  base.randomness = clamp(controls.chaos + performance.activity * 0.2);
  base.glitchAmount = clamp(controls.mold + performance.activity * 0.12);
  base.density = clamp(controls.density + performance.activity * 0.08);
  base.amplitude = clamp(performance.energy * 0.6 + performance.velocity * 0.2);
  base.flowStrength = clamp(performance.energy * 0.45 + performance.activity * 0.25);

  return base;
}

/** Returns only controls that changed beyond threshold (avoids redundant engine updates). */
export function diffEngineControls(
  previous: Record<string, number>,
  next: Record<string, number>,
  threshold = 0.005,
): Record<string, number> {
  const changed: Record<string, number> = {};
  for (const [key, value] of Object.entries(next)) {
    const prev = previous[key];
    if (prev === undefined || Math.abs(prev - value) > threshold) {
      changed[key] = value;
    }
  }
  return changed;
}

/** Documents the audio → visual mapping contract. */
export const AUDIO_VISUAL_MAPPING = {
  velocity: ['trailAmount', 'amplitude', 'note intensity'],
  pitch: ['note x/y position'],
  tempo: ['speed'],
  density: ['density'],
  bloom: ['strength'],
  mold: ['glitchAmount'],
  chaos: ['randomness'],
  sustain: ['trailAmount persistence'],
  energy: ['strength', 'amplitude', 'flowStrength'],
  activity: ['randomness', 'glitchAmount', 'density'],
} as const satisfies Record<string, readonly string[]>;

/** Type-safe reference to base control names for tests. */
export type BaseControlValues = ControlValues;
