/**
 * Sound engine adapter — wraps Plantasia Sound Engine for the Plantasonic runtime.
 * UI and runtime never import the engine package directly except through this module.
 */

import {
  createPlantasiaEngine,
  resolvePresetToSpecies,
  type PlantasiaEngine,
} from 'plantasia-sound-engine';
import type {
  ControlName,
  ControlValues,
  ParameterPath,
  ParameterValue,
  PresetId,
} from '@/runtime/types.ts';
import type { RuntimeState } from '@/runtime/types.ts';
import { eventBus } from '@/runtime/events.ts';
import { DEFAULT_CONTROLS } from '@/runtime/types.ts';
import {
  ecologyToRuntimeControls,
  resolveEnginePresetId,
  runtimeControlToEcological,
} from './controlMapping.ts';
import { midiToNoteName } from './midiNote.ts';

const LOG_PREFIX = '[PlantasiaSound]';

/** Result returned when a preset loads successfully. */
export interface PresetLoadResult {
  controls: ControlValues;
}

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
  init(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  loadPreset(presetId: PresetId): Promise<PresetLoadResult | undefined>;
  noteOn(note: number, velocity?: number): void;
  noteOff(note: number): void;
  setParameter(path: ParameterPath, value: ParameterValue): void;
  destroy(): Promise<void>;
}

/** Adapters that receive full runtime state snapshots. */
export interface StateSyncSoundAdapter extends SoundAdapter {
  applyState(state: Readonly<RuntimeState>): void;
}

type ControlCache = Record<ControlName, number>;

function createControlCache(controls: ControlValues = DEFAULT_CONTROLS): ControlCache {
  return { ...controls };
}

/**
 * Production sound adapter — delegates to Plantasia Sound Engine v2 facade.
 */
export class PlantasiaSoundAdapter implements StateSyncSoundAdapter {
  private engine: PlantasiaEngine | null = null;
  private audioReady = false;
  private midiEnabled = false;
  private controlCache = createControlCache();
  private tempoCache = 72;
  private lastPresetId: PresetId | null = null;

  init(): Promise<void> {
    try {
      this.engine = createPlantasiaEngine();
      this.tempoCache = 72;
      console.info(`${LOG_PREFIX} engine created`);
      return Promise.resolve();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.reportError('init', err);
      return Promise.reject(err);
    }
  }

  async start(): Promise<void> {
    const engine = this.requireEngine();
    try {
      if (!this.audioReady) {
        await engine.initialize();
        this.audioReady = true;
        console.info(`${LOG_PREFIX} audio context initialized`);
      }
      if (engine.getCurrentSpecies() === null) {
        await engine.loadDefaultSpecies();
        console.info(`${LOG_PREFIX} default species loaded`);
      }
      await engine.start();
      await this.tryEnableMidi(engine);
    } catch (error) {
      this.reportError('start', error);
      throw error;
    }
  }

  stop(): Promise<void> {
    const engine = this.engine;
    if (!engine) return Promise.resolve();
    try {
      engine.allNotesOff();
      engine.stopSpecies();
    } catch (error) {
      this.reportError('stop', error);
    }
    return Promise.resolve();
  }

  async loadPreset(presetId: PresetId): Promise<PresetLoadResult | undefined> {
    const engine = this.requireEngine();
    const enginePresetId = resolveEnginePresetId(presetId);

    try {
      const resolution = resolvePresetToSpecies(enginePresetId);
      await engine.loadPreset(enginePresetId);
      const controls = ecologyToRuntimeControls(resolution.ecology);
      this.controlCache = createControlCache(controls);
      this.lastPresetId = presetId;
      console.info(`${LOG_PREFIX} loadPreset`, {
        presetId,
        enginePresetId,
        species: resolution.speciesId,
      });
      return { controls };
    } catch (error) {
      this.reportError('loadPreset', error, { presetId, enginePresetId });
      return undefined;
    }
  }

  noteOn(note: number, velocity = 0.8): void {
    const engine = this.engine;
    if (!engine || engine.getState() !== 'running') return;
    try {
      const clampedVelocity = Math.min(1, Math.max(0, velocity));
      engine.noteOn(midiToNoteName(note), clampedVelocity);
    } catch (error) {
      this.reportError('noteOn', error, { note, velocity });
    }
  }

