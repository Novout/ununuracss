import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ununura } from 'vite-plugin-ununura'
import inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    vue(),
    ununura({
      extend: {
        supporters: {
          fonts: {
            roboto: 'Roboto',
            lato: 'Lato'
          },
          colors: [
            ['primary', '--primary', { type: 'var' }]
          ]
        }
      }
    }),
    inspect()
  ],
})