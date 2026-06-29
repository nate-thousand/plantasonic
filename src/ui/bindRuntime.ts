/**
 * Binds runtime to UI shell components.
 * UI must only call runtime methods — never adapters directly.
 */

import type { Runtime } from '@/runtime/runtime.ts';
import type { AppShell } from './layouts/AppShell.ts';
import { bindControlDock, bindControlSliders } from './components/ControlDock.ts';
import { updateStageStatus, bindStageKeyboard } from './components/Stage.ts';
import { setNavStatus } from './components/TopNav.ts';

/** Connects runtime state and actions to the application shell. */
export function bindRuntimeToShell(runtime: Runtime, _shell: AppShell): () => void {
  const unbindDock = bindControlDock(runtime);
  const unbindSliders = bindControlSliders(runtime);
  const unbindKeyboard = bindStageKeyboard(runtime);

  const unsubscribe = runtime.subscribe((state) => {
    setNavStatus(state.isPlaying ? 'Playing' : 'Ready');
    updateStageStatus(state);
  });

  return () => {
    unbindDock();
    unbindSliders();
    unbindKeyboard();
    unsubscribe();
  };
}
