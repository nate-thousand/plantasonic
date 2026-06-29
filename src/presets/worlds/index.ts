/**
 * Preset world modules — one file per audiovisual world.
 */

import type { PresetWorld } from '../types.ts';
import { flowWorld } from './flowWorld.ts';
import { moldWorld } from './moldWorld.ts';
import { nebulaWorld } from './nebulaWorld.ts';
import { seedWorld } from './seedWorld.ts';
import { zenWorld } from './zenWorld.ts';

/** All registered preset worlds in display order. */
export const PRESET_WORLDS: readonly PresetWorld[] = [
  seedWorld,
  moldWorld,
  flowWorld,
  zenWorld,
  nebulaWorld,
];
