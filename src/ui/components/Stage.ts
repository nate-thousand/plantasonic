/**
 * Fullscreen stage placeholder with runtime status overlay.
 */

import { resolvePresetWorld } from '@/presets/registry.ts';
import type { RuntimeState } from '@/runtime/types.ts';

export interface StageOptions {
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
      <h2 class="ps-stage__title" id="ps-stage-title">ASCII Engine Placeholder</h2>
      <p id="ps-stage-status">Awaiting preset</p>
      <p class="ps-stage__hint small">Keyboard: A–J notes · Z/X octave · Space sustain · Enter/Esc transport</p>
    </div>
  `;

  return stage;
}

/** Updates stage status text from runtime state. */
export function updateStageStatus(state: Readonly<RuntimeState>): void {
  const title = document.querySelector('#ps-stage-title');
  const status = document.querySelector('#ps-stage-status');
  const world = state.preset ? resolvePresetWorld(state.preset) : undefined;

  if (title) {
    title.textContent = world?.name ?? 'Visual Stage';
  }
  if (status) {
    const mode = state.isPlaying ? 'Running' : 'Idle';
    const notes =
      state.activeNotes.length > 0
        ? `${String(state.activeNotes.length)} notes active`
        : 'No input';
    const transport = `${mode} · ${String(state.tempo)} bpm · ${notes}`;
    status.textContent = world ? `${world.description} — ${transport}` : transport;
  }
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
