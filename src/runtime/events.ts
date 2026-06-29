/**
 * Runtime event bus for decoupled communication between UI, runtime, and adapters.
 * Events are typed and dispatched synchronously to registered handlers.
 */

import type { ParameterPath, ParameterValue, PresetId } from './types.ts';
import type { InteractionSource, DeviceConnectionState } from '@/interaction/types.ts';

/** All runtime event names and their payload shapes. */
export interface RuntimeEventMap {
  'runtime:init': { container: HTMLElement };
  'runtime:ready': undefined;
  'runtime:start': undefined;
  'runtime:stop': undefined;
  'runtime:destroy': undefined;
  'preset:load': { presetId: PresetId };
  'preset:loaded': { presetId: PresetId };
  'parameter:set': { path: ParameterPath; value: ParameterValue };
  'viewport:resize': { width: number; height: number };
  'viewport:fullscreen': { isFullscreen: boolean };
  'shell:panel-open': undefined;
  'shell:panel-close': undefined;
  'input:noteOn': { note: number; velocity: number };
  'input:noteOff': { note: number };
  'control:set': { name: string; value: number };
  'tempo:set': { tempo: number };
  'interaction:dispatch': { source: InteractionSource; action: string };
  'midi:connection': DeviceConnectionState;
  'keyboard:octave': { octave: number };
  error: { source: string; error: Error };
}

export type RuntimeEventName = keyof RuntimeEventMap;

type EventHandler<T> = (payload: T) => void;

/** Typed publish/subscribe event bus. */
export class EventBus {
  private readonly handlers = new Map<RuntimeEventName, Set<EventHandler<unknown>>>();

  /** Registers a handler for a specific event. */
  on<K extends RuntimeEventName>(event: K, handler: EventHandler<RuntimeEventMap[K]>): () => void {
    const set = this.handlers.get(event) ?? new Set();
    set.add(handler as EventHandler<unknown>);
    this.handlers.set(event, set);

    return () => {
      set.delete(handler as EventHandler<unknown>);
    };
  }

  /** Dispatches an event to all registered handlers. */
  emit<K extends RuntimeEventName>(event: K, payload: RuntimeEventMap[K]): void {
    const set = this.handlers.get(event);
    if (!set) return;

    for (const handler of set) {
      (handler as EventHandler<RuntimeEventMap[K]>)(payload);
    }
  }

  /** Removes all handlers (used during teardown). */
  clear(): void {
    this.handlers.clear();
  }
}

/** Singleton event bus instance used by the runtime. */
export const eventBus = new EventBus();
