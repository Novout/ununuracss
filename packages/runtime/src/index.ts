import { resolvedViteOptions } from 'vite-plugin-ununura'
import { initRuntime } from 'ununura-engine'
import { UnunuraResolvableOptions } from 'ununura-shared'

declare global {
  interface Window {
    __UNUNURA__?: UnunuraResolvableOptions
  }
}

;(() => {
  const ununura = resolvedViteOptions(window.__UNUNURA__ ?? {})
  ununura.applyAutoprefixer = false
  ununura.scopedInTemplate = false
  ununura.specialEnvironment = 'runtime'

  initRuntime(ununura)
})()
