import { defineConfig } from 'vite'
import { VitePluginFonts as viteFonts } from 'vite-plugin-fonts'
import viteComponents from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import { ununura } from 'ununura'

export default defineConfig({
  plugins: [
    ununura({
      extend: {
        supporters: {
          fonts: [
            ['rubik', 'Rubik'],
            ['quick', 'Quicksand'],
          ],
          units: [['auto', 'none']],
        },
      },
    }),
    vue(),
    viteFonts({
      google: {
        families: ['Rubik', 'Quicksand'],
      },
    }),
    viteComponents({ dts: true }),
  ],
})
