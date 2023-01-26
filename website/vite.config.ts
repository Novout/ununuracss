import { defineConfig } from 'vite'
import { VitePluginFonts as viteFonts } from 'vite-plugin-fonts'
import viteComponents from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import markdown from 'vite-plugin-vue-markdown'
import { ununura } from 'ununura'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
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
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    markdown({
      headEnabled: true,
    }),
    viteFonts({
      google: {
        families: ['Rubik', 'Quicksand'],
      },
    }),
    viteComponents({
      extensions: ['vue', 'md'],
      dts: true,
    }),
  ],
})
