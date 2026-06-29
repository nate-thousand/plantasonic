/**
 * Fullscreen stage placeholder with runtime status overlay.
 */

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
      <p class="ps-stage__hint small">Press keys A–G to send demo notes when playing</p>
    </div>
  `;

  return stage;
}

/** Updates stage status text from runtime state. */
export function updateStageStatus(state: Readonly<RuntimeState>): void {
  const title = document.querySelector('#ps-stage-title');
  const status = document.querySelector('#ps-stage-status');

  if (title) {
    title.textContent = state.preset ? `Preset: ${state.preset}` : 'ASCII Engine Placeholder';
  }
  if (status) {
    const mode = state.isPlaying ? 'Running' : 'Idle';
    const notes =
      state.activeNotes.length > 0
        ? `${String(state.activeNotes.length)} notes active`
        : 'No input';
    status.textContent = `${mode} · ${String(state.tempo)} bpm · ${notes}`;
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

/** Demo keyboard note mapping (A–G → MIDI 60–66). */
export function bindStageKeyboard(runtime: {
  noteOn: (n: number, v?: number) => void;
  noteOff: (n: number) => void;
}): () => void {
  const keyMap: Record<string, number> = {
    a: 60,
    s: 62,
    d: 64,
    f: 65,
    g: 67,
    h: 69,
    j: 71,
  };
  const activeKeys = new Set<string>();

  const onKeyDown = (e: KeyboardEvent): void => {
    if (e.repeat || e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
      return;
    }
    const note = keyMap[e.key.toLowerCase()];
    if (note === undefined || activeKeys.has(e.key)) return;
    activeKeys.add(e.key);
    runtime.noteOn(note, 0.75);
  };

  const onKeyUp = (e: KeyboardEvent): void => {
    const note = keyMap[e.key.toLowerCase()];
    if (note === undefined) return;
    activeKeys.delete(e.key);
    runtime.noteOff(note);
  };

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  };
}
