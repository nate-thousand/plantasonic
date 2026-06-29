/**
 * Web MIDI input module — device discovery, hot-plug, and message routing.
 */

import type {
  DeviceConnectionState,
  InteractionModule,
  InteractionModuleContext,
} from '@/interaction/types.ts';
import { midiVelocityToRuntime } from '@/interaction/velocity.ts';
import { applyCcMapping, findCcMapping } from './midiMapping.ts';

const LOG_PREFIX = '[Midi]';

type MidiAccess = MIDIAccess;
type MidiInput = MIDIInput;

/** Global learn target setter injected by InteractionManager. */
export type MidiLearnBridge = {
  getLearnTarget: () => import('@/interaction/types.ts').MidiLearnTarget | null;
  completeLearn: (cc: number, channel: number) => void;
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
  private sustainPedal = false;
  private sustainedNotes = new Set<number>();

  async init(context: InteractionModuleContext): Promise<void> {
    this.context = context;
    this.unsubscribeSettings = context.onSettingsChange(() => {
      void this.syncEnabledState();
    });
    await this.syncEnabledState();
  }

  destroy(): Promise<void> {
    this.unsubscribeSettings?.();
    this.unsubscribeSettings = null;
    this.detachAllInputs();
    this.access = null;
    this.context = null;
    this.sustainedNotes.clear();
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

  private async syncEnabledState(): Promise<void> {
    const settings = this.context?.getSettings();
    if (!settings?.midiEnabled) {
      this.detachAllInputs();
      this.access = null;
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
      console.warn(`${LOG_PREFIX} access denied`, error);
    }
  }

  private refreshInputs(): void {
    if (!this.access) return;
    this.detachAllInputs();

    for (const input of this.access.inputs.values()) {
      this.attachInput(input);
    }
  }

  private attachInput(input: MidiInput): void {
    if (this.inputs.has(input.id)) return;
    input.onmidimessage = (event) => {
      this.handleMessage(event);
    };
    this.inputs.set(input.id, input);
    console.info(`${LOG_PREFIX} connected`, input.name ?? input.id);
  }

  private detachAllInputs(): void {
    for (const input of this.inputs.values()) {
      input.onmidimessage = null;
    }
    this.inputs.clear();
  }

  private handleMessage(event: MIDIMessageEvent): void {
    const context = this.context;
    if (!context || !event.data) return;

    const data = event.data;
    const status = data[0] ?? 0;
    const channel = (status & 0x0f) + 1;
    const settings = context.getSettings();

    if (settings.midiChannel !== 0 && settings.midiChannel !== channel) {
      return;
    }

    const command = status & 0xf0;

    if (command === 0x90) {
      const note = data[1] ?? 0;
      const velocity = data[2] ?? 0;
      if (velocity === 0) {
        this.releaseNote(note);
        return;
      }
      const vel = midiVelocityToRuntime(velocity, settings.velocityCurve);
      context.dispatch({
        action: { type: 'noteOn', note, velocity: vel },
        source: 'midi',
        timestamp: Date.now(),
      });
      return;
    }

    if (command === 0x80) {
      const note = data[1] ?? 0;
      this.releaseNote(note);
      return;
    }

    if (command === 0xb0) {
      const cc = data[1] ?? 0;
      const value = data[2] ?? 0;
      this.handleCc(cc, channel, value);
      return;
    }

    if (command === 0xe0) {
      const lsb = data[1] ?? 0;
      const msb = data[2] ?? 0;
      const bend = ((msb << 7) | lsb) / 16383;
      context.dispatch({
        action: { type: 'setControl', name: 'chaos', value: bend },
        source: 'midi',
        timestamp: Date.now(),
      });
    }
  }

  private handleCc(cc: number, channel: number, value: number): void {
    const context = this.context;
    if (!context) return;

    if (cc === 64) {
      this.sustainPedal = value >= 64;
      if (!this.sustainPedal) {
        for (const note of this.sustainedNotes) {
          context.dispatch({
            action: { type: 'noteOff', note },
            source: 'midi',
            timestamp: Date.now(),
          });
        }
        this.sustainedNotes.clear();
      }
      return;
    }

    const learnTarget = learnBridge?.getLearnTarget();
    if (learnTarget) {
      learnBridge?.completeLearn(cc, channel);
      return;
    }

    const mapping = findCcMapping(context.getSettings().midiLearnMappings, cc, channel);
    if (mapping) {
      applyCcMapping(context, mapping, value);
    }
  }

  private releaseNote(note: number): void {
    const context = this.context;
    if (!context) return;

    if (this.sustainPedal) {
      this.sustainedNotes.add(note);
      return;
    }

    context.dispatch({
      action: { type: 'noteOff', note },
      source: 'midi',
      timestamp: Date.now(),
    });
  }
}
