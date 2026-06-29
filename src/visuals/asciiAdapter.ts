/**
 * ASCII visual engine adapter interface.
 * Adapters wrap the external Plantasia ASCII Engine and expose a stable contract
 * to the Plantasonic runtime. No rendering occurs in this layer.
 */

import type { ParameterPath, ParameterValue, PresetId } from '@/runtime/types.ts';

/** Contract implemented by the Plantasia ASCII Engine (external package). */
export interface AsciiEngineContract {
  start(): Promise<void>;
  stop(): Promise<void>;
  render(): void;
  resize(width: number, height: number): void;
  loadPreset(presetId: PresetId): Promise<void>;
  setParameter(path: ParameterPath, value: ParameterValue): void;
}

/**
 * Adapter boundary between Plantasonic runtime and the ASCII engine.
 * The runtime communicates exclusively through this interface.
 */
export interface AsciiAdapter {
  /** Prepares the adapter and underlying engine resources. */
  init(mount?: HTMLElement): Promise<void>;

  /** Starts the render loop. */
  start(): Promise<void>;

  /** Stops the render loop. */
  stop(): Promise<void>;

  /** Renders a single frame (called by runtime or rAF loop). */
  render(): void;

  /** Resizes the render surface. */
  resize(width: number, height: number): void;

  /** Loads a visual preset by identifier. */
  loadPreset(presetId: PresetId): Promise<void>;

  /** Sets a visual engine parameter. */
  setParameter(path: ParameterPath, value: ParameterValue): void;

  /** Releases adapter resources. */
  destroy(): Promise<void>;
}

/**
 * No-op adapter scaffold for development before engine integration.
 * Implements the interface without producing visuals.
 */
export class NullAsciiAdapter implements AsciiAdapter {
  async init(_mount?: HTMLElement): Promise<void> {
    /* Engine integration point */
  }

  async start(): Promise<void> {
    /* Engine integration point */
  }

  async stop(): Promise<void> {
    /* Engine integration point */
  }

  render(): void {
    /* Engine integration point */
  }

  resize(_width: number, _height: number): void {
    /* Engine integration point */
  }

  async loadPreset(_presetId: PresetId): Promise<void> {
    /* Engine integration point */
  }

  setParameter(_path: ParameterPath, _value: ParameterValue): void {
    /* Engine integration point */
  }

  async destroy(): Promise<void> {
    /* Engine integration point */
  }
}
