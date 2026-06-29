import {
  bindApplicationShell,
  initShellTheme,
  renderApplicationShell,
} from 'plantasonic-design-system/shell';
import { shellConfig } from './shell-config.ts';
import { bindShellNavigation } from './bindShellNavigation.ts';
import { injectInstrumentStatus } from './injectInstrumentStatus.ts';

const WORKSPACE_ID = 'ps-instrument-root';

/** Ensures shell layout modifiers match instrument config (works with older DS builds). */
function tuneInstrumentShell(root: HTMLElement): void {
  const shell = root.querySelector<HTMLElement>('[data-ps-shell]');
  if (!shell) return;
  shell.classList.add('ps-shell--no-dock', 'ps-shell--inspector-hidden');
  root.querySelector('[data-ps-inspector-toggle]')?.remove();
  root.querySelector('.ps-shell__inspector')?.remove();
  root.querySelector('.ps-shell__dock')?.remove();
}

export interface ApplicationShellHost {
  root: HTMLElement;
  workspace: HTMLElement;
  destroy: () => void;
}

/** Renders and binds the design-system application shell. */
export function installApplicationShell(container: HTMLElement): ApplicationShellHost {
  initShellTheme(shellConfig.theme ?? 'dark');

  container.innerHTML = renderApplicationShell(
    shellConfig,
    `<div id="${WORKSPACE_ID}" class="ps-workspace ps-instrument-workspace"></div>`,
  );

  bindApplicationShell(shellConfig);
  injectInstrumentStatus(container);
  tuneInstrumentShell(container);

  const workspace = container.querySelector<HTMLElement>(`#${WORKSPACE_ID}`);
  if (!workspace) {
    throw new Error('Application shell workspace slot not found');
  }

  const unbindNavigation = bindShellNavigation();

  return {
    root: container,
    workspace,
    destroy: () => {
      unbindNavigation();
      container.innerHTML = '';
    },
  };
}
