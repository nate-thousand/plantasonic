import type { WorkspaceConfig } from '@plantasonic/platform-types';

export const plantasonicWorkspaceConfig: WorkspaceConfig = {
  regions: [
    { id: 'stage', label: 'Stage' },
    { id: 'transport', label: 'Transport' },
    { id: 'inspector', label: 'Inspector' },
    { id: 'preset-browser', label: 'Worlds' },
    { id: 'status', label: 'Status' },
  ],
};
