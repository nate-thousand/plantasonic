/**
 * Shared utility functions.
 */

/** Clamps a numeric value between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Returns true when running in a browser environment. */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}
