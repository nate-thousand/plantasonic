/** Minimal types for ascii-visual-engine when installed from GitHub source (no dist). */
declare module 'ascii-visual-engine' {
  export class AsciiEngine {
    constructor(options?: Record<string, unknown>);
    mount(container: HTMLElement): void;
    unmount(): void;
    resize(width: number, height: number): void;
    destroy(): void;
    start(): void;
    stop(): void;
    disableKeyboardInput(): void;
    inputPanic(): void;
    setPresetById(id: string): void;
    setControl(name: string, value: number): void;
    setQualityPreset(preset: string): void;
    noteOn(event: { id: number; velocity?: number; intensity?: number; x?: number; y?: number }): void;
    noteOff(event: { id: number }): void;
  }
}
