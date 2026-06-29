/**
 * Unified preset world types — one audiovisual identity per preset.
 */

import type { ControlValues, PresetId } from '@/runtime/types.ts';
import type {
  AnimationCurve,
  GlyphFamily,
  MotionProfile,
  ParticleBehavior,
  RendererId,
  VisualPattern,
  VisualTransition,
} from '@/visuals/language/types.ts';

/** Engine-specific preset reference within a world. */
export interface PresetEngineRef {
  /** Bundled preset id in the external engine package. */
  presetId: string;
}

/** Visual identity configuration for a preset world. */
export interface PresetVisualConfig extends PresetEngineRef {
  glyphFamilies: readonly GlyphFamily[];
  patterns: readonly VisualPattern[];
  motion: MotionProfile;
  transition: VisualTransition;
  renderer: RendererId;
  palette: string;
  animationCurve: AnimationCurve;
  particleBehavior: ParticleBehavior;
  /** Optional engine control overrides applied on preset load. */
  engineControls?: Readonly<Record<string, number>>;
  /** Rendering quality preset for responsive behavior. */
  quality?: 'ultra' | 'high' | 'medium' | 'low' | 'batterySaver';
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
  visual: PresetVisualConfig;
  defaults: PresetWorldDefaults;
}

/** Metadata-only view for UI listing. */
export type PresetWorldMeta = Pick<PresetWorld, 'id' | 'name' | 'description' | 'tags' | 'version'>;

/** Manifest containing all registered preset worlds. */
export interface PresetManifest {
  version: string;
  worlds: readonly PresetWorld[];
}
