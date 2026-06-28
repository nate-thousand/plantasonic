/**
 * Sound engine adapter interface.
 * Adapters wrap the external Plantasia Sound Engine and expose a stable contract
 * to the Plantasonic runtime. No audio generation occurs in this layer.
 */

import type { ParameterPath, ParameterValue, PresetId } from '@/runtime/types.ts';

/** Contract implemented by the Plantasia Sound Engine (external package). */
export interface SoundEngineContract {
  start(): Promise<void>;
  stop(): Promise<void>;
  loadPreset(presetId: PresetId): Promise<void>;
  noteOn(note: number, velocity?: number): void;
  noteOff(note: number): void;
  setParameter(path: ParameterPath, value: ParameterValue): void;
}

/**
 * Adapter boundary between Plantasonic runtime and the sound engine.
 * The runtime communicates exclusively through this interface.
 */
export interface SoundAdapter {
  /** Prepares the adapter and underlying engine resources. */
  init(): Promise<void>;

  /** Starts audio output. */
  start(): Promise<void>;

  /** Stops audio output. */
  stop(): Promise<void>;

  /** Loads a sound preset by identifier. */
  loadPreset(presetId: PresetId): Promise<void>;

  /** Triggers a note-on event. */
  noteOn(note: number, velocity?: number): void;

  /** Triggers a note-off event. */
  noteOff(note: number): void;

  /** Sets a sound engine parameter. */
  setParameter(path: ParameterPath, value: ParameterValue): void;

  /** Releases adapter resources. */
  destroy(): Promise<void>;
}

/**
 * No-op adapter scaffold for development before engine integration.
 * Implements the interface without producing sound.
 */
export class NullSoundAdapter implements SoundAdapter {
  async init(): Promise<void> {
    /* Engine integration point */
  }

  async start(): Promise<void> {
    /* Engine integration point */
  }

  async stop(): Promise<void> {
    /* Engine integration point */
  }

  async loadPreset(_presetId: PresetId): Promise<void> {
    /* Engine integration point */
  }

  noteOn(_note: number, _velocity?: number): void {
    /* Engine integration point */
  }

  noteOff(_note: number): void {
    /* Engine integration point */
  }

  setParameter(_path: ParameterPath, _value: ParameterValue): void {
    /* Engine integration point */
  }

  async destroy(): Promise<void> {
    /* Engine integration point */
  }
}
