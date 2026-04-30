import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/codemirror-editor-app/',
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  worker: {
    format: 'es',
  },
  optimizeDeps: {
    exclude: ['pyodide'],
  },
  server: {
    headers: {
      // Nötig für Web Worker + SharedArrayBuffer (Pyodide braucht das)
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['**/node_modules/**', 'e2e/**'],
  },
});
