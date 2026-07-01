import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 4173,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
