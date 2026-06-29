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

/**
 * Soft sources are expected before the first user gesture (browsers block audio
 * until interaction). We never alarm the performer for these on cold load.
 */
const SOFT_SOURCES = ['soundAdapter:start', 'interaction:midi'];

function isSoftError(source: string, error: Error): boolean {
  if (SOFT_SOURCES.some((s) => source.startsWith(s))) return true;
  const message = error.message.toLowerCase();
  return (
    message.includes('audio') ||
    message.includes('autoplay') ||
    message.includes('gesture') ||
    message.includes('user activation') ||
    message.includes('not allowed')
  );
}

function resolveMessage(source: string, error: Error): string {
  for (const [prefix, message] of Object.entries(MESSAGES)) {
    if (source.startsWith(prefix)) return message;
  }
  if (error.message.toLowerCase().includes('audio')) {
    return 'Audio is paused until you interact. Press Play to begin.';
  }
  if (error.message.toLowerCase().includes('midi')) {
    return 'MIDI is not available. Use the keyboard or on-screen controls.';
  }
  return 'Something interrupted the instrument. Press Play, or refresh to reset.';
}

/** Mounts a calm, auto-dismissing notice and listens to the runtime event bus. */
export function bindErrorBanner(host: HTMLElement): () => void {
  const banner = document.createElement('div');
  banner.className = 'ps-error-banner';
  banner.id = 'ps-error-banner';
  banner.setAttribute('role', 'status');
  banner.setAttribute('aria-live', 'polite');
  banner.hidden = true;
  banner.innerHTML = `
    <p class="ps-error-banner__text" id="ps-error-banner-text"></p>
    <button type="button" class="btn btn-sm btn-outline-secondary" id="ps-error-banner-dismiss">Dismiss</button>
  `;
  host.appendChild(banner);

  const text = banner.querySelector('#ps-error-banner-text');
  const dismiss = banner.querySelector('#ps-error-banner-dismiss');

  let hasGesture = false;
  let dismissTimer = 0;

  const hide = (): void => {
    if (dismissTimer) window.clearTimeout(dismissTimer);
    dismissTimer = 0;
    banner.hidden = true;
  };

  const onGesture = (): void => {
    hasGesture = true;
  };
  window.addEventListener('pointerdown', onGesture, { once: true });
  window.addEventListener('keydown', onGesture, { once: true });

  dismiss?.addEventListener('click', hide);

  const unsubscribe = eventBus.on('error', ({ source, error }) => {
    const soft = isSoftError(source, error);
    // Browsers expectedly block audio before the first gesture — stay calm.
    if (soft && !hasGesture) return;

    if (text) text.textContent = resolveMessage(source, error);
    banner.hidden = false;

    if (dismissTimer) window.clearTimeout(dismissTimer);
    if (soft) {
      dismissTimer = window.setTimeout(hide, 6000);
    }
  });

  return () => {
    if (dismissTimer) window.clearTimeout(dismissTimer);
    window.removeEventListener('pointerdown', onGesture);
    window.removeEventListener('keydown', onGesture);
    unsubscribe();
    banner.remove();
  };
}
