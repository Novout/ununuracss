import type { AstroIntegration } from 'astro'
import { ununura } from 'ununura'
import { resolvedViteOptions } from 'packages/vite/src/options'
import { UnunuraResolvableOptions } from 'ununura-shared'

export default function ununuraIntegration(def?: UnunuraResolvableOptions): AstroIntegration {
  const options = resolvedViteOptions(def)
  options.specialEnvironment = 'astro'

  // TODO: scoped false and ignore ast loc because astro:build enforce-pre hook problem. It's temporary.
  options.scoped = false
  options.forceIgnoreClassLineInTitles = true

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
