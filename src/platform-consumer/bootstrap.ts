import { mountInstrumentApp } from '@plantasonic/platform-demo/instrument-app';
import type { PlatformApplication } from '@plantasonic/platform';

import { plantasonicAppContent } from './appContent.ts';

/** Bootstrap Plantasonic via @plantasonic/platform (replaces legacy runtime shell) */
export async function createPlantasonicPlatformApp(
  container: HTMLElement,
): Promise<PlatformApplication> {
  return mountInstrumentApp(container, plantasonicAppContent);
}
