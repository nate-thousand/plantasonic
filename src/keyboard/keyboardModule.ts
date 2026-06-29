/**
 * QWERTY keyboard performance input module.
 */

import type {
  DeviceConnectionState,
  InteractionModule,
  InteractionModuleContext,
} from '@/interaction/types.ts';
import { eventBus } from '@/runtime/events.ts';
import {
  clampOctave,
  DEFAULT_KEY_MAP,
  isPlayableKey,
  keyboardNoteVelocity,
  noteFromKey,
} from './keyboardLogic.ts';

const LOG_PREFIX = '[Keyboard]';
const KEY_MAP = DEFAULT_KEY_MAP;

/** Computer keyboard input module. */
export class KeyboardModule implements InteractionModule {
  readonly id = 'keyboard' as const;

  private context: InteractionModuleContext | null = null;
  private octave = 4;
  private activeKeys = new Set<string>();
  /** Note number captured at key-down — used for correct note-off after octave shifts. */
  private keyNotes = new Map<string, number>();
  private sustainHeld = false;
  private sustainedNotes = new Set<number>();
  private unsubscribeSettings: (() => void) | null = null;
  private onBlur = (): void => {
    this.releaseAllKeys(true);
  };

  init(context: InteractionModuleContext): void {
    this.context = context;
    this.octave = clampOctave(context.getSettings().defaultOctave);
    this.emitOctave();
    this.unsubscribeSettings = context.onSettingsChange(() => {
      this.onSettingsChanged();
    });
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    console.info(`${LOG_PREFIX} ready`);
  }

  destroy(): void {
    this.releaseAllKeys(true);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    this.unsubscribeSettings?.();
    this.unsubscribeSettings = null;
    this.context = null;
    this.activeKeys.clear();
    this.keyNotes.clear();
    this.sustainedNotes.clear();
    this.sustainHeld = false;
  }

  getConnectionState(): DeviceConnectionState {
    return {
      connected: this.context?.getSettings().keyboardEnabled ?? false,
      deviceCount: this.context?.getSettings().keyboardEnabled ? 1 : 0,
      label: 'QWERTY Keyboard',
    };
  }

  private onSettingsChanged(): void {
    const context = this.context;
    if (!context) return;

    const settings = context.getSettings();
    if (!settings.keyboardEnabled) {
      this.releaseAllKeys(true);
      this.sustainHeld = false;
      this.sustainedNotes.clear();
      return;
    }

    const nextOctave = clampOctave(settings.defaultOctave);
    if (nextOctave !== this.octave) {
      this.shiftOctave(nextOctave - this.octave, false);
    }
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    const context = this.context;
    if (!context?.getSettings().keyboardEnabled || e.repeat) return;
    if (this.shouldIgnoreKeyEvent(e.target)) return;

    const key = e.key.toLowerCase();

    if (key === 'z') {
      this.shiftOctave(-1, true);
      e.preventDefault();
      return;
    }
    if (key === 'x') {
      this.shiftOctave(1, true);
      e.preventDefault();
      return;
    }
    if (key === ' ') {
      this.sustainHeld = true;
      e.preventDefault();
      return;
    }
    if (key === 'enter') {
      if (this.isOverlayOpen()) return;
      context.dispatch({ action: { type: 'start' }, source: 'keyboard', timestamp: Date.now() });
      e.preventDefault();
      return;
    }
    if (key === 'escape') {
      if (this.isOverlayOpen()) return;
      context.dispatch({ action: { type: 'stop' }, source: 'keyboard', timestamp: Date.now() });
      e.preventDefault();
      return;
    }

    if (!isPlayableKey(key, KEY_MAP) || this.activeKeys.has(key)) return;
    this.playKey(key);
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

    if (!isPlayableKey(key, KEY_MAP)) return;
    this.releaseKey(key, false);
    e.preventDefault();
  };

  private playKey(key: string): void {
    const context = this.context;
    if (!context) return;

    const note = noteFromKey(key, this.octave, KEY_MAP);
    if (note === undefined) return;

    const settings = context.getSettings();
    const velocity = keyboardNoteVelocity(settings.keyboardVelocity, settings.velocityCurve);

    this.activeKeys.add(key);
    this.keyNotes.set(key, note);
    context.dispatch({
      action: { type: 'noteOn', note, velocity },
      source: 'keyboard',
      timestamp: Date.now(),
    });
  }

  private releaseKey(key: string, force: boolean): void {
    const context = this.context;
    if (!context) return;

    const note = this.keyNotes.get(key);
    if (note === undefined) return;

    this.activeKeys.delete(key);
    this.keyNotes.delete(key);

    if (!force && this.sustainHeld) {
      this.sustainedNotes.add(note);
      return;
    }

    context.dispatch({
      action: { type: 'noteOff', note },
      source: 'keyboard',
      timestamp: Date.now(),
    });
  }

  private releaseAllKeys(force: boolean): void {
    for (const key of [...this.activeKeys]) {
      this.releaseKey(key, force);
    }
  }

  private shiftOctave(delta: number, persist: boolean): void {
    const held = [...this.activeKeys];
    for (const key of held) {
      this.releaseKey(key, true);
    }
    this.octave = clampOctave(this.octave + delta);
    for (const key of held) {
      this.playKey(key);
    }
    this.emitOctave();
    if (persist) {
      this.context?.updateSettings({ defaultOctave: this.octave });
    }
  }

  private emitOctave(): void {
    eventBus.emit('keyboard:octave', { octave: this.octave });
  }

  private isOverlayOpen(): boolean {
    const host = document.getElementById('ps-overlay-host');
    return host !== null && !host.hidden;
  }

  private shouldIgnoreKeyEvent(target: EventTarget | null): boolean {
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement
    ) {
      return true;
    }
    return target instanceof HTMLElement && target.isContentEditable;
  }
}
