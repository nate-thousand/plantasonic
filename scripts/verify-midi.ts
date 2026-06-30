/**
 * MIDI routing verification — run with: npm run verify:midi
 */

import { InputRouter } from '../src/interaction/inputRouter.ts';
import { createRuntime } from '../src/runtime/createRuntime.ts';
import { createDefaultMidiLearnMappings } from '../src/midi/midiMapping.ts';
import {
  parseMidiMessage,
  pitchBendToBrightness,
  routeParsedMidiMessage,
  type MidiMessageRouterState,
} from '../src/midi/midiMessage.ts';
import { MockAsciiAdapter } from './mocks/mockAsciiAdapter.ts';
import { MockSoundAdapter } from './mocks/mockSoundAdapter.ts';
import type { InteractionModuleContext } from '../src/interaction/types.ts';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function createTestContext(
  dispatch: InteractionModuleContext['dispatch'],
  overrides: Partial<ReturnType<InteractionModuleContext['getSettings']>> = {},
  isPlaying: () => boolean = () => true,
): InteractionModuleContext {
  return {
    dispatch,
    getSettings: () => ({
      midiEnabled: true,
      keyboardEnabled: true,
      touchEnabled: true,
      mouseSensitivity: 1,
      touchSensitivity: 1,
      velocityCurve: 'linear',
      defaultOctave: 4,
      midiChannel: 0,
      keyboardVelocity: 0.75,
      midiLearnMappings: createDefaultMidiLearnMappings(),
      ...overrides,
    }),
    isPlaying,
    onSettingsChange: () => () => undefined,
    updateSettings: () => undefined,
  };
}

