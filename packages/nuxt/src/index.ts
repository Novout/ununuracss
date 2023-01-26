import { addPluginTemplate, defineNuxtModule, isNuxt2 } from '@nuxt/kit'
import type { NuxtPlugin } from '@nuxt/schema'
import { ununura } from 'ununura'
import { UnunuraResolvableOptions } from 'ununura-shared'

export default defineNuxtModule({
  meta: {
    name: 'ununura',
    configKey: 'ununura',
  },
  defaults: {
    // because vue&scoped files recursive in nitro reload
    scopedInTemplate: false,
    specialEnvironment: 'nitro',
    applyAutoprefixer: false,
  } as UnunuraResolvableOptions,
  async setup(options, nuxt) {
    const exportTemplate = isNuxt2() ? 'export default () => {}' : 'export default defineNuxtPlugin(() => {})'

    addPluginTemplate({
      filename: 'ununura.mjs',
      getContents: () => "import 'ununura.css'\n" + exportTemplate,
    })

    if (isNuxt2()) {
      nuxt.hook('app:resolve', (config) => {
        const plugin: NuxtPlugin = { src: 'ununura.mjs', mode: 'client' }
        if (config.plugins) config.plugins.push(plugin)
        else config.plugins = [plugin]
      })
    }

    nuxt.hook('vite:extend', ({ config }) => {
      config.plugins = config.plugins || []
      config.plugins.unshift(...ununura(options))
    })
  },
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    ununura?: UnunuraResolvableOptions
  }
  interface NuxtOptions {
    ununura?: UnunuraResolvableOptions
  }
}
