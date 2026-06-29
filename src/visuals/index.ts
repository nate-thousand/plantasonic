/**
 * Visual layer barrel exports.
 */

export type { AsciiAdapter, AsciiEngineContract } from './asciiAdapter.ts';
export { NullAsciiAdapter } from './asciiAdapter.ts';
export { PlantasiaAsciiAdapter } from './plantasiaAsciiAdapter.ts';
export type { StateSyncAsciiAdapter } from './plantasiaAsciiAdapter.ts';
export { applyVisualIdentity, visualIdentityFingerprint } from './visualIdentity.ts';
export { transitionVisualPreset } from './transitions/visualTransition.ts';
export { VisualProfiler } from './performance/visualProfiler.ts';
export { RENDERER_REGISTRY, resolveQualityForViewport } from './renderer/rendererAbstraction.ts';
export type {
  RendererCapabilities,
  VisualRendererAdapter,
} from './renderer/rendererAbstraction.ts';
export * from './language/index.ts';
