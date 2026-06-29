/**
 * Preset validation — run with: npm run verify:presets
 *
 * Validates bundled engine presets and Plantasonic world mappings.
 * Confirms each world loads through the real sound adapter with distinct settings.
 */

import { Window } from 'happy-dom';
import {
  getPresetById,
  presets as enginePresets,
  resolvePresetToSpecies,
  validateAllPresets,
} from 'plantasia-sound-engine';
import { PRESET_WORLDS } from '../src/presets/worlds/index.ts';
import {
  listBundledEnginePresetIds,
  synthSettingsFingerprint,
  validatePresetWorlds,
  worldControlsFingerprint,
} from '../src/presets/soundPresetValidation.ts';
import { mergeWorldDefaults } from '../src/presets/registry.ts';
import { ecologyToRuntimeControls } from '../src/audio/controlMapping.ts';

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
  const window = new Window({ url: 'http://localhost/', width: 800, height: 600 });
  globalThis.window = window as unknown as Window & typeof globalThis.window;
  globalThis.document = window.document;
  installAudioStub();

  // --- Engine bundled presets ---
  assert(enginePresets.length >= 11, `Expected ≥11 engine presets, got ${enginePresets.length}`);

  const strictEngineIssues = validateAllPresets([...enginePresets], { strict: false });
  assert(
    strictEngineIssues.length === 0,
    `Engine preset metadata issues:\n${strictEngineIssues.map((i) => `  [${i.presetId}] ${i.field}: ${i.message}`).join('\n')}`,
  );

  for (const preset of enginePresets) {
    assert(!!preset.synth?.oscillator, `${preset.id} missing oscillator`);
    assert(!!preset.synth?.envelope, `${preset.id} missing envelope`);
    assert(preset.synth.filterHz > 0, `${preset.id} missing filterHz`);
    assert(preset.synth.effects !== undefined, `${preset.id} missing effects`);

    const resolution = resolvePresetToSpecies(preset.id);
    assert(!!resolution.speciesId, `${preset.id} should resolve to a species`);
  }

  const synthFingerprints = new Set<string>();
  for (const preset of enginePresets) {
    const fp = synthSettingsFingerprint(preset);
    synthFingerprints.add(fp);
  }
  assert(
    synthFingerprints.size >= enginePresets.length - 2,
    'Engine presets should have mostly unique synth configurations',
  );

  // --- Plantasonic worlds ---
  const worldIssues = validatePresetWorlds(PRESET_WORLDS);
  assert(
    worldIssues.length === 0,
    `World validation failed:\n${worldIssues.map((i) => `  [${i.worldId ?? i.presetId}] ${i.field}: ${i.message}`).join('\n')}`,
  );

  const worldFingerprints = new Set(PRESET_WORLDS.map((w) => worldControlsFingerprint(w)));
  assert(
    worldFingerprints.size === PRESET_WORLDS.length,
    'Each world must have a unique merged control fingerprint',
  );

  const speciesUsed = new Set(
    PRESET_WORLDS.map((w) => resolvePresetToSpecies(w.sound.presetId).speciesId),
  );
  assert(speciesUsed.size >= 4, 'Worlds should cover at least 4 engine species');

  // --- Adapter load path ---
  const { PlantasiaSoundAdapter } = await import('../src/audio/soundAdapter.ts');
  const adapter = new PlantasiaSoundAdapter();
  await adapter.init();

  for (const world of PRESET_WORLDS) {
    const result = await adapter.loadPreset(world.sound.presetId);
    assert(result !== undefined, `${world.id}: adapter failed to load ${world.sound.presetId}`);

    const resolution = resolvePresetToSpecies(world.sound.presetId);
    const merged = mergeWorldDefaults(world, result.controls);
    assert(merged.tempo === world.defaults.tempo, `${world.id}: tempo should match world default`);
    assert(
      merged.controls.bloom === world.defaults.controls?.bloom,
      `${world.id}: bloom should match world default`,
    );

    const engineEcology = ecologyToRuntimeControls(resolution.ecology);
    const enginePreset = getPresetById(world.sound.presetId);
    assert(!!enginePreset, `${world.id}: engine preset metadata exists`);
    assert(
      enginePreset!.synth.oscillator.length > 0,
      `${world.id}: oscillator type defined in preset JSON`,
    );
  }

  await adapter.destroy();

  const bundled = listBundledEnginePresetIds();
  const worldPresetIds = new Set(PRESET_WORLDS.map((w) => w.sound.presetId));
  const unreachable = bundled.filter((id) => !worldPresetIds.has(id));

  console.info('[verify-presets] All preset checks passed.', {
    enginePresets: enginePresets.length,
    worlds: PRESET_WORLDS.length,
    speciesCovered: [...speciesUsed],
    worldSoundPresets: PRESET_WORLDS.map((w) => `${w.id}→${w.sound.presetId}`),
    unreachableViaWorlds: unreachable,
  });
}

main().catch((error: unknown) => {
  console.error('[verify-presets] FAILED:', error);
  process.exit(1);
});
