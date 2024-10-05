import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      exclude: [
        ...configDefaults.exclude,
        './eslint.config.js',
        './vite.config.js',
        './vitest.config.js',
      ],
    },
  },
  plugins: [react()],
});