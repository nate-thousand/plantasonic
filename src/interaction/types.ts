/**
 * Interaction layer type definitions.
 * All input devices normalize to these types before reaching the runtime.
 */

import type { ControlName, PresetId } from '@/runtime/types.ts';

/** Identifies which input module produced an event. */
export type InteractionSource = 'midi' | 'keyboard' | 'mouse' | 'touch' | 'automation' | 'ui';

/** Normalized actions dispatched to the runtime. */
export type InteractionAction =
  | { type: 'start' }
  | { type: 'stop' }
  | { type: 'noteOn'; note: number; velocity: number }
  | { type: 'noteOff'; note: number }
  | { type: 'setControl'; name: ControlName; value: number }
  | { type: 'setPreset'; presetId: PresetId }
  | { type: 'setTempo'; tempo: number };

/** A normalized interaction event from any input module. */
export interface InteractionEvent {
  action: InteractionAction;
  source: InteractionSource;
  timestamp: number;
}

/** Connection state reported by input modules. */
export interface DeviceConnectionState {
  connected: boolean;
  deviceCount: number;
  label?: string;
}

/** Context passed to interaction modules during init. */
export interface InteractionModuleContext {
  dispatch: (event: InteractionEvent) => void;
  getSettings: () => Readonly<InteractionSettingsSnapshot>;
  /** True when generative transport is running (sound + visual engines started). */
  isPlaying: () => boolean;
  onSettingsChange: (listener: () => void) => () => void;
  updateSettings: (patch: Partial<InteractionSettingsSnapshot>) => void;
}

/** Contract for pluggable input modules. */
export interface InteractionModule {
  readonly id: InteractionSource;
  init(context: InteractionModuleContext): Promise<void> | void;
  destroy(): Promise<void> | void;
  getConnectionState?(): DeviceConnectionState;
}

/** Snapshot of user interaction settings (read-only for modules). */
export interface InteractionSettingsSnapshot {
  midiEnabled: boolean;
  keyboardEnabled: boolean;
  touchEnabled: boolean;
  mouseSensitivity: number;
  touchSensitivity: number;
  velocityCurve: VelocityCurve;
  defaultOctave: number;
  midiChannel: number;
  keyboardVelocity: number;
  midiLearnMappings: readonly MidiLearnMapping[];
}

export type VelocityCurve = 'linear' | 'soft' | 'hard';

/** Target for MIDI Learn mode. */
export type MidiLearnTarget =
  | { type: 'control'; name: ControlName }
  | { type: 'tempo' }
  | { type: 'transport'; action: 'start' | 'stop' };

/** A persisted MIDI CC → runtime target mapping. */
export interface MidiLearnMapping {
  id: string;
  cc: number;
  channel: number;
  target: MidiLearnTarget;
  min?: number;
  max?: number;
}
