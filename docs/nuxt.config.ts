export default defineNuxtConfig({
  ssr: false,
  experimental: {
    payloadExtraction: false,
  },
  extends: '@nuxt-themes/docus',
})
