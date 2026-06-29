/**
 * QWERTY keyboard performance input module.
 */

import type {
  DeviceConnectionState,
  InteractionModule,
  InteractionModuleContext,
} from '@/interaction/types.ts';
import { applyVelocityCurve } from '@/interaction/velocity.ts';

const LOG_PREFIX = '[Keyboard]';

/** Default chromatic key map (white keys row + extensions). */
export const DEFAULT_KEY_MAP: Readonly<Record<string, number>> = {
  a: 0,
  w: 1,
  s: 2,
  e: 3,
  d: 4,
  f: 5,
  t: 6,
  g: 7,
  y: 8,
  h: 9,
  u: 10,
  j: 11,
};

/** Computer keyboard input module. */
export class KeyboardModule implements InteractionModule {
  readonly id = 'keyboard' as const;

  private context: InteractionModuleContext | null = null;
  private octave = 4;
  private activeKeys = new Set<string>();
  private sustainHeld = false;
  private sustainedNotes = new Set<number>();
  private unsubscribeSettings: (() => void) | null = null;

  init(context: InteractionModuleContext): void {
    this.context = context;
    this.octave = context.getSettings().defaultOctave;
    this.unsubscribeSettings = context.onSettingsChange(() => {
      this.octave = context.getSettings().defaultOctave;
    });
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    console.info(`${LOG_PREFIX} ready`);
  }

  destroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.unsubscribeSettings?.();
    this.unsubscribeSettings = null;
    this.context = null;
    this.activeKeys.clear();
    this.sustainedNotes.clear();
  }

  getConnectionState(): DeviceConnectionState {
    return {
      connected: this.context?.getSettings().keyboardEnabled ?? false,
      deviceCount: this.context?.getSettings().keyboardEnabled ? 1 : 0,
      label: 'QWERTY Keyboard',
    };
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    const context = this.context;
    if (!context?.getSettings().keyboardEnabled || e.repeat) return;
    if (this.isEditableTarget(e.target)) return;

    const key = e.key.toLowerCase();

    if (key === 'z') {
      this.octave = Math.max(0, this.octave - 1);
      e.preventDefault();
      return;
    }
    if (key === 'x') {
      this.octave = Math.min(8, this.octave + 1);
      e.preventDefault();
      return;
    }
    if (key === ' ') {
      this.sustainHeld = true;
      e.preventDefault();
      return;
    }
    if (key === 'enter') {
      context.dispatch({ action: { type: 'start' }, source: 'keyboard', timestamp: Date.now() });
      e.preventDefault();
      return;
    }
    if (key === 'escape') {
      context.dispatch({ action: { type: 'stop' }, source: 'keyboard', timestamp: Date.now() });
      e.preventDefault();
      return;
    }

    const offset = DEFAULT_KEY_MAP[key];
    if (offset === undefined || this.activeKeys.has(key)) return;

    const note = 12 * (this.octave + 1) + offset;
    const settings = context.getSettings();
    const velocity = applyVelocityCurve(settings.keyboardVelocity, settings.velocityCurve);

    this.activeKeys.add(key);
    context.dispatch({
      action: { type: 'noteOn', note, velocity },
      source: 'keyboard',
      timestamp: Date.now(),
    });
    e.preventDefault();
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    const context = this.context;
    if (!context?.getSettings().keyboardEnabled) return;

    const key = e.key.toLowerCase();

    if (key === ' ') {
      this.sustainHeld = false;
      for (const note of this.sustainedNotes) {
        context.dispatch({
          action: { type: 'noteOff', note },
          source: 'keyboard',
          timestamp: Date.now(),
        });
      }
      this.sustainedNotes.clear();
      e.preventDefault();
      return;
    }

    const offset = DEFAULT_KEY_MAP[key];
    if (offset === undefined) return;

    const note = 12 * (this.octave + 1) + offset;
    this.activeKeys.delete(key);

    if (this.sustainHeld) {
      this.sustainedNotes.add(note);
      return;
    }

    context.dispatch({
      action: { type: 'noteOff', note },
      source: 'keyboard',
      timestamp: Date.now(),
    });
    e.preventDefault();
  };

  private isEditableTarget(target: EventTarget | null): boolean {
    return (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement
    );
  }
}
