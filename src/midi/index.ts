/**
 * Web MIDI input layer.
 */

export { MidiModule, setMidiLearnBridge } from './midiModule.ts';
export { applyCcMapping, DEFAULT_MPK_MINI_CC_HINTS, findCcMapping } from './midiMapping.ts';
export type { MidiLearnTarget } from './midiMapping.ts';
export { parseMidiMessage, pitchBendToBrightness, routeParsedMidiMessage } from './midiMessage.ts';
export type { ParsedMidiMessage, MidiMessageRouterState } from './midiMessage.ts';
