/**
 * Integration verification — platform instrument shell + preset worlds.
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
    url: 'http://localhost:5173/',
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

  if (!globalThis.ResizeObserver) {
    class StubResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    // @ts-expect-error stub
    globalThis.ResizeObserver = StubResizeObserver;
  }

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

  const { createPlantasonicPlatformApp } = await import('../src/platform-consumer/bootstrap.ts');
  const { PRESET_WORLDS } = await import('../src/presets/worlds/index.ts');
  const { PLANTASONIC_PRESET_BUNDLES } = await import(
    '../src/platform-consumer/content/presetBundles.ts'
  );

  const appRoot = document.createElement('div');
  appRoot.id = 'app';
  appRoot.style.width = '1280px';
  appRoot.style.height = '800px';
  document.body.appendChild(appRoot);

  const app = await createPlantasonicPlatformApp(appRoot);

  assert(!!document.querySelector('[data-ps-region="stage"]'), 'Stage region missing');
  assert(!!document.querySelector('[data-ps-region="transport"]'), 'Transport region missing');
  assert(!!document.querySelector('[data-ps-region="browser"]'), 'Preset browser region missing');
  assert(!!document.querySelector('[data-ps-transport-bar]'), 'Design System transport bar missing');
  assert(!!document.querySelector('[data-demo-event-log]'), 'Platform event log missing');
  assert(!!document.querySelector('[data-demo-project-save]'), 'Project save control missing');
  assert(!!document.querySelector('[data-demo-project-load]'), 'Project load control missing');
  assert(!document.querySelector('#ps-preset-select'), 'Legacy preset select must not render');
  assert(!document.querySelector('.ps-instrument-ui'), 'Legacy instrument UI must not render');

  const playButton = document.querySelector('[data-ps-transport="play"]');
  if (playButton) click(playButton);
  await new Promise((r) => setTimeout(r, 200));

  const bundleButtons = document.querySelectorAll('[data-demo-bundle]');
  assert(bundleButtons.length >= PRESET_WORLDS.length, 'Preset bundle buttons must list all worlds');

  assert(
    PLANTASONIC_PRESET_BUNDLES.length === PRESET_WORLDS.length,
    'All worlds must convert to PresetBundle entries',
  );

  app.stop();
  await window.close();

  console.info('[verify-integration] Platform integration checks passed.', {
    worlds: PRESET_WORLDS.length,
    layout: 'platform-instrument-shell',
  });
}

main().catch((error: unknown) => {
  console.error('[verify-integration] FAILED:', error);
  process.exit(1);
});
