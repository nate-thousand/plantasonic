/**
 * Generative system validation helpers.
 */

import { DEFAULT_ECOLOGY_STATE, ECOLOGICAL_CONTROLS, Generator } from 'plantasia-sound-engine';

type GenerativePreferences = ConstructorParameters<typeof Generator>[0];
import { DEFAULT_CONTROLS, type ControlName } from '@/runtime/types.ts';
import { runtimeControlsToEcology } from './controlMapping.ts';
import { GENERATIVE_CONTROL_EFFECTS, GENERATIVE_EVENT_KINDS } from './generativeMapping.ts';
import { validateControlMapping } from './engineValidation.ts';

export const TEST_GENERATIVE_PREFERENCES: GenerativePreferences = {
  preferredScale: ['C4', 'D4', 'E4', 'G4', 'A4'],
  preferredTempo: 72,
  preferredDensity: 0.42,
  phraseLength: 4,
  probabilityBias: 0.38,
  dronePreference: 0.12,
  harmonyStyle: 'pentatonic',
  rhythmStyle: 'moderate',
};

/** Ensures every runtime control documents a generative effect and maps to ecology. */
export function validateGenerativeControlCoverage(): string[] {
  const issues = [...validateControlMapping()];

  for (const effect of GENERATIVE_CONTROL_EFFECTS) {
    const ecology = runtimeControlsToEcology({
      ...DEFAULT_CONTROLS,
      [effect.runtime]: 0.75,
    });
    const expected = ecology[effect.ecological];
    if (expected !== 0.75) {
      issues.push(`Generative mapping mismatch for "${effect.runtime}" → "${effect.ecological}"`);
    }
  }

  if (GENERATIVE_CONTROL_EFFECTS.length !== ECOLOGICAL_CONTROLS.length) {
    issues.push(
      `Generative mapping covers ${String(GENERATIVE_CONTROL_EFFECTS.length)} controls; engine exposes ${String(ECOLOGICAL_CONTROLS.length)}`,
    );
  }

  for (const name of Object.keys(DEFAULT_CONTROLS) as ControlName[]) {
    const documented = GENERATIVE_CONTROL_EFFECTS.some((effect) => effect.runtime === name);
    if (!documented) {
      issues.push(`Missing generative documentation for runtime control "${name}"`);
    }
  }

  return issues;
}

/** Confirms Generator ecology updates propagate to internal state. */
export function generatorAcceptsEcologyUpdates(): boolean {
  const generator = new Generator(TEST_GENERATIVE_PREFERENCES, {
    noteOn: () => undefined,
    noteOff: () => undefined,
  });

  generator.setEcology({ growth: 0.2, bacteria: 0.1 });
  const low = generator.getEcology();
  generator.setEcology({ growth: 0.9, bacteria: 0.8 });
  const high = generator.getEcology();

  generator.dispose();

  return high.growth > low.growth && high.bacteria > low.bacteria;
}

/** Validates generative event kind catalog matches engine contract. */
export function validateGenerativeEventKinds(): string[] {
  const issues: string[] = [];
  for (const kind of GENERATIVE_EVENT_KINDS) {
    if (!kind.trim()) {
      issues.push(`Invalid generative event kind: "${kind}"`);
    }
  }
  if (new Set(GENERATIVE_EVENT_KINDS).size !== GENERATIVE_EVENT_KINDS.length) {
    issues.push('Duplicate generative event kinds in catalog');
  }
  return issues;
}

/** Roundtrips runtime controls into ecology for generative routing. */
export function runtimeControlsReachEcology(): boolean {
  const ecology = runtimeControlsToEcology({
    bloom: 0.7,
    mold: 0.3,
    density: 0.55,
    chaos: 0.4,
    brightness: 0.6,
  });
  return (
    ecology.bloom === 0.7 &&
    ecology.mold === 0.3 &&
    ecology.growth === 0.55 &&
    ecology.bacteria === 0.4 &&
    ecology.roots === 0.6
  );
}

/** Ecology extremes used by rhythm timing tests in verify-generative. */
export function ecologyRhythmFixtures(): {
  grounded: typeof DEFAULT_ECOLOGY_STATE;
  open: typeof DEFAULT_ECOLOGY_STATE;
  sparse: typeof DEFAULT_ECOLOGY_STATE;
  dense: typeof DEFAULT_ECOLOGY_STATE;
} {
  return {
    grounded: { ...DEFAULT_ECOLOGY_STATE, roots: 0.95, bloom: 0.05 },
    open: { ...DEFAULT_ECOLOGY_STATE, roots: 0.05, bloom: 0.95 },
    sparse: { ...DEFAULT_ECOLOGY_STATE, growth: 0.05, roots: 0.8 },
    dense: { ...DEFAULT_ECOLOGY_STATE, growth: 0.95, roots: 0.1 },
  };
}
