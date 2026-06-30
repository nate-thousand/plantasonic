/**
 * Central interaction manager — registers modules, normalizes events, dispatches to runtime.
 */

import type { Runtime } from '@/runtime/runtime.ts';
import type { ControlName, PresetId, RuntimeState, Unsubscribe } from '@/runtime/types.ts';
import type { RuntimeSubscriber } from '@/runtime/types.ts';
import type { SettingsStore, InteractionSettings } from '@/services/settingsStore.ts';
import { InputRouter } from './inputRouter.ts';
import type {
  DeviceConnectionState,
  InteractionEvent,
  InteractionModule,
  InteractionModuleContext,
  InteractionSettingsSnapshot,
  InteractionSource,
  MidiLearnMapping,
  MidiLearnTarget,
} from './types.ts';

const LOG_PREFIX = '[Interaction]';

/** Central coordinator for all input modules. */
export class InteractionManager {
  private readonly router: InputRouter;
  private readonly modules = new Map<InteractionSource, InteractionModule>();
  private learnTarget: MidiLearnTarget | null = null;
  private initialized = false;

  constructor(
    private readonly runtime: Runtime,
    private readonly settings: SettingsStore,
  ) {
    this.router = new InputRouter(runtime);
  }

  /** Registers an input module (keyboard, midi, mouse, touch). */
  register(module: InteractionModule): void {
    this.modules.set(module.id, module);
  }

  /** Initializes all registered modules. */
  async init(): Promise<void> {
    if (this.initialized) return;
    const context = this.createModuleContext();
    for (const module of this.modules.values()) {
      await module.init(context);
    }
    this.initialized = true;
    console.info(`${LOG_PREFIX} initialized`, { modules: [...this.modules.keys()] });
  }

  /** Tears down all registered modules. */
  async destroy(): Promise<void> {
    for (const module of this.modules.values()) {
      await module.destroy();
    }
    this.modules.clear();
    this.initialized = false;
    this.learnTarget = null;
  }

  /** Dispatches a normalized interaction event. */
  dispatch(event: InteractionEvent): void {
    this.router.route(event);
  }

  /** Convenience dispatch with current timestamp. */
  emit(action: InteractionEvent['action'], source: InteractionSource): void {
    this.dispatch({ action, source, timestamp: Date.now() });
  }

  start(source: InteractionSource = 'ui'): void {
    this.emit({ type: 'start' }, source);
  }

  stop(source: InteractionSource = 'ui'): void {
    this.emit({ type: 'stop' }, source);
  }

  noteOn(note: number, velocity: number, source: InteractionSource = 'ui'): void {
    this.emit({ type: 'noteOn', note, velocity }, source);
  }

  noteOff(note: number, source: InteractionSource = 'ui'): void {
    this.emit({ type: 'noteOff', note }, source);
  }

  setControl(name: ControlName, value: number, source: InteractionSource = 'ui'): void {
    this.emit({ type: 'setControl', name, value }, source);
  }

  setPreset(presetId: PresetId, source: InteractionSource = 'ui'): void {
    this.emit({ type: 'setPreset', presetId }, source);
  }

  setTempo(tempo: number, source: InteractionSource = 'ui'): void {
    this.emit({ type: 'setTempo', tempo }, source);
  }

  getState(): Readonly<RuntimeState> {
    return this.runtime.getState();
  }

  subscribe(callback: RuntimeSubscriber): Unsubscribe {
    return this.runtime.subscribe(callback);
  }

  getSettings(): Readonly<InteractionSettingsSnapshot> {
    return this.settings.getSettings();
  }

  updateSettings(patch: Parameters<SettingsStore['update']>[0]): void {
    this.settings.update(patch);
  }

  onSettingsChange(callback: () => void): Unsubscribe {
    return this.settings.subscribe(() => {
      callback();
    });
  }

  /** Starts MIDI Learn for a runtime target. */
  startMidiLearn(target: MidiLearnTarget): void {
    this.learnTarget = target;
    console.info(`${LOG_PREFIX} MIDI Learn started`, target);
  }

  /** Cancels active MIDI Learn session. */
  cancelMidiLearn(): void {
    this.learnTarget = null;
  }

  /** Returns active MIDI Learn target, if any. */
  getLearnTarget(): MidiLearnTarget | null {
    return this.learnTarget;
  }

  /** Records a CC mapping during learn mode and persists it. */
  completeMidiLearn(cc: number, channel: number): MidiLearnMapping | null {
    if (!this.learnTarget) return null;
    const mapping: MidiLearnMapping = {
      id: `${String(channel)}:${String(cc)}:${this.learnTarget.type}`,
      cc,
      channel,
      target: this.learnTarget,
    };
    this.settings.addMidiLearnMapping(mapping);
    this.learnTarget = null;
    console.info(`${LOG_PREFIX} MIDI Learn saved`, mapping);
    return mapping;
  }

  getMidiLearnMappings(): readonly MidiLearnMapping[] {
    return this.settings.getSettings().midiLearnMappings;
  }

  resetMidiLearnMappings(): void {
    this.settings.resetMidiLearnMappings();
  }

  getConnectionStates(): Partial<Record<InteractionSource, DeviceConnectionState>> {
    const states: Partial<Record<InteractionSource, DeviceConnectionState>> = {};
    for (const [id, module] of this.modules) {
      if (module.getConnectionState) {
        states[id] = module.getConnectionState();
      }
    }
    return states;
  }

  private createModuleContext(): InteractionModuleContext {
    return {
      dispatch: (event) => {
        this.dispatch(event);
      },
      getSettings: () => this.settings.getSettings(),
      isPlaying: () => this.runtime.getState().isPlaying,
      onSettingsChange: (listener) =>
        this.settings.subscribe(() => {
          listener();
        }),
      updateSettings: (patch) => {
        this.settings.update(patch as Partial<InteractionSettings>);
      },
    };
  }
}
