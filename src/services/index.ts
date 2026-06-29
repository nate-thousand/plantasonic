/**
 * Shared application services.
 */

export { DEFAULT_INTERACTION_SETTINGS, SettingsStore } from './settingsStore.ts';
export type { InteractionSettings } from './settingsStore.ts';
export { bootstrapPlatform, platformManifest, platformServices } from '@/platform/index.ts';
