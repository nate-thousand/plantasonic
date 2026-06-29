/**
 * MIDI note number ↔ note name helpers for the sound adapter.
 */

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

/** Converts a MIDI note number to a Tone-compatible note name (e.g. 60 → C4). */
export function midiToNoteName(midi: number): string {
  const clamped = Math.max(0, Math.min(127, Math.round(midi)));
  const octave = Math.floor(clamped / 12) - 1;
  const name = NOTE_NAMES[clamped % 12] ?? 'C';
  return `${name}${String(octave)}`;
}
