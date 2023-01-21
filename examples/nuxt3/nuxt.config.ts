export default defineNuxtConfig({
  modules: [
    'ununura-nuxt'
  ],
  ununura: {
    extend: {  
      supporters: { 
        colors: [
          ['primary', '#00FF00']
        ]
      }
    }
  }
})
