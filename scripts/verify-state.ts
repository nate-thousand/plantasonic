/**
 * State management verification — run with: npm run verify:state
 *
 * Validates single-source-of-truth boundaries: runtime owns performance state;
 * UI and adapters sync from runtime; interaction settings stay separate.
 */

import { createInteractionManager } from '../src/interaction/index.ts';
import { InputRouter } from '../src/interaction/inputRouter.ts';
import { createRuntime } from '../src/runtime/createRuntime.ts';
import {
  clampControlValue,
  clampTempo,
  controlValueToPercent,
  MAX_TEMPO,
  MIN_TEMPO,
  percentToControlValue,
  tempoFromNormalized,
} from '../src/runtime/performanceParams.ts';
import {
  clampControlPatch,
  controlsMatch,
  tempoClampIsStable,
  validateRuntimeState,
} from '../src/runtime/stateValidation.ts';
import { DEFAULT_CONTROLS } from '../src/runtime/types.ts';
import { applyCcMapping } from '../src/midi/midiMapping.ts';
import { routeParsedMidiMessage } from '../src/midi/midiMessage.ts';
import { MockAsciiAdapter } from './mocks/mockAsciiAdapter.ts';
import { MockSoundAdapter } from './mocks/mockSoundAdapter.ts';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

async function main(): Promise<void> {
  // --- Pure validation ---
  assert(tempoClampIsStable(), 'Tempo clamp should be idempotent');
  assert(clampTempo(10) === MIN_TEMPO, 'Tempo floor uses MIN_TEMPO');
  assert(clampTempo(999) === MAX_TEMPO, 'Tempo cap uses MAX_TEMPO');
  assert(clampControlValue(2) === 1, 'Control clamp caps at 1');
  assert(percentToControlValue(75) === 0.75, 'Percent → control value');
  assert(controlValueToPercent(0.65) === 65, 'Control value → percent');
  assert(tempoFromNormalized(0) === MIN_TEMPO, 'CC tempo min');
  assert(tempoFromNormalized(1) === MAX_TEMPO, 'CC tempo max');

  const patched = clampControlPatch({ bloom: 1.5, mold: -0.2 });
  assert(patched.bloom === 1 && patched.mold === 0, 'Control patch clamping');

  const initialIssues = validateRuntimeState({
    isPlaying: false,
    preset: null,
    activeNotes: [],
    tempo: 72,
    controls: { ...DEFAULT_CONTROLS },
    performance: { lastNote: null, velocity: 0, energy: 0, activity: 0 },
  });
  assert(initialIssues.length === 0, `Initial state invalid: ${initialIssues.join('; ')}`);

  // --- Runtime is SSOT for performance state ---
  const sound = new MockSoundAdapter();
  const ascii = new MockAsciiAdapter();
  const runtime = createRuntime({ soundAdapter: sound, asciiAdapter: ascii });
  await runtime.init({ container: {} as HTMLElement, initialPresetId: 'seed-world' });

  const setParamBefore = sound.getSetParameterCallCount();
  runtime.setControl('bloom', 0.82);
  assert(runtime.getState().controls.bloom === 0.82, 'Runtime stores setControl');
  assert(
    sound.getSetParameterCallCount() === setParamBefore,
    'setControl should sync via applyState only (no setParameter)',
  );
  assert(sound.getLastState()?.controls.bloom === 0.82, 'Adapter receives runtime snapshot');

  runtime.setTempo(140);
  assert(runtime.getState().tempo === 140, 'Runtime stores setTempo');
  assert(sound.getLastState()?.tempo === 140, 'Adapter tempo matches runtime');

  // --- Input router updates runtime (MIDI/UI path) ---
  const router = new InputRouter(runtime);
  router.route({
    action: { type: 'setControl', name: 'chaos', value: 0.33 },
    source: 'midi',
    timestamp: Date.now(),
  });
  assert(runtime.getState().controls.chaos === 0.33, 'Router updates runtime controls');

  // --- MIDI CC → runtime → adapter ---
  const mockContext = {
    dispatch: (event: {
      action:
        | { type: 'setControl'; name: keyof typeof DEFAULT_CONTROLS; value: number }
        | { type: 'setTempo'; tempo: number };
    }) => {
      router.route({ ...event, source: 'midi' as const, timestamp: Date.now() });
    },
    getSettings: () => ({
      midiLearnMappings: [{ id: '0:1:control', cc: 1, channel: 0, target: { type: 'control' as const, name: 'bloom' as const } }],
    }),
    onSettingsChange: () => () => undefined,
    updateSettings: () => undefined,
  };

  applyCcMapping(
    mockContext,
    { id: '0:1:control', cc: 1, channel: 0, target: { type: 'control', name: 'bloom' } },
    127,
  );
  assert(runtime.getState().controls.bloom === 1, 'MIDI CC maps to runtime bloom');

  routeParsedMidiMessage(
    { type: 'pitchBend', channel: 1, value: 8192 },
    {
      context: mockContext,
      channelFilter: 0,
      velocityCurve: 'linear',
      learnTarget: null,
      completeLearn: () => null,
      state: { sustainPedal: false, sustainedNotes: new Set() },
    },
  );
  assert(
    Math.abs(runtime.getState().controls.brightness - 8192 / 16383) < 0.001,
    'Pitch bend maps to runtime brightness',
  );

  // --- Preset load commits world defaults to runtime ---
  await runtime.setPreset('mold-world');
  assert(runtime.getState().preset === 'mold-world', 'Preset id in runtime');
  assert(runtime.getState().tempo === 84, 'World tempo in runtime');
  assert(!controlsMatch(runtime.getState().controls, DEFAULT_CONTROLS), 'World controls differ from defaults');

  // --- Settings store separate from runtime performance state ---
  const interaction = createInteractionManager(runtime);
  interaction.updateSettings({ defaultOctave: 6, keyboardVelocity: 0.5 });
  assert(interaction.getSettings().defaultOctave === 6, 'Settings store owns octave');
  assert(runtime.getState().tempo === 84, 'Settings change does not alter runtime tempo');

  await runtime.destroy();

  console.info('[verify-state] All state management checks passed.');
}

main().catch((error: unknown) => {
  console.error('[verify-state] FAILED:', error);
  process.exit(1);
});
