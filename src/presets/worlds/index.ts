/**
 * Preset world modules — one file per audiovisual world.
 */

import type { PresetWorld } from '../types.ts';
import { moldWorld } from './moldWorld.ts';
import { seedWorld } from './seedWorld.ts';

/** All registered preset worlds in display order. */
export const PRESET_WORLDS: readonly PresetWorld[] = [seedWorld, moldWorld];
