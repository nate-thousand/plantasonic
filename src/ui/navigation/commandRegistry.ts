/**
 * Command palette registry — single source for searchable navigation actions.
 */

import { listPresetWorlds } from '@/presets/registry.ts';
import type { InteractionManager } from '@/interaction/interactionManager.ts';
import type { CommandItem } from './types.ts';
import { eventBus } from '@/runtime/events.ts';

export interface CommandRegistryContext {
  interaction: InteractionManager;
  toggleFocusMode: () => void;
  isFocusMode: () => boolean;
}

/** Builds the full command list for the palette. */
export function buildCommandRegistry(ctx: CommandRegistryContext): CommandItem[] {
  const worlds = listPresetWorlds();
  const items: CommandItem[] = [
    {
      id: 'cmd-play',
      kind: 'action',
      label: 'Play',
      description: 'Start the audiovisual engine',
      category: 'perform',
      shortcut: 'Enter',
      keywords: ['transport', 'start'],
      run: () => {
        ctx.interaction.start('ui');
      },
    },
    {
      id: 'cmd-stop',
      kind: 'action',
      label: 'Stop',
      description: 'Stop the audiovisual engine',
      category: 'perform',
      shortcut: 'Esc',
      keywords: ['transport'],
      run: () => {
        ctx.interaction.stop('ui');
      },
    },
    {
      id: 'cmd-worlds',
      kind: 'navigation',
      label: 'Browse Worlds',
      description: 'Open the audiovisual world browser',
      category: 'sound',
      shortcut: '/',
      keywords: ['presets', 'worlds'],
      run: () => {
        eventBus.emit('shell:open-presets', undefined);
      },
    },
    {
      id: 'cmd-focus',
      kind: 'action',
      label: 'Focus Mode',
      description: 'Hide chrome for immersive performance',
      category: 'perform',
      shortcut: 'P',
      keywords: ['performance', 'distraction', 'minimal'],
      run: () => {
        ctx.toggleFocusMode();
      },
    },
    {
      id: 'cmd-inspector-sound',
      kind: 'navigation',
      label: 'Sound Controls',
      description: 'Tempo and ecology sound parameters',
      category: 'sound',
      keywords: ['tempo', 'bloom', 'mold', 'chaos'],
      run: () => {
        eventBus.emit('shell:open-inspector', { category: 'sound' });
      },
    },
    {
      id: 'cmd-inspector-visuals',
      kind: 'navigation',
      label: 'Visual Controls',
      description: 'Brightness and visual density',
      category: 'visuals',
      keywords: ['brightness', 'density', 'ascii'],
      run: () => {
        eventBus.emit('shell:open-inspector', { category: 'visuals' });
      },
    },
    {
      id: 'cmd-inspector-environment',
      kind: 'navigation',
      label: 'Environment',
      description: 'Theme, motion, and input preferences',
      category: 'environment',
      keywords: ['settings', 'theme', 'accessibility', 'midi'],
      run: () => {
        eventBus.emit('shell:open-inspector', { category: 'environment' });
      },
    },
    {
      id: 'cmd-settings',
      kind: 'navigation',
      label: 'Settings',
      description: 'Input, motion, and display preferences',
      category: 'environment',
      keywords: ['preferences', 'input', 'keyboard'],
      run: () => {
        eventBus.emit('shell:open-settings', undefined);
      },
    },
    {
      id: 'cmd-fullscreen',
      kind: 'action',
      label: 'Fullscreen',
      description: 'Expand the visual stage',
      category: 'environment',
      keywords: ['viewport'],
      run: () => {
        eventBus.emit('shell:toggle-fullscreen', undefined);
      },
    },
    {
      id: 'cmd-help',
      kind: 'navigation',
      label: 'Help',
      description: 'Keyboard shortcuts and guidance',
      category: 'environment',
      keywords: ['shortcuts', 'guide'],
      run: () => {
        eventBus.emit('shell:open-help', undefined);
      },
    },
    {
      id: 'cmd-about',
      kind: 'navigation',
      label: 'About Plantasonic',
      description: 'What this instrument is',
      category: 'environment',
      run: () => {
        eventBus.emit('shell:open-about', undefined);
      },
    },
    ...worlds.map((world): CommandItem => ({
      id: `world-${world.id}`,
      kind: 'world',
      label: world.name,
      description: world.identity.mood,
      category: 'sound',
      keywords: [...world.tags, world.description],
      run: () => {
        ctx.interaction.setPreset(world.id, 'ui');
      },
    })),
    ...(['bloom', 'mold', 'density', 'chaos', 'brightness'] as const).map((name): CommandItem => ({
      id: `param-${name}`,
      kind: 'parameter',
      label: capitalize(name),
      description: `Open ${name} control`,
      category: name === 'brightness' || name === 'density' ? 'visuals' : 'sound',
      keywords: ['control', 'slider', name],
      run: () => {
        const cat = name === 'brightness' || name === 'density' ? 'visuals' : 'sound';
        eventBus.emit('shell:open-inspector', { category: cat });
        document.querySelector(`#ps-control-${name}`)?.scrollIntoView({ behavior: 'smooth' });
      },
    })),
  ];

  return items;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
