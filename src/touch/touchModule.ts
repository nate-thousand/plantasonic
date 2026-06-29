/**
 * Touch input module for mobile performance controls.
 */

import type { ControlName } from '@/runtime/types.ts';
import { DEFAULT_CONTROLS } from '@/runtime/types.ts';
import type {
  DeviceConnectionState,
  InteractionModule,
  InteractionModuleContext,
} from '@/interaction/types.ts';

const LONG_PRESS_MS = 450;

/** Touch interaction module — gestures on stage and responsive sliders. */
export class TouchModule implements InteractionModule {
  readonly id = 'touch' as const;

  private context: InteractionModuleContext | null = null;
  private cleanupFns: Array<() => void> = [];
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private touchStartY = 0;
  private touchStartValue = 0;
  private activeControl: ControlName | 'tempo' | null = null;

  init(context: InteractionModuleContext): void {
    this.context = context;
    this.bindTouchSliders();
    this.bindStageGestures();
  }

  destroy(): void {
    for (const fn of this.cleanupFns) fn();
    this.cleanupFns = [];
    if (this.longPressTimer) clearTimeout(this.longPressTimer);
    this.context = null;
  }

  getConnectionState(): DeviceConnectionState {
    const enabled = this.context?.getSettings().touchEnabled ?? false;
    return {
      connected: enabled && 'ontouchstart' in window,
      deviceCount: enabled && 'ontouchstart' in window ? 1 : 0,
      label: 'Touch',
    };
  }

  private bindTouchSliders(): void {
    const sliders = document.querySelectorAll<HTMLInputElement>('[data-ps-control]');

    for (const slider of sliders) {
      slider.style.touchAction = 'none';

      const onTouchStart = (e: TouchEvent): void => {
        if (!this.context?.getSettings().touchEnabled) return;
        const touch = e.touches[0];
        if (!touch) return;
        this.touchStartY = touch.clientY;
        this.touchStartValue = Number(slider.value);
        const control = slider.dataset.psControl;
        this.activeControl =
          control === 'tempo'
            ? 'tempo'
            : control && control in DEFAULT_CONTROLS
              ? (control as ControlName)
              : null;
      };

      const onTouchMove = (e: TouchEvent): void => {
        if (!this.activeControl || !this.context?.getSettings().touchEnabled) return;
        const touch = e.touches[0];
        if (!touch) return;

        const sensitivity = this.context.getSettings().touchSensitivity;
        const deltaY = (this.touchStartY - touch.clientY) * sensitivity;
        const next = Math.min(100, Math.max(0, this.touchStartValue + deltaY * 0.5));
        slider.value = String(Math.round(next));
        this.dispatchSlider(slider);
        e.preventDefault();
      };

      const onTouchEnd = (): void => {
        this.activeControl = null;
      };

      slider.addEventListener('touchstart', onTouchStart, { passive: true });
      slider.addEventListener('touchmove', onTouchMove, { passive: false });
      slider.addEventListener('touchend', onTouchEnd);

      this.cleanupFns.push(() => {
        slider.removeEventListener('touchstart', onTouchStart);
        slider.removeEventListener('touchmove', onTouchMove);
        slider.removeEventListener('touchend', onTouchEnd);
      });
    }
  }

  private bindStageGestures(): void {
    const stage = document.querySelector('#ps-stage');
    if (!stage) return;

    const onTouchStart = (e: Event): void => {
      if (!this.context?.getSettings().touchEnabled) return;
      const te = e as TouchEvent;
      if (te.touches.length !== 1) return;

      this.longPressTimer = setTimeout(() => {
        this.context?.dispatch({
          action: { type: 'start' },
          source: 'touch',
          timestamp: Date.now(),
        });
      }, LONG_PRESS_MS);
    };

    const onTouchEnd = (): void => {
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }
    };

    stage.addEventListener('touchstart', onTouchStart, { passive: true });
    stage.addEventListener('touchend', onTouchEnd);
    stage.addEventListener('touchcancel', onTouchEnd);

    this.cleanupFns.push(() => {
      stage.removeEventListener('touchstart', onTouchStart);
      stage.removeEventListener('touchend', onTouchEnd);
      stage.removeEventListener('touchcancel', onTouchEnd);
    });
  }

  private dispatchSlider(slider: HTMLInputElement): void {
    const context = this.context;
    if (!context) return;

    if (this.activeControl === 'tempo') {
      context.dispatch({
        action: { type: 'setTempo', tempo: Number(slider.value) },
        source: 'touch',
        timestamp: Date.now(),
      });
      return;
    }

    if (this.activeControl) {
      context.dispatch({
        action: {
          type: 'setControl',
          name: this.activeControl,
          value: Number(slider.value) / 100,
        },
        source: 'touch',
        timestamp: Date.now(),
      });
    }
  }
}
