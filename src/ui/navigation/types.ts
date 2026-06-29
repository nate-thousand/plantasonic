/**
 * Navigation information architecture types.
 */

/** Primary navigation categories for the contextual inspector. */
export type NavCategory = 'sound' | 'visuals' | 'environment';

/** Command palette item kinds. */
export type CommandKind = 'action' | 'world' | 'parameter' | 'navigation';

/** Searchable command or destination. */
export interface CommandItem {
  id: string;
  kind: CommandKind;
  label: string;
  description?: string;
  keywords?: readonly string[];
  category?: NavCategory | 'perform' | 'environment';
  shortcut?: string;
  run: () => void;
}
