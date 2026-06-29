/**
 * Lightweight visual performance profiler — tracks applyState frequency.
 */

const LOG_PREFIX = '[VisualProfiler]';

function envDevEnabled(): boolean {
  if (typeof import.meta === 'undefined' || !('env' in import.meta)) return false;
  return (import.meta.env as { DEV?: boolean }).DEV === true;
}

export interface VisualProfileSnapshot {
  applyStateCalls: number;
  controlUpdates: number;
  lastApplyMs: number;
  avgApplyMs: number;
}

/** Tracks visual adapter update patterns for performance profiling. */
export class VisualProfiler {
  private applyStateCalls = 0;
  private controlUpdates = 0;
  private applyTimes: number[] = [];
  private lastApplyMs = 0;
  private enabled: boolean;

  constructor(enabled = envDevEnabled()) {
    this.enabled = enabled;
  }

  recordApplyState(durationMs: number, controlCount: number): void {
    if (!this.enabled) return;
    this.applyStateCalls += 1;
    this.controlUpdates += controlCount;
    this.lastApplyMs = durationMs;
    this.applyTimes.push(durationMs);
    if (this.applyTimes.length > 120) {
      this.applyTimes.shift();
    }
  }

  getSnapshot(): VisualProfileSnapshot {
    const avg =
      this.applyTimes.length > 0
        ? this.applyTimes.reduce((a, b) => a + b, 0) / this.applyTimes.length
        : 0;
    return {
      applyStateCalls: this.applyStateCalls,
      controlUpdates: this.controlUpdates,
      lastApplyMs: this.lastApplyMs,
      avgApplyMs: avg,
    };
  }

  logSummary(): void {
    if (!this.enabled) return;
    const snap = this.getSnapshot();
    console.info(`${LOG_PREFIX} summary`, snap);
  }

  reset(): void {
    this.applyStateCalls = 0;
    this.controlUpdates = 0;
    this.applyTimes = [];
    this.lastApplyMs = 0;
  }
}
