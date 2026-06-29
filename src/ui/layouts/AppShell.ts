/**
 * Primary application layout shell.
 * Composes top nav, collapsible menu, stage, and control dock.
 */

import { eventBus } from '@/runtime/events.ts';
import { createTopNav, setNavStatus } from '../components/TopNav.ts';
import { createStage, getStageDimensions } from '../components/Stage.ts';
import { createControlDock } from '../components/ControlDock.ts';
import {
  closeCollapsibleMenu,
  createCollapsibleMenu,
  isSidebarOpen,
  setSidebarOpen,
} from '../components/CollapsibleMenu.ts';
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
  const root = document.createElement('div');
  root.className = 'ps-app';
  root.id = 'ps-app';

  const nav = createTopNav({
    onMenuToggle: () => {
      setSidebarOpen(!isSidebarOpen());
    },
    onFullscreenToggle: () => {
      void toggleFullscreen(root);
    },
  });

  const main = document.createElement('div');
  main.className = 'ps-main';

  const backdrop = document.createElement('button');
  backdrop.type = 'button';
  backdrop.className = 'ps-sidebar-backdrop';
  backdrop.id = 'ps-sidebar-backdrop';
  backdrop.hidden = true;
  backdrop.setAttribute('aria-label', 'Close performance panel');
  backdrop.addEventListener('click', () => {
    closeCollapsibleMenu();
  });

  const sidebar = createCollapsibleMenu();
  const stage = createStage({ fullscreenTarget: root });
  const dock = createControlDock();

  main.append(backdrop, sidebar, stage);
  root.append(nav, main, dock);

  let resizeObserver: ResizeObserver | undefined;
  let resizeRaf = 0;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        const dims = getStageDimensions();
        options.onResize?.(dims.width, dims.height);
      });
    });
    resizeObserver.observe(stage);
  } else {
    const dims = getStageDimensions();
    options.onResize?.(dims.width, dims.height);
  }

  const onFullscreenChange = (): void => {
    const isFullscreen = document.fullscreenElement === root;
    root.classList.toggle('ps-app--fullscreen', isFullscreen);
    animateFullscreenTransition(root, isFullscreen);
    if (isFullscreen) {
      setNavStatus('Fullscreen');
    }
    eventBus.emit('viewport:fullscreen', { isFullscreen });
    const dims = getStageDimensions();
    options.onResize?.(dims.width, dims.height);
  };
  document.addEventListener('fullscreenchange', onFullscreenChange);

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !isSidebarOpen()) return;
    const overlay = document.querySelector('#ps-overlay-host');
    if (overlay instanceof HTMLElement && !overlay.hidden) return;
    event.preventDefault();
    closeCollapsibleMenu();
  };
  document.addEventListener('keydown', onKeyDown);

  return {
    root,
    stage,
    destroy: () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeObserver?.disconnect();
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('keydown', onKeyDown);
      closeCollapsibleMenu();
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
