/**
 * UI module barrel exports.
 */

export { setNavStatus } from '@/shell/instrumentStatus.ts';
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
export {
  closeCollapsibleMenu,
  isSidebarOpen,
  openSidebarTab,
  setSidebarOpen,
  openNavCategory,
} from './components/ShellNavigation.ts';
export { createAppShell } from './layouts/AppShell.ts';
export type { AppShell, AppShellOptions } from './layouts/AppShell.ts';
export { bindRuntimeToShell } from './bindRuntime.ts';
export { createAppExperience } from './experience/appExperience.ts';
export type { AppExperience } from './experience/appExperience.ts';
export * from './controls/index.ts';
