export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
  typescript: {
    includeWorkspace: true,
  },
  ssr: false,
  experimental: {
    payloadExtraction: false,
  },
  extends: '@nuxt-themes/docus',
})
