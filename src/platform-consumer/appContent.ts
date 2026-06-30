import type { InstrumentAppContent } from '@plantasonic/platform-demo/instrument-app';

import { plantasonicAppConfig } from './config/appConfig.ts';
import { plantasonicShellConfig } from './config/shellConfig.ts';
import { PLANTASONIC_BRANDING } from './content/branding.ts';
import { PLANTASONIC_DEFAULT_TEMPO } from './content/mappings.ts';
import { PLANTASONIC_DEFAULT_BUNDLE, PLANTASONIC_PRESET_BUNDLES } from './content/presetBundles.ts';
import { PLANTASONIC_PLUGINS } from './content/plugins.ts';

/** App-owned content injected into @plantasonic/platform orchestration */
export const plantasonicAppContent: InstrumentAppContent = {
  application: plantasonicAppConfig,
  shell: plantasonicShellConfig,
  presetBundles: PLANTASONIC_PRESET_BUNDLES,
  browserSeedBundles: [PLANTASONIC_DEFAULT_BUNDLE],
  plugins: PLANTASONIC_PLUGINS,
  branding: {
    eventSource: 'plantasonic',
    presetBrowserLabel: PLANTASONIC_BRANDING.presetBrowserLabel,
    transportTempo: PLANTASONIC_DEFAULT_BUNDLE.ui?.tempo ?? PLANTASONIC_DEFAULT_TEMPO,
  },
};
