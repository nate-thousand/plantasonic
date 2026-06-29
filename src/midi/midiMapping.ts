/**
 * Resolves MIDI CC mappings to runtime actions.
 */

import type { ControlName } from '@/runtime/types.ts';
import type {
  InteractionModuleContext,
  MidiLearnMapping,
  MidiLearnTarget,
} from '@/interaction/types.ts';

/** Applies a learned CC value to the runtime via the interaction context. */
export function applyCcMapping(
  context: InteractionModuleContext,
  mapping: MidiLearnMapping,
  value: number,
): void {
  const normalized = Math.min(1, Math.max(0, value / 127));
  const target = mapping.target;

  switch (target.type) {
    case 'control':
      context.dispatch({
        action: { type: 'setControl', name: target.name, value: normalized },
        source: 'midi',
        timestamp: Date.now(),
      });
      break;
    case 'tempo':
      context.dispatch({
        action: { type: 'setTempo', tempo: Math.round(40 + normalized * 140) },
        source: 'midi',
        timestamp: Date.now(),
      });
      break;
    case 'transport':
      if (normalized > 0.5) {
        context.dispatch({
          action: { type: target.action },
          source: 'midi',
          timestamp: Date.now(),
        });
      }
      break;
  }
}

/** Finds a mapping for CC/channel pair. */
export function findCcMapping(
  mappings: readonly MidiLearnMapping[],
  cc: number,
  channel: number,
): MidiLearnMapping | undefined {
  return mappings.find((m) => m.cc === cc && (m.channel === channel || m.channel === 0));
}

/** Default Akai MPK Mini style CC hints (user can override via learn). */
export const DEFAULT_MPK_MINI_CC_HINTS: ReadonlyArray<{ cc: number; name: ControlName }> = [
  { cc: 1, name: 'bloom' },
  { cc: 2, name: 'mold' },
  { cc: 3, name: 'density' },
  { cc: 4, name: 'chaos' },
  { cc: 5, name: 'brightness' },
];

export type { MidiLearnTarget };
