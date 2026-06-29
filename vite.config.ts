import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const dsRoot = resolve(__dirname, 'node_modules/plantasonic-design-system');

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'plantasonic-design-system/shell': resolve(dsRoot, 'src/shell/index.ts'),
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
