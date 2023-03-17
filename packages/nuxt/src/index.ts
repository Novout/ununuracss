import { addPluginTemplate, defineNuxtModule, isNuxt2 } from '@nuxt/kit'
import type { NuxtPlugin } from '@nuxt/schema'
import { resolveOptions } from 'packages/config/dist'
import { ununura } from 'packages/vite/dist'
import { UnunuraResolvableOptions } from 'ununura-shared'

export default defineNuxtModule({
  meta: {
    name: 'ununura',
    configKey: 'ununura',
  },
  defaults: {
    // TODO: because vue&scoped files recursive in nitro reload will disabled scoped sfc.
    scopedInTemplate: false,
    specialEnvironment: 'nitro',
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

    nuxt.hook('vite:extend', async ({ config }) => {
      config.plugins = config.plugins || []
      config.plugins.unshift(await ununura(options))
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
