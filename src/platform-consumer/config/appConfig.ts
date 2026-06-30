import type { ApplicationConfig } from '@plantasonic/platform-types';

import { plantasonicWorkspaceConfig } from './workspaceConfig.ts';

export const plantasonicAppConfig: ApplicationConfig = {
  id: 'plantasonic',
  name: 'Plantasonic',
  description: 'Browser-based generative audiovisual instrument — a living digital ecosystem.',
  workspace: plantasonicWorkspaceConfig,
  initialStatus: 'idle',
};
