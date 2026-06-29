/**
 * Unified preset world types — one audiovisual identity per preset.
 */

import type { ControlValues, PresetId } from '@/runtime/types.ts';

/** Engine-specific preset reference within a world. */
export interface PresetEngineRef {
  /** Bundled preset id in the external engine package. */
  presetId: string;
}

/** Default runtime values applied when a world loads. */
export interface PresetWorldDefaults {
  controls?: Partial<ControlValues>;
  tempo?: number;
}

/**
 * A complete audiovisual preset world.
 * Runtime resolves worlds and passes engine preset ids to adapters.
 */
export interface PresetWorld {
  id: PresetId;
  name: string;
  description: string;
  tags: readonly string[];
  version: string;
  sound: PresetEngineRef;
  visual: PresetEngineRef;
  defaults: PresetWorldDefaults;
}

/** Metadata-only view for UI listing. */
export type PresetWorldMeta = Pick<PresetWorld, 'id' | 'name' | 'description' | 'tags' | 'version'>;

/** Manifest containing all registered preset worlds. */
export interface PresetManifest {
  version: string;
  worlds: readonly PresetWorld[];
}
