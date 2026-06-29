/**
 * Fullscreen stage — edge-to-edge visualizer with minimal world HUD.
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
    <div class="ps-stage__hud" id="ps-stage-hud" aria-live="polite">
      <div class="ps-stage__world" id="ps-stage-world">
        <span class="ps-stage__icon" id="ps-stage-icon" aria-hidden="true"></span>
        <div class="ps-stage__world-text">
          <h2 class="ps-stage__title" id="ps-stage-title">Enter a world</h2>
          <p class="ps-stage__mood" id="ps-stage-mood"></p>
        </div>
      </div>
      <p class="ps-stage__status" id="ps-stage-status">Press Play to begin</p>
    </div>
    <div class="ps-stage__placeholder" id="ps-stage-placeholder">
      <span class="ps-stage__label">Audiovisual Instrument</span>
      <p class="ps-stage__hint">Choose a world · Press Play · Explore with A–J</p>
    </div>
  `;

  return stage;
}

/** Updates stage HUD from runtime state. */
export function updateStageStatus(state: Readonly<RuntimeState>): void {
  const title = document.querySelector('#ps-stage-title');
  const mood = document.querySelector('#ps-stage-mood');
  const icon = document.querySelector('#ps-stage-icon');
  const status = document.querySelector('#ps-stage-status');
  const placeholder = document.querySelector('#ps-stage-placeholder');
  const hud = document.querySelector('#ps-stage-hud');
  const world = state.preset ? resolvePresetWorld(state.preset) : undefined;

  if (world) {
    placeholder?.classList.add('ps-stage__placeholder--hidden');
    hud?.classList.add('ps-stage__hud--active');
    if (title) title.textContent = world.name;
    if (mood) mood.textContent = world.identity.mood;
    if (icon) icon.textContent = world.identity.icon;
    hud?.setAttribute('data-world-accent', world.identity.accent);
  } else {
    placeholder?.classList.remove('ps-stage__placeholder--hidden');
    hud?.classList.remove('ps-stage__hud--active');
    if (title) title.textContent = 'Enter a world';
    if (mood) mood.textContent = '';
    if (icon) icon.textContent = '';
  }

  if (status) {
    const mode = state.isPlaying ? 'Live' : 'Idle';
    status.textContent = `${mode} · ${String(state.tempo)} bpm`;
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
