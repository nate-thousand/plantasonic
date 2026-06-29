/**
 * Plantasonic runtime orchestrator.
 * The only layer permitted to communicate with both engine adapters.
 */

import type { SoundAdapter } from '@/audio/soundAdapter.ts';
import type { AsciiAdapter } from '@/visuals/asciiAdapter.ts';
import { mergeWorldDefaults, resolvePresetWorld } from '@/presets/registry.ts';
import type {
  ControlName,
  RuntimeConfig,
  RuntimeInitResult,
  RuntimeState,
  Unsubscribe,
} from './types.ts';
import type { RuntimeSubscriber } from './types.ts';
import { StateStore } from './state.ts';
import { eventBus } from './events.ts';

/** Adapters that receive full state snapshots after each change. */
export interface StateSyncAdapter {
  applyState(state: Readonly<RuntimeState>): void;
}

export interface RuntimeDependencies {
  soundAdapter: SoundAdapter & StateSyncAdapter;
  asciiAdapter: AsciiAdapter & StateSyncAdapter;
}

export class Runtime {
  private readonly soundAdapter: SoundAdapter & StateSyncAdapter;
  private readonly asciiAdapter: AsciiAdapter & StateSyncAdapter;
  private readonly store = new StateStore();
  private initialized = false;

  constructor(deps: RuntimeDependencies) {
    this.soundAdapter = deps.soundAdapter;
    this.asciiAdapter = deps.asciiAdapter;
  }

  /** Initializes adapters and transitions to ready. */
  async init(config: RuntimeConfig): Promise<RuntimeInitResult> {
    if (this.initialized) {
      return { success: false, error: new Error('Runtime already initialized') };
    }

    eventBus.emit('runtime:init', { container: config.container });

    try {
      await Promise.all([this.soundAdapter.init(), this.asciiAdapter.init(config.container)]);
      this.initialized = true;
      eventBus.emit('runtime:ready', undefined);

      if (config.initialPresetId) {
        await this.setPreset(config.initialPresetId);
      } else {
        this.syncAdapters();
      }

      return { success: true };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      eventBus.emit('error', { source: 'runtime:init', error: err });
      return { success: false, error: err };
    }
  }

  /** Returns a snapshot of the current shared state. */
  getState(): Readonly<RuntimeState> {
    return this.store.getState();
  }

  /** Registers a state change subscriber. */
  subscribe(callback: RuntimeSubscriber): Unsubscribe {
    return this.store.subscribe(callback);
  }

  /** Starts both engine adapters. */
  async start(): Promise<void> {
    this.ensureInitialized();
    await Promise.all([this.soundAdapter.start(), this.asciiAdapter.start()]);
    this.store.commit({ isPlaying: true });
    eventBus.emit('runtime:start', undefined);
    this.syncAdapters();
  }

  /** Stops both engine adapters. */
  async stop(): Promise<void> {
    this.ensureInitialized();
    await Promise.all([this.soundAdapter.stop(), this.asciiAdapter.stop()]);
    this.store.commit({
      isPlaying: false,
      activeNotes: [],
      performance: { lastNote: null, velocity: 0, energy: 0, activity: 0 },
    });
    eventBus.emit('runtime:stop', undefined);
    this.syncAdapters();
  }

  /** Loads a preset world into both adapters and syncs runtime state. */
  async setPreset(presetId: string): Promise<void> {
    this.ensureInitialized();

    const world = resolvePresetWorld(presetId);
    if (!world) {
      const err = new Error(`Unknown preset world: ${presetId}`);
      eventBus.emit('error', { source: 'runtime:setPreset', error: err });
      throw err;
    }

    eventBus.emit('preset:load', { presetId: world.id });

    const soundResult = await this.soundAdapter.loadPreset(world.sound.presetId);
    if (soundResult === undefined) {
      const err = new Error(`Failed to load sound preset for world: ${world.id}`);
      eventBus.emit('error', { source: 'runtime:setPreset', error: err });
      throw err;
    }

    await this.asciiAdapter.loadPreset(world.visual.presetId, world.visual);

    const { controls, tempo } = mergeWorldDefaults(world, soundResult.controls);

    this.store.commit({
      preset: world.id,
      controls,
      tempo,
    });

    eventBus.emit('preset:loaded', { presetId: world.id });
    this.syncAdapters();
  }

  /** Triggers note-on through both adapters. */
  noteOn(note: number, velocity = 0.8): void {
    this.ensureInitialized();
    const state = this.store.getMutableState();
    if (!state.activeNotes.includes(note)) {
      state.activeNotes.push(note);
    }
    const energy = Math.min(1, velocity);
    const activity = Math.min(1, state.performance.activity + velocity * 0.15);
    this.store.commit({
      activeNotes: [...state.activeNotes],
      performance: {
        lastNote: note,
        velocity,
        energy,
        activity,
      },
    });
    this.soundAdapter.noteOn(note, velocity);
    this.asciiAdapter.setParameter('note', note);
    eventBus.emit('input:noteOn', { note, velocity });
    this.syncAdapters();
  }

  /** Triggers note-off through both adapters. */
  noteOff(note: number): void {
    this.ensureInitialized();
    const state = this.store.getMutableState();
    const activeNotes = state.activeNotes.filter((n) => n !== note);
    const activity = Math.max(0, state.performance.activity - 0.1);
    this.store.commit({
      activeNotes,
      performance: {
        ...state.performance,
        activity,
        lastNote: activeNotes.length > 0 ? (activeNotes.at(-1) ?? null) : null,
      },
    });
    this.soundAdapter.noteOff(note);
    this.asciiAdapter.setParameter('noteOff', note);
    eventBus.emit('input:noteOff', { note });
    this.syncAdapters();
  }

  /** Sets a named performance control (0–1). */
  setControl(name: ControlName, value: number): void {
    this.ensureInitialized();
    const clamped = Math.min(1, Math.max(0, value));
    this.store.commit({ controls: { [name]: clamped } });
    const path = `controls.${name}`;
    this.soundAdapter.setParameter(path, clamped);
    this.asciiAdapter.setParameter(path, clamped);
    eventBus.emit('control:set', { name, value: clamped });
    this.syncAdapters();
  }

  /** Sets transport tempo in BPM. */
  setTempo(bpm: number): void {
    this.ensureInitialized();
    const tempo = Math.min(300, Math.max(20, Math.round(bpm)));
    this.store.commit({ tempo });
    this.soundAdapter.setParameter('tempo', tempo);
    this.asciiAdapter.setParameter('tempo', tempo);
    eventBus.emit('tempo:set', { tempo });
    this.syncAdapters();
  }

  /** Resizes the visual output area. */
  resize(width: number, height: number): void {
    this.asciiAdapter.resize(width, height);
    eventBus.emit('viewport:resize', { width, height });
  }

  /** Tears down the runtime and releases resources. */
  async destroy(): Promise<void> {
    await Promise.all([this.soundAdapter.destroy(), this.asciiAdapter.destroy()]);
    this.store.reset();
    eventBus.emit('runtime:destroy', undefined);
    this.initialized = false;
  }

  private syncAdapters(): void {
    const state = this.store.getState();
    this.soundAdapter.applyState(state);
    this.asciiAdapter.applyState(state);
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('Runtime not initialized — call init() first');
    }
  }
}
