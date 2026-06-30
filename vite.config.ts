import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const dsRoot = resolve(__dirname, 'node_modules/plantasonic-design-system');
const asciiRoot = resolve(__dirname, 'node_modules/ascii-visual-engine');
const platformRoot = resolve(__dirname, '../plantasonic-platform');
const platformSdk = resolve(platformRoot, 'packages/sdk/src/index.ts');
const platformTypes = resolve(platformRoot, 'packages/shared-types/src/index.ts');
const platformDemoInstrument = resolve(platformRoot, 'apps/demo/src/instrumentApp.ts');

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@plantasonic/platform': platformSdk,
      '@plantasonic/platform-types': platformTypes,
      '@plantasonic/platform-demo/instrument-app': platformDemoInstrument,
      'plantasonic-design-system/shell': resolve(dsRoot, 'src/shell/index.ts'),
      'plantasonic-design-system/motion': resolve(dsRoot, 'src/motion/index.ts'),
      'plantasonic-design-system/instrument': resolve(dsRoot, 'src/instrument/index.ts'),
      'plantasonic-design-system/components': resolve(dsRoot, 'src/components/index.ts'),
      'plantasonic-design-system/platform/services': resolve(dsRoot, 'src/platform/services.ts'),
      'plantasonic-design-system/platform/engines': resolve(dsRoot, 'src/platform/engines.ts'),
      'plantasonic-design-system/platform/types': resolve(dsRoot, 'src/platform/types.ts'),
      'ascii-visual-engine': resolve(asciiRoot, 'src/index.ts'),
    },
  },
  optimizeDeps: {
    include: ['tone', 'plantasia-sound-engine', 'ascii-visual-engine'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
});
