import path from 'node:path';
import process from 'node:process';
import unoCssPlugin from 'unocss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [
    unoCssPlugin(),
    solidPlugin(),
  ],
  define: {
    // package.json version
    'import.meta.env.VITE_ENCLOSED_VERSION': JSON.stringify(process.env.npm_package_version),
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
      },
    },
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    exclude: [...configDefaults.exclude, '**/*.e2e.test.ts'],
  },
});
