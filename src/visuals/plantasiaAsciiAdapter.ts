/**
 * ASCII visual adapter — wraps ASCII Visual Engine for the Plantasonic runtime.
 * UI and runtime never import the engine package directly except through this module.
 */

import gsap from 'gsap';
import { AsciiEngine } from 'ascii-visual-engine';
import type { PresetVisualConfig } from '@/presets/types.ts';
import type { ParameterPath, ParameterValue, PresetId } from '@/runtime/types.ts';
import type { ControlName, RuntimeState } from '@/runtime/types.ts';
import { createInitialRuntimeState } from '@/runtime/types.ts';
import { eventBus } from '@/runtime/events.ts';
import type { AsciiAdapter } from './asciiAdapter.ts';
import {
  diffEngineControls,
  pitchToHorizontalPosition,
  pitchToVerticalPosition,
  resolveEngineControls,
} from './language/audioReactiveMapping.ts';
import { resolveQualityForViewport } from './renderer/rendererAbstraction.ts';
import { transitionVisualPreset } from './transitions/visualTransition.ts';
import { VisualProfiler } from './performance/visualProfiler.ts';
import { applyVisualIdentity } from './visualIdentity.ts';

const LOG_PREFIX = '[PlantasiaAscii]';

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
  private engineControlCache: Record<string, number> = {};
  private lastWorldId: PresetId | null = null;
  private lastActiveNotes = new Set<number>();
  private lastVelocity = 0.75;
  private lastState: RuntimeState = createInitialRuntimeState();
  private loadGeneration = 0;
  private readonly profiler = new VisualProfiler();

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
      this.applyResponsiveQuality(this.engine, width, height);

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
    const w = Math.max(1, Math.round(width));
    const h = Math.max(1, Math.round(height));
    try {
      this.applyResponsiveQuality(engine, w, h);
      engine.resize(w, h);
    } catch (error) {
      this.reportError('resize', error, { width: w, height: h });
    }
  }

  async loadPreset(enginePresetId: PresetId, visual?: PresetVisualConfig): Promise<void> {
    const engine = this.requireEngine();
    const generation = ++this.loadGeneration;

    if (this.canvas && typeof gsap.killTweensOf === 'function') {
      gsap.killTweensOf(this.canvas);
    }

    const apply = (): void => {
      engine.setPresetById(enginePresetId);
      if (visual) {
        applyVisualIdentity(engine, visual);
      }
      this.engineControlCache = {};
      if (this.canvas) {
        const rect = this.canvas.getBoundingClientRect();
        this.applyResponsiveQuality(
          engine,
          Math.max(1, Math.round(rect.width)),
          Math.max(1, Math.round(rect.height)),
        );
      }
      console.info(`${LOG_PREFIX} loadPreset`, { enginePresetId, motion: visual?.motion });
    };

    try {
      const target = this.canvas ?? this.placeholder;
      if (target && visual) {
        await transitionVisualPreset(target, apply, {
          style: visual.transition,
          curve: visual.animationCurve,
        });
      } else {
        apply();
      }
      if (generation !== this.loadGeneration) return;
    } catch (error) {
      if (generation !== this.loadGeneration) return;
      this.reportError('loadPreset', error, { enginePresetId });
      throw error instanceof Error ? error : new Error(String(error));
    }
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
        this.syncEngineControls(
          engine,
          resolveEngineControls(this.buildPartialState({ tempo: value })),
        );
        return;
      }

      const controlMatch = /^controls\.(\w+)$/.exec(path);
      if (controlMatch?.[1]) {
        const name = controlMatch[1] as ControlName;
        this.syncEngineControls(
          engine,
          resolveEngineControls(this.buildPartialState({ controls: { [name]: value } })),
        );
      }
    } catch (error) {
      this.reportError('setParameter', error, { path, value });
    }
  }

  applyState(state: Readonly<RuntimeState>): void {
    const engine = this.engine;
    if (!engine) return;

    const start = performance.now();

    if (state.preset !== this.lastWorldId) {
      this.lastWorldId = state.preset;
    }

    this.lastVelocity = state.performance.velocity;
    this.lastState = {
      ...state,
      controls: { ...state.controls },
      activeNotes: [...state.activeNotes],
      performance: { ...state.performance },
    };

    const resolved = resolveEngineControls(state);
    const changed = diffEngineControls(this.engineControlCache, resolved);
    this.syncEngineControls(engine, changed);

    const currentNotes = new Set(state.activeNotes);
    const notesChanged =
      currentNotes.size !== this.lastActiveNotes.size ||
      [...currentNotes].some((note) => !this.lastActiveNotes.has(note));

    if (notesChanged) {
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

    const duration = performance.now() - start;
    this.profiler.recordApplyState(duration, Object.keys(changed).length);
  }

  destroy(): Promise<void> {
    this.profiler.logSummary();
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
    this.engineControlCache = {};
    this.lastWorldId = null;
    this.lastActiveNotes = new Set();
    this.lastVelocity = 0.75;
    this.lastState = createInitialRuntimeState();
    this.profiler.reset();

    return Promise.resolve();
  }

  private requireEngine(): AsciiEngine {
    if (!this.engine) {
      throw new Error('PlantasiaAsciiAdapter not initialized — call init() first');
    }
    return this.engine;
  }

  private syncEngineControls(engine: AsciiEngine, controls: Record<string, number>): void {
    for (const [name, value] of Object.entries(controls)) {
      const clamped = Math.min(1, Math.max(0, value));
      engine.setControl(name, clamped);
      this.engineControlCache[name] = clamped;
    }
  }

  private triggerNoteOn(engine: AsciiEngine, note: number, velocity: number): void {
    const intensity = Math.min(1, Math.max(0, velocity));
    engine.noteOn({
      id: note,
      intensity,
      x: pitchToHorizontalPosition(note),
      y: pitchToVerticalPosition(note),
    });
  }

  private applyResponsiveQuality(engine: AsciiEngine, width: number, height: number): void {
    try {
      const quality = resolveQualityForViewport(width, height);
      engine.setQualityPreset(quality);
    } catch {
      /* quality API optional */
    }
  }

  /** Builds partial state for incremental setParameter updates. */
  private buildPartialState(patch: {
    tempo?: number;
    controls?: Partial<RuntimeState['controls']>;
  }): RuntimeState {
    return {
      ...this.lastState,
      tempo: patch.tempo ?? this.lastState.tempo,
      controls: { ...this.lastState.controls, ...patch.controls },
      activeNotes: [...this.lastState.activeNotes],
      performance: { ...this.lastState.performance },
    };
  }

  private reportError(source: string, error: unknown, context?: Record<string, unknown>): void {
    const err = error instanceof Error ? error : new Error(String(error));
    console.warn(`${LOG_PREFIX} ${source}:`, err.message, context ?? '');
    eventBus.emit('error', { source: `asciiAdapter:${source}`, error: err });
  }
}
