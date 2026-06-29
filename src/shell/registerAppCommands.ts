import type { InteractionManager } from '@/interaction/interactionManager.ts';
import { registerShellCommands, type ShellCommand } from 'plantasonic-design-system/shell';
import { buildCommandRegistry } from '@/ui/navigation/commandRegistry.ts';

export interface AppCommandContext {
  interaction: InteractionManager;
  toggleFocusMode: () => void;
  isFocusMode: () => boolean;
}

/** Registers instrument commands with the design-system command palette. */
export function registerAppCommands(ctx: AppCommandContext): void {
  const items = buildCommandRegistry(ctx);
  const commands: ShellCommand[] = items.map((item) => {
    const cmd: ShellCommand = {
      id: item.id,
      label: item.label,
      group: capitalize(item.category ?? 'App'),
      action: item.run,
    };
    if (item.shortcut) cmd.shortcut = item.shortcut;
    if (item.keywords) cmd.keywords = [...item.keywords];
    return cmd;
  });

  registerShellCommands(commands);
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
