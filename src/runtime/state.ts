/**
 * Shared application state store.
 * Provides immutable read access and subscription-based updates.
 * Implementation will coordinate with adapters in future phases.
 */

import type { AppState, AppStatePatch, StateSubscriber, Unsubscribe } from './types.ts';

const createInitialState = (): AppState => ({
  transport: {
    phase: 'idle',
    isPlaying: false,
    activePresetId: null,
  },
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    isFullscreen: false,
  },
  performance: {
    targetFrameRate: 60,
    audioLatencyHint: 'interactive',
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  },
  parameters: {},
});

/** In-memory state container with subscriber notification. */
export class StateStore {
  private state: AppState = createInitialState();
  private readonly subscribers = new Set<StateSubscriber>();

  /** Returns a frozen snapshot of the current state. */
  getState(): Readonly<AppState> {
    return this.state;
  }

  /** Applies a partial patch and notifies subscribers. */
  patch(update: AppStatePatch): void {
    this.state = {
      transport: { ...this.state.transport, ...update.transport },
      viewport: { ...this.state.viewport, ...update.viewport },
      performance: { ...this.state.performance, ...update.performance },
      parameters: { ...this.state.parameters, ...update.parameters },
    };
    this.notify(update);
  }

  /** Registers a subscriber; returns an unsubscribe function. */
  subscribe(subscriber: StateSubscriber): Unsubscribe {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  private notify(patch: AppStatePatch): void {
    const snapshot = this.getState();
    for (const subscriber of this.subscribers) {
      subscriber(snapshot, patch);
    }
  }
}

/** Singleton state store instance used by the runtime. */
export const stateStore = new StateStore();
