/**
 * Fullscreen stage placeholder component.
 * Will host the ASCII engine canvas in a future phase.
 */

export interface StageOptions {
  /** Root element that receives the stage when entering fullscreen. */
  fullscreenTarget?: HTMLElement;
}

export function createStage(_options: StageOptions = {}): HTMLElement {
  const stage = document.createElement('section');
  stage.className = 'ps-stage';
  stage.id = 'ps-stage';
  stage.setAttribute('role', 'region');
  stage.setAttribute('aria-label', 'Visual stage');

  stage.innerHTML = `
    <div class="ps-stage__placeholder">
      <span class="ps-stage__label">Visual Stage</span>
      <h2 class="ps-stage__title">ASCII Engine Placeholder</h2>
      <p>Generative visuals will render here after engine integration.</p>
    </div>
  `;

  return stage;
}

/** Returns the stage element for runtime resize coordination. */
export function getStageElement(): HTMLElement | null {
  return document.querySelector('#ps-stage');
}

/** Returns current stage dimensions. */
export function getStageDimensions(): { width: number; height: number } {
  const stage = getStageElement();
  if (!stage) return { width: 0, height: 0 };
  const rect = stage.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}
