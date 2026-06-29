/**
 * Maps Plantasonic runtime controls to Plantasia Sound Engine ecological controls.
 */

import type { ControlName, ControlValues } from '@/runtime/types.ts';
import type { EcologyControlState, EcologicalControl } from 'plantasia-sound-engine';

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

/** Converts runtime control values to engine ecology state (0–1). */
export function runtimeControlsToEcology(controls: ControlValues): EcologyControlState {
  return {
    bloom: controls.bloom,
    mold: controls.mold,
    growth: controls.density,
    bacteria: controls.chaos,
    roots: controls.brightness,
  };
}
