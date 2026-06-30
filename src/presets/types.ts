/**
 * Unified preset world types — one audiovisual identity per preset.
 */

import type { ControlValues, PresetId } from './controls.ts';
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

/** UI-facing audiovisual identity — presentation metadata only. */
export interface PresetWorldIdentity {
  /** Display icon (emoji or single glyph). */
  icon: string;
  /** Short mood label shown on preset cards. */
  mood: string;
  /** Motion language descriptor for the world. */
  motionStyle: string;
  /** CSS modifier for card thumbnail accent (`ps-world--{accent}`). */
  accent: 'seed' | 'mold' | 'flow' | 'zen' | 'nebula';
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
  identity: PresetWorldIdentity;
  sound: PresetEngineRef;
  visual: PresetVisualConfig;
  defaults: PresetWorldDefaults;
}

/** Metadata-only view for UI listing. */
export type PresetWorldMeta = Pick<
  PresetWorld,
  'id' | 'name' | 'description' | 'tags' | 'version' | 'identity'
>;

/** Manifest containing all registered preset worlds. */
export interface PresetManifest {
  version: string;
  worlds: readonly PresetWorld[];
}
