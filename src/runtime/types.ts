/**
 * Core runtime type definitions for Plantasonic.
 */

import { DEFAULT_TEMPO } from './performanceParams.ts';

/** Unique identifier for a preset world. */
export type PresetId = string;

/** Parameter path using dot notation (e.g. "controls.bloom"). */
export type ParameterPath = string;

/** Supported parameter value types across both engines. */
export type ParameterValue = number | string | boolean;

/** Named performance controls synced to both engines. */
export type ControlName = 'bloom' | 'mold' | 'density' | 'chaos' | 'brightness';

/** Performance control values (0–1). */
export type ControlValues = Record<ControlName, number>;

/** Live performance metrics derived from input activity. */
export interface PerformanceMetrics {
  lastNote: number | null;
  velocity: number;
  energy: number;
  activity: number;
}

/** Shared runtime state consumed by UI and adapters. */
export interface RuntimeState {
  isPlaying: boolean;
  preset: PresetId | null;
  activeNotes: number[];
  tempo: number;
  controls: ControlValues;
  performance: PerformanceMetrics;
}

/** Partial runtime state update. */
export type RuntimeStatePatch = {
  isPlaying?: boolean;
  preset?: PresetId | null;
  activeNotes?: number[];
  tempo?: number;
  controls?: Partial<ControlValues>;
  performance?: Partial<PerformanceMetrics>;
};

/** Subscription callback invoked when runtime state changes. */
export type RuntimeSubscriber = (state: Readonly<RuntimeState>) => void;

/** Unsubscribe function returned from subscription registration. */
export type Unsubscribe = () => void;

/** Application lifecycle phases (internal). */
export type RuntimePhase = 'idle' | 'initializing' | 'ready' | 'running' | 'stopped' | 'error';

/** Runtime configuration passed during initialization. */
export interface RuntimeConfig {
  container: HTMLElement;
  initialPresetId?: PresetId;
}

/** Result of runtime initialization. */
export interface RuntimeInitResult {
  success: boolean;
  error?: Error;
}

/** Default control values. */
export const DEFAULT_CONTROLS: ControlValues = {
  bloom: 0.5,
  mold: 0.5,
  density: 0.5,
  chaos: 0.25,
  brightness: 0.5,
};

/** Creates the initial runtime state snapshot. */
export function createInitialRuntimeState(): RuntimeState {
  return {
    isPlaying: false,
    preset: null,
    activeNotes: [],
    tempo: DEFAULT_TEMPO,
    controls: { ...DEFAULT_CONTROLS },
    performance: {
      lastNote: null,
      velocity: 0,
      energy: 0,
      activity: 0,
    },
  };
}
