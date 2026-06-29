/**
 * GSAP motion controller with reduced-motion support.
 */

import gsap from 'gsap';

export interface MotionOptions {
  animate: boolean;
}

/** Returns whether animations should run. */
export function shouldAnimate(): boolean {
  if (document.documentElement.hasAttribute('data-ps-reduced-motion')) return false;
  if (document.documentElement.hasAttribute('data-ps-motion-off')) return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function setInstant(element: HTMLElement, opacity = 1, y = 0): void {
  element.style.opacity = String(opacity);
  element.style.transform = y === 0 ? '' : `translateY(${String(y)}px)`;
}

/** Animates an overlay panel open. */
export function animateOverlayIn(
  panel: HTMLElement,
  options: MotionOptions = { animate: shouldAnimate() },
): void {
  if (!options.animate) {
    setInstant(panel, 1, 0);
    panel.style.transform = '';
    return;
  }
  gsap.fromTo(
    panel,
    { opacity: 0, y: 16, scale: 0.98 },
    { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: 'power2.out' },
  );
}

/** Animates an overlay panel closed. */
export function animateOverlayOut(
  panel: HTMLElement,
  onComplete: () => void,
  options: MotionOptions = { animate: shouldAnimate() },
): void {
  if (!options.animate) {
    onComplete();
    return;
  }
  gsap.to(panel, {
    opacity: 0,
    y: 8,
    duration: 0.2,
    ease: 'power2.in',
    onComplete,
  });
}

/** Animates backdrop fade in. */
export function animateBackdropIn(backdrop: HTMLElement): void {
  if (!shouldAnimate()) {
    setInstant(backdrop, 1);
    return;
  }
  gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.2 });
}

/** Animates sidebar drawer on mobile. */
export function animateSidebarIn(sidebar: HTMLElement): void {
  if (!shouldAnimate()) return;
  gsap.fromTo(
    sidebar,
    { x: -16, opacity: 0.6 },
    { x: 0, opacity: 1, duration: 0.25, ease: 'power2.out' },
  );
}

/** Subtle stage pulse on preset change. */
export function animatePresetChange(stage: HTMLElement): void {
  if (!shouldAnimate()) return;
  gsap.fromTo(
    stage,
    { opacity: 0.88, scale: 0.998 },
    { opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' },
  );
}

/** Control feedback pulse. */
export function animateControlFeedback(element: HTMLElement): void {
  if (!shouldAnimate()) return;
  gsap.fromTo(element, { scale: 1.04 }, { scale: 1, duration: 0.18, ease: 'power2.out' });
}

/** Loading overlay fade in. */
export function animateLoadingIn(element: HTMLElement): void {
  if (!shouldAnimate()) {
    setInstant(element, 1);
    return;
  }
  gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
}

/** Loading overlay fade out. */
export function animateLoadingOut(element: HTMLElement, onComplete?: () => void): void {
  if (!shouldAnimate()) {
    onComplete?.();
    return;
  }
  const vars: gsap.TweenVars = { opacity: 0, duration: 0.2, ease: 'power2.in' };
  if (onComplete) vars.onComplete = onComplete;
  gsap.to(element, vars);
}

/** Fullscreen stage transition. */
export function animateFullscreenTransition(root: HTMLElement, entering: boolean): void {
  if (!shouldAnimate()) return;
  gsap.fromTo(
    root,
    { opacity: entering ? 0.94 : 1 },
    { opacity: entering ? 1 : 0.96, duration: 0.35, ease: 'power2.inOut' },
  );
}

/** Sidebar close animation. */
export function animateSidebarOut(sidebar: HTMLElement, onComplete?: () => void): void {
  if (!shouldAnimate()) {
    onComplete?.();
    return;
  }
  const vars: gsap.TweenVars = {
    x: -12,
    opacity: 0,
    duration: 0.2,
    ease: 'power2.in',
  };
  if (onComplete) vars.onComplete = onComplete;
  gsap.to(sidebar, vars);
}

/** Floating dock drawer expand. */
export function animateFloatingPanel(panel: HTMLElement, opening: boolean): void {
  if (!shouldAnimate()) return;
  if (opening) {
    gsap.fromTo(
      panel,
      { opacity: 0, y: 12, height: 0 },
      { opacity: 1, y: 0, height: 'auto', duration: 0.28, ease: 'power2.out' },
    );
  }
}

/** Stagger preset card entrance in browser. */
export function animatePresetCards(container: ParentNode): void {
  if (!shouldAnimate()) return;
  const cards = container.querySelectorAll('.ps-preset-card');
  if (cards.length === 0) return;
  gsap.fromTo(
    cards,
    { opacity: 0, y: 14, scale: 0.97 },
    { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out' },
  );
}
