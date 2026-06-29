/**
 * Primary application layout — instrument stage, inspector, and transport.
 * Mounted inside the design-system application shell workspace.
 */

import { eventBus } from '@/runtime/events.ts';
import { createStage, getStageDimensions } from '../components/Stage.ts';
import { createControlDock } from '../components/ControlDock.ts';
import { closeInspector, createInspectorPanel } from '../components/InspectorPanel.ts';
import { animateFullscreenTransition } from '../motion/motionController.ts';
import { setNavStatus } from '@/shell/instrumentStatus.ts';

export interface AppShellOptions {
  mountTarget: HTMLElement;
  onResize?: (width: number, height: number) => void;
}

export interface AppShell {
  root: HTMLElement;
  stage: HTMLElement;
  destroy: () => void;
}

export function createAppShell(options: AppShellOptions): AppShell {
  const root = document.createElement('div');
  root.className = 'ps-app ps-instrument';
  root.id = 'ps-app';

  const main = document.createElement('div');
  main.className = 'ps-main';

  const backdrop = document.createElement('button');
  backdrop.type = 'button';
  backdrop.className = 'ps-inspector-backdrop';
  backdrop.id = 'ps-inspector-backdrop';
  backdrop.hidden = true;
  backdrop.setAttribute('aria-label', 'Close inspector');
  backdrop.addEventListener('click', () => {
    closeInspector();
  });

  const inspector = createInspectorPanel();
  const stage = createStage({ fullscreenTarget: root });
  const transport = createControlDock();

  main.append(backdrop, inspector, stage, transport);
  root.append(main);
  options.mountTarget.replaceChildren(root);

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

  const unsubFullscreen = eventBus.on('shell:toggle-fullscreen', () => {
    void toggleFullscreen(root);
  });

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return;
    const palette = document.querySelector('[data-ps-command-palette]');
    if (palette instanceof HTMLElement && !palette.hidden) return;
    const overlay = document.querySelector('#ps-overlay-host');
    if (overlay instanceof HTMLElement && !overlay.hidden) return;
    closeInspector();
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
      unsubFullscreen();
      closeInspector();
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
