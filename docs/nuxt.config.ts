export default defineNuxtConfig({
  ssr: false,
  nitro: {
    preset: 'vercel-edge',
  },
  extends: '@nuxt-themes/docus',
})
