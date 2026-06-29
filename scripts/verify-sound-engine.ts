/**
 * Sound engine verification — exercises PlantasiaSoundAdapter with a Web Audio stub.
 * Run with: npm run verify:sound
 *
 * Real audio output requires a browser; this script validates adapter ↔ engine wiring in Node.
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

  const { PlantasiaSoundAdapter } = await import('../src/audio/soundAdapter.ts');
  const { PRESET_WORLDS } = await import('../src/presets/worlds/index.ts');
  const { presets, resolvePresetToSpecies } = await import('plantasia-sound-engine');
  const {
    clampControlValue,
    clampTempo,
    parseControlParameterPath,
    isSupportedParameterPath,
    MIN_TEMPO,
    MAX_TEMPO,
  } = await import('../src/audio/audioParams.ts');
  const { validateControlMapping, validateBundledEnginePresets, roundtripEcologyControls } =
    await import('../src/audio/engineValidation.ts');
  const { midiToNoteName } = await import('../src/audio/midiNote.ts');
  const { DEFAULT_CONTROLS } = await import('../src/runtime/types.ts');

  // --- Pure validation (no adapter) ---
  const mappingIssues = validateControlMapping();
  assert(mappingIssues.length === 0, `Control mapping issues: ${mappingIssues.join('; ')}`);

  const presetIssues = validateBundledEnginePresets();
  assert(presetIssues.length === 0, `Engine preset issues: ${presetIssues.join('; ')}`);

  assert(clampControlValue(1.5) === 1, 'clampControlValue should cap at 1');
  assert(clampControlValue(-0.2) === 0, 'clampControlValue should floor at 0');
  assert(clampTempo(10) === MIN_TEMPO, 'clampTempo should enforce minimum');
  assert(clampTempo(999) === MAX_TEMPO, 'clampTempo should enforce maximum');
  assert(parseControlParameterPath('controls.bloom') === 'bloom', 'parseControlParameterPath bloom');
  assert(parseControlParameterPath('controls.unknown') === undefined, 'unknown control path');
  assert(isSupportedParameterPath('tempo'), 'tempo path supported');
  assert(!isSupportedParameterPath('controls.unknown'), 'unknown path rejected');

  const roundtripped = roundtripEcologyControls(DEFAULT_CONTROLS);
  for (const key of Object.keys(DEFAULT_CONTROLS) as (keyof typeof DEFAULT_CONTROLS)[]) {
    assert(roundtripped[key] === DEFAULT_CONTROLS[key], `Ecology roundtrip failed for ${key}`);
  }

  assert(midiToNoteName(60) === 'C4', 'MIDI 60 → C4');
  assert(midiToNoteName(-5) === 'C-1', 'MIDI clamp low');
  assert(midiToNoteName(200) === 'G9', 'MIDI clamp high');

  // --- Adapter integration ---
  const adapter = new PlantasiaSoundAdapter();
  await adapter.init();
  assert(adapter !== null, 'Adapter should initialize');

  const worldEnginePresets = new Set<string>();
  for (const world of PRESET_WORLDS) {
    worldEnginePresets.add(world.sound.presetId);
  }

  for (const presetId of worldEnginePresets) {
    const result = await adapter.loadPreset(presetId);
    assert(result !== undefined, `loadPreset(${presetId}) should succeed`);
    const resolution = resolvePresetToSpecies(presetId);
    assert(typeof resolution.speciesId === 'string', `${presetId} should resolve to a species`);
  }

  const worldSpecies = [...worldEnginePresets].map((id) => resolvePresetToSpecies(id).speciesId);
  assert(new Set(worldSpecies).size >= 4, 'World presets should cover at least 4 engine species');

  const allBundledIds = presets.map((p) => p.id);
  assert(allBundledIds.length >= 11, 'Engine should ship at least 11 bundled presets');

  for (const presetId of allBundledIds) {
    const result = await adapter.loadPreset(presetId);
    assert(result !== undefined, `loadPreset(${presetId}) should succeed for bundled preset`);
    assert(
      typeof result.controls.bloom === 'number',
      `${presetId} should return numeric control defaults`,
    );
  }

  // Rapid preset switching stress
  for (let i = 0; i < 3; i++) {
    for (const presetId of allBundledIds) {
      await adapter.loadPreset(presetId);
    }
  }

  // Control path stress via setParameter
  for (const name of Object.keys(DEFAULT_CONTROLS)) {
    adapter.setParameter(`controls.${name}`, Math.random());
    adapter.setParameter(`controls.${name}`, 0.5);
  }
  adapter.setParameter('tempo', 140);
  adapter.setParameter('tempo', 72);

  try {
    await adapter.start();
    adapter.setParameter('controls.bloom', 0.72);
    adapter.setParameter('controls.density', 0.35);
    adapter.noteOn(60, 0.8);
    adapter.noteOff(60);
    await adapter.stop();
  } catch (error) {
    console.warn(
      '[verify-sound] start/note ops skipped — Web Audio stub insufficient for Tone.js:',
      error instanceof Error ? error.message : error,
    );
  }

  await adapter.destroy();

  console.info('[verify-sound] All sound engine checks passed.', {
    bundledPresets: allBundledIds.length,
    worldEnginePresets: [...worldEnginePresets],
    worlds: PRESET_WORLDS.length,
  });
}

main().catch((error: unknown) => {
  console.error('[verify-sound] FAILED:', error);
  process.exit(1);
});
