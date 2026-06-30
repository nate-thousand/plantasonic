/**
 * GSAP visual world transitions — UI/scene layer only, not the render loop.
 */

import gsap from 'gsap';
import type { AnimationCurve, VisualTransition } from '../language/types.ts';
import { curveToEase } from '../language/motionLanguage.ts';

function shouldAnimate(): boolean {
  if (document.documentElement.hasAttribute('data-ps-motion-off')) return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface VisualTransitionOptions {
  animate?: boolean;
  style?: VisualTransition;
  curve?: AnimationCurve;
  duration?: number;
}

const TRANSITION_DURATIONS: Record<VisualTransition, number> = {
  crossfade: 0.45,
  dissolve: 0.55,
  cut: 0.01,
  bloom: 0.5,
  collapse: 0.4,
};

/**
 * Runs a GSAP transition around a preset swap on the stage canvas.
 * The ASCII engine render loop continues independently.
 */
export async function transitionVisualPreset(
  canvas: HTMLElement,
  applyPreset: () => void,
  options: VisualTransitionOptions = {},
): Promise<void> {
  const style = options.style ?? 'crossfade';
  const duration = options.duration ?? TRANSITION_DURATIONS[style];
  const animate = options.animate ?? shouldAnimate();

  if (!animate || style === 'cut') {
    applyPreset();
    return;
  }

  const ease = curveToEase(options.curve ?? 'easeInOut');
  const half = duration / 2;

  await new Promise<void>((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });

    if (style === 'bloom') {
      tl.to(canvas, { scale: 1.04, opacity: 0.7, duration: half, ease })
        .call(applyPreset)
        .to(canvas, { scale: 1, opacity: 1, duration: half, ease: 'power2.out' });
      return;
    }

    if (style === 'collapse') {
      tl.to(canvas, { scale: 0.96, opacity: 0.4, duration: half, ease: 'power2.in' })
        .call(applyPreset)
        .fromTo(
          canvas,
          { scale: 1.02, opacity: 0.6 },
          { scale: 1, opacity: 1, duration: half, ease },
        );
      return;
    }

    // crossfade / dissolve
    tl.to(canvas, { opacity: 0, duration: half, ease })
      .call(applyPreset)
      .to(canvas, { opacity: 1, duration: half, ease: 'power2.out' });
  });
}
