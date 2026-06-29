/**
 * Shared application state store for the runtime.
 */

import {
  createInitialRuntimeState,
  type RuntimeState,
  type RuntimeStatePatch,
  type RuntimeSubscriber,
  type Unsubscribe,
} from './types.ts';

/** In-memory state container with subscriber notification. */
export class StateStore {
  private state: RuntimeState = createInitialRuntimeState();
  private readonly subscribers = new Set<RuntimeSubscriber>();

  /** Returns a deep-frozen snapshot of the current state. */
  getState(): Readonly<RuntimeState> {
    return structuredClone(this.state);
  }

  /** Returns mutable internal state reference (runtime use only). */
  getMutableState(): RuntimeState {
    return this.state;
  }

  /** Applies a partial patch without notifying subscribers. */
  applyPatch(patch: RuntimeStatePatch): void {
    if (patch.isPlaying !== undefined) this.state.isPlaying = patch.isPlaying;
    if (patch.preset !== undefined) this.state.preset = patch.preset;
    if (patch.activeNotes !== undefined) this.state.activeNotes = [...patch.activeNotes];
    if (patch.tempo !== undefined) this.state.tempo = patch.tempo;
    if (patch.controls !== undefined) {
      this.state.controls = { ...this.state.controls, ...patch.controls };
    }
    if (patch.performance !== undefined) {
      this.state.performance = { ...this.state.performance, ...patch.performance };
    }
  }

  /** Applies a patch and notifies all subscribers. */
  commit(patch: RuntimeStatePatch): void {
    this.applyPatch(patch);
    this.notify();
  }

  /** Registers a subscriber; returns an unsubscribe function. */
  subscribe(subscriber: RuntimeSubscriber): Unsubscribe {
    this.subscribers.add(subscriber);
    subscriber(this.getState());
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  /** Resets state to initial values. */
  reset(): void {
    this.state = createInitialRuntimeState();
    this.notify();
  }

  private notify(): void {
    const snapshot = this.getState();
    for (const subscriber of this.subscribers) {
      subscriber(snapshot);
    }
  }
}
