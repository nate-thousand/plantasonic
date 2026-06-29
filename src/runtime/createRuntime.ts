import { createEngineAdapters } from '@/platform/engines.ts';
import { Runtime, type RuntimeDependencies } from './runtime.ts';

export interface CreateRuntimeOptions {
  /** Override sound adapter (defaults to platform-installed engine.sound). */
  soundAdapter?: RuntimeDependencies['soundAdapter'];
  /** Override ASCII adapter (defaults to platform-installed engine.visual). */
  asciiAdapter?: RuntimeDependencies['asciiAdapter'];
}

/** Creates a runtime wired to platform-installed engine adapters. */
export function createRuntime(options: CreateRuntimeOptions = {}): Runtime {
  const installed = createEngineAdapters();
  return new Runtime({
    soundAdapter: options.soundAdapter ?? installed.soundAdapter,
    asciiAdapter: options.asciiAdapter ?? installed.asciiAdapter,
  });
}
