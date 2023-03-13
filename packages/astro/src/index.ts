import type { AstroIntegration } from 'astro'
import { UnunuraResolvableOptions } from 'ununura-shared'
import { ununura, resolvedViteOptions } from 'vite-plugin-ununura'

export default function ununuraIntegration(def?: UnunuraResolvableOptions): AstroIntegration {
  const options = resolvedViteOptions(def)
  options.specialEnvironment = 'astro'

  // TODO: scoped false and ignore ast loc because astro:build enforce-pre hook problem. It's temporary.
  options.scopedInTemplate = false
  options.forceIgnoreClassLineInTitles = true
  options.hashTitles = false

  return {
    name: 'astro-ununura',
    hooks: {
      'astro:config:setup': ({ updateConfig, injectScript }) => {
        updateConfig({
          vite: {
            plugins: [ununura(options)],
          },
        })

        injectScript('page', 'import "ununura.css";')
      },
    },
  }
}
