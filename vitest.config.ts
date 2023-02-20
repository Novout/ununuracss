import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    coverage: {
      exclude: ['**/shared/*', 'test/*'],
    },
    testTimeout: 10000,
  },
  optimizeDeps: {
    entries: [],
  },
  resolve: {
    alias: {
      'ununura-engine': resolve(__dirname, './packages/engine/src/'),
      'ununura-vite': resolve(__dirname, './packages/vite/src/'),
      'ununura-nuxt': resolve(__dirname, './packages/nuxt/src/'),
      'ununura-shared': resolve(__dirname, './packages/shared/src/'),
      'ununura-style-tailwindcss': resolve(__dirname, './packages/style-tailwindcss/src/'),
    },
  },
})
