/**
 * Web MIDI input module — device discovery, hot-plug, and message routing.
 */

import type {
  DeviceConnectionState,
  InteractionModule,
  InteractionModuleContext,
} from '@/interaction/types.ts';
import { eventBus } from '@/runtime/events.ts';
import {
  parseMidiMessage,
  routeParsedMidiMessage,
  type MidiMessageRouterState,
} from './midiMessage.ts';

const LOG_PREFIX = '[Midi]';

type MidiAccess = MIDIAccess;
type MidiInput = MIDIInput;

/** Global learn target setter injected by InteractionManager. */
export type MidiLearnBridge = {
  getLearnTarget: () => import('@/interaction/types.ts').MidiLearnTarget | null;
  completeLearn: (
    cc: number,
    channel: number,
  ) => import('@/interaction/types.ts').MidiLearnMapping | null;
};

let learnBridge: MidiLearnBridge | null = null;

/** Connects MIDI Learn callbacks from the interaction manager. */
export function setMidiLearnBridge(bridge: MidiLearnBridge | null): void {
  learnBridge = bridge;
}

/** Web MIDI input module. */
export class MidiModule implements InteractionModule {
  readonly id = 'midi' as const;

  private context: InteractionModuleContext | null = null;
  private access: MidiAccess | null = null;
  private inputs = new Map<string, MidiInput>();
  private unsubscribeSettings: (() => void) | null = null;
  private routerState: MidiMessageRouterState = {
    sustainPedal: false,
    sustainedNotes: new Set<number>(),
  };

  init(context: InteractionModuleContext): Promise<void> {
    this.context = context;
    this.unsubscribeSettings = context.onSettingsChange(() => {
      void this.syncEnabledState();
    });
    return this.syncEnabledState();
  }

  destroy(): Promise<void> {
    this.unsubscribeSettings?.();
    this.unsubscribeSettings = null;
    this.detachAllInputs();
    this.access = null;
    this.context = null;
    this.routerState.sustainedNotes.clear();
    this.routerState.sustainPedal = false;
    return Promise.resolve();
  }

  getConnectionState(): DeviceConnectionState {
    const labels = [...this.inputs.values()].map((i) => i.name ?? 'MIDI Input');
    if (this.inputs.size === 0) {
      return { connected: false, deviceCount: 0 };
    }
    return {
      connected: true,
      deviceCount: this.inputs.size,
      label: labels.join(', '),
    };
  }

  /** Handles a raw MIDI message (used by Web MIDI and verification scripts). */
  handleRawMessage(data: Uint8Array | readonly number[]): void {
    const context = this.context;
    if (!context) return;

    const parsed = parseMidiMessage(data);
    if (!parsed) return;

    const settings = context.getSettings();
    routeParsedMidiMessage(parsed, {
      context,
      channelFilter: settings.midiChannel,
      velocityCurve: settings.velocityCurve,
      learnTarget: learnBridge?.getLearnTarget() ?? null,
      completeLearn: (cc, channel) => learnBridge?.completeLearn(cc, channel) ?? null,
      state: this.routerState,
    });
  }

  private async syncEnabledState(): Promise<void> {
    const settings = this.context?.getSettings();
    if (!settings?.midiEnabled) {
      this.detachAllInputs();
      this.access = null;
      this.emitConnectionChange();
      return;
    }
    await this.ensureAccess();
  }

  private async ensureAccess(): Promise<void> {
    if (typeof navigator.requestMIDIAccess !== 'function') {
      console.info(`${LOG_PREFIX} Web MIDI not supported in this browser`);
      return;
    }
    if (this.access) return;

    try {
      this.access = await navigator.requestMIDIAccess({ sysex: false });
      this.access.onstatechange = () => {
        this.refreshInputs();
      };
      this.refreshInputs();
      console.info(`${LOG_PREFIX} access granted`, { inputs: this.inputs.size });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.warn(`${LOG_PREFIX} access denied`, err);
      eventBus.emit('error', { source: 'midi:access', error: err });
    }
  }

  private refreshInputs(): void {
    if (!this.access) return;
    this.detachAllInputs();

    for (const input of this.access.inputs.values()) {
      this.attachInput(input);
    }
    this.emitConnectionChange();
  }

  private attachInput(input: MidiInput): void {
    if (this.inputs.has(input.id)) return;
    input.onmidimessage = (event) => {
      if (event.data) {
        this.handleRawMessage(event.data);
      }
    };
    this.inputs.set(input.id, input);
    console.info(`${LOG_PREFIX} connected`, input.name ?? input.id);
    this.emitConnectionChange();
  }

  private detachAllInputs(): void {
    if (this.inputs.size > 0) {
      for (const input of this.inputs.values()) {
        input.onmidimessage = null;
      }
      this.inputs.clear();
    }
  }

  private emitConnectionChange(): void {
    const state = this.getConnectionState();
    eventBus.emit('midi:connection', state);
  }
}
