import { createStatus } from '@/ui/controls/index.ts';

const STATUS_ID = 'ps-runtime-status';

/** Adds the live runtime status pill to the application shell top bar. */
export function injectInstrumentStatus(root: HTMLElement): void {
  if (root.querySelector(`#${STATUS_ID}`)) return;

  const topbar = root.querySelector('.ps-shell__topbar');
  if (!topbar) return;

  const focusBtn = document.createElement('button');
  focusBtn.type = 'button';
  focusBtn.className = 'ps-shell__topbar-action ps-shell__topbar-action--focus';
  focusBtn.id = 'ps-focus-mode-toggle';
  focusBtn.setAttribute('aria-label', 'Toggle focus mode');
  focusBtn.setAttribute('aria-pressed', 'false');
  focusBtn.title = 'Focus mode (P)';
  focusBtn.innerHTML = '<span class="ps-shell__topbar-action-label">Focus</span>';

  const status = createStatus({
    id: STATUS_ID,
    label: 'Ready',
    live: true,
    className: 'ps-shell__runtime-status',
  });

  const commandTrigger = topbar.querySelector('[data-ps-command-trigger]');
  if (commandTrigger) {
    topbar.insertBefore(status, commandTrigger);
    topbar.insertBefore(focusBtn, commandTrigger);
  } else {
    topbar.append(status, focusBtn);
  }
}
