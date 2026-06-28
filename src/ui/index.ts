/**
 * UI module barrel exports.
 */

export { createTopNav, setNavStatus } from './components/TopNav.ts';
export { createStage, getStageDimensions, getStageElement } from './components/Stage.ts';
export { createControlDock } from './components/ControlDock.ts';
export { createCollapsibleMenu, toggleCollapsibleMenu } from './components/CollapsibleMenu.ts';
export { createAppShell } from './layouts/AppShell.ts';
export type { AppShell, AppShellOptions } from './layouts/AppShell.ts';
