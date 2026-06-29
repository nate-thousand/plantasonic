/**
 * Runtime factory — creates a configured runtime with production sound adapter by default.
 */

import { PlantasiaSoundAdapter } from '@/audio/soundAdapter.ts';
import { MockAsciiAdapter } from '@/visuals/mockAsciiAdapter.ts';
import { Runtime, type RuntimeDependencies } from './runtime.ts';

export interface CreateRuntimeOptions {
  /** Override sound adapter (defaults to PlantasiaSoundAdapter). */
  soundAdapter?: RuntimeDependencies['soundAdapter'];
  /** Override ASCII adapter (defaults to MockAsciiAdapter until Phase 6). */
  asciiAdapter?: RuntimeDependencies['asciiAdapter'];
}

/** Creates a runtime instance wired to the real sound engine and mock ASCII adapter. */
export function createRuntime(options: CreateRuntimeOptions = {}): Runtime {
  return new Runtime({
    soundAdapter: options.soundAdapter ?? new PlantasiaSoundAdapter(),
    asciiAdapter: options.asciiAdapter ?? new MockAsciiAdapter(),
  });
}
