/**
 * Integration verification — minimal DS UI + runtime engines.
 */

import { Window } from 'happy-dom';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function click(el: Element | null): void {
  if (!el) throw new Error('Element not found for click');
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

async function main(): Promise<void> {
  const window = new Window({
    url: 'http://localhost:5179/',
    width: 1280,
    height: 800,
  });

  const { document } = window;
  globalThis.window = window as unknown as Window & typeof globalThis.window;
  globalThis.document = document;
  globalThis.localStorage = window.localStorage;
  globalThis.CustomEvent = window.CustomEvent;
  document.documentElement.setAttribute('data-ps-motion-off', '');
  window.matchMedia = () =>
    ({
      matches: true,
      media: '',
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
      onchange: null,
    }) as MediaQueryList;
  globalThis.HTMLElement = window.HTMLElement;
  globalThis.Element = window.Element;
  globalThis.Node = window.Node;
  globalThis.Event = window.Event;
  globalThis.MouseEvent = window.MouseEvent;
  globalThis.KeyboardEvent = window.KeyboardEvent;
  globalThis.customElements = window.customElements;
  globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) =>
    setTimeout(() => cb(Date.now()), 16) as unknown as number) as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = ((id: number) => clearTimeout(id)) as typeof cancelAnimationFrame;

  if (!globalThis.AudioContext) {
    class StubAudioContext {
      state = 'running';
      destination = {};
      sampleRate = 44100;
      currentTime = 0;
      createGain() {
        return { connect: () => undefined, gain: { value: 1 } };
      }
      createOscillator() {
        return { connect: () => undefined, start: () => undefined, stop: () => undefined };
      }
      createBiquadFilter() {
        return { connect: () => undefined, frequency: { value: 440 } };
      }
      resume() {
        return Promise.resolve();
      }
      close() {
        return Promise.resolve();
      }
    }
    // @ts-expect-error stub
    globalThis.AudioContext = StubAudioContext;
    // @ts-expect-error stub
    globalThis.webkitAudioContext = StubAudioContext;
  }

  const origCreateElement = document.createElement.bind(document);
  document.createElement = ((tag: string, options?: ElementCreationOptions) => {
    const el = origCreateElement(tag, options);
    if (tag === 'canvas') {
      const canvas = el as HTMLCanvasElement;
      canvas.width = 800;
      canvas.height = 500;
      canvas.getContext = () =>
        ({
          canvas,
          fillRect: () => undefined,
          clearRect: () => undefined,
          fillText: () => undefined,
          measureText: (text: string) => ({ width: text.length * 8 }),
          fillStyle: '#000',
          font: '12px monospace',
        }) as unknown as CanvasRenderingContext2D;
    }
    return el;
  }) as typeof document.createElement;

  const { createPlantasonicApp } = await import('../src/app/app.ts');
  const { MockSoundAdapter } = await import('./mocks/mockSoundAdapter.ts');
  const { createRuntime } = await import('../src/runtime/createRuntime.ts');
  const { PRESET_WORLDS } = await import('../src/presets/worlds/index.ts');

  const appRoot = document.createElement('div');
  appRoot.id = 'app';
  appRoot.style.width = '1280px';
  appRoot.style.height = '800px';
  document.body.appendChild(appRoot);

  const stage = appRoot.querySelector('#ps-stage');
  if (stage) {
    stage.getBoundingClientRect = () =>
      ({
        width: 800,
        height: 700,
        top: 0,
        left: 0,
        right: 800,
        bottom: 700,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;
  }

  const app = await createPlantasonicApp(appRoot);

  assert(!!document.querySelector('#ps-stage'), 'Stage missing');
  assert(!!document.querySelector('[data-ps-transport-bar]'), 'Transport bar missing');
  assert(!!document.querySelector('#ps-preset-select'), 'Preset select missing');
  assert(!!document.querySelector('[data-ps-midi-toggle]'), 'MIDI toggle missing');
  assert(!!document.querySelector('#ps-status'), 'Status area missing');
  assert(!!document.querySelector('.ps-stage__canvas'), 'Visualizer canvas missing');
  assert(!document.querySelector('[data-ps-app-shell]'), 'Legacy application shell must not render');

  click(document.querySelector('[data-ps-transport="play"]'));
  await new Promise((r) => setTimeout(r, 150));

  const runtime = createRuntime({ soundAdapter: new MockSoundAdapter() });
  await runtime.init({ container: document.querySelector('#ps-stage')! });
  await runtime.setPreset('mold-world');
  assert(runtime.getState().preset === 'mold-world', 'Preset loading must work');

  const presetSelect = document.querySelector<HTMLSelectElement>('#ps-preset-select');
  if (presetSelect) presetSelect.value = 'flow-world';
  presetSelect?.dispatchEvent(new Event('change', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 100));

  await app.destroy();
  await window.close();

  console.info('[verify-integration] All integration checks passed.', {
    worlds: PRESET_WORLDS.length,
    layout: 'minimal-ds-instrument-ui',
  });
}

main().catch((error: unknown) => {
  console.error('[verify-integration] FAILED:', error);
  process.exit(1);
});
