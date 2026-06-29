/**
 * Interaction layer factory and exports.
 */

import type { Runtime } from '@/runtime/runtime.ts';
import { SettingsStore } from '@/services/settingsStore.ts';
import { KeyboardModule } from '@/keyboard/keyboardModule.ts';
import { MidiModule, setMidiLearnBridge } from '@/midi/midiModule.ts';
import { MouseModule } from '@/mouse/mouseModule.ts';
import { TouchModule } from '@/touch/touchModule.ts';
import { InteractionManager } from './interactionManager.ts';

export type {
  DeviceConnectionState,
  InteractionAction,
  InteractionEvent,
  InteractionModule,
  InteractionModuleContext,
  InteractionSettingsSnapshot,
  InteractionSource,
  MidiLearnMapping,
  MidiLearnTarget,
  VelocityCurve,
} from './types.ts';

export { InteractionManager } from './interactionManager.ts';
export { InputRouter } from './inputRouter.ts';
export { applyVelocityCurve, midiVelocityToRuntime } from './velocity.ts';

/** Creates a fully wired interaction manager with all input modules. */
export function createInteractionManager(runtime: Runtime): InteractionManager {
  const settings = new SettingsStore();
  const manager = new InteractionManager(runtime, settings);

  setMidiLearnBridge({
    getLearnTarget: () => manager.getLearnTarget(),
    completeLearn: (cc, channel) => {
      manager.completeMidiLearn(cc, channel);
    },
  });

  manager.register(new KeyboardModule());
  manager.register(new MouseModule());
  manager.register(new TouchModule());
  manager.register(new MidiModule());

  return manager;
}
