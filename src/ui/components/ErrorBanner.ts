/**
 * User-facing error banner — maps runtime errors to friendly guidance.
 */

import { eventBus } from '@/runtime/events.ts';

const MESSAGES: Record<string, string> = {
  'runtime:init': 'Unable to start the instrument. Refresh the page and try again.',
  'runtime:setPreset': 'That preset could not be loaded. Choose another preset.',
  'soundAdapter:init': 'Audio engine unavailable. Check browser audio permissions.',
  'soundAdapter:start': 'Audio could not start. Click Play after interacting with the page.',
  'asciiAdapter:init': 'Visual engine unavailable. Refresh and try again.',
  'interaction:midi': 'MIDI unavailable in this browser. Use keyboard or on-screen controls.',
};

function resolveMessage(source: string, error: Error): string {
  for (const [prefix, message] of Object.entries(MESSAGES)) {
    if (source.startsWith(prefix)) return message;
  }
  if (error.message.includes('audio')) {
    return 'Audio is blocked. Interact with the page, then press Play.';
  }
  if (error.message.includes('MIDI') || error.message.includes('midi')) {
    return 'MIDI is not available. Enable it in Settings or use keyboard controls.';
  }
  return 'Something went wrong. Try again or refresh the page.';
}

/** Mounts a dismissible error banner and listens to runtime event bus. */
export function bindErrorBanner(host: HTMLElement): () => void {
  const banner = document.createElement('div');
  banner.className = 'ps-error-banner';
  banner.id = 'ps-error-banner';
  banner.setAttribute('role', 'alert');
  banner.hidden = true;
  banner.innerHTML = `
    <p class="ps-error-banner__text" id="ps-error-banner-text"></p>
    <button type="button" class="btn btn-sm btn-outline-light" id="ps-error-banner-dismiss">Dismiss</button>
  `;
  host.appendChild(banner);

  const text = banner.querySelector('#ps-error-banner-text');
  const dismiss = banner.querySelector('#ps-error-banner-dismiss');

  const hide = (): void => {
    banner.hidden = true;
  };

  dismiss?.addEventListener('click', hide);

  const unsubscribe = eventBus.on('error', ({ source, error }) => {
    if (text) text.textContent = resolveMessage(source, error);
    banner.hidden = false;
  });

  return () => {
    unsubscribe();
    banner.remove();
  };
}
