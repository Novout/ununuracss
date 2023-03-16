import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ununura } from '../../packages/plugin-vite/dist'
import inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    vue(),
    ununura(),
    inspect()
  ],
})