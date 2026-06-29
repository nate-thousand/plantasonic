/**
 * Motion language — profiles communicate energy, calm, growth, decay, rhythm.
 */

import type { AnimationCurve, MotionProfile } from './types.ts';

export interface MotionProfileDefinition {
  id: MotionProfile;
  label: string;
  description: string;
  /** Baseline engine control values for this motion quality. */
  baselines: Record<string, number>;
  defaultCurve: AnimationCurve;
}

/** Motion profiles map emotional quality to engine control baselines. */
export const MOTION_PROFILES: Record<MotionProfile, MotionProfileDefinition> = {
  energy: {
    id: 'energy',
    label: 'Energy',
    description: 'High amplitude, fast response, vivid motion.',
    baselines: { amplitude: 0.75, flowStrength: 0.6, speed: 1.1 },
    defaultCurve: 'easeOut',
  },
  calm: {
    id: 'calm',
    label: 'Calm',
    description: 'Slow drift, gentle trails, low chaos.',
    baselines: { amplitude: 0.3, randomness: 0.1, trailAmount: 0.5 },
    defaultCurve: 'easeInOut',
  },
  growth: {
    id: 'growth',
    label: 'Growth',
    description: 'Outward expansion, increasing density.',
    baselines: { strength: 0.65, flowStrength: 0.45, decay: 0.15 },
    defaultCurve: 'easeOut',
  },
  decay: {
    id: 'decay',
    label: 'Decay',
    description: 'Fading trails, collapsing structures.',
    baselines: { decay: 0.7, trailAmount: 0.35, strength: 0.4 },
    defaultCurve: 'easeIn',
  },
  rhythm: {
    id: 'rhythm',
    label: 'Rhythm',
    description: 'Tempo-synced pulsing and oscillation.',
    baselines: { frequency: 0.6, amplitude: 0.55, speed: 1.05 },
    defaultCurve: 'linear',
  },
  instability: {
    id: 'instability',
    label: 'Instability',
    description: 'High randomness, glitch, unpredictable motion.',
    baselines: { randomness: 0.7, glitchAmount: 0.5, amplitude: 0.65 },
    defaultCurve: 'spring',
  },
  harmony: {
    id: 'harmony',
    label: 'Harmony',
    description: 'Balanced symmetry, smooth flow.',
    baselines: { symmetry: 0.6, flowStrength: 0.4, randomness: 0.15 },
    defaultCurve: 'easeInOut',
  },
  silence: {
    id: 'silence',
    label: 'Silence',
    description: 'Near-static, minimal motion between inputs.',
    baselines: { amplitude: 0.1, randomness: 0.05, trailAmount: 0.2 },
    defaultCurve: 'linear',
  },
};

/** Returns motion baselines for a profile. */
export function getMotionBaselines(profile: MotionProfile): Record<string, number> {
  return { ...MOTION_PROFILES[profile].baselines };
}

/** GSAP easing name for an animation curve. */
export function curveToEase(curve: AnimationCurve): string {
  const map: Record<AnimationCurve, string> = {
    linear: 'none',
    easeIn: 'power2.in',
    easeOut: 'power2.out',
    easeInOut: 'power2.inOut',
    spring: 'back.out(1.2)',
  };
  return map[curve];
}
