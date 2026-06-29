/**
 * Maps Plantasonic runtime controls to Plantasia Sound Engine ecological controls.
 */

import type { ControlName, ControlValues } from '@/runtime/types.ts';
import type { EcologyControlState, EcologicalControl } from 'plantasia-sound-engine';

/** Plantasonic UI preset ids → engine bundled preset ids. */
export const PLANTASONIC_PRESET_MAP: Readonly<Record<string, string>> = {
  'seed-world': 'plantasonic',
  'mold-world': 'vine',
};

/** Resolves a Plantasonic preset id to an engine preset id. */
export function resolveEnginePresetId(presetId: string): string {
  return PLANTASONIC_PRESET_MAP[presetId] ?? presetId;
}

const RUNTIME_TO_ECOLOGY: Record<ControlName, EcologicalControl> = {
  bloom: 'bloom',
  mold: 'mold',
  density: 'growth',
  chaos: 'bacteria',
  brightness: 'roots',
};

/** Maps a runtime control name to an engine ecological control. */
export function runtimeControlToEcological(name: ControlName): EcologicalControl {
  return RUNTIME_TO_ECOLOGY[name];
}

/** Converts engine ecology defaults to runtime control values. */
export function ecologyToRuntimeControls(ecology: EcologyControlState): ControlValues {
  return {
    bloom: ecology.bloom,
    mold: ecology.mold,
    density: ecology.growth,
    chaos: ecology.bacteria,
    brightness: ecology.roots,
  };
}
