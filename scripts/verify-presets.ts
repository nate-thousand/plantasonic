/**
 * Preset validation — run with: npm run verify:presets
 *
 * Validates bundled engine presets and Plantasonic world mappings.
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
import { PLANTASONIC_PRESET_BUNDLES } from '../src/platform-consumer/content/presetBundles.ts';

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
    resume() {
      return Promise.resolve();
    }
    close() {
      return Promise.resolve();
    }
  }
  // @ts-expect-error stub
  globalThis.AudioContext = StubAudioContext;
  // @ts-expect-error stub
  globalThis.webkitAudioContext = StubAudioContext;
}

async function main(): Promise<void> {
  installAudioStub();

  const window = new Window({ url: 'http://localhost/' });
  globalThis.window = window as unknown as Window & typeof globalThis.window;
  globalThis.document = window.document;

  const engineIssues = validateAllPresets([...enginePresets], { strict: false });
  assert(engineIssues.length === 0, `Engine preset validation failed: ${engineIssues.length} issues`);

  const worldIssues = validatePresetWorlds(PRESET_WORLDS);
  assert(worldIssues.length === 0, `World validation failed: ${JSON.stringify(worldIssues)}`);

  assert(PRESET_WORLDS.length === 5, 'Expected 5 preset worlds');
  assert(PLANTASONIC_PRESET_BUNDLES.length === PRESET_WORLDS.length, 'All worlds must map to bundles');

  const controlFingerprints = new Set<string>();
  for (const world of PRESET_WORLDS) {
    const fp = worldControlsFingerprint(world);
    assert(!controlFingerprints.has(fp), `Duplicate control fingerprint: ${world.id}`);
    controlFingerprints.add(fp);

    const preset = getPresetById(world.sound.presetId);
    assert(!!preset, `Missing engine preset: ${world.sound.presetId}`);
    assert(synthSettingsFingerprint(preset).length > 0, `Empty synth fingerprint: ${world.id}`);

    const species = resolvePresetToSpecies(world.sound.presetId);
    assert(species.speciesId.length > 0, `Missing species for ${world.id}`);
  }

  const bundledIds = listBundledEnginePresetIds();
  assert(bundledIds.length > 0, 'Engine must expose bundled presets');

  await window.close();

  console.info('[verify-presets] Preset validation passed.', {
    worlds: PRESET_WORLDS.length,
    enginePresets: bundledIds.length,
    bundles: PLANTASONIC_PRESET_BUNDLES.length,
  });
}

main().catch((error: unknown) => {
  console.error('[verify-presets] FAILED:', error);
  process.exit(1);
});
