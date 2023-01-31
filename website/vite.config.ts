import { defineConfig } from 'vite'
import { VitePluginFonts as viteFonts } from 'vite-plugin-fonts'
import viteComponents from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import markdown from 'vite-plugin-vue-markdown'
import { VitePWA as vitePWA } from 'vite-plugin-pwa'
import { resolve } from 'pathe'
import fg from 'fast-glob'
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
    vitePWA({
      base: '/',
      registerType: 'autoUpdate',
      includeAssets: fg.sync('**/*.{png,svg,json,ico,txt,xml,ttf}', { cwd: resolve(__dirname, 'public') }),
      manifest: {
        name: 'UnunuraCSS',
        short_name: 'Ununura',
        description: 'A Simplified Atomic CSS Engine.',
        theme_color: '#888888',
        categories: ['atomic css', 'css', 'engine'],
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: "any maskable"
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: "any maskable"
          }
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 3145728000,
        sourcemap: false,
        globPatterns: ['**/*.{css,js,html,ico,txt,woff2,ttf,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
            }
          }
        ]
      }
    })
  ],
})
