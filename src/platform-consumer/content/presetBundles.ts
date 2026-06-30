import { PRESET_WORLDS } from '@/presets/worlds/index.ts';
import { worldsToPresetBundles } from '@/platform-consumer/worldToBundle.ts';

/** Production Plantasonic worlds as platform PresetBundle entries */
export const PLANTASONIC_PRESET_BUNDLES = worldsToPresetBundles(PRESET_WORLDS);

const defaultBundle =
  PLANTASONIC_PRESET_BUNDLES.find((bundle) => bundle.id === 'seed-world') ??
  PLANTASONIC_PRESET_BUNDLES[0];

if (!defaultBundle) {
  throw new Error('PLANTASONIC_PRESET_BUNDLES must contain at least one world');
}

/** Default boot world (Seed World) */
export const PLANTASONIC_DEFAULT_BUNDLE = defaultBundle;
