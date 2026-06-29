/**
 * Mouse input enhancements for performance controls.
 */

import type { ControlName } from '@/runtime/types.ts';
import { DEFAULT_CONTROLS } from '@/runtime/types.ts';
import type {
  DeviceConnectionState,
  InteractionModule,
  InteractionModuleContext,
} from '@/interaction/types.ts';

const FINE_ADJUST_FACTOR = 0.25;

/** Mouse interaction module — fine adjustment and double-click reset on sliders. */
export class MouseModule implements InteractionModule {
  readonly id = 'mouse' as const;

  private context: InteractionModuleContext | null = null;
  private cleanupFns: Array<() => void> = [];

  init(context: InteractionModuleContext): void {
    this.context = context;
    this.bindSliders();
  }

  destroy(): void {
    for (const fn of this.cleanupFns) fn();
    this.cleanupFns = [];
    this.context = null;
  }

  getConnectionState(): DeviceConnectionState {
    return { connected: true, deviceCount: 1, label: 'Mouse' };
  }

  private bindSliders(): void {
    const sliders = document.querySelectorAll<HTMLInputElement>('[data-ps-control]');
    for (const slider of sliders) {
      const onPointerDown = (e: PointerEvent): void => {
        if (e.pointerType === 'touch') return;
        slider.dataset.psPointerActive = 'true';
      };

      const onPointerMove = (e: PointerEvent): void => {
        if (slider.dataset.psPointerActive !== 'true' || !e.shiftKey) return;
        const context = this.context;
        if (!context) return;

        const sensitivity = context.getSettings().mouseSensitivity * FINE_ADJUST_FACTOR;
        const delta = e.movementX * sensitivity * 0.5;
        const next = Math.min(100, Math.max(0, Number(slider.value) + delta));
        slider.value = String(Math.round(next));
        this.dispatchSliderValue(slider);
      };

      const onPointerUp = (): void => {
        delete slider.dataset.psPointerActive;
      };

      const onDblClick = (): void => {
        const control = slider.dataset.psControl;
        if (control === 'tempo') {
          slider.value = '72';
          this.context?.dispatch({
            action: { type: 'setTempo', tempo: 72 },
            source: 'mouse',
            timestamp: Date.now(),
          });
          return;
        }
        if (!control || !(control in DEFAULT_CONTROLS)) return;
        const defaultVal = Math.round(DEFAULT_CONTROLS[control as ControlName] * 100);
        slider.value = String(defaultVal);
        this.dispatchSliderValue(slider);
      };

      slider.addEventListener('pointerdown', onPointerDown);
      slider.addEventListener('pointermove', onPointerMove);
      slider.addEventListener('pointerup', onPointerUp);
      slider.addEventListener('dblclick', onDblClick);

      this.cleanupFns.push(() => {
        slider.removeEventListener('pointerdown', onPointerDown);
        slider.removeEventListener('pointermove', onPointerMove);
        slider.removeEventListener('pointerup', onPointerUp);
        slider.removeEventListener('dblclick', onDblClick);
      });
    }
  }

  private dispatchSliderValue(slider: HTMLInputElement): void {
    const context = this.context;
    if (!context) return;

    const control = slider.dataset.psControl;
    const value = Number(slider.value) / 100;

    if (control === 'tempo') {
      context.dispatch({
        action: { type: 'setTempo', tempo: Number(slider.value) },
        source: 'mouse',
        timestamp: Date.now(),
      });
      return;
    }

    if (control && control in DEFAULT_CONTROLS) {
      context.dispatch({
        action: { type: 'setControl', name: control as ControlName, value },
        source: 'mouse',
        timestamp: Date.now(),
      });
    }
  }
}
