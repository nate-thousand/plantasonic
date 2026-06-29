import { eventBus } from '@/runtime/events.ts';
import type { NavCategory } from '@/ui/navigation/types.ts';

const ROUTE_HANDLERS: Record<string, () => void> = {
  perform: () => {
    eventBus.emit('shell:close-inspector', undefined);
  },
  sound: () => {
    eventBus.emit('shell:open-inspector', { category: 'sound' satisfies NavCategory });
  },
  visuals: () => {
    eventBus.emit('shell:open-inspector', { category: 'visuals' satisfies NavCategory });
  },
  environment: () => {
    eventBus.emit('shell:open-inspector', { category: 'environment' satisfies NavCategory });
  },
  worlds: () => {
    eventBus.emit('shell:open-presets', undefined);
  },
  settings: () => {
    eventBus.emit('shell:open-settings', undefined);
  },
};

/** Wires design-system sidebar routes to Plantasonic shell events. */
export function bindShellNavigation(): () => void {
  const onNavigate = (event: Event): void => {
    const routeId = (event as CustomEvent<{ routeId: string }>).detail.routeId;
    if (!routeId) return;
    ROUTE_HANDLERS[routeId]?.();
  };

  document.addEventListener('ps-shell-navigate', onNavigate);
  return () => {
    document.removeEventListener('ps-shell-navigate', onNavigate);
  };
}
