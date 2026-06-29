/**
 * State management validation — documents and verifies single-source-of-truth boundaries.
 */

import type { ControlName, ControlValues, RuntimeState } from './types.ts';
import { DEFAULT_CONTROLS } from './types.ts';
import { clampControlValue, clampTempo } from './performanceParams.ts';

/** Describes which layer owns each category of application state. */
export const STATE_OWNERS = {
  runtime: ['isPlaying', 'preset', 'activeNotes', 'tempo', 'controls', 'performance'],
  settings: [
    'midiEnabled',
    'keyboardEnabled',
    'touchEnabled',
    'velocityCurve',
    'defaultOctave',
    'midiChannel',
    'midiLearnMappings',
  ],
  adapterDerived: ['sound controlCache', 'ascii engineControlCache', 'ascii lastState'],
  ephemeral: ['midi learnTarget', 'midi sustainPedal', 'keyboard activeKeys'],
} as const;

/** Validates a runtime state snapshot has well-formed performance fields. */
export function validateRuntimeState(state: RuntimeState): string[] {
  const issues: string[] = [];

  if (state.tempo < 20 || state.tempo > 300) {
    issues.push(`tempo out of range: ${String(state.tempo)}`);
  }

  for (const name of Object.keys(DEFAULT_CONTROLS) as ControlName[]) {
    const value = state.controls[name];
    if (value < 0 || value > 1) {
      issues.push(`controls.${name} out of range: ${String(value)}`);
    }
  }

  if (state.performance.energy < 0 || state.performance.energy > 1) {
    issues.push(`performance.energy out of range: ${String(state.performance.energy)}`);
  }

  return issues;
}

/** Applies the same clamping rules runtime uses when committing control patches. */
export function clampControlPatch(values: Partial<ControlValues>): ControlValues {
  const merged = { ...DEFAULT_CONTROLS };
  for (const name of Object.keys(values) as ControlName[]) {
    const value = values[name];
    if (value !== undefined) {
      merged[name] = clampControlValue(value);
    }
  }
  return merged;
}

/** Returns true when two control snapshots match within floating-point tolerance. */
export function controlsMatch(a: ControlValues, b: ControlValues, epsilon = 0.0001): boolean {
  for (const name of Object.keys(DEFAULT_CONTROLS) as ControlName[]) {
    if (Math.abs(a[name] - b[name]) > epsilon) return false;
  }
  return true;
}

/** Validates tempo clamping is idempotent. */
export function tempoClampIsStable(): boolean {
  const samples = [10, 20, 72, 140, 300, 999, 72.4];
  return samples.every((bpm) => clampTempo(clampTempo(bpm)) === clampTempo(bpm));
}
