/**
 * Automation hook interface — no implementation in Phase 8.
 * Future integrations: timers, sequencers, scripts, AI agents, external APIs.
 */

import type { InteractionEvent } from '@/interaction/types.ts';

/** Generates runtime events from automated sources. */
export interface AutomationProvider {
  readonly id: string;
  start(dispatch: (event: InteractionEvent) => void): Promise<void> | void;
  stop(): Promise<void> | void;
}

/** Registry for future automation providers. */
export interface AutomationRegistry {
  register(provider: AutomationProvider): void;
  unregister(id: string): void;
  startAll(dispatch: (event: InteractionEvent) => void): Promise<void>;
  stopAll(): Promise<void>;
}

/** Placeholder registry — implementation deferred to a future phase. */
export class NullAutomationRegistry implements AutomationRegistry {
  register(_provider: AutomationProvider): void {
    /* Phase 8 — interface only */
  }

  unregister(_id: string): void {
    /* Phase 8 — interface only */
  }

  async startAll(_dispatch: (event: InteractionEvent) => void): Promise<void> {
    /* Phase 8 — interface only */
  }

  async stopAll(): Promise<void> {
    /* Phase 8 — interface only */
  }
}

export const automationRegistry = new NullAutomationRegistry();
