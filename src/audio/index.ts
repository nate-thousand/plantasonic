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
export { ecologyToRuntimeControls, runtimeControlToEcological } from './controlMapping.ts';
