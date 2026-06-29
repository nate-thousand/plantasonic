/**
 * Primary application layout shell.
 * Composes top nav, collapsible menu, stage, and control dock.
 */

import { createTopNav, setNavStatus } from '../components/TopNav.ts';
import { createStage, getStageDimensions } from '../components/Stage.ts';
import { createControlDock } from '../components/ControlDock.ts';
import { createCollapsibleMenu, toggleCollapsibleMenu } from '../components/CollapsibleMenu.ts';
import { animateFullscreenTransition } from '../motion/motionController.ts';

export interface AppShellOptions {
  onResize?: (width: number, height: number) => void;
}

export interface AppShell {
  root: HTMLElement;
  stage: HTMLElement;
  destroy: () => void;
}

export function createAppShell(options: AppShellOptions = {}): AppShell {
  let menuOpen = false;

  const root = document.createElement('div');
  root.className = 'ps-app';
  root.id = 'ps-app';

  const nav = createTopNav({
    onMenuToggle: () => {
      menuOpen = !menuOpen;
      toggleCollapsibleMenu(menuOpen);
    },
    onFullscreenToggle: () => {
      void toggleFullscreen(root);
    },
  });

  const main = document.createElement('div');
  main.className = 'ps-main';

  const sidebar = createCollapsibleMenu();
  const stage = createStage({ fullscreenTarget: root });
  const dock = createControlDock();

  main.append(sidebar, stage);
  root.append(nav, main, dock);

  const resizeObserver = new ResizeObserver(() => {
    const dims = getStageDimensions();
    options.onResize?.(dims.width, dims.height);
  });
  resizeObserver.observe(stage);

  const onFullscreenChange = (): void => {
    const isFullscreen = document.fullscreenElement === root;
    root.classList.toggle('ps-app--fullscreen', isFullscreen);
    animateFullscreenTransition(root, isFullscreen);
    setNavStatus(isFullscreen ? 'Fullscreen' : 'Ready');
    const dims = getStageDimensions();
    options.onResize?.(dims.width, dims.height);
  };
  document.addEventListener('fullscreenchange', onFullscreenChange);

  return {
    root,
    stage,
    destroy: () => {
      resizeObserver.disconnect();
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      root.remove();
    },
  };
}

async function toggleFullscreen(element: HTMLElement): Promise<void> {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
  } else {
    await element.requestFullscreen();
  }
}
