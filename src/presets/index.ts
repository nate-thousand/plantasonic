/**
 * Preset system barrel exports.
 */

export type {
  PresetEngineRef,
  PresetManifest,
  PresetWorld,
  PresetWorldDefaults,
  PresetWorldMeta,
} from './types.ts';

export {
  listPresetWorlds,
  mergeWorldDefaults,
  presetManifest,
  PRESET_MANIFEST_VERSION,
  resolvePresetWorld,
} from './registry.ts';
