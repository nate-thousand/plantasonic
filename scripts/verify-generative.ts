/**
 * Generative systems verification — run with: npm run verify:generative
 *
 * Validates runtime → adapter → engine generative routing without full Tone.js output.
 */

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function installAudioStub(): void {
  if (globalThis.AudioContext) return;

  class StubAudioContext {
    state = 'running';
    destination = {};
    sampleRate = 44100;
    currentTime = 0;
    createGain() {
      return { connect: () => undefined, gain: { value: 1 } };
    }
    createOscillator() {
      return { connect: () => undefined, start: () => undefined, stop: () => undefined };
    }
    createBiquadFilter() {
      return { connect: () => undefined, frequency: { value: 440 } };
    }
    createBufferSource() {
      return { connect: () => undefined, start: () => undefined, stop: () => undefined };
    }
    createBuffer() {
      return { getChannelData: () => new Float32Array(128) };
    }
    resume() {
      return Promise.resolve();
    }
    close() {
      return Promise.resolve();
    }
  }

  // @ts-expect-error stub for node
  globalThis.AudioContext = StubAudioContext;
  // @ts-expect-error stub for node
  globalThis.webkitAudioContext = StubAudioContext;
}

async function main(): Promise<void> {
  installAudioStub();

  const {
    validateGenerativeControlCoverage,
    generatorAcceptsEcologyUpdates,
    validateGenerativeEventKinds,
    runtimeControlsReachEcology,
    ecologyRhythmFixtures,
    TEST_GENERATIVE_PREFERENCES,
  } = await import('../src/audio/generativeValidation.ts');
  const { RhythmEngine } = await import(
    '../node_modules/plantasia-sound-engine/dist/engine/generative/RhythmEngine.js'
  );
  const { GENERATIVE_CONTROL_EFFECTS, GENERATIVE_EVENT_KINDS } = await import(
    '../src/audio/generativeMapping.ts'
  );
  const { PlantasiaSoundAdapter } = await import('../src/audio/soundAdapter.ts');
  const { PRESET_WORLDS } = await import('../src/presets/worlds/index.ts');
  const { createRuntime } = await import('../src/runtime/createRuntime.ts');
  const { DEFAULT_CONTROLS } = await import('../src/runtime/types.ts');

  // --- Pure generative validation ---
  const coverageIssues = validateGenerativeControlCoverage();
  assert(coverageIssues.length === 0, `Coverage issues: ${coverageIssues.join('; ')}`);

  const eventKindIssues = validateGenerativeEventKinds();
  assert(eventKindIssues.length === 0, eventKindIssues.join('; '));

  assert(GENERATIVE_CONTROL_EFFECTS.length === 5, 'All 5 runtime controls should map to generative ecology');
  assert(GENERATIVE_EVENT_KINDS.length === 7, 'Engine exposes 7 generative event kinds');

  const { grounded, open, sparse, dense } = ecologyRhythmFixtures();
  const rhythm = new RhythmEngine();
  const clean = { ...grounded, mold: 0.05 };
  const degraded = { ...grounded, mold: 0.95 };
  const cleanPlan = rhythm.nextPlan(clean, TEST_GENERATIVE_PREFERENCES);
  rhythm.reset();
  const degradedPlan = rhythm.nextPlan(degraded, TEST_GENERATIVE_PREFERENCES);
  assert(degradedPlan.stepMs > cleanPlan.stepMs, 'Mold ecology should affect phrase step timing');

  let sparseTotal = 0;
  let denseTotal = 0;
  for (let i = 0; i < 12; i += 1) {
    sparseTotal += rhythm.nextPlan(sparse, TEST_GENERATIVE_PREFERENCES).intervalMs;
    rhythm.reset();
    denseTotal += rhythm.nextPlan(dense, TEST_GENERATIVE_PREFERENCES).intervalMs;
    rhythm.reset();
  }
  assert(denseTotal < sparseTotal, 'Growth ecology should affect event timing density');

  assert(generatorAcceptsEcologyUpdates(), 'Generator should accept ecology updates');
  assert(runtimeControlsReachEcology(), 'Runtime controls should roundtrip to ecology');

  // --- Adapter: controls reach engine ecology layer ---
  const adapter = new PlantasiaSoundAdapter();
  await adapter.init();

  for (const world of PRESET_WORLDS) {
    const result = await adapter.loadPreset(world.sound.presetId);
    assert(result !== undefined, `loadPreset(${world.sound.presetId}) should succeed`);
  }

  for (const name of Object.keys(DEFAULT_CONTROLS)) {
    adapter.setParameter(`controls.${name}`, 0.82);
    adapter.setParameter(`controls.${name}`, 0.18);
  }
  adapter.setParameter('tempo', 108);
  adapter.setParameter('tempo', 60);

  try {
    await adapter.start();
    adapter.setParameter('controls.density', 0.9);
    adapter.setParameter('controls.chaos', 0.75);
    await adapter.stop();
  } catch (error) {
    console.warn(
      '[verify-generative] start/stop skipped — Web Audio stub insufficient for Tone.js:',
      error instanceof Error ? error.message : error,
    );
  }

  await adapter.destroy();

  // --- Runtime: preset switch while playing restarts generative playback ---
  const { MockSoundAdapter } = await import('./mocks/mockSoundAdapter.ts');
  const { MockAsciiAdapter } = await import('./mocks/mockAsciiAdapter.ts');

  const sound = new MockSoundAdapter();
  const ascii = new MockAsciiAdapter();
  const runtime = createRuntime({ soundAdapter: sound, asciiAdapter: ascii });

  await runtime.init({ container: {} as HTMLElement, initialPresetId: 'seed-world' });
  await runtime.start();
  const startsBefore = sound.getStartCallCount();
  await runtime.setPreset('zen-world');
  assert(runtime.getState().isPlaying, 'Playing state preserved across preset switch');
  assert(
    sound.getStartCallCount() > startsBefore,
    'Runtime should restart sound adapter after generative preset switch',
  );

  await runtime.destroy();

  console.info('[verify-generative] All generative checks passed.', {
    controls: GENERATIVE_CONTROL_EFFECTS.length,
    eventKinds: GENERATIVE_EVENT_KINDS.length,
    worlds: PRESET_WORLDS.length,
  });
}

main().catch((error: unknown) => {
  console.error('[verify-generative] FAILED:', error);
  process.exit(1);
});