async function main(): Promise<void> {
  // --- Parsing ---
  const noteOn = parseMidiMessage([0x90, 60, 100]);
  assert(noteOn?.type === 'noteOn' && noteOn.note === 60 && noteOn.velocity === 100, 'Note on parse');

  const noteOffViaVel0 = parseMidiMessage([0x90, 60, 0]);
  assert(noteOffViaVel0?.type === 'noteOff', 'Velocity 0 note-on → note off');

  const noteOff = parseMidiMessage([0x80, 60, 0]);
  assert(noteOff?.type === 'noteOff' && noteOff.note === 60, 'Note off parse');

  const cc = parseMidiMessage([0xb0, 1, 64]);
  assert(cc?.type === 'cc' && cc.cc === 1 && cc.value === 64, 'CC parse');

  const bend = parseMidiMessage([0xe0, 0, 64]);
  assert(bend?.type === 'pitchBend' && bend.value === 8192, 'Pitch bend parse');

  assert(Math.abs(pitchBendToBrightness(8192) - 0.5) < 0.01, 'Pitch bend center ≈ 0.5 brightness');
  assert(pitchBendToBrightness(0) === 0, 'Pitch bend min → 0');
  assert(pitchBendToBrightness(16383) === 1, 'Pitch bend max → 1');

  // --- Runtime routing via InputRouter ---
  const sound = new MockSoundAdapter();
  const ascii = new MockAsciiAdapter();
  const runtime = createRuntime({ soundAdapter: sound, asciiAdapter: ascii });
  await runtime.init({ container: {} as HTMLElement });
  await runtime.start();

  const router = new InputRouter(runtime);
  const dispatches: string[] = [];
  const context = createTestContext(
    (event) => {
      dispatches.push(event.action.type);
      router.route(event);
    },
    {},
    () => runtime.getState().isPlaying,
  );

  const routerState: MidiMessageRouterState = {
    sustainPedal: false,
    sustainedNotes: new Set<number>(),
  };

  routeParsedMidiMessage(
    { type: 'noteOn', channel: 1, note: 64, velocity: 100 },
    {
      context,
      channelFilter: 0,
      velocityCurve: 'linear',
      learnTarget: null,
      completeLearn: () => null,
      state: routerState,
    },
  );
  assert(runtime.getState().activeNotes.includes(64), 'MIDI note on reaches runtime');

  routeParsedMidiMessage(
    { type: 'noteOff', channel: 1, note: 64 },
    {
      context,
      channelFilter: 0,
      velocityCurve: 'linear',
      learnTarget: null,
      completeLearn: () => null,
      state: routerState,
    },
  );
  assert(!runtime.getState().activeNotes.includes(64), 'MIDI note off clears note');

  routeParsedMidiMessage(
    { type: 'cc', channel: 1, cc: 1, value: 127 },
    {
      context,
      channelFilter: 0,
      velocityCurve: 'linear',
      learnTarget: null,
      completeLearn: () => null,
      state: routerState,
    },
  );
  assert(runtime.getState().controls.bloom === 1, 'Mod wheel CC1 → bloom');

  routeParsedMidiMessage(
    { type: 'pitchBend', channel: 1, value: 16383 },
    {
      context,
      channelFilter: 0,
      velocityCurve: 'linear',
      learnTarget: null,
      completeLearn: () => null,
      state: routerState,
    },
  );
  assert(runtime.getState().controls.brightness === 1, 'Pitch bend → brightness');

  // --- Sustain pedal ---
  routerState.sustainPedal = false;
  routerState.sustainedNotes.clear();
  routeParsedMidiMessage(
    { type: 'cc', channel: 1, cc: 64, value: 127 },
    {
      context,
      channelFilter: 0,
      velocityCurve: 'linear',
      learnTarget: null,
      completeLearn: () => null,
      state: routerState,
    },
  );
  assert(routerState.sustainPedal, 'Sustain pedal engages on CC 64');

  routeParsedMidiMessage(
    { type: 'noteOn', channel: 1, note: 67, velocity: 80 },
    {
      context,
      channelFilter: 0,
      velocityCurve: 'linear',
      learnTarget: null,
      completeLearn: () => null,
      state: routerState,
    },
  );
  routeParsedMidiMessage(
    { type: 'noteOff', channel: 1, note: 67 },
    {
      context,
      channelFilter: 0,
      velocityCurve: 'linear',
      learnTarget: null,
      completeLearn: () => null,
      state: routerState,
    },
  );
  assert(runtime.getState().activeNotes.includes(67), 'Sustain holds note off');

  routeParsedMidiMessage(
    { type: 'cc', channel: 1, cc: 64, value: 0 },
    {
      context,
      channelFilter: 0,
      velocityCurve: 'linear',
      learnTarget: null,
      completeLearn: () => null,
      state: routerState,
    },
  );
  assert(!runtime.getState().activeNotes.includes(67), 'Sustain release clears held notes');

  // --- Channel filter ---
  routeParsedMidiMessage(
    { type: 'noteOn', channel: 2, note: 72, velocity: 100 },
    {
      context: createTestContext((event) => router.route(event), { midiChannel: 1 }),
      channelFilter: 1,
      velocityCurve: 'linear',
      learnTarget: null,
      completeLearn: () => null,
      state: routerState,
    },
  );
  assert(!runtime.getState().activeNotes.includes(72), 'Channel filter blocks other channels');

  routeParsedMidiMessage(
    { type: 'noteOn', channel: 1, note: 72, velocity: 100 },
    {
      context: createTestContext((event) => router.route(event), { midiChannel: 1 }),
      channelFilter: 1,
      velocityCurve: 'linear',
      learnTarget: null,
      completeLearn: () => null,
      state: routerState,
    },
  );
  assert(runtime.getState().activeNotes.includes(72), 'Channel filter allows matching channel');

  // --- MIDI Learn applies value on complete ---
  let learned = false;
  routeParsedMidiMessage(
    { type: 'cc', channel: 1, cc: 12, value: 64 },
    {
      context,
      channelFilter: 0,
      velocityCurve: 'linear',
      learnTarget: { type: 'control', name: 'mold' },
      completeLearn: (cc, channel) => {
        learned = true;
        assert(cc === 12 && channel === 1, 'Learn captures CC and channel');
        return {
          id: '1:12:control',
          cc: 12,
          channel: 1,
          target: { type: 'control', name: 'mold' },
        };
      },
      state: routerState,
    },
  );
  assert(learned, 'Learn mode completes mapping');
  assert(
    Math.abs(runtime.getState().controls.mold - 64 / 127) < 0.01,
    'Learn applies CC value to engine on complete',
  );

  await runtime.stop();
  const bloomBeforeIdleCc = runtime.getState().controls.bloom;
  routeParsedMidiMessage(
    { type: 'cc', channel: 1, cc: 1, value: 127 },
    {
      context: createTestContext((event) => router.route(event), {}, () => false),
      channelFilter: 0,
      velocityCurve: 'linear',
      learnTarget: null,
      completeLearn: () => null,
      state: routerState,
    },
  );
  assert(
    runtime.getState().controls.bloom === bloomBeforeIdleCc,
    'CC performance mapping ignored when transport stopped',
  );

  await runtime.destroy();

  console.info('[verify-midi] All MIDI checks passed.', {
    defaultCcMappings: createDefaultMidiLearnMappings().length,
  });
}

main().catch((error: unknown) => {
  console.error('[verify-midi] FAILED:', error);
  process.exit(1);
});
