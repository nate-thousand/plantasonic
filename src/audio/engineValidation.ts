/**
 * Sound engine integration validation helpers.
 */

import { ECOLOGICAL_CONTROLS, presets, validateAllPresets } from 'plantasia-sound-engine';
import type { ControlName, ControlValues } from '@/runtime/types.ts';
import { DEFAULT_CONTROLS } from '@/runtime/types.ts';
import { ecologyToRuntimeControls, runtimeControlToEcological } from './controlMapping.ts';

/** Validates runtime ↔ engine ecological control mapping is a complete bijection. */
export function validateControlMapping(): string[] {
  const issues: string[] = [];
  const mappedEcology = new Set<string>();

  for (const name of Object.keys(DEFAULT_CONTROLS) as ControlName[]) {
    const ecological = runtimeControlToEcological(name);
    if (!ECOLOGICAL_CONTROLS.includes(ecological)) {
      issues.push(`Control "${name}" maps to unknown ecological control "${ecological}"`);
    }
    if (mappedEcology.has(ecological)) {
      issues.push(`Duplicate ecological target "${ecological}" from runtime control "${name}"`);
    }
    mappedEcology.add(ecological);
  }

  if (mappedEcology.size !== ECOLOGICAL_CONTROLS.length) {
    issues.push(
      `Runtime maps ${String(mappedEcology.size)} controls but engine exposes ${String(ECOLOGICAL_CONTROLS.length)} ecological controls`,
    );
  }

  return issues;
}

/** Roundtrips ecology through runtime control names without data loss. */
export function roundtripEcologyControls(values: ControlValues): ControlValues {
  const ecology = {
    bloom: values.bloom,
    mold: values.mold,
    growth: values.density,
    bacteria: values.chaos,
    roots: values.brightness,
  };
  return ecologyToRuntimeControls(ecology);
}

/** Validates bundled engine preset metadata. */
export function validateBundledEnginePresets(): string[] {
  const issues = validateAllPresets([...presets], { strict: false });
  return issues.map((issue) => `[${issue.presetId}] ${issue.field}: ${issue.message}`);
}
