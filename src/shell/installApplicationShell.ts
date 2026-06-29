import {
  bindApplicationShell,
  initShellTheme,
  renderApplicationShell,
} from 'plantasonic-design-system/shell';
import { shellConfig } from './shell-config.ts';
import { bindShellNavigation } from './bindShellNavigation.ts';
import { injectInstrumentStatus } from './injectInstrumentStatus.ts';

const WORKSPACE_ID = 'ps-instrument-root';

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
