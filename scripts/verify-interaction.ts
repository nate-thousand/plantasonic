/**
 * Interaction layer verification — run with: npm run verify:interaction
 */

import { createInteractionManager } from '../src/interaction/index.ts';
import { InputRouter } from '../src/interaction/inputRouter.ts';
import { createRuntime } from '../src/runtime/createRuntime.ts';
import { SettingsStore, DEFAULT_INTERACTION_SETTINGS } from '../src/services/settingsStore.ts';
import { MockAsciiAdapter } from './mocks/mockAsciiAdapter.ts';
import { MockSoundAdapter } from './mocks/mockSoundAdapter.ts';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

async function main(): Promise<void> {
  const sound = new MockSoundAdapter();
  const ascii = new MockAsciiAdapter();
  const runtime = createRuntime({ soundAdapter: sound, asciiAdapter: ascii });
  const interaction = createInteractionManager(runtime);

  assert(interaction.getSettings().midiEnabled === DEFAULT_INTERACTION_SETTINGS.midiEnabled);
  assert(typeof interaction.start === 'function', 'InteractionManager exposes start()');

  await runtime.init({ container: {} as HTMLElement });

  const router = new InputRouter(runtime);

  router.route({
    action: { type: 'setControl', name: 'bloom', value: 0.5 },
    source: 'mouse',
    timestamp: Date.now(),
  });
  router.route({
    action: { type: 'setTempo', tempo: 100 },
    source: 'touch',
    timestamp: Date.now(),
  });
  router.route({
    action: { type: 'noteOn', note: 60, velocity: 0.9 },
    source: 'midi',
    timestamp: Date.now(),
  });

  assert(runtime.getState().controls.bloom === 0.5, 'Router dispatches setControl to runtime');
  assert(runtime.getState().tempo === 100, 'Router dispatches setTempo to runtime');
  assert(runtime.getState().activeNotes.includes(60), 'Router dispatches noteOn to runtime');

  const store = new SettingsStore();
  store.update({ defaultOctave: 5 });
  assert(store.getSettings().defaultOctave === 5, 'Settings update in memory');

  store.addMidiLearnMapping({
    id: '1:7:control',
    cc: 7,
    channel: 1,
    target: { type: 'control', name: 'bloom' },
  });
  assert(store.getSettings().midiLearnMappings.length === 1, 'MIDI Learn mappings stored');

  interaction.startMidiLearn({ type: 'control', name: 'mold' });
  const mapping = interaction.completeMidiLearn(12, 1);
  assert(mapping?.cc === 12, 'MIDI Learn completes mapping');

  await runtime.destroy();
  console.info('[verify-interaction] All interaction checks passed.');
}

main().catch((error: unknown) => {
  console.error('[verify-interaction] FAILED:', error);
  process.exit(1);
});
