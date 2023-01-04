import { addPluginTemplate, defineNuxtModule, isNuxt2 } from '@nuxt/kit'
import type { NuxtPlugin } from '@nuxt/schema'
import ununura from 'ununura'

export default defineNuxtModule({
  meta: {
    name: 'ununuracss',
    configKey: 'ununuracss',
  },
  async setup(_, nuxt) {
    const exportTemplate = isNuxt2() ? 'export default () => {}' : 'export default defineNuxtPlugin(() => {})'

    addPluginTemplate({
      filename: 'ununuracss.mjs',
      getContents: () => "import 'ununura.css'\n" + exportTemplate,
    })

    if (isNuxt2()) {
      nuxt.hook('app:resolve', (config) => {
        const plugin: NuxtPlugin = { src: 'ununuracss.mjs', mode: 'client' }
        if (config.plugins) config.plugins.push(plugin)
        else config.plugins = [plugin]
      })
    }

    nuxt.hook('vite:extend', ({ config }) => {
      config.plugins = config.plugins || []
      config.plugins.unshift(...ununura())
    })
  },
})
