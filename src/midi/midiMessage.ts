/**
 * Pure MIDI message parsing and routing helpers (testable without Web MIDI).
 */

import type {
  InteractionModuleContext,
  MidiLearnMapping,
  MidiLearnTarget,
  VelocityCurve,
} from '@/interaction/types.ts';
import { midiVelocityToRuntime } from '@/interaction/velocity.ts';
import { applyCcMapping, findCcMapping } from './midiMapping.ts';

export type ParsedMidiMessage =
  | { type: 'noteOn'; channel: number; note: number; velocity: number }
  | { type: 'noteOff'; channel: number; note: number }
  | { type: 'cc'; channel: number; cc: number; value: number }
  | { type: 'pitchBend'; channel: number; value: number };

/** Parses a raw MIDI message into a normalized event. */
export function parseMidiMessage(data: Uint8Array | readonly number[]): ParsedMidiMessage | null {
  if (data.length < 2) return null;

  const status = data[0] ?? 0;
  const channel = (status & 0x0f) + 1;
  const command = status & 0xf0;

  if (command === 0x90) {
    const note = data[1] ?? 0;
    const velocity = data[2] ?? 0;
    if (velocity === 0) {
      return { type: 'noteOff', channel, note };
    }
    return { type: 'noteOn', channel, note, velocity };
  }

  if (command === 0x80) {
    return { type: 'noteOff', channel, note: data[1] ?? 0 };
  }

  if (command === 0xb0 && data.length >= 3) {
    return { type: 'cc', channel, cc: data[1] ?? 0, value: data[2] ?? 0 };
  }

  if (command === 0xe0 && data.length >= 3) {
    const lsb = data[1] ?? 0;
    const msb = data[2] ?? 0;
    return { type: 'pitchBend', channel, value: (msb << 7) | lsb };
  }

  return null;
}

/** Maps 14-bit pitch bend (0–16383, center ≈8192) to a 0–1 brightness control. */
export function pitchBendToBrightness(bend14: number): number {
  const clamped = Math.min(16383, Math.max(0, bend14));
  return clamped / 16383;
}

export interface MidiMessageRouterState {
  sustainPedal: boolean;
  sustainedNotes: Set<number>;
}

export interface MidiMessageRouterOptions {
  context: InteractionModuleContext;
  channelFilter: number;
  velocityCurve: VelocityCurve;
  learnTarget: MidiLearnTarget | null;
  completeLearn: (cc: number, channel: number) => MidiLearnMapping | null;
  state: MidiMessageRouterState;
}

/** Routes a parsed MIDI message through the interaction layer. */
export function routeParsedMidiMessage(
  message: ParsedMidiMessage,
  options: MidiMessageRouterOptions,
): void {
  const { context, channelFilter, velocityCurve, learnTarget, completeLearn, state } = options;

  if (channelFilter !== 0 && channelFilter !== message.channel) {
    return;
  }

  switch (message.type) {
    case 'noteOn': {
      const velocity = midiVelocityToRuntime(message.velocity, velocityCurve);
      context.dispatch({
        action: { type: 'noteOn', note: message.note, velocity },
        source: 'midi',
        timestamp: Date.now(),
      });
      break;
    }
    case 'noteOff':
      releaseMidiNote(context, message.note, state);
      break;
    case 'pitchBend':
      context.dispatch({
        action: {
          type: 'setControl',
          name: 'brightness',
          value: pitchBendToBrightness(message.value),
        },
        source: 'midi',
        timestamp: Date.now(),
      });
      break;
    case 'cc':
      handleCcMessage(context, message.cc, message.channel, message.value, {
        learnTarget,
        completeLearn,
        state,
      });
      break;
  }
}

function handleCcMessage(
  context: InteractionModuleContext,
  cc: number,
  channel: number,
  value: number,
  options: Pick<MidiMessageRouterOptions, 'learnTarget' | 'completeLearn' | 'state'>,
): void {
  const { learnTarget, completeLearn, state } = options;

  if (cc === 64) {
    state.sustainPedal = value >= 64;
    if (!state.sustainPedal) {
      for (const note of state.sustainedNotes) {
        context.dispatch({
          action: { type: 'noteOff', note },
          source: 'midi',
          timestamp: Date.now(),
        });
      }
      state.sustainedNotes.clear();
    }
    return;
  }

  if (learnTarget) {
    const mapping = completeLearn(cc, channel);
    if (mapping) {
      applyCcMapping(context, mapping, value);
    }
    return;
  }

  const mapping = findCcMapping(context.getSettings().midiLearnMappings, cc, channel);
  if (mapping) {
    applyCcMapping(context, mapping, value);
  }
}

function releaseMidiNote(
  context: InteractionModuleContext,
  note: number,
  state: MidiMessageRouterState,
): void {
  if (state.sustainPedal) {
    state.sustainedNotes.add(note);
    return;
  }

  context.dispatch({
    action: { type: 'noteOff', note },
    source: 'midi',
    timestamp: Date.now(),
  });
}
