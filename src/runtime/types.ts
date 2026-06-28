/**
 * Core runtime type definitions for Plantasonic.
 * These types describe shared state, lifecycle, and engine contracts
 * without embedding any engine implementation.
 */

/** Unique identifier for a preset world. */
export type PresetId = string;

/** Parameter path using dot notation (e.g. "osc.frequency"). */
export type ParameterPath = string;

/** Supported parameter value types across both engines. */
export type ParameterValue = number | string | boolean;

/** Application lifecycle phases. */
export type RuntimePhase = 'idle' | 'initializing' | 'ready' | 'running' | 'stopped' | 'error';

/** High-level transport state shared across UI and engines. */
export interface TransportState {
  phase: RuntimePhase;
  isPlaying: boolean;
  activePresetId: PresetId | null;
}

/** Viewport dimensions for visual engine resize coordination. */
export interface ViewportState {
  width: number;
  height: number;
  devicePixelRatio: number;
  isFullscreen: boolean;
}

/** Performance-related flags for future optimization controls. */
export interface PerformanceState {
  targetFrameRate: number;
  audioLatencyHint: 'interactive' | 'balanced' | 'playback';
  reducedMotion: boolean;
}

/** Root application state managed by the runtime. */
export interface AppState {
  transport: TransportState;
  viewport: ViewportState;
  performance: PerformanceState;
  parameters: Record<ParameterPath, ParameterValue>;
}

/** Partial update payload for immutable state merges. */
export type AppStatePatch = {
  transport?: Partial<TransportState>;
  viewport?: Partial<ViewportState>;
  performance?: Partial<PerformanceState>;
  parameters?: Record<ParameterPath, ParameterValue>;
};

/** Subscription callback invoked when state changes. */
export type StateSubscriber = (state: Readonly<AppState>, patch: AppStatePatch) => void;

/** Unsubscribe function returned from subscription registration. */
export type Unsubscribe = () => void;

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
