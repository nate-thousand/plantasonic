/**
 * Routes normalized interaction events to runtime methods.
 * The only bridge between input modules and the runtime.
 */

import type { Runtime } from '@/runtime/runtime.ts';
import { eventBus } from '@/runtime/events.ts';
import { ControlCoalescer } from './controlCoalescer.ts';
import type { InteractionEvent, InteractionSource } from './types.ts';

/** Dispatches normalized interaction events to the runtime API. */
export class InputRouter {
  private readonly coalescer = new ControlCoalescer();

  constructor(private readonly runtime: Runtime) {}

  route(event: InteractionEvent): void {
    const { action, source } = event;

    switch (action.type) {
      case 'start':
        this.coalescer.flush(this.runtime);
        this.routeAsync(this.runtime.start(), source, action.type);
        break;
      case 'stop':
        this.coalescer.flush(this.runtime);
        this.routeAsync(this.runtime.stop(), source, action.type);
        break;
      case 'noteOn':
        this.coalescer.flush(this.runtime);
        this.runtime.noteOn(action.note, action.velocity);
        break;
      case 'noteOff':
        this.coalescer.flush(this.runtime);
        this.runtime.noteOff(action.note);
        break;
      case 'setControl':
        this.routeSetControl(action.name, action.value, source);
        break;
      case 'setPreset':
        this.coalescer.flush(this.runtime);
        this.routeAsync(this.runtime.setPreset(action.presetId), source, action.type);
        break;
      case 'setTempo':
        this.routeSetTempo(action.tempo, source);
        break;
    }

    eventBus.emit('interaction:dispatch', { source, action: action.type });
  }

  private routeSetControl(
    name: Parameters<Runtime['setControl']>[0],
    value: number,
    source: InteractionSource,
  ): void {
    if (this.coalescer.shouldCoalesce(source)) {
      this.coalescer.queueControl(name, value, this.runtime);
      return;
    }
    this.coalescer.flush(this.runtime);
    this.runtime.setControl(name, value);
  }

  private routeSetTempo(tempo: number, source: InteractionSource): void {
    if (this.coalescer.shouldCoalesce(source)) {
      this.coalescer.queueTempo(tempo, this.runtime);
      return;
    }
    this.coalescer.flush(this.runtime);
    this.runtime.setTempo(tempo);
  }

  private routeAsync(promise: Promise<void>, source: string, action: string): void {
    void promise.catch((error: unknown) => {
      const err = error instanceof Error ? error : new Error(String(error));
      eventBus.emit('error', { source: `interaction:${action}`, error: err });
      console.error(`[InputRouter] ${action} from ${source}:`, err);
    });
  }
}
