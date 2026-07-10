import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        home: resolve(import.meta.dirname, 'home/index.html'),
        adm: resolve(import.meta.dirname, 'adm/index.html'),
      },
    },
  },
});
