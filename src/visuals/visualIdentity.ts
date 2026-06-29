/**
 * Applies preset visual identity to the ASCII engine.
 */

import type { AsciiEngine } from 'ascii-visual-engine';
import type { PresetVisualConfig } from '@/presets/types.ts';
import { getMotionBaselines } from './language/motionLanguage.ts';

/** Applies visual identity baselines and engine overrides after preset load. */
export function applyVisualIdentity(engine: AsciiEngine, visual: PresetVisualConfig): void {
  const baselines = getMotionBaselines(visual.motion);

  for (const [control, value] of Object.entries(baselines)) {
    engine.setControl(control, value);
  }

  if (visual.engineControls) {
    for (const [control, value] of Object.entries(visual.engineControls)) {
      engine.setControl(control, value);
    }
  }

  try {
    engine.setQualityPreset(visual.quality ?? 'medium');
  } catch {
    /* quality preset may not be available in all engine versions */
  }
}

/** Returns a fingerprint for comparing visual identity uniqueness. */
export function visualIdentityFingerprint(visual: PresetVisualConfig): string {
  return [
    visual.presetId,
    visual.glyphFamilies.join('+'),
    visual.patterns.join('+'),
    visual.motion,
    visual.transition,
    visual.palette,
    visual.particleBehavior,
  ].join('|');
}
