/**
 * Visual language verification — run with: npm run verify:visual
 */

import { PRESET_WORLDS } from '../src/presets/worlds/index.ts';
import { visualIdentityFingerprint } from '../src/visuals/language/identity.ts';

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
    assert(world.identity.icon.length > 0, `${world.id} needs display icon`);
    assert(world.identity.mood.length > 0, `${world.id} needs mood label`);
  }

  console.info('[verify-visual] Visual language checks passed.', {
    worlds: PRESET_WORLDS.length,
    uniqueIdentities: fingerprints.size,
  });
}

main();
