/**
 * Plantasonic runtime orchestrator.
 * The runtime is the only layer permitted to communicate with both engine adapters.
 * No engine logic lives here — only coordination, state, and lifecycle management.
 */

import type { SoundAdapter } from '@/audio/soundAdapter.ts';
import type { AsciiAdapter } from '@/visuals/asciiAdapter.ts';
import type { RuntimeConfig, RuntimeInitResult } from './types.ts';
import { eventBus } from './events.ts';
import { stateStore } from './state.ts';

export interface RuntimeDependencies {
  soundAdapter: SoundAdapter;
  asciiAdapter: AsciiAdapter;
}

/**
 * Central runtime coordinating UI, state, and engine adapters.
 * Scaffold only — adapter wiring will be completed during engine integration.
 */
export class Runtime {
  private readonly soundAdapter: SoundAdapter;
  private readonly asciiAdapter: AsciiAdapter;
  private initialized = false;

  constructor(deps: RuntimeDependencies) {
    this.soundAdapter = deps.soundAdapter;
    this.asciiAdapter = deps.asciiAdapter;
  }

  /** Initializes the runtime and transitions to ready phase. */
  async init(config: RuntimeConfig): Promise<RuntimeInitResult> {
    if (this.initialized) {
      return { success: false, error: new Error('Runtime already initialized') };
    }

    stateStore.patch({ transport: { phase: 'initializing' } });
    eventBus.emit('runtime:init', { container: config.container });

    try {
      await Promise.all([this.soundAdapter.init(), this.asciiAdapter.init()]);

      stateStore.patch({ transport: { phase: 'ready' } });
      eventBus.emit('runtime:ready', undefined);
      this.initialized = true;

      if (config.initialPresetId) {
        await this.loadPreset(config.initialPresetId);
      }

      return { success: true };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      stateStore.patch({ transport: { phase: 'error' } });
      eventBus.emit('error', { source: 'runtime:init', error: err });
      return { success: false, error: err };
    }
  }

  /** Starts both engines via their adapters. */
  async start(): Promise<void> {
    await Promise.all([this.soundAdapter.start(), this.asciiAdapter.start()]);
    stateStore.patch({ transport: { phase: 'running', isPlaying: true } });
    eventBus.emit('runtime:start', undefined);
  }

  /** Stops both engines via their adapters. */
  async stop(): Promise<void> {
    await Promise.all([this.soundAdapter.stop(), this.asciiAdapter.stop()]);
    stateStore.patch({ transport: { phase: 'stopped', isPlaying: false } });
    eventBus.emit('runtime:stop', undefined);
  }

  /** Loads a preset into both adapters atomically. */
  async loadPreset(presetId: string): Promise<void> {
    eventBus.emit('preset:load', { presetId });
    await Promise.all([
      this.soundAdapter.loadPreset(presetId),
      this.asciiAdapter.loadPreset(presetId),
    ]);
    stateStore.patch({ transport: { activePresetId: presetId } });
    eventBus.emit('preset:loaded', { presetId });
  }

  /** Sets a parameter on both adapters. */
  setParameter(path: string, value: number | string | boolean): void {
    this.soundAdapter.setParameter(path, value);
    this.asciiAdapter.setParameter(path, value);
    stateStore.patch({ parameters: { [path]: value } });
    eventBus.emit('parameter:set', { path, value });
  }

  /** Resizes the visual output area. */
  resize(width: number, height: number): void {
    this.asciiAdapter.resize(width, height);
    stateStore.patch({ viewport: { width, height } });
    eventBus.emit('viewport:resize', { width, height });
  }

  /** Tears down the runtime and releases resources. */
  async destroy(): Promise<void> {
    await Promise.all([this.soundAdapter.destroy(), this.asciiAdapter.destroy()]);
    eventBus.emit('runtime:destroy', undefined);
    eventBus.clear();
    this.initialized = false;
    stateStore.patch({ transport: { phase: 'idle', isPlaying: false, activePresetId: null } });
  }
}
