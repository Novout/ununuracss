import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { ununura } from 'vite-plugin-ununura'
import inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ununura(), svelte(), inspect()],
})
