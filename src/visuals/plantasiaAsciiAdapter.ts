/**
 * ASCII visual adapter — wraps ASCII Visual Engine for the Plantasonic runtime.
 * UI and runtime never import the engine package directly except through this module.
 */

import { AsciiEngine } from 'ascii-visual-engine';
import type { ParameterPath, ParameterValue, PresetId } from '@/runtime/types.ts';
import type { ControlName, RuntimeState } from '@/runtime/types.ts';
import { DEFAULT_CONTROLS } from '@/runtime/types.ts';
import { eventBus } from '@/runtime/events.ts';
import type { AsciiAdapter } from './asciiAdapter.ts';
import { runtimeControlToAsciiControl, tempoToAsciiSpeed } from './visualControlMapping.ts';

const LOG_PREFIX = '[PlantasiaAscii]';

type ControlCache = Record<ControlName, number>;

function createControlCache(controls: RuntimeState['controls'] = DEFAULT_CONTROLS): ControlCache {
  return { ...controls };
}

function noteToVisualPosition(note: number): { x: number; y: number } {
  const pitchClass = note % 12;
  return {
    x: pitchClass / 11,
    y: 0.35 + ((Math.floor(note / 12) - 4) / 8) * 0.3,
  };
}

/** Adapters that receive full runtime state snapshots. */
export interface StateSyncAsciiAdapter extends AsciiAdapter {
  applyState(state: Readonly<RuntimeState>): void;
}

/**
 * Production ASCII adapter — delegates to ASCII Visual Engine.
 */
export class PlantasiaAsciiAdapter implements StateSyncAsciiAdapter {
  private engine: AsciiEngine | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private placeholder: HTMLElement | null = null;
  private controlCache = createControlCache();
  private tempoCache = 72;
  private lastPresetId: PresetId | null = null;
  private lastActiveNotes = new Set<number>();
  private lastVelocity = 0.75;

  init(mount?: HTMLElement): Promise<void> {
    try {
      const stage = mount ?? document.querySelector<HTMLElement>('#ps-stage');
      if (!stage) {
        throw new Error('Visual stage mount element not found');
      }

      this.placeholder = stage.querySelector<HTMLElement>('.ps-stage__placeholder');

      const canvas = document.createElement('canvas');
      canvas.className = 'ps-stage__canvas';
      canvas.setAttribute('aria-hidden', 'true');
      stage.appendChild(canvas);
      this.canvas = canvas;

      if (this.placeholder) {
        this.placeholder.hidden = true;
      }

      const rect = stage.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));

      this.engine = new AsciiEngine({
        canvas,
        width,
        height,
        autoStart: false,
      });
      this.engine.disableKeyboardInput();

