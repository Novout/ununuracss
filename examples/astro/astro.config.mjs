import { defineConfig } from 'astro/config';;
import ununura from 'astro-ununura'
import inspect from 'vite-plugin-inspect'

export default defineConfig({
  integrations: [ununura()],
  vite: {
    plugins: [inspect()]
  }
});
