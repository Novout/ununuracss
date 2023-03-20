import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    coverage: {
      provider: 'c8',
    },
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'shared', 'website'],
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
      'ununura-font-stacks': resolve(__dirname, './packages/font-stacks/src/'),
      'ununura-style-tailwindcss': resolve(__dirname, './packages/style-tailwindcss/src/'),
    },
  },
})
