/**
 * UI module barrel exports.
 */

export { createTopNav, setNavStatus } from './components/TopNav.ts';
export {
  createStage,
  getStageDimensions,
  getStageElement,
  updateStageStatus,
} from './components/Stage.ts';
export {
  bindInteractionSettings,
  startControlMidiLearn,
} from './components/InteractionSettings.ts';
export {
  createControlDock,
  bindControlDock,
  bindControlSliders,
} from './components/ControlDock.ts';
export { createCollapsibleMenu, toggleCollapsibleMenu } from './components/CollapsibleMenu.ts';
export { createAppShell } from './layouts/AppShell.ts';
export type { AppShell, AppShellOptions } from './layouts/AppShell.ts';
export { bindRuntimeToShell } from './bindRuntime.ts';
