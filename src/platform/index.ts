/**
 * Plantasonic platform client — lightweight layer on shared ecosystem infrastructure.
 */
export { platformManifest } from './manifest.ts';
export {
  createEngineAdapters,
  getInstalledEngineSpecs,
  enginePackageFor,
  type InstalledEngineAdapters,
} from './engines.ts';
export { platformServices, bootstrapPlatform } from './services.ts';
