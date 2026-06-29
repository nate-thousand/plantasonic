/**
 * Clamping and parsing for sound adapter parameters.
 * Bounds are defined in runtime/performanceParams.ts (single source of truth).
 */

import type { ControlName } from '@/runtime/types.ts';
import { DEFAULT_CONTROLS } from '@/runtime/types.ts';
import {
  clampControlValue,
  clampTempo,
  MAX_TEMPO,
  MIN_TEMPO,
} from '@/runtime/performanceParams.ts';

export { MIN_TEMPO, MAX_TEMPO, clampControlValue, clampTempo };

const CONTROL_PATH = /^controls\.(\w+)$/;

/** Parses `controls.{name}` paths; returns the control name when valid. */
export function parseControlParameterPath(path: string): ControlName | undefined {
  const match = CONTROL_PATH.exec(path);
  const name = match?.[1];
  if (!name || !(name in DEFAULT_CONTROLS)) return undefined;
  return name as ControlName;
}

/** Returns true for supported adapter parameter paths. */
export function isSupportedParameterPath(path: string): boolean {
  return path === 'tempo' || parseControlParameterPath(path) !== undefined;
}
