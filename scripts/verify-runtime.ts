/**
 * Runtime verification — run with: npm run verify:runtime
 */

import { createRuntime } from '../src/runtime/createRuntime.ts';
import { MockSoundAdapter } from './mocks/mockSoundAdapter.ts';
import { MockAsciiAdapter } from './mocks/mockAsciiAdapter.ts';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  const sound = new MockSoundAdapter();
  const ascii = new MockAsciiAdapter();
  const runtime = createRuntime({ soundAdapter: sound, asciiAdapter: ascii });

  let subscriberCalls = 0;
  let lastSubscriberState = runtime.getState();

  const unsubscribe = runtime.subscribe((state) => {
    subscriberCalls += 1;
    lastSubscriberState = state;
  });

  assert(subscriberCalls === 1, 'Subscriber should receive initial state');

  const init = await runtime.init({ container: {} as HTMLElement });
  assert(init.success, 'Runtime init should succeed');

  await runtime.start();
  assert(runtime.getState().isPlaying, 'start() should set isPlaying');
  assert(sound.getLastState()?.isPlaying === true, 'MockSound should receive applyState after start');
  assert(ascii.getLastState()?.isPlaying === true, 'MockAscii should receive applyState after start');

  await runtime.setPreset('seed-world');
  assert(runtime.getState().preset === 'seed-world', 'setPreset should update preset');
  assert(runtime.getState().controls.bloom === 0.65, 'seed-world should apply world default controls');
  assert(runtime.getState().tempo === 72, 'seed-world should apply world default tempo');
  assert(sound.getLastState()?.preset === 'seed-world', 'MockSound should reflect preset');
  assert(ascii.getLastState()?.preset === 'seed-world', 'MockAscii should reflect preset');

  let unknownRejected = false;
  try {
    await runtime.setPreset('unknown-world');
  } catch {
    unknownRejected = true;
  }
  assert(unknownRejected, 'setPreset should reject unknown preset worlds');

  await runtime.setPreset('mold-world');
  assert(runtime.getState().preset === 'mold-world', 'mold-world should load');
  assert(runtime.getState().tempo === 84, 'mold-world should apply world tempo');

  runtime.setControl('bloom', 0.75);
  assert(runtime.getState().controls.bloom === 0.75, 'setControl should update controls');
  assert(sound.getLastState()?.controls.bloom === 0.75, 'MockSound should reflect control change');
  assert(ascii.getLastState()?.controls.bloom === 0.75, 'MockAscii should reflect control change');

  runtime.setTempo(96);
  assert(runtime.getState().tempo === 96, 'setTempo should update tempo');

  runtime.noteOn(60, 0.8);
  assert(runtime.getState().activeNotes.includes(60), 'noteOn should track active notes');
  assert(sound.getLastState()?.activeNotes.length === 1, 'MockSound should reflect active notes');

  runtime.noteOff(60);
  assert(!runtime.getState().activeNotes.includes(60), 'noteOff should remove active notes');

  await runtime.stop();
  assert(!runtime.getState().isPlaying, 'stop() should clear isPlaying');
  assert(runtime.getState().activeNotes.length === 0, 'stop() should clear active notes');

  assert(subscriberCalls > 1, 'Subscribers should receive state changes');
  assert(lastSubscriberState.isPlaying === false, 'Last subscriber snapshot should match final state');

  unsubscribe();
  await runtime.destroy();

  console.info('[verify-runtime] All runtime checks passed.');
}

main().catch((error: unknown) => {
  console.error('[verify-runtime] FAILED:', error);
  process.exit(1);
});
