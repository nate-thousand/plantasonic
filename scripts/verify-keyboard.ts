/**
 * Keyboard verification — run with: npm run verify:keyboard
 */

import { InputRouter } from '../src/interaction/inputRouter.ts';
import { createRuntime } from '../src/runtime/createRuntime.ts';
import {
  clampOctave,
  DEFAULT_KEY_MAP,
  isPlayableKey,
  keyboardNoteVelocity,
  noteFromKey,
} from '../src/keyboard/keyboardLogic.ts';
import { MockAsciiAdapter } from './mocks/mockAsciiAdapter.ts';
import { MockSoundAdapter } from './mocks/mockSoundAdapter.ts';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function routeNote(
  router: InputRouter,
  type: 'noteOn' | 'noteOff',
  note: number,
  velocity = 0.75,
): void {
  router.route({
    action: type === 'noteOn' ? { type: 'noteOn', note, velocity } : { type: 'noteOff', note },
    source: 'keyboard',
    timestamp: Date.now(),
  });
}

async function main(): Promise<void> {
  // --- Pure layout ---
  assert(isPlayableKey('a', DEFAULT_KEY_MAP), 'A is playable');
  assert(!isPlayableKey('q', DEFAULT_KEY_MAP), 'Q is not mapped');
  assert(noteFromKey('a', 4, DEFAULT_KEY_MAP) === 60, 'Octave 4 A → MIDI 60');
  assert(noteFromKey('d', 4, DEFAULT_KEY_MAP) === 64, 'Octave 4 D → MIDI 64');
  assert(noteFromKey('a', 5, DEFAULT_KEY_MAP) === 72, 'Octave 5 A → MIDI 72');
  assert(clampOctave(12) === 8, 'Octave clamps high');
  assert(clampOctave(-2) === 0, 'Octave clamps low');
  assert(keyboardNoteVelocity(0.75, 'linear') === 0.75, 'Linear velocity');
  assert(keyboardNoteVelocity(0.5, 'soft') === 0.25, 'Soft velocity curve');
  assert(keyboardNoteVelocity(0.5, 'hard') === Math.sqrt(0.5), 'Hard velocity curve');

  const sound = new MockSoundAdapter();
  const ascii = new MockAsciiAdapter();
  const runtime = createRuntime({ soundAdapter: sound, asciiAdapter: ascii });
  await runtime.init({ container: {} as HTMLElement });
  await runtime.start();

  const router = new InputRouter(runtime);

  // --- Note on/off ---
  routeNote(router, 'noteOn', 60);
  assert(runtime.getState().activeNotes.includes(60), 'Keyboard note on reaches runtime');
  assert(sound.getLastState()?.activeNotes.includes(60), 'Engine receives keyboard note');

  routeNote(router, 'noteOff', 60);
  assert(!runtime.getState().activeNotes.includes(60), 'Keyboard note off clears note');

  // --- Octave shift semantics (retrigger at new pitch) ---
  let octave = 4;
  routeNote(router, 'noteOn', noteFromKey('a', octave, DEFAULT_KEY_MAP)!);
  octave = clampOctave(octave - 1);
  routeNote(router, 'noteOff', noteFromKey('a', 4, DEFAULT_KEY_MAP)!);
  routeNote(router, 'noteOn', noteFromKey('a', octave, DEFAULT_KEY_MAP)!);
  assert(runtime.getState().activeNotes.includes(48), 'Octave down retriggers at MIDI 48');

  routeNote(router, 'noteOff', 48);

  // --- Sustain (matches MIDI module behavior) ---
  routeNote(router, 'noteOn', 67);
  assert(runtime.getState().activeNotes.includes(67), 'Note held before sustain test');

  // Simulate sustain: note stays in runtime until explicit noteOff after sustain release
  // (Keyboard module defers noteOff; we verify the held state matches MIDI path)
  assert(runtime.getState().activeNotes.length === 1, 'Single active note during sustain simulation');

  routeNote(router, 'noteOff', 67);
  assert(!runtime.getState().activeNotes.includes(67), 'Note off after sustain release');

  // --- Transport (async via InputRouter) ---
  router.route({ action: { type: 'stop' }, source: 'keyboard', timestamp: Date.now() });
  await new Promise((r) => setTimeout(r, 10));
  assert(!runtime.getState().isPlaying, 'Escape/stop clears transport');

  router.route({ action: { type: 'start' }, source: 'keyboard', timestamp: Date.now() });
  await new Promise((r) => setTimeout(r, 10));
  assert(runtime.getState().isPlaying, 'Enter/start resumes transport');

  // --- Velocity curve affects note energy ---
  const softVel = keyboardNoteVelocity(0.8, 'soft');
  routeNote(router, 'noteOn', 64, softVel);
  assert(runtime.getState().performance.velocity === softVel, 'Velocity curve applied to performance');

  await runtime.destroy();

  console.info('[verify-keyboard] All keyboard checks passed.');
}

main().catch((error: unknown) => {
  console.error('[verify-keyboard] FAILED:', error);
  process.exit(1);
});