      console.info(`${LOG_PREFIX} engine created`, { width, height });
      return Promise.resolve();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.reportError('init', err);
      return Promise.reject(err);
    }
  }

  start(): Promise<void> {
    const engine = this.requireEngine();
    try {
      engine.disableKeyboardInput();
      engine.start();
      console.info(`${LOG_PREFIX} render loop started`);
    } catch (error) {
      this.reportError('start', error);
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    }
    return Promise.resolve();
  }

  stop(): Promise<void> {
    const engine = this.engine;
    if (!engine) return Promise.resolve();
    try {
      engine.inputPanic();
      engine.stop();
    } catch (error) {
      this.reportError('stop', error);
    }
    return Promise.resolve();
  }

  render(): void {
    /* Render loop owned by ASCII Visual Engine */
  }

  resize(width: number, height: number): void {
    const engine = this.engine;
    if (!engine || width <= 0 || height <= 0) return;
    try {
      engine.resize(width, height);
    } catch (error) {
      this.reportError('resize', error, { width, height });
    }
  }

  loadPreset(presetId: PresetId): Promise<void> {
    const engine = this.requireEngine();

    try {
      engine.setPresetById(presetId);
      this.lastPresetId = presetId;
      console.info(`${LOG_PREFIX} loadPreset`, { presetId });
    } catch (error) {
      this.reportError('loadPreset', error, { presetId });
    }
    return Promise.resolve();
  }

  setParameter(path: ParameterPath, value: ParameterValue): void {
    const engine = this.engine;
    if (!engine || typeof value !== 'number') return;

    try {
      if (path === 'note') {
        this.triggerNoteOn(engine, value, this.lastVelocity);
        return;
      }

      if (path === 'noteOff') {
        engine.noteOff({ id: value });
        return;
      }

      if (path === 'tempo') {
        this.applyTempo(engine, value);
        return;
      }

      const controlMatch = /^controls\.(\w+)$/.exec(path);
      if (controlMatch?.[1]) {
        const name = controlMatch[1] as ControlName;
        if (name in DEFAULT_CONTROLS) {
          this.applyControl(engine, name, value);
        }
      }
    } catch (error) {
      this.reportError('setParameter', error, { path, value });
    }
  }

  applyState(state: Readonly<RuntimeState>): void {
    const engine = this.engine;
    if (!engine) return;

    for (const name of Object.keys(DEFAULT_CONTROLS) as ControlName[]) {
      const value = state.controls[name];
      if (this.controlCache[name] !== value) {
        this.applyControl(engine, name, value);
      }
    }

    if (this.tempoCache !== state.tempo) {
      this.applyTempo(engine, state.tempo);
    }

    if (state.preset !== this.lastPresetId && state.preset !== null) {
      this.lastPresetId = state.preset;
    }

    this.lastVelocity = state.performance.velocity;

    const currentNotes = new Set(state.activeNotes);
    for (const note of state.activeNotes) {
      if (!this.lastActiveNotes.has(note)) {
        this.triggerNoteOn(engine, note, state.performance.velocity);
      }
    }
    for (const note of this.lastActiveNotes) {
      if (!currentNotes.has(note)) {
        engine.noteOff({ id: note });
      }
    }
    this.lastActiveNotes = currentNotes;
  }

  destroy(): Promise<void> {
    const engine = this.engine;
    if (engine) {
      try {
        engine.destroy();
      } catch (error) {
        this.reportError('destroy', error);
      }
    }

    this.canvas?.remove();
    if (this.placeholder) {
      this.placeholder.hidden = false;
    }

    this.engine = null;
    this.canvas = null;
    this.placeholder = null;
    this.controlCache = createControlCache();
    this.tempoCache = 72;
    this.lastPresetId = null;
    this.lastActiveNotes = new Set();
    this.lastVelocity = 0.75;

    return Promise.resolve();
  }

  private requireEngine(): AsciiEngine {
    if (!this.engine) {
      throw new Error('PlantasiaAsciiAdapter not initialized — call init() first');
    }
    return this.engine;
  }

  private applyControl(engine: AsciiEngine, name: ControlName, value: number): void {
    const clamped = Math.min(1, Math.max(0, value));
    if (this.controlCache[name] === clamped) return;
    engine.setControl(runtimeControlToAsciiControl(name), clamped);
    this.controlCache[name] = clamped;
  }

  private applyTempo(engine: AsciiEngine, bpm: number): void {
    const tempo = Math.min(300, Math.max(20, Math.round(bpm)));
    if (this.tempoCache === tempo) return;
    engine.setControl('speed', tempoToAsciiSpeed(tempo));
    this.tempoCache = tempo;
  }

  private triggerNoteOn(engine: AsciiEngine, note: number, velocity: number): void {
    const intensity = Math.min(1, Math.max(0, velocity));
    const { x, y } = noteToVisualPosition(note);
    engine.noteOn({ id: note, intensity, x, y });
  }

  private reportError(source: string, error: unknown, context?: Record<string, unknown>): void {
    const err = error instanceof Error ? error : new Error(String(error));
    console.warn(`${LOG_PREFIX} ${source}:`, err.message, context ?? '');
    eventBus.emit('error', { source: `asciiAdapter:${source}`, error: err });
  }
}
