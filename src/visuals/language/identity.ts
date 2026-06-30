/**
 * Visual identity helpers — creative taxonomy validation only.
 */

import type { PresetVisualConfig } from '@/presets/types.ts';

/** Returns a fingerprint for comparing visual identity uniqueness across worlds. */
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
