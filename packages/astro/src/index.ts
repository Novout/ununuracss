import type { AstroIntegration } from 'astro'
import { ununura } from 'vite-plugin-ununura'
import { resolvedViteOptions } from 'packages/vite/src/options'
import { UnunuraResolvableOptions } from 'ununura-shared'

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
      'astro:config:setup': async ({ updateConfig, injectScript }) => {
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
