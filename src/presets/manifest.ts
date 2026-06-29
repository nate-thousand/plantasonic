/**
 * Preset manifest — re-exports registry for backward compatibility.
 * @deprecated Import from `@/presets` or `@/presets/registry.ts` instead.
 */

export type { PresetManifest, PresetWorldMeta } from './types.ts';
export {
  listPresetWorlds,
  presetManifest,
  PRESET_MANIFEST_VERSION,
  resolvePresetWorld,
} from './registry.ts';

/** @deprecated Use resolvePresetWorld */
export { resolvePresetWorld as getPresetWorld } from './registry.ts';
