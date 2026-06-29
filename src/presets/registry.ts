/**
 * Preset world registry — single source of truth for audiovisual worlds.
 */

import { DEFAULT_CONTROLS, type ControlValues } from '@/runtime/types.ts';
import type { PresetId } from '@/runtime/types.ts';
import type { PresetManifest, PresetWorld, PresetWorldMeta } from './types.ts';
import { PRESET_WORLDS } from './worlds/index.ts';

/** Current manifest version. */
export const PRESET_MANIFEST_VERSION = '1.0.0';

/** Registered preset manifest. */
export const presetManifest: PresetManifest = {
  version: PRESET_MANIFEST_VERSION,
  worlds: PRESET_WORLDS,
};

const worldById = new Map<PresetId, PresetWorld>(PRESET_WORLDS.map((world) => [world.id, world]));

/** Returns a preset world by app-level id, if registered. */
export function resolvePresetWorld(id: PresetId): PresetWorld | undefined {
  return worldById.get(id);
}

/** Returns metadata for all registered preset worlds. */
export function listPresetWorlds(): readonly PresetWorldMeta[] {
  return PRESET_WORLDS.map(({ id, name, description, tags, version, identity }) => ({
    id,
    name,
    description,
    tags,
    version,
    identity,
  }));
}

/**
 * Merges world defaults with optional engine-returned controls.
 * World defaults take precedence over engine ecology defaults.
 */
export function mergeWorldDefaults(
  world: PresetWorld,
  engineControls?: ControlValues,
): { controls: ControlValues; tempo: number } {
  const controls: ControlValues = {
    ...DEFAULT_CONTROLS,
    ...engineControls,
    ...world.defaults.controls,
  };
  const tempo = world.defaults.tempo ?? 72;
  return { controls, tempo };
}
