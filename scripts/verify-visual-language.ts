/**
 * Visual language verification — run with: npm run verify:visual
 */

import { PRESET_WORLDS } from '../src/presets/worlds/index.ts';
import { visualIdentityFingerprint } from '../src/visuals/visualIdentity.ts';
import {
  resolveEngineControls,
  sustainFromActiveNotes,
  pitchToVerticalPosition,
} from '../src/visuals/language/audioReactiveMapping.ts';
import { createInitialRuntimeState } from '../src/runtime/types.ts';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function main(): void {
  assert(PRESET_WORLDS.length >= 5, 'Expected at least 5 preset worlds');

  const fingerprints = new Set<string>();
  for (const world of PRESET_WORLDS) {
    const fp = visualIdentityFingerprint(world.visual);
    assert(!fingerprints.has(fp), `Duplicate visual identity: ${world.id}`);
    fingerprints.add(fp);

    assert(world.visual.glyphFamilies.length >= 1, `${world.id} needs glyph families`);
    assert(world.visual.patterns.length >= 2, `${world.id} needs multiple patterns`);
    assert(world.visual.presetId.length > 0, `${world.id} needs engine preset id`);
  }

  const state = createInitialRuntimeState();
  state.controls.bloom = 0.8;
  state.performance.energy = 0.6;
  state.performance.velocity = 0.9;
  state.performance.activity = 0.4;
  state.activeNotes = [60, 64, 67];

  const controls = resolveEngineControls(state);
  assert(controls.strength > state.controls.bloom, 'Energy should modulate strength');
  assert(controls.trailAmount > state.controls.brightness, 'Velocity should modulate trail');
  assert(controls.amplitude > 0, 'Energy should drive amplitude');
  assert(sustainFromActiveNotes(state.activeNotes) > 0, 'Sustain should be positive');
  assert(pitchToVerticalPosition(60) > 0 && pitchToVerticalPosition(60) < 1, 'Pitch maps to Y');

  console.info('[verify-visual] All visual language checks passed.', {
    worlds: PRESET_WORLDS.length,
    uniqueIdentities: fingerprints.size,
  });
}

main();
