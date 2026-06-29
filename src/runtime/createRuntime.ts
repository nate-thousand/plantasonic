/**
 * Runtime factory — creates a configured runtime with production sound adapter by default.
 */

import { PlantasiaSoundAdapter } from '@/audio/soundAdapter.ts';
import { PlantasiaAsciiAdapter } from '@/visuals/plantasiaAsciiAdapter.ts';
import { Runtime, type RuntimeDependencies } from './runtime.ts';

export interface CreateRuntimeOptions {
  /** Override sound adapter (defaults to PlantasiaSoundAdapter). */
  soundAdapter?: RuntimeDependencies['soundAdapter'];
  /** Override ASCII adapter (defaults to PlantasiaAsciiAdapter). */
  asciiAdapter?: RuntimeDependencies['asciiAdapter'];
}

/** Creates a runtime instance wired to the real sound and ASCII visual engines. */
export function createRuntime(options: CreateRuntimeOptions = {}): Runtime {
  return new Runtime({
    soundAdapter: options.soundAdapter ?? new PlantasiaSoundAdapter(),
    asciiAdapter: options.asciiAdapter ?? new PlantasiaAsciiAdapter(),
  });
}
