/**
 * Performance and latency verification — run with: npm run verify:performance
 */

import { ControlCoalescer } from '../src/interaction/controlCoalescer.ts';
import { InputRouter } from '../src/interaction/inputRouter.ts';
import { createRuntime } from '../src/runtime/createRuntime.ts';
import { MockAsciiAdapter } from './mocks/mockAsciiAdapter.ts';
import { MockSoundAdapter } from './mocks/mockSoundAdapter.ts';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

async function main(): Promise<void> {
  const coalescer = new ControlCoalescer();
  assert(coalescer.shouldCoalesce('ui'), 'UI controls should coalesce');
  assert(coalescer.shouldCoalesce('mouse'), 'Mouse controls should coalesce');
  assert(coalescer.shouldCoalesce('touch'), 'Touch controls should coalesce');
  assert(!coalescer.shouldCoalesce('midi'), 'MIDI must not coalesce');
  assert(!coalescer.shouldCoalesce('keyboard'), 'Keyboard must not coalesce');

  const sound = new MockSoundAdapter();
  const ascii = new MockAsciiAdapter();
  const runtime = createRuntime({ soundAdapter: sound, asciiAdapter: ascii });
  await runtime.init({ container: {} as HTMLElement, initialPresetId: 'seed-world' });
  await runtime.start();

  const router = new InputRouter(runtime);
  const noteParamBefore = ascii.getSetParameterCallCount?.() ?? 0;

  router.route({
    action: { type: 'noteOn', note: 60, velocity: 0.8 },
    source: 'keyboard',
    timestamp: Date.now(),
  });

  assert(
    (ascii.getSetParameterCallCount?.() ?? 0) === noteParamBefore,
    'noteOn should sync visuals via applyState only (no setParameter)',
  );
  assert(runtime.getState().activeNotes.includes(60), 'Runtime tracks active note');

  router.route({
    action: { type: 'noteOff', note: 60 },
    source: 'keyboard',
    timestamp: Date.now(),
  });
  assert(runtime.getState().activeNotes.length === 0, 'noteOff clears active notes');

  let controlCalls = 0;
  const trackingRuntime = {
    setControl: () => {
      controlCalls += 1;
    },
    setTempo: () => undefined,
  };

  const uiCoalescer = new ControlCoalescer();
  uiCoalescer.queueControl('bloom', 0.5, trackingRuntime);
  uiCoalescer.queueControl('bloom', 0.6, trackingRuntime);
  uiCoalescer.queueControl('mold', 0.4, trackingRuntime);
  uiCoalescer.flush(trackingRuntime);
  assert(controlCalls === 2, 'Coalescer flush applies latest value per control once');

  await runtime.destroy();

  console.info('[verify-performance] All performance checks passed.');
}

main().catch((error: unknown) => {
  console.error('[verify-performance] FAILED:', error);
  process.exit(1);
});
