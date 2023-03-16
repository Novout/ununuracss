import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ununura } from 'vite-plugin-ununura'
import inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    vue(),
    ununura(),
    inspect()
  ],
})