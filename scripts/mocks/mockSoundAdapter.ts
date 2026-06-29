/**
 * Mock sound adapter for runtime verification scripts only — not used in production.
 */

import type { PresetLoadResult, StateSyncSoundAdapter } from '../../src/audio/soundAdapter.ts';
import type { ParameterPath, ParameterValue, PresetId } from '../../src/runtime/types.ts';
import type { RuntimeState } from '../../src/runtime/types.ts';
import { DEFAULT_CONTROLS } from '../../src/runtime/types.ts';

const LOG_PREFIX = '[MockSound]';

export class MockSoundAdapter implements StateSyncSoundAdapter {
  private lastState: Readonly<RuntimeState> | null = null;
  private startCallCount = 0;
  private setParameterCallCount = 0;
  private applyStateCallCount = 0;

  async init(): Promise<void> {
    await Promise.resolve();
    console.info(`${LOG_PREFIX} init`);
  }

  async start(): Promise<void> {
    this.startCallCount += 1;
    await Promise.resolve();
    console.info(`${LOG_PREFIX} start`);
  }

  async stop(): Promise<void> {
    await Promise.resolve();
    console.info(`${LOG_PREFIX} stop`);
  }

  async loadPreset(presetId: PresetId): Promise<PresetLoadResult> {
    await Promise.resolve();
    console.info(`${LOG_PREFIX} loadPreset`, presetId);
    return { controls: { ...DEFAULT_CONTROLS } };
  }

  noteOn(note: number, velocity = 0.8): void {
    console.info(`${LOG_PREFIX} noteOn`, { note, velocity });
  }

  noteOff(note: number): void {
    console.info(`${LOG_PREFIX} noteOff`, { note });
  }

  setParameter(path: ParameterPath, value: ParameterValue): void {
    this.setParameterCallCount += 1;
    console.info(`${LOG_PREFIX} setParameter`, { path, value });
  }

  applyState(state: Readonly<RuntimeState>): void {
    this.applyStateCallCount += 1;
    this.lastState = state;
    console.info(`${LOG_PREFIX} applyState`, {
      isPlaying: state.isPlaying,
      preset: state.preset,
      activeNotes: state.activeNotes.length,
      tempo: state.tempo,
      controls: state.controls,
    });
  }

  getLastState(): Readonly<RuntimeState> | null {
    return this.lastState;
  }

  getStartCallCount(): number {
    return this.startCallCount;
  }

  getSetParameterCallCount(): number {
    return this.setParameterCallCount;
  }

  getApplyStateCallCount(): number {
    return this.applyStateCallCount;
  }

  async destroy(): Promise<void> {
    await Promise.resolve();
    console.info(`${LOG_PREFIX} destroy`);
    this.lastState = null;
    this.startCallCount = 0;
    this.setParameterCallCount = 0;
    this.applyStateCallCount = 0;
  }
}
