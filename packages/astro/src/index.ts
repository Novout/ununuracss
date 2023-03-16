import type { AstroIntegration } from 'astro'
import { UnunuraResolvableOptions } from 'ununura-shared'
import { resolveOptions } from 'ununura-config'
import { ununura } from 'packages/vite/dist'

export default function ununuraIntegration(def?: UnunuraResolvableOptions): AstroIntegration {
  return {
    name: 'astro-ununura',
    hooks: {
      'astro:config:setup': async ({ updateConfig, injectScript }) => {
        const options = await resolveOptions(def)
        options.specialEnvironment = 'astro'

        // TODO: scoped false and ignore ast loc because astro:build enforce-pre hook problem. It's temporary.
        options.scopedInTemplate = false
        options.forceIgnoreClassLineInTitles = true
        options.hashTitles = false
        options.applyAutoprefixer = false

        updateConfig({
          vite: {
            plugins: [await ununura(options)],
          },
        })

        injectScript('page', 'import "ununura.css";')
      },
    },
  }
}
