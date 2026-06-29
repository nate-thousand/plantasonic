/**
 * Shell navigation controller — inspector and command palette entry points.
 */

import { eventBus } from '@/runtime/events.ts';
import { closeInspector, isInspectorOpen, openInspector } from './InspectorPanel.ts';
import type { NavCategory } from '../navigation/types.ts';

export type SidebarTab = 'controls' | 'setup';

/** Whether the inspector panel is open. */
export function isSidebarOpen(): boolean {
  return isInspectorOpen();
}

/** Opens inspector for controls or settings category. */
export function openSidebarTab(tab: SidebarTab): void {
  if (tab === 'setup') {
    eventBus.emit('shell:open-settings', undefined);
    return;
  }
  openInspector('sound');
}

export function openNavCategory(category: NavCategory): void {
  openInspector(category);
}

/** Closes the inspector panel. */
export function closeCollapsibleMenu(): void {
  closeInspector();
}

/** Opens or closes the inspector (legacy API). */
export function setSidebarOpen(isOpen: boolean): void {
  if (isOpen) openInspector('sound');
  else closeInspector();
}
