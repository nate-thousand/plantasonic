/**
 * Interaction settings persistence via localStorage.
 */

import type { MidiLearnMapping, VelocityCurve } from '@/interaction/types.ts';
import { createDefaultMidiLearnMappings } from '@/midi/midiMapping.ts';

const STORAGE_KEY = 'plantasonic.interaction.settings';

export interface InteractionSettings {
  midiEnabled: boolean;
  keyboardEnabled: boolean;
  touchEnabled: boolean;
  mouseSensitivity: number;
  touchSensitivity: number;
  velocityCurve: VelocityCurve;
  defaultOctave: number;
  midiChannel: number;
  keyboardVelocity: number;
  midiLearnMappings: MidiLearnMapping[];
}

export const DEFAULT_INTERACTION_SETTINGS: InteractionSettings = {
  midiEnabled: false,
  keyboardEnabled: true,
  touchEnabled: true,
  mouseSensitivity: 1,
  touchSensitivity: 1,
  velocityCurve: 'linear',
  defaultOctave: 4,
  midiChannel: 0,
  keyboardVelocity: 0.75,
  midiLearnMappings: createDefaultMidiLearnMappings(),
};

type SettingsListener = (settings: Readonly<InteractionSettings>) => void;

/** Loads, saves, and notifies interaction settings changes. */
export class SettingsStore {
  private settings: InteractionSettings;
  private readonly listeners = new Set<SettingsListener>();

  constructor() {
    this.settings = this.load();
  }

  getSettings(): Readonly<InteractionSettings> {
    return this.settings;
  }

  update(patch: Partial<InteractionSettings>): void {
    this.settings = { ...this.settings, ...patch };
    this.save();
    this.notify();
  }

  setMidiLearnMappings(mappings: MidiLearnMapping[]): void {
    this.update({ midiLearnMappings: mappings });
  }

  addMidiLearnMapping(mapping: MidiLearnMapping): void {
    const filtered = this.settings.midiLearnMappings.filter(
      (m) => !(m.cc === mapping.cc && m.channel === mapping.channel),
    );
    this.setMidiLearnMappings([...filtered, mapping]);
  }

  resetMidiLearnMappings(): void {
    this.setMidiLearnMappings(createDefaultMidiLearnMappings());
  }

  subscribe(listener: SettingsListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const snapshot = this.getSettings();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }

  private load(): InteractionSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_INTERACTION_SETTINGS };
      const parsed = JSON.parse(raw) as Partial<InteractionSettings>;
      const mappings = parsed.midiLearnMappings;
      return {
        ...DEFAULT_INTERACTION_SETTINGS,
        ...parsed,
        midiLearnMappings:
          mappings && mappings.length > 0 ? mappings : createDefaultMidiLearnMappings(),
      };
    } catch {
      return { ...DEFAULT_INTERACTION_SETTINGS };
    }
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      /* storage unavailable — settings remain in memory */
    }
  }
}
