/**
 * Preset manifest structure.
 * Defines how preset worlds are registered and discovered.
 * No preset definitions exist yet — structure only.
 */

import type { PresetId } from '@/runtime/types.ts';

/** Metadata describing a preset world. */
export interface PresetWorldMeta {
  id: PresetId;
  name: string;
  description: string;
  tags: string[];
  version: string;
}

/** Manifest containing all registered preset worlds. */
export interface PresetManifest {
  version: string;
  worlds: PresetWorldMeta[];
}

/** Current manifest — empty until preset worlds are authored. */
export const presetManifest: PresetManifest = {
  version: '0.0.0',
  worlds: [],
};

/** Returns a preset world by identifier, if registered. */
export function getPresetWorld(id: PresetId): PresetWorldMeta | undefined {
  return presetManifest.worlds.find((world) => world.id === id);
}

/** Returns all registered preset worlds. */
export function listPresetWorlds(): readonly PresetWorldMeta[] {
  return presetManifest.worlds;
}
