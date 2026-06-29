/**
 * Mock ASCII adapter — logs state changes, no rendering.
 * Used by scripts/verify-runtime.ts only.
 */

import type { AsciiAdapter } from '../../src/visuals/asciiAdapter.ts';
import type { ParameterPath, ParameterValue, PresetId } from '../../src/runtime/types.ts';
import type { RuntimeState } from '../../src/runtime/types.ts';

const LOG_PREFIX = '[MockAscii]';

export class MockAsciiAdapter implements AsciiAdapter {
  private lastState: Readonly<RuntimeState> | null = null;
  private setParameterCalls = 0;

  async init(_mount?: HTMLElement): Promise<void> {
    await Promise.resolve();
    console.info(`${LOG_PREFIX} init`);
  }

  async start(): Promise<void> {
    await Promise.resolve();
    console.info(`${LOG_PREFIX} start`);
  }

  async stop(): Promise<void> {
    await Promise.resolve();
    console.info(`${LOG_PREFIX} stop`);
  }

  render(): void {
    /* Render loop owned by engine — no-op for mock */
  }

  resize(width: number, height: number): void {
    console.info(`${LOG_PREFIX} resize`, { width, height });
  }

  async loadPreset(presetId: PresetId, visual?: import('@/presets/types.ts').PresetVisualConfig): Promise<void> {
    await Promise.resolve();
    console.info(`${LOG_PREFIX} loadPreset`, presetId, visual?.motion);
  }

  setParameter(path: ParameterPath, value: ParameterValue): void {
    this.setParameterCalls += 1;
    console.info(`${LOG_PREFIX} setParameter`, { path, value });
  }

  getSetParameterCallCount(): number {
    return this.setParameterCalls;
  }

  applyState(state: Readonly<RuntimeState>): void {
    this.lastState = state;
    console.info(`${LOG_PREFIX} applyState`, {
      isPlaying: state.isPlaying,
      preset: state.preset,
      activeNotes: state.activeNotes.length,
      tempo: state.tempo,
      performance: state.performance,
    });
  }

  /** Returns the last state snapshot received (for testing). */
  getLastState(): Readonly<RuntimeState> | null {
    return this.lastState;
  }

  async destroy(): Promise<void> {
    await Promise.resolve();
    console.info(`${LOG_PREFIX} destroy`);
    this.lastState = null;
  }
}
