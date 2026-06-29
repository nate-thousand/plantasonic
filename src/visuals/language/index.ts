/**
 * Visual language module barrel exports.
 */

export type {
  AnimationCurve,
  GlyphFamily,
  MotionProfile,
  ParticleBehavior,
  RendererId,
  VisualPattern,
  VisualTransition,
} from './types.ts';

export { GLYPH_FAMILIES, resolveGlyphFamilies } from './glyphFamilies.ts';
export { VISUAL_PATTERNS, resolvePatterns } from './patterns.ts';
export { MOTION_PROFILES, curveToEase, getMotionBaselines } from './motionLanguage.ts';
export {
  AUDIO_VISUAL_MAPPING,
  diffEngineControls,
  pitchToHorizontalPosition,
  pitchToVerticalPosition,
  resolveEngineControls,
  sustainFromActiveNotes,
} from './audioReactiveMapping.ts';
