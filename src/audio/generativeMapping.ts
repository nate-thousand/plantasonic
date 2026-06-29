/**
 * Documents how Plantasonic runtime controls drive engine generative systems.
 *
 * Generative output (phrases, chords, drones, particles, ornaments) is orchestrated
 * by the engine {@link Generator} class. Species call `syncGeneratorEcology()` whenever
 * ecological controls change. The adapter routes runtime sliders through `setControl()`.
 */

import type { ControlName } from '@/runtime/types.ts';
import type { EcologicalControl } from 'plantasia-sound-engine';
import { runtimeControlToEcological } from './controlMapping.ts';

export interface GenerativeControlEffect {
  runtime: ControlName;
  ecological: EcologicalControl;
  /** Generative dimensions modulated by this control. */
  affects: readonly string[];
}

/** Runtime control → ecological target → generative behavior. */
export const GENERATIVE_CONTROL_EFFECTS: readonly GenerativeControlEffect[] = [
  {
    runtime: 'density',
    ecological: 'growth',
    affects: ['event timing', 'phrase density', 'particle swarms', 'rhythm spacing'],
  },
  {
    runtime: 'bloom',
    ecological: 'bloom',
    affects: ['harmonic openness', 'velocity', 'hold duration', 'spatial width'],
  },
  {
    runtime: 'brightness',
    ecological: 'roots',
    affects: ['foundation weight', 'drone length', 'low-register events', 'hold scale'],
  },
  {
    runtime: 'mold',
    ecological: 'mold',
    affects: ['degradation', 'glitches', 'timing jitter', 'phrase mutation'],
  },
  {
    runtime: 'chaos',
    ecological: 'bacteria',
    affects: ['trigger probability', 'ornaments', 'micro-events', 'cluster bursts'],
  },
] as const;

/** Event kinds emitted by the engine generative scheduler. */
export const GENERATIVE_EVENT_KINDS = [
  'phrase',
  'chord',
  'drone',
  'ornament',
  'particle',
  'glitch',
  'silence',
] as const;

export type GenerativeEventKind = (typeof GENERATIVE_EVENT_KINDS)[number];

/** Resolves the ecological control targeted by a runtime performance slider. */
export function generativeTargetForControl(name: ControlName): EcologicalControl {
  return runtimeControlToEcological(name);
}
