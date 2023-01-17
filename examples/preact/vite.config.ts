import { defineConfig } from 'vite'
import { ununura } from 'ununura'
import preact from '@preact/preset-vite'
import inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [inspect(), ununura({ jsx: true }), preact()],
})
