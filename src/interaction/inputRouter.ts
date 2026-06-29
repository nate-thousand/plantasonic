/**
 * Routes normalized interaction events to runtime methods.
 * The only bridge between input modules and the runtime.
 */

import type { Runtime } from '@/runtime/runtime.ts';
import { eventBus } from '@/runtime/events.ts';
import type { InteractionEvent } from './types.ts';

/** Dispatches normalized interaction events to the runtime API. */
export class InputRouter {
  constructor(private readonly runtime: Runtime) {}

  route(event: InteractionEvent): void {
    const { action, source } = event;

    switch (action.type) {
      case 'start':
        void this.runtime.start();
        break;
      case 'stop':
        void this.runtime.stop();
        break;
      case 'noteOn':
        this.runtime.noteOn(action.note, action.velocity);
        break;
      case 'noteOff':
        this.runtime.noteOff(action.note);
        break;
      case 'setControl':
        this.runtime.setControl(action.name, action.value);
        break;
      case 'setPreset':
        void this.runtime.setPreset(action.presetId);
        break;
      case 'setTempo':
        this.runtime.setTempo(action.tempo);
        break;
    }

    eventBus.emit('interaction:dispatch', { source, action: action.type });
  }
}
