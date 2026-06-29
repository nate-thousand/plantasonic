/**
 * About and Help info overlays.
 */

import { getOverlayPanel } from './OverlayHost.ts';

export type InfoPanelId = 'about' | 'help';

const PANEL_CONTENT: Record<InfoPanelId, { title: string; body: string }> = {
  about: {
    title: 'About Plantasonic',
    body: `
      <p class="ps-info-panel__lead">An immersive audiovisual instrument — not a DAW, not a dashboard.</p>
      <p>Each world is a complete sonic and visual ecosystem. The ASCII stage is the hero; controls appear when you need them.</p>
      <p class="ps-info-panel__meta">Plantasonic · Generative plantasia ecosystem</p>
    `,
  },
  help: {
    title: 'Help',
    body: `
      <dl class="ps-info-panel__shortcuts">
        <div><dt>A–J</dt><dd>Performance notes</dd></div>
        <div><dt>Enter</dt><dd>Play</dd></div>
        <div><dt>Esc</dt><dd>Stop / close panel</dd></div>
        <div><dt>Space</dt><dd>Sustain</dd></div>
        <div><dt>P</dt><dd>Focus mode</dd></div>
        <div><dt>⌘K / Ctrl+K</dt><dd>Command palette</dd></div>
        <div><dt>/</dt><dd>Command palette</dd></div>
        <div><dt>Z / X</dt><dd>Octave down / up</dd></div>
      </dl>
      <p class="ps-info-panel__hint">Use the transport rail for Sound, Visuals, and Environment. MIDI Learn is on each slider in the inspector.</p>
    `,
  },
};

/** Opens an about or help info panel in the overlay host. */
export function openInfoPanel(id: InfoPanelId, onClose: () => void): () => void {
  const panel = getOverlayPanel();
  if (!panel) return () => undefined;

  const content = PANEL_CONTENT[id];
  panel.setAttribute('aria-labelledby', `ps-info-${id}-title`);
  panel.innerHTML = `
    <header class="ps-overlay-panel__header">
      <h2 id="ps-info-${id}-title" class="ps-overlay-panel__title">${content.title}</h2>
      <button type="button" class="btn btn-sm btn-outline-secondary" id="ps-info-close" aria-label="Close">
        Close
      </button>
    </header>
    <div class="ps-info-panel__body">${content.body}</div>
  `;

  const onCloseClick = (): void => {
    onClose();
  };
  panel.querySelector('#ps-info-close')?.addEventListener('click', onCloseClick);

  return () => {
    panel.querySelector('#ps-info-close')?.removeEventListener('click', onCloseClick);
  };
}
