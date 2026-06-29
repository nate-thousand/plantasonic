/**
 * Audio layer barrel exports.
 */

export type {
  SoundAdapter,
  SoundEngineContract,
  StateSyncSoundAdapter,
  PresetLoadResult,
} from './soundAdapter.ts';
export { PlantasiaSoundAdapter, NullSoundAdapter } from './soundAdapter.ts';
export { PLANTASONIC_PRESET_MAP, resolveEnginePresetId } from './controlMapping.ts';
