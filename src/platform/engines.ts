/**
 * Installed engines — adapters wrap npm packages; source is never embedded.
 */
import { installEngine } from 'plantasonic-design-system/platform/engines';
import type { EngineId } from 'plantasonic-design-system/platform/types';
import { PlantasiaSoundAdapter } from '@/audio/soundAdapter.ts';
import type { StateSyncSoundAdapter } from '@/audio/soundAdapter.ts';
import { PlantasiaAsciiAdapter } from '@/visuals/plantasiaAsciiAdapter.ts';
import type { StateSyncAsciiAdapter } from '@/visuals/plantasiaAsciiAdapter.ts';
import { platformManifest } from './manifest.ts';

export interface InstalledEngineAdapters {
  soundAdapter: StateSyncSoundAdapter;
  asciiAdapter: StateSyncAsciiAdapter;
}

const installed = new Set(platformManifest.engines);

/** Resolve npm package metadata for each installed engine. */
export function getInstalledEngineSpecs() {
  return platformManifest.engines.map((id) => installEngine(id));
}

/** npm package name for an engine, when one is declared in the platform catalog. */
export function enginePackageFor(id: EngineId): string | undefined {
  return installEngine(id).package;
}

export { type EngineId };

/**
 * Create runtime adapters from platform manifest — only installed engines are wired.
 * Plantasonic requires sound + visual; throws if manifest omits them.
 */
export function createEngineAdapters(): InstalledEngineAdapters {
  if (!installed.has('engine.sound') || !installed.has('engine.visual')) {
    throw new Error(
      `Platform manifest must include engine.sound and engine.visual (got: ${platformManifest.engines.join(', ')})`,
    );
  }

  return {
    soundAdapter: new PlantasiaSoundAdapter(),
    asciiAdapter: new PlantasiaAsciiAdapter(),
  };
}