  noteOff(note: number): void {
    const engine = this.engine;
    if (!engine) return;
    try {
      engine.noteOff(midiToNoteName(note));
    } catch (error) {
      this.reportError('noteOff', error, { note });
    }
  }

  setParameter(path: ParameterPath, value: ParameterValue): void {
    const engine = this.engine;
    if (!engine || typeof value !== 'number') return;

    try {
      if (path === 'tempo') {
        this.applyTempo(engine, value);
        return;
      }

      const controlMatch = /^controls\.(\w+)$/.exec(path);
      if (controlMatch?.[1]) {
        const name = controlMatch[1] as ControlName;
        if (name in DEFAULT_CONTROLS) {
          this.applyControl(engine, name, value);
        }
      }
    } catch (error) {
      this.reportError('setParameter', error, { path, value });
    }
  }

  applyState(state: Readonly<RuntimeState>): void {
    const engine = this.engine;
    if (!engine) return;

    for (const name of Object.keys(DEFAULT_CONTROLS) as ControlName[]) {
      const value = state.controls[name];
      if (this.controlCache[name] !== value) {
        this.applyControl(engine, name, value);
      }
    }

    if (this.tempoCache !== state.tempo) {
      this.applyTempo(engine, state.tempo);
    }

    if (state.preset !== this.lastPresetId && state.preset !== null) {
      this.lastPresetId = state.preset;
    }
  }

  destroy(): Promise<void> {
    const engine = this.engine;
    if (!engine) return Promise.resolve();
    try {
      engine.dispose();
    } catch (error) {
      this.reportError('destroy', error);
    } finally {
      this.engine = null;
      this.audioReady = false;
      this.midiEnabled = false;
      this.controlCache = createControlCache();
      this.lastPresetId = null;
    }
    return Promise.resolve();
  }

  private requireEngine(): PlantasiaEngine {
    if (!this.engine) {
      throw new Error('PlantasiaSoundAdapter not initialized — call init() first');
    }
    return this.engine;
  }

  private applyControl(engine: PlantasiaEngine, name: ControlName, value: number): void {
    const clamped = Math.min(1, Math.max(0, value));
    if (this.controlCache[name] === clamped) return;
    engine.setControl(runtimeControlToEcological(name), clamped);
    this.controlCache[name] = clamped;
  }

  private applyTempo(engine: PlantasiaEngine, bpm: number): void {
    const tempo = Math.min(300, Math.max(20, Math.round(bpm)));
    if (this.tempoCache === tempo) return;
    engine.setTempo(tempo);
    this.tempoCache = tempo;
  }

  private async tryEnableMidi(engine: PlantasiaEngine): Promise<void> {
    if (this.midiEnabled) return;
    try {
      const connected = await engine.enableMidi();
      this.midiEnabled = connected;
      if (connected) {
        console.info(`${LOG_PREFIX} Web MIDI enabled`);
      }
    } catch (error) {
      this.reportError('enableMidi', error);
    }
  }

  private reportError(source: string, error: unknown, context?: Record<string, unknown>): void {
    const err = error instanceof Error ? error : new Error(String(error));
    console.warn(`${LOG_PREFIX} ${source}:`, err.message, context ?? '');
    eventBus.emit('error', { source: `soundAdapter:${source}`, error: err });
  }
}

/**
 * No-op adapter retained for tests and ASCII-only development.
 */
export class NullSoundAdapter implements StateSyncSoundAdapter {
  applyState(_state: Readonly<RuntimeState>): void {
    /* no-op */
  }

  async init(): Promise<void> {
    /* no-op */
  }

  async start(): Promise<void> {
    /* no-op */
  }

  async stop(): Promise<void> {
    /* no-op */
  }

  loadPreset(_presetId: PresetId): Promise<undefined> {
    return Promise.resolve(undefined);
  }

  noteOn(_note: number, _velocity?: number): void {
    /* no-op */
  }

  noteOff(_note: number): void {
    /* no-op */
  }

  setParameter(_path: ParameterPath, _value: ParameterValue): void {
    /* no-op */
  }

  async destroy(): Promise<void> {
    /* no-op */
  }
}
