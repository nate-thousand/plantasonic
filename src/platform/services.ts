/**
 * Platform services bootstrap — shared infrastructure from the design system.
 * Domain settings (interaction, theme) remain in src/services/* stores.
 */
import { createPlatformServices } from 'plantasonic-design-system/platform/services';
import { platformManifest } from './manifest.ts';

export const platformServices = createPlatformServices(platformManifest.services);

/** One-time platform client initialization at app boot. */
export function bootstrapPlatform(): void {
  platformServices.logging.info(`${platformManifest.name} platform client`, {
    id: platformManifest.id,
    engines: platformManifest.engines,
    services: platformManifest.services,
  });
}
