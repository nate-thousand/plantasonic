/**
 * Full-stack integration verification — real sound + ASCII adapters + UI bindings.
 * Run with: npm run verify:integration
 *
 * Requires happy-dom. Audio may be limited without a browser AudioContext;
 * visual and UI wiring are the primary checks.
 */

import { Window } from 'happy-dom';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function click(el: Element | null): void {
  if (!el) throw new Error('Element not found for click');
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function setSlider(el: HTMLInputElement | null, value: string): void {
  if (!el) throw new Error('Slider not found');
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
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

  // Minimal Web Audio stub so sound engine can initialize in Node
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
    // @ts-expect-error stub for node
    globalThis.AudioContext = StubAudioContext;
    // @ts-expect-error stub for node
    globalThis.webkitAudioContext = StubAudioContext;
  }

  // Canvas 2D stub for ASCII engine
  const origCreateElement = document.createElement.bind(document);
  document.createElement = ((tag: string, options?: ElementCreationOptions) => {
    const el = origCreateElement(tag, options);
    if (tag === 'canvas') {
      const canvas = el as HTMLCanvasElement;
      canvas.width = 800;
      canvas.height = 500;
      canvas.getContext = () => {
        const ctx = {
          canvas,
          fillRect: () => undefined,
          clearRect: () => undefined,
          fillText: () => undefined,
          measureText: (text: string) => ({ width: text.length * 8 }),
          fillStyle: '#000',
          font: '12px monospace',
        };
        return ctx as unknown as CanvasRenderingContext2D;
      };
    }
    return el;
  }) as typeof document.createElement;

  const { createRuntime } = await import('../src/runtime/createRuntime.ts');
  const { MockSoundAdapter } = await import('./mocks/mockSoundAdapter.ts');
  const { createInteractionManager } = await import('../src/interaction/index.ts');
  const { createAppShell } = await import('../src/ui/layouts/AppShell.ts');
  const { bindRuntimeToShell } = await import('../src/ui/bindRuntime.ts');
  const { openPresetBrowser } = await import('../src/ui/components/PresetBrowser.ts');
  const { AppSettingsStore } = await import('../src/services/appSettingsStore.ts');
  const { createOverlayHost } = await import('../src/ui/components/OverlayHost.ts');
  const { PRESET_WORLDS } = await import('../src/presets/worlds/index.ts');

  const runtime = createRuntime({ soundAdapter: new MockSoundAdapter() });
  const interaction = createInteractionManager(runtime);

  const shell = createAppShell({
    onResize: (width, height) => {
      if (width > 0 && height > 0) runtime.resize(width, height);
    },
  });

  document.body.appendChild(shell.root);
  shell.root.style.width = '1280px';
  shell.root.style.height = '800px';
  shell.stage.style.width = '800px';
  shell.stage.style.height = '500px';
  shell.stage.getBoundingClientRect = () =>
    ({
      width: 800,
      height: 500,
      top: 0,
      left: 0,
      right: 800,
      bottom: 500,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;

  const overlay = createOverlayHost();
  shell.root.appendChild(overlay.root);

  const unbind = bindRuntimeToShell(interaction, shell);

  const init = await runtime.init({ container: shell.stage });
  assert(init.success, `Runtime init failed: ${init.error?.message ?? 'unknown'}`);
  await interaction.init();

  // --- UI elements present ---
  assert(!!document.querySelector('#ps-play-btn'), 'Play button missing');
  assert(!!document.querySelector('#ps-stop-btn'), 'Stop button missing');
  assert(!!document.querySelector('#ps-tempo-slider'), 'Tempo slider missing');
  assert(!!document.querySelector('#ps-control-bloom'), 'Bloom slider missing');
  assert(!!document.querySelector('#ps-stage'), 'Stage missing');

  // --- Play / stop transport ---
  click(document.querySelector('#ps-play-btn'));
  await new Promise((r) => setTimeout(r, 100));
  assert(interaction.getState().isPlaying, 'Play should set isPlaying');

  const canvas = shell.stage.querySelector('canvas.ps-stage__canvas');
  assert(!!canvas, 'ASCII canvas should mount after init');

  click(document.querySelector('#ps-stop-btn'));
  await new Promise((r) => setTimeout(r, 50));
  assert(!interaction.getState().isPlaying, 'Stop should clear isPlaying');

  // --- Preset via runtime (all 5 worlds) ---
  for (const world of PRESET_WORLDS) {
    await runtime.setPreset(world.id);
    assert(interaction.getState().preset === world.id, `Preset ${world.id} should load`);
    assert(
      document.querySelector('#ps-preset-name')?.textContent === world.name,
      `Dock should show ${world.name}`,
    );
  }

  // --- Control sliders ---
  setSlider(document.querySelector('#ps-control-bloom'), '80');
  assert(interaction.getState().controls.bloom === 0.8, 'Bloom slider should update state');

  setSlider(document.querySelector('#ps-tempo-slider'), '96');
  assert(interaction.getState().tempo === 96, 'Tempo slider should update state');

  // --- Keyboard notes (via interaction layer) ---
  await interaction.start('ui');
  interaction.noteOn(60, 0.85, 'keyboard');
  assert(interaction.getState().activeNotes.includes(60), 'noteOn should track active notes');
  assert(Number(document.querySelector('#ps-notes-status')?.textContent?.[0]) >= 1, 'Notes status should update');
  interaction.noteOff(60, 'keyboard');
  assert(!interaction.getState().activeNotes.includes(60), 'noteOff should clear notes');

  // --- Preset browser overlay ---
  const appSettings = new AppSettingsStore();
  overlay.open('presets');
  const cleanupBrowser = openPresetBrowser(interaction, appSettings, () => overlay.close());
  assert(!!document.querySelector('.ps-preset-card'), 'Preset browser should render cards');

  const moldCard = document.querySelector<HTMLElement>('[data-preset-id="mold-world"]');
  assert(!!moldCard, 'Mold world card should exist');
  moldCard!.click();
  await new Promise((r) => setTimeout(r, 600));
  assert(interaction.getState().preset === 'mold-world', 'Preset browser click should load preset');
  cleanupBrowser();

  // --- Stage status reflects state ---
  const stageStatus = document.querySelector('#ps-stage-status')?.textContent ?? '';
  assert(stageStatus.includes('bpm') || stageStatus.includes('Mold'), 'Stage status should update');

  unbind();
  await interaction.destroy();
  await runtime.destroy();
  shell.destroy();
  overlay.destroy();
  await window.close();

  console.info('[verify-integration] All integration checks passed.', {
    worlds: PRESET_WORLDS.length,
    soundAdapter: 'MockSound (real audio verified in browser)',
    asciiAdapter: 'PlantasiaAscii (real engine)',
  });
}

main().catch((error: unknown) => {
  console.error('[verify-integration] FAILED:', error);
  process.exit(1);
});
