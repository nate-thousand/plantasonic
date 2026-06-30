import packageJson from '../../package.json';

export const APP_VERSION = packageJson.version;

export type NavItem = {
  id: string;
  label: string;
  group: string;
  keywords?: string[];
  external?: boolean;
};

export const NAV_GROUPS = ['Platform', 'Foundation', 'Engines', 'Workflow', 'Reference'] as const;

export const NAV: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    group: 'Platform',
    keywords: ['platform', 'home', 'reference', 'ai first'],
  },
  {
    id: 'design-system',
    label: 'Design System',
    group: 'Foundation',
    keywords: ['tokens', 'bootstrap', 'components', 'ds'],
  },
  {
    id: 'theme-system',
    label: 'Theme System',
    group: 'Foundation',
    keywords: ['themes', 'dark', 'light', 'signal', 'plantasia'],
  },
  {
    id: 'components',
    label: 'Components',
    group: 'Foundation',
    keywords: ['shared', 'reusable', 'shell', 'primitives'],
  },
  {
    id: 'templates',
    label: 'Templates',
    group: 'Foundation',
    keywords: ['cli', 'scaffold', 'starter'],
  },
  {
    id: 'audio-engine',
    label: 'Audio Engine',
    group: 'Engines',
    keywords: ['sound', 'plantasia', 'synthesis'],
  },
  {
    id: 'ascii-engine',
    label: 'ASCII Engine',
    group: 'Engines',
    keywords: ['ascii', 'visual', 'terminal'],
  },
  {
    id: 'visual-engine',
    label: 'Visual Engine',
    group: 'Engines',
    keywords: ['visual language', 'glyphs', 'motion'],
  },
  {
    id: 'video-engine',
    label: 'Video Engine',
    group: 'Engines',
    keywords: ['video', 'recording', 'export'],
  },
  {
    id: 'midi',
    label: 'MIDI',
    group: 'Engines',
    keywords: ['midi', 'controller', 'learn'],
  },
  {
    id: 'ai-workflow',
    label: 'AI Workflow',
    group: 'Workflow',
    keywords: ['figma', 'cursor', 'v0', 'vercel', 'mcp'],
  },
  {
    id: 'developer-tools',
    label: 'Developer Tools',
    group: 'Workflow',
    keywords: ['verify', 'validate', 'lint', 'build'],
  },
  {
    id: 'settings',
    label: 'Settings',
    group: 'Workflow',
    keywords: ['preferences', 'persistence', 'theme'],
  },
  {
    id: 'documentation',
    label: 'Documentation',
    group: 'Workflow',
    keywords: ['docs', 'readme', 'roadmap', 'architecture'],
  },
  {
    id: 'instrument',
    label: 'Live Instrument',
    group: 'Reference',
    keywords: ['demo', 'play', 'worlds', 'ecosystem'],
  },
];

export const INSTRUMENT_ROUTE = 'instrument';
export const DEFAULT_ROUTE = 'overview';

export const PLATFORM_INHERITS = [
  'Design System',
  'Theme',
  'Shared Components',
  'Audio Engine',
  'ASCII Engine',
  'Visual Engine',
  'Video Engine',
  'MIDI',
  'AI Services',
  'Templates',
] as const;

export const EXAMPLE_THEMES = [
  {
    id: 'default',
    name: 'Default',
    status: 'active' as const,
    description: 'Platform dark/light tokens — active in this application.',
  },
  {
    id: 'signal-9',
    name: 'Signal 9',
    status: 'supported' as const,
    description:
      'Retro-terminal aesthetic. Applications inherit via theme manifest — not built here.',
  },
  {
    id: 'plantasia',
    name: 'Plantasia',
    status: 'supported' as const,
    description: 'Organic flora palette. Applications inherit via theme manifest — not built here.',
  },
  {
    id: 'future',
    name: 'Future Theme',
    status: 'planned' as const,
    description: 'Reserved slot for upcoming platform themes.',
  },
] as const;

export const AI_WORKFLOW_STEPS = [
  { id: 'figma', label: 'Figma', detail: 'Design source of truth' },
  { id: 'figma-mcp', label: 'Figma MCP', detail: 'Design context in the AI toolchain' },
  { id: 'design-system', label: 'Plantasonic Design System', detail: 'Tokens, components, shell' },
  { id: 'v0', label: 'v0', detail: 'Rapid UI generation against DS patterns' },
  { id: 'cursor', label: 'Cursor', detail: 'AI-assisted implementation' },
  { id: 'github', label: 'GitHub', detail: 'Version control and CI' },
  { id: 'vercel', label: 'Vercel', detail: 'Preview and production deploy' },
  { id: 'application', label: 'Application', detail: 'Platform consumer on @plantasonic/platform' },
] as const;
