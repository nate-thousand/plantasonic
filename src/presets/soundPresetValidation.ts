/**
 * Preset validation — ensures worlds map to loadable, distinct engine presets.
 */

import {
  getPresetById,
  presets as enginePresets,
  resolvePresetToSpecies,
  validateAllPresets,
  type PlantasiaPreset,
} from 'plantasia-sound-engine';
import type { ControlValues } from './controls.ts';
import { mergeWorldDefaults } from './registry.ts';
import type { PresetWorld } from './types.ts';
import { PRESET_WORLDS } from './worlds/index.ts';

export interface PresetValidationIssue {
  worldId?: string;
  presetId?: string;
  field: string;
  message: string;
}

/** Fingerprint of merged runtime controls + tempo for a world. */
export function worldControlsFingerprint(world: PresetWorld): string {
  const resolution = resolvePresetToSpecies(world.sound.presetId);
  const engineControls = ecologyToRuntime(resolution.ecology);
  const { controls, tempo } = mergeWorldDefaults(world, engineControls);
  return [
    world.sound.presetId,
    resolution.speciesId,
    tempo,
    ...(['bloom', 'mold', 'density', 'chaos', 'brightness'] as const).map((name) =>
      controls[name].toFixed(3),
    ),
  ].join('|');
}

/** Fingerprint of v1 synth settings for engine-level differentiation checks. */
export function synthSettingsFingerprint(preset: PlantasiaPreset): string {
  const { synth } = preset;
  return [
    synth.oscillator,
    synth.filterHz,
    synth.filterQ ?? 0,
    synth.envelope.attack,
    synth.envelope.release,
    synth.effects.delay,
    synth.effects.reverb,
    synth.drift ?? 0,
    synth.chorus ?? 0,
  ]
    .map((v) => String(v))
    .join('|');
}

/** Validates all bundled engine presets and registered Plantasonic worlds. */
export function validatePresetWorlds(
  worlds: readonly PresetWorld[] = PRESET_WORLDS,
): PresetValidationIssue[] {
  const issues: PresetValidationIssue[] = [];

  const engineIssues = validateAllPresets([...enginePresets], { strict: false });
  for (const issue of engineIssues) {
    issues.push({
      presetId: issue.presetId,
      field: issue.field,
      message: issue.message,
    });
  }

  const controlFingerprints = new Map<string, string>();
  const soundPresetIds = new Set<string>();
  const speciesByWorld = new Map<string, string>();

  for (const world of worlds) {
    const presetId = world.sound.presetId;

    try {
      resolvePresetToSpecies(presetId);
    } catch (error) {
      issues.push({
        worldId: world.id,
        presetId,
        field: 'sound.presetId',
        message: error instanceof Error ? error.message : String(error),
      });
      continue;
    }

    const preset = getPresetById(presetId);
    if (!preset) {
      issues.push({
        worldId: world.id,
        presetId,
        field: 'sound.presetId',
        message: `Engine preset not found: ${presetId}`,
      });
      continue;
    }

    const fp = worldControlsFingerprint(world);
    const existing = controlFingerprints.get(fp);
    if (existing) {
      issues.push({
        worldId: world.id,
        field: 'defaults',
        message: `Nearly identical controls to ${existing} — worlds should sound distinct`,
      });
    } else {
      controlFingerprints.set(fp, world.id);
    }

    if (soundPresetIds.has(presetId)) {
      issues.push({
        worldId: world.id,
        presetId,
        field: 'sound.presetId',
        message: `Duplicate engine preset — ${presetId} is already used by another world`,
      });
    }
    soundPresetIds.add(presetId);

    const species = resolvePresetToSpecies(presetId).speciesId;
    const otherWorld = speciesByWorld.get(species);
    if (otherWorld && otherWorld !== world.id) {
      const otherPreset = worlds.find((w) => w.id === otherWorld)?.sound.presetId;
      if (otherPreset === presetId) {
        issues.push({
          worldId: world.id,
          field: 'sound.presetId',
          message: `Shares species and preset with ${otherWorld}`,
        });
      }
    }
    speciesByWorld.set(species, world.id);
  }

  return issues;
}

/** Returns engine preset ids referenced by worlds plus all bundled presets. */
export function listBundledEnginePresetIds(): readonly string[] {
  return enginePresets.map((p) => p.id);
}

function ecologyToRuntime(
  ecology: ReturnType<typeof resolvePresetToSpecies>['ecology'],
): ControlValues {
  return {
    bloom: ecology.bloom,
    mold: ecology.mold,
    density: ecology.growth,
    chaos: ecology.bacteria,
    brightness: ecology.roots,
  };
}
