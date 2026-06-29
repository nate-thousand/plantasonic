import type { ApplicationShellConfig } from 'plantasonic-design-system/shell';
import { cycleShellTheme } from 'plantasonic-design-system/shell';

export const shellConfig: ApplicationShellConfig = {
  id: 'plantasonic',
  title: 'Plantasonic',
  persistState: true,
  theme: 'dark',
  workspace: 'single',
  regions: {
    header: true,
    sidebar: true,
    workspace: true,
    inspector: false,
    dock: false,
    overlay: true,
  },
  navigation: {
    title: 'Plantasonic',
    breadcrumbs: [{ label: 'Perform' }],
    groups: [
      {
        id: 'perform',
        label: 'Perform',
        items: [{ id: 'perform', label: 'Stage', icon: '◉', active: true, favorite: true }],
      },
      {
        id: 'controls',
        label: 'Controls',
        items: [
          { id: 'sound', label: 'Sound', icon: '♪' },
          { id: 'visuals', label: 'Visuals', icon: '◐' },
          { id: 'environment', label: 'Environment', icon: '⚙' },
        ],
      },
      {
        id: 'library',
        label: 'Library',
        items: [
          { id: 'worlds', label: 'Worlds', icon: '✦' },
          { id: 'settings', label: 'Settings', icon: '☰' },
        ],
      },
    ],
  },
  routes: [
    { id: 'perform', path: '/perform', label: 'Stage' },
    { id: 'sound', path: '/sound', label: 'Sound' },
    { id: 'visuals', path: '/visuals', label: 'Visuals' },
    { id: 'environment', path: '/environment', label: 'Environment' },
    { id: 'worlds', path: '/worlds', label: 'Worlds' },
    { id: 'settings', path: '/settings', label: 'Settings' },
  ],
  // Instrument transport dock — rendered inside the workspace (see AppShell), not DS dock region.
  docks: [
    {
      position: 'bottom',
      visible: false,
      items: [
        { id: 'play', label: 'Play', icon: '▶' },
        { id: 'stop', label: 'Stop', icon: '■' },
        { id: 'sound', label: 'Sound', icon: '♪' },
        { id: 'visuals', label: 'Visuals', icon: '◐' },
        { id: 'environment', label: 'Environment', icon: '⚙' },
      ],
    },
  ],
  // Contextual inspector panels — rendered inside the workspace (see InspectorPanel).
  panels: [
    { id: 'inspector-sound', title: 'Sound', state: 'hidden' },
    { id: 'inspector-visuals', title: 'Visuals', state: 'hidden' },
    { id: 'inspector-environment', title: 'Environment', state: 'hidden' },
  ],
  commands: [
    {
      id: 'theme',
      label: 'Toggle Theme',
      group: 'Environment',
      shortcut: '⌘⇧T',
      keywords: ['dark', 'light', 'appearance'],
      action: () => {
        cycleShellTheme();
      },
    },
  ],
};
