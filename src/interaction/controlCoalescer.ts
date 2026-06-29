/**
 * Coalesces high-frequency UI control updates to one flush per animation frame.
 * MIDI, keyboard, and automation bypass coalescing for immediate response.
 */

import type { ControlName } from '@/runtime/types.ts';
import type { InteractionSource } from './types.ts';

const COALESCE_SOURCES = new Set<InteractionSource>(['ui', 'mouse', 'touch']);

export interface ControlFlushTarget {
  setControl(name: ControlName, value: number): void;
  setTempo(tempo: number): void;
}

/** Batches UI-sourced slider moves; flushes synchronously for other sources. */
export class ControlCoalescer {
  private readonly pendingControls = new Map<ControlName, number>();
  private pendingTempo: number | undefined;
  private rafId = 0;

  shouldCoalesce(source: InteractionSource): boolean {
    return COALESCE_SOURCES.has(source);
  }

  queueControl(name: ControlName, value: number, target: ControlFlushTarget): void {
    this.pendingControls.set(name, value);
    this.scheduleFlush(target);
  }

  queueTempo(tempo: number, target: ControlFlushTarget): void {
    this.pendingTempo = tempo;
    this.scheduleFlush(target);
  }

  /** Immediately applies any queued UI updates (before notes, transport, presets). */
  flush(target: ControlFlushTarget): void {
    if (this.rafId) {
      if (typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(this.rafId);
      } else {
        globalThis.clearTimeout(this.rafId);
      }
      this.rafId = 0;
    }
    this.applyPending(target);
  }

  private scheduleFlush(target: ControlFlushTarget): void {
    if (this.rafId) return;
    const schedule =
      typeof requestAnimationFrame === 'function'
        ? requestAnimationFrame.bind(globalThis)
        : (callback: FrameRequestCallback): number =>
            globalThis.setTimeout(() => {
              callback(performance.now());
            }, 16);

    this.rafId = schedule(() => {
      this.rafId = 0;
      this.applyPending(target);
    });
  }

  private applyPending(target: ControlFlushTarget): void {
    if (this.pendingTempo !== undefined) {
      target.setTempo(this.pendingTempo);
      this.pendingTempo = undefined;
    }
    for (const [name, value] of this.pendingControls) {
      target.setControl(name, value);
    }
    this.pendingControls.clear();
  }
}
